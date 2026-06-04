// scripts/test-engineering.ts
import 'dotenv/config'
import { CustomLoadInputSchema } from '../src/lib/engineering/validation'
import { buildEngineeringProject, defaultEngineeringInput } from '../src/lib/engineering/calculators'
import type { CustomLoadInput } from '../src/lib/engineering/types'
import { runNormGuard, NormIssue } from '../src/lib/engineering/normguard'
import { validateEngineeringGraph } from '../src/lib/engineering/graph-validation'
import type { EngineeringGraph, EngineeringNode } from '../src/lib/engineering/graph'

console.log('Running Engineering & NormGuard Unit Tests...')

let passed = true

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`FAIL: ${message}`)
    passed = false
  } else {
    console.log(`PASS: ${message}`)
  }
}

/**
 * Asserts that a NormIssue perfectly complies with the NormGuard contract.
 */
function assertNormIssueContract(issue: NormIssue, expectedCode: string) {
  assert(issue.code === expectedCode, `Issue code matches: expected '${expectedCode}', got '${issue.code}'`)
  
  // Severity-to-checkout blocking contract
  if (issue.severity === 'danger' || issue.severity === 'blocker') {
    assert(issue.blocksCheckout === true, `Danger/Blocker severity must block checkout (${issue.code})`)
  } else {
    assert(issue.blocksCheckout === false, `Warning/Info severity must NOT block checkout (${issue.code})`)
  }

  // Target ID exists
  assert(typeof issue.targetId === 'string' && issue.targetId.length > 0, `Issue targetId must be a non-empty string (${issue.code})`)

  // Keys exist
  assert(issue.titleKey.startsWith('normguard.'), `titleKey '${issue.titleKey}' must start with 'normguard.'`)
  assert(issue.messageKey.startsWith('normguard.'), `messageKey '${issue.messageKey}' must start with 'normguard.'`)

  // Source refs validity
  assert(issue.sourceRefs.length > 0, `Issue must have at least one source ref (${issue.code})`)
  for (const ref of issue.sourceRefs) {
    assert(ref.titleKey.startsWith('normguard.sources.'), `sourceRef titleKey '${ref.titleKey}' must start with 'normguard.sources.'`)
    if (ref.confidence === 'exact') {
      assert(typeof ref.documentId === 'string' && ref.documentId.length > 0, `Exact confidence ref must have documentId (${issue.code})`)
      assert(typeof ref.section === 'string' && ref.section.length > 0, `Exact confidence ref must have section (${issue.code})`)
      assert(typeof ref.verifiedAt === 'string' && ref.verifiedAt.length > 0, `Exact confidence ref must have verifiedAt (${issue.code})`)
    }
  }

  // Fix suggestions validity
  assert(issue.fixSuggestions.length > 0, `Issue must have at least one fix suggestion (${issue.code})`)
  for (const fix of issue.fixSuggestions) {
    assert(typeof fix.actionCode === 'string' && fix.actionCode.length > 0, `Fix suggestion actionCode must be defined (${issue.code})`)
    assert(fix.descriptionKey.startsWith('normguard.fixes.'), `fix descriptionKey '${fix.descriptionKey}' must start with 'normguard.fixes.'`)
  }
}

// ==========================================
// 1. PHASE 1: Legacy Validation Schema Checks
// ==========================================

const invalidPowerResult = CustomLoadInputSchema.safeParse({
  id: 'load-1',
  name: 'Test Light',
  kind: 'lighting',
  room: 'Living Room',
  powerW: -10, // Invalid power
  phase: 1,
  voltage: 230,
  critical: false,
  reservePowerRequired: false,
  dedicatedLineRequired: 'auto',
  routeLengthM: 15,
})
assert(!invalidPowerResult.success, 'Reject custom load with negative power')

const invalidRouteResult = CustomLoadInputSchema.safeParse({
  id: 'load-2',
  name: 'Test Light',
  kind: 'lighting',
  room: 'Living Room',
  powerW: 100,
  phase: 1,
  voltage: 230,
  critical: false,
  reservePowerRequired: false,
  dedicatedLineRequired: 'auto',
  routeLengthM: 400, // Max is 300
})
assert(!invalidRouteResult.success, 'Reject custom load with route > 300m')

const validLoadResult = CustomLoadInputSchema.safeParse({
  id: 'load-3',
  name: 'Test Light',
  kind: 'lighting',
  room: 'Living Room',
  powerW: 100,
  phase: 1,
  voltage: 230,
  critical: false,
  reservePowerRequired: false,
  dedicatedLineRequired: 'auto',
  routeLengthM: 15,
})
assert(validLoadResult.success, 'Accept valid custom load')

const invalidVoltageFor3Phase = CustomLoadInputSchema.safeParse({
  id: 'load-4',
  name: 'Three Phase Cooktop',
  kind: 'hob',
  room: 'Kitchen',
  powerW: 7000,
  phase: 3,
  voltage: 230, // Invalid for 3-phase
  critical: false,
  reservePowerRequired: false,
  dedicatedLineRequired: 'auto',
  routeLengthM: 15,
})
assert(!invalidVoltageFor3Phase.success, 'Reject 3-phase load with 230V voltage')

const validVoltageFor3Phase = CustomLoadInputSchema.safeParse({
  id: 'load-5',
  name: 'Three Phase Cooktop',
  kind: 'hob',
  room: 'Kitchen',
  powerW: 7000,
  phase: 3,
  voltage: 400, // Valid
  critical: false,
  reservePowerRequired: false,
  dedicatedLineRequired: 'auto',
  routeLengthM: 15,
})
assert(validVoltageFor3Phase.success, 'Accept 3-phase load with 400V voltage')

// Legacy standard wet load check
const customWetLoadWithoutRcd: CustomLoadInput = {
  id: 'wet-load-custom',
  name: 'Wet Area Heater',
  kind: 'custom',
  room: 'Basement',
  areaZone: 'damp',
  powerW: 2000,
  phase: 1,
  voltage: 230,
  critical: false,
  reservePowerRequired: false,
  dedicatedLineRequired: 'auto',
  routeLengthM: 15,
}

const projectWithWetDanger = buildEngineeringProject({
  ...defaultEngineeringInput,
  safetyLevel: 'standard',
  customLoads: [customWetLoadWithoutRcd],
}, [])

const hasWetDanger = projectWithWetDanger.normIssues.some(
  (issue) => issue.code === 'wet-zone-no-rcd'
)
assert(hasWetDanger, 'Flag danger when wet zone load has no RCD protection')

const backupLoad: CustomLoadInput = {
  id: 'backup-gen',
  name: 'Backup Generator Input',
  kind: 'generator_input',
  room: 'Garage',
  powerW: 5500,
  phase: 1,
  voltage: 230,
  critical: true,
  reservePowerRequired: false,
  dedicatedLineRequired: 'auto',
  routeLengthM: 5,
}

const projectWithBackup = buildEngineeringProject({
  ...defaultEngineeringInput,
  customLoads: [backupLoad],
}, [])

const hasBackupDanger = projectWithBackup.normIssues.some(
  (issue) => issue.code === 'backup-source-bonding'
)
assert(hasBackupDanger, 'Flag danger when backup source is present (needs ground bonding validation)')


// ==========================================
// 2. PHASE 2: NormGuard v2 Rule Engine Checks
// ==========================================

// Helper to create basic test graph
function createTestGraph(nodes: EngineeringNode[], edges: any[] = []): EngineeringGraph {
  return {
    id: 'test-graph',
    version: 1,
    locale: 'uk',
    network: {
      phase: 1,
      voltageV: 230,
      inputBreakerA: 25,
      earthingSystem: 'TN-S',
    },
    nodes: [
      { id: 'panel-1', type: 'distribution_panel', label: 'Main Panel', properties: { modules: 24 } },
      ...nodes,
    ],
    edges,
    catalogBindings: [],
    loads: [],
    panels: [],
    bom: [],
    totals: {
      totalPowerW: 0,
      totalCurrentA: 0,
      occupiedModules: 0,
      estimatedCost: 0,
    },
    normIssues: [],
  }
}

// 2.1 wet-zone-rcd rules
const wetGraphNoRcd = createTestGraph([
  { id: 'load-wet', type: 'load', label: 'Bathroom Heater', properties: { powerW: 1000, areaZone: 'bathroom_zone_1' } },
])
const wetIssuesNoRcd = runNormGuard(wetGraphNoRcd)
const wetNoRcdIssue = wetIssuesNoRcd.find((i) => i.code === 'wet-zone-no-rcd')
assert(!!wetNoRcdIssue, 'NormGuard v2 detects wet zone without RCD')
if (wetNoRcdIssue) assertNormIssueContract(wetNoRcdIssue, 'wet-zone-no-rcd')

const wetGraphWithHighRcd = createTestGraph(
  [
    { id: 'rcd-100', type: 'rcd', label: 'Upstream RCD', properties: { leakageMa: 100 } },
    { id: 'load-wet', type: 'load', label: 'Bathroom Heater', properties: { powerW: 1000, areaZone: 'bathroom_zone_1' } },
  ],
  [{ id: 'e1', source: 'rcd-100', target: 'load-wet' }]
)
const wetIssuesHighRcd = runNormGuard(wetGraphWithHighRcd)
const wetHighRcdIssue = wetIssuesHighRcd.find((i) => i.code === 'wet-zone-rcd-too-high')
assert(!!wetHighRcdIssue, 'NormGuard v2 flags danger if wet zone RCD leakage is too high (> 30mA)')
if (wetHighRcdIssue) assertNormIssueContract(wetHighRcdIssue, 'wet-zone-rcd-too-high')

const wetGraphWith30maRcd = createTestGraph(
  [
    { id: 'rcd-30', type: 'rcd', label: 'Upstream RCD', properties: { leakageMa: 30 } },
    { id: 'load-wet', type: 'load', label: 'Bathroom Heater', properties: { powerW: 1000, areaZone: 'bathroom_zone_1' } },
  ],
  [{ id: 'e1', source: 'rcd-30', target: 'load-wet' }]
)
const wetIssues30maRcd = runNormGuard(wetGraphWith30maRcd)
const wet30maRcdIssue = wetIssues30maRcd.find((i) => i.code === 'wet-zone-rcd-recommend-10ma')
assert(!!wet30maRcdIssue, 'NormGuard v2 issues warning recommending 10mA RCD for bathroom zones')
if (wet30maRcdIssue) assertNormIssueContract(wet30maRcdIssue, 'wet-zone-rcd-recommend-10ma')

// 2.2 ats-neutral rules
const atsGraphNoSwitch = createTestGraph([
  { id: 'ats-3p', type: 'ats', label: 'ATS Switcher', properties: { poles: '3P', switchesNeutral: false } },
  { id: 'generator', type: 'generator', label: 'Backup Gen', properties: { neutralMode: 'bonded' } },
])
atsGraphNoSwitch.network.phase = 3
const atsIssuesNoSwitch = runNormGuard(atsGraphNoSwitch)
const atsNoSwitchIssue = atsIssuesNoSwitch.find((i) => i.code === 'ats-neutral-no-switching')
assert(!!atsNoSwitchIssue, 'NormGuard v2 detects ATS with 3P not switching neutral when generator is present')
if (atsNoSwitchIssue) assertNormIssueContract(atsNoSwitchIssue, 'ats-neutral-no-switching')

const generatorAutoGraph = createTestGraph([
  { id: 'gen-auto', type: 'generator', label: 'Gen Auto', properties: { neutralMode: 'auto' } },
])
const genAutoIssues = runNormGuard(generatorAutoGraph)
const genAutoIssue = genAutoIssues.find((i) => i.code === 'backup-source-bonding')
assert(!!genAutoIssue, 'NormGuard v2 flags danger for generator neutral mode auto')
if (genAutoIssue) assertNormIssueContract(genAutoIssue, 'backup-source-bonding')

// 2.3 cable-breaker rules
const cableOverprotectedGraph = createTestGraph(
  [
    { id: 'mcb-25', type: 'mcb', label: '25A Breaker', properties: { currentA: 25 } },
    { id: 'cable-15', type: 'cable_line', label: '1.5mm2 Cable', properties: { sectionMm2: 1.5, material: 'Cu' } },
  ],
  [{ id: 'e1', source: 'mcb-25', target: 'cable-15' }]
)
const cableOverprotectedIssues = runNormGuard(cableOverprotectedGraph)
const cableOverprotectedIssue = cableOverprotectedIssues.find((i) => i.code === 'cable-overprotected')
assert(!!cableOverprotectedIssue, 'NormGuard v2 detects cable overprotected by breaker')
if (cableOverprotectedIssue) assertNormIssueContract(cableOverprotectedIssue, 'cable-overprotected')

const cableSafeGraph = createTestGraph(
  [
    { id: 'mcb-16', type: 'mcb', label: '16A Breaker', properties: { currentA: 16 } },
    { id: 'cable-25', type: 'cable_line', label: '2.5mm2 Cable', properties: { sectionMm2: 2.5, material: 'Cu' } },
  ],
  [{ id: 'e1', source: 'mcb-16', target: 'cable-25' }]
)
const cableSafeIssues = runNormGuard(cableSafeGraph)
assert(
  cableSafeIssues.filter((i) => i.code === 'cable-overprotected').length === 0,
  'NormGuard v2 allows cable properly protected by breaker'
)

// 2.4 al-cu-compatibility rules
const directAlCuGraph = createTestGraph(
  [
    { id: 'cable-cu', type: 'cable_line', label: 'Cu Cable', properties: { material: 'Cu' } },
    { id: 'cable-al', type: 'cable_line', label: 'Al Cable', properties: { material: 'Al' } },
  ],
  [{ id: 'e1', source: 'cable-cu', target: 'cable-al' }]
)
const directAlCuIssues = runNormGuard(directAlCuGraph)
const directAlCuIssue = directAlCuIssues.find((i) => i.code === 'direct-al-cu-connection')
assert(!!directAlCuIssue, 'NormGuard v2 flags danger for direct connection between Cu and Al wires')
if (directAlCuIssue) assertNormIssueContract(directAlCuIssue, 'direct-al-cu-connection')

const terminalCuOnlyGraph = createTestGraph(
  [
    { id: 'cable-al', type: 'cable_line', label: 'Al Cable', properties: { material: 'Al' } },
    { id: 'term-cu', type: 'terminal', label: 'Cu-Only Terminal', properties: { materialsSupported: ['Cu'] } },
  ],
  [{ id: 'e1', source: 'cable-al', target: 'term-cu' }]
)
const terminalCuOnlyIssues = runNormGuard(terminalCuOnlyGraph)
const terminalCuOnlyIssue = terminalCuOnlyIssues.find((i) => i.code === 'terminal-cu-only')
assert(!!terminalCuOnlyIssue, 'NormGuard v2 flags danger if Al wire is connected to a Cu-only terminal')
if (terminalCuOnlyIssue) assertNormIssueContract(terminalCuOnlyIssue, 'terminal-cu-only')

// 2.5 terminal-compatibility rules
const terminalSectionOutGraph = createTestGraph(
  [
    { id: 'cable-4', type: 'cable_line', label: '4mm2 Cable', properties: { sectionMm2: 4 } },
    { id: 'term-small', type: 'terminal', label: 'Small Terminal', properties: { sectionRangeMm2: [0.5, 2.5] } },
  ],
  [{ id: 'e1', source: 'cable-4', target: 'term-small' }]
)
const terminalSectionOutIssues = runNormGuard(terminalSectionOutGraph)
const terminalSectionOutIssue = terminalSectionOutIssues.find((i) => i.code === 'terminal-section-out-of-range')
assert(!!terminalSectionOutIssue, 'NormGuard v2 flags danger when wire section is out of range')
if (terminalSectionOutIssue) assertNormIssueContract(terminalSectionOutIssue, 'terminal-section-out-of-range')

const terminalStrandUnsupportedGraph = createTestGraph(
  [
    { id: 'cable-flex', type: 'cable_line', label: 'Flex Wires', properties: { strandType: 'flexible' } },
    { id: 'term-solid', type: 'terminal', label: 'Solid-Only Terminal', properties: { strandTypes: ['solid'] } },
  ],
  [{ id: 'e1', source: 'cable-flex', target: 'term-solid' }]
)
const terminalStrandUnsupportedIssues = runNormGuard(terminalStrandUnsupportedGraph)
const terminalStrandUnsupportedIssue = terminalStrandUnsupportedIssues.find((i) => i.code === 'terminal-strand-unsupported')
assert(!!terminalStrandUnsupportedIssue, 'NormGuard v2 flags danger when flexible strand connects to solid-only terminal')
if (terminalStrandUnsupportedIssue) assertNormIssueContract(terminalStrandUnsupportedIssue, 'terminal-strand-unsupported')

const terminalRequiresFerruleGraph = createTestGraph(
  [
    { id: 'cable-flex', type: 'cable_line', label: 'Flex Wires', properties: { strandType: 'flexible', requiresFerrule: false } },
    { id: 'term-screw', type: 'terminal', label: 'Screw Terminal', properties: { strandTypes: ['solid', 'flexible'], requiresFerruleForFlexible: true } },
  ],
  [{ id: 'e1', source: 'cable-flex', target: 'term-screw' }]
)
const terminalRequiresFerruleIssues = runNormGuard(terminalRequiresFerruleGraph)
const terminalRequiresFerruleIssue = terminalRequiresFerruleIssues.find((i) => i.code === 'terminal-requires-ferrule')
assert(!!terminalRequiresFerruleIssue, 'NormGuard v2 issues warning if flexible strand wire connects to terminal requiring ferrule')
if (terminalRequiresFerruleIssue) assertNormIssueContract(terminalRequiresFerruleIssue, 'terminal-requires-ferrule')

// 2.6 voltage-drop rules
const voltageDropGraph = createTestGraph(
  [
    { id: 'cable-long', type: 'cable_line', label: 'Long Cable', properties: { sectionMm2: 1.5, material: 'Cu', routeLengthM: 100, currentA: 16 } },
    { id: 'load-high', type: 'load', label: 'High Load', properties: { powerW: 3680 } }, // 16A at 230V
  ],
  [
    { id: 'e1', source: 'cable-long', target: 'load-high' }
  ]
)
const voltageDropIssues = runNormGuard(voltageDropGraph)
const voltageDropIssue = voltageDropIssues.find((i) => i.code === 'voltage-drop-excessive')
assert(!!voltageDropIssue, 'NormGuard v2 detects excessive voltage drop')
if (voltageDropIssue) assertNormIssueContract(voltageDropIssue, 'voltage-drop-excessive')

// 2.7 panel-capacity rules
const panelOverflowGraph = createTestGraph([
  { id: 'mcb-1', type: 'mcb', label: 'MCB 1', properties: { poles: '3P' } }, // 3 mod
  { id: 'mcb-2', type: 'mcb', label: 'MCB 2', properties: { poles: '4P' } }, // 4 mod
  { id: 'rcd-1', type: 'rcd', label: 'RCD 1', properties: { poles: '4P' } }, // 4 mod
  { id: 'relay-1', type: 'voltage_relay', label: 'Zubr', properties: { modules: 3 } }, // 3 mod
  { id: 'meter-1', type: 'meter', label: 'Meter', properties: { modules: 4 } }, // 4 mod
])
const panelNode = panelOverflowGraph.nodes.find((n) => n.type === 'distribution_panel')!
panelNode.properties.modules = 12

const panelOverflowIssues = runNormGuard(panelOverflowGraph)
const panelOverflowIssue = panelOverflowIssues.find((i) => i.code === 'panel-overflow')
assert(!!panelOverflowIssue, 'NormGuard v2 detects module overflow in distribution panel')
if (panelOverflowIssue) assertNormIssueContract(panelOverflowIssue, 'panel-overflow')

const panelLowReserveGraph = createTestGraph([
  { id: 'mcb-1', type: 'mcb', label: 'MCB 1', properties: { poles: '4P' } }, // 4 mod
  { id: 'rcd-1', type: 'rcd', label: 'RCD 1', properties: { poles: '4P' } }, // 4 mod
  { id: 'relay-1', type: 'voltage_relay', label: 'Zubr', properties: { modules: 3 } }, // 3 mod
])
const panelNode2 = panelLowReserveGraph.nodes.find((n) => n.type === 'distribution_panel')!
panelNode2.properties.modules = 12

const panelLowReserveIssues = runNormGuard(panelLowReserveGraph)
const panelLowReserveIssue = panelLowReserveIssues.find((i) => i.code === 'panel-low-reserve')
assert(!!panelLowReserveIssue, 'NormGuard v2 warns when distribution panel reserve is less than 20%')
if (panelLowReserveIssue) assertNormIssueContract(panelLowReserveIssue, 'panel-low-reserve')


// ==========================================
// 3. PHASE 3: Structural Validation Checks
// ==========================================

// 3.1 Edge referring to non-existent nodes
const invalidEdgeGraph = createTestGraph(
  [
    { id: 'mcb-valid', type: 'mcb', label: 'Valid MCB', properties: {} }
  ],
  [
    { id: 'e-bad', source: 'mcb-valid', target: 'non-existent-node-id' }
  ]
)
const invalidEdgeIssues = runNormGuard(invalidEdgeGraph)
assert(
  invalidEdgeIssues.some((i) => i.code === 'graph-invalid-edge' && i.blocksCheckout && i.severity === 'danger'),
  'validateEngineeringGraph rejects edges linking to non-existent nodes'
)

// 3.2 Duplicate node IDs
const duplicateNodeGraph = createTestGraph([
  { id: 'dup-1', type: 'mcb', label: 'MCB 1', properties: {} },
  { id: 'dup-1', type: 'rcd', label: 'RCD 1', properties: {} },
])
const duplicateNodeIssues = runNormGuard(duplicateNodeGraph)
assert(
  duplicateNodeIssues.some((i) => i.code === 'graph-duplicate-node' && i.blocksCheckout && i.severity === 'danger'),
  'validateEngineeringGraph rejects duplicate node IDs'
)

// 3.3 Invalid node properties type/range
const invalidPropsGraph = createTestGraph([
  { id: 'mcb-bad', type: 'mcb', label: 'Bad MCB', properties: { phase: 5 } }, // Expected 1 or 3
])
const invalidPropsIssues = runNormGuard(invalidPropsGraph)
assert(
  invalidPropsIssues.some((i) => i.code === 'graph-invalid-properties' && i.blocksCheckout && i.severity === 'danger'),
  'validateEngineeringGraph rejects invalid property value for phase'
)

// 3.4 Completely safe graph produces zero issues
const safeGraph = createTestGraph(
  [
    { id: 'mcb-1', type: 'mcb', label: 'MCB 16A', properties: { currentA: 16 } },
    { id: 'cable-1', type: 'cable_line', label: 'Cable 2.5mm2', properties: { sectionMm2: 2.5, material: 'Cu', routeLengthM: 10 } },
    { id: 'load-1', type: 'load', label: 'Normal Socket', properties: { powerW: 1000, areaZone: 'dry' } },
  ],
  [
    { id: 'e1', source: 'mcb-1', target: 'cable-1' },
    { id: 'e2', source: 'cable-1', target: 'load-1' },
  ]
)
const safeIssues = runNormGuard(safeGraph)
assert(safeIssues.length === 0, 'Completely safe graph produces zero issues')


// ==========================================
// 4. PHASE 2A: Catalog Binding, Quality Gate, and BOM Calculations
// ==========================================
import { passesQualityGate, scoreProductCompatibility, findCompatibleProductsForNode } from '../src/lib/engineering/catalog-binding'
import { computeBOMAndTotals } from '../src/lib/engineering/bom'
import type { EngineeringCatalogProduct } from '../src/lib/engineering/types'

// Mock products
const validBreakerProduct: EngineeringCatalogProduct = {
  id: 'prod-breaker-1',
  slug: 'breaker-16a-1p-c',
  sku: 'MCB-16-1-C',
  name: 'Automated Breaker 16A 1P C-curve',
  price: 150,
  stock: 10,
  categorySlug: 'avtomatychni-vymykachi',
  brandName: 'ElektronomBrand',
  imageUrl: 'https://images.elektronom.ua/mcb-16-1-c.png',
  attributes: {
    engineeringRole: 'breaker',
    poles: '1P',
    ratedCurrentA: 16,
    curve: 'C',
    standard: 'IEC 60898-1',
  },
}

const invalidBreakerNoImage: EngineeringCatalogProduct = {
  ...validBreakerProduct,
  id: 'prod-breaker-2',
  imageUrl: null, // missing photo
}

const invalidBreakerNoCert: EngineeringCatalogProduct = {
  ...validBreakerProduct,
  id: 'prod-breaker-3',
  attributes: {
    engineeringRole: 'breaker',
    poles: '1P',
    ratedCurrentA: 16,
    curve: 'C',
    // missing standard, manufacturerDoc, safetySource
  },
}

// 4.1 ProductQualityGate Checks
const gateValid = passesQualityGate(validBreakerProduct)
assert(gateValid.passes, 'Valid product passes ProductQualityGate')

const gateNoImg = passesQualityGate(invalidBreakerNoImage)
assert(!gateNoImg.passes && gateNoImg.reasons.includes('missing_image'), 'Flag quality gate error for missing image')

const gateNoCert = passesQualityGate(invalidBreakerNoCert)
assert(!gateNoCert.passes && gateNoCert.reasons.includes('missing_safety_certification'), 'Flag quality gate error for missing safety certification on breaker')

// 4.2 scoreProductCompatibility Checks
const mcbNode: EngineeringNode = {
  id: 'mcb-node-1',
  type: 'mcb',
  label: 'MCB 16A 1P C',
  properties: {
    poles: '1P',
    currentA: 16,
    curve: 'C',
  },
}

const matchScore = scoreProductCompatibility(mcbNode, validBreakerProduct)
assert(matchScore.score > 80, `Compatible breaker scores highly: ${matchScore.score}`)

const poleMismatchBreaker: EngineeringCatalogProduct = {
  ...validBreakerProduct,
  id: 'prod-breaker-4',
  attributes: {
    ...validBreakerProduct.attributes,
    poles: '3P', // mismatch
  },
}
const poleMismatchScore = scoreProductCompatibility(mcbNode, poleMismatchBreaker)
assert(poleMismatchScore.score === 0 && poleMismatchScore.reasons.includes('poles_mismatch'), 'Score 0 for poles mismatch on breaker')

const currentMismatchBreaker: EngineeringCatalogProduct = {
  ...validBreakerProduct,
  id: 'prod-breaker-5',
  attributes: {
    ...validBreakerProduct.attributes,
    ratedCurrentA: 25, // mismatch
  },
}
const currentMismatchScore = scoreProductCompatibility(mcbNode, currentMismatchBreaker)
assert(currentMismatchScore.score === 0 && currentMismatchScore.reasons.includes('current_mismatch'), 'Score 0 for current rating mismatch on breaker')

const suboptimalCurveBreaker: EngineeringCatalogProduct = {
  ...validBreakerProduct,
  id: 'prod-breaker-6',
  attributes: {
    ...validBreakerProduct.attributes,
    curve: 'B', // suboptimal compared to C
  },
}
const curveSuboptimalScore = scoreProductCompatibility(mcbNode, suboptimalCurveBreaker)
assert(curveSuboptimalScore.score > 0 && curveSuboptimalScore.reasons.includes('curve_suboptimal'), 'Curve mismatch is penalized but not scored 0')

// 4.3 computeBOMAndTotals Checks
const bomGraph = createTestGraph(
  [
    { id: 'mcb-n1', type: 'mcb', label: 'MCB 16A 1P C', properties: { poles: '1P', currentA: 16, curve: 'C' } },
    { id: 'cable-n1', type: 'cable_line', label: 'Cable line', properties: { cores: 3, sectionMm2: 2.5, material: 'Cu', routeLengthM: 20 } },
    { id: 'load-n1', type: 'load', label: 'Appliance', properties: { powerW: 2300 } }, // 10A at 230V
  ],
  [
    { id: 'e1', source: 'panel-1', target: 'mcb-n1' },
    { id: 'e2', source: 'mcb-n1', target: 'cable-n1' },
    { id: 'e3', source: 'cable-n1', target: 'load-n1' },
  ]
)

const cableProduct: EngineeringCatalogProduct = {
  id: 'prod-cable-1',
  slug: 'cable-3x2-5-cu',
  sku: 'CABLE-3-25-CU',
  name: 'Copper Cable 3x2.5mm2',
  price: 40,
  stock: 500,
  categorySlug: 'kabeli',
  brandName: 'ElektronomBrand',
  imageUrl: 'https://images.elektronom.ua/cable-3-2.5.png',
  attributes: {
    engineeringRole: 'cable',
    material: 'Cu',
    cores: 3,
    sectionMm2: 2.5,
  },
}

const panelProduct: EngineeringCatalogProduct = {
  id: 'prod-panel-1',
  slug: 'panel-24-modules',
  sku: 'PANEL-24',
  name: 'Distribution Panel 24 Modules',
  price: 600,
  stock: 5,
  categorySlug: 'schytky',
  brandName: 'ElektronomBrand',
  imageUrl: 'https://images.elektronom.ua/panel-24.png',
  attributes: {
    engineeringRole: 'panel',
    capacityModules: 24,
  },
}

const mockCatalog = [validBreakerProduct, cableProduct, panelProduct]
const bomResult = computeBOMAndTotals(bomGraph, mockCatalog)

// Check BOM items count (breaker + cable + panel)
assert(bomResult.bom.length === 3, `BOM computes 3 physical products (mcb, cable, panel): got ${bomResult.bom.length}`)

// Check cable quantity calculation: 20m * 1.1 = 22m
const cableBomItem = bomResult.bom.find((i) => i.role === 'cable')
assert(cableBomItem?.qty === 22, `Cable quantity calculated with 10% cutting margin: expected 22, got ${cableBomItem?.qty}`)

// Check panel modules occupied count: panel-1 = 0, mcb-n1 = 1P (1 module)
assert(bomResult.totals.occupiedModules === 1, `Occupied DIN space modules computed correctly: expected 1, got ${bomResult.totals.occupiedModules}`)

// Check panel snapshot
const panelSnapshot = bomResult.panels.find((p) => p.id === 'panel-1')
assert(panelSnapshot?.reserveModules === 23, `Reserve modules inside panel calculated correctly: expected 23, got ${panelSnapshot?.reserveModules}`)

// Check total diversified current
// Power = 2300W. Diversified = 2300 * 0.62 = 1426W. Current = 1426 / 230 = 6.2A
assert(bomResult.totals.totalCurrentA === 6.2, `Total diversified current is calculated: expected 6.2, got ${bomResult.totals.totalCurrentA}`)

// Check total cost: 150 (breaker) + 40 * 22 (cable) + 600 (panel) = 150 + 880 + 600 = 1630
assert(bomResult.totals.estimatedCost === 1630, `Total cost computed correctly: expected 1630, got ${bomResult.totals.estimatedCost}`)

// ==========================================
// 5. Server Action Checks (Phase 2B)
// ==========================================

async function runAsyncTests() {
  const { prisma } = await import('../src/lib/prisma')
  const { findCompatibleProducts } = await import('../src/actions/engineering')

  // --- Test IDs for cleanup ---
  const TEST_PREFIX = '__engtest_'
  const testCategoryId = TEST_PREFIX + 'cat_' + Date.now()
  const testBrandId = TEST_PREFIX + 'brand_' + Date.now()
  const testProductId1 = TEST_PREFIX + 'prod1_' + Date.now()
  const testProductId2 = TEST_PREFIX + 'prod2_' + Date.now()

  if (process.env.ENGINEERING_DB_TESTS === '1') {
    try {
      // --- 5.0 Seed deterministic test products ---
      console.log('\n--- Seeding test products for Phase 2B ---')

      // Create test category
      await prisma.category.create({
        data: {
          id: testCategoryId,
          slug: TEST_PREFIX + 'breakers',
          sortOrder: 9999,
          translations: {
            create: { locale: 'uk', name: 'Test Breakers (eng test)' },
          },
        },
      })

      // Create test brand
      await prisma.brand.create({
        data: {
          id: testBrandId,
          slug: TEST_PREFIX + 'brand',
          name: 'TestBrand',
        },
      })

      // Product 1: Matches MCB 1P/16A/C perfectly → should get high score
      await prisma.product.create({
        data: {
          id: testProductId1,
          slug: TEST_PREFIX + 'breaker-c16-1p',
          sku: TEST_PREFIX + 'SKU001',
          categoryId: testCategoryId,
          brandId: testBrandId,
          price: 120.00,
          stock: 50,
          isActive: true,
          attributes: {
            engineeringRole: 'breaker',
            poles: '1P',
            ratedCurrentA: 16,
            curve: 'C',
            standard: 'IEC 60898-1',
          },
          translations: {
            create: { locale: 'uk', name: 'Тест автомат C16 1P' },
          },
          images: {
            create: { url: 'https://example.com/test-breaker.jpg', sortOrder: 0 },
          },
        },
      })

      // Product 2: Matches MCB 1P/16A but curve B → should get lower score (curve penalty)
      await prisma.product.create({
        data: {
          id: testProductId2,
          slug: TEST_PREFIX + 'breaker-b16-1p',
          sku: TEST_PREFIX + 'SKU002',
          categoryId: testCategoryId,
          brandId: testBrandId,
          price: 95.00,
          stock: 30,
          isActive: true,
          attributes: {
            engineeringRole: 'breaker',
            poles: '1P',
            ratedCurrentA: 16,
            curve: 'B',
            standard: 'IEC 60898-1',
          },
          translations: {
            create: { locale: 'uk', name: 'Тест автомат B16 1P' },
          },
          images: {
            create: { url: 'https://example.com/test-breaker-b.jpg', sortOrder: 0 },
          },
        },
      })

      console.log('Seeded 2 test products with engineeringRole=breaker')

      // --- 5.1 Action executes without error ---
      const result = await findCompatibleProducts({
        node: {
          id: 'test-mcb',
          type: 'mcb',
          label: 'Test MCB C16',
          properties: {
            poles: '1P',
            currentA: 16,
            curve: 'C',
          },
        },
        locale: 'uk',
      })

      assert(result.success === true, 'findCompatibleProducts action executes successfully')

      // --- 5.2 Returns at least one product ---
      assert(result.products.length >= 2, `findCompatibleProducts returns >= 2 seeded products, got ${result.products.length}`)

      // --- 5.3 All returned products have matching engineering role ---
      for (const item of result.products) {
        const attrRole = item.product.attributes.engineeringRole
        assert(attrRole === 'breaker', `Returned product ${item.product.sku} has engineeringRole=breaker, got '${attrRole}'`)
      }

      // --- 5.4 Every result has score > 0 ---
      for (const item of result.products) {
        assert(item.score > 0, `Product ${item.product.sku} has score > 0, got ${item.score}`)
      }

      // --- 5.5 Results are sorted by score descending ---
      for (let i = 1; i < result.products.length; i++) {
        const prev = result.products[i - 1]!
        const curr = result.products[i]!
        assert(
          prev.score > curr.score || (prev.score === curr.score && prev.product.price <= curr.product.price),
          `Sort order: product[${i - 1}] score=${prev.score} price=${prev.product.price} >= product[${i}] score=${curr.score} price=${curr.product.price}`
        )
      }

      // --- 5.6 Product with exact curve match (C) scores higher than curve mismatch (B) ---
      const exactMatch = result.products.find(p => p.product.sku === TEST_PREFIX + 'SKU001')
      const curveSuboptimal = result.products.find(p => p.product.sku === TEST_PREFIX + 'SKU002')
      if (exactMatch && curveSuboptimal) {
        assert(
          exactMatch.score > curveSuboptimal.score,
          `Exact curve match (score=${exactMatch.score}) scores higher than suboptimal curve (score=${curveSuboptimal.score})`
        )
      } else {
        assert(false, 'Both seeded test products must be in the results')
      }

      // --- 5.7 Quality gate has expected structure ---
      for (const item of result.products) {
        assert(typeof item.qualityGate.passes === 'boolean', `qualityGate.passes is boolean for ${item.product.sku}`)
        assert(Array.isArray(item.qualityGate.reasons), `qualityGate.reasons is array for ${item.product.sku}`)
      }

      // --- 5.8 Returned attributes are projected (no internal/admin keys leaked) ---
      const allowedAttrKeys = new Set([
        'engineeringRole', 'ratedCurrentA', 'currentA', 'voltageV', 'poles', 'curve',
        'leakageMa', 'phase', 'sectionMm2', 'cores', 'strandType',
        'modules', 'certifications', 'hasSafetyCert',
      ])
      for (const item of result.products) {
        for (const key of Object.keys(item.product.attributes)) {
          assert(allowedAttrKeys.has(key), `Attribute key '${key}' is in public projection allowlist for ${item.product.sku}`)
        }
      }

      // --- 5.9 Error message does not leak raw Prisma/DB details ---
      // Intentionally pass invalid input to trigger error path
      const badResult = await findCompatibleProducts({ node: null, locale: 'uk' })
      assert(badResult.success === false, 'Invalid input returns success=false')
      assert(
        badResult.error === 'invalidInput' || badResult.error === 'catalogLookupFailed',
        `Error message is a stable code, not raw DB error: got '${badResult.error}'`
      )

      // --- 5.10 'accessory' role returns empty array without error ---
      const accessoryResult = await findCompatibleProducts({
        node: {
          id: 'test-meter',
          type: 'meter',
          label: 'Meter',
          properties: {},
        },
        locale: 'uk',
      })
      assert(accessoryResult.success === true, 'Accessory/unmapped type returns success=true')
      assert(accessoryResult.products.length === 0, 'Accessory/unmapped type returns empty products array')

      console.log(`\nPhase 2B: Action matched ${result.products.length} compatible products from DB.`)

    } catch (error) {
      console.error('Failed to run Phase 2B server action tests:', error)
      passed = false
    } finally {
      // --- Cleanup seeded test data ---
      console.log('\n--- Cleaning up test data ---')
      try {
        // Delete in order: images, translations, products, brand, category translations, category
        await prisma.productImage.deleteMany({ where: { productId: { in: [testProductId1, testProductId2] } } })
        await prisma.productTranslation.deleteMany({ where: { productId: { in: [testProductId1, testProductId2] } } })
        await prisma.product.deleteMany({ where: { id: { in: [testProductId1, testProductId2] } } })
        await prisma.brand.deleteMany({ where: { id: testBrandId } })
        await prisma.categoryTranslation.deleteMany({ where: { categoryId: testCategoryId } })
        await prisma.category.deleteMany({ where: { id: testCategoryId } })
        console.log('Test data cleaned up successfully.')
      } catch (cleanupErr) {
        console.error('Warning: cleanup of test data failed:', cleanupErr)
      }
    }
  } else {
    console.log('\n--- Skipping DB-mutating Phase 2B tests. Set ENGINEERING_DB_TESTS=1 to run them. ---')
  }

  // ==========================================
  // 6. EXIT REPORT
  // ==========================================
  if (!passed) {
    console.error('Some tests failed!')
    process.exit(1)
  } else {
    console.log('All Engineering & NormGuard tests passed successfully!')
  }
}

runAsyncTests()
