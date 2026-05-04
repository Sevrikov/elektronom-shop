'use client'

import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import {
  Zap, Plug, Cable, Lightbulb, Power, Server,
  Wrench, Gauge, Activity, Shield, Link2,
  Square, Circle, ToggleRight, Repeat, Box,
  House, Cpu, Bell, Video, Flame, Cog,
  Droplet, Wind, Thermometer, TrendingUp,
  BatteryCharging, Battery, ChevronRight,
} from 'lucide-react'
import { sidebarCategories } from '@/lib/constants'
import type { Locale } from '@/types'
import type { LucideIcon } from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
  zap: Zap, plug: Plug, cable: Cable, lightbulb: Lightbulb,
  power: Power, server: Server, wrench: Wrench,
  drill: Wrench, gauge: Gauge, activity: Activity,
  shield: Shield, 'link-2': Link2, square: Square,
  circle: Circle, 'toggle-right': ToggleRight, repeat: Repeat,
  box: Box, house: House, cpu: Cpu, bell: Bell, video: Video,
  flame: Flame, cog: Cog, droplet: Droplet, wind: Wind,
  thermometer: Thermometer, 'trending-up': TrendingUp,
  'battery-charging': BatteryCharging, battery: Battery,
}

export default function CategorySidebar() {
  const locale = useLocale() as Locale
  const t = useTranslations('sidebar')
  const lp = (path: string) => `/${locale}${path}`

  return (
    <aside className="hidden lg:block w-[280px] shrink-0 sticky top-[140px] self-start">
      <div
        className="rounded-lg overflow-hidden"
        style={{ border: '1px solid var(--color-border)', background: '#fff' }}
      >
        {/* Title */}
        <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--color-border)' }}>
          <h3 className="text-[11px] font-bold tracking-widest" style={{ color: 'var(--color-text-muted)' }}>
            {t('title')}
          </h3>
        </div>

        {/* Category list */}
        <nav className="sidebar-scroll max-h-[calc(100vh-200px)] overflow-y-auto">
          <ul className="py-1">
            {sidebarCategories.map((cat) => {
              const IconComp = iconMap[cat.icon] ?? Zap
              return (
                <li key={cat.id}>
                  <Link
                    href={lp(`/catalog/${cat.slug}`)}
                    className="flex items-center gap-3 px-4 py-[7px] text-[13px] transition-colors group"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    <IconComp
                      className="size-4 shrink-0 group-hover:text-[var(--color-accent)] transition-colors"
                      strokeWidth={1.5}
                      style={{ color: 'var(--color-text-muted)' }}
                    />
                    <span className="flex-1 truncate group-hover:text-[var(--color-accent)] transition-colors">
                      {cat.name[locale]}
                    </span>
                    <span className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>
                      {cat.count}
                    </span>
                    <ChevronRight
                      className="size-3.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ color: 'var(--color-accent)' }}
                      strokeWidth={1.5}
                    />
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </aside>
  )
}
