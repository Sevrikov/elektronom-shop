import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { connection } from 'next/server'
import { isValidLocale } from '@/i18n/request'
import { parseCatalogSearchParams, extractAttributeFilters } from '@/lib/catalog-filter-url'
import { getCategoryFilterConfig, QuickLink } from '@/lib/catalog-filter-config'
import { getCategoryFacets } from '@/queries/categories'
import { getFilteredProducts } from '@/queries/products'
import { getCategoryBySlug, enrichQuickLinks } from '@/queries/categories'
import type { Locale, BrandFacetItem, AttributeFacetItem } from '@/types'
import Breadcrumbs from '@/components/layout/breadcrumbs'
import CatalogFilters from '@/components/catalog/catalog-filters'
import ActiveFilters from '@/components/catalog/active-filters'
import ProductGrid from '@/components/catalog/product-grid'
import CategoryQuickLinks from '@/components/catalog/category-quick-links'
import CatalogToolbar from '@/components/catalog/catalog-toolbar'
import CategoryTreeFilter from '@/components/catalog/category-tree-filter'
import { CategoryArticles } from '@/components/blog/category-articles'
import { getSiteUrl } from '@/lib/utils'
import { AnswerBlock } from '@/components/seo/answer-block'
import { Suspense } from 'react'
import DeferredMobileFilterDrawer from '@/components/catalog/deferred-mobile-filter-drawer'

const DEFAULT_PAGE_SIZE = 48

// Check if active filters match exactly one quick link and no other indexable filters
export function getMatchingQuickLink(
  slug: string,
  activeFilters: ReturnType<typeof parseCatalogSearchParams>
): QuickLink | null {
  const config = getCategoryFilterConfig(slug)
  if (!config.quickLinks || config.quickLinks.length === 0) return null

  // Extract all active filter keys that are NOT page, sort, or price
  const activeKeys = Object.entries(activeFilters).filter(([key, value]) => {
    if (['page', 'sort', 'priceMin', 'priceMax', 'inStock'].includes(key)) return false
    if (Array.isArray(value) && value.length === 0) return false
    return value !== undefined && value !== null
  })

  // We only whitelist single-filter combinations (e.g., brand=abb or poles=1P)
  if (activeKeys.length !== 1) return null

  const [activeKey, activeVal] = activeKeys[0]!
  const activeValues = Array.isArray(activeVal) ? activeVal : [activeVal]
  if (activeValues.length !== 1) return null
  const singleValue = String(activeValues[0]).toLowerCase()

  // Find matching quickLink
  for (const ql of config.quickLinks) {
    if (ql.filter && ql.filter.key === activeKey && ql.filter.value.toLowerCase() === singleValue) {
      return ql
    }
  }

  return null
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; slug: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isValidLocale(locale)) return {}
  const category = await getCategoryBySlug(slug, locale)
  if (!category) return {}

  const sp = await searchParams
  const activeFilters = parseCatalogSearchParams(sp)
  const matchingQuickLink = getMatchingQuickLink(slug, activeFilters)

  const t = await getTranslations({ locale, namespace: 'catalog' })
  const categoryName = category.translations[0]?.name ?? slug
  const baseUrl = getSiteUrl()

  // 1. If there's a matching whitelisted quick link
  if (matchingQuickLink) {
    const qlLabel = matchingQuickLink.label[locale as 'uk' | 'ru']
    const filterKey = matchingQuickLink.filter!.key
    const filterVal = matchingQuickLink.filter!.value
    return {
      title: `${qlLabel} — купити в Electronom`,
      description: locale === 'ru' 
        ? `Купить ${qlLabel} в интернет-магазине Electronom. Большой выбор, officialная гарантия, быстрая доставка по Украине.`
        : `Купити ${qlLabel} в інтернет-магазині Electronom. Великий вибір, офіційна гарантія, швидка доставка по Україні.`,
      alternates: {
        canonical: `${baseUrl}/${locale}/catalog/${slug}?${filterKey}=${filterVal}`,
      },
      robots: { index: true, follow: true },
    }
  }

  // 2. If there are active filters but NOT whitelisted
  const hasActiveFilters = Object.entries(activeFilters).some(([key, val]) => {
    if (['page', 'sort'].includes(key)) return false // page/sort doesn't trigger noindex
    if (Array.isArray(val)) return val.length > 0
    return val !== undefined && val !== null
  })

  if (hasActiveFilters) {
    return {
      title: `${categoryName} — фільтрація товарів | Electronom`,
      description: category.translations[0]?.metaDesc ?? t('metaDescription', { category: categoryName }),
      alternates: {
        canonical: `${baseUrl}/${locale}/catalog/${slug}`,
      },
      robots: { index: false, follow: true },
    }
  }

  // 3. Main category page (no filters applied)
  return {
    title: category.translations[0]?.metaTitle ?? t('metaTitle', { category: categoryName }),
    description: category.translations[0]?.metaDesc ?? t('metaDescription', { category: categoryName }),
    alternates: {
      canonical: `${baseUrl}/${locale}/catalog/${slug}`,
      languages: {
        uk: `${baseUrl}/uk/catalog/${slug}`,
        ru: `${baseUrl}/ru/catalog/${slug}`,
        'x-default': `${baseUrl}/uk/catalog/${slug}`,
      },
    },
    robots: { index: true, follow: true },
  }
}

// ─── Filters Skeleton ────────────────────────────────────────────────────────
const FiltersSkeleton = () => (
  <div className="w-full flex flex-col gap-6 animate-pulse">
    <div className="h-40 bg-surface-white border border-border rounded-xl p-4 flex flex-col gap-3">
      <div className="h-4 bg-gray-200 rounded w-1/3" />
      <div className="h-6 bg-gray-100 rounded" />
      <div className="h-6 bg-gray-100 rounded" />
      <div className="h-6 bg-gray-100 rounded" />
    </div>
    <div className="h-60 bg-surface-white border border-border rounded-xl p-4 flex flex-col gap-3">
      <div className="h-4 bg-gray-200 rounded w-1/2" />
      <div className="h-6 bg-gray-100 rounded" />
      <div className="h-6 bg-gray-100 rounded" />
      <div className="h-6 bg-gray-100 rounded" />
      <div className="h-6 bg-gray-100 rounded" />
    </div>
  </div>
)

// ─── Deferred Active Filters Chips ───────────────────────────────────────────
async function DeferredActiveFilters({
  slug,
  activeFilters,
  attributeFilters,
  locale,
}: {
  slug: string
  activeFilters: ReturnType<typeof parseCatalogSearchParams>
  attributeFilters: Record<string, string[]>
  locale: string
}) {
  const facets = await getCategoryFacets({
    categorySlug: slug,
    activeFilters,
    locale: locale as 'uk' | 'ru',
  })
  const t = await getTranslations({ locale, namespace: 'catalog' })
  const filterConfig = getCategoryFilterConfig(slug)

  const pills: { key: string; label: string; value: string; displayValue: string }[] = []

  const priceRange = {
    min: facets.price.absoluteMin,
    max: facets.price.absoluteMax,
  }

  for (const brandSlug of activeFilters.brand ?? []) {
    pills.push({
      key: 'brand',
      label: t('filters.brand'),
      value: brandSlug,
      displayValue: facets.brands.find((b) => b.value === brandSlug)?.label ?? brandSlug,
    })
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
  for (const [key, values] of Object.entries(attributeFilters)) {
    const labelMap = filterConfig.labels?.[key]
    const label = labelMap?.[locale as Locale] ?? key
    for (const v of values) {
      const unit = filterConfig.units?.[key] ? ` ${filterConfig.units[key]}` : ''
      pills.push({ key, label, value: v, displayValue: `${label}: ${v}${unit}` })
    }
  }

  if (pills.length === 0) return null

  return (
    <div className="mt-3">
      <ActiveFilters pills={pills} />
    </div>
  )
}

// ─── Deferred Sidebar & Mobile Drawer Filters ────────────────────────────────
async function DeferredFiltersSection({
  slug,
  activeFilters,
  attributeFilters,
  locale,
  total,
}: {
  slug: string
  activeFilters: ReturnType<typeof parseCatalogSearchParams>
  attributeFilters: Record<string, string[]>
  locale: string
  total: number
}) {
  const facets = await getCategoryFacets({
    categorySlug: slug,
    activeFilters,
    locale: locale as 'uk' | 'ru',
  })

  const filterConfig = getCategoryFilterConfig(slug)

  const attributeCounts: Record<string, AttributeFacetItem[]> = {}
  for (const [key, options] of Object.entries(facets.attributes)) {
    attributeCounts[key] = options.map((o) => ({
      value: o.value,
      count: o.count,
      disabled: o.disabled,
      selected: o.selected,
    }))
  }

  const brandCounts: BrandFacetItem[] = facets.brands.map((b) => ({
    brand: b.value,
    label: b.label,
    count: b.count,
    disabled: b.disabled,
    selected: b.selected,
    logo: b.logo ?? null,
  }))

  const priceRange = {
    min: facets.price.absoluteMin,
    max: facets.price.absoluteMax,
    availableMin: facets.price.availableMin,
    availableMax: facets.price.availableMax,
    buckets: facets.price.buckets,
  }

  const filters = filterConfig.order
    .map((key) => {
      if (key === 'price') {
        return { key: 'price', type: 'range' as const, label: { uk: 'Ціна, ₴', ru: 'Цена, ₴' } }
      }
      if (key === 'brand') {
        return { key: 'brand', type: 'checkbox' as const, label: { uk: 'Бренд', ru: 'Бренд' }, searchable: true }
      }
      if (key === 'inStock') return null
      const labelDef = filterConfig.labels?.[key] ?? { uk: key, ru: key }
      const unit = filterConfig.units?.[key]
      const options = (facets.attributes[key] ?? []).map(o => o.value)
      const searchable = filterConfig.searchable?.includes(key) ?? false
      return {
        key,
        type: options.length <= 10 ? 'pill' as const : 'checkbox' as const,
        label: labelDef,
        options,
        unit,
        searchable,
      }
    })
    .filter((f): f is Exclude<typeof f, null> => f !== null)

  return (
    <>
      <CatalogFilters
        filters={filters}
        activeFilters={activeFilters}
        brandCounts={brandCounts}
        priceRange={priceRange}
        attributeCounts={attributeCounts}
      />
      <DeferredMobileFilterDrawer
        filters={filters}
        activeFilters={activeFilters}
        brandCounts={brandCounts}
        priceRange={priceRange}
        attributeCounts={attributeCounts}
        total={total}
      />
    </>
  )
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; slug: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  await connection() // Opt out of prerendering (dynamic per-request)
  const { locale, slug } = await params
  setRequestLocale(locale)
  const sp = await searchParams
  const category = await getCategoryBySlug(slug, locale)

  if (!category) notFound()

  const t = await getTranslations({ locale, namespace: 'catalog' })
  const categoryName = category.translations[0]?.name ?? slug

  // ─── Parse URL ──────────────────────────────────────────────────────────────
  const activeFilters = parseCatalogSearchParams(sp)
  const attributeFilters = extractAttributeFilters(activeFilters)
  const pageSize = activeFilters.limit ?? DEFAULT_PAGE_SIZE

  // ─── Fetch fast grid data immediately ────────────────────────────────────────
  const { products, total } = await getFilteredProducts({
    categorySlug: slug,
    brandSlugs: activeFilters.brand,
    priceMin: activeFilters.priceMin,
    priceMax: activeFilters.priceMax,
    inStock: activeFilters.inStock,
    sort: activeFilters.sort,
    page: activeFilters.page,
    pageSize,
    attributes: attributeFilters,
    locale,
  })

  // ─── Filter config ──────────────────────────────────────────────────────────
  const filterConfig = getCategoryFilterConfig(slug)
  const quickLinks = await enrichQuickLinks(slug, filterConfig.quickLinks)

  // Calculate active filters count directly from activeFilters object without facets
  const activeFiltersCount =
    (activeFilters.brand?.length ?? 0) +
    (activeFilters.priceMin !== undefined || activeFilters.priceMax !== undefined ? 1 : 0) +
    (activeFilters.inStock ? 1 : 0) +
    Object.values(attributeFilters).reduce((acc, val) => acc + val.length, 0)

  // ─── Whitelisted scenario landing checks ────────────────────────────────────
  const matchingQuickLink = getMatchingQuickLink(slug, activeFilters)
  const displayTitle = matchingQuickLink
    ? matchingQuickLink.label[locale as 'uk' | 'ru']
    : categoryName

  // ─── Breadcrumbs ────────────────────────────────────────────────────────────
  const breadcrumbs = [
    { name: t('breadcrumbs.home'), url: '/' },
    { name: t('breadcrumbs.catalog'), url: '/catalog' },
    ...(category.parent
      ? [{
          name: category.parent.translations[0]?.name ?? category.parent.slug,
          url: `/catalog/${category.parent.slug}`,
        }]
      : []),
    matchingQuickLink
      ? { name: categoryName, url: `/catalog/${slug}` }
      : { name: categoryName },
    ...(matchingQuickLink ? [{ name: displayTitle }] : []),
  ]

  return (
    <div className="bg-surface-alt min-h-screen">
      <div className="max-w-[1600px] mx-auto px-4 py-4">
        <Breadcrumbs items={breadcrumbs} locale={locale} />
      </div>

      <div className="max-w-[1600px] mx-auto px-4 pb-10">
        {/* H1 + count */}
        <div className="flex items-baseline gap-3 mt-2 mb-3">
          <h1 className="text-2xl font-bold text-text-primary">{displayTitle}</h1>
          <span className="text-sm text-text-muted">
            {t('foundCount', { count: total })}
          </span>
        </div>

        {/* Quick SEO/scenario links (under H1, above products) */}
        {quickLinks.length > 0 && (
          <CategoryQuickLinks
            links={quickLinks}
            locale={locale as Locale}
            activeFilters={activeFilters}
          />
        )}

        {/* Active filter chips (Deferred under Suspense) */}
        <Suspense fallback={null}>
          <DeferredActiveFilters
            slug={slug}
            activeFilters={activeFilters}
            attributeFilters={attributeFilters}
            locale={locale}
          />
        </Suspense>

        {/* Mobile filter button + sort toolbar */}
        <CatalogToolbar
          total={total}
          currentSort={activeFilters.sort}
          activeFiltersCount={activeFiltersCount}
        />

        {/* Main layout: sidebar + grid */}
        <div className="flex gap-6 items-start mt-4">
          {/* Desktop sidebar */}
          <aside className="hidden lg:flex flex-col gap-4 w-[280px] shrink-0 sticky top-[72px] self-start">
            {/* Attribute filters (Deferred under Suspense) */}
            <Suspense fallback={<FiltersSkeleton />}>
              <DeferredFiltersSection
                slug={slug}
                activeFilters={activeFilters}
                attributeFilters={attributeFilters}
                locale={locale}
                total={total}
              />
            </Suspense>

            {/* Category tree */}
            {(category.children.length > 0 || category.parent) && (
              <CategoryTreeFilter
                currentSlug={slug}
                parent={category.parent ?? null}
                childCategories={category.children}
                locale={locale as Locale}
              />
            )}
          </aside>

          {/* Product grid */}
          <div className="flex-1 min-w-0">
            <ProductGrid
              products={products}
              total={total}
              currentPage={activeFilters.page ?? 1}
              pageSize={pageSize}
            />

            {/* Laptop/Tablet/Mobile: Answer Block + Description + Articles (shown only on screens < 1700px) */}
            <div className="catalog-answer-inline mt-10 flex flex-col gap-8">
              <AnswerBlock
                categorySlug={slug}
                locale={locale}
                matchingQuickLink={matchingQuickLink}
                layout="sidebar"
              />

              {category.translations[0]?.description && (
                <section className="p-6 bg-surface-white border border-border rounded-2xl text-text-muted">
                  <h2 className="text-xl font-bold text-text-primary mb-3">
                    {locale === 'uk' ? `Про категорію ${categoryName}` : `О категории ${categoryName}`}
                  </h2>
                  <div className="text-sm leading-relaxed whitespace-pre-line">
                    {category.translations[0].description}
                  </div>
                </section>
              )}

              <CategoryArticles categorySlug={slug} locale={locale} layout="grid" />
            </div>
          </div>

          {/* Desktop Right sidebar (Quick Info + Description + Articles) */}
          <aside className="catalog-answer-sidebar w-[300px] shrink-0 sticky top-[72px] self-start flex flex-col gap-6 max-h-[calc(100vh-100px)] overflow-y-auto pr-1 sidebar-scroll">
            <AnswerBlock
              categorySlug={slug}
              locale={locale}
              matchingQuickLink={matchingQuickLink}
              layout="sidebar"
            />

            {category.translations[0]?.description && (
              <section className="p-5 bg-surface-white border border-border rounded-2xl text-text-muted">
                <h2 className="text-sm font-bold text-text-primary mb-2">
                  {locale === 'uk' ? `Про категорію ${categoryName}` : `О категории ${categoryName}`}
                </h2>
                <div className="text-[12px] leading-relaxed whitespace-pre-line">
                  {category.translations[0].description}
                </div>
              </section>
            )}

            <CategoryArticles categorySlug={slug} locale={locale} layout="sidebar" />
          </aside>
        </div>
      </div>
    </div>
  )
}
