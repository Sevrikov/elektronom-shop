import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { isValidLocale } from '@/i18n/request'
import { searchProducts } from '@/actions/search'
import { Search } from 'lucide-react'
import Image from 'next/image'
import Breadcrumbs from '@/components/layout/breadcrumbs'

interface PageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ q?: string }>
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const { q } = await searchParams
  const uk = locale !== 'ru'
  const query = q?.trim() ?? ''
  return {
    title: query
      ? `${uk ? 'Результати пошуку' : 'Результаты поиска'}: "${query}" | ЕЛЕКТРОНОМ`
      : `${uk ? 'Пошук' : 'Поиск'} | ЕЛЕКТРОНОМ`,
    robots: { index: false, follow: true },
  }
}

export default async function SearchPage({ params, searchParams }: PageProps) {
  const { locale } = await params
  const { q } = await searchParams

  if (!isValidLocale(locale)) notFound()

  const uk = locale !== 'ru'
  const query = q?.trim() ?? ''

  const breadcrumbs = [
    { name: uk ? 'Головна' : 'Главная', url: '/' },
    { name: uk ? 'Пошук' : 'Поиск' },
  ]

  let results: Awaited<ReturnType<typeof searchProducts>>['results'] = []
  let searchError: string | null = null

  if (query.length >= 2) {
    const res = await searchProducts(query, locale)
    if (res.success) {
      results = res.results
    } else {
      searchError = res.error ?? null
    }
  }

  return (
    <div className="min-h-[calc(100vh-200px)] bg-surface-alt py-6 lg:py-8">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-20">
        <Breadcrumbs items={breadcrumbs} locale={locale} />

        <h1 className="text-2xl font-bold text-text-primary mt-4 mb-6">
          {uk ? 'Пошук товарів' : 'Поиск товаров'}
        </h1>

        {/* Search Form */}
        <form method="get" action={`/${locale}/search`} className="mb-8">
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-3.5 size-5 text-text-muted" />
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder={uk ? 'Введіть назву, артикул або MPN...' : 'Введите название, артикул или MPN...'}
              className="w-full h-12 pl-12 pr-4 rounded-xl border border-border-strong bg-white focus:border-accent outline-none text-sm text-text-primary transition-colors shadow-sm"
              autoFocus
            />
          </div>
        </form>

        {/* Results */}
        {query.length < 2 ? (
          <div className="text-center py-16 text-text-muted text-sm">
            {uk ? 'Введіть мінімум 2 символи для пошуку' : 'Введите минимум 2 символа для поиска'}
          </div>
        ) : searchError ? (
          <div className="text-center py-16 text-destructive text-sm">
            {searchError}
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-16">
            <Search className="size-12 text-border mx-auto mb-4" />
            <p className="text-text-primary font-semibold mb-2">
              {uk ? `За запитом "${query}" нічого не знайдено` : `По запросу "${query}" ничего не найдено`}
            </p>
            <p className="text-text-muted text-sm">
              {uk
                ? 'Перевірте правильність написання або спробуйте інший запит'
                : 'Проверьте правильность написания или попробуйте другой запрос'}
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-text-muted mb-4">
              {uk
                ? `Знайдено ${results.length} товар${results.length === 1 ? '' : results.length < 5 ? 'и' : 'ів'}`
                : `Найдено ${results.length} товар${results.length === 1 ? '' : results.length < 5 ? 'а' : 'ов'}`}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {results.map((product) => (
                <Link
                  key={product.objectID}
                  href={`/${locale}/product/${product.slug}` as never}
                  className="group bg-white border border-border rounded-2xl overflow-hidden hover:border-accent/30 hover:shadow-md transition-all"
                >
                  {/* Image */}
                  <div className="aspect-square relative bg-surface-alt">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                        unoptimized={product.image.startsWith('https://placehold.co')}
                      />
                    ) : (
                      <div className="size-full flex items-center justify-center text-text-muted text-xs">
                        {uk ? 'Немає фото' : 'Нет фото'}
                      </div>
                    )}
                    {!product.inStock && (
                      <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                        <span className="text-xs font-bold text-text-muted bg-white px-2 py-0.5 rounded-full border border-border">
                          {uk ? 'Немає в наявності' : 'Нет в наличии'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-3.5">
                    {product.brandName && (
                      <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">
                        {product.brandName}
                      </p>
                    )}
                    <h3 className="text-sm font-semibold text-text-primary line-clamp-2 mb-2 group-hover:text-accent transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xs text-text-muted mb-2">{product.sku}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-base font-bold text-text-primary num">
                        {product.price.toLocaleString(locale === 'uk' ? 'uk-UA' : 'ru-RU')} ₴
                      </span>
                      {product.comparePrice && product.comparePrice > product.price && (
                        <span className="text-xs text-text-muted line-through num">
                          {product.comparePrice.toLocaleString(locale === 'uk' ? 'uk-UA' : 'ru-RU')} ₴
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
