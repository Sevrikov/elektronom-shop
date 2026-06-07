// src/app/[locale]/(shop)/product/[slug]/page.tsx
// Карточка товара — ISR с 'use cache' + cacheLife('seconds')
// MASTER_CONTEXT v1.2 §12.4

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'
import { setRequestLocale } from 'next-intl/server'
import { Check, X, Package, Truck, RotateCcw, ShieldCheck, Clock } from 'lucide-react'

import { isValidLocale } from '@/i18n/request'
import { getProductBySlug } from '@/queries/products'
import { prisma } from '@/lib/prisma'
import { formatPrice, getDiscountPercent, getSiteUrl } from '@/lib/utils'
import type { Locale } from '@/types'
import { translateAttributeKey, translateAttributeValue } from '@/lib/translit-translator'

import { ProductGallery } from '@/components/product/product-gallery'
import { ProductAttributes } from '@/components/product/product-attributes'
import { ProductSchema } from '@/components/product/product-schema'
import { SameSeriesProducts } from '@/components/product/same-series-products'
import { ProductReviews } from '@/components/product/product-reviews'
import { RelatedProductsSection } from '@/components/product/related-products-section'
import { AddToCartButton } from '@/components/cart/add-to-cart-button'
import Breadcrumbs from '@/components/layout/breadcrumbs'
import { ProductArticles } from '@/components/blog/product-articles'

// ─── generateStaticParams — top-1000 товаров ─────────────────────────────────

export async function generateStaticParams() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    select: { slug: true },
    orderBy: { updatedAt: 'desc' },
    take: 100,
  })
  const locales = ['uk', 'ru'] as const
  return products.flatMap((p) =>
    locales.map((locale) => ({ locale, slug: p.slug }))
  )
}

// ─── generateMetadata ─────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isValidLocale(locale)) return {}

  const product = await getProductBySlug(slug, locale)
  if (!product) return {}

  const translation = product.translations[0]
  const name = translation?.name ?? slug
  const description =
    translation?.metaDesc ??
    translation?.description?.slice(0, 160) ??
    undefined

  const baseUrl = getSiteUrl()

  return {
    title: `${name} — купити | Electronom`,
    description,
    alternates: {
      canonical: `${baseUrl}/${locale}/product/${slug}`,
      languages: {
        uk: `${baseUrl}/uk/product/${slug}`,
        ru: `${baseUrl}/ru/product/${slug}`,
        'x-default': `${baseUrl}/uk/product/${slug}`,
      },
    },
    openGraph: {
      title: `${name} | Electronom`,
      description,
      images: product.images[0]
        ? [{ url: product.images[0].url }]
        : [],
      url: `${baseUrl}/${locale}/product/${slug}`,
    },
  }
}

// ─── QtyBreak table component ─────────────────────────────────────────────────

function QtyBreaksTable({
  basePrice,
  breaks,
  locale,
}: {
  basePrice: number
  breaks: { min: number; discount: number }[]
  locale: string
}) {
  if (breaks.length === 0) return null
  const uk = locale !== 'ru'

  return (
    <div
      className="rounded-lg overflow-hidden text-sm"
      style={{ border: '1px solid var(--color-border)' }}
    >
      <table className="w-full">
        <thead>
          <tr style={{ background: 'var(--color-surface-alt)', borderBottom: '1px solid var(--color-border)' }}>
            <th className="px-3 py-2 text-left font-semibold" style={{ color: 'var(--color-text-muted)', fontSize: 11 }}>
              {uk ? 'ВІД, ШТ' : 'ОТ, ШТ'}
            </th>
            <th className="px-3 py-2 text-left font-semibold" style={{ color: 'var(--color-text-muted)', fontSize: 11 }}>
              {uk ? 'ЦІНА ЗА ШТ' : 'ЦЕНА ЗА ШТ'}
            </th>
            <th className="px-3 py-2 text-left font-semibold" style={{ color: 'var(--color-text-muted)', fontSize: 11 }}>
              {uk ? 'ЗНИЖКА' : 'СКИДКА'}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
            <td className="px-3 py-2 num">1</td>
            <td className="px-3 py-2 num font-semibold">{formatPrice(basePrice)}</td>
            <td className="px-3 py-2" style={{ color: 'var(--color-text-muted)' }}>—</td>
          </tr>
          {breaks.map((tier) => (
            <tr key={tier.min} style={{ borderBottom: '1px solid var(--color-border)' }}>
              <td className="px-3 py-2 num">{tier.min}+</td>
              <td className="px-3 py-2 num font-semibold">
                {formatPrice(basePrice * (1 - tier.discount / 100))}
              </td>
              <td className="px-3 py-2 font-semibold" style={{ color: 'var(--color-success)' }}>
                −{tier.discount}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  if (!isValidLocale(locale)) notFound()

  const product = await getProductBySlug(slug, locale)
  if (!product) notFound()

  const loc = locale as Locale
  const translation = product.translations[0]
  const name = translation?.name ?? product.sku
  const description = translation?.description
  const categoryName = product.category?.translations[0]?.name ?? ''
  const categorySlug = product.category?.slug ?? ''

  const price = Number(product.price.toString())
  const comparePrice = product.comparePrice
    ? Number(product.comparePrice.toString())
    : null
  const discount = getDiscountPercent(price, comparePrice)
  const inStock = product.stock > 0

  // Parse qty_breaks from JSONB attributes
  const attrs = product.attributes as Record<string, unknown>
  const qtyBreaks = Array.isArray(attrs['qty_breaks'])
    ? (attrs['qty_breaks'] as { min: number; discount: number }[])
    : []
  // Remove qty_breaks from displayed attributes
  const displayAttrs = Object.fromEntries(
    Object.entries(attrs).filter(([k]) => k !== 'qty_breaks')
  )

  const breadcrumbs = [
    { name: loc === 'ru' ? 'Главная' : 'Головна', url: '/' },
    { name: loc === 'ru' ? 'Каталог' : 'Каталог', url: '/catalog' },
    ...(categoryName
      ? [{ name: categoryName, url: `/catalog/${categorySlug}` }]
      : []),
    { name },
  ]

  const supplierInventory = await prisma.supplierInventory.findUnique({
    where: { sku: product.sku },
    select: { stock: true },
  })
  const isBackorder = !inStock && supplierInventory !== null && supplierInventory.stock > 0

  const stockLabel = inStock
    ? loc === 'ru' ? 'В наличии' : 'В наявності'
    : isBackorder
      ? loc === 'ru' ? 'Под заказ' : 'Під замовлення'
      : loc === 'ru' ? 'Нет в наличии' : 'Немає в наявності'

  return (
    <>
      {/* JSON-LD */}
      <ProductSchema product={{ ...product, isBackorder }} locale={locale} />

      <div className="max-w-[1280px] mx-auto px-4 lg:px-7 py-5 flex flex-col gap-6">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbs} locale={locale} />

        {/* Product Title — above card like mockup */}
        <h1 className="text-[26px] font-extrabold leading-tight tracking-tight text-text-primary -mb-2">
          {name}
        </h1>

        {/* ═══ HERO CARD — 3 columns ═══ */}
        <div className="bg-surface-white border border-border rounded-2xl p-5 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,460px)_minmax(0,1fr)_300px] gap-5">

            {/* ── Col 1: Gallery ── */}
            <div>
              <ProductGallery images={product.images} productName={name} locale={locale} />
            </div>

            {/* ── Col 2: Product Info ── */}
            <div className="flex flex-col gap-3 min-w-0">
              {/* Brand row */}
              {product.brand && (
                <div className="flex items-center justify-between px-3.5 py-3 border border-border rounded-xl bg-surface-alt">
                  <Link
                    href={`/${locale}/brands/${product.brand.slug}` as never}
                    className="text-sm font-extrabold tracking-tight hover:underline text-accent"
                  >
                    {product.brand.name}
                  </Link>
                </div>
              )}

              {/* Meta row: stock + SKU */}
              <div className="flex items-center gap-4 flex-wrap text-[13px]">
                <div
                  className={`inline-flex items-center gap-1.5 font-bold ${
                    inStock ? 'text-success' : isBackorder ? 'text-accent' : 'text-error'
                  }`}
                >
                  {inStock ? (
                    <Check className="size-3.5" strokeWidth={2.5} />
                  ) : isBackorder ? (
                    <Clock className="size-3.5 text-accent" strokeWidth={2.5} />
                  ) : (
                    <X className="size-3.5" strokeWidth={2.5} />
                  )}
                  {stockLabel}
                </div>
                <span className="text-text-muted">
                  {loc === 'ru' ? 'Код товару' : 'Код товару'}:{' '}
                  <span className="font-semibold text-text-primary">{product.sku}</span>
                </span>
              </div>

              {/* Price block */}
              <div className="flex items-end gap-3.5 mt-1">
                <span className="text-[38px] font-extrabold tracking-tight leading-none num text-text-primary">
                  {formatPrice(price)}
                </span>
                {comparePrice && comparePrice > price && (
                  <>
                    <span className="text-base line-through num text-text-muted pb-1">
                      {formatPrice(comparePrice)}
                    </span>
                    <span className="text-xs font-bold text-success pb-1.5">
                      −{discount}%
                    </span>
                  </>
                )}
              </div>

              {/* CTA row */}
              <div className="flex items-center gap-2 flex-wrap mt-1">
                <AddToCartButton
                  productId={product.id}
                  productName={name}
                  disabled={!inStock}
                  variant="full"
                  showQtyStepper={true}
                  stock={product.stock}
                  disabledText={isBackorder ? (loc === 'ru' ? 'Под заказ' : 'Під замовлення') : undefined}
                />
              </div>

              {/* Qty breaks */}
              {qtyBreaks.length > 0 && (
                <div className="mt-1">
                  <QtyBreaksTable basePrice={price} breaks={qtyBreaks} locale={locale} />
                </div>
              )}

              {/* Inline key specs — dotted rows like mockup */}
              {Object.keys(displayAttrs).length > 0 && (
                <div className="flex flex-col gap-1 pt-3 mt-1 border-t border-border">
                  {Object.entries(displayAttrs).slice(0, 8).map(([key, value]) => (
                    <div key={key} className="flex items-end gap-2 text-[13px] py-0.5">
                      <span className="text-text-muted whitespace-nowrap shrink-0">
                        {translateAttributeKey(key, locale === 'ru' ? 'ru' : 'uk')}
                      </span>
                      <span className="flex-1 border-b border-dotted border-border-strong min-w-[20px]" />
                      <span className="font-semibold text-text-primary text-right break-words min-w-0">
                        {translateAttributeValue(value, locale === 'ru' ? 'ru' : 'uk')}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── Col 3: Trust Sidebar ── */}
            <div className="flex flex-col gap-2.5">
              <div className="border border-border rounded-xl p-3 bg-surface-white">
                <div className="flex items-start gap-2">
                  <div className="size-7 rounded-full bg-accent-subtle text-accent flex items-center justify-center shrink-0 mt-0.5">
                    <Truck className="size-3.5" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-text-primary">
                      {loc === 'ru' ? 'Доставим в любой уголок Украины' : 'Доставимо в будь-який куточок України'}
                    </p>
                    <p className="text-[11px] text-text-muted mt-0.5">
                      {loc === 'ru' ? 'Новая почта, курьер, самовывоз' : 'Нова пошта, кур\'єр, самовивіз'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border border-border rounded-xl p-3 bg-surface-white">
                <div className="flex items-start gap-2">
                  <div className="size-7 rounded-full bg-accent-subtle text-accent flex items-center justify-center shrink-0 mt-0.5">
                    <RotateCcw className="size-3.5" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-text-primary">
                      {loc === 'ru' ? '14 дней обмен/возврат' : '14 днів обмін/повернення'}
                    </p>
                    <p className="text-[11px] text-text-muted mt-0.5">
                      {loc === 'ru' ? 'гарантия удовлетворения' : 'гарантія задоволення'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border border-border rounded-xl p-3 bg-surface-white">
                <div className="flex items-start gap-2">
                  <div className="size-7 rounded-full bg-accent-subtle text-accent flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck className="size-3.5" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-text-primary">
                      {loc === 'ru' ? '12 месяцев гарантия' : '12 місяців гарантія'}
                    </p>
                    <p className="text-[11px] text-text-muted mt-0.5">
                      {loc === 'ru' ? 'от производителя' : 'від виробника'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border border-border rounded-xl p-3 bg-accent-subtle">
                <div className="flex items-start gap-2">
                  <div className="size-7 rounded-full bg-surface-white text-accent flex items-center justify-center shrink-0 mt-0.5">
                    <Package className="size-3.5" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-accent">
                      {loc === 'ru' ? 'Оплата на счёт (с НДС)' : 'Оплата на рахунок (з ПДВ)'}
                    </p>
                    <p className="text-[11px] text-text-muted mt-0.5">
                      {loc === 'ru' ? 'для юридических лиц' : 'для юридичних осіб'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ═══ CHARACTERISTICS — full width ═══ */}
        {Object.keys(displayAttrs).length > 0 && (
          <ProductAttributes attributes={displayAttrs} locale={locale} />
        )}

        {/* ═══ BOTTOM — 2 columns ═══ */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_540px] gap-5 items-start">
          <div className="flex flex-col gap-6">
            {description && (
              <section className="bg-surface-white border border-border rounded-2xl p-5 shadow-sm">
                <h2 className="text-[22px] font-extrabold tracking-tight mb-4 text-text-primary">
                  {loc === 'ru' ? 'Описание продукта' : 'Опис продукту'}
                </h2>
                <div
                  className="prose prose-sm max-w-none text-sm leading-relaxed text-text-primary"
                  dangerouslySetInnerHTML={{ __html: description }}
                />
              </section>
            )}

            <ProductReviews
              productId={product.id}
              initialReviews={product.reviews.map((r) => ({
                ...r,
                createdAt: r.createdAt instanceof Date ? r.createdAt.toISOString() : String(r.createdAt),
              }))}
              locale={locale}
              productName={name}
            />
          </div>

          <Suspense>
            <SameSeriesProducts
              productId={product.id}
              categoryId={product.category?.id ?? ''}
              brandId={product.brandId}
              attributes={product.attributes as Record<string, unknown>}
              locale={locale}
            />
          </Suspense>
        </div>

        {/* Dynamic Product Articles */}
        <ProductArticles productName={name} productSku={product.sku} locale={locale} />

        {/* ═══ Related Products Section (Full-Width) ═══ */}
        <Suspense>
          <RelatedProductsSection
            categoryId={product.category?.id ?? ''}
            excludeId={product.id}
            locale={loc}
          />
        </Suspense>
      </div>
    </>
  )
}
