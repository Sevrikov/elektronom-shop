import type { NormRule, NormIssue } from '../types'
import type { EngineeringGraph } from '../../graph'

export const panelCapacityRule: NormRule = {
  code: 'panel-capacity',
  name: 'Distribution Panel Module Capacity',
  description: 'Checks if the distribution panel has sufficient modules for all components and leaves a minimum reserve (20%).',
  check(graph: EngineeringGraph): NormIssue[] {
    const issues: NormIssue[] = []

    const panelNode = graph.nodes.find((n) => n.type === 'distribution_panel')
    if (!panelNode) return issues

    const capacity = Number(panelNode.properties.modules || 24)

    // Calculate occupied modules
    let occupied = 0
    for (const node of graph.nodes) {
      if (['load', 'cable_line', 'distribution_panel', 'grid_input', 'terminal'].includes(node.type)) {
        continue
      }

      // Read modules from properties or estimate based on type/poles
      let m = Number(node.properties.modules || 0)
      if (m === 0) {
        const poles = node.properties.poles || ''
        if (node.type === 'mcb' || node.type === 'rcd') {
          if (poles === '4P') m = 4
          else if (poles === '3P') m = 3
          else if (poles === '2P') m = 2
          else m = 1
        } else if (node.type === 'voltage_relay') {
          m = 3 // Standard single or three phase relay
        } else if (node.type === 'surge_protection') {
          m = poles === '4P' ? 4 : 2
        } else if (node.type === 'ats') {
          m = poles === '4P' ? 4 : 2
        } else if (node.type === 'meter') {
          m = 4
        } else {
          m = 1 // Default fallback
        }
      }
      occupied += m
    }

    const free = capacity - occupied
    const reservePct = capacity > 0 ? (free / capacity) * 100 : 0

    if (occupied > capacity) {
      issues.push({
        code: 'panel-overflow',
        severity: 'danger',
        scope: 'panel',
        targetId: panelNode.id,
        titleKey: 'normguard.rules.panel_overflow.title',
        messageKey: 'normguard.rules.panel_overflow.message',
        params: {
          panelName: panelNode.label,
          occupied,
          capacity,
        },
        sourceRefs: [
          {
            type: 'internal_policy',
            titleKey: 'normguard.sources.elektronom_panel_selection_policy',
            confidence: 'exact',
            documentId: 'elektronom-panel-01',
            section: 'Module Space',
            verifiedAt: '2026-05-31',
          },
        ],
        fixSuggestions: [
          {
            actionCode: 'UPGRADE_PANEL_SIZE',
            descriptionKey: 'normguard.fixes.upgradePanelSizeOverflow',
            params: { requiredModules: occupied + 4 },
          },
        ],
        blocksCheckout: true,
      })
    } else if (reservePct < 20) {
      issues.push({
        code: 'panel-low-reserve',
        severity: 'warning',
        scope: 'panel',
        targetId: panelNode.id,
        titleKey: 'normguard.rules.panel_low_reserve.title',
        messageKey: 'normguard.rules.panel_low_reserve.message',
        params: {
          panelName: panelNode.label,
          occupied,
          capacity,
          free,
          reservePct: Number(reservePct.toFixed(1)),
        },
        sourceRefs: [
          {
            type: 'norm',
            titleKey: 'normguard.sources.dbn_panel_reserve_space',
            confidence: 'derived',
          },
        ],
        fixSuggestions: [
          {
            actionCode: 'UPGRADE_PANEL_SIZE',
            descriptionKey: 'normguard.fixes.upgradePanelSizeLowReserve',
            params: { requiredModules: Math.ceil(occupied * 1.25) },
          },
        ],
        blocksCheckout: false,
      })
    }

    return issues
  },
}
