import type { EngineeringGraph, EngineeringNode } from './graph'
import { getDescendants } from './normguard/utils'

export interface EngineeringCAEIssue {
  code: string
  severity: 'info' | 'warning' | 'danger'
  targetId?: string | undefined
  message: string
}

export interface EngineeringCAELineCheck {
  cableId: string
  loadPowerW: number
  currentA: number
  voltageDropPct: number
  ampacityA: number
  marginA: number
}

export interface EngineeringCAEResult {
  totalPowerW: number
  estimatedCurrentA: number
  lineChecks: EngineeringCAELineCheck[]
  issues: EngineeringCAEIssue[]
}

const CABLE_CAPACITY_CU: Record<number, number> = {
  1.5: 15,
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

function loadPower(node: EngineeringNode) {
  return typeof node.properties.powerW === 'number' ? node.properties.powerW : 0
}

function cableAmpacity(node: EngineeringNode) {
  const section = Number(node.properties.sectionMm2 ?? 1.5)
  const material = node.properties.material === 'Al' ? 'Al' : 'Cu'
  return material === 'Al'
    ? CABLE_CAPACITY_AL[section] ?? 10
    : CABLE_CAPACITY_CU[section] ?? 13
}

function voltageDropPct(cable: EngineeringNode, currentA: number, graph: EngineeringGraph) {
  const section = Number(cable.properties.sectionMm2 ?? 1.5)
  const material = cable.properties.material === 'Al' ? 'Al' : 'Cu'
  const lengthM = Number(cable.properties.routeLengthM ?? 10)
  const rho = material === 'Al' ? 0.028 : 0.0175
  const factor = graph.network.phase === 3 ? Math.sqrt(3) : 2
  const dropV = (factor * currentA * lengthM * rho) / section
  return Number(((dropV / graph.network.voltageV) * 100).toFixed(2))
}

function currentForPower(powerW: number, graph: EngineeringGraph) {
  if (powerW <= 0) return 0
  if (graph.network.phase === 3) return powerW / (Math.sqrt(3) * 400 * 0.95)
  return powerW / graph.network.voltageV
}

export function runEngineeringCAE(graph: EngineeringGraph): EngineeringCAEResult {
  const issues: EngineeringCAEIssue[] = []
  const lineChecks: EngineeringCAELineCheck[] = []
  const connectedNodeIds = new Set<string>()

  for (const edge of graph.edges) {
    connectedNodeIds.add(edge.source)
    connectedNodeIds.add(edge.target)
  }

  for (const node of graph.nodes) {
    if (node.type !== 'grid_input' && node.type !== 'distribution_panel' && !connectedNodeIds.has(node.id)) {
      issues.push({
        code: 'cae-dangling-node',
        severity: 'warning',
        targetId: node.id,
        message: 'Element is not connected to the project graph.',
      })
    }
  }

  const loads = graph.nodes.filter((node) => node.type === 'load')
  const totalPowerW = loads.reduce((sum, node) => sum + loadPower(node), 0)

  for (const cable of graph.nodes.filter((node) => node.type === 'cable_line')) {
    const downstreamLoads = getDescendants(cable.id, graph).filter((node) => node.type === 'load')
    const loadPowerW = downstreamLoads.reduce((sum, node) => sum + loadPower(node), 0)
    const currentA = Number(currentForPower(loadPowerW, graph).toFixed(1))
    const ampacityA = cableAmpacity(cable)
    const dropPct = voltageDropPct(cable, currentA, graph)
    const marginA = Number((ampacityA - currentA).toFixed(1))

    lineChecks.push({
      cableId: cable.id,
      loadPowerW,
      currentA,
      voltageDropPct: dropPct,
      ampacityA,
      marginA,
    })

    if (downstreamLoads.length === 0) {
      issues.push({
        code: 'cae-cable-without-load',
        severity: 'warning',
        targetId: cable.id,
        message: 'Cable line has no downstream load.',
      })
    }

    if (marginA < 0) {
      issues.push({
        code: 'cae-ampacity-negative-margin',
        severity: 'danger',
        targetId: cable.id,
        message: `Cable current exceeds estimated ampacity by ${Math.abs(marginA)} A.`,
      })
    } else if (marginA < 3 && currentA > 0) {
      issues.push({
        code: 'cae-ampacity-low-margin',
        severity: 'warning',
        targetId: cable.id,
        message: `Cable ampacity margin is only ${marginA} A.`,
      })
    }

    if (dropPct > 5) {
      issues.push({
        code: 'cae-voltage-drop',
        severity: dropPct > 7.5 ? 'danger' : 'warning',
        targetId: cable.id,
        message: `Estimated voltage drop is ${dropPct}%.`,
      })
    }
  }

  return {
    totalPowerW,
    estimatedCurrentA: Number(currentForPower(totalPowerW * 0.62, graph).toFixed(1)),
    lineChecks,
    issues,
  }
}
