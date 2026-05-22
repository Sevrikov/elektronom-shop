import { Suspense } from 'react'
import HybridDrawer from '@/components/home/hero-section'
import ValueProps from '@/components/home/value-props'
import CategoriesSection from '@/components/home/categories-section'
import TrustSection from '@/components/home/trust-section'
import PrefooterCta from '@/components/home/prefooter-cta'
import CategorySidebar from '@/components/layout/category-sidebar'
import { getFeaturedProducts, getNewArrivals } from '@/queries/products'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import ProductCard from '@/components/product/product-card'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import type { Locale } from '@/types'

// ─── Server Component — реальная карусель из БД ──────────────────────────────

async function ProductCarouselServer({
  locale,
  title,
  viewAllText,
  viewAllHref,
  mode,
}: {
  locale: Locale
  title: string
  viewAllText: string
  viewAllHref: string
  mode: 'featured' | 'new'
}) {
  const products =
    mode === 'featured'
      ? await getFeaturedProducts(locale, 8)
      : await getNewArrivals(locale, 8)

  if (products.length === 0) return null

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>
          {title}
        </h2>
        <Link
          href={`/${locale}${viewAllHref}`}
          className="inline-flex items-center gap-1 text-[13px] font-medium hover:underline"
          style={{ color: 'var(--color-accent)' }}
        >
          {viewAllText}
          <ChevronRight className="size-3.5" strokeWidth={1.5} />
        </Link>
      </div>
      <div className="no-scrollbar flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
        {products.map((product) => (
          <div key={product.id} className="shrink-0 w-[228px]">
            <ProductCard product={product} locale={locale} />
          </div>
        ))}
      </div>
    </section>
  )
}

// ─── Skeleton fallback ────────────────────────────────────────────────────────

function LoadingSkeleton() {
  return (
    <div className="w-full h-40 rounded-lg animate-pulse" style={{ background: 'var(--color-surface-raised)' }} />
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const loc = locale as Locale
  const t = await getTranslations({ locale: loc, namespace: 'home' })

  return (
    <div className="mx-auto max-w-[1280px] px-4 lg:px-6 py-6">
      <div className="flex gap-6">
        <CategorySidebar />
        <div className="flex-1 min-w-0 flex flex-col gap-6">
          <HybridDrawer />
          <ValueProps />
          <CategoriesSection />
          <Suspense fallback={<LoadingSkeleton />}>
            <ProductCarouselServer
              locale={loc}
              title={t('topSales.title')}
              viewAllText={t('topSales.viewAll')}
              viewAllHref="/catalog?sort=popular"
              mode="featured"
            />
          </Suspense>
          <Suspense fallback={<LoadingSkeleton />}>
            <ProductCarouselServer
              locale={loc}
              title={t('newArrivals.title')}
              viewAllText={t('newArrivals.viewAll')}
              viewAllHref="/catalog?sort=new"
              mode="new"
            />
          </Suspense>
          <TrustSection />
          <PrefooterCta />
        </div>
      </div>
    </div>
  )
}
