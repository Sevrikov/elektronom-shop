import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server'
import { Suspense } from 'react'
import { isValidLocale, locales } from '@/i18n/request'
import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'
import MobileNav from '@/components/layout/mobile-nav'
import { CartDrawer } from '@/components/cart/cart-drawer'
import { AssistantWidget } from '@/components/assistant/assistant-widget'
import { CompareDrawer } from '@/components/compare/compare-drawer'
import { getSiteUrl, safeJsonLd } from '@/lib/utils'
import { getCategoryTree } from '@/queries/categories'
import { getWorkloadCount } from '@/queries/workload'
import { contactInfo, socialLinks } from '@/lib/constants'

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
    metadataBase: new URL(getSiteUrl()),
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      type: 'website',
      locale: locale === 'uk' ? 'uk_UA' : 'ru_UA',
      siteName: 'Electronom',
    },
    alternates: {
      languages: {
        uk: '/uk',
        ru: '/ru',
      },
    },
  }
}

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
  const [messages, categories, workload] = await Promise.all([
    getMessages({ locale }),
    getCategoryTree(locale),
    getWorkloadCount(),
  ])

  return (
    <html lang={locale} className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: safeJsonLd({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              'name': 'Electronom',
              'url': 'https://elektronom.com.ua',
              'logo': 'https://elektronom.com.ua/electronom.png',
              'contactPoint': {
                '@type': 'ContactPoint',
                'telephone': contactInfo.phone.replace(/[^\d+]/g, ''),
                'contactType': 'sales',
                'areaServed': 'UA',
                'availableLanguage': ['Ukrainian', 'Russian']
              },
              'address': {
                '@type': 'PostalAddress',
                'streetAddress': locale === 'uk' ? 'вул. Прикладна 10' : 'ул. Прикладная 10',
                'addressLocality': locale === 'uk' ? 'Київ' : 'Киев',
                'addressCountry': 'UA'
              },
              'sameAs': [
                socialLinks.facebook,
                socialLinks.instagram,
                socialLinks.telegram
              ]
            })
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-surface-alt">
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Suspense fallback={null}>
            <Header categories={categories} workload={workload} />
            <main className="flex-1 pb-16 lg:pb-0">
              {children}
            </main>
            <Footer />
            <MobileNav />
            <CartDrawer locale={locale} />
            <CompareDrawer locale={locale as 'uk' | 'ru'} />
            <AssistantWidget locale={locale} />
          </Suspense>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
