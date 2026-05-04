import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { isValidLocale } from '@/i18n/request'
import { sidebarCategories } from '@/lib/constants'
import { categoryFilters, defaultCategoryFilters, getBrandsForCategory, getPriceRange, getAttributeCounts } from '@/lib/catalog-data'
import { getFilteredProducts, parseSearchParams } from '@/queries/products'
import { getCategoryBySlug } from '@/queries/categories'
import type { Locale } from '@/types'
import Breadcrumbs from '@/components/layout/breadcrumbs'
import CatalogFilters from '@/components/catalog/catalog-filters'
import ActiveFilters from '@/components/catalog/active-filters'
import ProductGrid from '@/components/catalog/product-grid'

const PAGE_SIZE = 12

// Generate static params from sidebar categories
export function generateStaticParams() {
  return sidebarCategories.map((cat) => ({ slug: cat.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isValidLocale(locale)) return {}
  const category = getCategoryBySlug(slug)
  if (!category) return {}
  const t = await getTranslations({ locale, namespace: 'catalog' })
  const loc = locale as Locale

  return {
    title: t('metaTitle', { category: category.name[loc] }),
    description: t('metaDescription', { category: category.name[loc] }),
  }
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; slug: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const { locale, slug } = await params
  const sp = await searchParams
  const category = getCategoryBySlug(slug)

  if (!category) {
    notFound()
  }

  const t = await getTranslations({ locale, namespace: 'catalog' })
  const loc = locale as Locale

  // Parse filters from URL
  const activeFilters = parseSearchParams(sp)

  // Get data
  const { products, total } = getFilteredProducts(slug, activeFilters)
  const filters = categoryFilters[slug] ?? defaultCategoryFilters
  const brandCounts = getBrandsForCategory(slug)
  const priceRange = getPriceRange(slug)

  // Get counts for all attribute filters
  const attributeCounts: Record<string, { value: string; count: number }[]> = {}
  for (const f of filters) {
    if (f.key !== 'brand' && f.key !== 'price') {
      attributeCounts[f.key] = getAttributeCounts(slug, f.key)
    }
  }

  // Build active filter pills
  const pills: { key: string; label: string; value: string; displayValue: string }[] = []

  if (activeFilters.brand) {
    for (const b of activeFilters.brand) {
      pills.push({ key: 'brand', label: t('filters.brand'), value: b, displayValue: b })
    }
  }
  if (activeFilters.priceMin !== undefined || activeFilters.priceMax !== undefined) {
    const min = activeFilters.priceMin ?? priceRange.min
    const max = activeFilters.priceMax ?? priceRange.max
    pills.push({
      key: 'priceMin',
      label: t('filters.price'),
      value: `${min}-${max}`,
      displayValue: `${min.toLocaleString('uk-UA')} — ${max.toLocaleString('uk-UA')} ₴`,
    })
  }
  if (activeFilters.inStock) {
    pills.push({ key: 'inStock', label: t('inStock'), value: '1', displayValue: t('inStock') })
  }

  // Dynamic attribute pills
  for (const f of filters) {
    if (['brand', 'price'].includes(f.key)) continue
    const values = activeFilters[f.key]
    if (Array.isArray(values)) {
      for (const v of values) {
        pills.push({ key: f.key, label: f.label[loc], value: v, displayValue: `${f.label[loc]}: ${v}` })
      }
    }
  }

  const breadcrumbs = [
    { name: t('breadcrumbs.home'), url: '/' },
    { name: t('breadcrumbs.catalog'), url: '/catalog' },
    { name: category.name[loc] },
  ]

  return (
    <div className="max-w-[1280px] mx-auto px-4 py-6">
      <Breadcrumbs items={breadcrumbs} locale={locale} />

      <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
        {category.name[loc]}
      </h1>

      {/* Active filter pills */}
      <ActiveFilters pills={pills} total={total} />

      {/* Main layout: sidebar filters + product grid */}
      <div className="flex gap-6 items-start mt-2">
        {/* Sidebar filters (desktop) */}
        <aside className="hidden lg:block w-[280px] shrink-0 sticky top-[140px] self-start">
          <CatalogFilters
            filters={filters}
            activeFilters={activeFilters}
            brandCounts={brandCounts}
            priceRange={priceRange}
            attributeCounts={attributeCounts}
          />
        </aside>

        {/* Product grid */}
        <div className="flex-1 min-w-0">
          <ProductGrid
            products={products}
            total={total}
            currentPage={activeFilters.page ?? 1}
            pageSize={PAGE_SIZE}
          />
        </div>
      </div>
    </div>
  )
}
