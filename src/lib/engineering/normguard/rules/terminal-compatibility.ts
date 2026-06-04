import type { NormRule, NormIssue } from '../types'
import type { EngineeringGraph } from '../../graph'

export const terminalCompatibilityRule: NormRule = {
  code: 'terminal-compatibility',
  name: 'Terminal/Clamp Specification Compatibility',
  description: 'Checks that terminal blocks/clamps support the conductor cross-section and strand type.',
  check(graph: EngineeringGraph): NormIssue[] {
    const issues: NormIssue[] = []

    for (const edge of graph.edges) {
      const sourceNode = graph.nodes.find((n) => n.id === edge.source)
      const targetNode = graph.nodes.find((n) => n.id === edge.target)

      if (!sourceNode || !targetNode) continue

      // Identify terminal and cable nodes
      const terminal = sourceNode.type === 'terminal' ? sourceNode : targetNode.type === 'terminal' ? targetNode : null
      const cable = sourceNode.type === 'cable_line' ? sourceNode : targetNode.type === 'cable_line' ? targetNode : null

      if (terminal && cable) {
        const section = Number(cable.properties.sectionMm2 || 1.5)
        const range = terminal.properties.sectionRangeMm2 as [number, number] | undefined
        const strandType = cable.properties.strandType || 'solid'
        const supportedStrands = terminal.properties.strandTypes as string[] | undefined

        // 1. Cross-section check
        if (range) {
          const [min, max] = range
          if (section < min || section > max) {
            issues.push({
              code: 'terminal-section-out-of-range',
              severity: 'danger',
              scope: 'component',
              targetId: terminal.id,
              titleKey: 'normguard.rules.terminal_section_out_of_range.title',
              messageKey: 'normguard.rules.terminal_section_out_of_range.message',
              params: {
                terminalName: terminal.label,
                cableName: cable.label,
                section,
                min,
                max,
              },
              sourceRefs: [
                {
                  type: 'manufacturer_doc',
                  titleKey: 'normguard.sources.terminal_section_spec',
                  confidence: 'exact',
                  documentId: 'wago-spec-2025',
                  section: 'Conductor Sizes',
                  verifiedAt: '2026-05-31',
                },
              ],
              fixSuggestions: [
                {
                  actionCode: 'REPLACE_TERMINAL_SECTION_COMPATIBLE',
                  descriptionKey: 'normguard.fixes.replaceTerminalSectionCompatible',
                  params: { terminalId: terminal.id, requiredSection: section },
                },
              ],
              blocksCheckout: true,
            })
          }
        }

        // 2. Strand type compatibility (e.g. flexible multi-wire in standard screwless push-in terminals)
        if (supportedStrands && !supportedStrands.includes(strandType)) {
          issues.push({
            code: 'terminal-strand-unsupported',
            severity: 'danger',
            scope: 'component',
            targetId: terminal.id,
            titleKey: 'normguard.rules.terminal_strand_unsupported.title',
            messageKey: 'normguard.rules.terminal_strand_unsupported.message',
            params: {
              terminalName: terminal.label,
              cableName: cable.label,
              strandType,
            },
            sourceRefs: [
              {
                type: 'manufacturer_doc',
                titleKey: 'normguard.sources.terminal_strand_spec',
                confidence: 'exact',
                documentId: 'wago-spec-2025',
                section: 'Connection Technology',
                verifiedAt: '2026-05-31',
              },
            ],
            fixSuggestions: [
              {
                actionCode: 'ADD_FERRULE_CRIMPING',
                descriptionKey: 'normguard.fixes.addFerruleCrimping',
                params: { cableId: cable.id },
              },
              {
                actionCode: 'REPLACE_TERMINAL_LEVER',
                descriptionKey: 'normguard.fixes.replaceTerminalLever',
                params: { terminalId: terminal.id },
              },
            ],
            blocksCheckout: true,
          })
        }

        // 3. Multistrand / flexible cable requires ferrule (if specified by terminal properties)
        if (
          strandType === 'flexible' &&
          terminal.properties.requiresFerruleForFlexible &&
          !cable.properties.requiresFerrule // if not explicitly marked as crimped
        ) {
          issues.push({
            code: 'terminal-requires-ferrule',
            severity: 'warning',
            scope: 'load',
            targetId: cable.id,
            titleKey: 'normguard.rules.terminal_requires_ferrule.title',
            messageKey: 'normguard.rules.terminal_requires_ferrule.message',
            params: { cableName: cable.label, terminalName: terminal.label },
            sourceRefs: [
              {
                type: 'norm',
                titleKey: 'normguard.sources.pue2017_2_1_crimp',
                confidence: 'exact',
                documentId: 'pue-2017',
                section: '2.1',
                verifiedAt: '2026-05-31',
              },
            ],
            fixSuggestions: [
              {
                actionCode: 'ADD_FERRULE_CRIMPING',
                descriptionKey: 'normguard.fixes.addFerruleCrimpingFlexible',
                params: { cableId: cable.id },
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
