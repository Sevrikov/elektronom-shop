import type { EngineeringGraph, EngineeringNode } from '../graph'

/**
 * Finds all ancestor nodes of a given node in the graph by traversing incoming edges
 */
export function getAncestors(nodeId: string, graph: EngineeringGraph): EngineeringNode[] {
  const ancestors: EngineeringNode[] = []
  const visited = new Set<string>()
  const queue = [nodeId]

  while (queue.length > 0) {
    const currentId = queue.shift()!
    if (visited.has(currentId)) continue
    visited.add(currentId)

    const incomingEdges = graph.edges.filter((e) => e.target === currentId)
    for (const edge of incomingEdges) {
      const sourceNode = graph.nodes.find((n) => n.id === edge.source)
      if (sourceNode && !visited.has(sourceNode.id)) {
        ancestors.push(sourceNode)
        queue.push(sourceNode.id)
      }
    }
  }

  return ancestors
}

/**
 * Finds all descendant nodes of a given node in the graph by traversing outgoing edges
 */
export function getDescendants(nodeId: string, graph: EngineeringGraph): EngineeringNode[] {
  const descendants: EngineeringNode[] = []
  const visited = new Set<string>()
  const queue = [nodeId]

  while (queue.length > 0) {
    const currentId = queue.shift()!
    if (visited.has(currentId)) continue
    visited.add(currentId)

    const outgoingEdges = graph.edges.filter((e) => e.source === currentId)
    for (const edge of outgoingEdges) {
      const targetNode = graph.nodes.find((n) => n.id === edge.target)
      if (targetNode && !visited.has(targetNode.id)) {
        descendants.push(targetNode)
        queue.push(targetNode.id)
      }
    }
  }

  return descendants
}
