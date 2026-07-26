'use server'

import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'

const ExpressOrderSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1).max(999),
  deliveryMethod: z.enum(['nova_poshta', 'ukrposhta', 'rozetka', 'pickup']),
  city: z.string().min(1).max(120),
  branch: z.string().max(120).optional(),
  name: z.string().min(1).max(120),
  phone: z.string().regex(/^\+380\d{9}$/, 'Phone must be in format +380XXXXXXXXX'),
})

export type ExpressOrderInput = z.infer<typeof ExpressOrderSchema>

export async function createExpressOrder(input: ExpressOrderInput) {
  const parsed = ExpressOrderSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false as const, error: 'Перевірте дані: телефон у форматі +380XXXXXXXXX' }
  }
  const { productId, quantity, deliveryMethod, city, branch, name, phone } = parsed.data

  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        sku: true,
        price: true,
        isActive: true,
        translations: { take: 1, select: { name: true } },
        images: { orderBy: { sortOrder: 'asc' }, take: 1, select: { url: true } },
      },
    })
    if (!product || !product.isActive) {
      return { success: false as const, error: 'Товар недоступний' }
    }

    const itemPrice = Number(product.price)
    const subtotal = itemPrice * quantity

    const order = await prisma.$transaction(async (tx) => {
      // Stock guard + decrement (prevents negative stock)
      const upd = await tx.product.updateMany({
        where: { id: productId, stock: { gte: quantity } },
        data: { stock: { decrement: quantity } },
      })
      if (upd.count === 0) throw new Error('OUT_OF_STOCK')

      const year = new Date().getFullYear()
      const counter = await tx.orderCounter.upsert({
        where: { year },
        create: { year, value: 1 },
        update: { value: { increment: 1 } },
      })
      const number = `ORD-${year}-${String(counter.value).padStart(5, '0')}`

      return tx.order.create({
        data: {
          number,
          paymentMethod: 'CASH_ON_DELIVERY',
          subtotal,
          discount: 0,
          shipping: 0,
          total: subtotal,
          customerData: {
            firstName: name,
            lastName: '',
            email: '',
            phone,
            city,
            street: branch ?? '',
            building: '',
            deliveryMethod,
            express: true,
          },
          notes: 'Express PDP order',
          items: {
            create: [
              {
                productId: product.id,
                quantity,
                price: product.price,
                snapshot: {
                  name: product.translations[0]?.name ?? 'Товар',
                  sku: product.sku,
                  image: product.images[0]?.url ?? null,
                  price: itemPrice,
                },
              },
            ],
          },
        },
        select: { number: true },
      })
    })

    return { success: true as const, orderNumber: order.number }
  } catch (e) {
    if (e instanceof Error && e.message === 'OUT_OF_STOCK') {
      return { success: false as const, error: 'Недостатньо товару на складі' }
    }
    logger.error('[createExpressOrder] failed', { error: String(e) })
    return { success: false as const, error: 'Помилка оформлення замовлення' }
  }
}
