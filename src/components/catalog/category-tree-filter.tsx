'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { Locale } from '@/types'

interface SimpleCategory {
  slug: string
  image: string | null
  translations: Array<{ name: string }>
}

interface SimpleParent {
  slug: string
  translations: Array<{ name: string }>
}

interface CategoryTreeFilterProps {
  currentSlug: string
  parent: SimpleParent | null
  childCategories: SimpleCategory[]
  locale: Locale
}

export default function CategoryTreeFilter({
  currentSlug,
  parent,
  childCategories,
  locale,
}: CategoryTreeFilterProps) {
  const t = useTranslations('catalog')
  const searchParams = useSearchParams()
  // Build a category URL preserving sort but dropping filters
  function categoryHref(slug: string) {
    const sort = searchParams.get('sort')
    const qs = sort ? `?sort=${sort}` : ''
    return `/${locale}/catalog/${slug}${qs}`
  }

  if (!parent && childCategories.length === 0) return null

  return (
    <div className="bg-surface-white rounded-lg border border-border overflow-hidden">
      <div className="px-4 py-3 border-b border-border">
        <span className="text-[13px] font-semibold text-text-primary">{t('categories')}</span>
      </div>
      <div className="flex flex-col">
        {/* Parent link */}
        {parent && (
          <Link
            href={categoryHref(parent.slug) as never}
            className="flex items-center gap-2 px-4 py-2 text-[13px] text-text-muted hover:text-accent hover:bg-surface-alt transition-colors"
          >
            <ChevronRight className="size-3.5 rotate-180 shrink-0 text-text-muted" />
            {parent.translations[0]?.name ?? parent.slug}
          </Link>
        )}

        {/* Current category (highlighted) */}
        <div className="flex items-center gap-2 px-4 py-2 bg-surface-alt border-l-2 border-accent">
          <span className="text-[13px] font-semibold text-accent">
            {/* currentSlug display handled by the h1 above — just highlight */}
            {t('allProducts')}
          </span>
        </div>

        {/* Children */}
        {childCategories.map((child) => (
          <Link
            key={child.slug}
            href={categoryHref(child.slug) as never}
            className={[
              'flex items-center gap-2 px-4 py-2 text-[13px] transition-colors',
              child.slug === currentSlug
                ? 'text-accent font-semibold bg-surface-alt border-l-2 border-accent'
                : 'text-text-primary hover:text-accent hover:bg-surface-alt',
            ].join(' ')}
          >
            <ChevronRight className="size-3.5 shrink-0 text-text-muted" />
            {child.translations[0]?.name ?? child.slug}
          </Link>
        ))}
      </div>
    </div>
  )
}
