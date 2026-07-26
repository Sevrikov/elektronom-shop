/**
 * Verilog Auto-Layout for Electronom Engineering CAD
 *
 * Automatically positions nodes on the drawing canvas when
 * X_MM/Y_MM coordinates are not provided in the Verilog source.
 *
 * Uses a simplified Sugiyama-style layered layout:
 * 1. Topological sort (grid_input → protection → cable → load)
 * 2. Layer assignment based on node depth
 * 3. Position nodes with snap-to-grid spacing
 *
 * Nodes with explicit coordinates are NEVER moved: pass the set of
 * movable node ids via `nodeIdsToLayout`.
 */

import type {
  EngineeringDrawingNode,
  EngineeringProjectDraft,
} from '../graph'

/* ------------------------------------------------------------------ */
/*  Layer priority (lower = closer to input)                          */
/* ------------------------------------------------------------------ */

const TYPE_LAYER_PRIORITY: Record<string, number> = {
  grid_input: 0,
  meter: 1,
  main_breaker: 2,
  voltage_relay: 2,
  surge_protection: 2,
  distribution_panel: 3,
  busbar_n: 4,
  busbar_pe: 4,
  rcd: 5,
  mcb: 5,
  ats: 5,
  cable_line: 6,
  terminal: 7,
  load: 7,
  generator: 1,
  inverter: 2,
  battery: 3,
}

/* ------------------------------------------------------------------ */
/*  Layout constants                                                  */
/* ------------------------------------------------------------------ */

/** Horizontal spacing between nodes in grid cells */
const H_SPACING = 2

/** Vertical spacing between layers in grid cells */
const V_SPACING = 2

/** Left margin in grid cells */
const MARGIN_X = 1

/** Top margin in grid cells */
const MARGIN_Y = 1

/* ------------------------------------------------------------------ */
/*  Topological sort + layer assignment                                */
/* ------------------------------------------------------------------ */

interface LayoutNode {
  nodeId: string
  layer: number
  orderInLayer: number
}

function buildAdjacency(draft: EngineeringProjectDraft): Map<string, string[]> {
  const adj = new Map<string, string[]>()
  for (const node of draft.graph.nodes) {
    adj.set(node.id, [])
  }
  for (const edge of draft.graph.edges) {
    const children = adj.get(edge.source)
    if (children) children.push(edge.target)
  }
  return adj
}

function assignLayers(draft: EngineeringProjectDraft): LayoutNode[] {
  const adj = buildAdjacency(draft)
  const layoutNodes: LayoutNode[] = []

  const nodeLayer = new Map<string, number>()
  for (const node of draft.graph.nodes) {
    nodeLayer.set(node.id, TYPE_LAYER_PRIORITY[node.type] ?? 5)
  }

  // BFS from roots to push children below their parents
  const roots = draft.graph.nodes
    .filter((n) => !draft.graph.edges.some((e) => e.target === n.id))
    .map((n) => n.id)

  if (roots.length > 0) {
    const queue = [...roots]
    const visited = new Set<string>(roots)

    while (queue.length > 0) {
      const current = queue.shift()!
      const currentLayer = nodeLayer.get(current) ?? 0
      const children = adj.get(current) ?? []

      for (const child of children) {
        const childCurrentLayer = nodeLayer.get(child) ?? 0
        if (childCurrentLayer <= currentLayer) {
          nodeLayer.set(child, currentLayer + 1)
        }
        if (!visited.has(child)) {
          visited.add(child)
          queue.push(child)
        }
      }
    }
  }

  // Build final layer groups
  const finalLayers = new Map<number, string[]>()
  for (const [nodeId, layer] of nodeLayer) {
    const group = finalLayers.get(layer) ?? []
    group.push(nodeId)
    finalLayers.set(layer, group)
  }

  // Assign order within each layer
  const sortedLayers = [...finalLayers.keys()].sort((a, b) => a - b)
  for (const layer of sortedLayers) {
    const group = finalLayers.get(layer) ?? []
    for (let i = 0; i < group.length; i++) {
      layoutNodes.push({
        nodeId: group[i] || '',
        layer,
        orderInLayer: i,
      })
    }
  }

  return layoutNodes
}

/* ------------------------------------------------------------------ */
/*  Main auto-layout function                                         */
/* ------------------------------------------------------------------ */

/**
 * Positions nodes using a layered layout.
 *
 * @param draft - The project draft with nodes possibly at fallback positions
 * @param nodeIdsToLayout - When provided, ONLY these nodes are repositioned;
 *   all other nodes keep their explicit coordinates. When omitted, every
 *   node is repositioned (legacy full-layout behaviour).
 * @returns Updated draft with nodes repositioned
 */
export function autoLayoutDraft(
  draft: EngineeringProjectDraft,
  nodeIdsToLayout?: ReadonlySet<string>,
): EngineeringProjectDraft {
  if (nodeIdsToLayout && nodeIdsToLayout.size === 0) {
    return draft
  }

  const layoutNodes = assignLayers(draft)

  const existingPositions = new Map<string, EngineeringDrawingNode>()
  for (const dn of draft.drawing.nodes) {
    existingPositions.set(dn.nodeId, dn)
  }

  const movable = (nodeId: string) => !nodeIdsToLayout || nodeIdsToLayout.has(nodeId)

  // Cells already taken by pinned nodes must not be assigned to moved nodes
  const occupied = new Set<string>()
  for (const dn of draft.drawing.nodes) {
    if (!movable(dn.nodeId)) {
      occupied.add(`${dn.x},${dn.y}`)
    }
  }

  const positioned = new Map<string, EngineeringDrawingNode>()

  for (const ln of layoutNodes) {
    const existing = existingPositions.get(ln.nodeId)

    if (!movable(ln.nodeId)) {
      if (existing) positioned.set(ln.nodeId, existing)
      continue
    }

    let x = MARGIN_X + ln.orderInLayer * H_SPACING
    const y = Math.min(MARGIN_Y + ln.layer * V_SPACING, draft.drawing.canvas.rows - 1)

    x = Math.min(x, draft.drawing.canvas.cols - 1)
    while (occupied.has(`${x},${y}`)) {
      x += H_SPACING
    }
    occupied.add(`${x},${y}`)

    positioned.set(ln.nodeId, {
      nodeId: ln.nodeId,
      x,
      y,
      width: existing?.width ?? 1,
      height: existing?.height ?? 1,
    })
  }

  // Preserve the original drawing-node order
  const newDrawingNodes: EngineeringDrawingNode[] = draft.drawing.nodes.map(
    (dn) => positioned.get(dn.nodeId) ?? dn,
  )
  // Nodes present in the graph but absent from drawing.nodes (defensive)
  for (const [nodeId, dn] of positioned) {
    if (!existingPositions.has(nodeId)) newDrawingNodes.push(dn)
  }

  return {
    ...draft,
    drawing: {
      ...draft.drawing,
      nodes: newDrawingNodes,
    },
  }
}
