import type { NormIssue } from './normguard/types'

export interface NetworkConfig {
  phase: 1 | 3
  voltageV: 230 | 400
  inputBreakerA: number
  earthingSystem: 'TN-S' | 'TN-C-S' | 'TT' | 'IT'
}

export type EngineeringNodeType =
  | 'grid_input'
  | 'meter'
  | 'main_breaker'
  | 'voltage_relay'
  | 'surge_protection'
  | 'busbar_n'
  | 'busbar_pe'
  | 'rcd'
  | 'mcb'
  | 'cable_line'
  | 'load'
  | 'generator'
  | 'inverter'
  | 'battery'
  | 'ats'
  | 'distribution_panel'
  | 'terminal'

export interface EngineeringNode {
  id: string
  type: EngineeringNodeType
  label: string
  properties: {
    name?: string
    powerW?: number
    voltageV?: number
    phase?: 1 | 3
    areaZone?: 'dry' | 'damp' | 'bathroom_zone_0' | 'bathroom_zone_1' | 'bathroom_zone_2' | 'outdoor'
    currentA?: number
    leakageMa?: 10 | 30 | 100 | 300
    poles?: '1P' | '2P' | '3P' | '4P'
    curve?: 'B' | 'C' | 'D'
    material?: 'Cu' | 'Al'
    sectionMm2?: number
    cores?: number
    routeLengthM?: number
    installationMethod?: 'wall' | 'pipe' | 'tray' | 'ground'
    neutralMode?: 'floating' | 'bonded' | 'auto'
    atsNeutralPolicy?: 'switch' | 'solid'
    atsPoles?: 2 | 3 | 4
    switchesNeutral?: boolean
    strandType?: 'solid' | 'stranded' | 'flexible'
    requiresFerrule?: boolean
    modules?: number
    [key: string]: unknown
  }
}

export interface EngineeringEdge {
  id: string
  source: string
  target: string
  type?: 'power' | 'control' | 'earth' | 'neutral' | 'signal' | 'bus' | 'dc'
  conductor?: EngineeringConnectionKind
}

export type EngineeringConnectionKind = 'L' | 'N' | 'PE' | 'PEN' | 'DC+' | 'DC-' | 'signal' | 'bus'

export interface CatalogBinding {
  nodeId: string
  productId: string
  sku: string
  name: string
  price: number
  stock?: number | undefined
  slug?: string | undefined
  attributes: Record<string, unknown>
}

export interface EngineeringLoadSnapshot {
  id: string
  name: string
  kind: string
  powerW: number
  voltageV: number
  phase: 1 | 3
  areaZone?: string | undefined
  room?: string | undefined
  critical: boolean
  reservePowerRequired: boolean
}

export interface EngineeringPanelSnapshot {
  id: string
  label: string
  capacityModules: number
  occupiedModules: number
  reserveModules: number
}

export interface EngineeringBOMItemSnapshot {
  sku: string
  name: string
  qty: number
  unitPrice: number
  total: number
  productId?: string | undefined
  productSlug?: string | undefined
  stock?: number | undefined
  role: string
  missing?: boolean | undefined
  stockInsufficient?: boolean | undefined
  blocksCheckout?: boolean | undefined
  nodeId?: string | undefined
}

export interface EngineeringTotals {
  totalPowerW: number
  totalCurrentA: number
  occupiedModules: number
  estimatedCost: number
}

export interface EngineeringGraph {
  id: string
  version: number
  locale: 'uk' | 'ru'
  network: NetworkConfig
  nodes: EngineeringNode[]
  edges: EngineeringEdge[]
  catalogBindings: CatalogBinding[]
  loads: EngineeringLoadSnapshot[]
  panels: EngineeringPanelSnapshot[]
  bom: EngineeringBOMItemSnapshot[]
  totals: EngineeringTotals
  normIssues: NormIssue[]
}

export interface EngineeringDrawingCanvas {
  cols: number
  rows: number
  cellWidth: number
  cellHeight: number
}

export interface EngineeringDrawingNode {
  nodeId: string
  x: number
  y: number
  width?: number
  height?: number
}

export interface EngineeringDrawingEdge {
  edgeId: string
  waypoints?: Array<{ x: number; y: number }>
}

export interface EngineeringProjectDraft {
  id: string
  version: 1
  name: string
  updatedAt: string
  graph: EngineeringGraph
  verilog?: {
    source: string
    bindings: EngineeringVerilogBinding[]
  }
  drawing: {
    canvas: EngineeringDrawingCanvas
    nodes: EngineeringDrawingNode[]
    edges: EngineeringDrawingEdge[]
  }
}

export interface EngineeringVerilogBinding {
  symbol: string
  kind: 'node' | 'edge' | 'catalog-product' | 'drawing-node'
  nodeId?: string | undefined
  edgeId?: string | undefined
  productId?: string | undefined
  sku?: string | undefined
}

/**
 * Helper to build a clean empty or default graph
 */
export function buildDefaultGraph(): EngineeringGraph {
  return {
    id: 'draft-project',
    version: 1,
    locale: 'uk',
    network: {
      phase: 1,
      voltageV: 230,
      inputBreakerA: 25,
      earthingSystem: 'TN-C-S',
    },
    nodes: [
      {
        id: 'grid-input-1',
        type: 'grid_input',
        label: 'Grid Input',
        properties: { voltageV: 230, phase: 1, currentA: 25 },
      },
      {
        id: 'main-panel-1',
        type: 'distribution_panel',
        label: 'Main Panel',
        properties: { modules: 24 },
      },
    ],
    edges: [],
    catalogBindings: [],
    loads: [],
    panels: [
      {
        id: 'main-panel-1',
        label: 'Main Panel',
        capacityModules: 24,
        occupiedModules: 0,
        reserveModules: 24,
      },
    ],
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
