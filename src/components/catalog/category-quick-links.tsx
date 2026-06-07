'use client'

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
}

function getQuickLinkIcon(key: string, value: string, label: string) {
  const normKey = key.toLowerCase()
  const normVal = value.toLowerCase()
  const normLabel = label.toLowerCase()

  // Sockets
  if (normLabel.includes('розетк') || normVal === 'розетка') {
    return (
      <svg className="size-8 md:size-10 text-accent transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
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
      <svg className="size-8 md:size-10 text-accent transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <rect x="4" y="4" width="16" height="16" rx="3" />
        <rect x="8" y="7" width="8" height="10" rx="1" />
        <line x1="8" y1="12" x2="16" y2="12" strokeDasharray="1 1" />
        <circle cx="12" cy="15" r="1" fill="currentColor" />
      </svg>
    )
  }

  // 1P, 2P, 3P, 4P Breakers
  if (normVal === '1p' || normLabel.includes('1p') || normLabel.includes('1-полюс')) {
    return (
      <svg className="size-8 md:size-10 text-accent transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path d="M12 3v6M12 15v6" strokeLinecap="round" />
        <path d="M12 9l3 4" strokeLinecap="round" strokeWidth={2} />
        <circle cx="12" cy="9" r="1.2" fill="currentColor" />
        <circle cx="12" cy="15" r="1.2" fill="currentColor" />
        <rect x="6" y="5" width="12" height="14" rx="1" strokeWidth={1} strokeDasharray="2 2" className="opacity-30" />
      </svg>
    )
  }

  if (normVal === '2p' || normLabel.includes('2p') || normLabel.includes('2-полюс')) {
    return (
      <svg className="size-8 md:size-10 text-accent transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
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

  if (normVal === '3p' || normLabel.includes('3p') || normLabel.includes('3-полюс')) {
    return (
      <svg className="size-8 md:size-10 text-accent transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path d="M6 3v6M6 15v6M12 3v6M12 15v6M18 3v6M18 15v6" strokeLinecap="round" />
        <path d="M6 9l2.5 3.5M12 9l2.5 3.5M18 9l2.5 3.5" strokeLinecap="round" strokeWidth={2} />
        <line x1="8.5" y1="11" x2="20.5" y2="11" strokeDasharray="2 2" />
        <circle cx="6" cy="9" r="1" fill="currentColor" />
        <circle cx="12" cy="9" r="1" fill="currentColor" />
        <circle cx="18" cy="9" r="1" fill="currentColor" />
      </svg>
    )
  }

  // Cables & Wires
  if (normKey.includes('cable') || normLabel.includes('ввг') || normLabel.includes('пвс') || normKey === 'section' || normLabel.includes('мм²')) {
    return (
      <svg className="size-8 md:size-10 text-accent transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="7" strokeDasharray="2 2" className="opacity-30" />
        <circle cx="9" cy="10" r="2.2" fill="currentColor" />
        <circle cx="15" cy="10" r="2.2" fill="currentColor" />
        <circle cx="12" cy="15" r="2.2" fill="currentColor" />
      </svg>
    )
  }

  // Viscosity / Oil
  if (normKey === 'viscosity' || normLabel.includes('5w') || normLabel.includes('10w')) {
    return (
      <svg className="size-8 md:size-10 text-accent transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path d="M12 2C12 2 6 9 6 13a6 6 0 0 0 12 0c0-4-6-11-6-11z" fill="currentColor" fillOpacity="0.15" />
        <path d="M12 7c-1.5 1.5-2 3-2 4.5" strokeLinecap="round" />
      </svg>
    )
  }

  // Battery
  if (normKey === 'technology' || normLabel.includes('life') || normLabel.includes('agm') || normLabel.includes('аг') || normLabel.includes('ач')) {
    return (
      <svg className="size-8 md:size-10 text-accent transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <rect x="3" y="6" width="18" height="14" rx="2" />
        <path d="M7 6V4h3v2M14 6V4h3v2" strokeLinecap="round" />
        <path d="M6 11h2M7 10v2M15 11h2" strokeLinecap="round" strokeWidth={2} />
      </svg>
    )
  }

  // LED & Lighting
  if (normLabel.includes('ламп') || normVal === 'лампа') {
    return (
      <svg className="size-8 md:size-10 text-accent transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path d="M15 14c.8-1 1.5-2.5 1.5-4a4.5 4.5 0 0 0-9 0c0 1.5.7 3 1.5 4v3h6v-3z" />
        <path d="M9 17h6M10 20h4" strokeLinecap="round" />
        <path d="M12 2v1M5 5l.7.7M2 12h1M19 12h1M18.3 5l-.7.7" strokeLinecap="round" />
      </svg>
    )
  }

  if (normLabel.includes('панел') || normVal === 'панель') {
    return (
      <svg className="size-8 md:size-10 text-accent transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <rect x="3" y="3" width="18" height="18" rx="1" />
        <rect x="5" y="5" width="14" height="14" rx="0.5" strokeDasharray="3 3" />
        <path d="M6 6l12 12M18 6L6 18" className="opacity-15" />
      </svg>
    )
  }

  if (normLabel.includes('стріч') || normVal === 'лента' || normLabel.includes('лент')) {
    return (
      <svg className="size-8 md:size-10 text-accent transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 16a6 6 0 1 1 6-6 6 6 0 0 1-6 6z" strokeDasharray="3 1" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    )
  }

  // Brands (ABB, Schneider Electric, Hager, Legrand...)
  if (normKey === 'brand') {
    return (
      <svg className="size-8 md:size-10 text-accent transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="12" cy="12" r="5" className="opacity-20" />
        <text x="50%" y="58%" dominantBaseline="middle" textAnchor="middle" fontSize="9" fontWeight="bold" fill="currentColor">
          {label.slice(0, 3).toUpperCase()}
        </text>
      </svg>
    )
  }

  // Fallback: A nice electrical circuit board node
  return (
    <svg className="size-8 md:size-10 text-accent transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <circle cx="12" cy="12" r="3" fill="currentColor" />
      <path d="M12 2v7M12 15v7M2 12h7M15 12h7" strokeLinecap="round" />
    </svg>
  )
}

export default function CategoryQuickLinks({
  links,
  locale,
  activeFilters,
}: CategoryQuickLinksProps) {
  const pathname = usePathname()

  return (
    <div className="flex gap-4 md:gap-6 overflow-x-auto pb-4 pt-1 no-scrollbar mt-3 select-none">
      {links.map((link, i) => {
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

        return (
          <Link
            key={i}
            href={href as never}
            className="group flex flex-col items-center shrink-0 w-20 md:w-24 cursor-pointer"
          >
            {/* Round card icon container */}
            <div
              className={[
                'size-16 md:size-20 rounded-2xl flex items-center justify-center p-2 transition-all duration-300 border overflow-hidden bg-white',
                isActive
                  ? 'bg-[var(--color-accent-subtle)] border-accent shadow-sm'
                  : 'bg-surface-white border-border hover:border-accent/60 hover:shadow-md hover:scale-[1.02]',
              ].join(' ')}
            >
              {link.imageUrl ? (
                <TransparentImage
                  src={link.imageUrl}
                  alt={label}
                  className="size-full object-contain transition-transform duration-300 group-hover:scale-110"
                />
              ) : (
                getQuickLinkIcon(link.filter?.key ?? '', link.filter?.value ?? '', label)
              )}
            </div>

            {/* Label */}
            <span
              className={[
                'text-[11px] md:text-xs font-semibold text-center mt-2 leading-tight break-words line-clamp-2 max-w-[90px] transition-colors',
                isActive
                  ? 'text-accent'
                  : 'text-text-primary group-hover:text-accent',
              ].join(' ')}
            >
              {label}
            </span>
          </Link>
        )
      })}
    </div>
  )
}
