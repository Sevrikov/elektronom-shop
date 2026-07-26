/**
 * Verilog DSL Interpreter for Electronom Engineering CAD
 *
 * Converts a VerilogAST into a full EngineeringProjectDraft,
 * bridging the gap between textual Verilog description and the
 * visual canvas representation.
 */

import type {
  CatalogBinding,
  EngineeringConnectionKind,
  EngineeringDrawingCanvas,
  EngineeringDrawingEdge,
  EngineeringDrawingNode,
  EngineeringEdge,
  EngineeringGraph,
  EngineeringNode,
  EngineeringProjectDraft,
} from '../graph'
import type { VerilogAST, VerilogInstanceAST, VerilogWireAST } from './verilog-parser'

/* ------------------------------------------------------------------ */
/*  Result types                                                      */
/* ------------------------------------------------------------------ */

export interface InterpretWarning {
  type: 'unknown-module' | 'missing-coordinates' | 'missing-connection' | 'duplicate-id' | 'param-conflict'
  message: string
  nodeId?: string
  edgeId?: string
}

export interface InterpretResult {
  draft: EngineeringProjectDraft
  warnings: InterpretWarning[]
  /** True if any node is missing X_MM/Y_MM and needs auto-layout */
  needsAutoLayout: boolean
  /** Node ids placed at fallback positions; ONLY these may be moved by auto-layout */
  nodesNeedingLayout: string[]
}

/* ------------------------------------------------------------------ */
/*  Edge type inference                                                */
/* ------------------------------------------------------------------ */

function edgeTypeFor(conductor: EngineeringConnectionKind): NonNullable<EngineeringEdge['type']> {
  switch (conductor) {
    case 'N': return 'neutral'
    case 'PE':
    case 'PEN': return 'earth'
    case 'signal': return 'signal'
    case 'bus': return 'bus'
    case 'DC+':
    case 'DC-': return 'dc'
    default: return 'power'
  }
}

/* ------------------------------------------------------------------ */
/*  Parameter extraction helpers                                      */
/* ------------------------------------------------------------------ */

function numParam(params: Map<string, string | number>, key: string): number | undefined {
  const val = params.get(key)
  if (typeof val === 'number' && Number.isFinite(val)) return val
  if (typeof val === 'string') {
    const n = Number(val)
    if (Number.isFinite(n)) return n
  }
  return undefined
}

function strParam(params: Map<string, string | number>, key: string): string | undefined {
  const val = params.get(key)
  if (typeof val === 'string' && val.trim()) return val
  return undefined
}

/* ------------------------------------------------------------------ */
/*  Instance → EngineeringNode                                        */
/* ------------------------------------------------------------------ */

function instanceToNode(inst: VerilogInstanceAST): EngineeringNode {
  const properties: EngineeringNode['properties'] = {}

  const currentA = numParam(inst.params, 'CURRENT_A')
  if (currentA !== undefined) properties.currentA = currentA

  const powerW = numParam(inst.params, 'POWER_W')
  if (powerW !== undefined) properties.powerW = powerW

  const voltageV = numParam(inst.params, 'VOLTAGE_V')
  if (voltageV !== undefined) properties.voltageV = voltageV

  const sectionMm2 = numParam(inst.params, 'SECTION_MM2')
  if (sectionMm2 !== undefined) properties.sectionMm2 = sectionMm2

  const routeM = numParam(inst.params, 'ROUTE_M')
  if (routeM !== undefined) properties.routeLengthM = routeM

  const modules = numParam(inst.params, 'MODULES')
  if (modules !== undefined) properties.modules = modules

  const poles = strParam(inst.params, 'POLES')
  if (poles) properties.poles = poles as '1P' | '2P' | '3P' | '4P'

  const material = strParam(inst.params, 'MATERIAL')
  if (material) properties.material = material as 'Cu' | 'Al'

  const curve = strParam(inst.params, 'CURVE')
  if (curve) properties.curve = curve as 'B' | 'C' | 'D'

  const phase = numParam(inst.params, 'PHASE')
  if (phase === 1 || phase === 3) properties.phase = phase

  const leakageMa = numParam(inst.params, 'LEAKAGE_MA')
  if (leakageMa !== undefined) properties.leakageMa = leakageMa as 10 | 30 | 100 | 300

  const cores = numParam(inst.params, 'CORES')
  if (cores !== undefined) properties.cores = cores

  const areaZone = strParam(inst.params, 'AREA_ZONE')
  if (areaZone) properties.areaZone = areaZone as 'dry' | 'damp' | 'bathroom_zone_0' | 'bathroom_zone_1' | 'bathroom_zone_2' | 'outdoor'

  const neutralMode = strParam(inst.params, 'NEUTRAL_MODE')
  if (neutralMode) properties.neutralMode = neutralMode as 'floating' | 'bonded' | 'auto'

  const switchesNeutral = inst.params.get('SWITCHES_NEUTRAL')
  if (switchesNeutral !== undefined) properties.switchesNeutral = Boolean(switchesNeutral)

  const requiresFerrule = inst.params.get('REQUIRES_FERRULE')
  if (requiresFerrule !== undefined) properties.requiresFerrule = Boolean(requiresFerrule)

  const strandType = strParam(inst.params, 'STRAND_TYPE')
  if (strandType) properties.strandType = strandType as 'solid' | 'stranded' | 'flexible'

  const name = strParam(inst.params, 'NAME')
  if (name) properties.name = name

  const kind = strParam(inst.params, 'KIND')
  if (kind) properties.kind = kind

  const installMethod = strParam(inst.params, 'INSTALL_METHOD')
  if (installMethod) properties.installationMethod = installMethod as 'wall' | 'pipe' | 'tray' | 'ground'

  const atsNeutralPolicy = strParam(inst.params, 'ATS_NEUTRAL_POLICY')
  if (atsNeutralPolicy) properties.atsNeutralPolicy = atsNeutralPolicy as 'switch' | 'solid'

  const atsPoles = numParam(inst.params, 'ATS_POLES')
  if (atsPoles === 2 || atsPoles === 3 || atsPoles === 4) properties.atsPoles = atsPoles

  return {
    id: inst.nodeId,
    type: inst.nodeType,
    label: inst.label,
    properties,
  }
}

/* ------------------------------------------------------------------ */
/*  Wire → EngineeringEdge                                           */
/* ------------------------------------------------------------------ */

function wireToEdge(wire: VerilogWireAST): EngineeringEdge | null {
  if (!wire.source || !wire.target) return null

  const edge: EngineeringEdge = {
    id: wire.edgeId,
    source: wire.source,
    target: wire.target,
  }
  if (wire.conductor) {
    edge.conductor = wire.conductor
    edge.type = wire.edgeType ?? edgeTypeFor(wire.conductor)
  } else if (wire.edgeType) {
    edge.type = wire.edgeType
  }
  if (wire.sourceTermination) edge.sourceTermination = wire.sourceTermination
  if (wire.targetTermination) edge.targetTermination = wire.targetTermination
  return edge
}

/* ------------------------------------------------------------------ */
/*  Canvas defaults                                                   */
/* ------------------------------------------------------------------ */

const DEFAULT_CANVAS: EngineeringDrawingCanvas = {
  cols: 12,
  rows: 8,
  cellWidth: 100,
  cellHeight: 100,
}

const MM_TO_GRID = 1 / 25 // 25mm per grid cell at default scale

/* ------------------------------------------------------------------ */
/*  Main interpreter                                                  */
/* ------------------------------------------------------------------ */

/**
 * Converts a Verilog AST into an EngineeringProjectDraft.
 *
 * - Each `el_*` instance becomes an EngineeringNode + EngineeringDrawingNode
 * - Each `wire` with source/target becomes an EngineeringEdge + EngineeringDrawingEdge
 * - X_MM/Y_MM parameters are converted to grid coordinates
 * - If coordinates are missing, nodes are placed in a grid pattern, listed in
 *   `nodesNeedingLayout`, and `needsAutoLayout` is set. Nodes with explicit
 *   coordinates are never part of that list.
 */
export function interpretVerilogAST(
  ast: VerilogAST,
  existingDraft?: EngineeringProjectDraft,
): InterpretResult {
  const warnings: InterpretWarning[] = []
  const nodeIds = new Set<string>()
  const nodes: EngineeringNode[] = []
  const drawingNodes: EngineeringDrawingNode[] = []
  const edges: EngineeringEdge[] = []
  const drawingEdges: EngineeringDrawingEdge[] = []
  const catalogBindings: CatalogBinding[] = []
  const nodesNeedingLayout: string[] = []

  const existingBindingsByNode = new Map<string, CatalogBinding>()
  for (const binding of existingDraft?.graph.catalogBindings ?? []) {
    existingBindingsByNode.set(binding.nodeId, binding)
  }

  // --- Process instances → nodes ---
  for (const inst of ast.instances) {
    if (nodeIds.has(inst.nodeId)) {
      warnings.push({
        type: 'duplicate-id',
        message: `Duplicate node ID: ${inst.nodeId}`,
        nodeId: inst.nodeId,
      })
      continue
    }
    nodeIds.add(inst.nodeId)

    const node = instanceToNode(inst)
    nodes.push(node)

    // Drawing node
    let x: number
    let y: number

    if (inst.xMm !== undefined && inst.yMm !== undefined) {
      // Convert mm to grid coordinates
      x = Math.round(inst.xMm * MM_TO_GRID)
      y = Math.round(inst.yMm * MM_TO_GRID)
    } else {
      // Fallback: place in a grid pattern; auto-layout may move ONLY these nodes
      const idx = drawingNodes.length
      x = (idx % 6) * 2
      y = Math.floor(idx / 6) * 2
      nodesNeedingLayout.push(inst.nodeId)
      warnings.push({
        type: 'missing-coordinates',
        message: `Node ${inst.nodeId} has no X_MM/Y_MM, placed at fallback position (${x},${y})`,
        nodeId: inst.nodeId,
      })
    }

    drawingNodes.push({
      nodeId: inst.nodeId,
      x,
      y,
      width: 1,
      height: 1,
    })

    // Catalog binding from PRODUCT_ID/SKU
    const productId = strParam(inst.params, 'PRODUCT_ID')
    const sku = strParam(inst.params, 'SKU')
    if (productId && sku) {
      const existingBinding = existingBindingsByNode.get(inst.nodeId)
      const sameProduct = existingBinding?.productId === productId
      const binding: CatalogBinding = {
        nodeId: inst.nodeId,
        productId,
        sku,
        name: sameProduct && existingBinding ? existingBinding.name : inst.label,
        price: numParam(inst.params, 'PRICE')
          ?? (sameProduct && existingBinding ? existingBinding.price : 0),
        stock: numParam(inst.params, 'STOCK')
          ?? (sameProduct && existingBinding ? existingBinding.stock : undefined),
        attributes: sameProduct && existingBinding ? existingBinding.attributes : {},
      }
      if (sameProduct && existingBinding?.slug) {
        binding.slug = existingBinding.slug
      }
      catalogBindings.push(binding)
    }
  }

  // --- Process wires → edges ---
  for (const wire of ast.wires) {
    const edge = wireToEdge(wire)
    if (!edge) {
      // Wire without source/target — try to infer from node connection order
      warnings.push({
        type: 'missing-connection',
        message: `Wire ${wire.name} has no source/target in comment, skipping edge creation`,
        edgeId: wire.edgeId,
      })
      continue
    }

    // Validate source and target exist
    if (!nodeIds.has(edge.source)) {
      warnings.push({
        type: 'missing-connection',
        message: `Wire ${wire.name} references unknown source node: ${edge.source}`,
        edgeId: wire.edgeId,
      })
    }
    if (!nodeIds.has(edge.target)) {
      warnings.push({
        type: 'missing-connection',
        message: `Wire ${wire.name} references unknown target node: ${edge.target}`,
        edgeId: wire.edgeId,
      })
    }

    edges.push(edge)

    const drawingEdge: EngineeringDrawingEdge = {
      edgeId: edge.id,
    }
    if (wire.waypoints) {
      drawingEdge.waypoints = wire.waypoints.map((p) => ({
        x: Math.round(p.x * MM_TO_GRID),
        y: Math.round(p.y * MM_TO_GRID),
      }))
    }
    drawingEdges.push(drawingEdge)
  }

  // --- Build the canvas ---
  const canvas: EngineeringDrawingCanvas = ast.canvasSizeMm
    ? {
        cols: Math.ceil(ast.canvasSizeMm.width * MM_TO_GRID),
        rows: Math.ceil(ast.canvasSizeMm.height * MM_TO_GRID),
        cellWidth: 100,
        cellHeight: 100,
      }
    : existingDraft?.drawing.canvas ?? DEFAULT_CANVAS

  // --- Determine network config ---
  // Priority: explicit `// network:` header → grid_input params → existing draft → defaults
  const existingNetwork = existingDraft?.graph.network
  const firstInput = ast.instances.find((inst) => inst.nodeType === 'grid_input')
  const inputPhase = firstInput ? numParam(firstInput.params, 'PHASE') : undefined
  const inputVoltage = firstInput ? numParam(firstInput.params, 'VOLTAGE_V') : undefined

  const phase = ast.network?.phase
    ?? (inputPhase === 3 ? 3 : inputPhase === 1 ? 1 : undefined)
    ?? existingNetwork?.phase
    ?? 1
  const voltageV = ast.network?.voltageV
    ?? (inputVoltage === 400 ? 400 : inputVoltage === 230 ? 230 : undefined)
    ?? existingNetwork?.voltageV
    ?? 230
  const inputBreakerA = ast.network?.inputBreakerA
    ?? (firstInput ? numParam(firstInput.params, 'CURRENT_A') : undefined)
    ?? existingNetwork?.inputBreakerA
    ?? 25
  const earthingSystem = ast.network?.earthingSystem
    ?? existingNetwork?.earthingSystem
    ?? 'TN-C-S'

  // --- Assemble graph ---
  const graph: EngineeringGraph = {
    id: ast.graphId || existingDraft?.graph.id || 'verilog-project',
    version: existingDraft?.graph.version ?? 1,
    locale: ast.locale ?? existingDraft?.graph.locale ?? 'uk',
    network: {
      phase,
      voltageV,
      inputBreakerA,
      earthingSystem,
    },
    nodes,
    edges,
    catalogBindings,
    loads: [],
    panels: [],
    bom: [],
    totals: { totalPowerW: 0, totalCurrentA: 0, occupiedModules: 0, estimatedCost: 0 },
    normIssues: [],
  }

  // --- Assemble draft ---
  const draft: EngineeringProjectDraft = {
    id: ast.draftId || existingDraft?.id || 'verilog-draft',
    version: 1,
    name: ast.name
      ?? existingDraft?.name
      ?? ast.moduleName.replace(/^electronom_project_/, '').replace(/_/g, ' '),
    updatedAt: new Date().toISOString(),
    graph,
    drawing: {
      canvas,
      nodes: drawingNodes,
      edges: drawingEdges,
    },
  }

  return { draft, warnings, needsAutoLayout: nodesNeedingLayout.length > 0, nodesNeedingLayout }
}

/**
 * Convenience: parse + interpret in one step.
 */
export { parseVerilogSource } from './verilog-parser'
