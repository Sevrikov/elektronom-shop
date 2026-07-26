/**
 * Panel modular capacity + thermal balance.
 *
 * Modular capacity: every device occupies a fixed number of DIN modules
 * (1 module ≈ 18 mm). The box has a rated module capacity; you can't fit more
 * modules than it holds.
 *
 * Thermal balance (simplified IEC 60890): the devices dissipate heat by their
 * actual load; the enclosure dissipates that heat through its effective surface.
 * Plastic enclosures dissipate worse than metal ones. If the resulting internal
 * temperature rise exceeds the allowed limit, the box overheats.
 */

import type { EngineeringGraph, EngineeringNode } from './graph'
import { getNodeDINModules } from './bom'
import { getDescendants } from './normguard/utils'

export type PanelMaterial = 'plastic' | 'metal'

export interface PanelThermalResult {
  material: PanelMaterial
  capacityModules: number
  occupiedModules: number
  moduleOverflow: boolean
  /** Total heat dissipated by the devices, W */
  heatW: number
  /** Effective heat-dissipating surface of the box, m² */
  surfaceM2: number
  /** Heat the box can shed at the allowed temperature rise, W */
  dissipationW: number
  /** Internal temperature rise above ambient, K */
  tempRiseK: number
  /** Allowed temperature rise (limit), K */
  tempRiseLimitK: number
  overheated: boolean
  boxWidthMm: number
  boxHeightMm: number
  boxDepthMm: number
}

/** Heat loss per pole at rated current, W (typical modular-device figures) */
const DEVICE_LOSS_PER_POLE_W: Partial<Record<EngineeringNode['type'], number>> = {
  mcb: 1.8,
  main_breaker: 2.2,
  rcd: 1.2,
  voltage_relay: 2.0,
  meter: 1.5,
  ats: 2.5,
  surge_protection: 0.5,
}

/** Heat-transfer coefficient of the enclosure surface, W/(m²·K) */
const SURFACE_K: Record<PanelMaterial, number> = {
  metal: 5.5,
  plastic: 3.5,
}

const MODULE_WIDTH_MM = 18
const MODULES_PER_ROW = 12
const ALLOWED_TEMP_RISE_K = 30

function polesCount(poles: unknown): number {
  if (poles === '4P') return 4
  if (poles === '3P') return 3
  if (poles === '2P') return 2
  return 1
}

function round(value: number, digits = 1): number {
  const f = 10 ** digits
  return Math.round(value * f) / f
}

/** Estimate external box dimensions (mm) from rated module capacity */
function boxDimensionsMm(capacityModules: number, material: PanelMaterial) {
  const rows = Math.max(1, Math.ceil(capacityModules / MODULES_PER_ROW))
  const modsPerRow = Math.min(capacityModules, MODULES_PER_ROW)
  const widthMm = modsPerRow * MODULE_WIDTH_MM + 60 // module strip + side margins
  const heightMm = rows * 100 + 40 // ~100 mm per rail row + margins
  const depthMm = material === 'metal' ? 120 : 100
  return { widthMm, heightMm, depthMm }
}

/** Effective dissipating surface (m²) for a wall-mounted box (back excluded) */
function effectiveSurfaceM2(widthMm: number, heightMm: number, depthMm: number): number {
  const w = widthMm / 1000
  const h = heightMm / 1000
  const d = depthMm / 1000
  // front + top + bottom + two sides (the back faces the wall and is excluded)
  return w * h + 2 * (w * d) + 2 * (h * d)
}

export function computePanelThermal(graph: EngineeringGraph, material: PanelMaterial): PanelThermalResult | null {
  const panel = graph.nodes.find((n) => n.type === 'distribution_panel')
  if (!panel) return null

  const capacityModules = typeof panel.properties.modules === 'number' ? panel.properties.modules : 24
  const voltage = graph.network.voltageV || 230
  const phase3 = graph.network.phase === 3

  let occupiedModules = 0
  let heatW = 0

  for (const node of graph.nodes) {
    occupiedModules += getNodeDINModules(node)

    const baseLoss = DEVICE_LOSS_PER_POLE_W[node.type]
    if (baseLoss === undefined) continue

    const poles = polesCount(node.properties.poles)
    const ratedA = typeof node.properties.currentA === 'number' ? node.properties.currentA : 16

    // Downstream load current sets the actual heat (I² law)
    const downstreamPowerW = getDescendants(node.id, graph)
      .filter((n) => n.type === 'load')
      .reduce((sum, l) => sum + (typeof l.properties.powerW === 'number' ? l.properties.powerW : 0), 0)
    const actualA = phase3 ? downstreamPowerW / (Math.sqrt(3) * 400 * 0.95) : downstreamPowerW / voltage
    const utilization = ratedA > 0 ? Math.min(1.2, actualA / ratedA) : 0.5

    heatW += poles * baseLoss * Math.max(0.04, utilization * utilization)
  }

  const dims = boxDimensionsMm(capacityModules, material)
  const surfaceM2 = effectiveSurfaceM2(dims.widthMm, dims.heightMm, dims.depthMm)
  const k = SURFACE_K[material]
  const dissipationW = k * surfaceM2 * ALLOWED_TEMP_RISE_K
  const tempRiseK = surfaceM2 > 0 ? heatW / (k * surfaceM2) : 0

  return {
    material,
    capacityModules,
    occupiedModules,
    moduleOverflow: occupiedModules > capacityModules,
    heatW: round(heatW),
    surfaceM2: round(surfaceM2, 3),
    dissipationW: round(dissipationW),
    tempRiseK: round(tempRiseK),
    tempRiseLimitK: ALLOWED_TEMP_RISE_K,
    overheated: tempRiseK > ALLOWED_TEMP_RISE_K,
    boxWidthMm: dims.widthMm,
    boxHeightMm: dims.heightMm,
    boxDepthMm: dims.depthMm,
  }
}
