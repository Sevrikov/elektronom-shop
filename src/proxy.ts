// src/proxy.ts — Next.js 16: replaces middleware.ts
// Handles i18n routing via next-intl
import createMiddleware from 'next-intl/middleware'
import { locales, defaultLocale } from '@/i18n/request'

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
})

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
