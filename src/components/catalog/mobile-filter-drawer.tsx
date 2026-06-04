'use client'

import { useEffect, useCallback } from 'react'
import { X } from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { clearFiltersPreserveSort } from '@/lib/catalog-filter-url'
import { buildCatalogHref } from '@/lib/catalog-filter-url'
import CatalogFilters from './catalog-filters'
import type { ActiveFilters, FilterDefinition, BrandFacetItem, AttributeFacetItem } from '@/types'

interface MobileFilterDrawerProps {
  isOpen?: boolean
  onClose?: () => void
  filters: FilterDefinition[]
  activeFilters: ActiveFilters
  brandCounts: BrandFacetItem[]
  priceRange: { min: number; max: number; availableMin?: number; availableMax?: number; buckets?: number[] | undefined }
  attributeCounts: Record<string, AttributeFacetItem[]>
  total: number
}

export default function MobileFilterDrawer({
  isOpen = false,
  onClose,
  filters,
  activeFilters,
  brandCounts,
  priceRange,
  attributeCounts,
  total,
}: MobileFilterDrawerProps) {
  const t = useTranslations('catalog')
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  // Close on Escape
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose?.()
    },
    [isOpen, onClose]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Return focus to trigger button on close
  useEffect(() => {
    if (!isOpen) {
      const btn = document.getElementById('mobile-filter-open-btn')
      btn?.focus()
    }
  }, [isOpen])

  function handleClear() {
    const cleared = clearFiltersPreserveSort(activeFilters)
    const href = buildCatalogHref(pathname, cleared)
    router.replace(href as never, { scroll: false })
    onClose?.()
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t('filters.title')}
        className="fixed inset-y-0 right-0 z-50 flex flex-col w-full max-w-sm bg-surface-white shadow-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
          <span className="font-semibold text-text-primary">{t('filters.title')}</span>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-text-muted hover:text-text-primary hover:bg-surface-alt transition-colors"
            aria-label={t('close')}
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Scrollable filter content */}
        <div className="flex-1 overflow-y-auto">
          <CatalogFilters
            filters={filters}
            activeFilters={activeFilters}
            brandCounts={brandCounts}
            priceRange={priceRange}
            attributeCounts={attributeCounts}
          />
        </div>

        {/* Sticky footer */}
        <div className="shrink-0 px-4 py-3 border-t border-border flex gap-3 bg-surface-white">
          <button
            onClick={handleClear}
            className="flex-1 py-2.5 rounded-lg border border-border text-sm font-medium text-text-primary hover:border-accent hover:text-accent transition-colors"
          >
            {t('clearAll')}
          </button>
          <button
            onClick={onClose}
            disabled={total === 0}
            className={[
              'flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all',
              total === 0
                ? 'bg-text-muted/50 text-white/70 cursor-not-allowed opacity-50'
                : 'bg-accent text-white hover:opacity-90 cursor-pointer',
            ].join(' ')}
          >
            {total === 0
              ? (locale === 'uk' ? 'Немає товарів' : 'Нет товаров')
              : t('showProducts', { count: total })}
          </button>
        </div>
      </div>
    </>
  )
}
