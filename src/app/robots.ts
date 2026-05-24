import type { MetadataRoute } from 'next'
import { getSiteUrl } from '@/lib/utils'

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl()
  const isStaging = siteUrl.includes('test.elektronom.com.ua') || siteUrl.includes('localhost') || siteUrl.includes('127.0.0.1') || siteUrl.includes('vercel.app')

  if (isStaging) {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
      sitemap: `${siteUrl}/sitemap.xml`,
    }
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/', '/checkout/', '/account/'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
