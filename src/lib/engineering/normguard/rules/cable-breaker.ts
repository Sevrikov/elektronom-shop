import type { NormRule, NormIssue } from '../types'
import type { EngineeringGraph } from '../../graph'
import { getAncestors } from '../utils'

const CABLE_CAPACITY_CU: Record<number, number> = {
  1.5: 15, // A
  2.5: 21,
  4: 27,
  6: 36,
  10: 50,
  16: 66,
  25: 88,
}

const CABLE_CAPACITY_AL: Record<number, number> = {
  2.5: 16,
  4: 21,
  6: 28,
  10: 39,
  16: 51,
  25: 70,
}

export const cableBreakerRule: NormRule = {
  code: 'cable-breaker',
  name: 'Cable Overcurrent Protection',
  description: 'Validates that the circuit breaker rating does not exceed the safe current-carrying capacity of the cable.',
  check(graph: EngineeringGraph): NormIssue[] {
    const issues: NormIssue[] = []

    const cables = graph.nodes.filter((n) => n.type === 'cable_line')

    for (const cable of cables) {
      const section = Number(cable.properties.sectionMm2 || 1.5)
      const material = cable.properties.material || 'Cu'

      const capacityMap = material === 'Al' ? CABLE_CAPACITY_AL : CABLE_CAPACITY_CU
      const maxCapacity = capacityMap[section] || (material === 'Al' ? 10 : 13) // safe defaults

      // Find the upstream breaker
      const ancestors = getAncestors(cable.id, graph)
      const breaker = ancestors.find((a) => a.type === 'mcb')

      if (breaker) {
        const breakerA = Number(breaker.properties.currentA || 16)

        if (breakerA > maxCapacity) {
          issues.push({
            code: 'cable-overprotected',
            severity: 'danger',
            scope: 'line',
            targetId: cable.id,
            titleKey: 'normguard.rules.cable_overprotected.title',
            messageKey: 'normguard.rules.cable_overprotected.message',
            params: {
              cableName: cable.label,
              breakerName: breaker.label,
              breakerA,
              maxCapacity,
              section,
              material,
            },
            sourceRefs: [
              {
                type: 'norm',
                titleKey: 'normguard.sources.pue2017_3_1',
                confidence: 'exact',
                documentId: 'pue-2017',
                section: '3.1',
                verifiedAt: '2026-05-31',
              },
              {
                type: 'norm',
                titleKey: 'normguard.sources.iec60364_4_43',
                confidence: 'exact',
                documentId: 'iec-60364-4-43',
                section: 'Clause 43',
                verifiedAt: '2026-05-31',
              },
            ],
            fixSuggestions: [
              {
                actionCode: 'DOWNGRADE_BREAKER',
                descriptionKey: 'normguard.fixes.downgradeBreaker',
                params: { breakerId: breaker.id, maxAllowedA: Math.floor(maxCapacity) },
              },
              {
                actionCode: 'UPGRADE_CABLE_SECTION',
                descriptionKey: 'normguard.fixes.upgradeCableSection',
                params: { cableId: cable.id },
              },
            ],
            blocksCheckout: true,
          })
        }
      }
    }

    return issues
  },
}
