'use client'

import { useTranslations } from 'next-intl'
import { Package, PercentCircle, Landmark, Truck } from 'lucide-react'

export default function ValueProps() {
  const t = useTranslations('home.valueProps')

  const items = [
    { icon: Package, title: t('stock'), sub: t('stockSub'), color: 'var(--color-accent)' },
    { icon: PercentCircle, title: t('wholesale'), sub: t('wholesaleSub'), color: 'var(--color-success)' },
    { icon: Landmark, title: t('legal'), sub: t('legalSub'), color: 'var(--color-accent)' },
    { icon: Truck, title: t('delivery'), sub: t('deliverySub'), color: 'var(--color-success)' },
  ] as const

  return (
    <section
      className="rounded-lg py-4 px-5"
      style={{ background: 'var(--color-surface-alt)', border: '1px solid var(--color-border)' }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <div key={item.title} className="flex items-center gap-3">
            <div
              className="size-10 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: `${item.color}10` }}
            >
              <item.icon className="size-5" style={{ color: item.color }} strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-[13px] font-medium" style={{ color: 'var(--color-text-primary)' }}>
                {item.title}
              </p>
              <p className="text-[12px] font-semibold" style={{ color: item.color }}>
                {item.sub}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
