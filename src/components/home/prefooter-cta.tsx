'use client'

import { useTranslations } from 'next-intl'
import { Send } from 'lucide-react'

export default function PrefooterCta() {
  const t = useTranslations('home.prefooter')

  return (
    <section
      className="rounded-lg overflow-hidden"
      style={{ background: 'var(--color-text-primary)' }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
        {/* Left: Text */}
        <div className="flex flex-col justify-center">
          <h2 className="text-xl font-bold text-white mb-3">
            {t('title')}
          </h2>
          <p className="text-[14px] leading-relaxed" style={{ color: 'var(--color-footer-text)' }}>
            {t('subtitle')}
          </p>
        </div>

        {/* Right: Form */}
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <input
              type="email"
              placeholder={t('emailPlaceholder')}
              className="w-full px-3.5 py-2.5 rounded-md text-sm outline-none"
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid var(--color-footer-border)',
                color: '#fff',
              }}
            />
            <input
              type="tel"
              placeholder={t('phonePlaceholder')}
              className="w-full px-3.5 py-2.5 rounded-md text-sm outline-none"
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid var(--color-footer-border)',
                color: '#fff',
              }}
            />
          </div>
          <textarea
            placeholder={t('skuPlaceholder')}
            rows={4}
            className="w-full px-3.5 py-2.5 rounded-md text-sm outline-none resize-none"
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid var(--color-footer-border)',
              color: '#fff',
            }}
          />
          <button
            className="inline-flex items-center justify-center gap-2 h-10 px-6 rounded-md text-sm font-semibold text-white transition-colors cursor-pointer"
            style={{ background: 'var(--color-accent)' }}
          >
            <Send className="size-4" strokeWidth={1.5} />
            {t('send')}
          </button>
        </div>
      </div>
    </section>
  )
}
