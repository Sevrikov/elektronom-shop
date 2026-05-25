'use client'

import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import {
  Zap, Plug, Cable, Lightbulb, Power, Server,
  Wrench, Shield, ChevronRight,
} from 'lucide-react'
import type { Locale } from '@/types'
import type { LucideIcon } from 'lucide-react'

interface CategoryCard {
  icon: LucideIcon
  name: { uk: string; ru: string }
  slug: string
  count: number
}

const categories: CategoryCard[] = [
  { icon: Zap, name: { uk: 'Автоматичні вимикачі', ru: 'Автоматические выключатели' }, slug: 'avtomatychni-vymykachi', count: 1240 },
  { icon: Plug, name: { uk: 'Розетки та вимикачі', ru: 'Розетки и выключатели' }, slug: 'rozetky-ta-vymykachi', count: 890 },
  { icon: Cable, name: { uk: 'Кабель та провід', ru: 'Кабель и провод' }, slug: 'kabel-ta-provid', count: 1850 },
  { icon: Lightbulb, name: { uk: 'Освітлення LED', ru: 'Освещение LED' }, slug: 'osvitlennya-led', count: 3200 },
  { icon: Power, name: { uk: 'Пускова апаратура', ru: 'Пусковая аппаратура' }, slug: 'puskova-aparatura', count: 560 },
  { icon: Server, name: { uk: 'Щити електричні', ru: 'Щиты электрические' }, slug: 'shchyty-elektrychni', count: 380 },
  { icon: Wrench, name: { uk: 'Інструмент ручний', ru: 'Инструмент ручной' }, slug: 'instrument-ruchnyy', count: 720 },
  { icon: Shield, name: { uk: 'ПЗВ та диф-автомати', ru: 'УЗО и диф-автоматы' }, slug: 'pzv-ta-dyf-avtomaty', count: 290 },
]

export default function CategoriesSection() {
  const locale = useLocale() as Locale
  const t = useTranslations('home.categories')
  const lp = (path: string) => `/${locale}${path}` as never

  return (
    <section>
      {/* Section header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>
          {t('title')}
        </h2>
        <Link
          href={lp('/catalog')}
          className="inline-flex items-center gap-1 text-[13px] font-medium transition-colors hover:underline"
          style={{ color: 'var(--color-accent)' }}
        >
          {t('viewAll')}
          <ChevronRight className="size-3.5" strokeWidth={1.5} />
        </Link>
      </div>

      {/* 4-column grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={lp(`/catalog/${cat.slug}`)}
            className="flex items-center gap-3 p-3.5 rounded-lg transition-all group hover:shadow-md"
            style={{ background: 'var(--color-surface-white)', border: '1px solid var(--color-border)' }}
          >
            <div
              className="size-10 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform"
              style={{ background: 'var(--color-accent-subtle)' }}
            >
              <cat.icon className="size-5" style={{ color: 'var(--color-accent)' }} strokeWidth={1.5} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium truncate group-hover:text-[var(--color-accent)] transition-colors" style={{ color: 'var(--color-text-primary)' }}>
                {cat.name[locale]}
              </p>
              <p className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>
                {cat.count} товарів
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
