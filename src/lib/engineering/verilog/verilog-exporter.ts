import type {
  CatalogBinding,
  EngineeringDrawingEdge,
  EngineeringDrawingNode,
  EngineeringEdge,
  EngineeringNode,
  EngineeringProjectDraft,
  EngineeringVerilogBinding,
} from '../graph'

export interface EngineeringVerilogExport {
  source: string
  bindings: EngineeringVerilogBinding[]
  mcpControlManifest: {
    schemaVersion: 1
    graphId: string
    commands: Array<{
      name: string
      target: 'node' | 'edge' | 'drawing-node' | 'catalog-binding'
      writes: string[]
    }>
  }
}

/** Grid units → mm: 1 cell = 25mm */
const GRID_TO_MM = 25

/** Conductor kinds whose characters are illegal in identifiers get stable tokens */
const CONDUCTOR_TO_WIRE_TOKEN: Record<string, string> = {
  'DC+': 'DCp',
  'DC-': 'DCm',
}

function verilogId(value: string) {
  const clean = value.replace(/[^a-zA-Z0-9_]/g, '_')
  return /^[a-zA-Z_]/.test(clean) ? clean : `n_${clean}`
}

function escapeString(value: string) {
  return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
}

function nodeModuleName(node: EngineeringNode) {
  return `el_${verilogId(node.type)}`
}

function nodeInstanceName(node: EngineeringNode) {
  return verilogId(node.id)
}

function edgeWireName(edge: EngineeringEdge) {
  const kind = edge.conductor ?? edge.type ?? 'power'
  const token = CONDUCTOR_TO_WIRE_TOKEN[kind] ?? kind
  return `w_${verilogId(edge.id)}_${verilogId(token)}`
}

function edgeCommentTail(edge: EngineeringEdge) {
  const pairs: string[] = []
  if (edge.conductor) pairs.push(`conductor=${edge.conductor}`)
  if (edge.type) pairs.push(`type=${edge.type}`)
  if (edge.sourceTermination) pairs.push(`sterm=${edge.sourceTermination}`)
  if (edge.targetTermination) pairs.push(`tterm=${edge.targetTermination}`)
  return pairs.length > 0 ? `, ${pairs.join(', ')}` : ''
}

function catalogForNode(node: EngineeringNode, bindings: CatalogBinding[]) {
  return bindings.find((binding) => binding.nodeId === node.id)
}

function nodeParams(
  node: EngineeringNode,
  binding: CatalogBinding | undefined,
  drawingNode: EngineeringDrawingNode | undefined,
) {
  const props = node.properties
  const params = [
    `.NODE_ID("${escapeString(node.id)}")`,
    `.LABEL("${escapeString(node.label)}")`,
  ]

  // Only defined properties are serialized — absent values must round-trip as absent,
  // not as zeros/empty strings.
  const num = (key: string, value: unknown) => {
    if (typeof value === 'number' && Number.isFinite(value)) params.push(`.${key}(${value})`)
  }
  const str = (key: string, value: unknown) => {
    if (typeof value === 'string' && value.trim()) params.push(`.${key}("${escapeString(value)}")`)
  }
  const bool = (key: string, value: unknown) => {
    if (typeof value === 'boolean') params.push(`.${key}(${value ? 1 : 0})`)
  }

  num('CURRENT_A', props.currentA)
  num('POWER_W', props.powerW)
  num('VOLTAGE_V', props.voltageV)
  num('SECTION_MM2', props.sectionMm2)
  num('ROUTE_M', props.routeLengthM)
  num('MODULES', props.modules)
  num('PHASE', props.phase)
  num('CORES', props.cores)
  num('LEAKAGE_MA', props.leakageMa)
  num('ATS_POLES', props.atsPoles)
  str('NAME', props.name)
  str('KIND', props.kind)
  str('POLES', props.poles)
  str('MATERIAL', props.material)
  str('CURVE', props.curve)
  str('AREA_ZONE', props.areaZone)
  str('NEUTRAL_MODE', props.neutralMode)
  str('STRAND_TYPE', props.strandType)
  str('INSTALL_METHOD', props.installationMethod)
  str('ATS_NEUTRAL_POLICY', props.atsNeutralPolicy)
  bool('SWITCHES_NEUTRAL', props.switchesNeutral)
  bool('REQUIRES_FERRULE', props.requiresFerrule)

  // Drawing coordinates (grid units → mm: 1 cell = 25mm)
  if (drawingNode) {
    params.push(`.X_MM(${drawingNode.x * GRID_TO_MM})`)
    params.push(`.Y_MM(${drawingNode.y * GRID_TO_MM})`)
  }

  if (binding) {
    params.push(`.PRODUCT_ID("${escapeString(binding.productId)}")`)
    params.push(`.SKU("${escapeString(binding.sku)}")`)
    params.push(`.PRICE(${typeof binding.price === 'number' && Number.isFinite(binding.price) ? binding.price : 0})`)
    if (typeof binding.stock === 'number' && Number.isFinite(binding.stock)) {
      params.push(`.STOCK(${binding.stock})`)
    }
  }

  return params.join(', ')
}

function formatRoute(waypoints: Array<{ x: number; y: number }>) {
  return waypoints.map((p) => `(${p.x * GRID_TO_MM},${p.y * GRID_TO_MM})`).join(', ')
}

export function exportEngineeringProjectVerilog(draft: EngineeringProjectDraft): EngineeringVerilogExport {
  const graph = draft.graph
  const bindings: EngineeringVerilogBinding[] = []

  // Build drawing lookups for coordinate/route export
  const drawingByNodeId = new Map<string, EngineeringDrawingNode>()
  for (const dn of draft.drawing.nodes) {
    drawingByNodeId.set(dn.nodeId, dn)
  }
  const drawingByEdgeId = new Map<string, EngineeringDrawingEdge>()
  for (const de of draft.drawing.edges) {
    drawingByEdgeId.set(de.edgeId, de)
  }

  const lines: string[] = [
    '// Electronom EngineeringGraph Verilog bridge v2.2',
    `// graphId=${graph.id}`,
    `// draftId=${draft.id}`,
    `// name: ${draft.name}`,
    `// locale: ${graph.locale}`,
    `// network: phase=${graph.network.phase}, voltage_v=${graph.network.voltageV}, input_a=${graph.network.inputBreakerA}, earthing=${graph.network.earthingSystem}`,
    `// canvas: ${draft.drawing.canvas.cols * GRID_TO_MM}x${draft.drawing.canvas.rows * GRID_TO_MM}`,
    '// This source is a control/binding layer, not a safety bypass.',
    `module electronom_project_${verilogId(graph.id)};`,
    '',
  ]

  for (const edge of graph.edges) {
    const wireName = edgeWireName(edge)
    bindings.push({ symbol: wireName, kind: 'edge', edgeId: edge.id })
    lines.push(`  // edge ${edge.id}: ${edge.source} -> ${edge.target}${edgeCommentTail(edge)}`)
    const route = drawingByEdgeId.get(edge.id)?.waypoints
    if (route && route.length > 0) {
      lines.push(`  // route: [${formatRoute(route)}]`)
    }
    lines.push(`  wire ${wireName};`)
  }

  if (graph.edges.length > 0) lines.push('')

  for (const node of graph.nodes) {
    const binding = catalogForNode(node, graph.catalogBindings)
    const drawingNode = drawingByNodeId.get(node.id)
    const symbol = nodeInstanceName(node)
    bindings.push({ symbol, kind: 'node', nodeId: node.id })
    if (binding) {
      bindings.push({
        symbol: `product_${verilogId(binding.productId)}`,
        kind: 'catalog-product',
        nodeId: node.id,
        productId: binding.productId,
        sku: binding.sku,
      })
    }
    lines.push(`  // node ${node.id}: type=${node.type}${binding ? `, productId=${binding.productId}, sku=${binding.sku}` : ''}`)
    lines.push(`  ${nodeModuleName(node)} #(${nodeParams(node, binding, drawingNode)}) ${symbol} ();`)
  }

  lines.push('')
  lines.push('endmodule')

  return {
    source: lines.join('\n'),
    bindings,
    mcpControlManifest: {
      schemaVersion: 1,
      graphId: graph.id,
      commands: [
        { name: 'place_node', target: 'drawing-node', writes: ['drawing.nodes', 'graph.nodes'] },
        { name: 'move_node', target: 'drawing-node', writes: ['drawing.nodes.x', 'drawing.nodes.y'] },
        { name: 'connect_edge', target: 'edge', writes: ['graph.edges', 'drawing.edges'] },
        { name: 'set_node_property', target: 'node', writes: ['graph.nodes.properties'] },
        { name: 'bind_catalog_product', target: 'catalog-binding', writes: ['graph.catalogBindings'] },
      ],
    },
  }
}

export function attachVerilogToDraft(draft: EngineeringProjectDraft): EngineeringProjectDraft {
  const verilog = exportEngineeringProjectVerilog(draft)
  return {
    ...draft,
    verilog: {
      source: verilog.source,
      bindings: verilog.bindings,
    },
  }
}
