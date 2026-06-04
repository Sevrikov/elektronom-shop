import type { NormIssue } from './normguard/types'
import type { EngineeringGraph } from './graph'

/**
 * Validates the structural integrity and properties of an EngineeringGraph.
 * Returns an array of NormIssues if errors are found.
 */
export function validateEngineeringGraph(graph: unknown): NormIssue[] {
  const issues: NormIssue[] = []

  if (!graph || typeof graph !== 'object') {
    issues.push({
      code: 'graph-invalid-structure',
      severity: 'danger',
      scope: 'project',
      titleKey: 'normguard.validation.invalid_structure.title',
      messageKey: 'normguard.validation.invalid_structure.message',
      sourceRefs: [],
      fixSuggestions: [],
      blocksCheckout: true,
    })
    return issues
  }

  const g = graph as EngineeringGraph

  // 1. Verify existence of nodes and edges arrays
  if (!Array.isArray(g.nodes) || !Array.isArray(g.edges)) {
    issues.push({
      code: 'graph-missing-arrays',
      severity: 'danger',
      scope: 'project',
      titleKey: 'normguard.validation.missing_arrays.title',
      messageKey: 'normguard.validation.missing_arrays.message',
      sourceRefs: [],
      fixSuggestions: [],
      blocksCheckout: true,
    })
    return issues
  }

  // 2. Check for duplicate Node IDs
  const seenNodeIds = new Set<string>()
  for (const node of g.nodes) {
    if (!node || typeof node.id !== 'string') {
      issues.push({
        code: 'graph-invalid-node-id',
        severity: 'danger',
        scope: 'project',
        titleKey: 'normguard.validation.invalid_node_id.title',
        messageKey: 'normguard.validation.invalid_node_id.message',
        sourceRefs: [],
        fixSuggestions: [],
        blocksCheckout: true,
      })
      continue
    }

    if (seenNodeIds.has(node.id)) {
      issues.push({
        code: 'graph-duplicate-node',
        severity: 'danger',
        scope: 'project',
        targetId: node.id,
        titleKey: 'normguard.validation.duplicate_node.title',
        messageKey: 'normguard.validation.duplicate_node.message',
        params: { id: node.id },
        sourceRefs: [],
        fixSuggestions: [],
        blocksCheckout: true,
      })
    } else {
      seenNodeIds.add(node.id)
    }

    // 3. Node property verification
    if (node.properties) {
      const props = node.properties
      if (props.powerW !== undefined && (typeof props.powerW !== 'number' || props.powerW < 0)) {
        issues.push({
          code: 'graph-invalid-properties',
          severity: 'danger',
          scope: 'component',
          targetId: node.id,
          titleKey: 'normguard.validation.invalid_property.title',
          messageKey: 'normguard.validation.invalid_property.message',
          params: { node: node.label, propName: 'powerW', expected: 'positive number' },
          sourceRefs: [],
          fixSuggestions: [],
          blocksCheckout: true,
        })
      }
      if (props.phase !== undefined && props.phase !== 1 && props.phase !== 3) {
        issues.push({
          code: 'graph-invalid-properties',
          severity: 'danger',
          scope: 'component',
          targetId: node.id,
          titleKey: 'normguard.validation.invalid_property.title',
          messageKey: 'normguard.validation.invalid_property.message',
          params: { node: node.label, propName: 'phase', expected: '1 or 3' },
          sourceRefs: [],
          fixSuggestions: [],
          blocksCheckout: true,
        })
      }
      if (props.voltageV !== undefined && props.voltageV !== 230 && props.voltageV !== 400) {
        issues.push({
          code: 'graph-invalid-properties',
          severity: 'danger',
          scope: 'component',
          targetId: node.id,
          titleKey: 'normguard.validation.invalid_property.title',
          messageKey: 'normguard.validation.invalid_property.message',
          params: { node: node.label, propName: 'voltageV', expected: '230 or 400' },
          sourceRefs: [],
          fixSuggestions: [],
          blocksCheckout: true,
        })
      }
    }
  }

  // 4. Check for invalid edges (referring to non-existent nodes)
  for (const edge of g.edges) {
    if (!edge || typeof edge.source !== 'string' || typeof edge.target !== 'string') {
      issues.push({
        code: 'graph-invalid-edge-structure',
        severity: 'danger',
        scope: 'project',
        titleKey: 'normguard.validation.invalid_edge_structure.title',
        messageKey: 'normguard.validation.invalid_edge_structure.message',
        sourceRefs: [],
        fixSuggestions: [],
        blocksCheckout: true,
      })
      continue
    }

    const sourceExists = seenNodeIds.has(edge.source)
    const targetExists = seenNodeIds.has(edge.target)

    if (!sourceExists || !targetExists) {
      issues.push({
        code: 'graph-invalid-edge',
        severity: 'danger',
        scope: 'project',
        targetId: edge.id,
        titleKey: 'normguard.validation.invalid_edge.title',
        messageKey: 'normguard.validation.invalid_edge.message',
        params: {
          edgeId: edge.id,
          source: edge.source,
          target: edge.target,
          sourceExists: sourceExists ? 'true' : 'false',
          targetExists: targetExists ? 'true' : 'false',
        },
        sourceRefs: [],
        fixSuggestions: [],
        blocksCheckout: true,
      })
    }
  }

  return issues
}
