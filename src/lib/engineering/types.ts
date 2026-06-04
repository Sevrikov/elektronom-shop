export type EngineeringLocale = 'uk' | 'ru'

export type EngineeringProjectType = 'apartment' | 'house' | 'office' | 'garage'

export type ElectricalPhase = 1 | 3

export type EngineeringLoadKind =
  | 'lighting'
  | 'socket_group'
  | 'kitchen_socket'
  | 'bathroom_socket'
  | 'boiler'
  | 'washing_machine'
  | 'dishwasher'
  | 'oven'
  | 'hob'
  | 'conditioner'
  | 'router'
  | 'warm_floor'
  | 'ev_charger'
  | 'pump'
  | 'gate_motor'
  | 'server_rack'
  | 'router_cctv'
  | 'workshop_tool'
  | 'welder'
  | 'compressor'
  | 'generator_input'
  | 'inverter_input'
  | 'battery_system'
  | 'custom'

export interface CustomLoadInput {
  id: string
  name: string
  kind: EngineeringLoadKind
  room: string
  areaZone?: 'dry' | 'damp' | 'bathroom_zone_0' | 'bathroom_zone_1' | 'bathroom_zone_2' | 'outdoor'
  powerW: number
  phase: ElectricalPhase
  voltage: 230 | 400
  duty?: 'continuous' | 'intermittent' | 'startup-heavy'
  startupCurrentMultiplier?: number
  critical: boolean
  reservePowerRequired: boolean
  dedicatedLineRequired: boolean | 'auto'
  routeLengthM: number
  connectionType?: 'socket' | 'fixed' | 'junction-box' | 'panel-direct'
  userNote?: string
}

export interface EngineeringProjectInput {
  type: EngineeringProjectType
  areaM2: number
  rooms: number
  bathrooms: number
  phase: ElectricalPhase
  inputBreakerA: number
  hasElectricHob: boolean
  hasOven: boolean
  hasBoiler: boolean
  hasWasher: boolean
  hasDishwasher: boolean
  hasConditioner: boolean
  includeWeakCurrent: boolean
  routeLengthM: number
  safetyLevel: 'standard' | 'enhanced'
  customLoads?: CustomLoadInput[]
}

export interface EngineeringLoad {
  id: string
  name: string
  kind: EngineeringLoadKind
  powerW: number
  voltage: 230 | 400
  phase: ElectricalPhase
  wetZone?: boolean
  critical?: boolean
  routeLengthM?: number
  reservePowerRequired?: boolean
  dedicatedLineRequired?: boolean | 'auto'
  room?: string
  areaZone?: 'dry' | 'damp' | 'bathroom_zone_0' | 'bathroom_zone_1' | 'bathroom_zone_2' | 'outdoor'
}

export interface CableSelection {
  cores: number
  sectionMm2: number
  material: 'copper'
  label: string
  voltageDropPct: number
}

export interface BreakerSelection {
  poles: '1P' | '2P' | '3P' | '4P'
  currentA: number
  curve: 'B' | 'C'
  label: string
}

export interface RcdSelection {
  kind: 'rcd' | 'dif'
  currentA: number
  leakageMa: 10 | 30 | 100
  poles: '2P' | '4P'
  label: string
}

export interface EngineeringLine {
  id: string
  name: string
  loads: EngineeringLoad[]
  totalPowerW: number
  calculatedCurrentA: number
  cable: CableSelection
  breaker: BreakerSelection
  rcd?: RcdSelection
  warnings: EngineeringWarning[]
}

export interface ElectricalPanelPlan {
  occupiedModules: number
  recommendedModules: number
  reserveModules: number
  groups: Array<{
    lineId: string
    label: string
    modules: number
  }>
}

export interface EngineeringWarning {
  code: string
  level: 'info' | 'warning' | 'danger'
  message?: string
  params?: Record<string, string | number | boolean>
}

export interface ComplexityResult {
  score: number
  level: 'simple' | 'medium' | 'complex' | 'expert-only'
  reasons: string[]
  aiShouldOfferHelp: boolean
  electricianReviewRequired: boolean
}

export interface NormIssue {
  code: string
  level: 'info' | 'warning' | 'danger'
  severity: import('./normguard/types').NormSeverity
  scope: import('./normguard/types').NormScope
  targetId?: string
  titleKey: string
  messageKey: string
  params?: Record<string, string | number | boolean>
  sourceRefs: import('./normguard/types').SourceRef[]
  fixSuggestions: import('./normguard/types').FixSuggestion[]
  blocksCheckout: boolean
}

export type EngineeringProductRole =
  | 'cable'
  | 'breaker'
  | 'rcd'
  | 'panel'
  | 'voltage_relay'
  | 'accessory'
  | 'ups'
  | 'lighting'

export interface EngineeringCatalogProduct {
  id: string
  slug: string
  sku: string
  name: string
  price: number
  stock: number
  categorySlug: string
  brandName: string | null
  imageUrl: string | null
  attributes: Record<string, unknown>
}

export interface ProductAlternative {
  product: EngineeringCatalogProduct
  score: number
  reason: string
}

export interface ProductRecommendation {
  id: string
  role: EngineeringProductRole
  lineId?: string
  title: string
  requiredSpec: Record<string, string | number | boolean>
  selected?: ProductAlternative
  alternatives: ProductAlternative[]
  reason: string
  reasonCode?: 'match' | 'no-match'
  reasonParams?: Record<string, string | number | boolean>
  warnings: EngineeringWarning[]
}

export interface EngineeringBOMItem {
  recommendationId: string
  role: EngineeringProductRole
  productId?: string
  sku?: string
  name: string
  qty: number
  unitPrice: number
  total: number
  stock?: number
  reason: string
  reasonCode?: 'match' | 'no-match'
  reasonParams?: Record<string, string | number | boolean>
  missing: boolean
  blocksCheckout?: boolean
}

export interface EngineeringBOM {
  items: EngineeringBOMItem[]
  subtotal: number
  missingCount: number
}

export interface EngineeringProject {
  input: EngineeringProjectInput
  loads: EngineeringLoad[]
  lines: EngineeringLine[]
  panel: ElectricalPanelPlan
  recommendations: ProductRecommendation[]
  bom: EngineeringBOM
  warnings: EngineeringWarning[]
  complexity: ComplexityResult
  normIssues: NormIssue[]
}
