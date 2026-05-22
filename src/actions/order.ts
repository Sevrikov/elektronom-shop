'use server'

import { cookies } from 'next/headers'
import { revalidateTag } from 'next/cache'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { auth } from '@/lib/auth'

const CreateOrderSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(10),
  city: z.string().min(1),
  street: z.string().min(1),
  building: z.string().min(1),
  apartment: z.string().optional(),
  paymentMethod: z.enum(['CARD_ONLINE', 'CASH_ON_DELIVERY', 'MONOBANK_PARTS', 'PRIVAT_PARTS']),
  notes: z.string().optional(),
})

interface CartCookieItem {
  productId: string
  quantity: number
}

const CART_COOKIE = 'cart'

async function readCartCookie(): Promise<CartCookieItem[]> {
  const cookieStore = await cookies()
  const raw = cookieStore.get(CART_COOKIE)?.value
  if (!raw) return []
  try {
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (item): item is CartCookieItem =>
        typeof item === 'object' &&
        item !== null &&
        typeof (item as Record<string, unknown>).productId === 'string' &&
        typeof (item as Record<string, unknown>).quantity === 'number'
    )
  } catch {
    return []
  }
}

async function clearCartCookie(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(CART_COOKIE)
}

export async function createOrder(data: z.infer<typeof CreateOrderSchema>, locale: string = 'uk') {
  try {
    const parsed = CreateOrderSchema.safeParse(data)
    if (!parsed.success) {
      return { success: false, error: 'Некоректні дані' }
    }

    const session = await auth()
    let cartItems: CartCookieItem[] = []

    if (session?.user?.id) {
      const dbItems = await prisma.cartItem.findMany({
        where: { userId: session.user.id },
        select: { productId: true, quantity: true },
        take: 50,
      })
      cartItems = dbItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      }))
    } else {
      cartItems = await readCartCookie()
    }

    if (cartItems.length === 0) {
      return { success: false, error: 'Кошик порожній' }
    }

    const productIds = cartItems.map((i) => i.productId)
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
      select: {
        id: true,
        slug: true,
        sku: true,
        price: true,
        stock: true,
        translations: {
          where: { locale },
          select: { name: true },
        },
        images: {
          orderBy: { sortOrder: 'asc' },
          take: 1,
          select: { url: true },
        },
      },
    })

    if (products.length !== productIds.length) {
      return { success: false, error: 'Деякі товари більше не доступні' }
    }

    // Calculate subtotal, shipping, total
    let subtotal = 0
    const itemsData = cartItems.map((cItem) => {
      const dbProd = products.find((p) => p.id === cItem.productId)!
      const itemPrice = Number(dbProd.price)
      subtotal += itemPrice * cItem.quantity

      return {
        productId: dbProd.id,
        quantity: cItem.quantity,
        price: dbProd.price,
        snapshot: {
          name: dbProd.translations[0]?.name ?? 'Товар',
          sku: dbProd.sku,
          image: dbProd.images[0]?.url ?? null,
          price: itemPrice,
        },
      }
    })

    const shipping = 0 // Free shipping or static
    const discount = 0
    const total = subtotal + shipping - discount

    // Database transaction to write order and decrement stock
    const newOrder = await prisma.$transaction(async (tx) => {
      // 1. Enforce stock verification & decrement (Negative stock prevention)
      for (const item of cartItems) {
        const updateResult = await tx.product.updateMany({
          where: {
            id: item.productId,
            stock: { gte: item.quantity },
          },
          data: {
            stock: { decrement: item.quantity },
          },
        })

        if (updateResult.count === 0) {
          const dbProd = products.find((p) => p.id === item.productId)!
          const name = dbProd.translations[0]?.name ?? 'Товар'
          throw new Error(`Недостатньо товару "${name}" на складі`)
        }
      }

      // Generate ORD-YYYY-NNNNN number using OrderCounter to prevent collisions
      const date = new Date()
      const year = date.getFullYear()
      const counter = await tx.orderCounter.upsert({
        where: { year },
        create: { year, value: 1 },
        update: { value: { increment: 1 } },
      })
      const number = `ORD-${year}-${String(counter.value).padStart(5, '0')}`

      // 2. Create the order
      const order = await tx.order.create({
        data: {
          number,
          userId: session?.user?.id ?? null,
          paymentMethod: parsed.data.paymentMethod,
          subtotal,
          discount,
          shipping,
          total,
          customerData: {
            firstName: parsed.data.firstName,
            lastName: parsed.data.lastName,
            email: parsed.data.email,
            phone: parsed.data.phone,
            city: parsed.data.city,
            street: parsed.data.street,
            building: parsed.data.building,
            apartment: parsed.data.apartment ?? null,
          },
          notes: parsed.data.notes ?? null,
          items: {
            create: itemsData.map((it) => ({
              productId: it.productId,
              quantity: it.quantity,
              price: it.price,
              snapshot: it.snapshot,
            })),
          },
        },
      })

      // 3. Clear database cart inside transaction for authenticated user (Atomic cleanup)
      if (session?.user?.id) {
        await tx.cartItem.deleteMany({
          where: { userId: session.user.id },
        })
      }

      return order
    })

    // Clear guest cart cookie outside transaction
    if (!session?.user?.id) {
      await clearCartCookie()
    }
    revalidateTag('cart', 'max')

    logger.warn('[createOrder] Order created successfully', {
      orderId: newOrder.id,
      number: newOrder.number,
      userId: session?.user?.id,
    })

    return { success: true, orderNumber: newOrder.number }
  } catch (error) {
    console.error('[createOrder] Error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Помилка при створенні замовлення',
    }
  }
}

export async function getUserOrders() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, orders: [], error: 'Неавторизовано' }
    }

    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        number: true,
        status: true,
        paymentStatus: true,
        paymentMethod: true,
        total: true,
        createdAt: true,
        items: {
          select: {
            id: true,
            quantity: true,
            price: true,
            snapshot: true,
          },
        },
      },
    })

    return { success: true, orders }
  } catch (error) {
    console.error('[getUserOrders] Error:', error)
    return { success: false, orders: [], error: 'Помилка завантаження замовлень' }
  }
}
