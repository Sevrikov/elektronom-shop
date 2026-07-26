/**
 * Panel auto-layout — arranges a distribution-panel project into a realistic
 * DIN-rail form:
 *   - incoming series (meter → main breaker → voltage relay → SPD) on the top rail
 *   - all RCDs on the next rail, all MCBs on the rail below (aligned under their RCD)
 *   - cables and loads drop BELOW the panel box
 *   - the panel box (distribution_panel node) is sized to enclose the rails
 *
 * The rails act as the bus: adjacent modules on the same rail are bridged by the
 * rail itself, so the renderer suppresses the horizontal wire between them. All
 * inter-rail feeds become vertical drops (perpendicular to the rails).
 */

import type {
  EngineeringDrawingNode,
  EngineeringNodeType,
  EngineeringProjectDraft,
} from './graph'

/** Module types that clip onto a DIN rail */
export const RAIL_MODULE_TYPES = new Set<EngineeringNodeType>([
  'meter', 'main_breaker', 'voltage_relay', 'surge_protection', 'ats', 'rcd', 'mcb',
])

/** Incoming series order on the top rail */
const SERIES_ORDER: EngineeringNodeType[] = ['meter', 'main_breaker', 'voltage_relay', 'surge_protection', 'ats']

const RAIL_SERIES_Y = 2
const RAIL_RCD_Y = 5
const RAIL_MCB_Y = 7
const LOAD_Y = 12
const SOURCE_Y = -2
const SERIES_X0 = 2 // leave room for the corner card
const CABLE_LANE_X = -3 // dedicated column to the left of the box

export function autoLayoutPanelDraft(draft: EngineeringProjectDraft): EngineeringProjectDraft {
  const { nodes, edges } = draft.graph
  const panel = nodes.find((n) => n.type === 'distribution_panel')
  if (!panel) return draft

  const byId = new Map(nodes.map((n) => [n.id, n]))
  const parentsOf = (id: string) =>
    edges.filter((e) => e.target === id).map((e) => byId.get(e.source)).filter((n): n is NonNullable<typeof n> => !!n)

  const pos = new Map<string, { x: number; y: number }>()

  // Sources (incoming) — above the box
  const sources = nodes.filter((n) => ['grid_input', 'generator', 'inverter', 'battery'].includes(n.type))
  sources.forEach((n, i) => pos.set(n.id, { x: i * 2, y: SOURCE_Y }))

  // Rail A — incoming series in feed order
  const series = SERIES_ORDER.flatMap((t) => nodes.filter((n) => n.type === t))
  series.forEach((n, i) => pos.set(n.id, { x: SERIES_X0 + i * 2, y: RAIL_SERIES_Y }))

  // Rail B — RCDs (branch heads)
  const rcds = nodes.filter((n) => n.type === 'rcd')
  rcds.forEach((n, i) => pos.set(n.id, { x: 1 + i * 2, y: RAIL_RCD_Y }))

  // Rail C — MCBs aligned under their parent RCD, else packed
  let mcbFallbackX = 1
  for (const n of nodes.filter((node) => node.type === 'mcb')) {
    const parentRcd = parentsOf(n.id).find((p) => p.type === 'rcd')
    const parentPos = parentRcd ? pos.get(parentRcd.id) : undefined
    if (parentPos) {
      pos.set(n.id, { x: parentPos.x, y: RAIL_MCB_Y })
    } else {
      pos.set(n.id, { x: mcbFallbackX, y: RAIL_MCB_Y })
      mcbFallbackX += 2
    }
  }

  // Cables are wires, not devices — pull them OUT of the schematic into a
  // single aligned column on the left (a cable schedule). The breaker→load
  // feed is drawn directly by the renderer.
  nodes
    .filter((node) => node.type === 'cable_line')
    .forEach((n, i) => pos.set(n.id, { x: CABLE_LANE_X, y: 1 + i }))

  // Loads — below the box, under their feeding MCB (cable no longer in column)
  let loadFallbackX = 1
  for (const n of nodes.filter((node) => node.type === 'load')) {
    const cable = parentsOf(n.id).find((p) => p.type === 'cable_line')
    const mcb = (cable ? parentsOf(cable.id) : parentsOf(n.id)).find((p) => p.type === 'mcb')
    const x = mcb ? pos.get(mcb.id)?.x ?? loadFallbackX : loadFallbackX
    pos.set(n.id, { x, y: LOAD_Y })
    loadFallbackX += 2
  }

  // Terminals — keep just below their nearest positioned neighbour
  for (const n of nodes.filter((node) => node.type === 'terminal')) {
    const neighbour = [...parentsOf(n.id), ...edges.filter((e) => e.source === n.id).map((e) => byId.get(e.target)).filter((x): x is NonNullable<typeof x> => !!x)]
      .map((node) => pos.get(node.id))
      .find((p) => p)
    if (neighbour) pos.set(n.id, { x: neighbour.x, y: neighbour.y + 1 })
  }

  // Box bounds — cover the three rails
  const railNodeXs = nodes
    .filter((n) => RAIL_MODULE_TYPES.has(n.type))
    .map((n) => pos.get(n.id)?.x ?? 0)
  const maxX = railNodeXs.length ? Math.max(...railNodeXs) : 6
  const panelWidth = maxX + 2
  const panelHeight = RAIL_MCB_Y - 0 + 2 // from y0 down past rail C
  pos.set(panel.id, { x: 0, y: 0 })

  // Apply positions; ensure every graph node has a drawing node
  const existing = new Map(draft.drawing.nodes.map((dn) => [dn.nodeId, dn]))
  const newDrawing: EngineeringDrawingNode[] = nodes.map((node) => {
    const prev = existing.get(node.id) ?? { nodeId: node.id, x: 0, y: 0, width: 1, height: 1 }
    const p = pos.get(node.id)
    if (!p) return prev
    if (node.id === panel.id) {
      return { ...prev, x: p.x, y: p.y, width: panelWidth, height: panelHeight }
    }
    return { ...prev, x: p.x, y: p.y }
  })

  const cols = Math.max(draft.drawing.canvas.cols, panelWidth + 2)
  const rows = Math.max(draft.drawing.canvas.rows, LOAD_Y + 3)

  return {
    ...draft,
    drawing: {
      ...draft.drawing,
      canvas: { ...draft.drawing.canvas, cols, rows },
      nodes: newDrawing,
    },
  }
}
