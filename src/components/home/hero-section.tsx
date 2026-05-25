'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Compass, FileText } from 'lucide-react'
import HeroCarousel from './hero-carousel'

/**
 * Concept 6 v2 — Hybrid Drawer (Hero Section)
 * Contains: promo carousel, CTA cards, and SVG circuit breaker theme toggle
 */
export default function HybridDrawer({ locale }: { locale: string }) {
  const t = useTranslations('home.drawer')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark')
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(isDark ? 'dark' : 'light')
  }, [])

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(nextTheme)
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  return (
    <section className="w-full rounded-lg overflow-hidden border border-border">
      {/* Promo carousel */}
      <HeroCarousel locale={locale} />

      {/* Bottom row: CTA cards + theme toggle */}
      <div className="flex flex-col sm:flex-row items-stretch gap-3 p-3 bg-surface-alt border-t border-border">
        {/* CTA Card: Guided */}
        <div className="flex-1 flex items-start gap-3 p-3.5 rounded-md cursor-pointer transition-shadow hover:shadow-md bg-surface-white border border-border">
          <div className="size-9 rounded-md flex items-center justify-center shrink-0 bg-accent-subtle">
            <Compass className="size-[18px] text-accent" strokeWidth={1.5} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-accent-subtle text-accent">
                {t('guidedTag')}
              </span>
              <span className="text-[13px] font-semibold text-text-primary">
                {t('guidedTitle')}
              </span>
            </div>
            <p className="text-[12px] text-text-muted">{t('guidedBody')}</p>
            <span className="text-[12px] font-semibold mt-1 inline-block text-accent">
              {t('guidedLink')}
            </span>
          </div>
        </div>

        {/* CTA Card: B2B */}
        <div className="flex-1 flex items-start gap-3 p-3.5 rounded-md cursor-pointer transition-shadow hover:shadow-md bg-surface-white border border-border">
          <div className="size-9 rounded-md flex items-center justify-center shrink-0 bg-accent-subtle">
            <FileText className="size-[18px] text-accent" strokeWidth={1.5} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-accent-subtle text-accent">
                {t('b2bTag')}
              </span>
              <span className="text-[13px] font-semibold text-text-primary">
                {t('b2bTitle')}
              </span>
            </div>
            <p className="text-[12px] text-text-muted">{t('b2bBody')}</p>
            <span className="text-[12px] font-semibold mt-1 inline-block text-accent">
              {t('b2bLink')}
            </span>
          </div>
        </div>

        {/* Theme toggle (SVG circuit breaker) */}
        <div 
          onClick={toggleTheme}
          className="hidden sm:flex items-center gap-3 px-4 rounded-md shrink-0 bg-surface-white border border-border cursor-pointer select-none transition-all hover:shadow-md active:scale-[0.98]"
        >
          <div className="flex flex-col items-center gap-1">
            {/* SVG circuit breaker */}
            <svg width="24" height="40" viewBox="0 0 24 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-70 transition-transform duration-200 active:scale-95">
              <rect x="2" y="0" width="20" height="40" rx="2" fill="var(--color-surface-raised)" stroke="var(--color-border-strong)" strokeWidth="1"/>
              {theme === 'light' ? (
                <>
                  {/* ON State: Lever up */}
                  <rect x="7" y="4" width="10" height="12" rx="1" fill="var(--color-accent)" />
                  <text x="12" y="13" textAnchor="middle" fill="white" fontSize="6" fontWeight="600">ON</text>
                  <rect x="7" y="20" width="10" height="4" rx="1" fill="var(--color-border-strong)" />
                  <circle cx="12" cy="30" r="2" fill="var(--color-success)" />
                </>
              ) : (
                <>
                  {/* OFF State: Lever down */}
                  <rect x="7" y="4" width="10" height="4" rx="1" fill="var(--color-border-strong)" />
                  <rect x="7" y="12" width="10" height="12" rx="1" fill="var(--color-text-muted)" />
                  <text x="12" y="21" textAnchor="middle" fill="white" fontSize="6" fontWeight="600">OFF</text>
                  <circle cx="12" cy="30" r="2" fill="var(--color-destructive)" />
                </>
              )}
              {/* Latch clip */}
              <rect x="10" y="34" width="4" height="3" rx="0.5" fill="var(--color-border-strong)" />
            </svg>
            <div className="text-center">
              <p className="text-[9px] font-semibold text-text-muted">
                {t('themeLabel')}
              </p>
              <p className="text-[10px] font-bold text-text-primary">
                {theme === 'light' ? t('themeDay') : t('themeNight')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
