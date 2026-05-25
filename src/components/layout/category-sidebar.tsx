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
import type { CategoryTreeNode } from '@/queries/categories'
import { getPopularForSlug, getPromoForSlug } from '@/config/catalog-mega-menu'
import { useState } from 'react'

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

interface Props {
  categories?: CategoryTreeNode[]
}

export default function CategorySidebar({ categories = [] }: Props) {
  const locale = useLocale() as Locale
  const tMenu = useTranslations('megaMenu')
  const t = useTranslations('sidebar')
  const lp = (path: string) => `/${locale}${path}` as never

  const [activeSlug, setActiveSlug] = useState<string | null>(null)

  // Find the currently hovered category from the DB tree, or use a fallback
  const dbCategory = activeSlug ? categories.find((c) => c.slug === activeSlug) : null
  const sidebarInfo = activeSlug ? sidebarCategories.find(c => c.slug === activeSlug) : null
  
  const activeCategory = dbCategory || (activeSlug && sidebarInfo ? {
    name: sidebarInfo.name[locale],
    slug: activeSlug,
    children: [
      { name: locale === 'uk' ? 'Підкатегорія 1' : 'Подкатегория 1', slug: `${activeSlug}-sub1` },
      { name: locale === 'uk' ? 'Підкатегорія 2' : 'Подкатегория 2', slug: `${activeSlug}-sub2` },
      { name: locale === 'uk' ? 'Підкатегорія 3' : 'Подкатегория 3', slug: `${activeSlug}-sub3` },
      { name: locale === 'uk' ? 'Підкатегорія 4' : 'Подкатегория 4', slug: `${activeSlug}-sub4` },
    ]
  } : null)

  const popular = activeSlug ? getPopularForSlug(activeSlug, locale) : []
  const promo = activeSlug ? getPromoForSlug(activeSlug, locale) : null

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        className={`fixed inset-0 bg-black/40 z-[60] transition-opacity duration-300 ${activeSlug ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} 
        aria-hidden="true"
      />
      
      <aside
        className={`hidden lg:block w-[280px] shrink-0 sticky top-[140px] self-start ${activeSlug ? 'z-[70]' : 'z-40'}`}
        onMouseLeave={() => setActiveSlug(null)}
      >
      <div
        className="rounded-lg overflow-hidden border border-border"
        style={{ background: 'var(--color-surface-white)' }}
      >
        {/* Title */}
        <div className="px-4 py-3 border-b border-border">
          <h3 className="text-[11px] font-bold tracking-widest text-text-muted dark:text-blue-400/80">
            {t('title')}
          </h3>
        </div>

        {/* Category list */}
        <nav className="sidebar-scroll max-h-[calc(100vh-200px)] overflow-y-auto">
          <ul className="py-1">
            {sidebarCategories.map((cat) => {
              const IconComp = iconMap[cat.icon] ?? Zap
              const isActive = activeSlug === cat.slug
              return (
                <li
                  key={cat.id}
                  onMouseEnter={() => setActiveSlug(cat.slug)}
                >
                  <Link
                    href={lp(`/catalog/${cat.slug}`)}
                    className={[
                      'flex items-center gap-3 px-4 py-[7px] text-[13px] transition-all duration-150 group rounded-md mx-1',
                      isActive
                        ? 'bg-surface-alt text-accent dark:bg-blue-300 dark:text-[#0a2a6b]'
                        : 'text-text-primary dark:text-blue-400 hover:bg-slate-50 dark:hover:bg-blue-300'
                    ].join(' ')}
                  >
                    <IconComp
                      className={[
                        'size-4 shrink-0 transition-colors',
                        isActive
                          ? 'text-accent dark:text-[#0a2a6b]'
                          : 'text-text-muted group-hover:text-accent dark:text-blue-400 dark:group-hover:text-[#0a2a6b]'
                      ].join(' ')}
                      strokeWidth={1.5}
                    />
                    <span
                      className={[
                        'flex-1 truncate transition-colors font-medium',
                        isActive
                          ? 'text-accent dark:text-[#0a2a6b]'
                          : 'text-text-primary group-hover:text-accent dark:text-blue-400 dark:group-hover:text-[#0a2a6b]'
                      ].join(' ')}
                    >
                      {cat.name[locale]}
                    </span>
                    <span
                      className={[
                        'text-[11px] transition-colors',
                        isActive
                          ? 'text-accent/80 dark:text-[#0a2a6b]'
                          : 'text-text-muted group-hover:text-accent dark:text-blue-400/70 dark:group-hover:text-[#0a2a6b]'
                      ].join(' ')}
                    >
                      {cat.count}
                    </span>
                    <ChevronRight
                      className={[
                        'size-3.5 transition-opacity transition-colors',
                        isActive
                          ? 'opacity-100 text-accent dark:text-[#0a2a6b]'
                          : 'opacity-0 group-hover:opacity-100 text-accent dark:group-hover:text-[#0a2a6b]'
                      ].join(' ')}
                      strokeWidth={1.5}
                    />
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>

      {/* Flyout Mega Menu */}
      {activeSlug && activeCategory && (
        <div
          className="absolute left-[280px] top-0 bg-surface-white border border-border shadow-xl rounded-r-lg flex overflow-hidden w-[700px] z-50 max-h-[calc(100vh-140px)]"
        >
          {/* Col 2: Subcategories */}
          <div className="flex-1 min-w-0 overflow-y-auto px-6 py-5">
            <Link
              href={lp(`/catalog/${activeCategory.slug}`)}
              className="inline-block text-base font-bold text-text-primary mb-4 hover:text-accent transition-colors"
            >
              {activeCategory.name}
            </Link>
            {activeCategory.children.length > 0 ? (
              <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                {activeCategory.children.map((child) => (
                  <Link
                    key={child.slug}
                    href={lp(`/catalog/${child.slug}`)}
                    className="flex items-center gap-1.5 py-1 text-[13px] text-text-primary hover:text-accent transition-colors group"
                  >
                    <ChevronRight className="size-3 shrink-0 text-border-strong group-hover:text-accent transition-colors" strokeWidth={2} />
                    {child.name}
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-text-muted">{tMenu('noSubcategories')}</p>
            )}
          </div>

          {/* Col 3: Popular & Promo combined */}
          <div className="w-[280px] shrink-0 border-l border-border bg-surface-alt flex flex-col">
            {popular.length > 0 && (
              <div className="px-5 py-5 border-b border-border">
                <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-3">{tMenu('popular')}</p>
                <ul className="space-y-1">
                  {popular.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={lp(item.href)}
                        className="flex items-center gap-2 py-1.5 text-[13px] text-text-primary hover:text-accent transition-colors"
                      >
                        <span className="size-1.5 rounded-full bg-accent shrink-0" />
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {promo && (
              <div className="p-5 flex-1 flex flex-col">
                <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-3">{tMenu('promoLabel')}</p>
                <p className="text-sm font-bold text-text-primary mb-2">{promo.title}</p>
                {promo.subtitle && (
                  <p className="text-[12px] text-text-muted mb-4">{promo.subtitle}</p>
                )}
                {promo.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={promo.image} alt={promo.title} className="w-full h-28 object-contain rounded-md mb-4" />
                )}
                <Link
                  href={lp(promo.href)}
                  className="mt-auto inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-semibold text-white bg-accent hover:bg-accent-hover transition-colors"
                >
                  {promo.cta}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </aside>
    </>
  )
}
