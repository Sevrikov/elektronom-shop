import type { NormRule } from './types'
import { wetZoneRcdRule } from './rules/wet-zone-rcd'
import { atsNeutralRule } from './rules/ats-neutral'
import { cableBreakerRule } from './rules/cable-breaker'
import { alCuCompatibilityRule } from './rules/al-cu-compatibility'
import { terminalCompatibilityRule } from './rules/terminal-compatibility'
import { voltageDropRule } from './rules/voltage-drop'
import { panelCapacityRule } from './rules/panel-capacity'

export const NORM_RULES_REGISTRY: NormRule[] = [
  wetZoneRcdRule,
  atsNeutralRule,
  cableBreakerRule,
  alCuCompatibilityRule,
  terminalCompatibilityRule,
  voltageDropRule,
  panelCapacityRule,
]
