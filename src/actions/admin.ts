'use server'

import { revalidateTag } from 'next/cache'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { syncProductIndex, removeProductFromIndex } from '@/actions/search'
import { deleteProductImage } from '@/lib/storage'
import type { OrderStatus, Prisma } from '@/generated/prisma/client'

export interface CustomerData {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  city?: string
  street?: string
  building?: string
  apartment?: string
}

export interface OrderItemSnapshot {
  name?: string
  sku?: string
  nameUk?: string
  nameRu?: string
  image?: string
}

export interface AdminProductItem {
  id: string
  sku: string
  slug: string
  categoryId: string
  brandId: string | null
  price: Prisma.Decimal
  comparePrice: Prisma.Decimal | null
  costPrice: Prisma.Decimal | null
  stock: number
  isActive: boolean
  isFeatured: boolean
  sortOrder: number
  translations: {
    locale: string
    name: string
    description: string | null
  }[]
  category: {
    id: string
    translations: {
      name: string
    }[]
  } | null
  brand: {
    id: string
    name: string
  } | null
  images: {
    id: string
    provider: string
    publicId: string | null
    url: string
    width: number | null
    height: number | null
    format: string | null
    size: number | null
    alt: string | null
    sortOrder: number
  }[]
}

export interface AdminOrderItem {
  id: string
  number: string
  status: OrderStatus
  paymentStatus: string
  paymentMethod: string
  total: Prisma.Decimal | number
  createdAt: Date
  customerData: Prisma.JsonValue
  notes: string | null
  items: {
    id: string
    quantity: number
    price: Prisma.Decimal | number
    snapshot: Prisma.JsonValue
  }[]
}

export interface AdminReviewItem {
  id: string
  rating: number
  comment: string | null
  advantages: string | null
  disadvantages: string | null
  verifiedPurchase: boolean
  isVisible: boolean
  createdAt: Date
  user: {
    name: string | null
    email: string
  }
  product: {
    id: string
    slug: string
    translations: {
      name: string
    }[]
  }
}

export interface AdminCategoryItem {
  id: string
  slug: string
  parentId: string | null
  isActive: boolean
  sortOrder: number
  translations: {
    locale: string
    name: string
    description: string | null
  }[]
}

export interface AdminBrandItem {
  id: string
  slug: string
  name: string
  logo: string | null
  isActive: boolean
}

// Zod validations
const ProductImageInputSchema = z.object({
  id: z.string().optional(),
  url: z.string(),
  provider: z.string().default('LOCAL'),
  publicId: z.string().nullable().optional(),
  width: z.number().nullable().optional(),
  height: z.number().nullable().optional(),
  format: z.string().nullable().optional(),
  size: z.number().nullable().optional(),
  alt: z.string().nullable().optional(),
  sortOrder: z.number().default(0),
})

const SaveProductSchema = z.object({
  id: z.string().optional(),
  sku: z.string().min(1),
  slug: z.string().min(1),
  categoryId: z.string().min(1),
  brandId: z.string().nullable().optional(),
  price: z.number().positive(),
  comparePrice: z.number().nullable().optional(),
  costPrice: z.number().nullable().optional(),
  stock: z.number().nonnegative(),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  sortOrder: z.number().default(0),
  nameUk: z.string().min(1),
  descriptionUk: z.string().optional(),
  nameRu: z.string().min(1),
  descriptionRu: z.string().optional(),
  images: z.array(ProductImageInputSchema).default([]),
})

const SaveCategorySchema = z.object({
  id: z.string().optional(),
  slug: z.string().min(1),
  parentId: z.string().nullable().optional(),
  sortOrder: z.number().default(0),
  isActive: z.boolean().default(true),
  nameUk: z.string().min(1),
  descriptionUk: z.string().optional(),
  nameRu: z.string().min(1),
  descriptionRu: z.string().optional(),
})

const SaveBrandSchema = z.object({
  id: z.string().optional(),
  slug: z.string().min(1),
  name: z.string().min(1),
  logo: z.string().nullable().optional(),
  isActive: z.boolean().default(true),
})

export async function getProductsAdmin(
  page = 1,
  limit = 20,
  search?: string,
  categoryId?: string,
  brandId?: string
) {
  try {
    await requireAdmin()

    const skip = (page - 1) * limit
    const where: Prisma.ProductWhereInput = {}

    if (search) {
      where.OR = [
        { sku: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
        { translations: { some: { name: { contains: search, mode: 'insensitive' } } } },
      ]
    }

    if (categoryId) {
      where.categoryId = categoryId
    }

    if (brandId) {
      where.brandId = brandId
    }

    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        take: limit,
        skip,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          sku: true,
          slug: true,
          categoryId: true,
          brandId: true,
          price: true,
          comparePrice: true,
          costPrice: true,
          stock: true,
          isActive: true,
          isFeatured: true,
          sortOrder: true,
          translations: {
            select: { locale: true, name: true, description: true },
          },
          category: {
            select: {
              id: true,
              translations: {
                where: { locale: 'uk' },
                select: { name: true },
              },
            },
          },
          brand: {
            select: { id: true, name: true },
          },
          images: {
            orderBy: { sortOrder: 'asc' },
            select: {
              id: true,
              provider: true,
              publicId: true,
              url: true,
              width: true,
              height: true,
              format: true,
              size: true,
              alt: true,
              sortOrder: true,
            },
          },
        },
      }),
      prisma.product.count({ where }),
    ])

    return { success: true, items, total, totalPages: Math.ceil(total / limit) }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Error loading products' }
  }
}

export async function saveProductAdmin(data: z.infer<typeof SaveProductSchema>) {
  try {
    await requireAdmin()
    const parsed = SaveProductSchema.safeParse(data)
    if (!parsed.success) {
      return { success: false, error: 'Validation failed' }
    }

    const val = parsed.data
    const { id, nameUk, descriptionUk, nameRu, descriptionRu, images } = val

    // Explicit mapping to prevent undefined in exactOptionalPropertyTypes
    const fields = {
      sku: val.sku,
      slug: val.slug,
      categoryId: val.categoryId,
      brandId: val.brandId || null,
      price: val.price,
      comparePrice: val.comparePrice !== undefined && val.comparePrice !== null ? val.comparePrice : null,
      costPrice: val.costPrice !== undefined && val.costPrice !== null ? val.costPrice : null,
      stock: val.stock,
      isActive: val.isActive,
      isFeatured: val.isFeatured,
      sortOrder: val.sortOrder,
    }

    let product
    if (id) {
      // Fetch existing images to identify deleted ones before DB update
      const existingImages = await prisma.productImage.findMany({
        where: { productId: id },
        select: { id: true, url: true, provider: true, publicId: true },
      })

      const newUrls = new Set(images.map((img) => img.url))
      const imagesToDelete = existingImages.filter((img) => !newUrls.has(img.url))

      // Execute all DB modifications inside a transaction
      product = await prisma.$transaction(async (tx) => {
        const updatedProduct = await tx.product.update({
          where: { id },
          data: {
            ...fields,
            translations: {
              upsert: [
                {
                  where: { productId_locale: { productId: id, locale: 'uk' } },
                  update: { name: nameUk, description: descriptionUk ?? null },
                  create: { locale: 'uk', name: nameUk, description: descriptionUk ?? null },
                },
                {
                  where: { productId_locale: { productId: id, locale: 'ru' } },
                  update: { name: nameRu, description: descriptionRu ?? null },
                  create: { locale: 'ru', name: nameRu, description: descriptionRu ?? null },
                },
              ],
            },
          },
          select: { id: true },
        })

        await tx.productImage.deleteMany({ where: { productId: id } })
        
        if (images.length > 0) {
          await tx.productImage.createMany({
            data: images.map((img, idx) => ({
              productId: id,
              url: img.url,
              provider: img.provider,
              publicId: img.publicId || null,
              width: img.width || null,
              height: img.height || null,
              format: img.format || null,
              size: img.size || null,
              alt: img.alt || null,
              sortOrder: img.sortOrder ?? idx,
            })),
          })
        }

        return updatedProduct
      })

      // Safely delete removed files from storage provider after successful DB commit
      for (const img of imagesToDelete) {
        try {
          await deleteProductImage(img.publicId, img.provider as 'CLOUDINARY' | 'LOCAL', img.url)
        } catch (storageErr) {
          console.error(`Failed to clean up storage image ${img.url}:`, storageErr)
        }
      }
    } else {
      // Create product
      product = await prisma.product.create({
        data: {
          ...fields,
          translations: {
            create: [
              { locale: 'uk', name: nameUk, description: descriptionUk ?? null },
              { locale: 'ru', name: nameRu, description: descriptionRu ?? null },
            ],
          },
          images: {
            create: images.map((img, idx) => ({
              url: img.url,
              provider: img.provider,
              publicId: img.publicId || null,
              width: img.width || null,
              height: img.height || null,
              format: img.format || null,
              size: img.size || null,
              alt: img.alt || null,
              sortOrder: img.sortOrder ?? idx,
            })),
          },
        },
        select: { id: true },
      })
    }

    // Sync to Algolia
    await syncProductIndex(product.id)
    revalidateTag('products', 'max')

    return { success: true, productId: product.id }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Error saving product' }
  }
}

export async function toggleProductActiveAdmin(productId: string) {
  try {
    await requireAdmin()
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, isActive: true },
    })

    if (!product) return { success: false, error: 'Product not found' }

    const updated = await prisma.product.update({
      where: { id: productId },
      data: { isActive: !product.isActive },
      select: { id: true, isActive: true },
    })

    await syncProductIndex(productId)
    revalidateTag('products', 'max')

    return { success: true, isActive: updated.isActive }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Error toggling state' }
  }
}

export async function updateProductStockAdmin(productId: string, stock: number) {
  try {
    await requireAdmin()
    await prisma.product.update({
      where: { id: productId },
      data: { stock },
      select: { id: true },
    })

    await syncProductIndex(productId)
    revalidateTag('products', 'max')

    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Error updating stock' }
  }
}

export async function deleteProductAdmin(productId: string) {
  try {
    await requireAdmin()

    // Remove from Algolia first
    await removeProductFromIndex(productId)

    // Fetch and delete all images from storage provider
    const productImages = await prisma.productImage.findMany({
      where: { productId },
      select: { url: true, provider: true, publicId: true },
    })

    for (const img of productImages) {
      await deleteProductImage(img.publicId, img.provider as 'CLOUDINARY' | 'LOCAL', img.url)
    }

    await prisma.product.delete({
      where: { id: productId },
    })

    revalidateTag('products', 'max')
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Error deleting product' }
  }
}

export async function getOrdersAdmin(page = 1, limit = 20, status?: string) {
  try {
    await requireAdmin()
    const skip = (page - 1) * limit
    const where: Prisma.OrderWhereInput = {}
    if (status) {
      where.status = status as OrderStatus
    }

    const [items, total] = await Promise.all([
      prisma.order.findMany({
        where,
        take: limit,
        skip,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          number: true,
          status: true,
          paymentStatus: true,
          paymentMethod: true,
          total: true,
          createdAt: true,
          customerData: true,
          notes: true,
          items: {
            select: {
              id: true,
              quantity: true,
              price: true,
              snapshot: true,
            },
          },
        },
      }),
      prisma.order.count({ where }),
    ])

    return { success: true, items, total, totalPages: Math.ceil(total / limit) }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Error loading orders' }
  }
}

export async function updateOrderStatusAdmin(orderId: string, status: OrderStatus) {
  try {
    await requireAdmin()
    await prisma.order.update({
      where: { id: orderId },
      data: { status },
      select: { id: true },
    })
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Error updating status' }
  }
}

export async function updateOrderNotesAdmin(orderId: string, notes: string) {
  try {
    await requireAdmin()
    await prisma.order.update({
      where: { id: orderId },
      data: { notes },
      select: { id: true },
    })
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Error updating notes' }
  }
}

export async function getCategoriesBrandsAdmin() {
  try {
    await requireAdmin()
    const [categories, brands] = await Promise.all([
      prisma.category.findMany({
        orderBy: { sortOrder: 'asc' },
        take: 100,
        select: {
          id: true,
          slug: true,
          parentId: true,
          isActive: true,
          sortOrder: true,
          translations: {
            select: { locale: true, name: true, description: true },
          },
        },
      }),
      prisma.brand.findMany({
        orderBy: { name: 'asc' },
        take: 100,
        select: {
          id: true,
          slug: true,
          name: true,
          logo: true,
          isActive: true,
        },
      }),
    ])

    return { success: true, categories, brands }
  } catch (error) {
    return {
      success: false,
      categories: [],
      brands: [],
      error: error instanceof Error ? error.message : 'Error loading metadata',
    }
  }
}

export async function saveCategoryAdmin(data: z.infer<typeof SaveCategorySchema>) {
  try {
    await requireAdmin()
    const parsed = SaveCategorySchema.safeParse(data)
    if (!parsed.success) return { success: false, error: 'Validation failed' }

    const val = parsed.data
    const { id, nameUk, descriptionUk, nameRu, descriptionRu } = val

    // Explicit mapping to prevent undefined in exactOptionalPropertyTypes
    const fields = {
      slug: val.slug,
      parentId: val.parentId || null,
      sortOrder: val.sortOrder,
      isActive: val.isActive,
    }

    if (id) {
      await prisma.category.update({
        where: { id },
        data: {
          ...fields,
          translations: {
            upsert: [
              {
                where: { categoryId_locale: { categoryId: id, locale: 'uk' } },
                update: { name: nameUk, description: descriptionUk ?? null },
                create: { locale: 'uk', name: nameUk, description: descriptionUk ?? null },
              },
              {
                where: { categoryId_locale: { categoryId: id, locale: 'ru' } },
                update: { name: nameRu, description: descriptionRu ?? null },
                create: { locale: 'ru', name: nameRu, description: descriptionRu ?? null },
              },
            ],
          },
        },
        select: { id: true },
      })
    } else {
      await prisma.category.create({
        data: {
          ...fields,
          translations: {
            create: [
              { locale: 'uk', name: nameUk, description: descriptionUk ?? null },
              { locale: 'ru', name: nameRu, description: descriptionRu ?? null },
            ],
          },
        },
        select: { id: true },
      })
    }

    revalidateTag('categories', 'max')
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Error saving category' }
  }
}

export async function saveBrandAdmin(data: z.infer<typeof SaveBrandSchema>) {
  try {
    await requireAdmin()
    const parsed = SaveBrandSchema.safeParse(data)
    if (!parsed.success) return { success: false, error: 'Validation failed' }

    const val = parsed.data
    const { id } = val

    // Explicit mapping to prevent undefined in exactOptionalPropertyTypes
    const fields = {
      slug: val.slug,
      name: val.name,
      logo: val.logo || null,
      isActive: val.isActive,
    }

    if (id) {
      await prisma.brand.update({
        where: { id },
        data: fields,
        select: { id: true },
      })
    } else {
      await prisma.brand.create({
        data: fields,
        select: { id: true },
      })
    }

    revalidateTag('brands', 'max')
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Error saving brand' }
  }
}

// ─── Reviews Management ────────────────────────────────────────────────────────

export async function getReviewsAdmin(page = 1, limit = 20, isVisible?: boolean) {
  try {
    await requireAdmin()
    const skip = (page - 1) * limit
    const where: Prisma.ReviewWhereInput = {}
    if (isVisible !== undefined) {
      where.isVisible = isVisible
    }

    const [items, total] = await Promise.all([
      prisma.review.findMany({
        where,
        take: limit,
        skip,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          rating: true,
          comment: true,
          advantages: true,
          disadvantages: true,
          verifiedPurchase: true,
          isVisible: true,
          createdAt: true,
          user: {
            select: {
              name: true,
              email: true,
            },
          },
          product: {
            select: {
              id: true,
              slug: true,
              translations: {
                where: { locale: 'uk' },
                select: { name: true },
                take: 1,
              },
            },
          },
        },
      }),
      prisma.review.count({ where }),
    ])

    return { success: true, items, total, totalPages: Math.ceil(total / limit) }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Error loading reviews' }
  }
}

export async function toggleReviewVisibilityAdmin(reviewId: string) {
  try {
    await requireAdmin()
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      select: { id: true, isVisible: true, productId: true, product: { select: { slug: true } } },
    })

    if (!review) return { success: false, error: 'Review not found' }

    const updated = await prisma.review.update({
      where: { id: reviewId },
      data: { isVisible: !review.isVisible },
      select: { id: true, isVisible: true },
    })

    // Revalidate product cache tag when visible reviews change
    revalidateTag(`product-${review.product.slug}`, 'max')
    revalidateTag('products', 'max')

    return { success: true, isVisible: updated.isVisible }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Error updating review' }
  }
}

export async function deleteReviewAdmin(reviewId: string) {
  try {
    await requireAdmin()
    const review = await prisma.review.delete({
      where: { id: reviewId },
      select: { product: { select: { slug: true } } },
    })

    // Revalidate product cache tag
    revalidateTag(`product-${review.product.slug}`, 'max')
    revalidateTag('products', 'max')

    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Error deleting review' }
  }
}
