'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { buildCatalogHref } from '@/lib/catalog-filter-url'
import type { ActiveFilters, Locale } from '@/types'
import type { QuickLink } from '@/lib/catalog-filter-config'

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

  // 1P Breaker
  if (normVal === '1p' || normLabel.includes('1p') || normLabel.includes('1-полюс') || normLabel.includes('1п')) {
    return (
      <svg className="w-full h-full max-h-[64px] text-accent transition-transform duration-300 group-hover:scale-105" viewBox="0 0 32 32" fill="none">
        <rect x="9" y="2" width="14" height="28" rx="3" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="16" cy="6" r="1.5" fill="currentColor" />
        <circle cx="16" cy="26" r="1.5" fill="currentColor" />
        <rect x="7" y="13" width="18" height="6" rx="1" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" className="opacity-40" />
        <rect x="13" y="9" width="6" height="9" rx="1" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.2" />
        <path d="M16 10V15" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <text x="16" y="22.5" textAnchor="middle" fontSize="7" fontWeight="900" fill="currentColor">1P</text>
      </svg>
    )
  }

  // 2P Breaker
  if (normVal === '2p' || normLabel.includes('2p') || normLabel.includes('2-полюс') || normLabel.includes('2п')) {
    return (
      <svg className="w-full h-full max-h-[64px] text-accent transition-transform duration-300 group-hover:scale-105" viewBox="0 0 32 32" fill="none">
        <rect x="4" y="2" width="24" height="28" rx="3" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="1.5" />
        <line x1="16" y1="2" x2="16" y2="30" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" className="opacity-40" />
        <circle cx="10" cy="6" r="1.3" fill="currentColor" />
        <circle cx="22" cy="6" r="1.3" fill="currentColor" />
        <circle cx="10" cy="26" r="1.3" fill="currentColor" />
        <circle cx="22" cy="26" r="1.3" fill="currentColor" />
        <rect x="7" y="10" width="18" height="7" rx="1" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="1.2" />
        <line x1="9" y1="13.5" x2="23" y2="13.5" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
        <text x="16" y="23" textAnchor="middle" fontSize="7" fontWeight="900" fill="currentColor">2P</text>
      </svg>
    )
  }

  // 3P Breaker
  if (normVal === '3p' || normLabel.includes('3p') || normLabel.includes('3-полюс') || normLabel.includes('3п')) {
    return (
      <svg className="w-full h-full max-h-[64px] text-accent transition-transform duration-300 group-hover:scale-105" viewBox="0 0 36 32" fill="none">
        <rect x="2" y="2" width="32" height="28" rx="3" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="1.5" />
        <line x1="12" y1="2" x2="12" y2="30" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" className="opacity-30" />
        <line x1="24" y1="2" x2="24" y2="30" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" className="opacity-30" />
        <circle cx="7" cy="6" r="1.3" fill="currentColor" />
        <circle cx="18" cy="6" r="1.3" fill="currentColor" />
        <circle cx="29" cy="6" r="1.3" fill="currentColor" />
        <circle cx="7" cy="26" r="1.3" fill="currentColor" />
        <circle cx="18" cy="26" r="1.3" fill="currentColor" />
        <circle cx="29" cy="26" r="1.3" fill="currentColor" />
        <rect x="5" y="10" width="26" height="7" rx="1" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="1.2" />
        <line x1="7" y1="13.5" x2="29" y2="13.5" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
        <text x="18" y="23" textAnchor="middle" fontSize="7" fontWeight="900" fill="currentColor">3P</text>
      </svg>
    )
  }

  // Tripping Characteristic Curves (B, C, D)
  if (normKey === 'curve' || normLabel.includes('хар-ка') || (normVal.length === 1 && ['b', 'c', 'd'].includes(normVal))) {
    const letter = normVal.toUpperCase().replace('ХАР-КА', '').trim() || label.slice(-1).toUpperCase()
    return (
      <svg className="w-full h-full max-h-[64px] text-accent transition-transform duration-300 group-hover:scale-105" viewBox="0 0 32 32" fill="none">
        <rect x="3" y="3" width="26" height="26" rx="6" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="1.8" />
        <path d="M6 22C10 22 11 11 16 11C21 11 22 22 26 22" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2" className="opacity-40" />
        <text x="16" y="21" textAnchor="middle" fontSize="13" fontWeight="900" fill="currentColor">
          {letter}
        </text>
      </svg>
    )
  }

  // Amperage / Current rating (16A, 25A, 40A, C16, C25...)
  if (normKey === 'rated_current' || normLabel.includes('а') || normLabel.includes('ток') || normLabel.includes('струм')) {
    const valText = normVal.toUpperCase().endsWith('A') ? normVal.toUpperCase() : `${normVal.toUpperCase()}A`
    return (
      <svg className="w-full h-full max-h-[64px] text-accent transition-transform duration-300 group-hover:scale-105" viewBox="0 0 32 32" fill="none">
        <rect x="3" y="4" width="26" height="24" rx="5" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="1.8" />
        <line x1="7" y1="9" x2="25" y2="9" stroke="currentColor" strokeWidth="1.2" strokeDasharray="2 2" className="opacity-40" />
        <text x="16" y="21.5" textAnchor="middle" fontSize="11" fontWeight="900" fill="currentColor" letterSpacing="-0.5">
          {valText}
        </text>
      </svg>
    )
  }

  // Sockets
  if (normLabel.includes('розетк') || normVal === 'розетка') {
    return (
      <svg className="w-full h-full max-h-[64px] text-accent transition-transform duration-300 group-hover:scale-105" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <circle cx="12" cy="12" r="10" strokeWidth={1.5} fill="currentColor" fillOpacity="0.08" />
        <circle cx="8" cy="12" r="1.8" fill="currentColor" />
        <circle cx="16" cy="12" r="1.8" fill="currentColor" />
        <path d="M12 2v3M12 19v3" strokeLinecap="round" strokeWidth={1.8} />
      </svg>
    )
  }

  // Switches
  if (normLabel.includes('вимикач') || normVal === 'вимикач' || normVal === 'выключатель') {
    return (
      <svg className="w-full h-full max-h-[64px] text-accent transition-transform duration-300 group-hover:scale-105" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <rect x="4" y="3" width="16" height="18" rx="4" fill="currentColor" fillOpacity="0.08" strokeWidth={1.5} />
        <rect x="8" y="6" width="8" height="12" rx="2" fill="currentColor" fillOpacity="0.2" strokeWidth={1.2} />
        <circle cx="12" cy="15" r="1.2" fill="currentColor" />
      </svg>
    )
  }

  // Cables & Wires
  if (normKey.includes('cable') || normLabel.includes('ввг') || normLabel.includes('пвс') || normKey === 'section' || normLabel.includes('мм²')) {
    return (
      <svg className="w-full h-full max-h-[64px] text-accent transition-transform duration-300 group-hover:scale-105" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <circle cx="12" cy="12" r="9.5" fill="currentColor" fillOpacity="0.08" strokeWidth={1.5} />
        <circle cx="9" cy="9.5" r="2.5" fill="currentColor" />
        <circle cx="15" cy="9.5" r="2.5" fill="currentColor" />
        <circle cx="12" cy="15" r="2.5" fill="currentColor" />
      </svg>
    )
  }

  // Brands
  if (normKey === 'brand') {
    return (
      <svg className="w-full h-full max-h-[64px] text-accent transition-transform duration-300 group-hover:scale-105" viewBox="0 0 32 32" fill="none">
        <rect x="3" y="4" width="26" height="24" rx="5" stroke="currentColor" strokeWidth="1.8" fill="currentColor" fillOpacity="0.08" />
        <text x="50%" y="58%" dominantBaseline="middle" textAnchor="middle" fontSize="10" fontWeight="900" fill="currentColor">
          {label.slice(0, 3).toUpperCase()}
        </text>
      </svg>
    )
  }

  // Fallback: A clean electrical node icon
  return (
    <svg className="w-full h-full max-h-[64px] text-accent transition-transform duration-300 group-hover:scale-105" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <circle cx="12" cy="12" r="4" fill="currentColor" fillOpacity="0.2" strokeWidth={1.5} />
      <path d="M12 2v6M12 16v6M2 12h6M16 12h6" strokeLinecap="round" strokeWidth={1.8} />
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
  let isActive = false

  if (link.href) {
    href = link.href
  } else if (link.filter) {
    const { key, value } = link.filter
    const currentRaw = activeFilters[key]
    const currentValues = Array.isArray(currentRaw)
      ? currentRaw
      : currentRaw !== undefined && currentRaw !== null
      ? [String(currentRaw)]
      : []

    isActive = currentValues.includes(value)

    const nextValues = isActive
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value]

    const nextFilters: ActiveFilters = { ...activeFilters }
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

  if (layout === 'sidebar') {
    return (
      <Link
        href={href as never}
        className={`group flex flex-col justify-between p-1.5 min-h-[96px] h-[106px] w-full rounded-xl border text-center transition-all duration-200 overflow-hidden ${
          isActive
            ? 'border-accent bg-accent/15 text-accent font-bold ring-2 ring-accent/30 shadow-xs scale-[1.02]'
            : 'border-border bg-surface-white hover:border-accent/60 hover:bg-surface-raised hover:shadow-xs'
        }`}
      >
        <div className="flex-1 w-full flex items-center justify-center p-1 group-hover:scale-105 transition-transform overflow-hidden min-h-[64px]">
          {link.imageUrl && !imageError ? (
            <img
              src={link.imageUrl}
              alt={label}
              onError={() => setImageError(true)}
              className="size-full object-contain max-h-[64px]"
            />
          ) : (
            getQuickLinkIcon(link.filter?.key ?? '', link.filter?.value ?? '', label)
          )}
        </div>

        <div
          className={`w-full py-1 px-0.5 rounded-lg text-[9.5px] leading-tight font-semibold text-center transition-colors truncate ${
            isActive
              ? 'bg-accent text-white font-bold shadow-xs'
              : 'bg-surface-raised/90 text-text-primary group-hover:bg-accent/10 group-hover:text-accent'
          }`}
          title={label}
        >
          {label}
        </div>
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
            ? 'bg-[var(--color-accent-subtle)] border-accent shadow-sm ring-2 ring-accent/30'
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
          isActive ? 'text-accent font-extrabold' : 'text-text-primary group-hover:text-accent',
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
      <div className="bg-surface-white border border-border rounded-2xl p-2.5 shadow-xs">
        <h3 className="text-[11px] font-bold uppercase tracking-wider text-text-muted mb-2 px-1">
          {locale === 'uk' ? 'Швидкі фільтри:' : 'Быстрые фильтры:'}
        </h3>
        <div className="grid grid-cols-3 gap-1.5">
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
