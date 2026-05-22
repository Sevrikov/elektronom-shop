import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server'
import { isValidLocale, locales } from '@/i18n/request'
import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'
import MobileNav from '@/components/layout/mobile-nav'
import { CartDrawer } from '@/components/cart/cart-drawer'

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
})

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!isValidLocale(locale)) return {}
  const t = await getTranslations({ locale, namespace: 'meta' })

  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      type: 'website',
      locale: locale === 'uk' ? 'uk_UA' : 'ru_UA',
      siteName: 'ЕЛЕКТРОНОМ',
    },
    alternates: {
      languages: {
        uk: '/uk',
        ru: '/ru',
      },
    },
  }
}

import { Suspense } from 'react'

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!isValidLocale(locale)) {
    notFound()
  }

  setRequestLocale(locale)
  const messages = await getMessages({ locale })

  return (
    <html lang={locale} className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans" style={{ background: 'var(--color-surface-alt)' }}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Suspense fallback={null}>
            <Header />
            <main className="flex-1 pb-16 lg:pb-0">
              {children}
            </main>
            <Footer />
            <MobileNav />
            <CartDrawer locale={locale} />
          </Suspense>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
