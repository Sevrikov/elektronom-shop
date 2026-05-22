'use server'

// src/actions/cart.ts
// Server Actions для корзины: cookie-корзина для гостей, DB для авторизованных
// MASTER_CONTEXT v1.3 §8.1, §14

import { cookies } from 'next/headers'
import { revalidateTag } from 'next/cache'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { auth } from '@/lib/auth'

// ─── Zod схемы ───────────────────────────────────────────────────────────────

const AddToCartSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1).max(99),
})

const RemoveFromCartSchema = z.object({
  productId: z.string().min(1),
})

const UpdateQtySchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(0).max(99),
})

// ─── Типы ─────────────────────────────────────────────────────────────────────

export interface CartCookieItem {
  productId: string
  quantity: number
}

export interface CartItem {
  productId: string
  quantity: number
  name: string
  sku: string
  price: number
  comparePrice?: number | null
  imageUrl?: string | null
  slug: string
  stock: number
  inStock: boolean
}

// ─── Cookie helpers ───────────────────────────────────────────────────────────

const CART_COOKIE = 'cart'
const CART_MAX_AGE = 60 * 60 * 24 * 30 // 30 дней

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

async function writeCartCookie(items: CartCookieItem[]): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(CART_COOKIE, JSON.stringify(items), {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: CART_MAX_AGE,
    path: '/',
  })
}

async function clearCartCookie(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(CART_COOKIE)
}

// ─── Слияние гостевой корзины с базой данных ───────────────────────────────────

async function mergeCartIfNeeded(userId: string): Promise<void> {
  const cookieItems = await readCartCookie()
  if (cookieItems.length === 0) return

  try {
    await prisma.$transaction(async (tx) => {
      const productIds = cookieItems.map((i) => i.productId)
      const products = await tx.product.findMany({
        where: { id: { in: productIds }, isActive: true },
        select: { id: true, stock: true },
      })

      for (const item of cookieItems) {
        const product = products.find((p) => p.id === item.productId)
        if (!product || product.stock <= 0) continue

        const existing = await tx.cartItem.findUnique({
          where: {
            userId_productId: {
              userId,
              productId: item.productId,
            },
          },
        })

        if (existing) {
          const newQty = Math.min(existing.quantity + item.quantity, product.stock, 99)
          if (newQty <= 0) {
            await tx.cartItem.delete({ where: { id: existing.id } })
          } else {
            await tx.cartItem.update({
              where: { id: existing.id },
              data: { quantity: newQty },
            })
          }
        } else {
          const newQty = Math.min(item.quantity, product.stock, 99)
          if (newQty > 0) {
            await tx.cartItem.create({
              data: {
                userId,
                productId: item.productId,
                quantity: newQty,
              },
            })
          }
        }
      }
    })

    await clearCartCookie()
    logger.info('[mergeCartIfNeeded] Merged guest cart to database', { userId })
  } catch (error) {
    logger.error('[mergeCartIfNeeded] Error merging cart', { error: String(error) })
  }
}

// ─── Получить корзину с данными из БД ─────────────────────────────────────────

export async function getCart(locale: string = 'uk'): Promise<CartItem[]> {
  const session = await auth()
  const userId = session?.user?.id

  if (userId) {
    await mergeCartIfNeeded(userId)
    const dbItems = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: {
          select: {
            id: true,
            slug: true,
            sku: true,
            price: true,
            comparePrice: true,
            stock: true,
            isActive: true,
            translations: {
              where: { locale },
              select: { name: true },
              take: 1,
            },
            images: {
              orderBy: { sortOrder: 'asc' },
              select: { url: true },
              take: 1,
            },
          },
        },
      },
      orderBy: { createdAt: 'asc' },
      take: 50,
    })

    return dbItems
      .map((dbItem): CartItem | null => {
        const product = dbItem.product
        if (!product || !product.isActive) return null

        return {
          productId: product.id,
          quantity: Math.min(dbItem.quantity, product.stock > 0 ? product.stock : dbItem.quantity),
          name: product.translations[0]?.name ?? product.sku,
          sku: product.sku,
          price: Number(product.price.toString()),
          comparePrice: product.comparePrice ? Number(product.comparePrice.toString()) : null,
          imageUrl: product.images[0]?.url ?? null,
          slug: product.slug,
          stock: product.stock,
          inStock: product.stock > 0,
        }
      })
      .filter((item): item is CartItem => item !== null)
  }

  const cookieItems = await readCartCookie()
  if (cookieItems.length === 0) return []

  const productIds = cookieItems.map((i) => i.productId)

  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, isActive: true },
    select: {
      id: true,
      slug: true,
      sku: true,
      price: true,
      comparePrice: true,
      stock: true,
      translations: {
        where: { locale },
        select: { name: true },
        take: 1,
      },
      images: {
        orderBy: { sortOrder: 'asc' },
        select: { url: true },
        take: 1,
      },
    },
    take: 50,
  })

  return cookieItems
    .map((cookieItem): CartItem | null => {
      const product = products.find((p) => p.id === cookieItem.productId)
      if (!product) return null

      return {
        productId: product.id,
        quantity: Math.min(cookieItem.quantity, product.stock > 0 ? product.stock : cookieItem.quantity),
        name: product.translations[0]?.name ?? product.sku,
        sku: product.sku,
        price: Number(product.price.toString()),
        comparePrice: product.comparePrice ? Number(product.comparePrice.toString()) : null,
        imageUrl: product.images[0]?.url ?? null,
        slug: product.slug,
        stock: product.stock,
        inStock: product.stock > 0,
      }
    })
    .filter((item): item is CartItem => item !== null)
}

// ─── Количество товаров (для badge) ───────────────────────────────────────────

export async function getCartCount(): Promise<number> {
  const session = await auth()
  const userId = session?.user?.id

  if (userId) {
    await mergeCartIfNeeded(userId)
    const agg = await prisma.cartItem.aggregate({
      where: { userId },
      _sum: {
        quantity: true,
      },
    })
    return agg._sum.quantity ?? 0
  }

  const items = await readCartCookie()
  return items.reduce((sum, i) => sum + i.quantity, 0)
}

// ─── addToCart ────────────────────────────────────────────────────────────────

export async function addToCart(
  input: z.infer<typeof AddToCartSchema>
): Promise<{ success: boolean; error?: string }> {
  const parsed = AddToCartSchema.safeParse(input)
  if (!parsed.success) return { success: false, error: 'Невалідні дані' }

  try {
    const product = await prisma.product.findUnique({
      where: { id: parsed.data.productId, isActive: true },
      select: { stock: true },
    })
    if (!product) return { success: false, error: 'Товар не знайдено' }
    if (product.stock < parsed.data.quantity) {
      return { success: false, error: 'Недостатньо товару на складі' }
    }

    const session = await auth()
    const userId = session?.user?.id

    if (userId) {
      await mergeCartIfNeeded(userId)
      const existing = await prisma.cartItem.findUnique({
        where: {
          userId_productId: {
            userId,
            productId: parsed.data.productId,
          },
        },
      })

      if (existing) {
        const newQty = Math.min(existing.quantity + parsed.data.quantity, product.stock, 99)
        await prisma.cartItem.update({
          where: { id: existing.id },
          data: { quantity: newQty },
        })
      } else {
        await prisma.cartItem.create({
          data: {
            userId,
            productId: parsed.data.productId,
            quantity: parsed.data.quantity,
          },
        })
      }
    } else {
      const items = await readCartCookie()
      const existing = items.find((i) => i.productId === parsed.data.productId)

      if (existing) {
        const newQty = Math.min(existing.quantity + parsed.data.quantity, product.stock, 99)
        existing.quantity = newQty
      } else {
        items.push({ productId: parsed.data.productId, quantity: parsed.data.quantity })
      }

      await writeCartCookie(items)
    }

    revalidateTag('cart', 'max')
    return { success: true }
  } catch (error) {
    logger.error('[addToCart] Failed', { error: String(error) })
    return { success: false, error: 'Помилка сервера' }
  }
}

// ─── removeFromCart ───────────────────────────────────────────────────────────

export async function removeFromCart(
  input: z.infer<typeof RemoveFromCartSchema>
): Promise<{ success: boolean; error?: string }> {
  const parsed = RemoveFromCartSchema.safeParse(input)
  if (!parsed.success) return { success: false, error: 'Невалідні дані' }

  try {
    const session = await auth()
    const userId = session?.user?.id

    if (userId) {
      await prisma.cartItem.deleteMany({
        where: {
          userId,
          productId: parsed.data.productId,
        },
      })
    } else {
      const items = await readCartCookie()
      const filtered = items.filter((i) => i.productId !== parsed.data.productId)
      await writeCartCookie(filtered)
    }

    revalidateTag('cart', 'max')
    return { success: true }
  } catch (error) {
    logger.error('[removeFromCart] Failed', { error: String(error) })
    return { success: false, error: 'Помилка сервера' }
  }
}

// ─── updateCartQuantity ───────────────────────────────────────────────────────

export async function updateCartQuantity(
  input: z.infer<typeof UpdateQtySchema>
): Promise<{ success: boolean; error?: string }> {
  const parsed = UpdateQtySchema.safeParse(input)
  if (!parsed.success) return { success: false, error: 'Невалідні дані' }

  try {
    if (parsed.data.quantity === 0) {
      return removeFromCart({ productId: parsed.data.productId })
    }

    const product = await prisma.product.findUnique({
      where: { id: parsed.data.productId, isActive: true },
      select: { stock: true },
    })
    if (!product) return { success: false, error: 'Товар не знайдено' }
    if (product.stock < parsed.data.quantity) {
      return { success: false, error: 'Недостатньо товару на складі' }
    }

    const session = await auth()
    const userId = session?.user?.id

    if (userId) {
      const existing = await prisma.cartItem.findUnique({
        where: {
          userId_productId: {
            userId,
            productId: parsed.data.productId,
          },
        },
      })

      if (existing) {
        await prisma.cartItem.update({
          where: { id: existing.id },
          data: { quantity: parsed.data.quantity },
        })
      }
    } else {
      const items = await readCartCookie()
      const existing = items.find((i) => i.productId === parsed.data.productId)
      if (existing) {
        existing.quantity = parsed.data.quantity
        await writeCartCookie(items)
      }
    }

    revalidateTag('cart', 'max')
    return { success: true }
  } catch (error) {
    logger.error('[updateCartQuantity] Failed', { error: String(error) })
    return { success: false, error: 'Помилка сервера' }
  }
}

// ─── clearCart ────────────────────────────────────────────────────────────────

export async function clearCart(): Promise<{ success: boolean }> {
  try {
    const session = await auth()
    const userId = session?.user?.id

    if (userId) {
      await prisma.cartItem.deleteMany({
        where: { userId },
      })
    } else {
      await writeCartCookie([])
    }

    revalidateTag('cart', 'max')
    return { success: true }
  } catch {
    return { success: false }
  }
}
