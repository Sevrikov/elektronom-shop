'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTransition } from 'react'

interface PaginationProps {
  currentPage: number
  totalPages: number
}

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
  const t = useTranslations('catalog.pagination')
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  if (totalPages <= 1) return null

  function goToPage(page: number) {
    const params = new URLSearchParams(searchParams.toString())
    if (page <= 1) {
      params.delete('page')
    } else {
      params.set('page', String(page))
    }
    const qs = params.toString()
    startTransition(() => {
      router.replace(`${pathname}${qs ? `?${qs}` : ''}`, { scroll: false })
    })
  }

  // Generate page numbers with ellipsis
  function getPages(): (number | '...')[] {
    const pages: (number | '...')[] = []
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      if (currentPage > 3) pages.push('...')
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)
      for (let i = start; i <= end; i++) pages.push(i)
      if (currentPage < totalPages - 2) pages.push('...')
      pages.push(totalPages)
    }
    return pages
  }

  const pages = getPages()

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-1 mt-6"
      style={{ opacity: isPending ? 0.5 : 1, transition: 'opacity 200ms' }}
    >
      {/* Previous */}
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage <= 1}
        className="size-9 rounded-md flex items-center justify-center transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
        style={{ border: '1px solid var(--color-border)', background: '#fff' }}
        aria-label={t('prev')}
      >
        <ChevronLeft className="size-4" strokeWidth={1.5} />
      </button>

      {/* Page numbers */}
      {pages.map((p, i) =>
        p === '...' ? (
          <span
            key={`ellipsis-${i}`}
            className="size-9 flex items-center justify-center text-[13px]"
            style={{ color: 'var(--color-text-muted)' }}
          >
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => goToPage(p)}
            disabled={p === currentPage}
            className="size-9 rounded-md flex items-center justify-center text-[13px] font-medium transition-colors cursor-pointer"
            style={{
              background: p === currentPage ? 'var(--color-accent)' : '#fff',
              color: p === currentPage ? '#fff' : 'var(--color-text-primary)',
              border: p === currentPage ? 'none' : '1px solid var(--color-border)',
            }}
          >
            {p}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="size-9 rounded-md flex items-center justify-center transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
        style={{ border: '1px solid var(--color-border)', background: '#fff' }}
        aria-label={t('next')}
      >
        <ChevronRight className="size-4" strokeWidth={1.5} />
      </button>
    </nav>
  )
}
