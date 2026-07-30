'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { buildCatalogHref } from '@/lib/catalog-filter-url'
import type { ActiveFilters, Locale } from '@/types'
import type { QuickLink } from '@/lib/catalog-filter-config'
import { TransparentImage } from '@/components/shared/transparent-image'

interface CategoryQuickLinksProps {
  links: QuickLink[]
  locale: Locale
  activeFilters: ActiveFilters
  layout?: 'horizontal' | 'sidebar'
}

function getQuickLinkIcon(key: string, value: string, label: string) {
  const normKey = key.toLowerCase()
  const normVal = value.toLowerCase()
  const normLabel = label.toLowerCase()

  // Sockets
  if (normLabel.includes('розетк') || normVal === 'розетка') {
    return (
      <svg className="size-6 text-accent transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <circle cx="12" cy="12" r="10" strokeWidth={1.5} />
        <circle cx="8" cy="12" r="1.5" fill="currentColor" />
        <circle cx="16" cy="12" r="1.5" fill="currentColor" />
        <path d="M12 2v2M12 20v2" strokeLinecap="round" />
        <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth={1} strokeDasharray="2 2" className="opacity-30" />
      </svg>
    )
  }

  // Switches
  if (normLabel.includes('вимикач') || normVal === 'вимикач' || normVal === 'выключатель') {
    return (
      <svg className="size-6 text-accent transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <rect x="4" y="4" width="16" height="16" rx="3" />
        <rect x="8" y="7" width="8" height="10" rx="1" />
        <line x1="8" y1="12" x2="16" y2="12" strokeDasharray="1 1" />
        <circle cx="12" cy="15" r="1" fill="currentColor" />
      </svg>
    )
  }

  // 1P Breaker
  if (normVal === '1p' || normLabel.includes('1p') || normLabel.includes('1-полюс')) {
    return (
      <svg className="size-6 text-accent transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path d="M12 3v6M12 15v6" strokeLinecap="round" />
        <path d="M12 9l3 4" strokeLinecap="round" strokeWidth={2} />
        <circle cx="12" cy="9" r="1.2" fill="currentColor" />
        <circle cx="12" cy="15" r="1.2" fill="currentColor" />
        <rect x="6" y="5" width="12" height="14" rx="1" strokeWidth={1} strokeDasharray="2 2" className="opacity-30" />
      </svg>
    )
  }

  // 2P Breaker
  if (normVal === '2p' || normLabel.includes('2p') || normLabel.includes('2-полюс')) {
    return (
      <svg className="size-6 text-accent transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path d="M8 3v6M8 15v6M16 3v6M16 15v6" strokeLinecap="round" />
        <path d="M8 9l3 4M16 9l3 4" strokeLinecap="round" strokeWidth={2} />
        <line x1="11" y1="11" x2="19" y2="11" strokeDasharray="2 2" />
        <circle cx="8" cy="9" r="1.2" fill="currentColor" />
        <circle cx="8" cy="15" r="1.2" fill="currentColor" />
        <circle cx="16" cy="9" r="1.2" fill="currentColor" />
        <circle cx="16" cy="15" r="1.2" fill="currentColor" />
      </svg>
    )
  }

  // 3P Breaker
  if (normVal === '3p' || normLabel.includes('3p') || normLabel.includes('3-полюс')) {
    return (
      <svg className="size-6 text-accent transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path d="M6 3v6M6 15v6M12 3v6M12 15v6M18 3v6M18 15v6" strokeLinecap="round" />
        <path d="M6 9l2.5 3.5M12 9l2.5 3.5M18 9l2.5 3.5" strokeLinecap="round" strokeWidth={2} />
        <line x1="8.5" y1="11" x2="20.5" y2="11" strokeDasharray="2 2" />
        <circle cx="6" cy="9" r="1" fill="currentColor" />
        <circle cx="12" cy="9" r="1" fill="currentColor" />
        <circle cx="18" cy="9" r="1" fill="currentColor" />
      </svg>
    )
  }

  // Amperage / Current rating (C16, C25, B16, etc.)
  if (normVal.startsWith('c') || normVal.startsWith('b') || normLabel.includes('16a') || normLabel.includes('25a')) {
    return (
      <svg className="size-6 text-accent transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <rect x="4" y="4" width="16" height="16" rx="3" />
        <text x="50%" y="58%" dominantBaseline="middle" textAnchor="middle" fontSize="9" fontWeight="800" fill="currentColor">
          {label.toUpperCase()}
        </text>
      </svg>
    )
  }

  // Cables & Wires
  if (normKey.includes('cable') || normLabel.includes('ввг') || normLabel.includes('пвс') || normKey === 'section' || normLabel.includes('мм²')) {
    return (
      <svg className="size-6 text-accent transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="7" strokeDasharray="2 2" className="opacity-30" />
        <circle cx="9" cy="10" r="2.2" fill="currentColor" />
        <circle cx="15" cy="10" r="2.2" fill="currentColor" />
        <circle cx="12" cy="15" r="2.2" fill="currentColor" />
      </svg>
    )
  }

  // Fallback: A clean electrical node icon
  return (
    <svg className="size-6 text-accent transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <circle cx="12" cy="12" r="3" fill="currentColor" />
      <path d="M12 2v7M12 15v7M2 12h7M15 12h7" strokeLinecap="round" />
    </svg>
  )
}

function QuickLinkItem({
  link,
  locale,
  activeFilters,
  layout,
}: {
  link: QuickLink
  locale: Locale
  activeFilters: ActiveFilters
  layout: 'horizontal' | 'sidebar'
}) {
  const pathname = usePathname()
  const [imageError, setImageError] = useState(false)

  let href: string

  if (link.href) {
    href = link.href
  } else if (link.filter) {
    const { key, value } = link.filter
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

  if (layout === 'sidebar') {
    return (
      <Link
        href={href as never}
        className={`group flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all duration-200 ${
          isActive
            ? 'border-accent bg-accent/10 ring-2 ring-accent/20 shadow-xs'
            : 'border-border bg-surface-white hover:border-accent/50 hover:bg-surface-raised hover:shadow-xs'
        }`}
      >
        <div className="size-10 rounded-lg flex items-center justify-center p-1 bg-surface-raised border border-border/50 shrink-0 group-hover:scale-105 transition-transform">
          {link.imageUrl && !imageError ? (
            <img
              src={link.imageUrl}
              alt={label}
              onError={() => setImageError(true)}
              className="size-full object-contain"
            />
          ) : (
            getQuickLinkIcon(link.filter?.key ?? '', link.filter?.value ?? '', label)
          )}
        </div>
        <span
          className={`text-[11px] font-semibold mt-1.5 leading-tight line-clamp-2 transition-colors ${
            isActive ? 'text-accent font-bold' : 'text-text-primary group-hover:text-accent'
          }`}
        >
          {label}
        </span>
      </Link>
    )
  }

  return (
    <Link
      href={href as never}
      className="group flex flex-col items-center shrink-0 w-20 md:w-24 cursor-pointer"
    >
      <div
        className={[
          'size-16 md:size-20 rounded-2xl flex items-center justify-center p-2 transition-all duration-300 border overflow-hidden bg-white',
          isActive
            ? 'bg-[var(--color-accent-subtle)] border-accent shadow-sm'
            : 'bg-surface-white border-border hover:border-accent/60 hover:shadow-md hover:scale-[1.02]',
        ].join(' ')}
      >
        {link.imageUrl && !imageError ? (
          <img
            src={link.imageUrl}
            alt={label}
            onError={() => setImageError(true)}
            className="size-full object-contain transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          getQuickLinkIcon(link.filter?.key ?? '', link.filter?.value ?? '', label)
        )}
      </div>

      <span
        className={[
          'text-[11px] md:text-xs font-semibold text-center mt-2 leading-tight break-words line-clamp-2 max-w-[90px] transition-colors',
          isActive ? 'text-accent' : 'text-text-primary group-hover:text-accent',
        ].join(' ')}
      >
        {label}
      </span>
    </Link>
  )
}

export default function CategoryQuickLinks({
  links,
  locale,
  activeFilters,
  layout = 'horizontal',
}: CategoryQuickLinksProps) {
  if (!links || links.length === 0) return null

  if (layout === 'sidebar') {
    return (
      <div className="bg-surface-white border border-border rounded-2xl p-3 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-2 px-1">
          {locale === 'uk' ? 'Швидкі фільтри:' : 'Быстрые фильтры:'}
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {links.map((link, i) => (
            <QuickLinkItem
              key={i}
              link={link}
              locale={locale}
              activeFilters={activeFilters}
              layout="sidebar"
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-4 md:gap-6 overflow-x-auto pb-4 pt-1 no-scrollbar mt-3 select-none">
      {links.map((link, i) => (
        <QuickLinkItem
          key={i}
          link={link}
          locale={locale}
          activeFilters={activeFilters}
          layout="horizontal"
        />
      ))}
    </div>
  )
}
