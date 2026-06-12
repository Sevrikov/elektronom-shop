import { prisma } from '@/lib/prisma'
import { normalizeTiers, type WholesaleTier } from '@/lib/wholesale'

/**
 * Resolve the wholesale tiers for a product.
 * Priority: per-product manual `attributes.qty_breaks` > brand rule > category rule.
 */
export async function resolveWholesaleTiers(product: {
  brandId: string | null
  categoryId: string | null
  attributes: unknown
}): Promise<WholesaleTier[]> {
  // 1. Per-product manual override
  const attrs = product.attributes
  if (attrs && typeof attrs === 'object' && !Array.isArray(attrs)) {
    const qb = (attrs as Record<string, unknown>)['qty_breaks']
    if (Array.isArray(qb) && qb.length > 0) {
      return normalizeTiers(qb as WholesaleTier[])
    }
  }

  // 2. Brand rule (preferred), then category rule
  if (!product.brandId && !product.categoryId) return []

  const rules = await prisma.wholesaleRule.findMany({
    where: {
      isActive: true,
      OR: [
        ...(product.brandId ? [{ brandId: product.brandId }] : []),
        ...(product.categoryId ? [{ categoryId: product.categoryId }] : []),
      ],
    },
    select: { brandId: true, categoryId: true, tiers: true },
  })

  const brandRule = product.brandId ? rules.find((r) => r.brandId === product.brandId) : undefined
  const categoryRule = product.categoryId ? rules.find((r) => r.categoryId === product.categoryId) : undefined
  const chosen = brandRule ?? categoryRule

  if (chosen && Array.isArray(chosen.tiers)) {
    return normalizeTiers(chosen.tiers as unknown as WholesaleTier[])
  }
  return []
}
