import type { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'
import { getSiteUrl } from '@/lib/utils'
import { articles } from '@/lib/articles'
import { categoryFilterConfig } from '@/lib/catalog-filter-config'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl()
  const locales = ['uk', 'ru']

  // Base routes with their priority and change frequency
  const baseRoutes = [
    { path: '', changeFrequency: 'daily' as const, priority: 1.0 },
    { path: '/catalog', changeFrequency: 'weekly' as const, priority: 0.8 },
    { path: '/blog', changeFrequency: 'weekly' as const, priority: 0.8 },
    { path: '/brands', changeFrequency: 'weekly' as const, priority: 0.8 },
    { path: '/calculators', changeFrequency: 'weekly' as const, priority: 0.8 },
    { path: '/about', changeFrequency: 'monthly' as const, priority: 0.6 },
    { path: '/contacts', changeFrequency: 'monthly' as const, priority: 0.6 },
    { path: '/delivery', changeFrequency: 'monthly' as const, priority: 0.6 },
  ]

  const sitemapEntries: MetadataRoute.Sitemap = []

  // Add static routes
  for (const locale of locales) {
    for (const route of baseRoutes) {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${route.path}`,
        lastModified: new Date(),
        changeFrequency: route.changeFrequency,
        priority: route.priority,
        alternates: {
          languages: {
            uk: `${baseUrl}/uk${route.path}`,
            ru: `${baseUrl}/ru${route.path}`,
          },
        },
      })
    }
  }

  try {
    // Dynamic products - limit set to 50000 to comply with "NO direct queries without limits" rule
    const products = await prisma.product.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
      take: 50000,
    })

    for (const locale of locales) {
      for (const product of products) {
        sitemapEntries.push({
          url: `${baseUrl}/${locale}/product/${product.slug}`,
          lastModified: product.updatedAt,
          changeFrequency: 'weekly',
          priority: 0.6,
          alternates: {
            languages: {
              uk: `${baseUrl}/uk/product/${product.slug}`,
              ru: `${baseUrl}/ru/product/${product.slug}`,
            },
          },
        })
      }
    }

    // Dynamic categories
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
      take: 1000,
    })

    for (const locale of locales) {
      for (const category of categories) {
        sitemapEntries.push({
          url: `${baseUrl}/${locale}/catalog/${category.slug}`,
          lastModified: category.updatedAt,
          changeFrequency: 'weekly',
          priority: 0.7,
          alternates: {
            languages: {
              uk: `${baseUrl}/uk/catalog/${category.slug}`,
              ru: `${baseUrl}/ru/catalog/${category.slug}`,
            },
          },
        })
      }
    }

    // Dynamic brands
    const brands = await prisma.brand.findMany({
      where: { isActive: true },
      select: { slug: true, createdAt: true },
      take: 1000,
    })

    for (const locale of locales) {
      for (const brand of brands) {
        sitemapEntries.push({
          url: `${baseUrl}/${locale}/brands/${brand.slug}`,
          lastModified: brand.createdAt,
          changeFrequency: 'weekly',
          priority: 0.6,
          alternates: {
            languages: {
              uk: `${baseUrl}/uk/brands/${brand.slug}`,
              ru: `${baseUrl}/ru/brands/${brand.slug}`,
            },
          },
        })
      }
    }

    // Static articles (Blog)
    for (const locale of locales) {
      for (const article of articles) {
        sitemapEntries.push({
          url: `${baseUrl}/${locale}/blog/${article.slug}`,
          lastModified: new Date(article.date),
          changeFrequency: 'monthly',
          priority: 0.5,
          alternates: {
            languages: {
              uk: `${baseUrl}/uk/blog/${article.slug}`,
              ru: `${baseUrl}/ru/blog/${article.slug}`,
            },
          },
        })
      }
    }

    // Catalog facet-landing quick links
    for (const [catSlug, config] of Object.entries(categoryFilterConfig)) {
      if (!config.quickLinks) continue
      for (const link of config.quickLinks) {
        if (!link.filter) continue
        const queryStr = `${link.filter.key}=${encodeURIComponent(link.filter.value)}`
        
        for (const locale of locales) {
          sitemapEntries.push({
            url: `${baseUrl}/${locale}/catalog/${catSlug}?${queryStr}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.6,
            alternates: {
              languages: {
                uk: `${baseUrl}/uk/catalog/${catSlug}?${queryStr}`,
                ru: `${baseUrl}/ru/catalog/${catSlug}?${queryStr}`,
              },
            },
          })
        }
      }
    }
  } catch (error) {
    console.error('[sitemap] Failed to fetch dynamic entries:', error)
  }

  return sitemapEntries
}
