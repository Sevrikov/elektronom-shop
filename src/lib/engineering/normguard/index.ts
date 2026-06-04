import type { EngineeringGraph } from '../graph'
import type { NormIssue } from './types'
import { NORM_RULES_REGISTRY } from './registry'
import { validateEngineeringGraph } from '../graph-validation'

export * from './types'
export * from './registry'
export * from './utils'

/**
 * Validates the entire EngineeringGraph against structural constraints and all registered NormGuard rules.
 * Returns an array of NormIssues.
 */
export function runNormGuard(graph: EngineeringGraph): NormIssue[] {
  // 1. Run structural graph validation first
  const structuralIssues = validateEngineeringGraph(graph)
  if (structuralIssues.length > 0) {
    return structuralIssues
  }

  // 2. Run rule checks
  const issues: NormIssue[] = []
  
  for (const rule of NORM_RULES_REGISTRY) {
    try {
      const ruleIssues = rule.check(graph)
      issues.push(...ruleIssues)
    } catch (error) {
      console.error(`Error running NormGuard rule ${rule.code}:`, error)
      issues.push({
        code: `rule-execution-error-${rule.code}`,
        severity: 'danger',
        scope: 'project',
        titleKey: 'normguard.rules.error.title',
        messageKey: 'normguard.rules.error.message',
        params: { rule: rule.code, error: String(error) },
        sourceRefs: [],
        fixSuggestions: [],
        blocksCheckout: true,
      })
    }
  }
  
  return issues
}
