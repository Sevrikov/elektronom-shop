import type { NormRule, NormIssue } from '../types'
import type { EngineeringGraph } from '../../graph'
import { getDescendants } from '../utils'

export const voltageDropRule: NormRule = {
  code: 'voltage-drop',
  name: 'Cable Voltage Drop Calculation',
  description: 'Calculates the percentage voltage drop along cable lines and flags warning/danger if bounds are exceeded (3% for lighting, 5% for other loads).',
  check(graph: EngineeringGraph): NormIssue[] {
    const issues: NormIssue[] = []
    const cables = graph.nodes.filter((n) => n.type === 'cable_line')

    for (const cable of cables) {
      const section = Number(cable.properties.sectionMm2 || 1.5)
      const material = cable.properties.material || 'Cu'
      const length = Number(cable.properties.routeLengthM || 10)
      const phase = graph.network.phase
      const voltage = graph.network.voltageV

      // 1. Calculate current passing through this cable
      // Find all downstream load nodes
      const descendants = getDescendants(cable.id, graph)
      const downstreamLoads = descendants.filter((d) => d.type === 'load')

      let totalPowerW = 0
      for (const load of downstreamLoads) {
        totalPowerW += Number(load.properties.powerW || 0)
      }

      // If no downstream loads, default power or fallback to breaker current
      if (totalPowerW === 0) {
        totalPowerW = Number(cable.properties.powerW || 0)
      }

      const current = totalPowerW > 0 
        ? (phase === 3 ? totalPowerW / (Math.sqrt(3) * voltage) : totalPowerW / voltage)
        : Number(cable.properties.currentA || 10)

      if (current <= 0) continue

      // 2. Perform voltage drop calculation
      // Resistivity: Copper = 0.0175, Aluminum = 0.028
      const rho = material === 'Al' ? 0.028 : 0.0175
      
      let dropV = 0
      if (phase === 3) {
        // 3-phase line drop: delta U = sqrt(3) * I * L * rho / S
        dropV = (Math.sqrt(3) * current * length * rho) / section
      } else {
        // 1-phase line drop: delta U = 2 * I * L * rho / S
        dropV = (2 * current * length * rho) / section
      }

      const dropPct = (dropV / voltage) * 100

      // 3. Determine thresholds
      const isLighting = downstreamLoads.some((l) => l.properties.kind === 'lighting')
      const limitPct = isLighting ? 3.0 : 5.0

      if (dropPct > limitPct) {
        const severity = dropPct > limitPct * 1.5 ? 'danger' : 'warning'
        issues.push({
          code: 'voltage-drop-excessive',
          severity,
          scope: 'line',
          targetId: cable.id,
          titleKey: 'normguard.rules.voltage_drop_excessive.title',
          messageKey: 'normguard.rules.voltage_drop_excessive.message',
          params: {
            cableName: cable.label,
            dropPct: Number(dropPct.toFixed(2)),
            limitPct,
            length,
            section,
            material,
          },
          sourceRefs: [
            {
              type: 'norm',
              titleKey: 'normguard.sources.pue2017_2_1_dbn',
              confidence: 'exact',
              documentId: 'pue-2017',
              section: '2.1',
              verifiedAt: '2026-05-31',
            },
            {
              type: 'norm',
              titleKey: 'normguard.sources.iec60364_5_52_g',
              confidence: 'exact',
              documentId: 'iec-60364-5-52',
              section: 'Annex G',
              verifiedAt: '2026-05-31',
            },
          ],
          fixSuggestions: [
            {
              actionCode: 'UPGRADE_CABLE_SECTION',
              descriptionKey: 'normguard.fixes.upgradeCableSectionVoltageDrop',
              params: { cableId: cable.id, currentSection: section },
            },
          ],
          blocksCheckout: severity === 'danger',
        })
      }
    }

    return issues
  },
}
