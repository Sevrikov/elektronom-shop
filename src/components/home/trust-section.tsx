'use client'

import { useTranslations } from 'next-intl'
import { trustBrands } from '@/lib/constants'

export default function TrustSection() {
  const t = useTranslations('home.trust')

  return (
    <section
      className="rounded-lg px-5 py-6"
      style={{ background: 'var(--color-surface-alt)', border: '1px solid var(--color-border)' }}
    >
      <p className="text-[13px] font-medium text-center mb-5" style={{ color: 'var(--color-text-muted)' }}>
        {t('title')}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
        {trustBrands.map((brand) => (
          <span
            key={brand}
            className="text-[13px] font-bold tracking-wide"
            style={{ color: 'var(--color-text-muted)', opacity: 0.6 }}
          >
            {brand}
          </span>
        ))}
      </div>
    </section>
  )
}
