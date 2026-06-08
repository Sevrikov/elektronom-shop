import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import type { BreadcrumbItem } from '@/types'
import { getSiteUrl, localizedPath, safeJsonLd } from '@/lib/utils'

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  locale: string
}

export default function Breadcrumbs({ items, locale }: BreadcrumbsProps) {
  const baseUrl = getSiteUrl()
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => {
      const path = item.url ? localizedPath(locale, item.url) : undefined
      const absoluteUrl = path ? `${baseUrl}${path}` : undefined
      return {
        '@type': 'ListItem',
        position: i + 1,
        name: item.name,
        ...(absoluteUrl ? { item: absoluteUrl } : {}),
      }
    }),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
      />
      <nav aria-label="Breadcrumb" className="mb-4">
        <ol className="flex items-center gap-1.5 flex-wrap text-[13px]">
          {items.map((item, i) => {
            const isLast = i === items.length - 1
            return (
              <li key={i} className="flex items-center gap-1.5">
                {i > 0 && (
                  <ChevronRight
                    className="size-3 shrink-0 text-border-strong"
                    strokeWidth={1.5}
                  />
                )}
                {isLast || !item.url ? (
                  <span
                    className={isLast ? 'font-medium text-text-primary' : 'font-medium text-text-muted'}
                  >
                    {item.name}
                  </span>
                ) : (
                  <Link
                    href={localizedPath(locale, item.url) as never}
                    className="transition-colors hover:underline text-text-muted"
                  >
                    {item.name}
                  </Link>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    </>
  )
}

