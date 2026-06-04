import type {
  BreakerSelection,
  CableSelection,
  ElectricalPanelPlan,
  EngineeringBOMItem,
  EngineeringCatalogProduct,
  EngineeringLine,
  EngineeringLoad,
  EngineeringProductRole,
  EngineeringProject,
  EngineeringProjectInput,
  EngineeringWarning,
  ProductAlternative,
  ProductRecommendation,
  RcdSelection,
  ComplexityResult,
  NormIssue,
} from './types'
import type { EngineeringGraph, EngineeringNode, EngineeringEdge, EngineeringNodeType } from './graph'
import { runNormGuard } from './normguard'
import { computeBOMAndTotals } from './bom'

const VOLTAGE_1P = 230
const VOLTAGE_3P = 400
const COPPER_RESISTIVITY = 0.0175

function currentFor(powerW: number, phase: 1 | 3) {
  if (phase === 3) return powerW / (Math.sqrt(3) * VOLTAGE_3P * 0.95)
  return powerW / VOLTAGE_1P
}

function voltageDropPct(currentA: number, lengthM: number, sectionMm2: number, phase: 1 | 3) {
  const factor = phase === 3 ? Math.sqrt(3) : 2
  const voltage = phase === 3 ? VOLTAGE_3P : VOLTAGE_1P
  return Number((((factor * lengthM * currentA * COPPER_RESISTIVITY) / (sectionMm2 * voltage)) * 100).toFixed(2))
}

function selectCable(kind: EngineeringLoad['kind'], currentA: number, phase: 1 | 3, lengthM: number): CableSelection {
  let sectionMm2 = 2.5
  if (kind === 'lighting') sectionMm2 = 1.5
  if (kind === 'hob') sectionMm2 = 6
  if (kind === 'oven' || currentA > 18) sectionMm2 = Math.max(sectionMm2, 4)
  if (currentA > 25) sectionMm2 = Math.max(sectionMm2, 6)

  let drop = voltageDropPct(currentA, lengthM, sectionMm2, phase)
  if (drop > 5 && sectionMm2 < 4) {
    sectionMm2 = 4
    drop = voltageDropPct(currentA, lengthM, sectionMm2, phase)
  }
  if (drop > 5 && sectionMm2 < 6) {
    sectionMm2 = 6
    drop = voltageDropPct(currentA, lengthM, sectionMm2, phase)
  }

  const cores = phase === 3 ? 5 : 3
  return {
    cores,
    sectionMm2,
    material: 'copper',
    label: `${cores}x${sectionMm2} mm2 Cu`,
    voltageDropPct: drop,
  }
}

function selectBreaker(kind: EngineeringLoad['kind'], cable: CableSelection, phase: 1 | 3): BreakerSelection {
  const bySection: Record<number, number> = {
    1.5: 10,
    2.5: 16,
    4: 25,
    6: 32,
  }
  const currentA = bySection[cable.sectionMm2] ?? 16
  return {
    poles: phase === 3 ? '3P' : kind === 'lighting' ? '1P' : '2P',
    currentA,
    curve: 'C',
    label: `${phase === 3 ? '3P' : kind === 'lighting' ? '1P' : '2P'} C${currentA}`,
  }
}

function selectRcd(kind: EngineeringLoad['kind'], breaker: BreakerSelection, phase: 1 | 3, enhanced: boolean): RcdSelection | undefined {
  const needsProtection = enhanced || ['bathroom_socket', 'boiler', 'washing_machine', 'dishwasher', 'hob'].includes(kind)
  if (!needsProtection) return undefined
  return {
    kind: 'dif',
    currentA: Math.max(breaker.currentA, 16),
    leakageMa: kind === 'bathroom_socket' ? 10 : 30,
    poles: phase === 3 ? '4P' : '2P',
    label: `${phase === 3 ? '4P' : '2P'} ${Math.max(breaker.currentA, 16)}A / ${kind === 'bathroom_socket' ? 10 : 30}mA`,
  }
}

function load(id: string, name: string, kind: EngineeringLoad['kind'], powerW: number, phase: 1 | 3, wetZone = false, critical = false): EngineeringLoad {
  return {
    id,
    name,
    kind,
    powerW,
    phase,
    voltage: phase === 3 ? 400 : 230,
    wetZone,
    critical,
  }
}

export function buildLoads(input: EngineeringProjectInput): EngineeringLoad[] {
  if (input.customLoads && input.customLoads.length > 0) {
    return input.customLoads.map((item) => {
      const isWet = item.areaZone ? ['damp', 'bathroom_zone_0', 'bathroom_zone_1', 'bathroom_zone_2'].includes(item.areaZone) : false
      const mapped: EngineeringLoad = {
        id: item.id,
        name: item.name,
        kind: item.kind,
        powerW: item.powerW,
        phase: item.phase,
        voltage: item.voltage,
        wetZone: isWet,
        critical: item.critical,
      }
      if (item.reservePowerRequired !== undefined) {
        mapped.reservePowerRequired = item.reservePowerRequired
      }
      if (item.dedicatedLineRequired !== undefined) {
        mapped.dedicatedLineRequired = item.dedicatedLineRequired
      }
      if (item.routeLengthM !== undefined) {
        mapped.routeLengthM = item.routeLengthM
      }
      if (item.room !== undefined) {
        mapped.room = item.room
      }
      if (item.areaZone !== undefined) {
        mapped.areaZone = item.areaZone
      }
      return mapped
    })
  }

  const loads: EngineeringLoad[] = [
    load('lighting', 'lighting', 'lighting', Math.max(600, input.areaM2 * 12), 1),
    load('sockets', 'socket_group', 'socket_group', Math.max(2500, input.rooms * 1800), 1),
    load('kitchen', 'kitchen_socket', 'kitchen_socket', 3500, 1),
    load('bathroom', 'bathroom_socket', 'bathroom_socket', 1800, 1, true),
  ]

  if (input.hasBoiler) loads.push(load('boiler', 'boiler', 'boiler', 2000, 1, true))
  if (input.hasWasher) loads.push(load('washer', 'washing_machine', 'washing_machine', 2200, 1, true))
  if (input.hasDishwasher) loads.push(load('dishwasher', 'dishwasher', 'dishwasher', 2000, 1))
  if (input.hasOven) loads.push(load('oven', 'oven', 'oven', 3200, 1))
  if (input.hasElectricHob) loads.push(load('hob', 'hob', 'hob', input.phase === 3 ? 9000 : 7000, input.phase))
  if (input.hasConditioner) loads.push(load('conditioner', 'conditioner', 'conditioner', 2500, 1))
  if (input.includeWeakCurrent) loads.push(load('router', 'router', 'router', 150, 1, false, true))

  return loads
}

function buildLines(input: EngineeringProjectInput, loads: EngineeringLoad[]) {
  return loads.map((item): EngineeringLine => {
    const current = currentFor(item.powerW, item.phase)
    const itemRouteLength = item.routeLengthM !== undefined ? item.routeLengthM : input.routeLengthM
    const cable = selectCable(item.kind, current, item.phase, itemRouteLength)
    const breaker = selectBreaker(item.kind, cable, item.phase)
    const rcd = selectRcd(item.kind, breaker, item.phase, input.safetyLevel === 'enhanced')
    const warnings: EngineeringWarning[] = []

    if (cable.voltageDropPct > 5) {
      warnings.push({
        code: 'voltage-drop',
        level: 'warning',
        params: { drop: cable.voltageDropPct },
      })
    }

    if (breaker.currentA > input.inputBreakerA && item.phase === 1) {
      warnings.push({
        code: 'input-limit',
        level: 'warning',
        params: { name: item.name, breaker: breaker.label, limit: input.inputBreakerA },
      })
    }

    const line: EngineeringLine = {
      id: `line-${item.id}`,
      name: item.name,
      loads: [item],
      totalPowerW: item.powerW,
      calculatedCurrentA: Number(current.toFixed(1)),
      cable,
      breaker,
      warnings,
    }
    if (rcd !== undefined) {
      line.rcd = rcd
    }
    return line
  })
}

function buildPanel(lines: EngineeringLine[]): ElectricalPanelPlan {
  const groups = lines.map((line) => {
    const breakerModules = line.breaker.poles === '1P' ? 1 : line.breaker.poles === '2P' ? 2 : 3
    const rcdModules = line.rcd ? line.rcd.poles === '4P' ? 4 : 2 : 0
    return {
      lineId: line.id,
      label: line.name,
      modules: breakerModules + rcdModules,
    }
  })
  const occupiedModules = groups.reduce((sum, item) => sum + item.modules, 4)
  const recommendedModules = Math.ceil((occupiedModules * 1.3) / 6) * 6
  return {
    occupiedModules,
    recommendedModules,
    reserveModules: recommendedModules - occupiedModules,
    groups,
  }
}

function textOf(product: EngineeringCatalogProduct) {
  return [
    product.name,
    product.sku,
    product.categorySlug,
    product.brandName,
    ...Object.values(product.attributes).map(String),
  ].join(' ').toLowerCase()
}

function scoreProduct(role: EngineeringProductRole, spec: Record<string, string | number | boolean>, product: EngineeringCatalogProduct) {
  const text = textOf(product)
  let score = 0
  const roleWords: Record<EngineeringProductRole, string[]> = {
    cable: [
      '\u043a\u0430\u0431\u0435\u043b\u044c', // kabel
      '\u043f\u0440\u043e\u0432\u043e\u0434', // provod
      'vvg',
      '\u0432\u0432\u0433', // vvg
      'cable',
      '\u043f\u0440\u043e\u0432\u0456\u0434', // provid
    ],
    breaker: [
      '\u0430\u0432\u0442\u043e\u043c\u0430\u0442', // avtomat
      'breaker',
      '\u0432\u0438\u043c\u0438\u043a\u0430\u0447', // vymykach
      '\u0432\u044b\u043a\u043b\u044e\u0447\u0430\u0442\u0435\u043b\u044c', // vykliuchatel
      'c10',
      'c16',
      'c25',
      'c32',
    ],
    rcd: [
      '\u0443\u0437\u043e', // uzo
      '\u043f\u0437\u0432', // pzv
      '\u0434\u0438\u0444', // dif
      'rcd',
      'dif',
    ],
    panel: [
      '\u0449\u0438\u0442', // schyt
      '\u0431\u043e\u043a\u0441', // boks
      'panel',
    ],
    voltage_relay: [
      '\u0440\u0435\u043b\u0435', // rele
      'voltage',
    ],
    accessory: [
      '\u0448\u0438\u043d\u0430', // shyna
      '\u0433\u0440\u0435\u0431\u0435\u043d\u043a\u0430', // hrebenka
      'din',
      '\u043a\u043b\u0435\u043c', // klem
    ],
    ups: [
      'ups',
      '\u0434\u0431\u0436', // dbzh
      '\u0438\u0431\u043f', // ibp
      '\u0430\u043a\u0443\u043c', // akum
      '\u0430\u043a\u0443\u043c', // akkum
      'battery',
    ],
    lighting: [
      '\u0441\u0432\u0435\u0442', // svet
      '\u0441\u0432\u0456\u0442', // svit
      'led',
      '\u043b\u0430\u043c\u043f', // lamp
      '\u043f\u0430\u043d\u0435\u043b\u044c', // panel
    ],
  }

  for (const word of roleWords[role]) if (text.includes(word)) score += 20
  for (const value of Object.values(spec)) {
    const normalized = String(value).toLowerCase().replace(',', '.')
    if (normalized && text.includes(normalized)) score += 10
  }
  if (product.stock > 0) score += 10
  if (product.price > 0) score += 2
  return score
}

function matchProduct(role: EngineeringProductRole, spec: Record<string, string | number | boolean>, products: EngineeringCatalogProduct[]): ProductAlternative[] {
  return products
    .map((product) => ({
      product,
      score: scoreProduct(role, spec, product),
      reason: 'match',
    }))
    .filter((item) => item.score >= 20)
    .sort((a, b) => b.score - a.score || a.product.price - b.product.price)
    .slice(0, 3)
}

function recommendation(id: string, role: EngineeringProductRole, title: string, spec: Record<string, string | number | boolean>, products: EngineeringCatalogProduct[], lineId?: string): ProductRecommendation {
  const alternatives = matchProduct(role, spec, products)
  const rec: ProductRecommendation = {
    id,
    role,
    title,
    requiredSpec: spec,
    alternatives,
    reasonCode: alternatives[0] ? 'match' : 'no-match',
    reasonParams: { spec: Object.values(spec).join(', ') },
    reason: alternatives[0] ? 'match' : 'no-match',
    warnings: alternatives.length === 0
      ? [{ code: 'no-catalog-match', level: 'warning' }]
      : [],
  }
  if (lineId !== undefined) {
    rec.lineId = lineId
  }
  if (alternatives[0] !== undefined) {
    rec.selected = alternatives[0]
  }
  return rec
}

function buildRecommendations(lines: EngineeringLine[], panel: ElectricalPanelPlan, products: EngineeringCatalogProduct[]): ProductRecommendation[] {
  const items: ProductRecommendation[] = []
  for (const line of lines) {
    items.push(recommendation(
      `${line.id}-cable`,
      'cable',
      'cable',
      { cores: line.cable.cores, section: line.cable.sectionMm2, material: 'copper' },
      products,
      line.id
    ))
    items.push(recommendation(
      `${line.id}-breaker`,
      line.rcd?.kind === 'dif' ? 'rcd' : 'breaker',
      line.rcd?.kind === 'dif' ? 'rcd' : 'breaker',
      line.rcd
        ? { currentA: line.rcd.currentA, leakageMa: line.rcd.leakageMa, poles: line.rcd.poles }
        : { currentA: line.breaker.currentA, curve: line.breaker.curve, poles: line.breaker.poles },
      products,
      line.id
    ))
  }
  items.push(recommendation(
    'panel',
    'panel',
    'panel',
    { modules: panel.recommendedModules },
    products
  ))
  items.push(recommendation(
    'voltage-relay',
    'voltage_relay',
    'voltage_relay',
    { phase: 1, currentA: 40 },
    products
  ))
  return items
}



function calculateComplexity(input: EngineeringProjectInput, loads: EngineeringLoad[], lines: EngineeringLine[]): ComplexityResult {
  let score = 0
  const reasons: string[] = []

  if (lines.length > 8) {
    score += 20
    reasons.push('lines')
  }

  const has3PhaseLoad = loads.some((l) => l.phase === 3)
  if (has3PhaseLoad || input.phase === 3) {
    score += 15
    reasons.push('phases_3')
  }

  const hasBackup = loads.some((l) => ['generator_input', 'inverter_input', 'battery_system'].includes(l.kind))
  if (hasBackup) {
    score += 25
    reasons.push('backup')
  }

  const hasDamp = loads.some((l) => l.wetZone)
  if (hasDamp) {
    score += 10
    reasons.push('damp_zones')
  }

  const hasExpertLoad = loads.some((l) => ['ev_charger', 'pump', 'welder', 'compressor'].includes(l.kind))
  if (hasExpertLoad) {
    score += 15
    reasons.push('expert_loads')
  }

  let level: ComplexityResult['level'] = 'simple'
  if (score >= 40) {
    level = 'expert-only'
  } else if (score >= 25) {
    level = 'complex'
  } else if (score >= 10) {
    level = 'medium'
  }

  return {
    score,
    level,
    reasons,
    aiShouldOfferHelp: score >= 25,
    electricianReviewRequired: score >= 10,
  }
}



export function buildEngineeringGraph(input: EngineeringProjectInput): EngineeringGraph {
  const loads = buildLoads(input)
  const lines = buildLines(input, loads)
  const panel = buildPanel(lines)

  const nodes: EngineeringNode[] = []
  const edges: EngineeringEdge[] = []

  // 1. Panel Node
  nodes.push({
    id: 'panel-1',
    type: 'distribution_panel',
    label: '\u0420\u043e\u0437\u043f\u043e\u0434\u0456\u043b\u044c\u0447\u0438\u0439 \u0449\u0438\u0442',
    properties: { modules: panel.recommendedModules }
  })

  // 2. Grid input Node
  nodes.push({
    id: 'grid-input-1',
    type: 'grid_input',
    label: '\u0412\u0432\u0435\u0434\u0435\u043d\u043d\u044f \u043c\u0435\u0440\u0435\u0436\u0456',
    properties: { phase: input.phase, voltageV: input.phase === 3 ? 400 : 230, currentA: input.inputBreakerA }
  })

  // 3. Main breaker
  nodes.push({
    id: 'main-breaker-1',
    type: 'main_breaker',
    label: '\u0412\u0432\u0456\u0434\u043d\u0438\u0439 \u0430\u0432\u0442\u043e\u043c\u0430\u0442',
    properties: { currentA: input.inputBreakerA, poles: input.phase === 3 ? '3P' : '2P' }
  })
  edges.push({ id: 'e-grid-mb', source: 'grid-input-1', target: 'main-breaker-1' })

  // 4. Voltage relay
  let upstreamSourceId = 'main-breaker-1'
  if (input.includeWeakCurrent) {
    const vrId = 'voltage-relay-1'
    nodes.push({
      id: vrId,
      type: 'voltage_relay',
      label: '\u0420\u0435\u043b\u0435 \u043d\u0430\u043f\u0440\u0443\u0433\u0438',
      properties: { phase: input.phase, currentA: 40, modules: 3 }
    })
    edges.push({ id: 'e-mb-vr', source: upstreamSourceId, target: vrId })
    upstreamSourceId = vrId
  }

  // 5. Lines protection and cables
  for (const line of lines) {
    let lineUpstreamId = upstreamSourceId

    // RCD (PZV)
    if (line.rcd) {
      const rcdId = `rcd-${line.id}`
      nodes.push({
        id: rcdId,
        type: 'rcd',
        label: `\u041f\u0417\u0412 ${line.rcd.currentA}A ${line.rcd.leakageMa}mA`,
        properties: { currentA: line.rcd.currentA, leakageMa: line.rcd.leakageMa as 10 | 30 | 100, poles: line.rcd.poles as '2P' | '4P' }
      })
      edges.push({ id: `e-${lineUpstreamId}-${rcdId}`, source: lineUpstreamId, target: rcdId })
      lineUpstreamId = rcdId
    }

    // MCB (Breaker)
    const mcbId = `mcb-${line.id}`
    nodes.push({
      id: mcbId,
      type: 'mcb',
      label: `\u0410\u0432\u0442\u043e\u043c\u0430\u0442 C${line.breaker.currentA}`,
      properties: { currentA: line.breaker.currentA, poles: line.breaker.poles as '1P' | '2P' | '3P' | '4P', curve: line.breaker.curve as 'B' | 'C' }
    })
    edges.push({ id: `e-${lineUpstreamId}-${mcbId}`, source: lineUpstreamId, target: mcbId })

    // Cable Line
    const cableId = `cable-${line.id}`
    nodes.push({
      id: cableId,
      type: 'cable_line',
      label: `\u041a\u0430\u0431\u0435\u043b\u044c ${line.cable.cores}x${line.cable.sectionMm2}\u043c\u043c\u00b2`,
      properties: { 
        cores: line.cable.cores, 
        sectionMm2: line.cable.sectionMm2, 
        material: line.cable.material === 'copper' ? 'Cu' : 'Al', 
        routeLengthM: line.loads[0]?.routeLengthM ?? input.routeLengthM 
      }
    })
    edges.push({ id: `e-${mcbId}-${cableId}`, source: mcbId, target: cableId })

    // Loads
    for (const load of line.loads) {
      const loadId = `load-${load.id}`
      let nodeType: EngineeringNodeType = 'load'
      if (load.kind === 'generator_input') nodeType = 'generator'
      else if (load.kind === 'inverter_input') nodeType = 'inverter'
      else if (load.kind === 'battery_system') nodeType = 'battery'

      const props: EngineeringNode['properties'] = {
        powerW: load.powerW,
        neutralMode: 'auto',
      }
      if (load.areaZone) {
        props.areaZone = load.areaZone
      }

      nodes.push({
        id: loadId,
        type: nodeType,
        label: load.name,
        properties: props
      })
      edges.push({ id: `e-${cableId}-${loadId}`, source: cableId, target: loadId })
    }
  }

  // Map loads to snapshot
  const loadSnapshots = loads.map((load) => ({
    id: load.id,
    name: load.name,
    kind: load.kind,
    powerW: load.powerW,
    voltageV: load.voltage,
    phase: load.phase,
    areaZone: load.areaZone,
    room: load.room,
    critical: load.critical ?? false,
    reservePowerRequired: load.reservePowerRequired ?? false,
  }))

  return {
    id: 'project-graph',
    version: 1,
    locale: 'uk',
    network: {
      phase: input.phase,
      voltageV: input.phase === 3 ? 400 : 230,
      inputBreakerA: input.inputBreakerA,
      earthingSystem: 'TN-S',
    },
    nodes,
    edges,
    catalogBindings: [],
    loads: loadSnapshots,
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

export function buildEngineeringProject(input: EngineeringProjectInput, products: EngineeringCatalogProduct[]): EngineeringProject {
  const graph = buildEngineeringGraph(input)
  
  // 1. Run validation and NormGuard rules over the built graph
  const rawNormIssues = runNormGuard(graph)
  const normIssues: NormIssue[] = rawNormIssues.map((issue) => {
    let level: 'info' | 'warning' | 'danger' = 'info'
    if (issue.severity === 'danger' || issue.severity === 'blocker') {
      level = 'danger'
    } else if (issue.severity === 'warning') {
      level = 'warning'
    }
    return {
      ...issue,
      level,
    }
  })

  // 2. Compute BOM & Totals via the new Catalog Binding engine
  const bomResult = computeBOMAndTotals(graph, products)

  const loads = buildLoads(input)
  const lines = buildLines(input, loads)
  const panel = buildPanel(lines)
  const recommendations = buildRecommendations(lines, panel, products)

  // 3. Map new Graph-based BOM items snapshot to legacy BOM items
  const mappedBomItems: EngineeringBOMItem[] = bomResult.bom.map((item) => {
    // Attempt to match with a recommendation for page link lookup in UI
    const matchingRec = recommendations.find((rec) => {
      if (item.role === 'panel') return rec.role === 'panel'
      if (item.role === 'voltage_relay') return rec.role === 'voltage_relay'
      
      const nodeLineId = item.nodeId?.replace(/^(rcd-|mcb-|cable-)/, '')
      return rec.role === item.role && rec.lineId === `line-${nodeLineId}`
    })

    const bomItem: EngineeringBOMItem = {
      recommendationId: matchingRec?.id || item.nodeId || item.sku,
      role: item.role as EngineeringProductRole,
      name: item.name,
      qty: item.qty,
      unitPrice: item.unitPrice,
      total: item.total,
      reason: item.missing ? 'missing' : 'match',
      missing: !!item.missing,
    }
    if (item.productId) {
      bomItem.productId = item.productId
      bomItem.sku = item.sku
    }
    if (item.stock !== undefined) {
      bomItem.stock = item.stock
    }
    if (item.blocksCheckout) {
      bomItem.blocksCheckout = true
    }
    return bomItem
  })

  const bom = {
    items: mappedBomItems,
    subtotal: bomResult.totals.estimatedCost,
    missingCount: bomResult.bom.filter((item) => item.missing).length,
  }

  const complexity = calculateComplexity(input, loads, lines)

  const warnings: EngineeringWarning[] = [
    ...lines.flatMap((line) => line.warnings),
    ...recommendations.flatMap((item) => item.warnings),
    {
      code: 'safety-disclaimer',
      level: 'info' as const,
    },
  ]

  // Map panel reserve and modules dynamically using the graph panel result
  const panelSnapshot = bomResult.panels[0]
  const electricalPanel: ElectricalPanelPlan = {
    occupiedModules: bomResult.totals.occupiedModules,
    recommendedModules: panelSnapshot?.capacityModules ?? panel.recommendedModules,
    reserveModules: panelSnapshot?.reserveModules ?? panel.reserveModules,
    groups: panel.groups,
  }

  return {
    input,
    loads,
    lines,
    panel: electricalPanel,
    recommendations,
    bom,
    warnings,
    complexity,
    normIssues,
  }
}

export const defaultEngineeringInput: EngineeringProjectInput = {
  type: 'apartment',
  areaM2: 42,
  rooms: 1,
  bathrooms: 1,
  phase: 1,
  inputBreakerA: 32,
  hasElectricHob: false,
  hasOven: true,
  hasBoiler: true,
  hasWasher: true,
  hasDishwasher: false,
  hasConditioner: false,
  includeWeakCurrent: true,
  routeLengthM: 25,
  safetyLevel: 'enhanced',
  customLoads: [],
}
