import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const nextConfig: NextConfig = {
  // ✅ Next.js 16: cacheComponents включает 'use cache' + PPR
  cacheComponents: true,

  // ✅ React Compiler — стабилен в Next.js 16
  reactCompiler: true,

  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      // Добавлять только реальные домены изображений
      {
        protocol: 'https',
        hostname: 'images.prom.ua',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        pathname: '/**',
      },
    ],
  },

  // ✅ Next.js 16.2: пробрасывает console.error браузера в терминал
  logging: {
    fetches: { fullUrl: true },
    browserToTerminal: 'error',
  },

  typedRoutes: true,
}

export default withNextIntl(nextConfig)
