'use client'

import { useState, useTransition, useCallback } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { Search, Check } from 'lucide-react'
import type { FilterDefinition, ActiveFilters as ActiveFiltersType, Locale } from '@/types'
import FilterSection from './filter-section'
import PriceRangeFilter from './price-range-filter'

interface CatalogFiltersProps {
  filters: FilterDefinition[]
  activeFilters: ActiveFiltersType
  brandCounts: { brand: string; count: number }[]
  priceRange: { min: number; max: number }
  attributeCounts: Record<string, { value: string; count: number }[]>
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
      className="rounded-lg overflow-hidden"
      style={{
        border: '1px solid var(--color-border)',
        background: '#fff',
        opacity: isPending ? 0.6 : 1,
        transition: 'opacity 200ms',
      }}
    >
      {/* In stock toggle */}
      <div
        className="px-4 py-3 flex items-center justify-between cursor-pointer transition-colors hover:bg-[var(--color-surface-alt)]"
        style={{ borderBottom: '1px solid var(--color-border)' }}
        onClick={() => applyFilter('inStock', !activeFilters.inStock)}
      >
        <span className="text-[13px] font-semibold" style={{ color: 'var(--color-text-primary)' }}>
          {t('inStock')}
        </span>
        <div
          className="w-9 h-5 rounded-full relative transition-colors cursor-pointer"
          style={{
            background: activeFilters.inStock ? 'var(--color-accent)' : 'var(--color-border)',
          }}
        >
          <div
            className="absolute top-0.5 size-4 rounded-full bg-white shadow-sm transition-transform"
            style={{
              transform: activeFilters.inStock ? 'translateX(18px)' : 'translateX(2px)',
            }}
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
                min={priceRange.min}
                max={priceRange.max}
                currentMin={activeFilters.priceMin as number | undefined}
                currentMax={activeFilters.priceMax as number | undefined}
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
              items={brandCounts.map(b => ({ value: b.brand, label: b.brand, count: b.count }))}
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
            ? filter.options.map(opt => ({
                value: opt,
                label: opt,
                count: counts.find(c => c.value === opt)?.count ?? 0,
              }))
            : counts.map(c => ({ value: c.value, label: c.value, count: c.count }))

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
                  const isActive = selected.includes(opt)
                  const count = counts.find(c => c.value === opt)?.count
                  return (
                    <button
                      key={opt}
                      onClick={() => toggleArrayFilter(filter.key, opt)}
                      className="px-3 py-1.5 rounded-md text-[12px] font-medium cursor-pointer transition-all"
                      style={{
                        background: isActive ? 'var(--color-accent)' : 'var(--color-surface-alt)',
                        color: isActive ? '#fff' : 'var(--color-text-primary)',
                        border: isActive ? '1px solid var(--color-accent)' : '1px solid var(--color-border)',
                      }}
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
            className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5"
            strokeWidth={1.5}
            style={{ color: 'var(--color-text-muted)' }}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full h-8 pl-8 pr-3 rounded-md text-[12px] outline-none transition-colors"
            style={{
              border: '1px solid var(--color-border)',
              background: 'var(--color-surface-alt)',
              color: 'var(--color-text-primary)',
            }}
          />
        </div>
      )}

      {/* Options */}
      <div className="flex flex-col gap-0.5">
        {visible.map((item) => {
          const isChecked = selected.includes(item.value)
          return (
            <label
              key={item.value}
              className="flex items-center gap-2.5 py-1 cursor-pointer group"
            >
              <div
                className="size-4 rounded shrink-0 flex items-center justify-center transition-colors"
                style={{
                  border: isChecked ? 'none' : '1.5px solid var(--color-border-strong)',
                  background: isChecked ? 'var(--color-accent)' : 'transparent',
                }}
              >
                {isChecked && <Check className="size-3 text-white" strokeWidth={2.5} />}
              </div>
              <input
                type="checkbox"
                className="sr-only"
                checked={isChecked}
                onChange={() => onToggle(item.value)}
              />
              <span
                className="flex-1 text-[12px] group-hover:text-[var(--color-accent)] transition-colors"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {item.label}
              </span>
              <span className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>
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
          className="mt-2 text-[12px] font-medium cursor-pointer transition-colors hover:underline"
          style={{ color: 'var(--color-accent)' }}
        >
          {expanded ? showLessText : `${showMoreText} (${filtered.length - VISIBLE_COUNT})`}
        </button>
      )}
    </FilterSection>
  )
}
