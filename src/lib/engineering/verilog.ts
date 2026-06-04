import type {
  CatalogBinding,
  EngineeringEdge,
  EngineeringNode,
  EngineeringProjectDraft,
  EngineeringVerilogBinding,
} from './graph'

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

function verilogId(value: string) {
  const clean = value.replace(/[^a-zA-Z0-9_]/g, '_')
  return /^[a-zA-Z_]/.test(clean) ? clean : `n_${clean}`
}

function numericParam(value: unknown, fallback: number) {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback
}

function stringParam(value: unknown, fallback: string) {
  return typeof value === 'string' && value.trim() ? value : fallback
}

function nodeModuleName(node: EngineeringNode) {
  return `el_${verilogId(node.type)}`
}

function nodeInstanceName(node: EngineeringNode) {
  return verilogId(node.id)
}

function edgeWireName(edge: EngineeringEdge) {
  return `w_${verilogId(edge.id)}_${verilogId(edge.conductor ?? edge.type ?? 'power')}`
}

function catalogForNode(node: EngineeringNode, bindings: CatalogBinding[]) {
  return bindings.find((binding) => binding.nodeId === node.id)
}

function nodeParams(node: EngineeringNode, binding: CatalogBinding | undefined) {
  const props = node.properties
  const params = [
    `.NODE_ID("${node.id}")`,
    `.LABEL("${node.label.replace(/"/g, '\\"')}")`,
    `.CURRENT_A(${numericParam(props.currentA, 0)})`,
    `.POWER_W(${numericParam(props.powerW, 0)})`,
    `.VOLTAGE_V(${numericParam(props.voltageV, 0)})`,
    `.SECTION_MM2(${numericParam(props.sectionMm2, 0)})`,
    `.ROUTE_M(${numericParam(props.routeLengthM, 0)})`,
    `.MODULES(${numericParam(props.modules, 0)})`,
    `.POLES("${stringParam(props.poles, '')}")`,
    `.MATERIAL("${stringParam(props.material, '')}")`,
  ]

  if (binding) {
    params.push(`.PRODUCT_ID("${binding.productId}")`)
    params.push(`.SKU("${binding.sku.replace(/"/g, '\\"')}")`)
    params.push(`.STOCK(${numericParam(binding.stock, -1)})`)
  }

  return params.join(', ')
}

export function exportEngineeringProjectVerilog(draft: EngineeringProjectDraft): EngineeringVerilogExport {
  const graph = draft.graph
  const bindings: EngineeringVerilogBinding[] = []
  const lines: string[] = [
    '// Electronom EngineeringGraph Verilog bridge',
    `// graphId=${graph.id}`,
    `// draftId=${draft.id}`,
    '// This source is a control/binding layer, not a safety bypass.',
    `module electronom_project_${verilogId(graph.id)};`,
    '',
  ]

  for (const edge of graph.edges) {
    const wireName = edgeWireName(edge)
    bindings.push({ symbol: wireName, kind: 'edge', edgeId: edge.id })
    lines.push(`  // edge ${edge.id}: ${edge.source} -> ${edge.target}, conductor=${edge.conductor ?? edge.type ?? 'power'}`)
    lines.push(`  wire ${wireName};`)
  }

  if (graph.edges.length > 0) lines.push('')

  for (const node of graph.nodes) {
    const binding = catalogForNode(node, graph.catalogBindings)
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
    lines.push(`  ${nodeModuleName(node)} #(${nodeParams(node, binding)}) ${symbol} ();`)
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
