import type { Metadata } from 'next'
import Link from 'next/link'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { isValidLocale } from '@/i18n/request'
import { sidebarCategories } from '@/lib/constants'
import { warehouseChips } from '@/lib/catalog-hub-data'
import type { Locale } from '@/types'
import Breadcrumbs from '@/components/layout/breadcrumbs'
import CatalogSidebar from '@/components/catalog/catalog-sidebar'
import CatalogHubTabs from '@/components/catalog/catalog-hub-tabs'
import ProjectLists from '@/components/catalog/project-lists'
import { FeaturedCategories, AllCategoriesGrid, BrandsStrip } from '@/components/catalog/catalog-hub-blocks'
import PrefooterB2bCta from '@/components/catalog/prefooter-b2b-cta'
import { Package, Layers, FileText, Truck } from 'lucide-react'


export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!isValidLocale(locale)) return {}
  const t = await getTranslations({ locale, namespace: 'catalog' })

  return {
    title: `${t('title')} — Electronom`,
    description: 'Каталог електротоварів, інструменту та освітлення — 10 000+ SKU в наявності на складі',
  }
}

import { connection } from 'next/server'

export default async function CatalogPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  await connection() // Opt out of prerendering to avoid Suspense errors with next-intl
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'catalog' })
  const loc = locale as Locale

  const breadcrumbs = [
    { name: t('breadcrumbs.home'), url: '/' },
    { name: t('breadcrumbs.catalog') },
  ]

  const valueProps = [
    { icon: Package, title: loc === 'uk' ? 'В наявності на складі' : 'В наличии на складе', sub: '10 000+ SKU' },
    { icon: Layers, title: loc === 'uk' ? 'Оптові ціни від 10 шт' : 'Оптовые цены от 10 шт', sub: loc === 'uk' ? 'до −18%' : 'до −18%' },
    { icon: FileText, title: loc === 'uk' ? 'Оплата для юр. осіб' : 'Оплата для юр. лиц', sub: loc === 'uk' ? 'з ПДВ' : 'с НДС' },
    { icon: Truck, title: loc === 'uk' ? 'Доставка Новою поштою' : 'Доставка Новой почтой', sub: loc === 'uk' ? 'від 1 дня' : 'от 1 дня' },
  ]

  return (
    <>
      <div className="max-w-[1280px] mx-auto px-4">
        {/* Breadcrumbs */}
        <div className="h-10 flex items-center">
          <Breadcrumbs items={breadcrumbs} locale={locale} />
        </div>

        {/* Main 2-column layout */}
        <div className="flex gap-6 items-start pb-10">
          {/* ───── SIDEBAR 280 ───── */}
          <aside className="hidden lg:block w-[280px] shrink-0 sticky top-[140px] self-start">
            <CatalogSidebar categories={sidebarCategories} locale={locale} />
          </aside>

          {/* ───── RIGHT COLUMN 976 ───── */}
          <div className="flex-1 min-w-0 flex flex-col gap-5">

            {/* Block 1 — Page Header + Warehouse Chips */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3" style={{ minHeight: 48 }}>
              <h1 className="text-[26px] font-bold leading-8" style={{ color: '#1A1F2B' }}>
                {t('title')}
              </h1>
              <div className="flex items-center gap-2 flex-wrap">
                {warehouseChips.map((wh) => (
                  <div
                    key={wh.city.uk}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-[20px]"
                    style={{ background: '#F5F7FA', border: '1px solid #E6EAF0' }}
                  >
                    <div className="size-1.5 rounded-full" style={{ background: '#22C55E' }} />
                    <span className="text-[12px] font-semibold" style={{ color: '#1A1F2B' }}>
                      {wh.city[loc]}
                    </span>
                    <span style={{ color: '#C9D1DC' }}>·</span>
                    <span className="text-[11px] font-medium" style={{ color: '#6A7280', fontVariantNumeric: 'tabular-nums' }}>
                      {wh.skuCount.toLocaleString('uk-UA')} SKU
                    </span>
                  </div>
                ))}
                <Link
                  href={`/${locale}/catalog` as `/${string}/catalog`}
                  className="text-[12px] font-semibold ml-3 hover:underline"
                  style={{ color: '#3B7BD9' }}
                >
                  {loc === 'uk' ? 'Усі склади →' : 'Все склады →'}
                </Link>
              </div>
            </div>

            {/* Block 2 — Tabbed Switcher (KILLER) */}
            <CatalogHubTabs locale={locale} />

            {/* Block 2.5 — Project Lists */}
            <ProjectLists locale={locale} />

            {/* Block 3 — Value-Props Strip */}
            <div
              className="flex flex-col sm:flex-row rounded-lg overflow-hidden"
              style={{ background: '#F5F7FA', border: '1px solid #E6EAF0' }}
            >
              {valueProps.map((vp, i) => {
                const Icon = vp.icon
                return (
                  <div
                    key={i}
                    className="flex-1 flex items-center gap-3 px-5 py-4 sm:py-0"
                    style={{
                      ...(i < valueProps.length - 1 ? { borderRight: '1px solid #E6EAF0' } : {}),
                      minHeight: 72,
                    }}
                  >
                    <Icon className="size-7 shrink-0" strokeWidth={1.5} style={{ color: '#3B7BD9' }} />
                    <div>
                      <p className="text-[13px] font-semibold" style={{ color: '#1A1F2B' }}>{vp.title}</p>
                      <p className="text-[11px]" style={{ color: '#6A7280' }}>{vp.sub}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Block 4 — Featured Categories 2×2 */}
            <FeaturedCategories locale={locale} />

            {/* Block 5 — All Categories Grid */}
            <AllCategoriesGrid categories={sidebarCategories} locale={locale} />

            {/* Block 6 — Brands Strip */}
            <BrandsStrip locale={locale} />
          </div>
        </div>
      </div>

      {/* Pre-footer B2B CTA — full-width */}
      <PrefooterB2bCta />
    </>
  )
}
