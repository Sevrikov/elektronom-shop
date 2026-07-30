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
      <svg className="size-full text-accent transition-transform duration-300 group-hover:scale-105" viewBox="0 0 32 32" fill="none">
        <rect x="10" y="3" width="12" height="26" rx="2" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="16" cy="6.5" r="1.5" fill="currentColor" />
        <circle cx="16" cy="25.5" r="1.5" fill="currentColor" />
        <rect x="8" y="13" width="16" height="6" rx="1" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" className="opacity-40" />
        <rect x="13" y="10" width="6" height="8" rx="1" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1" />
        <path d="M16 11V15" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <text x="16" y="22" textAnchor="middle" fontSize="6.5" fontWeight="900" fill="currentColor">1P</text>
      </svg>
    )
  }

  // 2P Breaker
  if (normVal === '2p' || normLabel.includes('2p') || normLabel.includes('2-полюс') || normLabel.includes('2п')) {
    return (
      <svg className="size-full text-accent transition-transform duration-300 group-hover:scale-105" viewBox="0 0 32 32" fill="none">
        <rect x="5" y="3" width="22" height="26" rx="2" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="1.5" />
        <line x1="16" y1="3" x2="16" y2="29" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" className="opacity-40" />
        <circle cx="10.5" cy="6.5" r="1.3" fill="currentColor" />
        <circle cx="21.5" cy="6.5" r="1.3" fill="currentColor" />
        <circle cx="10.5" cy="25.5" r="1.3" fill="currentColor" />
        <circle cx="21.5" cy="25.5" r="1.3" fill="currentColor" />
        <rect x="8" y="11" width="16" height="6" rx="1" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="1" />
        <line x1="10" y1="14" x2="22" y2="14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <text x="16" y="22.5" textAnchor="middle" fontSize="6.5" fontWeight="900" fill="currentColor">2P</text>
      </svg>
    )
  }

  // 3P Breaker
  if (normVal === '3p' || normLabel.includes('3p') || normLabel.includes('3-полюс') || normLabel.includes('3п')) {
    return (
      <svg className="size-full text-accent transition-transform duration-300 group-hover:scale-105" viewBox="0 0 36 32" fill="none">
        <rect x="3" y="3" width="30" height="26" rx="2" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="1.5" />
        <line x1="13" y1="3" x2="13" y2="29" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" className="opacity-30" />
        <line x1="23" y1="3" x2="23" y2="29" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" className="opacity-30" />
        <circle cx="8" cy="6.5" r="1.2" fill="currentColor" />
        <circle cx="18" cy="6.5" r="1.2" fill="currentColor" />
        <circle cx="28" cy="6.5" r="1.2" fill="currentColor" />
        <circle cx="8" cy="25.5" r="1.2" fill="currentColor" />
        <circle cx="18" cy="25.5" r="1.2" fill="currentColor" />
        <circle cx="28" cy="25.5" r="1.2" fill="currentColor" />
        <rect x="6" y="11" width="24" height="6" rx="1" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="1" />
        <line x1="8" y1="14" x2="28" y2="14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <text x="18" y="22.5" textAnchor="middle" fontSize="6.5" fontWeight="900" fill="currentColor">3P</text>
      </svg>
    )
  }

  // Tripping Characteristic Curves (B, C, D)
  if (normKey === 'curve' || normLabel.includes('хар-ка') || (normVal.length === 1 && ['b', 'c', 'd'].includes(normVal))) {
    const letter = normVal.toUpperCase().replace('ХАР-КА', '').trim() || label.slice(-1).toUpperCase()
    return (
      <svg className="size-full text-accent transition-transform duration-300 group-hover:scale-105" viewBox="0 0 32 32" fill="none">
        <rect x="4" y="4" width="24" height="24" rx="5" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="1.5" />
        <path d="M7 21C11 21 12 11 16 11C20 11 21 21 25 21" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2" className="opacity-40" />
        <text x="16" y="20.5" textAnchor="middle" fontSize="12" fontWeight="900" fill="currentColor">
          {letter}
        </text>
      </svg>
    )
  }

  // Amperage / Current rating (16A, 25A, 40A, C16, C25...)
  if (normKey === 'rated_current' || normLabel.includes('а') || normLabel.includes('ток') || normLabel.includes('струм')) {
    const valText = normVal.toUpperCase().endsWith('A') ? normVal.toUpperCase() : `${normVal.toUpperCase()}A`
    return (
      <svg className="size-full text-accent transition-transform duration-300 group-hover:scale-105" viewBox="0 0 32 32" fill="none">
        <rect x="4" y="5" width="24" height="22" rx="4" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="1.5" />
        <line x1="8" y1="10" x2="24" y2="10" stroke="currentColor" strokeWidth="1" strokeDasharray="1.5 1.5" className="opacity-40" />
        <text x="16" y="21" textAnchor="middle" fontSize="10" fontWeight="900" fill="currentColor" letterSpacing="-0.5">
          {valText}
        </text>
      </svg>
    )
  }

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

  // Brands
  if (normKey === 'brand') {
    return (
      <svg className="size-full text-accent transition-transform duration-300 group-hover:scale-105" viewBox="0 0 32 32" fill="none">
        <rect x="4" y="4" width="24" height="24" rx="4" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.08" />
        <text x="50%" y="58%" dominantBaseline="middle" textAnchor="middle" fontSize="9" fontWeight="900" fill="currentColor">
          {label.slice(0, 3).toUpperCase()}
        </text>
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
        className={`group flex flex-col items-center justify-between p-1.5 min-h-[82px] w-full rounded-xl border text-center transition-all duration-200 overflow-hidden ${
          isActive
            ? 'border-accent bg-accent/15 text-accent font-bold ring-2 ring-accent/30 shadow-xs scale-[1.02]'
            : 'border-border bg-surface-white hover:border-accent/60 hover:bg-surface-raised hover:shadow-xs'
        }`}
      >
        <div
          className={`size-8 rounded-lg flex items-center justify-center p-0.5 shrink-0 group-hover:scale-105 transition-transform overflow-hidden ${
            isActive ? 'bg-accent/20 border border-accent/40' : 'bg-surface-raised border border-border/40'
          }`}
        >
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
          className={`text-[9.5px] leading-[1.15] tracking-tight text-center w-full break-words hyphens-auto mt-1 max-w-full px-0.5 transition-colors ${
            isActive ? 'text-accent font-extrabold' : 'text-text-primary font-medium group-hover:text-accent'
          }`}
          style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}
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
