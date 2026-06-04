'use client'

import { useTransition } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { LayoutGrid, List, SlidersHorizontal, ChevronDown } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useUIStore } from '@/store/ui-store'

type SortValue = 'popular' | 'price-asc' | 'price-desc' | 'new' | 'rating'

interface CatalogToolbarProps {
  total: number
  currentSort?: SortValue | undefined
  activeFiltersCount: number
}

const SORTS: { value: SortValue; labelKey: string }[] = [
  { value: 'popular',    labelKey: 'sort.popular' },
  { value: 'price-asc',  labelKey: 'sort.priceAsc' },
  { value: 'price-desc', labelKey: 'sort.priceDesc' },
  { value: 'new',        labelKey: 'sort.new' },
]

export default function CatalogToolbar({
  total,
  currentSort = 'popular',
  activeFiltersCount,
}: CatalogToolbarProps) {
  const t = useTranslations('catalog')
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const openMobileFilters = useUIStore((s) => s.openMobileFilters)
  const view = searchParams.get('view') === 'list' ? 'list' : 'grid'

  function setView(newView: 'grid' | 'list') {
    const params = new URLSearchParams(searchParams.toString())
    if (newView === 'grid') {
      params.delete('view')
    } else {
      params.set('view', 'list')
    }
    const qs = params.toString()
    startTransition(() => {
      router.replace(`${pathname}${qs ? `?${qs}` : ''}` as never, { scroll: false })
    })
  }

  function setSort(sort: SortValue) {
    const params = new URLSearchParams(searchParams.toString())
    if (sort === 'popular') {
      params.delete('sort')
    } else {
      params.set('sort', sort)
    }
    params.delete('page')
    const qs = params.toString()
    startTransition(() => {
      router.replace(`${pathname}${qs ? `?${qs}` : ''}` as never, { scroll: false })
    })
  }

  return (
    <div
      className={[
        'flex items-center gap-3 mt-3 py-2.5 px-3 rounded-lg bg-surface-white border border-border',
        'transition-opacity',
        isPending ? 'opacity-60' : '',
      ].join(' ')}
    >
      {/* Mobile: filter button */}
      <button
        id="mobile-filter-open-btn"
        onClick={openMobileFilters}
        className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium border border-border text-text-primary hover:border-accent hover:text-accent transition-colors shrink-0"
      >
        <SlidersHorizontal className="size-4" />
        <span>{t('filters.title')}</span>
        {activeFiltersCount > 0 && (
          <span className="bg-accent text-white text-[11px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
            {activeFiltersCount}
          </span>
        )}
      </button>

      {/* Found count */}
      <span className="text-sm text-text-muted shrink-0 hidden sm:block">
        {t('foundCount', { count: total })}
      </span>

      <div className="flex-1" />

      {/* Sort — desktop dropdown-style */}
      <div className="relative hidden sm:block">
        <select
          id="catalog-sort-select"
          value={currentSort}
          onChange={(e) => setSort(e.target.value as SortValue)}
          className="appearance-none pl-3 pr-8 py-1.5 rounded-md text-sm border border-border bg-surface-white text-text-primary cursor-pointer outline-none focus:border-accent transition-colors"
        >
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>
              {t(s.labelKey)}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 size-4 text-text-muted" />
      </div>

      {/* Sort — mobile compact */}
      <select
        value={currentSort}
        onChange={(e) => setSort(e.target.value as SortValue)}
        className="sm:hidden appearance-none px-2 py-1.5 rounded-md text-sm border border-border bg-surface-white text-text-primary cursor-pointer outline-none"
      >
        {SORTS.map((s) => (
          <option key={s.value} value={s.value}>
            {t(s.labelKey)}
          </option>
        ))}
      </select>

      {/* View switcher — desktop only */}
      <div className="hidden lg:flex items-center gap-1 border border-border rounded-md overflow-hidden">
        <button
          onClick={() => setView('grid')}
          className={[
            'p-1.5 transition-colors',
            view === 'grid' ? 'bg-accent text-white' : 'text-text-muted hover:text-accent',
          ].join(' ')}
          aria-label="Grid view"
        >
          <LayoutGrid className="size-4" />
        </button>
        <button
          onClick={() => setView('list')}
          className={[
            'p-1.5 transition-colors',
            view === 'list' ? 'bg-accent text-white' : 'text-text-muted hover:text-accent',
          ].join(' ')}
          aria-label="List view"
        >
          <List className="size-4" />
        </button>
      </div>
    </div>
  )
}
