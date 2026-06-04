'use client'

import { useState, useTransition, useCallback } from 'react'
import Image from 'next/image'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { Search, Check } from 'lucide-react'
import type { FilterDefinition, ActiveFilters as ActiveFiltersType, Locale, BrandFacetItem, AttributeFacetItem } from '@/types'
import FilterSection from './filter-section'
import PriceRangeFilter from './price-range-filter'

interface CatalogFiltersProps {
  filters: FilterDefinition[]
  activeFilters: ActiveFiltersType
  brandCounts: BrandFacetItem[]
  priceRange: { min: number; max: number; availableMin?: number; availableMax?: number; buckets?: number[] | undefined }
  attributeCounts: Record<string, AttributeFacetItem[]>
}

export default function CatalogFilters({
  filters,
  activeFilters,
  brandCounts,
  priceRange,
  attributeCounts,
}: CatalogFiltersProps) {
  const t = useTranslations('catalog')
  const locale = useLocale() as Locale
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  // Apply a filter change to URL
  const applyFilter = useCallback((key: string, value: string | string[] | number | boolean | undefined) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value === undefined || value === '' || (Array.isArray(value) && value.length === 0)) {
      params.delete(key)
    } else if (typeof value === 'boolean') {
      if (value) {
        params.set(key, '1')
      } else {
        params.delete(key)
      }
    } else if (Array.isArray(value)) {
      params.set(key, value.join(','))
    } else {
      params.set(key, String(value))
    }

    // Reset to page 1 on filter change
    params.delete('page')
    const qs = params.toString()
    startTransition(() => {
      router.replace(`${pathname}${qs ? `?${qs}` : ''}` as never, { scroll: false })
    })
  }, [searchParams, pathname, router, startTransition])

  // Toggle a value in an array-based filter
  const toggleArrayFilter = useCallback((key: string, value: string) => {
    const current = (activeFilters[key] as string[] | undefined) ?? []
    const next = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value]
    applyFilter(key, next)
  }, [activeFilters, applyFilter])

  return (
    <div
      className={[
        'border border-border bg-surface-white rounded-lg overflow-hidden transition-opacity duration-200',
        isPending ? 'opacity-60' : 'opacity-100',
      ].join(' ')}
    >
      {/* In stock toggle */}
      <div
        className="px-4 py-3 flex items-center justify-between cursor-pointer transition-colors hover:bg-surface-alt border-b border-border"
        onClick={() => applyFilter('inStock', !activeFilters.inStock)}
      >
        <span className="text-[13px] font-semibold text-text-primary">
          {t('inStock')}
        </span>
        <div
          className={[
            'w-9 h-5 rounded-full relative transition-colors cursor-pointer',
            activeFilters.inStock ? 'bg-accent' : 'bg-border',
          ].join(' ')}
        >
          <div
            className={[
              'absolute top-0.5 size-4 rounded-full bg-white shadow-sm transition-transform',
              activeFilters.inStock ? 'translate-x-[18px]' : 'translate-x-[2px]',
            ].join(' ')}
          />
        </div>
      </div>

      {/* Dynamic filter sections */}
      {filters.map((filter) => {
        if (filter.key === 'price' && filter.type === 'range') {
          return (
            <FilterSection
              key={filter.key}
              title={filter.label[locale]}
            >
              <PriceRangeFilter
                key={`${priceRange.min}-${priceRange.max}-${activeFilters.priceMin ?? ''}-${activeFilters.priceMax ?? ''}`}
                min={priceRange.min}
                max={priceRange.max}
                availableMin={priceRange.availableMin}
                availableMax={priceRange.availableMax}
                currentMin={activeFilters.priceMin as number | undefined}
                currentMax={activeFilters.priceMax as number | undefined}
                buckets={priceRange.buckets}
                onChange={(min, max) => {
                  const params = new URLSearchParams(searchParams.toString())
                  if (min > priceRange.min) {
                    params.set('priceMin', String(min))
                  } else {
                    params.delete('priceMin')
                  }
                  if (max < priceRange.max) {
                    params.set('priceMax', String(max))
                  } else {
                    params.delete('priceMax')
                  }
                  params.delete('page')
                  const qs = params.toString()
                  startTransition(() => {
                    router.replace(`${pathname}${qs ? `?${qs}` : ''}` as never, { scroll: false })
                  })
                }}
              />
            </FilterSection>
          )
        }

        if (filter.key === 'brand' && filter.type === 'checkbox') {
          return (
            <CheckboxFilter
              key={filter.key}
              title={filter.label[locale]}
              items={brandCounts.map(b => ({
                value: b.brand,
                label: b.label ?? b.brand,
                count: b.count,
                disabled: b.disabled,
                selected: b.selected,
                logo: b.logo,
              }))}
              selected={(activeFilters.brand as string[] | undefined) ?? []}
              searchable={filter.searchable ?? false}
              onToggle={(value) => toggleArrayFilter('brand', value)}
              searchPlaceholder={t('search')}
              showMoreText={t('showMore')}
              showLessText={t('showLess')}
            />
          )
        }

        if (filter.type === 'checkbox') {
          const counts = attributeCounts[filter.key] ?? []
          const items = filter.options
            ? filter.options.map(opt => {
                const c = counts.find(item => item.value === opt)
                return {
                  value: opt,
                  label: opt,
                  count: c?.count ?? 0,
                  disabled: c?.disabled,
                  selected: c?.selected,
                }
              })
            : counts.map(c => ({
                value: c.value,
                label: c.value,
                count: c.count,
                disabled: c.disabled,
                selected: c.selected,
              }))

          return (
            <CheckboxFilter
              key={filter.key}
              title={filter.label[locale]}
              items={items}
              selected={(activeFilters[filter.key] as string[] | undefined) ?? []}
              searchable={filter.searchable ?? false}
              onToggle={(value) => toggleArrayFilter(filter.key, value)}
              searchPlaceholder={t('search')}
              showMoreText={t('showMore')}
              showLessText={t('showLess')}
            />
          )
        }

        if (filter.type === 'pill') {
          const counts = attributeCounts[filter.key] ?? []
          const options = filter.options ?? counts.map(c => c.value)
          const selected = (activeFilters[filter.key] as string[] | undefined) ?? []

          return (
            <FilterSection
              key={filter.key}
              title={filter.label[locale]}
              count={options.length}
            >
              <div className="flex flex-wrap gap-1.5">
                {options.map((opt) => {
                  const c = counts.find(item => item.value === opt)
                  const isActive = selected.includes(opt)
                  const count = c?.count ?? 0
                  const isDisabled = c?.disabled ?? (count === 0 && !isActive)

                  return (
                    <button
                      key={opt}
                      disabled={isDisabled}
                      onClick={() => !isDisabled && toggleArrayFilter(filter.key, opt)}
                      title={isDisabled ? (locale === 'uk' ? 'Недоступно при поточних фільтрах' : 'Недоступно при текущих фильтрах') : undefined}
                      className={[
                        'px-3 py-1.5 rounded-md text-[12px] font-medium transition-all border',
                        isActive
                          ? isDisabled
                            ? 'bg-text-muted/50 text-white/70 border-text-muted/50 cursor-not-allowed opacity-50'
                            : 'bg-accent text-white border-accent cursor-pointer'
                          : isDisabled
                            ? 'bg-transparent text-text-muted border-border-strong opacity-40 cursor-not-allowed'
                            : 'bg-surface-alt text-text-primary border-border hover:border-accent hover:text-accent cursor-pointer',
                      ].join(' ')}
                    >
                      {opt}{filter.unit ? ` ${filter.unit}` : ''}{count !== undefined ? ` (${count})` : ''}
                    </button>
                  )
                })}
              </div>
            </FilterSection>
          )
        }

        return null
      })}
    </div>
  )
}

// ─── Checkbox Filter (internal) ──────────────────────────────────────────────

interface CheckboxFilterItem {
  value: string
  label: string
  count: number
  disabled?: boolean | undefined
  selected?: boolean | undefined
  logo?: string | null | undefined
}

interface CheckboxFilterProps {
  title: string
  items: CheckboxFilterItem[]
  selected: string[]
  searchable?: boolean
  onToggle: (value: string) => void
  searchPlaceholder: string
  showMoreText: string
  showLessText: string
}

function CheckboxFilter({
  title,
  items,
  selected,
  searchable,
  onToggle,
  searchPlaceholder,
  showMoreText,
  showLessText,
}: CheckboxFilterProps) {
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState(false)
  const locale = useLocale() as Locale
  const VISIBLE_COUNT = 8

  const filtered = search
    ? items.filter(item => item.label.toLowerCase().includes(search.toLowerCase()))
    : items

  const visible = expanded ? filtered : filtered.slice(0, VISIBLE_COUNT)
  const hasMore = filtered.length > VISIBLE_COUNT

  return (
    <FilterSection title={title} count={items.length}>
      {/* Search */}
      {searchable && items.length > VISIBLE_COUNT && (
        <div className="relative mb-2">
          <Search
            className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-text-muted"
            strokeWidth={1.5}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full h-8 pl-8 pr-3 rounded-md text-[12px] outline-none transition-colors border border-border bg-surface-alt text-text-primary"
          />
        </div>
      )}

      {/* Options */}
      <div className="flex flex-col gap-0.5">
        {visible.map((item) => {
          const isChecked = selected.includes(item.value)
          const isDisabled = item.disabled ?? (item.count === 0 && !isChecked)
          return (
            <label
              key={item.value}
              title={isDisabled ? (locale === 'uk' ? 'Недоступно при поточних фільтрах' : 'Недоступно при текущих фильтрах') : undefined}
              className={[
                'flex items-center gap-2.5 py-1 transition-colors',
                isDisabled
                  ? 'cursor-not-allowed text-text-muted opacity-50'
                  : 'cursor-pointer group text-text-primary',
              ].join(' ')}
            >
              <div
                className={[
                  'size-4 rounded shrink-0 flex items-center justify-center transition-colors border',
                  isChecked
                    ? isDisabled
                      ? 'bg-text-muted border-text-muted'
                      : 'bg-accent border-accent'
                    : 'border-border-strong bg-transparent',
                ].join(' ')}
              >
                {isChecked && <Check className="size-3 text-white" strokeWidth={2.5} />}
              </div>
              <input
                type="checkbox"
                className="sr-only"
                checked={isChecked}
                disabled={isDisabled}
                onChange={() => !isDisabled && onToggle(item.value)}
              />

              {/* Brand Logo / Fallback */}
              {item.logo !== undefined && (
                <div
                  className={[
                    'size-[18px] rounded flex items-center justify-center text-[10px] font-bold select-none overflow-hidden shrink-0 border transition-all',
                    isChecked
                      ? 'bg-accent/10 border-accent/30 text-accent font-extrabold'
                      : 'bg-surface-alt border-border text-text-muted',
                    isDisabled ? 'opacity-40 grayscale' : '',
                  ].join(' ')}
                >
                  {item.logo ? (
                    <Image
                      src={item.logo}
                      alt={item.label}
                      width={18}
                      height={18}
                      className="size-full object-contain"
                      unoptimized
                    />
                  ) : (
                    <span>{item.label.charAt(0).toUpperCase()}</span>
                  )}
                </div>
              )}

              <span className={[
                'flex-1 text-[12px] transition-colors',
                isDisabled ? '' : 'group-hover:text-accent'
              ].join(' ')}>
                {item.label}
              </span>
              <span className="text-[11px] text-text-muted">
                ({item.count})
              </span>
            </label>
          )
        })}
      </div>

      {/* Show more */}
      {hasMore && !search && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-2 text-[12px] font-medium cursor-pointer transition-colors hover:underline text-accent"
        >
          {expanded ? showLessText : `${showMoreText} (${filtered.length - VISIBLE_COUNT})`}
        </button>
      )}
    </FilterSection>
  )
}
