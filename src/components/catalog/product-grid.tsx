'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
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
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const totalPages = Math.ceil(total / pageSize)
  const view = searchParams.get('view') === 'list' ? 'list' : 'grid'

  const currentLimit = Number(searchParams.get('limit') || '48')
  const hasMoreLimit = currentLimit < 192 && products.length < total

  function showMore() {
    let nextLimit = 96
    if (currentLimit === 96) nextLimit = 192

    const params = new URLSearchParams(searchParams.toString())
    params.set('limit', String(nextLimit))
    params.delete('page') // Reset page to 1
    router.replace(`${pathname}?${params.toString()}` as never, { scroll: false })
  }

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

          {hasMoreLimit && (
            <div className="flex justify-center mt-6">
              <button
                onClick={showMore}
                className="w-full sm:w-auto min-w-[200px] px-6 py-2.5 rounded-lg border border-accent text-accent hover:bg-accent hover:text-white transition-colors font-bold text-sm cursor-pointer select-none"
              >
                {locale === 'uk' ? 'Показати ще' : 'Показать еще'}
              </button>
            </div>
          )}

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
