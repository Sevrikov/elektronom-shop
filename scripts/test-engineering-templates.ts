// scripts/test-engineering-templates.ts
// Acceptance tests for ready-made panel scheme templates:
// structure validity, NormGuard cleanliness, Verilog round-trip.
import { ENGINEERING_TEMPLATES } from '../src/lib/engineering/templates'
import { runNormGuard } from '../src/lib/engineering/normguard'
import { runEngineeringCAE } from '../src/lib/engineering/cae'
import { exportEngineeringProjectVerilog, parseAndInterpretVerilog } from '../src/lib/engineering/verilog'
import type { EngineeringGraph } from '../src/lib/engineering/graph'

console.log('Running Engineering Template Tests...')

let passed = true
function assert(condition: boolean, message: string) {
  if (!condition) { console.error(`FAIL: ${message}`); passed = false }
  else console.log(`PASS: ${message}`)
}

function loadSnapshots(graph: EngineeringGraph): EngineeringGraph['loads'] {
  return graph.nodes
    .filter((node) => node.type === 'load')
    .map((node) => ({
      id: node.id,
      name: node.label,
      kind: String(node.properties.kind ?? 'custom'),
      powerW: Number(node.properties.powerW ?? 0),
      voltageV: Number(node.properties.voltageV ?? graph.network.voltageV),
      phase: node.properties.phase === 3 ? 3 : 1,
      areaZone: typeof node.properties.areaZone === 'string' ? node.properties.areaZone : undefined,
      room: undefined,
      critical: Boolean(node.properties.critical),
      reservePowerRequired: Boolean(node.properties.reservePowerRequired),
    }))
}

assert(ENGINEERING_TEMPLATES.length >= 4, `Template catalog has ${ENGINEERING_TEMPLATES.length} templates (>= 4)`)

for (const template of ENGINEERING_TEMPLATES) {
  const tag = `[${template.id}]`
  const draft = template.build()
  const graph = draft.graph

  // --- Structure ---
  const nodeIds = new Set(graph.nodes.map((n) => n.id))
  assert(nodeIds.size === graph.nodes.length, `${tag} node ids are unique (${graph.nodes.length} nodes)`)
  assert(graph.nodes.length >= 8, `${tag} has a meaningful number of nodes`)

  const badEdges = graph.edges.filter((e) => !nodeIds.has(e.source) || !nodeIds.has(e.target))
  assert(badEdges.length === 0, `${tag} all ${graph.edges.length} edges reference existing nodes`)

  assert(draft.drawing.nodes.length === graph.nodes.length, `${tag} every node has a drawing position`)
  const positions = new Set(draft.drawing.nodes.map((dn) => `${dn.x},${dn.y}`))
  assert(positions.size === draft.drawing.nodes.length, `${tag} drawing positions do not overlap`)
  const inCanvas = draft.drawing.nodes.every((dn) =>
    dn.x >= 0 && dn.y >= 0 && dn.x < draft.drawing.canvas.cols && dn.y < draft.drawing.canvas.rows)
  assert(inCanvas, `${tag} all positions fit the ${draft.drawing.canvas.cols}x${draft.drawing.canvas.rows} canvas`)

  // Connectivity: every load is reachable via edges (undirected walk from grid input)
  const adjacency = new Map<string, string[]>()
  for (const e of graph.edges) {
    adjacency.set(e.source, [...(adjacency.get(e.source) ?? []), e.target])
    adjacency.set(e.target, [...(adjacency.get(e.target) ?? []), e.source])
  }
  const visited = new Set<string>(['grid-input-1'])
  const queue = ['grid-input-1']
  while (queue.length) {
    const current = queue.shift()!
    for (const next of adjacency.get(current) ?? []) {
      if (!visited.has(next)) { visited.add(next); queue.push(next) }
    }
  }
  const unreachableLoads = graph.nodes.filter((n) => n.type === 'load' && !visited.has(n.id))
  assert(unreachableLoads.length === 0, `${tag} all loads are electrically reachable from grid input`)

  // --- NormGuard: a shipped template must not contain blocking violations ---
  const checkedGraph: EngineeringGraph = { ...graph, loads: loadSnapshots(graph) }
  const issues = runNormGuard(checkedGraph)
  const blocking = issues.filter((issue) => issue.blocksCheckout)
  if (blocking.length > 0) {
    for (const issue of blocking) console.error(`  ${tag} BLOCKING: ${issue.code} / ${issue.targetId ?? ''}: ${issue.message ?? ''}`)
  }
  assert(blocking.length === 0, `${tag} NormGuard has no blocking issues (${issues.length} total advisories)`)

  // --- CAE sanity: no dangling elements, no dangerous ampacity violations ---
  const cae = runEngineeringCAE(checkedGraph)
  const dangers = cae.issues.filter((issue) => issue.severity === 'danger')
  if (dangers.length > 0) {
    for (const issue of dangers) console.error(`  ${tag} CAE DANGER: ${issue.code} / ${issue.targetId ?? ''}: ${issue.message}`)
  }
  assert(dangers.length === 0, `${tag} CAE has no danger-level issues`)

  // --- Verilog round-trip ---
  const exported = exportEngineeringProjectVerilog(draft)
  const rt = parseAndInterpretVerilog(exported.source)
  assert(rt.parseErrors.length === 0, `${tag} exports to Verilog and parses back without errors`)
  assert(rt.draft.graph.nodes.length === graph.nodes.length, `${tag} Verilog round-trip preserves node count`)
  assert(rt.autoLayoutApplied === false, `${tag} round-trip keeps explicit template positions`)
}

console.log(`\nEngineering Template Tests Done. All passed: ${passed}`)
process.exit(passed ? 0 : 1)
