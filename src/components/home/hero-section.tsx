'use client'

import { useTranslations } from 'next-intl'
import { ChevronLeft, ChevronRight, Compass, FileText } from 'lucide-react'
import { useState } from 'react'

/**
 * Concept 6 v2 — Hybrid Drawer (Hero Section)
 * Contains: promo carousel, CTA cards, and SVG circuit breaker theme toggle
 */
export default function HybridDrawer() {
  const t = useTranslations('home.drawer')
  const [currentSlide, setCurrentSlide] = useState(0)

  const totalSlides = 3

  return (
    <section className="w-full rounded-lg overflow-hidden" style={{ border: '1px solid var(--color-border)' }}>
      {/* Promo carousel */}
      <div
        className="relative w-full h-[280px] lg:h-[280px]"
        style={{ background: 'linear-gradient(135deg, #E8EEF7 0%, #F5F7FA 50%, #EEF2F7 100%)' }}
      >
        {/* Slide content */}
        <div className="flex flex-col items-center justify-center h-full px-6 text-center">
          <div
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-semibold mb-4"
            style={{ background: 'var(--color-accent)', color: '#fff' }}
          >
            {t('promoTitle')}
          </div>
          <p className="text-[13px] max-w-sm" style={{ color: 'var(--color-text-muted)' }}>
            {t('promoSubtitle')}
          </p>
        </div>

        {/* Carousel arrows */}
        <button
          className="absolute left-3 top-1/2 -translate-y-1/2 size-8 rounded-full flex items-center justify-center transition-colors cursor-pointer"
          style={{ background: '#fff', border: '1px solid var(--color-border)' }}
          onClick={() => setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)}
          aria-label="Previous slide"
        >
          <ChevronLeft className="size-4" strokeWidth={1.5} style={{ color: 'var(--color-text-primary)' }} />
        </button>
        <button
          className="absolute right-3 top-1/2 -translate-y-1/2 size-8 rounded-full flex items-center justify-center transition-colors cursor-pointer"
          style={{ background: '#fff', border: '1px solid var(--color-border)' }}
          onClick={() => setCurrentSlide((prev) => (prev + 1) % totalSlides)}
          aria-label="Next slide"
        >
          <ChevronRight className="size-4" strokeWidth={1.5} style={{ color: 'var(--color-text-primary)' }} />
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {Array.from({ length: totalSlides }).map((_, i) => (
            <button
              key={i}
              className="size-2 rounded-full transition-colors cursor-pointer"
              style={{
                background: i === currentSlide ? 'var(--color-accent)' : 'var(--color-border-strong)',
              }}
              onClick={() => setCurrentSlide(i)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Bottom row: CTA cards + theme toggle */}
      <div
        className="flex flex-col sm:flex-row items-stretch gap-3 p-3"
        style={{ background: 'var(--color-surface-alt)', borderTop: '1px solid var(--color-border)' }}
      >
        {/* CTA Card: Guided */}
        <div
          className="flex-1 flex items-start gap-3 p-3.5 rounded-md cursor-pointer transition-shadow hover:shadow-md"
          style={{ background: '#fff', border: '1px solid var(--color-border)' }}
        >
          <div
            className="size-9 rounded-md flex items-center justify-center shrink-0"
            style={{ background: 'var(--color-accent-subtle)' }}
          >
            <Compass className="size-[18px]" style={{ color: 'var(--color-accent)' }} strokeWidth={1.5} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: 'var(--color-accent-subtle)', color: 'var(--color-accent)' }}>
                {t('guidedTag')}
              </span>
              <span className="text-[13px] font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                {t('guidedTitle')}
              </span>
            </div>
            <p className="text-[12px]" style={{ color: 'var(--color-text-muted)' }}>{t('guidedBody')}</p>
            <span className="text-[12px] font-semibold mt-1 inline-block" style={{ color: 'var(--color-accent)' }}>
              {t('guidedLink')}
            </span>
          </div>
        </div>

        {/* CTA Card: B2B */}
        <div
          className="flex-1 flex items-start gap-3 p-3.5 rounded-md cursor-pointer transition-shadow hover:shadow-md"
          style={{ background: '#fff', border: '1px solid var(--color-border)' }}
        >
          <div
            className="size-9 rounded-md flex items-center justify-center shrink-0"
            style={{ background: 'var(--color-accent-subtle)' }}
          >
            <FileText className="size-[18px]" style={{ color: 'var(--color-accent)' }} strokeWidth={1.5} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: 'var(--color-accent-subtle)', color: 'var(--color-accent)' }}>
                {t('b2bTag')}
              </span>
              <span className="text-[13px] font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                {t('b2bTitle')}
              </span>
            </div>
            <p className="text-[12px]" style={{ color: 'var(--color-text-muted)' }}>{t('b2bBody')}</p>
            <span className="text-[12px] font-semibold mt-1 inline-block" style={{ color: 'var(--color-accent)' }}>
              {t('b2bLink')}
            </span>
          </div>
        </div>

        {/* Theme toggle (SVG circuit breaker) */}
        <div
          className="hidden sm:flex items-center gap-3 px-4 rounded-md shrink-0"
          style={{ background: '#fff', border: '1px solid var(--color-border)' }}
        >
          <div className="flex flex-col items-center gap-1">
            {/* SVG circuit breaker */}
            <svg width="24" height="40" viewBox="0 0 24 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-70">
              <rect x="2" y="0" width="20" height="40" rx="2" fill="var(--color-surface-raised)" stroke="var(--color-border-strong)" strokeWidth="1"/>
              <rect x="7" y="4" width="10" height="12" rx="1" fill="var(--color-accent)" />
              <text x="12" y="13" textAnchor="middle" fill="white" fontSize="6" fontWeight="600">ON</text>
              <rect x="7" y="20" width="10" height="4" rx="1" fill="var(--color-border-strong)" />
              <circle cx="12" cy="30" r="2" fill="var(--color-success)" />
              <rect x="10" y="34" width="4" height="3" rx="0.5" fill="var(--color-border-strong)" />
            </svg>
            <div className="text-center">
              <p className="text-[9px] font-semibold" style={{ color: 'var(--color-text-muted)' }}>
                {t('themeLabel')}
              </p>
              <p className="text-[10px] font-bold" style={{ color: 'var(--color-text-primary)' }}>
                {t('themeDay')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
