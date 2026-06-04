'use client'

import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { ChevronRight } from 'lucide-react'
import type { Locale } from '@/types'
import CategoryIcon from '@/components/ui/category-icon'

interface CategoryCard {
  name: { uk: string; ru: string }
  slug: string
  count: number
}

const categories: CategoryCard[] = [
  { name: { uk: 'Автоматичні вимикачі', ru: 'Автоматические выключатели' }, slug: 'avtomatychni-vymykachi', count: 1240 },
  { name: { uk: 'Розетки та вимикачі', ru: 'Розетки и выключатели' }, slug: 'elektroustanovochni-vyroby', count: 890 },
  { name: { uk: 'Кабель та провід', ru: 'Кабель и провод' }, slug: 'kabeli-droty', count: 1850 },
  { name: { uk: 'Освітлення LED', ru: 'Освещение LED' }, slug: 'led-osvitlennya', count: 3200 },
  { name: { uk: 'Пускова апаратура', ru: 'Пусковая аппаратура' }, slug: 'puskova-aparatura', count: 560 },
  { name: { uk: 'Щити електричні', ru: 'Щиты электрические' }, slug: 'shchytky-modulni-vbudovani-ubox', count: 380 },
  { name: { uk: 'Інструмент ручний', ru: 'Инструмент ручной' }, slug: 'stolyarno-slyusarnyy-instrument', count: 720 },
  { name: { uk: 'ПЗВ та диф-автомати', ru: 'УЗО и диф-автоматы' }, slug: 'dyferentsialni-avtomatychni-vymykachi-bez-zakhystu-vid-nadstrumu-pzv', count: 290 },
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
              className="size-10 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800"
            >
              <CategoryIcon slug={cat.slug} className="size-5" />
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
