'use client'

import { useTranslations } from 'next-intl'
import { Compass, FileText, Package, PercentCircle, Landmark, Truck } from 'lucide-react'
import Link from 'next/link'

export default function HeroRightSidebar({ locale }: { locale: string }) {
  const tDrawer = useTranslations('home.drawer')
  const tProps = useTranslations('home.valueProps')

  const valuePropsList = [
    { icon: Package, title: tProps('stock'), sub: tProps('stockSub'), color: 'var(--color-accent)' },
    { icon: PercentCircle, title: tProps('wholesale'), sub: tProps('wholesaleSub'), color: 'var(--color-success)' },
    { icon: Landmark, title: tProps('legal'), sub: tProps('legalSub'), color: 'var(--color-accent)' },
    { icon: Truck, title: tProps('delivery'), sub: tProps('deliverySub'), color: 'var(--color-success)' },
  ] as const

  return (
    <aside className="w-full lg:w-[300px] xl:w-[320px] shrink-0 flex flex-col gap-3">
      {/* CTA Card 1: Guided */}
      <div className="flex items-start gap-3 p-3.5 rounded-lg transition-all hover:shadow-md bg-surface-white border border-border group cursor-pointer">
        <div className="size-9 rounded-md flex items-center justify-center shrink-0 bg-accent-subtle group-hover:scale-105 transition-transform">
          <Compass className="size-[18px] text-accent" strokeWidth={1.5} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-accent-subtle text-accent uppercase tracking-wider">
              {tDrawer('guidedTag')}
            </span>
            <span className="text-[13px] font-bold text-text-primary group-hover:text-accent transition-colors truncate">
              {tDrawer('guidedTitle')}
            </span>
          </div>
          <p className="text-[11px] text-text-muted leading-tight">{tDrawer('guidedBody')}</p>
          <span className="text-[11px] font-bold mt-1 inline-flex items-center gap-1 text-accent group-hover:underline">
            {tDrawer('guidedLink')} →
          </span>
        </div>
      </div>

      {/* CTA Card 2: B2B */}
      <div className="flex items-start gap-3 p-3.5 rounded-lg transition-all hover:shadow-md bg-surface-white border border-border group cursor-pointer">
        <div className="size-9 rounded-md flex items-center justify-center shrink-0 bg-accent-subtle group-hover:scale-105 transition-transform">
          <FileText className="size-[18px] text-accent" strokeWidth={1.5} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-accent-subtle text-accent uppercase tracking-wider">
              {tDrawer('b2bTag')}
            </span>
            <span className="text-[13px] font-bold text-text-primary group-hover:text-accent transition-colors truncate">
              {tDrawer('b2bTitle')}
            </span>
          </div>
          <p className="text-[11px] text-text-muted leading-tight">{tDrawer('b2bBody')}</p>
          <span className="text-[11px] font-bold mt-1 inline-flex items-center gap-1 text-accent group-hover:underline">
            {tDrawer('b2bLink')} →
          </span>
        </div>
      </div>

      {/* Trust & Value Props Stack */}
      <div className="rounded-lg p-3.5 flex flex-col gap-3 bg-surface-alt border border-border">
        {valuePropsList.map((item) => (
          <div key={item.title} className="flex items-center gap-3">
            <div
              className="size-8 rounded-md flex items-center justify-center shrink-0"
              style={{ background: `${item.color}15` }}
            >
              <item.icon className="size-4" style={{ color: item.color }} strokeWidth={1.5} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-semibold text-text-primary leading-tight truncate">
                {item.title}
              </p>
              <p className="text-[11px] font-bold leading-tight" style={{ color: item.color }}>
                {item.sub}
              </p>
            </div>
          </div>
        ))}
      </div>
    </aside>
  )
}
