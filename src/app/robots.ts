import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://elektronom.com.ua'
  const isStaging = siteUrl.includes('test.elektronom.com.ua') || siteUrl.includes('localhost') || siteUrl.includes('vercel.app')

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
