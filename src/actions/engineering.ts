'use server'

// src/actions/engineering.ts
// Server Actions для инженерной платформы: поиск совместимых товаров по всему каталогу
// MASTER_CONTEXT v1.3 §8.1, §14

import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { passesQualityGate, scoreProductCompatibility } from '@/lib/engineering/catalog-binding'
import type { EngineeringNode } from '@/lib/engineering/graph'
import type { EngineeringCatalogProduct } from '@/lib/engineering/types'

// Zod schemas for validation (min(1) instead of cuid() to comply with database cuid2 rules)
const EngineeringNodeSchema = z.object({
  id: z.string().min(1),
  type: z.enum([
    'grid_input',
    'meter',
    'main_breaker',
    'voltage_relay',
    'surge_protection',
    'busbar_n',
    'busbar_pe',
    'rcd',
    'mcb',
    'cable_line',
    'load',
    'generator',
    'inverter',
    'battery',
    'ats',
    'distribution_panel',
    'terminal',
  ]),
  label: z.string(),
  properties: z.record(z.string(), z.unknown()),
})

const FindCompatibleProductsInputSchema = z.object({
  node: EngineeringNodeSchema,
  locale: z.enum(['uk', 'ru']),
})

export type CompatibleProductResult = {
  product: {
    id: string
    slug: string
    sku: string
    name: string
    price: number
    stock: number
    imageUrl: string | null
    brandName: string | null
    attributes: Record<string, unknown>
  }
  score: number
  reasons: string[]
  qualityGate: {
    passes: boolean
    reasons: string[]
  }
}

export async function findCompatibleProducts(
  input: unknown
): Promise<{
  success: boolean
  products: CompatibleProductResult[]
  error?: string
}> {
  const parsed = FindCompatibleProductsInputSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, products: [], error: 'invalidInput' }
  }

  const { node, locale } = parsed.data

  try {
    // 1. Map node type to engineeringRole
    let role = 'accessory'
    if (node.type === 'mcb' || node.type === 'main_breaker') role = 'breaker'
    else if (node.type === 'rcd') role = 'rcd'
    else if (node.type === 'cable_line') role = 'cable'
    else if (node.type === 'voltage_relay') role = 'voltage_relay'
    else if (node.type === 'ats') role = 'ats'
    else if (node.type === 'terminal') role = 'terminal'
    else if (node.type === 'distribution_panel') role = 'panel'

    if (role === 'accessory') {
      return { success: true, products: [] }
    }

    // 2. Query active products matching engineeringRole via JSONB path filter.
    // PostgreSQL + Prisma 7.x supports path/string_contains on Json fields.
    // Deterministic orderBy prevents nondeterministic pagination.
    const dbProducts = await prisma.product.findMany({
      where: {
        isActive: true,
        attributes: {
          path: ['engineeringRole'],
          string_contains: role,
        },
      },
      select: {
        id: true,
        slug: true,
        sku: true,
        price: true,
        stock: true,
        attributes: true,
        translations: {
          where: { locale },
          select: { name: true },
          take: 1,
        },
        brand: {
          select: { name: true },
        },
        category: {
          select: { slug: true },
        },
        images: {
          select: { url: true },
          orderBy: { sortOrder: 'asc' },
          take: 1,
        },
      },
      orderBy: { id: 'asc' },
      take: 200,
    })

    // 3. Map database products to EngineeringCatalogProduct
    // Double-check role match in-memory (string_contains is a superset match)
    const mappedProducts: EngineeringCatalogProduct[] = dbProducts
      .map((p) => ({
        id: p.id,
        slug: p.slug,
        sku: p.sku,
        name: p.translations[0]?.name ?? p.slug,
        price: Number(p.price),
        stock: p.stock,
        categorySlug: p.category.slug,
        brandName: p.brand?.name ?? null,
        imageUrl: p.images[0]?.url ?? null,
        attributes: (p.attributes as Record<string, unknown>) ?? {},
      }))
      .filter((p) => {
        const prodRole = p.attributes.engineeringRole as string | undefined
        return prodRole === role
      })

    // 4. Score and filter by compatibility score > 0
    const publicKeys = new Set([
      'engineeringRole',
      'ratedCurrentA',
      'currentA',
      'voltageV',
      'poles',
      'curve',
      'leakageMa',
      'phase',
      'sectionMm2',
      'cores',
      'strandType',
      'modules',
      'certifications',
      'hasSafetyCert'
    ])

    const results: CompatibleProductResult[] = mappedProducts
      .map((product) => {
        const gateResult = passesQualityGate(product)
        const { score, reasons } = scoreProductCompatibility(node as EngineeringNode, product)
        
        // Project only public engineering attributes to avoid leaking internal info
        const projectedAttributes: Record<string, unknown> = {}
        for (const [key, val] of Object.entries(product.attributes)) {
          if (publicKeys.has(key)) {
            projectedAttributes[key] = val
          }
        }

        return {
          product: {
            id: product.id,
            slug: product.slug,
            sku: product.sku,
            name: product.name,
            price: product.price,
            stock: product.stock,
            imageUrl: product.imageUrl,
            brandName: product.brandName,
            attributes: projectedAttributes,
          },
          score,
          reasons,
          qualityGate: {
            passes: gateResult.passes,
            reasons: gateResult.reasons,
          },
        }
      })
      .filter((item) => item.score > 0)
      // Sort by score descending, then by price ascending (stable tie-breaker)
      .sort((a, b) => b.score - a.score || a.product.price - b.product.price)

    return {
      success: true,
      products: results,
    }
  } catch (error) {
    console.error('findCompatibleProducts failed:', error)
    return {
      success: false,
      products: [],
      error: 'catalogLookupFailed',
    }
  }
}
