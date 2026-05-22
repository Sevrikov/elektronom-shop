import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { isValidLocale } from '@/i18n/request'
import { getBrandBySlug, getBrandProducts } from '@/queries/brands'
import Breadcrumbs from '@/components/layout/breadcrumbs'
import { parseSearchParams } from '@/lib/utils'

interface PageProps {
  params: Promise<{ locale: string; slug: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params
  const brand = await getBrandBySlug(slug)
  if (!brand) return {}

  const uk = locale !== 'ru'
  return {
    title: `${brand.name} — ${uk ? 'товари' : 'товары'} | ЕЛЕКТРОНОМ`,
    description: uk
      ? `Купити товари бренду ${brand.name} в інтернет-магазині ЕЛЕКТРОНОМ. Офіційний дистриб'ютор, оригінальна продукція, швидка доставка.`
      : `Купить товары бренда ${brand.name} в интернет-магазине ЕЛЕКТРОНОМ. Официальный дистрибьютор, оригинальная продукция, быстрая доставка.`,
  }
}

export default async function BrandPage({ params, searchParams }: PageProps) {
  const { locale, slug } = await params
  if (!isValidLocale(locale)) notFound()

  const brand = await getBrandBySlug(slug)
  if (!brand) notFound()

  const uk = locale !== 'ru'
  const sp = await searchParams
  const { page } = parseSearchParams(sp)

  const { products, total, totalPages } = await getBrandProducts({
    brandSlug: slug,
    locale: locale as 'uk' | 'ru',
    page: page ?? 1,
  })

  const breadcrumbs = [
    { name: uk ? 'Головна' : 'Главная', url: `/${locale}` },
    { name: uk ? 'Бренди' : 'Бренды', url: `/${locale}/brands` },
    { name: brand.name },
  ]

  return (
    <div className="min-h-[calc(100vh-200px)] bg-surface-alt py-6 lg:py-8">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-20">
        <Breadcrumbs items={breadcrumbs} locale={locale} />

        {/* Brand Header */}
        <div className="flex items-center gap-5 mt-4 mb-8 bg-white border border-border rounded-2xl p-6 shadow-sm">
          {brand.logo && (
            <div className="size-20 shrink-0 flex items-center justify-center border border-border rounded-xl p-2 bg-white">
              <Image
                src={brand.logo}
                alt={brand.name}
                width={72}
                height={72}
                className="object-contain max-h-16"
              />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-text-primary">{brand.name}</h1>
            <p className="text-sm text-text-muted mt-1">
              {total} {uk ? 'товарів у каталозі' : 'товаров в каталоге'}
            </p>
          </div>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-12 text-text-muted text-sm">
            {uk ? 'Товари цього бренду тимчасово відсутні' : 'Товары этого бренда временно отсутствуют'}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((product) => {
                const name = product.translations[0]?.name ?? product.sku
                const price = Number(product.price)
                const comparePrice = product.comparePrice ? Number(product.comparePrice) : null
                const imageUrl = product.images[0]?.url ?? null

                return (
                  <Link
                    key={product.id}
                    href={`/${locale}/product/${product.slug}` as never}
                    className="group bg-white border border-border rounded-2xl overflow-hidden hover:border-accent/30 hover:shadow-md transition-all"
                  >
                    <div className="aspect-square relative bg-surface-alt">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={name}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                          unoptimized={imageUrl.startsWith('https://placehold.co')}
                        />
                      ) : (
                        <div className="size-full flex items-center justify-center text-text-muted text-xs">
                          —
                        </div>
                      )}
                    </div>
                    <div className="p-3.5">
                      <p className="text-xs text-text-muted mb-1">{product.sku}</p>
                      <h3 className="text-sm font-semibold text-text-primary line-clamp-2 mb-2 group-hover:text-accent transition-colors">
                        {name}
                      </h3>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-base font-bold text-text-primary num">
                          {price.toLocaleString(locale === 'uk' ? 'uk-UA' : 'ru-RU')} ₴
                        </span>
                        {comparePrice && comparePrice > price && (
                          <span className="text-xs text-text-muted line-through num">
                            {comparePrice.toLocaleString(locale === 'uk' ? 'uk-UA' : 'ru-RU')} ₴
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <Link
                    key={p}
                    href={`/${locale}/brands/${slug}?page=${p}` as never}
                    className={`size-10 rounded-lg text-sm font-bold flex items-center justify-center border transition-colors ${
                      p === page
                        ? 'bg-accent text-white border-accent'
                        : 'bg-white text-text-primary border-border hover:border-accent hover:text-accent'
                    }`}
                  >
                    {p}
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
