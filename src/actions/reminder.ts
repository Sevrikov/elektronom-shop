'use server'

import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'

const CreateReminderSchema = z.object({
  type: z.enum(['purchase', 'back_in_stock']),
  productId: z.string().min(1),
  productName: z.string().min(1).max(300),
  productSku: z.string().min(1).max(100),
  contact: z.string().min(3).max(200),
  customerName: z.string().max(120).optional(),
  note: z.string().max(500).optional(),
})

export type CreateReminderInput = z.infer<typeof CreateReminderSchema>

export async function createReminderRequest(input: CreateReminderInput) {
  const parsed = CreateReminderSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false as const, error: 'Некоректні дані' }
  }
  try {
    await prisma.reminderRequest.create({
      data: {
        type: parsed.data.type,
        productId: parsed.data.productId,
        productName: parsed.data.productName,
        productSku: parsed.data.productSku,
        contact: parsed.data.contact,
        customerName: parsed.data.customerName ?? null,
        note: parsed.data.note ?? null,
      },
    })
    return { success: true as const }
  } catch (e) {
    logger.error('[createReminderRequest] failed', { error: String(e) })
    return { success: false as const, error: 'Помилка' }
  }
}

export async function markReminderDone(id: string) {
  if (!id) return { success: false as const, error: 'Некоректні дані' }
  try {
    await prisma.reminderRequest.update({ where: { id }, data: { status: 'done' } })
    return { success: true as const }
  } catch (e) {
    logger.error('[markReminderDone] failed', { error: String(e) })
    return { success: false as const, error: 'Помилка' }
  }
}
