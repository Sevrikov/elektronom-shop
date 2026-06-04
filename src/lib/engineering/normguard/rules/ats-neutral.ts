import type { NormRule, NormIssue } from '../types'
import type { EngineeringGraph } from '../../graph'

export const atsNeutralRule: NormRule = {
  code: 'ats-neutral',
  name: 'ATS Neutral and Bonding Check',
  description: 'Validates ATS pole configuration and backup generator/inverter grounding & neutral policies.',
  check(graph: EngineeringGraph): NormIssue[] {
    const issues: NormIssue[] = []

    const atsNodes = graph.nodes.filter((n) => n.type === 'ats')
    const hasBackup = graph.nodes.some((n) => n.type === 'generator' || n.type === 'inverter')

    // Rule A: ATS Pole switching validation
    for (const ats of atsNodes) {
      const phase = graph.network.phase
      const poles = ats.properties.poles || (phase === 3 ? '3P' : '2P')
      const switchesNeutral = ats.properties.switchesNeutral ?? (poles === '4P' || poles === '2P')

      if (hasBackup && !switchesNeutral) {
        issues.push({
          code: 'ats-neutral-no-switching',
          severity: 'danger',
          scope: 'component',
          targetId: ats.id,
          titleKey: 'normguard.rules.ats_neutral_no_switching.title',
          messageKey: 'normguard.rules.ats_neutral_no_switching.message',
          params: { poles, phase },
          sourceRefs: [
            {
              type: 'norm',
              titleKey: 'normguard.sources.iec60364_4_41',
              confidence: 'derived',
            },
            {
              type: 'internal_policy',
              titleKey: 'normguard.sources.elektronom_neutral_isolation_policy',
              confidence: 'exact',
              documentId: 'elektronom-policy-03',
              section: 'backup-neutral',
              verifiedAt: '2026-05-31',
            },
          ],
          fixSuggestions: [
            {
              actionCode: 'UPGRADE_ATS_POLES',
              descriptionKey: 'normguard.fixes.upgradeAtsPoles',
              params: { targetPoles: phase === 3 ? '4P' : '2P' },
            },
          ],
          blocksCheckout: true,
        })
      }
    }

    // Rule B: Backup source ground-neutral bonding check
    const backupSources = graph.nodes.filter((n) => n.type === 'generator' || n.type === 'inverter')
    for (const src of backupSources) {
      const neutralMode = src.properties.neutralMode || 'auto'
      if (neutralMode === 'auto') {
        issues.push({
          code: 'backup-source-bonding',
          severity: 'danger',
          scope: 'source',
          targetId: src.id,
          titleKey: 'normguard.rules.backup_source_bonding.title',
          messageKey: 'normguard.rules.backup_source_bonding.message',
          params: { name: src.label },
          sourceRefs: [
            {
              type: 'norm',
              titleKey: 'normguard.sources.pue2017_1_7_backup',
              confidence: 'exact',
              documentId: 'pue-2017',
              section: '1.7',
              verifiedAt: '2026-05-31',
            },
            {
              type: 'manufacturer_doc',
              titleKey: 'normguard.sources.generator_manual_grounding',
              confidence: 'derived',
            },
          ],
          fixSuggestions: [
            {
              actionCode: 'CONFIGURE_NEUTRAL_MODE',
              descriptionKey: 'normguard.fixes.configureNeutralMode',
              params: { sourceId: src.id },
            },
          ],
          blocksCheckout: true,
        })
      }
    }

    return issues
  },
}
