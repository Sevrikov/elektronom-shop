// scripts/test-verilog-edge-cases.ts
// Adversarial round-trip checks for the Verilog DSL (Phase 0 acceptance suite)
// + property test: interpret(parse(export(draft))) must equal draft.
import { exportEngineeringProjectVerilog, parseAndInterpretVerilog } from '../src/lib/engineering/verilog'
import type {
  CatalogBinding,
  EngineeringConnectionKind,
  EngineeringEdge,
  EngineeringNode,
  EngineeringNodeType,
  EngineeringProjectDraft,
} from '../src/lib/engineering/graph'

console.log('Running Verilog Edge-Case & Round-Trip Property Tests...')

let passed = true

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`FAIL: ${message}`)
    passed = false
  } else {
    console.log(`PASS: ${message}`)
  }
}

function draftWith(
  partial: Partial<EngineeringProjectDraft['graph']>,
  drawingNodes: EngineeringProjectDraft['drawing']['nodes'],
  drawingEdges: EngineeringProjectDraft['drawing']['edges'] = [],
): EngineeringProjectDraft {
  return {
    id: 'd1', version: 1, name: 'Edge cases', updatedAt: new Date().toISOString(),
    graph: {
      id: 'g1', version: 1, locale: 'uk',
      network: { phase: 1, voltageV: 230, inputBreakerA: 25, earthingSystem: 'TT' },
      nodes: [], edges: [], catalogBindings: [], loads: [], panels: [], bom: [],
      totals: { totalPowerW: 0, totalCurrentA: 0, occupiedModules: 0, estimatedCost: 0 },
      normIssues: [],
      ...partial,
    },
    drawing: { canvas: { cols: 12, rows: 8, cellWidth: 100, cellHeight: 100 }, nodes: drawingNodes, edges: drawingEdges },
  }
}

/* ------------------------------------------------------------------ */
/* 1. DC+ / DC- conductors: distinct wire names, round-trip intact     */
/* ------------------------------------------------------------------ */
{
  const d = draftWith({
    nodes: [
      { id: 'inv-1', type: 'inverter', label: 'Inverter', properties: {} },
      { id: 'bat-1', type: 'battery', label: 'Battery', properties: {} },
    ],
    edges: [
      { id: 'e-dc-plus', source: 'inv-1', target: 'bat-1', type: 'dc', conductor: 'DC+' },
      { id: 'e-dc-minus', source: 'inv-1', target: 'bat-1', type: 'dc', conductor: 'DC-' },
    ],
  }, [
    { nodeId: 'inv-1', x: 1, y: 1 }, { nodeId: 'bat-1', x: 3, y: 1 },
  ])
  const exp = exportEngineeringProjectVerilog(d)
  assert(exp.source.includes('w_e_dc_plus_DCp'), '1. DC+ wire name encoded as DCp')
  assert(exp.source.includes('w_e_dc_minus_DCm'), '1. DC- wire name encoded as DCm')
  const rt = parseAndInterpretVerilog(exp.source)
  assert(rt.draft.graph.edges[0]?.conductor === 'DC+', '1. DC+ conductor survives round-trip')
  assert(rt.draft.graph.edges[1]?.conductor === 'DC-', '1. DC- conductor survives round-trip')

  // Even with the `// edge` comments stripped, conductor must be inferable from the wire name
  const stripped = exp.source.split('\n').filter((l) => !l.trim().startsWith('// edge')).join('\n')
  const rtStripped = parseAndInterpretVerilog(stripped)
  const dcWires = rtStripped.warnings.filter((w) => w.type === 'missing-connection')
  assert(dcWires.length === 2, '1. Stripped comments degrade to warnings (no crash, no bogus L)')
}

/* ------------------------------------------------------------------ */
/* 2. Edge with NO conductor: no invalid "power" conductor in graph    */
/* ------------------------------------------------------------------ */
{
  const d = draftWith({
    nodes: [
      { id: 'a', type: 'mcb', label: 'A', properties: {} },
      { id: 'b', type: 'load', label: 'B', properties: {} },
    ],
    edges: [{ id: 'e1', source: 'a', target: 'b', type: 'power' }],
  }, [{ nodeId: 'a', x: 1, y: 1 }, { nodeId: 'b', x: 3, y: 1 }])
  const exp = exportEngineeringProjectVerilog(d)
  const rt = parseAndInterpretVerilog(exp.source)
  assert(rt.draft.graph.edges[0]?.conductor === undefined, '2. Absent conductor stays undefined')
  assert(rt.draft.graph.edges[0]?.type === 'power', '2. Edge type=power survives round-trip')
}

/* ------------------------------------------------------------------ */
/* 3. Mixed coordinates: explicit position must NOT be re-laid-out     */
/* ------------------------------------------------------------------ */
{
  const src = `
// graphId=g-mixed
// draftId=d-mixed
module electronom_project_mixed;
  el_grid_input #(.NODE_ID("in-1"), .LABEL("In"), .X_MM(250), .Y_MM(25)) in_1 ();
  el_mcb #(.NODE_ID("mcb-1"), .LABEL("B1")) mcb_1 ();
endmodule
`
  const rt = parseAndInterpretVerilog(src)
  const inNode = rt.draft.drawing.nodes.find((n) => n.nodeId === 'in-1')
  const mcbNode = rt.draft.drawing.nodes.find((n) => n.nodeId === 'mcb-1')
  assert(rt.autoLayoutApplied === true, '3. Auto-layout applied for the node without coordinates')
  assert(inNode?.x === 10 && inNode?.y === 1, `3. Explicit position (10,1) preserved, got (${inNode?.x},${inNode?.y})`)
  assert(!!mcbNode && !(mcbNode.x === 10 && mcbNode.y === 1), '3. Laid-out node does not collide with pinned node')
}

/* ------------------------------------------------------------------ */
/* 4. Catalog binding price survives round-trip                        */
/* ------------------------------------------------------------------ */
{
  const d = draftWith({
    nodes: [{ id: 'mcb-1', type: 'mcb', label: 'B', properties: {} }],
    catalogBindings: [{ nodeId: 'mcb-1', productId: 'p1', sku: 'SKU-1', name: 'B', price: 350, stock: 5, attributes: {} }],
  }, [{ nodeId: 'mcb-1', x: 1, y: 1 }])
  const exp = exportEngineeringProjectVerilog(d)
  const rt = parseAndInterpretVerilog(exp.source)
  assert(rt.draft.graph.catalogBindings[0]?.price === 350, '4. Binding price 350 survives round-trip')
  assert(rt.draft.graph.catalogBindings[0]?.stock === 5, '4. Binding stock survives round-trip')
}

/* ------------------------------------------------------------------ */
/* 5. Network config / locale / name round-trip                        */
/* ------------------------------------------------------------------ */
{
  const d = draftWith({
    nodes: [{ id: 'in-1', type: 'grid_input', label: 'In', properties: { phase: 1, voltageV: 230, currentA: 32 } }],
  }, [{ nodeId: 'in-1', x: 1, y: 1 }])
  const exp = exportEngineeringProjectVerilog(d)
  const rt = parseAndInterpretVerilog(exp.source)
  assert(rt.draft.graph.network.earthingSystem === 'TT', '5. earthingSystem TT survives round-trip')
  assert(rt.draft.graph.locale === 'uk', '5. locale survives round-trip')
  assert(rt.draft.name === 'Edge cases', '5. project name survives round-trip')
  assert(rt.draft.graph.network.inputBreakerA === 25, '5. inputBreakerA survives round-trip')
}

/* ------------------------------------------------------------------ */
/* 6. Waypoints (route) round-trip, including negative coordinates     */
/* ------------------------------------------------------------------ */
{
  const d = draftWith({
    nodes: [
      { id: 'a', type: 'mcb', label: 'A', properties: {} },
      { id: 'b', type: 'load', label: 'B', properties: {} },
    ],
    edges: [{ id: 'e1', source: 'a', target: 'b', conductor: 'L' }],
  }, [{ nodeId: 'a', x: 1, y: 1 }, { nodeId: 'b', x: 5, y: 5 }],
     [{ edgeId: 'e1', waypoints: [{ x: 3, y: 1 }, { x: 3, y: 5 }, { x: -2, y: 5 }] }])
  const exp = exportEngineeringProjectVerilog(d)
  assert(exp.source.includes('// route:'), '6. Exporter writes route comment')
  const rt = parseAndInterpretVerilog(exp.source)
  const wp = rt.draft.drawing.edges.find((e) => e.edgeId === 'e1')?.waypoints
  assert(JSON.stringify(wp) === JSON.stringify([{ x: 3, y: 1 }, { x: 3, y: 5 }, { x: -2, y: 5 }]),
    `6. Waypoints survive round-trip, got ${JSON.stringify(wp)}`)
}

/* ------------------------------------------------------------------ */
/* 7. Instance WITHOUT params must create a node                       */
/* ------------------------------------------------------------------ */
{
  const src = `
// graphId=g
// draftId=d
module electronom_project_x;
  el_busbar_n busbar_1 ();
  el_mcb #(.NODE_ID("mcb-1"), .LABEL("B"), .X_MM(25), .Y_MM(25)) mcb_1 ();
endmodule
`
  const rt = parseAndInterpretVerilog(src)
  const busbar = rt.draft.graph.nodes.find((n) => n.id === 'busbar_1')
  assert(!!busbar, '7. Parameterless instance creates a node')
  assert(busbar?.type === 'busbar_n', '7. Parameterless instance has correct type')
}

/* ------------------------------------------------------------------ */
/* 8. Labels with unbalanced parens / quotes / backslashes             */
/* ------------------------------------------------------------------ */
{
  const d = draftWith({
    nodes: [
      { id: 'm1', type: 'mcb', label: 'Группа :) розетки', properties: {} },
      { id: 'm2', type: 'mcb', label: 'Сказал "так" ((', properties: {} },
      { id: 'm3', type: 'mcb', label: 'C:\\щит\\линия', properties: {} },
    ],
  }, [{ nodeId: 'm1', x: 1, y: 1 }, { nodeId: 'm2', x: 3, y: 1 }, { nodeId: 'm3', x: 5, y: 1 }])
  const exp = exportEngineeringProjectVerilog(d)
  const rt = parseAndInterpretVerilog(exp.source)
  assert(rt.parseErrors.length === 0, '8. Tricky labels parse without errors')
  assert(rt.draft.graph.nodes[0]?.label === 'Группа :) розетки', '8. Unbalanced paren label survives')
  assert(rt.draft.graph.nodes[1]?.label === 'Сказал "так" ((', '8. Quoted label survives')
  assert(rt.draft.graph.nodes[2]?.label === 'C:\\щит\\линия', '8. Backslash label survives')
}

/* ------------------------------------------------------------------ */
/* 9. Legacy v2.1 source (conductor=power, zero-filled params)         */
/* ------------------------------------------------------------------ */
{
  const legacy = `
// Electronom EngineeringGraph Verilog bridge v2.1
// graphId=legacy-g
// draftId=legacy-d
module electronom_project_legacy_g;
  // edge e1: a -> b, conductor=power
  wire w_e1_power;
  el_mcb #(.NODE_ID("a"), .LABEL("A"), .CURRENT_A(16), .POLES("2P"), .MATERIAL(""), .X_MM(25), .Y_MM(25)) a ();
  el_load #(.NODE_ID("b"), .LABEL("B"), .POWER_W(1500), .X_MM(75), .Y_MM(25)) b ();
endmodule
`
  const rt = parseAndInterpretVerilog(legacy)
  assert(rt.parseErrors.length === 0, '9. Legacy v2.1 source parses')
  assert(rt.draft.graph.edges[0]?.conductor === undefined, '9. Legacy conductor=power maps to undefined conductor')
  assert(rt.draft.graph.edges[0]?.type === 'power', '9. Legacy conductor=power maps to type=power')
  assert(rt.draft.graph.nodes[0]?.properties.material === undefined, '9. Legacy empty MATERIAL("") stays undefined')
}

/* ------------------------------------------------------------------ */
/* Property test: interpret(parse(export(draft))) ≡ draft              */
/* ------------------------------------------------------------------ */

const NODE_TYPES: EngineeringNodeType[] = [
  'grid_input', 'meter', 'main_breaker', 'voltage_relay', 'surge_protection',
  'busbar_n', 'busbar_pe', 'rcd', 'mcb', 'cable_line', 'load', 'generator',
  'inverter', 'battery', 'ats', 'distribution_panel', 'terminal',
]
const CONDUCTORS: EngineeringConnectionKind[] = ['L', 'N', 'PE', 'PEN', 'DC+', 'DC-', 'signal', 'bus']
const EDGE_TYPES: NonNullable<EngineeringEdge['type']>[] = ['power', 'control', 'earth', 'neutral', 'signal', 'bus', 'dc']
const LABELS = ['Ввід', 'Автомат C16 "кухня"', 'Розетки :)', 'Line\\Feed', 'ПЗВ 30мА', 'Load (critical)']

// Deterministic PRNG so failures are reproducible
let seed = 20260612
function rnd(): number {
  seed = (seed * 1103515245 + 12345) % 2147483648
  return seed / 2147483648
}
function pick<T>(arr: T[]): T {
  return arr[Math.floor(rnd() * arr.length)]!
}
function maybe<T>(value: T): T | undefined {
  return rnd() < 0.5 ? value : undefined
}
function rint(min: number, max: number): number {
  return min + Math.floor(rnd() * (max - min + 1))
}

function randomNode(i: number): EngineeringNode {
  const properties: EngineeringNode['properties'] = {}
  const set = (key: string, value: unknown) => {
    if (value !== undefined) (properties as Record<string, unknown>)[key] = value
  }
  set('currentA', maybe(rint(6, 63)))
  set('powerW', maybe(rint(100, 9000)))
  set('voltageV', maybe(pick([230, 400])))
  set('sectionMm2', maybe(pick([1.5, 2.5, 4, 6, 10])))
  set('routeLengthM', maybe(rint(1, 80)))
  set('modules', maybe(rint(1, 48)))
  set('phase', maybe(pick([1, 3])))
  set('cores', maybe(pick([2, 3, 5])))
  set('leakageMa', maybe(pick([10, 30, 100, 300])))
  set('poles', maybe(pick(['1P', '2P', '3P', '4P'])))
  set('material', maybe(pick(['Cu', 'Al'])))
  set('curve', maybe(pick(['B', 'C', 'D'])))
  set('areaZone', maybe(pick(['dry', 'damp', 'bathroom_zone_1', 'outdoor'])))
  set('neutralMode', maybe(pick(['floating', 'bonded', 'auto'])))
  set('strandType', maybe(pick(['solid', 'stranded', 'flexible'])))
  set('installationMethod', maybe(pick(['wall', 'pipe', 'tray', 'ground'])))
  set('atsNeutralPolicy', maybe(pick(['switch', 'solid'])))
  set('atsPoles', maybe(pick([2, 3, 4])))
  set('switchesNeutral', maybe(rnd() < 0.5))
  set('requiresFerrule', maybe(rnd() < 0.5))
  set('name', maybe(pick(LABELS)))
  set('kind', maybe(pick(['custom', 'lighting', 'boiler'])))

  return {
    id: `node-${i}`,
    type: pick(NODE_TYPES),
    label: pick(LABELS),
    properties,
  }
}

function randomDraft(iteration: number): EngineeringProjectDraft {
  const nodeCount = rint(2, 12)
  const nodes = Array.from({ length: nodeCount }, (_, i) => randomNode(i))

  const edges: EngineeringEdge[] = []
  const drawingEdges: EngineeringProjectDraft['drawing']['edges'] = []
  const edgeCount = rint(0, nodeCount * 2)
  for (let i = 0; i < edgeCount; i++) {
    const source = pick(nodes).id
    const target = pick(nodes).id
    const edge: EngineeringEdge = { id: `edge-${i}`, source, target }
    const conductor = maybe(pick(CONDUCTORS))
    if (conductor) edge.conductor = conductor
    const type = maybe(pick(EDGE_TYPES))
    if (type) edge.type = type
    edges.push(edge)
    const de: EngineeringProjectDraft['drawing']['edges'][number] = { edgeId: edge.id }
    if (rnd() < 0.4) {
      de.waypoints = Array.from({ length: rint(1, 4) }, () => ({ x: rint(-20, 40), y: rint(-20, 40) }))
    }
    drawingEdges.push(de)
  }

  const catalogBindings: CatalogBinding[] = []
  for (const node of nodes) {
    if (rnd() < 0.3) {
      catalogBindings.push({
        nodeId: node.id,
        productId: `prod-${node.id}`,
        sku: `SKU-${node.id.toUpperCase()}`,
        name: node.label,
        price: rint(0, 5000),
        stock: maybe(rint(0, 100)),
        attributes: {},
      })
    }
  }

  const drawingNodes = nodes.map((n, i) => ({
    nodeId: n.id,
    x: rint(-20, 40),
    y: rint(-20, 40),
    width: 1,
    height: 1,
  }))

  return {
    id: `draft-prop-${iteration}`,
    version: 1,
    name: `Property draft ${iteration}`,
    updatedAt: new Date().toISOString(),
    graph: {
      id: `graph-prop-${iteration}`,
      version: 1,
      locale: pick(['uk', 'ru']),
      network: {
        phase: pick([1, 3]),
        voltageV: pick([230, 400]),
        inputBreakerA: pick([16, 25, 32, 40, 63]),
        earthingSystem: pick(['TN-S', 'TN-C-S', 'TT', 'IT']),
      },
      nodes,
      edges,
      catalogBindings,
      loads: [], panels: [], bom: [],
      totals: { totalPowerW: 0, totalCurrentA: 0, occupiedModules: 0, estimatedCost: 0 },
      normIssues: [],
    },
    drawing: {
      canvas: { cols: rint(6, 60), rows: rint(4, 60), cellWidth: 100, cellHeight: 100 },
      nodes: drawingNodes,
      edges: drawingEdges,
    },
  }
}

/** Mirrors the interpreter's conductor → type derivation (canonical enrichment) */
function effectiveEdgeType(e: EngineeringEdge): EngineeringEdge['type'] {
  if (e.type) return e.type
  if (!e.conductor) return undefined
  switch (e.conductor) {
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

function sortedKeys(obj: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  for (const key of Object.keys(obj).sort()) out[key] = obj[key]
  return out
}

/** Stable comparable projection of the round-trippable part of a draft */
function comparable(draft: EngineeringProjectDraft) {
  const sortById = <T extends { [k: string]: unknown }>(arr: T[], key: string) =>
    [...arr].sort((a, b) => String(a[key]).localeCompare(String(b[key])))
  return {
    id: draft.id,
    name: draft.name,
    graphId: draft.graph.id,
    locale: draft.graph.locale,
    network: draft.graph.network,
    nodes: draft.graph.nodes.map((n) => ({
      id: n.id, type: n.type, label: n.label,
      properties: sortedKeys(n.properties as Record<string, unknown>),
    })),
    edges: draft.graph.edges.map((e) => ({
      id: e.id, source: e.source, target: e.target,
      type: effectiveEdgeType(e), conductor: e.conductor,
    })),
    bindings: sortById(draft.graph.catalogBindings as unknown as Array<{ [k: string]: unknown }>, 'nodeId')
      .map((b) => ({ nodeId: b.nodeId, productId: b.productId, sku: b.sku, price: b.price, stock: b.stock })),
    canvas: { cols: draft.drawing.canvas.cols, rows: draft.drawing.canvas.rows },
    drawingNodes: sortById(draft.drawing.nodes as unknown as Array<{ [k: string]: unknown }>, 'nodeId')
      .map((dn) => ({ nodeId: dn.nodeId, x: dn.x, y: dn.y })),
    drawingEdges: sortById(draft.drawing.edges as unknown as Array<{ [k: string]: unknown }>, 'edgeId')
      .map((de) => ({ edgeId: de.edgeId, waypoints: de.waypoints ?? null })),
  }
}

{
  const ITERATIONS = 300
  let failures = 0
  for (let i = 0; i < ITERATIONS; i++) {
    const original = randomDraft(i)
    const exported = exportEngineeringProjectVerilog(original)
    const rt = parseAndInterpretVerilog(exported.source)

    if (rt.parseErrors.length > 0) {
      failures++
      if (failures <= 3) {
        console.error(`PROPERTY FAIL [iter ${i}]: parse errors: ${JSON.stringify(rt.parseErrors)}`)
      }
      continue
    }

    const before = JSON.stringify(comparable(original))
    const after = JSON.stringify(comparable(rt.draft))
    if (before !== after) {
      failures++
      if (failures <= 3) {
        console.error(`PROPERTY FAIL [iter ${i}]:`)
        const a = comparable(original)
        const b = comparable(rt.draft)
        for (const key of Object.keys(a) as Array<keyof typeof a>) {
          const sa = JSON.stringify(a[key])
          const sb = JSON.stringify(b[key])
          if (sa !== sb) {
            console.error(`  field "${key}":\n    before: ${sa}\n    after:  ${sb}`)
          }
        }
      }
    }
  }
  assert(failures === 0, `Property: ${ITERATIONS} random drafts round-trip losslessly (${failures} failures)`)
}

console.log(`\nVerilog Edge-Case Tests Done. All passed: ${passed}`)
process.exit(passed ? 0 : 1)
