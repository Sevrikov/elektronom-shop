'use client'

import Link from 'next/link'
import {
  Zap, Plug, Cable, Lightbulb, Power, Server,
  Wrench, Gauge, Activity, Shield, Link2,
  Square, Circle, ToggleRight, Repeat, Box,
  House, Cpu, Bell, Video, Flame, Cog,
  Droplet, Wind, Thermometer, TrendingUp,
  BatteryCharging, Battery, ArrowRight,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { featuredCategories } from '@/lib/catalog-hub-data'
import type { SidebarCategory } from '@/lib/constants'
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

// ─── Block 4: Featured Categories 2×2 ────────────────────────────────────────

interface FeaturedCategoriesProps {
  locale: string
}

export function FeaturedCategories({ locale }: FeaturedCategoriesProps) {
  const loc = locale as Locale

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[18px] font-semibold leading-[26px]" style={{ color: '#1A1F2B' }}>
          {loc === 'uk' ? 'Популярні категорії' : 'Популярные категории'}
        </h2>
        <Link
          href={`/${locale}/catalog`}
          className="text-[13px] font-semibold hover:underline"
          style={{ color: '#3B7BD9' }}
        >
          {loc === 'uk' ? 'Всі 30 →' : 'Все 30 →'}
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {featuredCategories.map((cat) => {
          const Icon = iconMap[cat.icon] ?? Zap
          return (
            <Link
              key={cat.slug}
              href={`/${locale}/catalog/${cat.slug}`}
              className="flex gap-4 p-[18px_20px] rounded-[10px] cursor-pointer transition-all group"
              style={{ background: '#fff', border: '1px solid #E6EAF0' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#3B7BD9'
                e.currentTarget.style.boxShadow = '0 2px 12px rgba(59,123,217,0.10)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#E6EAF0'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              {/* Icon block */}
              <div
                className="size-14 rounded-[10px] flex items-center justify-center shrink-0 transition-colors"
                style={{ background: '#EEF4FF' }}
              >
                <Icon className="size-7" strokeWidth={1.5} style={{ color: '#3B7BD9' }} />
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-[15px] font-semibold group-hover:text-[#3B7BD9] transition-colors" style={{ color: '#1A1F2B' }}>
                  {cat.name[loc]}
                </span>
                <span className="text-[12px] mt-0.5" style={{ color: '#6A7280' }}>
                  {cat.count.toLocaleString('uk-UA')} {loc === 'uk' ? 'товарів' : 'товаров'}
                </span>

                {/* Subcategory links */}
                <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2.5">
                  {cat.subcategoryLinks.map((sub) => (
                    <span
                      key={sub.slug}
                      className="text-[11px] font-medium hover:text-[#3B7BD9] cursor-pointer transition-colors"
                      style={{ color: '#6A7280' }}
                    >
                      {sub.name[loc]}
                    </span>
                  ))}
                </div>

                <div className="mt-auto pt-2.5">
                  <span className="flex items-center gap-1 text-[12px] font-semibold" style={{ color: '#3B7BD9' }}>
                    {loc === 'uk' ? 'Переглянути все' : 'Посмотреть все'}
                    <ArrowRight className="size-3" strokeWidth={1.5} />
                  </span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

// ─── Block 5: All Categories 5-col Grid ──────────────────────────────────────

interface AllCategoriesGridProps {
  categories: SidebarCategory[]
  locale: string
}

export function AllCategoriesGrid({ categories, locale }: AllCategoriesGridProps) {
  const loc = locale as Locale
  const totalSKU = categories.reduce((sum, c) => sum + c.count, 0)

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[18px] font-semibold leading-[26px]" style={{ color: '#1A1F2B' }}>
          {loc === 'uk' ? 'Всі категорії' : 'Все категории'}
        </h2>
        <span className="text-[12px]" style={{ color: '#6A7280' }}>
          {categories.length} {loc === 'uk' ? 'категорій' : 'категорий'}  ·  {totalSKU.toLocaleString('uk-UA')}+ SKU
        </span>
      </div>

      <div className="grid grid-cols-3 lg:grid-cols-5 gap-2.5">
        {categories.map((cat) => {
          const Icon = iconMap[cat.icon] ?? Zap
          return (
            <Link
              key={cat.id}
              href={`/${locale}/catalog/${cat.slug}`}
              className="flex flex-col items-center gap-1.5 p-3.5 rounded-lg text-center cursor-pointer transition-all group"
              style={{ background: '#fff', border: '1px solid #E6EAF0' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#3B7BD9'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#E6EAF0'
              }}
            >
              <div
                className="size-10 rounded-lg flex items-center justify-center transition-colors group-hover:bg-[#EEF4FF]"
                style={{ background: '#F5F7FA' }}
              >
                <Icon
                  className="size-5 transition-colors group-hover:text-[#3B7BD9]"
                  strokeWidth={1.5}
                  style={{ color: '#6A7280' }}
                />
              </div>
              <span
                className="text-[12px] font-semibold leading-tight line-clamp-2 transition-colors group-hover:text-[#3B7BD9]"
                style={{ color: '#1A1F2B' }}
              >
                {cat.name[loc]}
              </span>
              <span className="text-[11px]" style={{ color: '#6A7280' }}>
                {cat.count.toLocaleString('uk-UA')} {loc === 'uk' ? 'товарів' : 'товаров'}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

// ─── Block 6: Brands Strip ───────────────────────────────────────────────────

import { brandPills } from '@/lib/catalog-hub-data'

interface BrandsStripProps {
  locale: string
}

export function BrandsStrip({ locale }: BrandsStripProps) {
  const loc = locale as Locale

  return (
    <div
      className="flex items-center gap-3 p-3 px-4 rounded-lg"
      style={{ background: '#fff', border: '1px solid #E6EAF0' }}
    >
      <span className="text-[12px] font-semibold shrink-0" style={{ color: '#6A7280' }}>
        {loc === 'uk' ? 'Пошук за брендом:' : 'Поиск по бренду:'}
      </span>
      <div className="h-5 shrink-0" style={{ width: 1, background: '#E6EAF0' }} />
      <div className="flex flex-wrap gap-2">
        {brandPills.map((brand) => (
          <Link
            key={brand}
            href={`/${locale}/catalog?brand=${encodeURIComponent(brand)}`}
            className="px-3.5 py-[5px] rounded-[20px] text-[12px] font-semibold cursor-pointer transition-all"
            style={{ background: '#F5F7FA', border: '1px solid #E6EAF0', color: '#1A1F2B' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#3B7BD9'
              e.currentTarget.style.color = '#3B7BD9'
              e.currentTarget.style.background = '#fff'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#E6EAF0'
              e.currentTarget.style.color = '#1A1F2B'
              e.currentTarget.style.background = '#F5F7FA'
            }}
          >
            {brand}
          </Link>
        ))}
      </div>
    </div>
  )
}
