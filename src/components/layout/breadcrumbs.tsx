import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import type { BreadcrumbItem } from '@/types'

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  locale: string
}

export default function Breadcrumbs({ items, locale }: BreadcrumbsProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      ...(item.url ? { item: `https://elektronom.com.ua/${locale}${item.url}` } : {}),
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb" className="mb-4">
        <ol className="flex items-center gap-1.5 flex-wrap text-[13px]">
          {items.map((item, i) => {
            const isLast = i === items.length - 1
            return (
              <li key={i} className="flex items-center gap-1.5">
                {i > 0 && (
                  <ChevronRight
                    className="size-3 shrink-0"
                    strokeWidth={1.5}
                    style={{ color: 'var(--color-border-strong)' }}
                  />
                )}
                {isLast || !item.url ? (
                  <span
                    className="font-medium"
                    style={{ color: isLast ? 'var(--color-text-primary)' : 'var(--color-text-muted)' }}
                  >
                    {item.name}
                  </span>
                ) : (
                  <Link
                    href={`/${locale}${item.url}`}
                    className="transition-colors hover:underline"
                    style={{ color: 'var(--color-text-muted)' }}
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
