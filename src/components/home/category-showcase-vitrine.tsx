'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronRight, ArrowUpRight } from 'lucide-react'
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
  const [activeSubSlug, setActiveSubSlug] = useState<string | null>(null)

  const isUk = locale === 'uk'
  const lp = (path: string) => `/${locale}${path}` as never

  const activeHub = hubs.find((h) => h.slug === activeSlug) ?? hubs[0]

  // Filter products by selected subcategory if one is active, otherwise show active hub's products
  const filteredProducts = activeSubSlug && activeHub
    ? activeHub.products.filter((p) => p.category.slug === activeSubSlug || p.slug.includes(activeSubSlug.replace(/-/g, '')))
    : activeHub?.products ?? []

  const displayProducts = filteredProducts.length > 0 ? filteredProducts : (activeHub?.products ?? [])

  const handleSelectHub = (hubSlug: string) => {
    setActiveSlug(hubSlug)
    setActiveSubSlug(null) // Reset subcategory filter when switching main category
  }

  return (
    <section className="flex flex-col gap-4 mt-2">
      {/* ── 1. Крупные разделы-хабы без лишних заголовков ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {hubs.map((hub) => {
          const isActive = hub.slug === activeSlug

          return (
            <button
              key={hub.slug}
              type="button"
              onClick={() => handleSelectHub(hub.slug)}
              className={`relative flex flex-col text-left p-3.5 sm:p-4 rounded-xl border transition-all duration-300 group overflow-hidden ${
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
                  className={`size-10 sm:size-11 rounded-lg border flex items-center justify-center transition-transform group-hover:scale-105 shrink-0 ${
                    isActive
                      ? 'border-accent/30 bg-accent/10'
                      : 'border-border bg-surface-raised'
                  }`}
                >
                  <CategoryIcon slug={hub.slug} className="size-5 sm:size-6" />
                </div>

                <span
                  className={`size-6 sm:size-7 rounded-full flex items-center justify-center transition-all shrink-0 ${
                    isActive
                      ? 'bg-accent text-white'
                      : 'bg-surface-raised text-text-muted group-hover:bg-accent/10 group-hover:text-accent'
                  }`}
                >
                  <ArrowUpRight className="size-3.5" />
                </span>
              </div>

              {/* Title and subtitle without truncating ellipsis (2 lines wrap) */}
              <div className="mt-3">
                <h3
                  className={`font-bold text-xs sm:text-sm leading-snug transition-colors line-clamp-2 min-h-[32px] sm:min-h-[40px] ${
                    isActive ? 'text-accent' : 'text-text-primary group-hover:text-accent'
                  }`}
                >
                  {hub.title[locale]}
                </h3>
                <p className="text-[11px] text-text-muted mt-1 leading-snug line-clamp-2 min-h-[28px]">
                  {hub.desc[locale]}
                </p>
              </div>
            </button>
          )
        })}
      </div>

      {/* ── 2. Динамическая витрина подкатегорий и товаров ── */}
      {activeHub && (
        <div className="rounded-2xl border border-border bg-surface-white p-4 sm:p-5 shadow-sm transition-all duration-300">
          {/* Сетка подкатегорий (Клик перерисовывает витрину товаров ниже, без урезания слов) */}
          <div className="mb-5">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              {activeHub.subcategories.map((sub) => {
                const isSubActive = activeSubSlug === sub.slug

                return (
                  <button
                    key={sub.slug}
                    type="button"
                    onClick={() => setActiveSubSlug(isSubActive ? null : sub.slug)}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all group ${
                      isSubActive
                        ? 'border-accent bg-accent/5 ring-2 ring-accent/20 shadow-xs'
                        : 'border-border/80 bg-surface-alt/40 hover:bg-surface-white hover:border-accent/40'
                    }`}
                  >
                    <div
                      className={`size-8 rounded-lg border flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                        isSubActive
                          ? 'bg-accent/10 border-accent/30'
                          : 'bg-surface-white border-border'
                      }`}
                    >
                      <CategoryIcon slug={sub.slug} className="size-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-xs font-semibold leading-tight line-clamp-2 transition-colors ${
                          isSubActive ? 'text-accent' : 'text-text-primary group-hover:text-accent'
                        }`}
                      >
                        {sub.name[locale]}
                      </p>
                      <p className="text-[10px] text-text-muted mt-0.5">
                        {sub.count} {isUk ? 'товаров' : 'товаров'}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Витрина Топ-Товаров выбранного раздела/подразделения */}
          <div>
            <div className="flex items-center justify-between mb-3.5 pt-2 border-t border-border/40">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-text-muted flex items-center gap-2">
                <span className="size-2 rounded-full bg-success inline-block animate-pulse" />
                <span>
                  {isUk ? 'Витрина товарів:' : 'Витрина товаров:'}{' '}
                  <strong className="text-text-primary">
                    {activeSubSlug
                      ? activeHub.subcategories.find((s) => s.slug === activeSubSlug)?.name[locale] ?? activeHub.title[locale]
                      : activeHub.title[locale]}
                  </strong>
                </span>
              </h4>

              <Link
                href={lp(`/catalog/${activeSubSlug ?? activeHub.slug}`)}
                className="text-xs font-bold text-accent hover:underline flex items-center gap-0.5"
              >
                {isUk ? 'Усі товари раздела' : 'Все товары раздела'}
                <ChevronRight className="size-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {displayProducts.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} locale={locale} isCompact={false} />
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
