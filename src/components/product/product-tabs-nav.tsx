"use client"

import { useEffect, useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'

interface ProductTabsNavProps {
  hasAbout: boolean
  hasSpecs: boolean
  reviewCount: number
  hasCoPurchase?: boolean
}

export function ProductTabsNav({ hasAbout, hasSpecs, reviewCount, hasCoPurchase = true }: ProductTabsNavProps) {
  const t = useTranslations('pdp')
  const [activeTab, setActiveTab] = useState<string>(() => {
    if (hasSpecs) return 'specs'
    if (hasAbout) return 'about'
    return 'reviews'
  })

  const sections = useMemo(() => [
    { id: 'specs', visible: hasSpecs },
    { id: 'about', visible: hasAbout },
    { id: 'reviews', visible: true },
    { id: 'co-purchase', visible: hasCoPurchase }
  ].filter(s => s.visible) as { id: 'specs' | 'about' | 'reviews' | 'co-purchase'; visible: boolean }[], [hasSpecs, hasAbout, hasCoPurchase])

  useEffect(() => {
    if (sections.length === 0) return

    const observerOptions = {
      rootMargin: '-180px 0px -50% 0px',
      threshold: 0
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveTab(entry.target.id)
        }
      })
    }, observerOptions)

    sections.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) observer.observe(el)
    })

    return () => {
      sections.forEach((s) => {
        const el = document.getElementById(s.id)
        if (el) observer.unobserve(el)
      })
    }
  }, [sections])

  if (sections.length === 0) return null

  return (
    <div className="sticky top-[var(--header-height,120px)] z-30 bg-surface-white border border-border rounded-2xl shadow-sm w-full transition-all duration-200 px-4 lg:px-6">
      <div className="max-w-[1600px] mx-auto">
        <nav className="flex items-center gap-6 overflow-x-auto whitespace-nowrap no-scrollbar h-12">
          {sections.map((s) => {
            const isActive = activeTab === s.id
            return (
              <a
                key={s.id}
                href={`#${s.id}`}
                onClick={(e) => {
                  e.preventDefault()
                  const target = document.getElementById(s.id)
                  if (target) {
                    const headerHeight = parseInt(
                      getComputedStyle(document.documentElement).getPropertyValue('--header-height') || '120'
                    )
                    // Scroll to target offset (header height + nav bar height 48px + 12px gap)
                    const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight - 48 - 12
                    window.scrollTo({
                      top: targetPosition,
                      behavior: 'smooth'
                    })
                    window.history.pushState(null, '', `#${s.id}`)
                    setActiveTab(s.id)
                  }
                }}
                className={`inline-flex items-center h-full border-b-2 text-sm font-bold transition-all duration-200 cursor-pointer ${isActive
                    ? 'border-accent text-accent'
                    : 'border-transparent text-text-muted hover:text-accent'
                  }`}
              >
                <span>{t(`tabs.${s.id}`)}</span>
                {s.id === 'reviews' && reviewCount > 0 && (
                  <span className={`ml-1.5 px-1.5 py-0.5 text-[10px] font-bold rounded-full transition-colors ${isActive ? 'bg-accent/10 text-accent' : 'bg-surface-alt text-text-muted'
                    }`}>
                    {reviewCount}
                  </span>
                )}
              </a>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
