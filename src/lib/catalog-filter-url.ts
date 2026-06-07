// src/lib/catalog-filter-url.ts
// URL helpers for catalog filter state (TZ §7.2)
// Centralises all query-param logic so it is NOT spread across components.

import type { ActiveFilters } from '@/types'

export const CATALOG_PAGE_SIZE_OPTIONS = [48, 96, 192] as const
export const DEFAULT_PAGE_SIZE = 48

/** Keys that are not dynamic attribute filters */
const RESERVED_KEYS = new Set(['brand', 'priceMin', 'priceMax', 'inStock', 'sort', 'page', 'view', 'limit'])

const VALID_SORTS = ['popular', 'price-asc', 'price-desc', 'new', 'rating'] as const
type SortValue = (typeof VALID_SORTS)[number]

// ─── Parse ───────────────────────────────────────────────────────────────────

/**
 * Parse URLSearchParams / Next.js searchParams into a typed ActiveFilters object.
 * Accepts comma-separated multi-values (brand=castrol,shell).
 * Ignores empty strings and unknown sort values.
 */
export function parseCatalogSearchParams(
  sp: Record<string, string | string[] | undefined>
): ActiveFilters {
  const filters: ActiveFilters = {}

  // brand — multi-select, comma-separated
  const rawBrand = sp['brand']
  if (rawBrand) {
    const flat = Array.isArray(rawBrand) ? rawBrand.join(',') : rawBrand
    const values = flat.split(',').map((v) => v.trim()).filter(Boolean)
    if (values.length > 0) filters.brand = values
  }

  // price
  const rawPriceMin = sp['priceMin']
  if (rawPriceMin) {
    const n = Number(Array.isArray(rawPriceMin) ? rawPriceMin[0] : rawPriceMin)
    if (!isNaN(n)) filters.priceMin = n
  }
  const rawPriceMax = sp['priceMax']
  if (rawPriceMax) {
    const n = Number(Array.isArray(rawPriceMax) ? rawPriceMax[0] : rawPriceMax)
    if (!isNaN(n)) filters.priceMax = n
  }

  // Normalise: priceMin must be <= priceMax
  if (
    filters.priceMin !== undefined &&
    filters.priceMax !== undefined &&
    filters.priceMin > filters.priceMax
  ) {
    ;[filters.priceMin, filters.priceMax] = [filters.priceMax, filters.priceMin]
  }

  // inStock — accept "1" / "true"
  const rawInStock = sp['inStock']
  if (rawInStock === '1' || rawInStock === 'true') filters.inStock = true

  // page — positive integer only
  const rawPage = sp['page']
  if (rawPage) {
    const n = parseInt(Array.isArray(rawPage) ? rawPage[0]! : rawPage, 10)
    if (!isNaN(n) && n > 0) filters.page = n
  }

  // limit — positive integer, must be one of CATALOG_PAGE_SIZE_OPTIONS
  const rawLimit = sp['limit']
  if (rawLimit) {
    const n = parseInt(Array.isArray(rawLimit) ? rawLimit[0]! : rawLimit, 10)
    if (!isNaN(n) && (CATALOG_PAGE_SIZE_OPTIONS as readonly number[]).includes(n)) {
      filters.limit = n
    }
  }

  // sort — whitelist
  const rawSort = sp['sort']
  const sortVal = Array.isArray(rawSort) ? rawSort[0] : rawSort
  if (sortVal && VALID_SORTS.includes(sortVal as SortValue)) {
    filters.sort = sortVal as SortValue
  }

  // Dynamic attribute filters — everything else, comma-separated
  for (const [key, raw] of Object.entries(sp)) {
    if (RESERVED_KEYS.has(key) || raw === undefined) continue
    const flat = Array.isArray(raw) ? raw.join(',') : raw
    const values = flat.split(',').map((v) => v.trim()).filter(Boolean)
    if (values.length > 0) filters[key] = values
  }

  return filters
}

// ─── Build ───────────────────────────────────────────────────────────────────

/**
 * Serialise ActiveFilters back to a sorted, clean URLSearchParams string.
 * Arrays are comma-joined. Empty values are omitted.
 * Parameter order is stabilised for canonical URLs.
 */
export function buildCatalogHref(pathname: string, filters: ActiveFilters): string {
  const params = new URLSearchParams()

  // Stable order: brand, priceMin, priceMax, inStock, sort, page, limit, then attributes
  if (filters.brand?.length) params.set('brand', filters.brand.join(','))
  if (filters.priceMin !== undefined) params.set('priceMin', String(filters.priceMin))
  if (filters.priceMax !== undefined) params.set('priceMax', String(filters.priceMax))
  if (filters.inStock) params.set('inStock', '1')
  if (filters.sort) params.set('sort', filters.sort)
  if (filters.page && filters.page > 1) params.set('page', String(filters.page))
  if (filters.limit !== undefined && filters.limit !== DEFAULT_PAGE_SIZE) params.set('limit', String(filters.limit))

  // Dynamic attributes (everything else)
  for (const [key, value] of Object.entries(filters)) {
    if (RESERVED_KEYS.has(key)) continue
    if (Array.isArray(value) && value.length > 0) {
      params.set(key, value.join(','))
    }
  }

  const qs = params.toString()
  return qs ? `${pathname}?${qs}` : pathname
}

// ─── Mutations ───────────────────────────────────────────────────────────────

/**
 * Toggle a single value in an array-based filter.
 * Resets page to 1 on every filter change.
 */
export function toggleMultiValueFilter(
  filters: ActiveFilters,
  key: string,
  value: string
): ActiveFilters {
  const current = (filters[key] as string[] | undefined) ?? []
  const next = current.includes(value)
    ? current.filter((v) => v !== value)
    : [...current, value]
  const updated = { ...filters }
  if (next.length > 0) {
    updated[key] = next
  } else {
    delete updated[key]
  }
  delete updated.page
  return updated
}

/**
 * Remove a single value from a filter key.
 * If the value was the last one for that key, removes the key entirely.
 */
export function removeFilter(filters: ActiveFilters, key: string, value?: string): ActiveFilters {
  const updated = { ...filters }
  delete updated.page

  if (key === 'priceMin' || key === 'priceMax') {
    delete updated.priceMin
    delete updated.priceMax
    return updated
  }

  if (key === 'inStock') {
    delete updated.inStock
    return updated
  }

  if (!value) {
    delete updated[key]
    return updated
  }

  const current = (updated[key] as string[] | undefined) ?? []
  const next = current.filter((v) => v !== value)
  if (next.length > 0) {
    updated[key] = next
  } else {
    delete updated[key]
  }
  return updated
}

/**
 * Clear all filters but keep sort.
 */
export function clearFiltersPreserveSort(filters: ActiveFilters): ActiveFilters {
  return filters.sort ? { sort: filters.sort } : {}
}

// ─── Attribute extraction ────────────────────────────────────────────────────

/**
 * Extract only dynamic attribute filters (not brand/price/inStock/sort/page).
 * Used to pass attributes to getFilteredProducts().
 */
export function extractAttributeFilters(
  activeFilters: ActiveFilters
): Record<string, string[]> {
  const attrs: Record<string, string[]> = {}
  for (const [key, value] of Object.entries(activeFilters)) {
    if (RESERVED_KEYS.has(key)) continue
    if (Array.isArray(value) && value.length > 0) {
      attrs[key] = value
    }
  }
  return attrs
}
