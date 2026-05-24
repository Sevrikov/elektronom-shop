// src/app/[locale]/(shop)/cart/page.tsx
// Страница корзины — SSR, без 'use cache' (персонализирована)
// Стратегия §7: динамическая страница — просто не используем 'use cache'
// ⛔ НЕТ export const dynamic = 'force-dynamic' (deprecated в Next.js 16)
// MASTER_CONTEXT v1.2 §12.6

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isValidLocale } from '@/i18n/request'
import { getCart } from '@/actions/cart'
import { CartPageClient } from '@/components/cart/cart-page-client'
import Breadcrumbs from '@/components/layout/breadcrumbs'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const uk = locale !== 'ru'
  return {
    title: `${uk ? 'Кошик' : 'Корзина'} | ЕЛЕКТРОНОМ`,
    description: uk
      ? 'Ваш кошик покупок в інтернет-магазині ЕЛЕКТРОНОМ'
      : 'Ваша корзина покупок в интернет-магазине ЭЛЕКТРОНОМ',
    robots: { index: false, follow: true },
    alternates: {
      languages: {
        uk: '/uk/cart',
        ru: '/ru/cart',
      },
    },
  }
}

import { Suspense } from 'react'

function CartPagePlaceholder() {
  return (
    <div id="cart-page" className="min-h-[calc(100vh-200px)] bg-surface-alt">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-20 py-6 lg:py-8 animate-pulse">
        <div className="h-6 w-32 bg-border-strong rounded mb-6"></div>
        <div className="h-10 w-48 bg-border-strong rounded mb-8"></div>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
          <div className="h-64 bg-border-strong rounded-xl"></div>
          <div className="h-64 bg-border-strong rounded-xl"></div>
        </div>
      </div>
    </div>
  )
}

export default function CartPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  return (
    <Suspense fallback={<CartPagePlaceholder />}>
      <CartPageContent params={params} />
    </Suspense>
  )
}

import { setRequestLocale } from 'next-intl/server'

async function CartPageContent({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  if (!isValidLocale(locale)) notFound()

  const uk = locale !== 'ru'

  // Fetch current cart from cookie → DB for active products
  const items = await getCart(locale)

  const breadcrumbs = [
    { name: uk ? 'Головна' : 'Главная', url: '/' },
    { name: uk ? 'Кошик' : 'Корзина' },
  ]

  return (
    <div
      id="cart-page"
      className="min-h-[calc(100vh-200px)] bg-surface-alt"
    >
      <div className="max-w-[1280px] mx-auto px-4 lg:px-20 py-6 lg:py-8">
        <Breadcrumbs items={breadcrumbs} locale={locale} />

        {/* Client component handles all interactions + router.refresh() */}
        <CartPageClient items={items} locale={locale} />
      </div>
    </div>
  )
}
