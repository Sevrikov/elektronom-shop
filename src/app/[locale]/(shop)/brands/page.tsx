import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { isValidLocale } from '@/i18n/request'
import { notFound } from 'next/navigation'
import { getBrands } from '@/queries/brands'
import Breadcrumbs from '@/components/layout/breadcrumbs'

interface PageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const uk = locale !== 'ru'
  return {
    title: `${uk ? 'Бренди' : 'Бренды'} | ЕЛЕКТРОНОМ`,
    description: uk
      ? 'Офіційний дистриб\'ютор 40+ брендів електрообладнання. ABB, Schneider Electric, Legrand, Bosch та інші.'
      : 'Официальный дистрибьютор 40+ брендов электрооборудования. ABB, Schneider Electric, Legrand, Bosch и другие.',
  }
}

export default async function BrandsPage({ params }: PageProps) {
  const { locale } = await params
  if (!isValidLocale(locale)) notFound()

  const uk = locale !== 'ru'
  const brands = await getBrands()

  const breadcrumbs = [
    { name: uk ? 'Головна' : 'Главная', url: '/' },
    { name: uk ? 'Бренди' : 'Бренды' },
  ]

  return (
    <div className="min-h-[calc(100vh-200px)] bg-surface-alt py-6 lg:py-8">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-20">
        <Breadcrumbs items={breadcrumbs} locale={locale} />

        <h1 className="text-2xl font-bold text-text-primary mt-4 mb-2">
          {uk ? 'Бренди' : 'Бренды'}
        </h1>
        <p className="text-sm text-text-muted mb-8">
          {uk
            ? `Офіційний дистриб'ютор ${brands.length}+ брендів електрообладнання`
            : `Официальный дистрибьютор ${brands.length}+ брендов электрооборудования`}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/${locale}/brands/${brand.slug}` as never}
              className="group bg-white border border-border rounded-2xl p-5 flex flex-col items-center gap-3 hover:border-accent/30 hover:shadow-md transition-all"
            >
              {/* Logo */}
              <div className="h-14 flex items-center justify-center">
                {brand.logo ? (
                  <Image
                    src={brand.logo}
                    alt={brand.name}
                    width={120}
                    height={56}
                    className="object-contain max-h-14 grayscale group-hover:grayscale-0 transition-all duration-300"
                  />
                ) : (
                  <span className="text-xl font-extrabold text-text-muted group-hover:text-text-primary transition-colors">
                    {brand.name}
                  </span>
                )}
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-text-primary group-hover:text-accent transition-colors">
                  {brand.name}
                </p>
                <p className="text-[10px] text-text-muted mt-0.5">
                  {brand._count.products} {uk ? 'товарів' : 'товаров'}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
