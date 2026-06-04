import type { EngineeringGraph, EngineeringBOMItemSnapshot, EngineeringPanelSnapshot, EngineeringTotals, EngineeringNode } from './graph'
import type { EngineeringCatalogProduct } from './types'
import { findCompatibleProductsForNode } from './catalog-binding'

/**
 * Calculates the number of DIN modules occupied by a modular node.
 */
export function getNodeDINModules(node: EngineeringNode): number {
  switch (node.type) {
    case 'mcb':
    case 'main_breaker': {
      const poles = node.properties.poles as string | undefined
      if (poles === '3P') return 3
      if (poles === '4P') return 4
      if (poles === '2P') return 2
      return 1 // Default to 1P (1 module)
    }
    case 'rcd': {
      const poles = node.properties.poles as string | undefined
      return poles === '4P' ? 4 : 2 // 4P RCD is 4 modules, 2P is 2 modules
    }
    case 'voltage_relay':
      return typeof node.properties.modules === 'number' ? node.properties.modules : 3 // Default Zubr is 3 mod
    case 'meter':
      return typeof node.properties.modules === 'number' ? node.properties.modules : 4 // Default meter is 4 mod
    case 'ats': {
      const poles = node.properties.poles as string | undefined
      return poles === '4P' ? 4 : 2 // Default ATS size
    }
    case 'surge_protection':
      return typeof node.properties.modules === 'number' ? node.properties.modules : 2 // Default SPD is 2 mod
    default:
      return 0
  }
}

/**
 * Computes the BOM Items, Panel Snapshots, and Totals for the engineering project graph.
 * If a node is bound to a product in `catalogBindings`, it uses the exact binding.
 * Otherwise, it attempts to automatically select the best compatible product from the catalog.
 */
export function computeBOMAndTotals(
  graph: EngineeringGraph,
  catalog: EngineeringCatalogProduct[]
): { bom: EngineeringBOMItemSnapshot[]; panels: EngineeringPanelSnapshot[]; totals: EngineeringTotals } {
  const bomItems: EngineeringBOMItemSnapshot[] = []
  
  // 1. Calculate quantities and find products for eligible nodes
  // We exclude 'load' (appliances) and 'grid_input' (utility connection) unless they are explicitly bound.
  const eligibleNodes = graph.nodes.filter(
    (node) => 
      node.type !== 'load' && 
      node.type !== 'grid_input' &&
      node.type !== 'distribution_panel' // Panel is handled separately to avoid duplicate counts if panel is bound
  )

  for (const node of eligibleNodes) {
    // Check if there is an active user-selected binding
    const binding = graph.catalogBindings.find((b) => b.nodeId === node.id)
    
    let productId: string | undefined = undefined
    let sku: string | undefined = undefined
    let name: string = node.label || node.id
    let unitPrice = 0
    let stock: number | undefined = undefined
    let productSlug: string | undefined = undefined
    
    if (binding) {
      productId = binding.productId
      sku = binding.sku
      name = binding.name
      unitPrice = binding.price
      stock = binding.stock
      productSlug = binding.slug
    } else {
      // Auto-recommend a product from the catalog
      const matches = findCompatibleProductsForNode(node, catalog)
      const firstMatch = matches[0]
      if (firstMatch) {
        const bestMatch = firstMatch.product
        productId = bestMatch.id
        sku = bestMatch.sku
        name = bestMatch.name
        unitPrice = bestMatch.price
        stock = bestMatch.stock
        productSlug = bestMatch.slug
      }
    }

    // Determine quantity
    let qty = 1
    if (node.type === 'cable_line') {
      const routeLength = typeof node.properties.routeLengthM === 'number' ? node.properties.routeLengthM : 25
      // 10% extra cutting margin, rounded up
      qty = Math.max(1, Math.ceil(routeLength * 1.1))
    }

    // Map role
    let role = 'accessory'
    if (node.type === 'mcb' || node.type === 'main_breaker') role = 'breaker'
    else if (node.type === 'rcd') role = 'rcd'
    else if (node.type === 'cable_line') role = 'cable'
    else if (node.type === 'voltage_relay') role = 'voltage_relay'
    else if (node.type === 'ats') role = 'ats'
    else if (node.type === 'terminal') role = 'terminal'

    const item: EngineeringBOMItemSnapshot = {
      sku: sku || `PLACEHOLDER-${node.id.toUpperCase()}`,
      name,
      qty,
      unitPrice,
      total: unitPrice * qty,
      role,
      nodeId: node.id,
    }
    if (productId) {
      item.productId = productId
      item.productSlug = productSlug
      item.stock = stock
      if (typeof stock === 'number' && stock < qty) {
        item.stockInsufficient = true
        item.blocksCheckout = true
      }
    } else {
      item.missing = true
      if (['breaker', 'rcd', 'voltage_relay', 'ats', 'cable', 'panel'].includes(role)) {
        item.blocksCheckout = true
      }
    }
    bomItems.push(item)
  }

  // 2. Process Panels and calculate occupied modules
  const occupiedModules = graph.nodes.reduce((sum, node) => sum + getNodeDINModules(node), 0)
  
  const panels: EngineeringPanelSnapshot[] = []
  const panelNodes = graph.nodes.filter((node) => node.type === 'distribution_panel')

  for (const panelNode of panelNodes) {
    const capacity = typeof panelNode.properties.modules === 'number' ? panelNode.properties.modules : 24
    
    // Check if the panel itself has a catalog binding to adjust the price
    const panelBinding = graph.catalogBindings.find((b) => b.nodeId === panelNode.id)
    let unitPrice = 0
    let sku: string | undefined = undefined
    let name = panelNode.label
    let productId: string | undefined = undefined
    let stock: number | undefined = undefined
    let productSlug: string | undefined = undefined

    if (panelBinding) {
      productId = panelBinding.productId
      sku = panelBinding.sku
      name = panelBinding.name
      unitPrice = panelBinding.price
      stock = panelBinding.stock
      productSlug = panelBinding.slug
    } else {
      // Auto-recommend a panel
      const matches = findCompatibleProductsForNode(panelNode, catalog)
      const firstMatch = matches[0]
      if (firstMatch) {
        const bestMatch = firstMatch.product
        productId = bestMatch.id
        sku = bestMatch.sku
        name = bestMatch.name
        unitPrice = bestMatch.price
        stock = bestMatch.stock
        productSlug = bestMatch.slug
      }
    }

    // Add panel to BOM items list
    const item: EngineeringBOMItemSnapshot = {
      sku: sku || `PLACEHOLDER-${panelNode.id.toUpperCase()}`,
      name,
      qty: 1,
      unitPrice,
      total: unitPrice,
      role: 'panel',
      nodeId: panelNode.id,
    }
    if (productId) {
      item.productId = productId
      item.productSlug = productSlug
      item.stock = stock
      if (typeof stock === 'number' && stock < 1) {
        item.stockInsufficient = true
        item.blocksCheckout = true
      }
    } else {
      item.missing = true
      item.blocksCheckout = true // panel is always safety-critical
    }
    bomItems.push(item)

    panels.push({
      id: panelNode.id,
      label: panelNode.label || 'Distribution Panel',
      capacityModules: capacity,
      occupiedModules,
      reserveModules: Math.max(0, capacity - occupiedModules),
    })
  }

  // 3. Compute Totals
  const totalPowerW = graph.nodes
    .filter((n) => n.type === 'load')
    .reduce((sum, n) => sum + (typeof n.properties.powerW === 'number' ? n.properties.powerW : 0), 0)

  // Calculate current based on network phase configuration
  const phase = graph.network.phase || 1
  const voltage = graph.network.voltageV || 230
  const diversityFactor = 0.62 // Standard household diversity factor
  const diversifiedPower = totalPowerW * diversityFactor
  
  let totalCurrentA = 0
  if (phase === 3) {
    totalCurrentA = diversifiedPower / (Math.sqrt(3) * 400 * 0.95)
  } else {
    totalCurrentA = diversifiedPower / voltage
  }

  const estimatedCost = bomItems.reduce((sum, item) => sum + item.total, 0)

  return {
    bom: bomItems,
    panels,
    totals: {
      totalPowerW,
      totalCurrentA: Number(totalCurrentA.toFixed(1)),
      occupiedModules,
      estimatedCost,
    },
  }
}
