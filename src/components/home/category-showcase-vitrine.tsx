'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronRight, ArrowUpRight, Sparkles, Layers } from 'lucide-react'
import type { Locale } from '@/types'
import CategoryIcon from '@/components/ui/category-icon'
import ProductCard, { type PrismaProductCard } from '@/components/product/product-card'

export interface ShowcaseSubcategory {
  slug: string
  name: { uk: string; ru: string }
  count: number
}

export interface ShowcaseCategoryHub {
  slug: string
  title: { uk: string; ru: string }
  desc: { uk: string; ru: string }
  badge: { uk: string; ru: string }
  subcategories: ShowcaseSubcategory[]
  products: PrismaProductCard[]
}

interface CategoryShowcaseVitrineProps {
  locale: Locale
  hubs: ShowcaseCategoryHub[]
}

export default function CategoryShowcaseVitrine({ locale, hubs }: CategoryShowcaseVitrineProps) {
  const [activeSlug, setActiveSlug] = useState<string>(hubs[0]?.slug ?? 'elektryka')
  const isUk = locale === 'uk'
  const lp = (path: string) => `/${locale}${path}` as never

  const activeHub = hubs.find((h) => h.slug === activeSlug) ?? hubs[0]

  return (
    <section className="flex flex-col gap-6 mt-4">
      {/* ── 1. Крупные разделы-хабы (Главная навигационная витрина) ── */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
              <Layers className="size-4" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold tracking-tight text-text-primary">
                {isUk ? 'Основні розділи каталогу' : 'Основные разделы каталога'}
              </h2>
              <p className="text-xs text-text-muted">
                {isUk ? 'Оберіть категорію для перегляду підкатегорій та витрины топ-товарів' : 'Выберите категорию для просмотра подкатегорий и витрины топ-товаров'}
              </p>
            </div>
          </div>

          <Link
            href={lp('/catalog')}
            className="hidden sm:inline-flex items-center gap-1 text-[13px] font-bold text-accent hover:underline"
          >
            {isUk ? 'Весь каталог' : 'Весь каталог'}
            <ChevronRight className="size-4" />
          </Link>
        </div>

        {/* Сетка крупных карточек-разделов (Стиль Promob & Elektronom Concept) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {hubs.map((hub) => {
            const isActive = hub.slug === activeSlug

            return (
              <button
                key={hub.slug}
                type="button"
                onClick={() => setActiveSlug(hub.slug)}
                className={`relative flex flex-col text-left p-4 rounded-xl border transition-all duration-300 group overflow-hidden ${
                  isActive
                    ? 'border-accent bg-surface-white shadow-md ring-2 ring-accent/20'
                    : 'border-border bg-surface-white/60 hover:bg-surface-white hover:border-border-strong hover:shadow-xs'
                }`}
              >
                {/* Active Indicator Strip */}
                {isActive && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-accent rounded-t-xl" />
                )}

                <div className="flex items-start justify-between w-full">
                  <div
                    className={`size-11 rounded-lg border flex items-center justify-center transition-transform group-hover:scale-105 ${
                      isActive
                        ? 'border-accent/30 bg-accent/10'
                        : 'border-border bg-surface-raised'
                    }`}
                  >
                    <CategoryIcon slug={hub.slug} className="size-6" />
                  </div>

                  <span
                    className={`size-7 rounded-full flex items-center justify-center transition-all ${
                      isActive
                        ? 'bg-accent text-white'
                        : 'bg-surface-raised text-text-muted group-hover:bg-accent/10 group-hover:text-accent'
                    }`}
                  >
                    <ArrowUpRight className="size-3.5" />
                  </span>
                </div>

                <div className="mt-3">
                  <h3
                    className={`font-bold text-sm leading-snug transition-colors line-clamp-1 ${
                      isActive ? 'text-accent' : 'text-text-primary group-hover:text-accent'
                    }`}
                  >
                    {hub.title[locale]}
                  </h3>
                  <p className="text-[11px] text-text-muted mt-0.5 line-clamp-1">
                    {hub.desc[locale]}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── 2. Выпадающая динамическая витрина (Подкатегории + Топ товары) ── */}
      {activeHub && (
        <div className="rounded-2xl border border-border bg-surface-white p-5 lg:p-6 shadow-sm transition-all duration-300">
          {/* Заголовок выбранного раздела */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border/60 gap-3 mb-5">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                <CategoryIcon slug={activeHub.slug} className="size-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-extrabold text-text-primary">
                    {activeHub.title[locale]}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-accent/10 text-accent border border-accent/20">
                    {activeHub.badge[locale]}
                  </span>
                </div>
                <p className="text-xs text-text-muted mt-0.5">
                  {activeHub.desc[locale]}
                </p>
              </div>
            </div>

            <Link
              href={lp(`/catalog/${activeHub.slug}`)}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-accent hover:bg-accent-hover transition-colors shrink-0 shadow-xs"
            >
              {isUk ? `Дивитися всі у «${activeHub.title[locale]}»` : `Смотреть все в «${activeHub.title[locale]}»`}
              <ChevronRight className="size-4" />
            </Link>
          </div>

          {/* Подкатегории раздела ("Оберіть підкатегорію") */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                <Sparkles className="size-3.5 text-accent" />
                {isUk ? 'Оберіть підкатегорію' : 'Выберите подкатегорию'}
              </h4>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {activeHub.subcategories.map((sub) => (
                <Link
                  key={sub.slug}
                  href={lp(`/catalog/${sub.slug}`)}
                  className="flex items-center gap-2.5 p-3 rounded-xl border border-border/80 bg-surface-alt/50 hover:bg-surface-white hover:border-accent/40 hover:shadow-xs transition-all group"
                >
                  <div className="size-8 rounded-lg bg-surface-white border border-border flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <CategoryIcon slug={sub.slug} className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-text-primary group-hover:text-accent transition-colors truncate">
                      {sub.name[locale]}
                    </p>
                    <p className="text-[10px] text-text-muted">
                      {sub.count} {isUk ? 'товарів' : 'товаров'}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Витрина Топ-Товаров выбранной категории */}
          <div>
            <div className="flex items-center justify-between mb-3.5">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-success inline-block animate-pulse" />
                {isUk ? `Витрина популярних товарів: ${activeHub.title[locale]}` : `Витрина популярных товаров: ${activeHub.title[locale]}`}
              </h4>

              <Link
                href={lp(`/catalog/${activeHub.slug}?sort=popular`)}
                className="text-xs font-bold text-accent hover:underline flex items-center gap-0.5"
              >
                {isUk ? 'Топові позиції' : 'Топовые позиции'}
                <ChevronRight className="size-3.5" />
              </Link>
            </div>

            {activeHub.products.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {activeHub.products.slice(0, 4).map((product) => (
                  <ProductCard key={product.id} product={product} locale={locale} isCompact={false} />
                ))}
              </div>
            ) : (
              <div className="p-8 rounded-xl border border-dashed border-border text-center bg-surface-alt/30">
                <p className="text-xs text-text-muted font-medium">
                  {isUk ? 'Завантаження товарів категорії...' : 'Загрузка товаров категории...'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
