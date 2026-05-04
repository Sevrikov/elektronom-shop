import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const nextConfig: NextConfig = {
  // cacheComponents: disabled until next-intl full compatibility
  // cacheComponents: true,

  // ✅ React Compiler — стабилен в Next.js 16
  reactCompiler: true,

  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [],
  },

  logging: {
    fetches: { fullUrl: true },
  },

  // typedRoutes: re-enable when all routes are established
  // typedRoutes: true,
}

export default withNextIntl(nextConfig)
