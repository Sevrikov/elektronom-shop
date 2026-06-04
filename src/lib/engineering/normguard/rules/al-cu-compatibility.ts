import type { NormRule, NormIssue } from '../types'
import type { EngineeringGraph } from '../../graph'

export const alCuCompatibilityRule: NormRule = {
  code: 'al-cu-compatibility',
  name: 'Al/Cu Galvanic Compatibility Check',
  description: 'Checks for dangerous direct connections between aluminum and copper conductors without bi-metallic terminals or special paste.',
  check(graph: EngineeringGraph): NormIssue[] {
    const issues: NormIssue[] = []

    for (const edge of graph.edges) {
      const sourceNode = graph.nodes.find((n) => n.id === edge.source)
      const targetNode = graph.nodes.find((n) => n.id === edge.target)

      if (!sourceNode || !targetNode) continue

      const sourceMat = sourceNode.properties.material
      const targetMat = targetNode.properties.material

      // Case A: Direct connection between Cu and Al cables
      if (
        (sourceNode.type === 'cable_line' && targetNode.type === 'cable_line') &&
        ((sourceMat === 'Cu' && targetMat === 'Al') || (sourceMat === 'Al' && targetMat === 'Cu'))
      ) {
        issues.push({
          code: 'direct-al-cu-connection',
          severity: 'danger',
          scope: 'project',
          targetId: edge.id,
          titleKey: 'normguard.rules.direct_al_cu_connection.title',
          messageKey: 'normguard.rules.direct_al_cu_connection.message',
          params: { source: sourceNode.label, target: targetNode.label },
          sourceRefs: [
            {
              type: 'norm',
              titleKey: 'normguard.sources.pue2017_2_1_connection',
              confidence: 'exact',
              documentId: 'pue-2017',
              section: '2.1',
              verifiedAt: '2026-05-31',
            },
          ],
          fixSuggestions: [
            {
              actionCode: 'INSERT_AL_CU_TERMINAL',
              descriptionKey: 'normguard.fixes.insertAlCuTerminal',
              params: { edgeId: edge.id },
            },
          ],
          blocksCheckout: true,
        })
      }

      // Case B: Al cable connected to a terminal/clamp/busbar that only supports Cu
      if (
        (sourceNode.type === 'cable_line' && sourceMat === 'Al' && targetNode.type === 'terminal') ||
        (targetNode.type === 'cable_line' && targetMat === 'Al' && sourceNode.type === 'terminal')
      ) {
        const terminal = sourceNode.type === 'terminal' ? sourceNode : targetNode
        const cable = sourceNode.type === 'cable_line' ? sourceNode : targetNode
        const supported = terminal.properties.materialsSupported as string[] | undefined

        if (supported && !supported.includes('Al')) {
          issues.push({
            code: 'terminal-cu-only',
            severity: 'danger',
            scope: 'component',
            targetId: terminal.id,
            titleKey: 'normguard.rules.terminal_cu_only.title',
            messageKey: 'normguard.rules.terminal_cu_only.message',
            params: { terminalName: terminal.label, cableName: cable.label },
            sourceRefs: [
              {
                type: 'manufacturer_doc',
                titleKey: 'normguard.sources.terminal_manufacturer_spec',
                confidence: 'exact',
                documentId: 'wago-spec-2025',
                section: 'Technical Data',
                verifiedAt: '2026-05-31',
              },
            ],
            fixSuggestions: [
              {
                actionCode: 'REPLACE_TERMINAL_COMPATIBLE',
                descriptionKey: 'normguard.fixes.replaceTerminalCompatibleAl',
                params: { terminalId: terminal.id, requiredMaterial: 'Al' },
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
