'use client'

import { useState, useTransition } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { LayoutGrid, List, ChevronDown, Package } from 'lucide-react'
import type { Locale } from '@/types'
import ProductCard, { type PrismaProductCard } from '@/components/product/product-card'
import Pagination from '@/components/shared/pagination'

interface ProductGridProps {
  products: PrismaProductCard[]
  total: number
  currentPage: number
  pageSize: number
}

export default function ProductGrid({ products, total, currentPage, pageSize }: ProductGridProps) {
  const t = useTranslations('catalog')
  const locale = useLocale() as Locale
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [view, setView] = useState<'grid' | 'list'>('grid')

  const totalPages = Math.ceil(total / pageSize)
  const currentSort = searchParams.get('sort') ?? 'popular'

  function handleSort(sort: string) {
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

  const sortOptions = [
    { value: 'popular', label: t('sort.popular') },
    { value: 'price-asc', label: t('sort.priceAsc') },
    { value: 'price-desc', label: t('sort.priceDesc') },
    { value: 'new', label: t('sort.new') },
    { value: 'rating', label: t('sort.rating') },
  ]

  const currentSortLabel = sortOptions.find(o => o.value === currentSort)?.label ?? t('sort.popular')

  return (
    <div style={{ opacity: isPending ? 0.5 : 1, transition: 'opacity 200ms' }}>
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <p className="text-[13px]" style={{ color: 'var(--color-text-muted)' }}>
          {t('found', { count: total })}
        </p>

        <div className="flex items-center gap-3">
          {/* Sort dropdown */}
          <div className="relative group">
            <button
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] font-medium cursor-pointer transition-colors"
              style={{
                border: '1px solid var(--color-border)',
                background: '#fff',
                color: 'var(--color-text-primary)',
              }}
            >
              <span>{t('sort.label')}:</span>
              <span style={{ color: 'var(--color-accent)' }}>{currentSortLabel}</span>
              <ChevronDown className="size-3.5" strokeWidth={1.5} />
            </button>
            {/* Dropdown */}
            <div
              className="absolute right-0 top-full mt-1 rounded-lg py-1 z-20 hidden group-hover:block min-w-[200px]"
              style={{
                border: '1px solid var(--color-border)',
                background: '#fff',
                boxShadow: 'var(--shadow-lg)',
              }}
            >
              {sortOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleSort(opt.value)}
                  className="w-full text-left px-4 py-2 text-[13px] cursor-pointer transition-colors hover:bg-[var(--color-surface-alt)]"
                  style={{
                    color: opt.value === currentSort ? 'var(--color-accent)' : 'var(--color-text-primary)',
                    fontWeight: opt.value === currentSort ? 600 : 400,
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Grid/List toggle */}
          <div className="flex items-center rounded-md overflow-hidden" style={{ border: '1px solid var(--color-border)' }}>
            <button
              onClick={() => setView('grid')}
              className="size-8 flex items-center justify-center cursor-pointer transition-colors"
              style={{
                background: view === 'grid' ? 'var(--color-accent)' : '#fff',
                color: view === 'grid' ? '#fff' : 'var(--color-text-muted)',
              }}
              aria-label={t('view.grid')}
            >
              <LayoutGrid className="size-4" strokeWidth={1.5} />
            </button>
            <button
              onClick={() => setView('list')}
              className="size-8 flex items-center justify-center cursor-pointer transition-colors"
              style={{
                background: view === 'list' ? 'var(--color-accent)' : '#fff',
                color: view === 'list' ? '#fff' : 'var(--color-text-muted)',
                borderLeft: '1px solid var(--color-border)',
              }}
              aria-label={t('view.list')}
            >
              <List className="size-4" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>

      {/* Products */}
      {products.length > 0 ? (
        <>
          <div
            className={
              view === 'grid'
                ? 'grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3'
                : 'flex flex-col gap-3'
            }
          >
            {products.map((product) => (
              <ProductCard key={product.id} product={product} locale={locale} view={view} />
            ))}
          </div>
          <Pagination currentPage={currentPage} totalPages={totalPages} />
        </>
      ) : (
        /* Empty state */
        <div
          className="flex flex-col items-center justify-center py-16 rounded-lg"
          style={{ background: '#fff', border: '1px solid var(--color-border)' }}
        >
          <Package className="size-16 mb-4" strokeWidth={1} style={{ color: 'var(--color-border-strong)' }} />
          <p className="text-[15px] font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>
            {t('noResults')}
          </p>
          <p className="text-[13px]" style={{ color: 'var(--color-text-muted)' }}>
            {t('noResultsSub')}
          </p>
        </div>
      )}
    </div>
  )
}
