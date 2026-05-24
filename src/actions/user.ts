'use server'

import { z } from 'zod'
import bcryptjs from 'bcryptjs'
import { revalidateTag } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { logger } from '@/lib/logger'

// ─── Update Profile ───────────────────────────────────────────────────────────

const UpdateProfileSchema = z.object({
  name: z.string().min(1).max(100),
})

export async function updateProfile(data: z.infer<typeof UpdateProfileSchema>) {
  try {
    const session = await auth()
    if (!session?.user?.id) return { success: false, error: 'Неавторизовано' }

    const parsed = UpdateProfileSchema.safeParse(data)
    if (!parsed.success) return { success: false, error: 'Некоректні дані' }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { name: parsed.data.name },
    })

    revalidateTag('user', 'max')
    logger.info('[updateProfile] Updated', { userId: session.user.id })
    return { success: true }
  } catch (error) {
    logger.error('[updateProfile] Error', { error: String(error) })
    return { success: false, error: 'Помилка оновлення профілю' }
  }
}

// ─── Change Password ──────────────────────────────────────────────────────────

const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(6),
})

export async function changePassword(data: z.infer<typeof ChangePasswordSchema>) {
  try {
    const session = await auth()
    if (!session?.user?.id) return { success: false, error: 'Неавторизовано' }

    const parsed = ChangePasswordSchema.safeParse(data)
    if (!parsed.success) return { success: false, error: 'Некоректні дані' }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { passwordHash: true },
    })
    if (!user?.passwordHash) return { success: false, error: 'Неможливо змінити пароль для OAuth-акаунту' }

    const isValid = await bcryptjs.compare(parsed.data.currentPassword, user.passwordHash)
    if (!isValid) return { success: false, error: 'Поточний пароль невірний' }

    const newHash = await bcryptjs.hash(parsed.data.newPassword, 10)
    await prisma.user.update({
      where: { id: session.user.id },
      data: { passwordHash: newHash },
    })

    return { success: true }
  } catch (error) {
    logger.error('[changePassword] Error', { error: String(error) })
    return { success: false, error: 'Помилка зміни пароля' }
  }
}

// ─── Toggle Wishlist ──────────────────────────────────────────────────────────

const WishlistSchema = z.object({
  productId: z.string().min(1),
})

export async function toggleWishlist(
  input: z.infer<typeof WishlistSchema>
): Promise<{ success: boolean; added?: boolean; error?: string }> {
  try {
    const session = await auth()
    if (!session?.user?.id) return { success: false, error: 'Неавторизовано' }

    const parsed = WishlistSchema.safeParse(input)
    if (!parsed.success) return { success: false, error: 'Некоректні дані' }

    const existing = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId: parsed.data.productId,
        },
      },
      select: { id: true },
    })

    if (existing) {
      await prisma.wishlistItem.delete({ where: { id: existing.id } })
      return { success: true, added: false }
    } else {
      await prisma.wishlistItem.create({
        data: { userId: session.user.id, productId: parsed.data.productId },
      })
      return { success: true, added: true }
    }
  } catch (error) {
    logger.error('[toggleWishlist] Error', { error: String(error) })
    return { success: false, error: 'Помилка оновлення обраного' }
  }
}

// ─── Get Wishlist ─────────────────────────────────────────────────────────────

export async function getWishlistProductIds(): Promise<string[]> {
  try {
    const session = await auth()
    if (!session?.user?.id) return []

    const items = await prisma.wishlistItem.findMany({
      where: { userId: session.user.id },
      select: { productId: true },
      take: 200,
    })
    return items.map((i) => i.productId)
  } catch {
    return []
  }
}

// ─── Get Wishlist with Product Data ──────────────────────────────────────────

export async function getWishlist(locale: string = 'uk') {
  try {
    const session = await auth()
    if (!session?.user?.id) return { success: false, items: [], error: 'Неавторизовано' }

    const items = await prisma.wishlistItem.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 100,
      select: {
        id: true,
        productId: true,
        createdAt: true,
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
              take: 1,
              select: { url: true, alt: true },
            },
            brand: {
              select: { name: true, slug: true },
            },
          },
        },
      },
    })

    return { success: true, items }
  } catch (error) {
    logger.error('[getWishlist] Error', { error: String(error) })
    return { success: false, items: [], error: 'Помилка завантаження обраного' }
  }
}

// ─── Remove from Wishlist ─────────────────────────────────────────────────────

export async function removeFromWishlist(
  input: z.infer<typeof WishlistSchema>
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await auth()
    if (!session?.user?.id) return { success: false, error: 'Неавторизовано' }

    const parsed = WishlistSchema.safeParse(input)
    if (!parsed.success) return { success: false, error: 'Некоректні дані' }

    await prisma.wishlistItem.deleteMany({
      where: { userId: session.user.id, productId: parsed.data.productId },
    })

    return { success: true }
  } catch (error) {
    logger.error('[removeFromWishlist] Error', { error: String(error) })
    return { success: false, error: 'Помилка видалення з обраного' }
  }
}

// ─── Submit Product Review ────────────────────────────────────────────────────

const SubmitReviewSchema = z.object({
  productId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(1).max(1000),
  advantages: z.string().max(500).optional().nullable(),
  disadvantages: z.string().max(500).optional().nullable(),
})

export async function submitProductReview(data: z.infer<typeof SubmitReviewSchema>) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: 'Неавторизовано' }
    }

    const parsed = SubmitReviewSchema.safeParse(data)
    if (!parsed.success) {
      return { success: false, error: 'Некоректні дані' }
    }

    const { productId, rating, comment, advantages, disadvantages } = parsed.data

    // Check if the user already left a review for this product
    const existing = await prisma.review.findUnique({
      where: {
        productId_userId: {
          productId,
          userId: session.user.id,
        },
      },
      select: { id: true },
    })

    if (existing) {
      return { success: false, error: 'Ви вже залишили відгук для цього товару' }
    }

    // Check if user has purchased the product
    const hasOrdered = await prisma.order.findFirst({
      where: {
        userId: session.user.id,
        status: 'DELIVERED',
        items: {
          some: { productId },
        },
      },
      select: { id: true },
    })

    await prisma.review.create({
      data: {
        productId,
        userId: session.user.id,
        rating,
        comment,
        advantages: advantages || null,
        disadvantages: disadvantages || null,
        verifiedPurchase: !!hasOrdered,
        isVisible: false, // Moderated review policy
      },
    })

    logger.info('[submitProductReview] Submitted review', { userId: session.user.id, productId })
    return { success: true }
  } catch (error) {
    logger.error('[submitProductReview] Error submitting review', { error: String(error) })
    return { success: false, error: 'Помилка при збереженні відгуку' }
  }
}

