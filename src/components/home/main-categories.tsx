'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import type { Locale } from '@/types'
import CategoryIcon from '@/components/ui/category-icon'

interface MainCategoryCard {
  slug: string
  title: { uk: string; ru: string }
  desc: { uk: string; ru: string }
  gradient: string
  iconBg: string
}

const mainCats: MainCategoryCard[] = [
  {
    slug: 'elektrika',
    title: { uk: 'Електрика', ru: 'Электрика' },
    desc: { uk: 'Кабель, автоматика, щити, розетки та вимикачі', ru: 'Кабель, автоматика, щиты, розетки и выключатели' },
    gradient: 'from-blue-600/10 via-indigo-600/5 to-transparent hover:from-blue-600/15',
    iconBg: 'bg-blue-50/40 dark:bg-blue-950/10'
  },
  {
    slug: 'instrumenty',
    title: { uk: 'Інструмент', ru: 'Инструмент' },
    desc: { uk: 'Електроінструмент, ручний інструмент та обладнання', ru: 'Электроинструмент, ручной инструмент и оборудование' },
    gradient: 'from-blue-600/10 via-indigo-600/5 to-transparent hover:from-blue-600/15',
    iconBg: 'bg-blue-50/40 dark:bg-blue-950/10'
  },
  {
    slug: 'dbzh',
    title: { uk: 'ДБЖ та акумулятори', ru: 'ИБП и аккумуляторы' },
    desc: { uk: 'Джерела безперебійного живлення, батареї LiFePO4 та стабілізатори', ru: 'Источники бесперебойного питания, батареи LiFePO4 и стабилизаторы' },
    gradient: 'from-emerald-600/10 via-teal-600/5 to-transparent hover:from-emerald-600/15',
    iconBg: 'bg-emerald-50/40 dark:bg-emerald-950/10'
  }
]

export default function MainCategories({ locale }: { locale: Locale }) {
  const isUk = locale === 'uk'
  const lp = (path: string) => `/${locale}${path}` as never

  return (
    <section className="mt-2">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-extrabold tracking-tight text-text-primary">
          {isUk ? 'Основні категорії товарів' : 'Основные категории товаров'}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {mainCats.map((cat) => (
          <Link
            key={cat.slug}
            href={lp(`/catalog/${cat.slug}`)}
            className={`group relative flex flex-col p-6 rounded-2xl border border-border bg-gradient-to-br ${cat.gradient} shadow-xs transition-all duration-300 hover:shadow-md hover:border-border-strong overflow-hidden`}
          >
            {/* Visual shine / blob pattern in background */}
            <div className="absolute -right-6 -bottom-6 size-24 bg-white/10 rounded-full blur-xl group-hover:scale-125 transition-transform" />

            <div className="flex items-start justify-between">
              <div className={`size-12 rounded-xl border border-border flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform ${cat.iconBg}`}>
                <CategoryIcon slug={cat.slug} className="size-6" />
              </div>
              <span className="size-8 rounded-full bg-surface-white border border-border flex items-center justify-center text-text-muted group-hover:bg-accent group-hover:text-white group-hover:border-accent transition-all">
                <ChevronRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>

            <div className="mt-5 flex-1">
              <h3 className="font-extrabold text-lg text-text-primary group-hover:text-accent transition-colors leading-snug">
                {cat.title[locale]}
              </h3>
              <p className="text-xs text-text-muted mt-1.5 leading-relaxed">
                {cat.desc[locale]}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
