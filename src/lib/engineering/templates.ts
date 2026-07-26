/**
 * Engineering scheme templates — ready-made distribution panel projects
 * (apartment / house / workshop) that load straight onto the CAD canvas.
 *
 * Every template builds a complete EngineeringProjectDraft with meaningful
 * drawing positions: the supply chain runs down the left column, each load
 * line occupies its own column (RCD → MCB → cable → load).
 */

import type {
  EngineeringDrawingEdge,
  EngineeringDrawingNode,
  EngineeringEdge,
  EngineeringGraph,
  EngineeringNode,
  EngineeringProjectDraft,
  NetworkConfig,
} from './graph'

export interface EngineeringTemplate {
  id: string
  name: { uk: string; ru: string }
  description: { uk: string; ru: string }
  build: () => EngineeringProjectDraft
}

/* ------------------------------------------------------------------ */
/*  Builder helpers                                                   */
/* ------------------------------------------------------------------ */

interface LineSpec {
  id: string
  label: string
  kind: string
  powerW: number
  phase?: 1 | 3
  areaZone?: 'dry' | 'damp' | 'bathroom_zone_0' | 'bathroom_zone_1' | 'bathroom_zone_2' | 'outdoor'
  mcbA: number
  curve?: 'B' | 'C' | 'D'
  mcbPoles?: '1P' | '2P' | '3P' | '4P'
  /** Leakage in mA; omit for lines without dedicated RCD */
  rcdMa?: 10 | 30 | 100 | 300
  rcdA?: number
  cableSection: number
  cableCores?: number
  routeM?: number
  critical?: boolean
}

interface SupplySpec {
  network: NetworkConfig
  withMeter?: boolean
  meterModules?: number
  mainBreakerA: number
  mainBreakerPoles: '2P' | '3P' | '4P'
  voltageRelayA?: number
  panelModules: number
  panelLabel: string
  withGenerator?: boolean
  generatorPowerW?: number
}

class DraftBuilder {
  nodes: EngineeringNode[] = []
  edges: EngineeringEdge[] = []
  drawingNodes: EngineeringDrawingNode[] = []
  drawingEdges: EngineeringDrawingEdge[] = []
  private edgeSeq = 0

  add(node: EngineeringNode, x: number, y: number) {
    this.nodes.push(node)
    this.drawingNodes.push({ nodeId: node.id, x, y, width: 1, height: 1 })
    return node.id
  }

  connect(source: string, target: string) {
    const id = `e-${++this.edgeSeq}-${source}-${target}`.slice(0, 60)
    this.edges.push({ id, source, target, type: 'power', conductor: 'L' })
    this.drawingEdges.push({ edgeId: id })
  }
}

function buildLine(builder: DraftBuilder, feedFromId: string, spec: LineSpec, column: number) {
  const x = column
  let lastId = feedFromId
  let y = 5

  if (spec.rcdMa !== undefined) {
    const rcdId = builder.add({
      id: `rcd-${spec.id}`,
      type: 'rcd',
      label: `ПЗВ ${spec.rcdA ?? Math.max(25, spec.mcbA)}А ${spec.rcdMa}мА`,
      properties: {
        currentA: spec.rcdA ?? Math.max(25, spec.mcbA),
        leakageMa: spec.rcdMa,
        poles: spec.phase === 3 ? '4P' : '2P',
      },
    }, x, y)
    builder.connect(lastId, rcdId)
    lastId = rcdId
    y += 2
  }

  const mcbId = builder.add({
    id: `mcb-${spec.id}`,
    type: 'mcb',
    label: `Автомат ${spec.curve ?? 'C'}${spec.mcbA}`,
    properties: {
      currentA: spec.mcbA,
      curve: spec.curve ?? 'C',
      poles: spec.mcbPoles ?? (spec.phase === 3 ? '3P' : '2P'),
      modules: spec.mcbPoles === '3P' || spec.phase === 3 ? 3 : 2,
    },
  }, x, y)
  builder.connect(lastId, mcbId)
  y += 2

  const cores = spec.cableCores ?? (spec.phase === 3 ? 5 : 3)
  const cableId = builder.add({
    id: `cable-${spec.id}`,
    type: 'cable_line',
    label: `Кабель ${cores}x${spec.cableSection}мм²`,
    properties: {
      cores,
      sectionMm2: spec.cableSection,
      material: 'Cu',
      routeLengthM: spec.routeM ?? 20,
      strandType: 'solid',
    },
  }, x, y)
  builder.connect(mcbId, cableId)
  y += 2

  const loadId = builder.add({
    id: `load-${spec.id}`,
    type: 'load',
    label: spec.label,
    properties: {
      kind: spec.kind,
      powerW: spec.powerW,
      phase: spec.phase ?? 1,
      voltageV: spec.phase === 3 ? 400 : 230,
      areaZone: spec.areaZone ?? 'dry',
      critical: spec.critical ?? false,
    },
  }, x, y)
  builder.connect(cableId, loadId)
}

function buildPanelDraft(
  id: string,
  name: string,
  supply: SupplySpec,
  lines: LineSpec[],
): EngineeringProjectDraft {
  const builder = new DraftBuilder()
  const phase3 = supply.network.phase === 3

  // --- Supply chain, left column ---
  let y = 1
  const gridId = builder.add({
    id: 'grid-input-1',
    type: 'grid_input',
    label: phase3 ? 'Ввід мережі 3ф 400В' : 'Ввід мережі 1ф 230В',
    properties: {
      phase: supply.network.phase,
      voltageV: supply.network.voltageV,
      currentA: supply.network.inputBreakerA,
    },
  }, 1, y)
  let feedId = gridId

  if (supply.withGenerator) {
    const genId = builder.add({
      id: 'generator-1',
      type: 'generator',
      label: 'Генератор',
      properties: {
        powerW: supply.generatorPowerW ?? 5000,
        phase: supply.network.phase,
        // ATS switches neutral → the backup source runs with its own bonded neutral-earth
        neutralMode: 'bonded',
      },
    }, 3, y)
    y += 2
    const atsId = builder.add({
      id: 'ats-1',
      type: 'ats',
      label: `АВР ${supply.network.inputBreakerA}А`,
      properties: {
        currentA: supply.network.inputBreakerA,
        poles: phase3 ? '4P' : '2P',
        atsPoles: phase3 ? 4 : 2,
        atsNeutralPolicy: 'switch',
        switchesNeutral: true,
      },
    }, 2, y)
    builder.connect(gridId, atsId)
    builder.connect(genId, atsId)
    feedId = atsId
  }
  y += 2

  if (supply.withMeter) {
    const meterId = builder.add({
      id: 'meter-1',
      type: 'meter',
      label: 'Лічильник',
      properties: { currentA: supply.network.inputBreakerA, modules: supply.meterModules ?? 4 },
    }, 1, y)
    builder.connect(feedId, meterId)
    feedId = meterId
    y += 2
  }

  const mainId = builder.add({
    id: 'main-breaker-1',
    type: 'main_breaker',
    label: `Ввідний автомат ${supply.mainBreakerPoles} C${supply.mainBreakerA}`,
    properties: {
      currentA: supply.mainBreakerA,
      curve: 'C',
      poles: supply.mainBreakerPoles,
      modules: supply.mainBreakerPoles === '4P' ? 4 : supply.mainBreakerPoles === '3P' ? 3 : 2,
    },
  }, 1, y)
  builder.connect(feedId, mainId)
  feedId = mainId
  y += 2

  if (supply.voltageRelayA) {
    const vrId = builder.add({
      id: 'voltage-relay-1',
      type: 'voltage_relay',
      label: `Реле напруги ${supply.voltageRelayA}А`,
      properties: { currentA: supply.voltageRelayA, modules: phase3 ? 9 : 3 },
    }, 1, y)
    builder.connect(feedId, vrId)
    feedId = vrId
    y += 2
  }

  builder.add({
    id: 'panel-1',
    type: 'distribution_panel',
    label: supply.panelLabel,
    properties: { modules: supply.panelModules },
  }, 1, y)

  // --- Load lines, one column each ---
  lines.forEach((line, index) => {
    buildLine(builder, feedId, line, 3 + index * 2)
  })

  const cols = Math.max(12, 3 + lines.length * 2 + 1)
  const rows = 14

  const graph: EngineeringGraph = {
    id: `tpl-${id}`,
    version: 1,
    locale: 'uk',
    network: supply.network,
    nodes: builder.nodes,
    edges: builder.edges,
    catalogBindings: [],
    loads: [],
    panels: [],
    bom: [],
    totals: { totalPowerW: 0, totalCurrentA: 0, occupiedModules: 0, estimatedCost: 0 },
    normIssues: [],
  }

  return {
    id: `draft-tpl-${id}`,
    version: 1,
    name,
    updatedAt: 'unsaved',
    graph,
    drawing: {
      canvas: { cols, rows, cellWidth: 100, cellHeight: 100 },
      nodes: builder.drawingNodes,
      edges: builder.drawingEdges,
    },
  }
}

/* ------------------------------------------------------------------ */
/*  Template catalog                                                  */
/* ------------------------------------------------------------------ */

export const ENGINEERING_TEMPLATES: EngineeringTemplate[] = [
  {
    id: 'apartment-1r',
    name: { uk: 'Квартира 1к — економ, 1ф', ru: 'Квартира 1к — эконом, 1ф' },
    description: {
      uk: '4 лінії: освітлення, розетки, кухня, бойлер. ПЗВ на вологі зони.',
      ru: '4 линии: освещение, розетки, кухня, бойлер. УЗО на влажные зоны.',
    },
    build: () => buildPanelDraft(
      'apartment-1r',
      'Квартира 1к (економ)',
      {
        network: { phase: 1, voltageV: 230, inputBreakerA: 25, earthingSystem: 'TN-C-S' },
        mainBreakerA: 25,
        mainBreakerPoles: '2P',
        voltageRelayA: 40,
        panelModules: 24,
        panelLabel: 'Щит 24 модулі',
      },
      [
        { id: 'light', label: 'Освітлення', kind: 'lighting', powerW: 500, mcbA: 10, curve: 'B', mcbPoles: '1P', cableSection: 1.5 },
        { id: 'sockets', label: 'Розетки кімната', kind: 'socket_group', powerW: 2000, mcbA: 16, rcdMa: 30, cableSection: 2.5 },
        { id: 'kitchen', label: 'Розетки кухня', kind: 'kitchen_socket', powerW: 3500, mcbA: 16, rcdMa: 30, cableSection: 2.5 },
        { id: 'boiler', label: 'Бойлер', kind: 'boiler', powerW: 2000, areaZone: 'bathroom_zone_2', mcbA: 16, rcdMa: 10, cableSection: 2.5 },
      ],
    ),
  },
  {
    id: 'apartment-3r',
    name: { uk: 'Квартира 2–3к — стандарт, 1ф', ru: 'Квартира 2–3к — стандарт, 1ф' },
    description: {
      uk: '7 ліній з лічильником: світло ×2, розетки ×2, кухня, пралка, духовка.',
      ru: '7 линий со счётчиком: свет ×2, розетки ×2, кухня, стиралка, духовка.',
    },
    build: () => buildPanelDraft(
      'apartment-3r',
      'Квартира 2–3к (стандарт)',
      {
        network: { phase: 1, voltageV: 230, inputBreakerA: 32, earthingSystem: 'TN-C-S' },
        withMeter: true,
        mainBreakerA: 32,
        mainBreakerPoles: '2P',
        voltageRelayA: 50,
        panelModules: 36,
        panelLabel: 'Щит 36 модулів',
      },
      [
        { id: 'light-1', label: 'Світло кімнати', kind: 'lighting', powerW: 600, mcbA: 10, curve: 'B', mcbPoles: '1P', cableSection: 1.5 },
        { id: 'light-2', label: 'Світло кухня/коридор', kind: 'lighting', powerW: 400, mcbA: 10, curve: 'B', mcbPoles: '1P', cableSection: 1.5 },
        { id: 'sockets-1', label: 'Розетки кімната 1', kind: 'socket_group', powerW: 2000, mcbA: 16, rcdMa: 30, cableSection: 2.5 },
        { id: 'sockets-2', label: 'Розетки кімната 2', kind: 'socket_group', powerW: 2000, mcbA: 16, rcdMa: 30, cableSection: 2.5 },
        { id: 'kitchen', label: 'Розетки кухня', kind: 'kitchen_socket', powerW: 3500, mcbA: 16, rcdMa: 30, cableSection: 2.5 },
        { id: 'washer', label: 'Пральна машина', kind: 'washing_machine', powerW: 2200, areaZone: 'bathroom_zone_2', mcbA: 16, rcdMa: 10, cableSection: 2.5 },
        { id: 'oven', label: 'Духова шафа', kind: 'oven', powerW: 3500, mcbA: 25, rcdMa: 30, cableSection: 4 },
      ],
    ),
  },
  {
    id: 'house-3f',
    name: { uk: 'Будинок 3ф + генератор (АВР)', ru: 'Дом 3ф + генератор (АВР)' },
    description: {
      uk: 'Трифазний ввід, АВР з генератором, котел як критичне навантаження.',
      ru: 'Трёхфазный ввод, АВР с генератором, котёл как критичная нагрузка.',
    },
    build: () => buildPanelDraft(
      'house-3f',
      'Будинок 3ф з резервом',
      {
        network: { phase: 3, voltageV: 400, inputBreakerA: 32, earthingSystem: 'TN-C-S' },
        withMeter: true,
        mainBreakerA: 32,
        mainBreakerPoles: '4P',
        voltageRelayA: 40,
        panelModules: 48,
        panelLabel: 'Щит 48 модулів',
        withGenerator: true,
        generatorPowerW: 6000,
      },
      [
        { id: 'light', label: 'Освітлення будинку', kind: 'lighting', powerW: 900, mcbA: 10, curve: 'B', mcbPoles: '1P', cableSection: 1.5 },
        { id: 'sockets-gf', label: 'Розетки 1 поверх', kind: 'socket_group', powerW: 2500, mcbA: 16, rcdMa: 30, cableSection: 2.5 },
        { id: 'sockets-ff', label: 'Розетки 2 поверх', kind: 'socket_group', powerW: 2500, mcbA: 16, rcdMa: 30, cableSection: 2.5 },
        { id: 'kitchen', label: 'Кухня', kind: 'kitchen_socket', powerW: 4000, mcbA: 20, rcdMa: 30, cableSection: 4 },
        { id: 'boiler', label: 'Бойлер', kind: 'boiler', powerW: 2500, areaZone: 'bathroom_zone_2', mcbA: 16, rcdMa: 10, cableSection: 2.5 },
        { id: 'heating', label: 'Котел опалення', kind: 'heating', powerW: 1500, mcbA: 16, rcdMa: 30, cableSection: 2.5, critical: true, routeM: 15 },
        { id: 'outdoor', label: 'Вуличні розетки/двір', kind: 'outdoor', powerW: 1500, areaZone: 'outdoor', mcbA: 16, rcdMa: 30, cableSection: 2.5, routeM: 35 },
      ],
    ),
  },
  {
    id: 'workshop-3f',
    name: { uk: 'Майстерня / виробництво, 3ф', ru: 'Мастерская / производство, 3ф' },
    description: {
      uk: 'Верстат і компресор на 3ф лініях 5×2.5/5×4, зварювальна розетка 1ф.',
      ru: 'Станок и компрессор на 3ф линиях 5×2.5/5×4, сварочная розетка 1ф.',
    },
    build: () => buildPanelDraft(
      'workshop-3f',
      'Майстерня 3ф',
      {
        network: { phase: 3, voltageV: 400, inputBreakerA: 40, earthingSystem: 'TN-S' },
        withMeter: true,
        mainBreakerA: 40,
        mainBreakerPoles: '4P',
        voltageRelayA: 63,
        panelModules: 54,
        panelLabel: 'Щит 54 модулі IP54',
      },
      [
        { id: 'light', label: 'Освітлення цеху', kind: 'lighting', powerW: 1200, mcbA: 10, curve: 'B', mcbPoles: '1P', cableSection: 1.5 },
        { id: 'machine', label: 'Верстат 3ф', kind: 'machine', powerW: 4000, phase: 3, mcbA: 16, curve: 'D', mcbPoles: '3P', rcdMa: 30, rcdA: 25, cableSection: 2.5, cableCores: 5 },
        { id: 'compressor', label: 'Компресор 3ф', kind: 'compressor', powerW: 5500, phase: 3, mcbA: 20, curve: 'D', mcbPoles: '3P', rcdMa: 30, rcdA: 25, cableSection: 4, cableCores: 5 },
        { id: 'welding', label: 'Розетка зварювання', kind: 'welding', powerW: 5000, mcbA: 25, curve: 'D', rcdMa: 30, cableSection: 4 },
        { id: 'sockets', label: 'Розетки побутові', kind: 'socket_group', powerW: 2000, mcbA: 16, rcdMa: 30, cableSection: 2.5 },
      ],
    ),
  },
]

export function buildTemplateDraft(templateId: string): EngineeringProjectDraft | null {
  const template = ENGINEERING_TEMPLATES.find((item) => item.id === templateId)
  return template ? template.build() : null
}
