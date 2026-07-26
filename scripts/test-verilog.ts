// scripts/test-verilog.ts
import 'dotenv/config'
import { exportEngineeringProjectVerilog } from '../src/lib/engineering/verilog'
import { parseAndInterpretVerilog, parseVerilogSource, interpretVerilogAST } from '../src/lib/engineering/verilog'
import type { EngineeringProjectDraft } from '../src/lib/engineering/graph'

console.log('Running Verilog Parser & Interpreter Unit Tests...')

let passed = true

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`FAIL: ${message}`)
    passed = false
  } else {
    console.log(`PASS: ${message}`)
  }
}

// 1. Create a dummy draft with coordinates, edges, catalog bindings, properties
const originalDraft: EngineeringProjectDraft = {
  id: 'draft-test-1',
  version: 1,
  name: 'Test Project',
  updatedAt: new Date().toISOString(),
  graph: {
    id: 'test-graph-1',
    version: 1,
    locale: 'uk',
    network: {
      phase: 1,
      voltageV: 230,
      inputBreakerA: 32,
      earthingSystem: 'TN-C-S',
    },
    nodes: [
      {
        id: 'grid-input-1',
        type: 'grid_input',
        label: 'Ввод мережі',
        properties: { phase: 1, voltageV: 230, currentA: 32 },
      },
      {
        id: 'mcb-1',
        type: 'mcb',
        label: 'Автомат кухня',
        properties: { currentA: 16, poles: '2P', curve: 'C', modules: 2 },
      },
      {
        id: 'load-1',
        type: 'load',
        label: 'Розеточная группа',
        properties: { powerW: 2000, phase: 1, voltageV: 230, areaZone: 'dry' },
      },
    ],
    edges: [
      {
        id: 'edge-1',
        source: 'grid-input-1',
        target: 'mcb-1',
        type: 'power',
        conductor: 'L',
      },
      {
        id: 'edge-2',
        source: 'mcb-1',
        target: 'load-1',
        type: 'power',
        conductor: 'L',
      },
    ],
    catalogBindings: [
      {
        nodeId: 'mcb-1',
        productId: 'prod-mcb-123',
        sku: 'ABB-SH202-C16',
        name: 'ABB SH202-C16',
        price: 350,
        stock: 12,
        attributes: {},
      },
    ],
    loads: [],
    panels: [],
    bom: [],
    totals: { totalPowerW: 0, totalCurrentA: 0, occupiedModules: 0, estimatedCost: 0 },
    normIssues: [],
  },
  drawing: {
    canvas: { cols: 12, rows: 8, cellWidth: 100, cellHeight: 100 },
    nodes: [
      { nodeId: 'grid-input-1', x: 2, y: 1, width: 1, height: 1 },
      { nodeId: 'mcb-1', x: 4, y: 3, width: 1, height: 1 },
      { nodeId: 'load-1', x: 6, y: 5, width: 1, height: 1 },
    ],
    edges: [
      { edgeId: 'edge-1' },
      { edgeId: 'edge-2' },
    ],
  },
}

// 2. Export to Verilog
const exportResult = exportEngineeringProjectVerilog(originalDraft)
assert(typeof exportResult.source === 'string' && exportResult.source.length > 0, 'Export source is non-empty string')
assert(exportResult.source.includes('el_grid_input'), 'Verilog includes grid input module')
assert(exportResult.source.includes('el_mcb'), 'Verilog includes MCB module')
assert(exportResult.source.includes('.X_MM(50)'), 'Verilog includes X_MM coordinate for grid input (2 * 25)')
assert(exportResult.source.includes('.Y_MM(25)'), 'Verilog includes Y_MM coordinate for grid input (1 * 25)')
assert(exportResult.source.includes('.X_MM(100)'), 'Verilog includes X_MM coordinate for MCB (4 * 25)')
assert(exportResult.source.includes('.Y_MM(75)'), 'Verilog includes Y_MM coordinate for MCB (3 * 25)')
assert(exportResult.source.includes('PRODUCT_ID("prod-mcb-123")'), 'Verilog includes product ID binding')
assert(exportResult.source.includes('SKU("ABB-SH202-C16")'), 'Verilog includes SKU binding')

// 3. Parse and Interpret Verilog
const pipelineResult = parseAndInterpretVerilog(exportResult.source)
assert(pipelineResult.parseErrors.length === 0, 'No parse errors')
assert(pipelineResult.warnings.length === 0, 'No warnings')
assert(pipelineResult.autoLayoutApplied === false, 'Auto layout was not applied (coordinates were present)')

const parsedDraft = pipelineResult.draft
assert(parsedDraft.graph.nodes.length === 3, 'Draft contains 3 nodes')
assert(parsedDraft.graph.edges.length === 2, 'Draft contains 2 edges')

const parsedGridInput = parsedDraft.graph.nodes.find((n) => n.id === 'grid-input-1')
assert(!!parsedGridInput, 'Grid input found')
if (parsedGridInput) {
  assert(parsedGridInput.type === 'grid_input', 'Grid input type matches')
  assert(parsedGridInput.properties.currentA === 32, 'Grid input current matches')
}

const parsedMcb = parsedDraft.graph.nodes.find((n) => n.id === 'mcb-1')
assert(!!parsedMcb, 'MCB found')
if (parsedMcb) {
  assert(parsedMcb.properties.poles === '2P', 'MCB poles match')
  assert(parsedMcb.properties.curve === 'C', 'MCB curve matches')
}

const parsedDrawingMcb = parsedDraft.drawing.nodes.find((dn) => dn.nodeId === 'mcb-1')
assert(!!parsedDrawingMcb, 'Drawing MCB node found')
if (parsedDrawingMcb) {
  assert(parsedDrawingMcb.x === 4, 'MCB x grid coordinate matches original')
  assert(parsedDrawingMcb.y === 3, 'MCB y grid coordinate matches original')
}

const parsedBinding = parsedDraft.graph.catalogBindings.find((b) => b.nodeId === 'mcb-1')
assert(!!parsedBinding, 'Catalog binding found for MCB')
if (parsedBinding) {
  assert(parsedBinding.productId === 'prod-mcb-123', 'Product ID matches')
  assert(parsedBinding.sku === 'ABB-SH202-C16', 'SKU matches')
  assert(parsedBinding.stock === 12, 'Stock matches')
}

// 4. Test Auto-Layout
const verilogNoCoords = `
// Electronom EngineeringGraph Verilog bridge v2.1
// graphId=test-auto-layout
// draftId=draft-auto-layout
module electronom_project_auto_layout;

  // edge edge-1: input-1 -> mcb-1, conductor=L
  wire w_edge_1_L;

  el_grid_input #(
    .NODE_ID("input-1"),
    .LABEL("Grid Input"),
    .CURRENT_A(32),
    .PHASE(1),
    .VOLTAGE_V(230)
  ) input_1 ();

  el_mcb #(
    .NODE_ID("mcb-1"),
    .LABEL("Breaker"),
    .CURRENT_A(16),
    .POLES("2P"),
    .CURVE("C")
  ) mcb_1 ();

endmodule
`

const pipelineResultAuto = parseAndInterpretVerilog(verilogNoCoords)
assert(pipelineResultAuto.parseErrors.length === 0, 'No parse errors in auto-layout test')
assert(pipelineResultAuto.autoLayoutApplied === true, 'Auto layout was applied (no coordinates in source)')

const autoDraft = pipelineResultAuto.draft
const autoInputDrawing = autoDraft.drawing.nodes.find((dn) => dn.nodeId === 'input-1')
const autoMcbDrawing = autoDraft.drawing.nodes.find((dn) => dn.nodeId === 'mcb-1')

assert(!!autoInputDrawing && !!autoMcbDrawing, 'Drawing nodes generated')
if (autoInputDrawing && autoMcbDrawing) {
  assert(autoInputDrawing.y < autoMcbDrawing.y, 'Grid input is placed above MCB (lower layer)')
}

// 5. Test Parse Error
const invalidVerilog = `
module test;
  wire w_1;
  el_mcb #(
    .NODE_ID("mcb-1")
    // missing closing bracket/comma/paren
  mcb_1 ();
endmodule
`
const pipelineResultInvalid = parseAndInterpretVerilog(invalidVerilog)
assert(pipelineResultInvalid.parseErrors.length > 0, 'Parse errors detected for invalid Verilog')

console.log(`\nVerilog Tests Done. All passed: ${passed}`)
process.exit(passed ? 0 : 1)
