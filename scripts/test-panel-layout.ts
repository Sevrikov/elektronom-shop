// scripts/test-panel-layout.ts — auto DIN-rail layout acceptance
import { ENGINEERING_TEMPLATES } from '../src/lib/engineering/templates'
import { autoLayoutPanelDraft, RAIL_MODULE_TYPES } from '../src/lib/engineering/panel-layout'

console.log('Running Panel Auto-Layout Tests...')
let passed = true
function assert(cond: boolean, msg: string) {
  if (!cond) { console.error(`FAIL: ${msg}`); passed = false } else { console.log(`PASS: ${msg}`) }
}

for (const template of ENGINEERING_TEMPLATES) {
  const tag = `[${template.id}]`
  const draft = autoLayoutPanelDraft(template.build())
  const posOf = new Map(draft.drawing.nodes.map((dn) => [dn.nodeId, dn]))

  const panel = draft.graph.nodes.find((n) => n.type === 'distribution_panel')
  assert(!!panel, `${tag} has a panel`)
  if (!panel) continue
  const pp = posOf.get(panel.id)!
  assert((pp.width ?? 0) >= 4 && (pp.height ?? 0) >= 6, `${tag} panel box sized to hold rails (${pp.width}x${pp.height})`)

  // Modular devices sit on a small number of distinct rail rows (not one-per-row chains)
  const railYs = new Set<number>()
  for (const node of draft.graph.nodes) {
    if (!RAIL_MODULE_TYPES.has(node.type)) continue
    const p = posOf.get(node.id)
    if (p) railYs.add(p.y)
  }
  assert(railYs.size > 0 && railYs.size <= 4, `${tag} modular devices grouped onto ${railYs.size} rails`)

  // Every rail holds >1 device for at least one rail (proves horizontal packing)
  const perRail = new Map<number, number>()
  for (const node of draft.graph.nodes) {
    if (!RAIL_MODULE_TYPES.has(node.type)) continue
    const p = posOf.get(node.id)
    if (p) perRail.set(p.y, (perRail.get(p.y) ?? 0) + 1)
  }
  assert([...perRail.values()].some((c) => c >= 2), `${tag} at least one rail packs multiple modules horizontally`)

  // Loads sit BELOW the panel box (y greater than the box bottom)
  const boxBottom = pp.y + (pp.height ?? 5)
  const loads = draft.graph.nodes.filter((n) => n.type === 'load')
  const loadsBelow = loads.every((n) => (posOf.get(n.id)?.y ?? 0) >= boxBottom - 1)
  assert(loadsBelow, `${tag} all ${loads.length} loads placed below the box`)

  // Modular rail rows must be ABOVE the loads (rails inside box, loads under)
  const maxRailY = Math.max(...railYs)
  const minLoadY = Math.min(...loads.map((n) => posOf.get(n.id)?.y ?? 0))
  assert(maxRailY < minLoadY, `${tag} rails (maxY ${maxRailY}) sit above loads (minY ${minLoadY})`)
}

console.log(`\nPanel Auto-Layout Tests Done. All passed: ${passed}`)
process.exit(passed ? 0 : 1)
