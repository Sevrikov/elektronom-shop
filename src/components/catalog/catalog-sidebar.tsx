'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Zap, Plug, Cable, Lightbulb, Power, Server,
  Wrench, Gauge, Activity, Shield, Link2,
  Square, Circle, ToggleRight, Repeat, Box,
  House, Cpu, Bell, Video, Flame, Cog,
  Droplet, Wind, Thermometer, TrendingUp,
  BatteryCharging, Battery, ChevronDown, ChevronRight, Minus, ArrowRight,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { SidebarCategory } from '@/lib/constants'
import { sidebarSubcategories, defaultExpandedSlugs } from '@/lib/catalog-hub-data'
import type { Locale } from '@/types'

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

interface CatalogSidebarProps {
  categories: SidebarCategory[]
  locale: string
}

export default function CatalogSidebar({ categories, locale }: CatalogSidebarProps) {
  const loc = locale as Locale
  const [expanded, setExpanded] = useState<Set<string>>(new Set(defaultExpandedSlugs))

  const toggle = (slug: string) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(slug)) next.delete(slug)
      else next.add(slug)
      return next
    })
  }

  return (
    <div
      className="rounded-lg overflow-hidden"
      style={{ background: '#fff', border: '1px solid #E6EAF0' }}
    >
      {/* Title */}
      <div
        className="px-4 py-3 flex items-center"
        style={{ background: '#F5F7FA', borderBottom: '1px solid #E6EAF0' }}
      >
        <span
          className="text-[11px] font-bold tracking-[0.5px] uppercase"
          style={{ color: '#6A7280' }}
        >
          УСІ КАТЕГОРІЇ
        </span>
      </div>

      {/* Tree */}
      <div
        className="overflow-y-auto"
        style={{ maxHeight: 'calc(100vh - 220px)' }}
      >
        {categories.map((cat) => {
          const IconComp = iconMap[cat.icon] ?? Zap
          const subs = sidebarSubcategories[cat.slug]
          const isExpanded = expanded.has(cat.slug)
          const hasSubs = subs && subs.length > 0

          return (
            <div key={cat.id}>
              {/* Top-level row */}
              <button
                onClick={() => hasSubs ? toggle(cat.slug) : undefined}
                className="w-full flex items-center gap-2.5 px-4 cursor-pointer transition-colors group"
                style={{ height: 32, padding: '7px 16px' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#F5F7FA'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                }}
              >
                <IconComp
                  className="size-4 shrink-0 transition-colors group-hover:text-[#3B7BD9]"
                  strokeWidth={1.5}
                  style={{ color: '#6A7280' }}
                />
                <Link
                  href={`/${locale}/catalog/${cat.slug}`}
                  className="flex-1 text-left text-[13px] font-medium truncate transition-colors group-hover:text-[#3B7BD9]"
                  style={{ color: '#1A1F2B' }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {cat.name[loc]}
                </Link>
                <span
                  className="text-[11px] shrink-0"
                  style={{ color: '#9AA3AF', fontVariantNumeric: 'tabular-nums' }}
                >
                  {cat.count.toLocaleString('uk-UA')}
                </span>
                {hasSubs ? (
                  isExpanded ? (
                    <ChevronDown className="size-3 shrink-0" strokeWidth={1.5} style={{ color: '#C9D1DC' }} />
                  ) : (
                    <ChevronRight className="size-3 shrink-0" strokeWidth={1.5} style={{ color: '#C9D1DC' }} />
                  )
                ) : (
                  <div className="size-3 shrink-0" />
                )}
              </button>

              {/* Subcategories */}
              {hasSubs && (
                <div
                  className="overflow-hidden transition-all duration-150"
                  style={{
                    maxHeight: isExpanded ? `${subs.length * 28 + 4}px` : '0px',
                    opacity: isExpanded ? 1 : 0,
                  }}
                >
                  {subs.map((sub) => (
                    <Link
                      key={sub.slug}
                      href={`/${locale}/catalog/${cat.slug}/${sub.slug}`}
                      className="flex items-center gap-2 transition-colors group/sub"
                      style={{ height: 28, paddingLeft: 36, paddingRight: 16 }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#F5F7FA'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent'
                      }}
                    >
                      <Minus className="size-2.5 shrink-0" strokeWidth={1.5} style={{ color: '#C9D1DC' }} />
                      <span
                        className="flex-1 text-[12px] truncate transition-colors group-hover/sub:text-[#1A1F2B]"
                        style={{ color: '#6A7280' }}
                      >
                        {sub.name[loc]}
                      </span>
                      <span
                        className="text-[10px] shrink-0"
                        style={{ color: '#C9D1DC', fontVariantNumeric: 'tabular-nums' }}
                      >
                        {sub.count}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Bottom link */}
      <div style={{ borderTop: '1px solid #E6EAF0' }}>
        <Link
          href={`/${locale}/catalog`}
          className="flex items-center gap-1 px-4 py-3 text-[13px] font-semibold transition-colors hover:opacity-80"
          style={{ color: '#3B7BD9' }}
        >
          Усі 34 категорії
          <ArrowRight className="size-3.5" strokeWidth={1.5} />
        </Link>
      </div>
    </div>
  )
}
