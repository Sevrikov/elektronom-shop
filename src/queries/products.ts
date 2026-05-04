import type { ActiveFilters, CatalogProduct } from '@/types'
import { catalogProducts } from '@/lib/catalog-data'

const PAGE_SIZE = 12

/** Filter, sort and paginate products */
export function getFilteredProducts(
  categorySlug: string,
  filters: ActiveFilters,
): { products: CatalogProduct[]; total: number } {
  let filtered = catalogProducts.filter(p => p.categorySlug === categorySlug)

  // Brand filter
  if (filters.brand && filters.brand.length > 0) {
    filtered = filtered.filter(p => filters.brand!.includes(p.brand))
  }

  // Price filter
  if (filters.priceMin !== undefined) {
    filtered = filtered.filter(p => p.price >= filters.priceMin!)
  }
  if (filters.priceMax !== undefined) {
    filtered = filtered.filter(p => p.price <= filters.priceMax!)
  }

  // In stock filter
  if (filters.inStock) {
    filtered = filtered.filter(p => p.stock > 0)
  }

  // Dynamic attribute filters
  for (const [key, value] of Object.entries(filters)) {
    if (['brand', 'priceMin', 'priceMax', 'sort', 'page', 'inStock'].includes(key)) continue
    if (Array.isArray(value) && value.length > 0) {
      filtered = filtered.filter(p => value.includes(p.attributes[key] ?? ''))
    }
  }

  const total = filtered.length

  // Sort
  switch (filters.sort) {
    case 'price-asc':
      filtered.sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      filtered.sort((a, b) => b.price - a.price)
      break
    case 'new':
      filtered.sort((a, b) => b.id.localeCompare(a.id))
      break
    case 'rating':
      filtered.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
      break
    default: // popular
      filtered.sort((a, b) => (b.reviewsCount ?? 0) - (a.reviewsCount ?? 0))
  }

  // Paginate
  const page = filters.page ?? 1
  const start = (page - 1) * PAGE_SIZE
  const paginated = filtered.slice(start, start + PAGE_SIZE)

  return { products: paginated, total }
}

/** Parse searchParams into ActiveFilters */
export function parseSearchParams(sp: Record<string, string | string[] | undefined>): ActiveFilters {
  const filters: ActiveFilters = {}

  if (sp.brand) {
    const val = typeof sp.brand === 'string' ? sp.brand : sp.brand[0]
    if (val) filters.brand = val.split(',')
  }
  if (sp.priceMin) filters.priceMin = Number(sp.priceMin)
  if (sp.priceMax) filters.priceMax = Number(sp.priceMax)
  if (sp.sort) filters.sort = sp.sort as 'popular' | 'price-asc' | 'price-desc' | 'new' | 'rating'
  if (sp.page) filters.page = Number(sp.page)
  if (sp.inStock === '1') filters.inStock = true

  // Dynamic attribute filters (anything else in searchParams)
  for (const [key, value] of Object.entries(sp)) {
    if (['brand', 'priceMin', 'priceMax', 'sort', 'page', 'inStock'].includes(key)) continue
    if (value) {
      const val = typeof value === 'string' ? value : value[0]
      if (val) filters[key] = val.split(',')
    }
  }

  return filters
}
