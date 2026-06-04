import { cacheLife, cacheTag } from 'next/cache'
import { prisma } from '@/lib/prisma'
import type { EngineeringCatalogProduct, EngineeringLocale } from './types'

export async function getEngineeringCatalogProducts(locale: EngineeringLocale): Promise<EngineeringCatalogProduct[]> {
  'use cache'
  cacheLife('minutes')
  cacheTag('products')
  cacheTag('engineering-catalog')

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
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
    orderBy: [
      { stock: 'desc' },
      { sortOrder: 'asc' },
      { createdAt: 'desc' },
    ],
    take: 120,
  })

  return products.map((product) => ({
    id: product.id,
    slug: product.slug,
    sku: product.sku,
    name: product.translations[0]?.name ?? product.slug,
    price: Number(product.price),
    stock: product.stock,
    categorySlug: product.category.slug,
    brandName: product.brand?.name ?? null,
    imageUrl: product.images[0]?.url ?? null,
    attributes: (product.attributes as Record<string, unknown>) ?? {},
  }))
}
