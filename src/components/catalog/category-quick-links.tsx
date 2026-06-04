'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { buildCatalogHref } from '@/lib/catalog-filter-url'
import type { ActiveFilters, Locale } from '@/types'

interface QuickLink {
  label: { uk: string; ru: string }
  filter?: { key: string; value: string }
  href?: string
}

interface CategoryQuickLinksProps {
  links: QuickLink[]
  locale: Locale
  activeFilters: ActiveFilters
}

export default function CategoryQuickLinks({
  links,
  locale,
  activeFilters,
}: CategoryQuickLinksProps) {
  const pathname = usePathname()

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar mt-3">
      {links.map((link, i) => {
        let href: string

        if (link.href) {
          href = link.href
        } else if (link.filter) {
          const { key, value } = link.filter
          // Toggle: if already active, clicking removes it
          const currentValues = (activeFilters[key] as string[] | undefined) ?? []
          const isActive = currentValues.includes(value)
          const nextValues = isActive
            ? currentValues.filter((v) => v !== value)
            : [...currentValues, value]
          const nextFilters: ActiveFilters = {
            ...activeFilters,
          }
          if (nextValues.length > 0) {
            nextFilters[key] = nextValues
          } else {
            delete nextFilters[key]
          }
          delete nextFilters.page
          href = buildCatalogHref(pathname, nextFilters)
        } else {
          return null
        }

        const label = link.label[locale]
        const isActive =
          link.filter
            ? ((activeFilters[link.filter.key] as string[] | undefined) ?? []).includes(
                link.filter.value
              )
            : false

        return (
          <Link
            key={i}
            href={href as never}
            className={[
              'whitespace-nowrap shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors border',
              isActive
                ? 'bg-accent text-white border-accent'
                : 'bg-surface-white text-text-primary border-border hover:border-accent hover:text-accent',
            ].join(' ')}
          >
            {label}
          </Link>
        )
      })}
    </div>
  )
}
