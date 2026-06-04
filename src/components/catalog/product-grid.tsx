'use client'

import { useSearchParams } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { Package } from 'lucide-react'
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
  const searchParams = useSearchParams()

  const totalPages = Math.ceil(total / pageSize)
  const view = searchParams.get('view') === 'list' ? 'list' : 'grid'

  return (
    <div>
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
        <div className="flex flex-col items-center justify-center py-16 rounded-lg bg-surface-white border border-border">
          <Package className="size-16 mb-4 text-border-strong" strokeWidth={1} />
          <p className="text-[15px] font-semibold mb-1 text-text-primary">
            {t('noResults')}
          </p>
          <p className="text-[13px] text-text-muted">
            {t('noResultsSub')}
          </p>
        </div>
      )}
    </div>
  )
}
