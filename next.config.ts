import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const nextConfig: NextConfig = {
  // ✅ React Compiler — стабилен в Next.js 16
  reactCompiler: true,

  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      // Добавлять только реальные домены изображений
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
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

  async redirects() {
    const targets = [
      { from: 'power-bank', to: 'poverbanky' },
      { from: 'heneratory-1', to: 'heneratory' },
      { from: 'tepla-pidloha-zubr-dc', to: 'tepla-pidloha' },
      { from: 'kabeli-i-roz-yemy', to: 'kabeli-droty' },
      { from: 'elektrika', to: 'elektryka' },
      { from: 'osvitlennya-led', to: 'led-osvitlennya' },
      { from: 'kabel-ta-provid', to: 'kabeli-droty' },
      { from: 'rozetky-ta-vymykachi', to: 'elektroustanovochni-vyroby' },
      { from: 'rozumnyy-dim', to: 'rozumnyy-budynok' },
    ]

    const redirectsList = []
    for (const t of targets) {
      redirectsList.push({
        source: `/ru/catalog/${t.from}`,
        destination: `/ru/catalog/${t.to}`,
        permanent: true,
      })
      redirectsList.push({
        source: `/uk/catalog/${t.from}`,
        destination: `/uk/catalog/${t.to}`,
        permanent: true,
      })
      redirectsList.push({
        source: `/catalog/${t.from}`,
        destination: `/catalog/${t.to}`,
        permanent: true,
      })
    }
    return redirectsList
  },
}

export default withNextIntl(nextConfig)
