'use server'

import { z } from 'zod'
import type { Prisma } from '@/generated/prisma/client'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { logger } from '@/lib/logger'

const TierSchema = z.object({
  min: z.number().int().min(2).max(100000),
  discount: z.number().int().min(1).max(99),
})

const RuleSchema = z.object({
  id: z.string().optional(),
  brandId: z.string().nullable(),
  categoryId: z.string().nullable(),
  maxDiscount: z.number().int().min(0).max(99),
  tiers: z.array(TierSchema).min(1).max(8),
  isActive: z.boolean(),
})

export type WholesaleRuleInput = z.infer<typeof RuleSchema>

export async function saveWholesaleRule(input: WholesaleRuleInput) {
  try {
    await requireAdmin()
  } catch {
    return { success: false as const, error: 'Доступ заборонено' }
  }

  const parsed = RuleSchema.safeParse(input)
  if (!parsed.success) return { success: false as const, error: 'Некоректні дані' }

  const { id, brandId, categoryId, maxDiscount, tiers, isActive } = parsed.data
  if (!brandId && !categoryId) {
    return { success: false as const, error: 'Вкажіть марку або категорію' }
  }

  const data = {
    brandId: brandId ?? null,
    categoryId: categoryId ?? null,
    maxDiscount,
    tiers: tiers as unknown as Prisma.InputJsonValue,
    isActive,
  }

  try {
    const rule = id
      ? await prisma.wholesaleRule.update({ where: { id }, data })
      : await prisma.wholesaleRule.create({ data })
    return { success: true as const, rule }
  } catch (e) {
    logger.error('[saveWholesaleRule] failed', { error: String(e) })
    return { success: false as const, error: 'Помилка збереження' }
  }
}

export async function deleteWholesaleRule(id: string) {
  try {
    await requireAdmin()
  } catch {
    return { success: false as const, error: 'Доступ заборонено' }
  }
  try {
    await prisma.wholesaleRule.delete({ where: { id } })
    return { success: true as const }
  } catch (e) {
    logger.error('[deleteWholesaleRule] failed', { error: String(e) })
    return { success: false as const, error: 'Помилка видалення' }
  }
}
