import type { NormRule, NormIssue } from '../types'
import type { EngineeringGraph } from '../../graph'
import { getAncestors } from '../utils'

export const wetZoneRcdRule: NormRule = {
  code: 'wet-zone-rcd',
  name: 'Wet Zone RCD Protection',
  description: 'Checks if wet area loads are protected by a RCD (max 30mA, recommended 10mA for bathrooms).',
  check(graph: EngineeringGraph): NormIssue[] {
    const issues: NormIssue[] = []

    // 1. Find all load nodes
    const loads = graph.nodes.filter((n) => n.type === 'load')

    for (const load of loads) {
      const isWetZone = ['damp', 'bathroom_zone_0', 'bathroom_zone_1', 'bathroom_zone_2', 'outdoor'].includes(
        load.properties.areaZone || ''
      ) || load.properties.kind === 'bathroom_socket'

      if (!isWetZone) continue

      // 2. Find if this load has an RCD ancestor
      const ancestors = getAncestors(load.id, graph)
      const rcdNode = ancestors.find((a) => a.type === 'rcd')

      if (!rcdNode) {
        issues.push({
          code: 'wet-zone-no-rcd',
          severity: 'danger',
          scope: 'load',
          targetId: load.id,
          titleKey: 'normguard.rules.wet_zone_no_rcd.title',
          messageKey: 'normguard.rules.wet_zone_no_rcd.message',
          params: { name: load.label },
          sourceRefs: [
            {
              type: 'norm',
              titleKey: 'normguard.sources.pue2017_7_1_28',
              confidence: 'exact',
              documentId: 'pue-2017',
              section: '7.1',
              verifiedAt: '2026-05-31',
            },
            {
              type: 'norm',
              titleKey: 'normguard.sources.iec60364_7_701',
              confidence: 'exact',
              documentId: 'iec-60364-7-701',
              section: 'Chapter 701',
              verifiedAt: '2026-05-31',
            },
          ],
          fixSuggestions: [
            {
              actionCode: 'ADD_RCD_PROTECTION',
              descriptionKey: 'normguard.fixes.addRcdProtection',
              params: { leakageMa: 30 },
            },
          ],
          blocksCheckout: true,
        })
      } else {
        const leakageMa = Number(rcdNode.properties.leakageMa || 30)
        if (leakageMa > 30) {
          issues.push({
            code: 'wet-zone-rcd-too-high',
            severity: 'danger',
            scope: 'load',
            targetId: load.id,
            titleKey: 'normguard.rules.wet_zone_rcd_too_high.title',
            messageKey: 'normguard.rules.wet_zone_rcd_too_high.message',
            params: { name: load.label, currentLeakage: leakageMa },
            sourceRefs: [
              {
                type: 'norm',
                titleKey: 'normguard.sources.pue2017_7_1_30',
                confidence: 'exact',
                documentId: 'pue-2017',
                section: '7.1',
                verifiedAt: '2026-05-31',
              },
            ],
            fixSuggestions: [
              {
                actionCode: 'REPLACE_RCD_LEAKAGE',
                descriptionKey: 'normguard.fixes.replaceRcdLeakage30',
                params: { rcdNodeId: rcdNode.id, targetLeakageMa: 30 },
              },
            ],
            blocksCheckout: true,
          })
        } else if (
          ['bathroom_zone_0', 'bathroom_zone_1', 'bathroom_zone_2'].includes(load.properties.areaZone || '') &&
          leakageMa === 30
        ) {
          // Warning: recommend 10mA for bathroom zone
          issues.push({
            code: 'wet-zone-rcd-recommend-10ma',
            severity: 'warning',
            scope: 'load',
            targetId: load.id,
            titleKey: 'normguard.rules.wet_zone_rcd_recommend_10ma.title',
            messageKey: 'normguard.rules.wet_zone_rcd_recommend_10ma.message',
            params: { name: load.label },
            sourceRefs: [
              {
                type: 'internal_policy',
                titleKey: 'normguard.sources.elektronom_bathroom_policy',
                confidence: 'derived',
              },
            ],
            fixSuggestions: [
              {
                actionCode: 'REPLACE_RCD_LEAKAGE',
                descriptionKey: 'normguard.fixes.replaceRcdLeakage10',
                params: { rcdNodeId: rcdNode.id, targetLeakageMa: 10 },
              },
            ],
            blocksCheckout: false,
          })
        }
      }
    }

    return issues
  },
}
