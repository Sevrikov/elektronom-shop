// scripts/test-panel-thermal.ts — modular capacity + thermal balance
import { ENGINEERING_TEMPLATES } from '../src/lib/engineering/templates'
import { computePanelThermal } from '../src/lib/engineering/panel-thermal'

console.log('Running Panel Thermal Tests...')
let passed = true
function assert(cond: boolean, msg: string) {
  if (!cond) { console.error(`FAIL: ${msg}`); passed = false } else { console.log(`PASS: ${msg}`) }
}

for (const template of ENGINEERING_TEMPLATES) {
  const tag = `[${template.id}]`
  const graph = template.build().graph

  const plastic = computePanelThermal(graph, 'plastic')
  const metal = computePanelThermal(graph, 'metal')
  assert(!!plastic && !!metal, `${tag} thermal computed`)
  if (!plastic || !metal) continue

  assert(plastic.occupiedModules > 0, `${tag} occupied modules counted (${plastic.occupiedModules}/${plastic.capacityModules})`)
  assert(plastic.heatW > 0, `${tag} device heat > 0 (${plastic.heatW} W)`)
  assert(plastic.surfaceM2 > 0, `${tag} box surface computed (${plastic.surfaceM2} m²)`)

  // Metal dissipates better → lower temperature rise than plastic for the same heat
  assert(metal.tempRiseK < plastic.tempRiseK, `${tag} metal runs cooler than plastic (${metal.tempRiseK}K < ${plastic.tempRiseK}K)`)

  // Plastic can shed less heat at the allowed rise than metal
  assert(plastic.dissipationW < metal.dissipationW, `${tag} metal sheds more heat (${metal.dissipationW}W > ${plastic.dissipationW}W)`)

  console.log(`  ${tag} plastic: heat ${plastic.heatW}W, ΔT ${plastic.tempRiseK}K, overheated=${plastic.overheated}; metal ΔT ${metal.tempRiseK}K`)
}

// A tiny box stuffed with heavy loads must overheat
{
  const overGraph = ENGINEERING_TEMPLATES[3]!.build().graph // workshop, heavy 3ф loads
  const tiny = { ...overGraph, nodes: overGraph.nodes.map((n) => n.type === 'distribution_panel' ? { ...n, properties: { ...n.properties, modules: 6 } } : n) }
  const r = computePanelThermal(tiny, 'plastic')
  assert(!!r && (r.overheated || r.moduleOverflow), 'Overstuffed tiny plastic box flags overheat or module overflow')
}

console.log(`\nPanel Thermal Tests Done. All passed: ${passed}`)
process.exit(passed ? 0 : 1)
