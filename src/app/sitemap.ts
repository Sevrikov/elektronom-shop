import type { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://elektronom.com.ua'
  const locales = ['uk', 'ru']

  // Base routes
  const routes = ['', '/catalog', '/cart']
  const sitemapEntries: MetadataRoute.Sitemap = []

  // Add static routes
  for (const locale of locales) {
    for (const route of routes) {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'daily' : 'weekly',
        priority: route === '' ? 1.0 : 0.8,
      })
    }
  }

  try {
    // Dynamic products
    const products = await prisma.product.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
      take: 200, // Safe limit for sitemap performance
    })

    for (const locale of locales) {
      for (const product of products) {
        sitemapEntries.push({
          url: `${baseUrl}/${locale}/product/${product.slug}`,
          lastModified: product.updatedAt,
          changeFrequency: 'weekly',
          priority: 0.6,
        })
      }
    }

    // Dynamic categories
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
      take: 50,
    })

    for (const locale of locales) {
      for (const category of categories) {
        sitemapEntries.push({
          url: `${baseUrl}/${locale}/catalog/${category.slug}`,
          lastModified: category.updatedAt,
          changeFrequency: 'weekly',
          priority: 0.7,
        })
      }
    }
  } catch (error) {
    console.error('[sitemap] Failed to fetch dynamic entries:', error)
  }

  return sitemapEntries
}
