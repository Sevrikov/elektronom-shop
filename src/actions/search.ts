'use server'

import { prisma } from '@/lib/prisma'
import { getAlgoliaAdminClient, getAlgoliaSearchClient } from '@/lib/algolia'
import { searchProductsFallback } from '@/queries/search'
import type { Locale } from '@/types'

export interface SearchResultProduct {
  objectID: string
  slug: string
  sku: string
  name: string
  description: string
  price: number
  comparePrice: number | null
  inStock: boolean
  categorySlug: string
  categoryName: string
  brandName: string | null
  image: string | null
  locale: string
  gtin?: string | null
  mpn?: string | null
}

/**
 * Perform product search via Algolia
 */
export async function searchProducts(query: string, locale: string): Promise<{ success: boolean; results: SearchResultProduct[]; error?: string }> {
  try {
    const client = getAlgoliaSearchClient()
    if (!client) {
      const fallback = await searchProductsFallback(query, locale, 12)
      return {
        success: true,
        results: fallback.products.map((product) => ({
          objectID: product.id,
          slug: product.slug,
          sku: product.sku,
          name: product.translations[0]?.name ?? product.sku,
          description: '',
          price: Number(product.price),
          comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
          inStock: product.stock > 0,
          categorySlug: product.category.slug,
          // B-2: use translated name (matches Algolia record) not the slug
          categoryName: product.category.translations.find((t) => t.locale === (locale as Locale))?.name
            ?? product.category.translations[0]?.name
            ?? product.category.slug,
          brandName: product.brand?.name ?? null,
          image: product.images[0]?.processedUrl || product.images[0]?.url || null,
          locale,
        })),
      }
    }

    const indexName = `products_${locale}`
    const response = await client.searchSingleIndex({
      indexName,
      searchParams: {
        query,
        hitsPerPage: 12,
      },
    })

    const results = (response.hits as unknown as SearchResultProduct[]).map((hit) => ({
      objectID: hit.objectID,
      slug: hit.slug,
      sku: hit.sku,
      name: hit.name,
      description: hit.description,
      price: hit.price,
      comparePrice: hit.comparePrice,
      inStock: hit.inStock,
      categorySlug: hit.categorySlug,
      categoryName: hit.categoryName,
      brandName: hit.brandName,
      image: hit.image,
      locale: hit.locale,
    }))

    return { success: true, results }
  } catch (error) {
    console.error('[searchProducts] Error searching products:', error)
    try {
      const fallback = await searchProductsFallback(query, locale, 12)
      return {
        success: true,
        results: fallback.products.map((product) => ({
          objectID: product.id,
          slug: product.slug,
          sku: product.sku,
          name: product.translations[0]?.name ?? product.sku,
          description: '',
          price: Number(product.price),
          comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
          inStock: product.stock > 0,
          categorySlug: product.category.slug,
          // B-2: use translated name (matches Algolia record) not the slug
          categoryName: product.category.translations.find((t) => t.locale === (locale as Locale))?.name
            ?? product.category.translations[0]?.name
            ?? product.category.slug,
          brandName: product.brand?.name ?? null,
          image: product.images[0]?.processedUrl || product.images[0]?.url || null,
          locale,
        })),
      }
    } catch {
      return { success: false, results: [], error: error instanceof Error ? error.message : 'Search failed' }
    }
  }
}

/**
 * Index/Sync single product to Algolia
 */
export async function syncProductIndex(productId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const client = getAlgoliaAdminClient()
    if (!client) {
      return { success: true } // Skip if not configured
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        slug: true,
        sku: true,
        price: true,
        comparePrice: true,
        stock: true,
        isActive: true,
        gtin: true,
        mpn: true,
        translations: {
          select: { locale: true, name: true, description: true }
        },
        images: {
          orderBy: { sortOrder: 'asc' },
          take: 1,
          select: { url: true, processedUrl: true }
        },
        category: {
          select: {
            slug: true,
            translations: {
              select: { locale: true, name: true }
            }
          }
        },
        brand: {
          select: { name: true }
        }
      }
    })

    if (!product) {
      return { success: false, error: 'Product not found' }
    }

    const locales = ['uk', 'ru'] as const

    for (const locale of locales) {
      const indexName = `products_${locale}`
      
      if (!product.isActive) {
        // Remove from index if inactive
        await client.deleteObject({
          indexName,
          objectID: product.id,
        })
        continue
      }

      const translation = product.translations.find((t) => t.locale === locale)
      const categoryTrans = product.category.translations.find((t) => t.locale === locale)

      const record: SearchResultProduct = {
        objectID: product.id,
        slug: product.slug,
        sku: product.sku,
        name: translation?.name ?? '',
        description: translation?.description ?? '',
        price: Number(product.price),
        comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
        inStock: product.stock > 0,
        categorySlug: product.category.slug,
        categoryName: categoryTrans?.name ?? '',
        brandName: product.brand?.name ?? null,
        image: product.images[0]?.processedUrl || product.images[0]?.url || null,
        locale,
        gtin: product.gtin,
        mpn: product.mpn,
      }

      await client.saveObjects({
        indexName,
        objects: [record as unknown as Record<string, unknown>],
      })
    }

    return { success: true }
  } catch (error) {
    console.error('[syncProductIndex] Error syncing product index:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Sync failed' }
  }
}

/**
 * Remove product from Algolia index
 */
export async function removeProductFromIndex(productId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const client = getAlgoliaAdminClient()
    if (!client) {
      return { success: true }
    }

    const locales = ['uk', 'ru'] as const
    for (const locale of locales) {
      const indexName = `products_${locale}`
      await client.deleteObject({
        indexName,
        objectID: productId,
      })
    }

    return { success: true }
  } catch (error) {
    console.error('[removeProductFromIndex] Error removing product from index:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Removal failed' }
  }
}
