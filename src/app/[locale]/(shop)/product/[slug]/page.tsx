// src/app/[locale]/(shop)/product/[slug]/page.tsx
// Карточка товара — ISR с 'use cache' + cacheLife('seconds')
// MASTER_CONTEXT v1.2 §12.4

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Suspense } from 'react'
import { setRequestLocale, getTranslations } from 'next-intl/server'
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
  t,
}: {
  basePrice: number
  breaks: { min: number; discount: number }[]
  t: (key: string) => string
}) {
  if (breaks.length === 0) return null

  return (
    <div className="rounded-lg overflow-hidden text-sm border border-border">
      <table className="w-full">
        <thead>
          <tr className="bg-surface-alt border-b border-border">
            <th className="px-3 py-2 text-left font-semibold text-text-muted text-[11px]">
              {t('qtyBreaks.fromQty')}
            </th>
            <th className="px-3 py-2 text-left font-semibold text-text-muted text-[11px]">
              {t('qtyBreaks.pricePerUnit')}
            </th>
            <th className="px-3 py-2 text-left font-semibold text-text-muted text-[11px]">
              {t('qtyBreaks.discount')}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-border">
            <td className="px-3 py-2 num">1</td>
            <td className="px-3 py-2 num font-semibold">{formatPrice(basePrice)}</td>
            <td className="px-3 py-2 text-text-muted">—</td>
          </tr>
          {breaks.map((tier) => (
            <tr key={tier.min} className="border-b border-border last:border-b-0">
              <td className="px-3 py-2 num">{tier.min}+</td>
              <td className="px-3 py-2 num font-semibold">
                {formatPrice(basePrice * (1 - tier.discount / 100))}
              </td>
              <td className="px-3 py-2 font-semibold text-success">
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

  const t = await getTranslations({ locale, namespace: 'pdp' })

  const breadcrumbs = [
    { name: t('breadcrumbs.home'), url: '/' },
    { name: t('breadcrumbs.catalog'), url: '/catalog' },
    ...(categoryName
      ? [{ name: categoryName, url: `/catalog/${categorySlug}` }]
      : []),
    { name },
  ]

  const supplierInventory = await prisma.supplierInventory.findUnique({
    where: { sku: product.sku },
    select: { stock: true, updatedAt: true },
  })
  const isBackorder = !inStock && supplierInventory !== null && supplierInventory.stock > 0

  const stockLabel = inStock
    ? t('meta.inStockQty', { qty: product.stock })
    : isBackorder
      ? t('meta.backorder')
      : t('meta.outOfStock')

  return (
    <>
      {/* JSON-LD */}
      <ProductSchema product={{ ...product, isBackorder }} locale={locale} />

      <div className="max-w-[1600px] mx-auto px-4 lg:px-6 py-5 flex flex-col gap-6">
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
                <div className="flex items-center gap-3 px-3.5 py-3 border border-border rounded-xl bg-surface-alt">
                  {product.brand.logo && (
                    <div className="size-10 shrink-0 flex items-center justify-center border border-border rounded-lg p-1 bg-white">
                      <Image
                        src={product.brand.logo}
                        alt={product.brand.name}
                        width={32}
                        height={32}
                        className="object-contain max-h-8"
                      />
                    </div>
                  )}
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
                <div className="flex flex-col gap-1">
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
                  {isBackorder && supplierInventory && (
                    <div className="text-[11px] text-text-muted font-medium">
                      {t('meta.supplierStock', { qty: supplierInventory.stock })}
                    </div>
                  )}
                  {supplierInventory && (
                    <div className="flex items-center gap-1 text-[11px] text-text-muted mt-0.5">
                      <Clock className="size-3" />
                      <span>
                        {t('meta.lastSync', {
                          time: new Date(supplierInventory.updatedAt).toLocaleString(locale === 'ru' ? 'ru-RU' : 'uk-UA', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          }),
                        })}
                      </span>
                    </div>
                  )}
                </div>
                <span className="text-text-muted self-start">
                  {t('meta.productCode')}:{' '}
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
                  disabledText={isBackorder ? t('meta.backorder') : undefined}
                />
              </div>

              {/* Qty breaks */}
              {qtyBreaks.length > 0 && (
                <div className="mt-1">
                  <QtyBreaksTable basePrice={price} breaks={qtyBreaks} t={t} />
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
                      {t('trust.deliveryTitle')}
                    </p>
                    <p className="text-[11px] text-text-muted mt-0.5">
                      {t('trust.deliveryDesc')}
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
                      {t('trust.returnTitle')}
                    </p>
                    <p className="text-[11px] text-text-muted mt-0.5">
                      {t('trust.returnDesc')}
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
                      {t('trust.warrantyTitle')}
                    </p>
                    <p className="text-[11px] text-text-muted mt-0.5">
                      {t('trust.warrantyDesc')}
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
                      {t('trust.paymentTitle')}
                    </p>
                    <p className="text-[11px] text-text-muted mt-0.5">
                      {t('trust.paymentDesc')}
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
                  {t('description')}
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
            locale={locale as Locale}
          />
        </Suspense>
      </div>
    </>
  )
}
