import type { EngineeringCatalogProduct } from './types'
import type { EngineeringNode } from './graph'

/**
 * Validates a product against the Electronom ProductQualityGate.
 * A product cannot be used for engineering recommendation if it misses critical safety/pricing fields.
 */
export function passesQualityGate(product: EngineeringCatalogProduct): { passes: boolean; reasons: string[] } {
  const reasons: string[] = []

  // 1. Missing image
  if (!product.imageUrl || product.imageUrl.trim() === '') {
    reasons.push('missing_image')
  }

  // 2. Missing price
  if (product.price <= 0) {
    reasons.push('missing_price')
  }

  // 3. Missing stock
  if (product.stock <= 0) {
    reasons.push('missing_stock')
  }

  // 4. Missing brand
  if (!product.brandName || product.brandName.trim() === '') {
    reasons.push('missing_brand')
  }

  // 5. Missing technical name/description
  if (!product.name || product.name.trim() === '') {
    reasons.push('missing_name')
  }

  // 6. Missing critical engineering role attribute
  const engineeringRole = product.attributes.engineeringRole as string | undefined
  if (!engineeringRole || engineeringRole.trim() === '') {
    reasons.push('missing_engineering_role')
  }

  // 7. Safety-critical items require standard certification or datasheet references
  if (engineeringRole === 'breaker' || engineeringRole === 'rcd' || engineeringRole === 'voltage_relay') {
    const standard = product.attributes.standard as string | undefined
    const manufacturerDoc = product.attributes.manufacturerDoc as string | undefined
    const safetySource = product.attributes.safetySource as string | undefined
    if (!standard && !manufacturerDoc && !safetySource) {
      reasons.push('missing_safety_certification')
    }
  }

  return {
    passes: reasons.length === 0,
    reasons,
  }
}

/** Catalog role expected for each node type; node types absent here are never auto-matched */
const NODE_TYPE_EXPECTED_ROLE: Partial<Record<EngineeringNode['type'], string>> = {
  mcb: 'breaker',
  main_breaker: 'breaker',
  rcd: 'rcd',
  cable_line: 'cable',
  distribution_panel: 'panel',
  voltage_relay: 'voltage_relay',
  ats: 'ats',
  terminal: 'terminal',
  meter: 'meter',
  busbar_n: 'busbar',
  busbar_pe: 'busbar',
  surge_protection: 'spd',
}

/**
 * Calculates a compatibility score (0 - 100) between an EngineeringNode and an EngineeringCatalogProduct.
 * Returns 0 if they are structurally incompatible.
 */
export function scoreProductCompatibility(node: EngineeringNode, product: EngineeringCatalogProduct): { score: number; reasons: string[] } {
  const reasons: string[] = []

  // First verify it passes the quality gate
  const gateResult = passesQualityGate(product)
  if (!gateResult.passes) {
    return { score: 0, reasons: [...gateResult.reasons, 'fails_quality_gate'] }
  }

  const role = product.attributes.engineeringRole as string

  // Generic role guard: without it, node types that have no refinement branch
  // below (busbar, meter, …) would accept ANY product passing the gate.
  const expectedRole = NODE_TYPE_EXPECTED_ROLE[node.type]
  if (!expectedRole) {
    return { score: 0, reasons: ['node_type_not_matchable'] }
  }
  if (role !== expectedRole) {
    return { score: 0, reasons: ['role_mismatch'] }
  }

  let score = 50 // Base score for correct role matching

  // Helper to safely parse numbers
  const parseNum = (val: unknown): number | null => {
    if (typeof val === 'number') return val
    if (typeof val === 'string') {
      const parsed = parseFloat(val)
      return isNaN(parsed) ? null : parsed
    }
    return null
  }

  // Helper to safely compare strings case-insensitively
  const compareStr = (a: unknown, b: unknown): boolean => {
    if (typeof a !== 'string' || typeof b !== 'string') return false
    return a.trim().toLowerCase() === b.trim().toLowerCase()
  }

  // Match by node type
  if (node.type === 'mcb' || node.type === 'main_breaker') {
    if (role !== 'breaker') return { score: 0, reasons: ['role_mismatch'] }

    // Check poles (e.g. 1P, 2P, 3P, 4P)
    const productPoles = product.attributes.poles as string | undefined
    const nodePoles = node.properties.poles as string | undefined
    if (nodePoles && productPoles) {
      if (compareStr(productPoles, nodePoles)) {
        score += 15
      } else {
        return { score: 0, reasons: ['poles_mismatch'] }
      }
    }

    // Check rated current (e.g. 16, 25, 32A)
    const productCurrent = parseNum(product.attributes.ratedCurrentA)
    const nodeCurrent = parseNum(node.properties.currentA)
    if (nodeCurrent && productCurrent) {
      if (productCurrent === nodeCurrent) {
        score += 20
      } else {
        return { score: 0, reasons: ['current_mismatch'] }
      }
    }

    // Check tripping curve (e.g. B, C, D)
    const productCurve = product.attributes.curve as string | undefined
    const nodeCurve = node.properties.curve as string | undefined
    if (nodeCurve && productCurve) {
      if (compareStr(productCurve, nodeCurve)) {
        score += 15
      } else {
        score -= 10 // Warn/penalize but don't hard block unless critical
        reasons.push('curve_suboptimal')
      }
    }
  }

  else if (node.type === 'rcd') {
    if (role !== 'rcd') return { score: 0, reasons: ['role_mismatch'] }

    // Check poles
    const productPoles = product.attributes.poles as string | undefined
    const nodePoles = node.properties.poles as string | undefined
    if (nodePoles && productPoles) {
      if (compareStr(productPoles, nodePoles)) {
        score += 10
      } else {
        return { score: 0, reasons: ['poles_mismatch'] }
      }
    }

    // Check leakage current (e.g. 10mA, 30mA, 100mA)
    const productLeakage = parseNum(product.attributes.leakageMa)
    const nodeLeakage = parseNum(node.properties.leakageMa)
    if (nodeLeakage && productLeakage) {
      if (productLeakage === nodeLeakage) {
        score += 25
      } else {
        return { score: 0, reasons: ['leakage_mismatch'] }
      }
    }

    // Check rated current (must be >= node current requirement)
    const productCurrent = parseNum(product.attributes.ratedCurrentA)
    const nodeCurrent = parseNum(node.properties.currentA)
    if (nodeCurrent && productCurrent) {
      if (productCurrent >= nodeCurrent) {
        score += 15
      } else {
        return { score: 0, reasons: ['current_insufficient'] }
      }
    }
  }

  else if (node.type === 'cable_line') {
    if (role !== 'cable') return { score: 0, reasons: ['role_mismatch'] }

    // Check material (Cu, Al)
    const productMaterial = product.attributes.material as string | undefined
    const nodeMaterial = node.properties.material as string | undefined
    if (nodeMaterial && productMaterial) {
      if (compareStr(productMaterial, nodeMaterial)) {
        score += 20
      } else {
        return { score: 0, reasons: ['material_mismatch'] }
      }
    }

    // Check cores/conductors (e.g. 3, 5)
    const productCores = parseNum(product.attributes.cores)
    const nodeCores = parseNum(node.properties.cores)
    if (nodeCores && productCores) {
      if (productCores === nodeCores) {
        score += 15
      } else {
        return { score: 0, reasons: ['cores_mismatch'] }
      }
    }

    // Check section mm2 (e.g. 1.5, 2.5, 4, 6)
    const productSection = parseNum(product.attributes.sectionMm2)
    const nodeSection = parseNum(node.properties.sectionMm2)
    if (nodeSection && productSection) {
      if (productSection === nodeSection) {
        score += 15
      } else {
        return { score: 0, reasons: ['section_mismatch'] }
      }
    }
  }

  else if (node.type === 'distribution_panel') {
    if (role !== 'panel') return { score: 0, reasons: ['role_mismatch'] }

    // Capacity (modules) must be >= node modules occupied
    const productCapacity = parseNum(product.attributes.capacityModules ?? product.attributes.modules)
    const nodeModules = parseNum(node.properties.modules)
    if (nodeModules && productCapacity) {
      if (productCapacity >= nodeModules) {
        score += 30
        if (productCapacity > nodeModules * 1.2) {
          score += 10 // Bonus for having expansion reserve
        }
      } else {
        return { score: 0, reasons: ['capacity_insufficient'] }
      }
    }
  }

  else if (node.type === 'voltage_relay') {
    if (role !== 'voltage_relay') return { score: 0, reasons: ['role_mismatch'] }

    // Check current rating
    const productCurrent = parseNum(product.attributes.ratedCurrentA)
    const nodeCurrent = parseNum(node.properties.currentA)
    if (nodeCurrent && productCurrent) {
      if (productCurrent >= nodeCurrent) {
        score += 30
      } else {
        return { score: 0, reasons: ['current_insufficient'] }
      }
    }

    // Check poles/phases (1P or 3P equivalent)
    const productPoles = product.attributes.poles as string | undefined
    const nodePoles = node.properties.poles as string | undefined
    if (nodePoles && productPoles) {
      if (compareStr(productPoles, nodePoles)) {
        score += 20
      } else {
        return { score: 0, reasons: ['poles_mismatch'] }
      }
    }
  }

  else if (node.type === 'ats') {
    if (role !== 'ats') return { score: 0, reasons: ['role_mismatch'] }

    // Check poles (e.g. 2P, 4P)
    const productPoles = product.attributes.poles as string | undefined
    const nodePoles = node.properties.poles as string | undefined
    if (nodePoles && productPoles) {
      if (compareStr(productPoles, nodePoles)) {
        score += 25
      } else {
        return { score: 0, reasons: ['poles_mismatch'] }
      }
    }

    // Check switchesNeutral
    const productSwitchesNeutral = product.attributes.switchesNeutral as boolean | undefined
    const nodeSwitchesNeutral = node.properties.switchesNeutral as boolean | undefined
    if (nodeSwitchesNeutral !== undefined && productSwitchesNeutral !== undefined) {
      if (productSwitchesNeutral === nodeSwitchesNeutral) {
        score += 15
      } else {
        return { score: 0, reasons: ['neutral_switching_mismatch'] }
      }
    }

    // Check current
    const productCurrent = parseNum(product.attributes.ratedCurrentA)
    const nodeCurrent = parseNum(node.properties.currentA)
    if (nodeCurrent && productCurrent) {
      if (productCurrent >= nodeCurrent) {
        score += 10
      } else {
        return { score: 0, reasons: ['current_insufficient'] }
      }
    }
  }

  else if (node.type === 'terminal') {
    if (role !== 'terminal') return { score: 0, reasons: ['role_mismatch'] }

    // Check supported materials (e.g. contains Cu / Al)
    const productMaterials = product.attributes.materialsSupported as string[] | undefined
    const nodeMaterial = node.properties.material as string | undefined
    if (nodeMaterial && productMaterials) {
      if (productMaterials.includes(nodeMaterial)) {
        score += 20
      } else {
        return { score: 0, reasons: ['material_unsupported'] }
      }
    }

    // Check section range
    const productRange = product.attributes.sectionRangeMm2 as [number, number] | undefined
    const nodeSection = parseNum(node.properties.sectionMm2)
    if (nodeSection && productRange) {
      if (nodeSection >= productRange[0] && nodeSection <= productRange[1]) {
        score += 20
      } else {
        return { score: 0, reasons: ['section_out_of_range'] }
      }
    }

    // Check strand types
    const productStrandTypes = product.attributes.strandTypes as string[] | undefined
    const nodeStrandType = node.properties.strandType as string | undefined
    if (nodeStrandType && productStrandTypes) {
      if (productStrandTypes.includes(nodeStrandType)) {
        score += 10
      } else {
        return { score: 0, reasons: ['strand_type_unsupported'] }
      }
    }
  }

  // Penalize out of stock slightly, but don't prevent selection
  if (product.stock <= 0) {
    score -= 15
    reasons.push('out_of_stock')
  }

  return {
    score: Math.max(0, Math.min(100, score)),
    reasons,
  }
}

/**
 * Finds all compatible products in the catalog for a given node, sorted by compatibility score.
 */
export function findCompatibleProductsForNode(
  node: EngineeringNode,
  catalog: EngineeringCatalogProduct[]
): Array<{ product: EngineeringCatalogProduct; score: number; reasons: string[] }> {
  return catalog
    .map((product) => {
      const { score, reasons } = scoreProductCompatibility(node, product)
      return { product, score, reasons }
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.product.price - b.product.price)
}
