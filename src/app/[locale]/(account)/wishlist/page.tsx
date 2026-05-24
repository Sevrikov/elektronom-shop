import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { auth } from '@/lib/auth'
import { getWishlist } from '@/actions/user'
import { Heart, ShoppingBag } from 'lucide-react'
import Image from 'next/image'

interface PageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const uk = locale !== 'ru'
  return {
    title: `${uk ? 'Обране' : 'Избранное'} | Electronom`,
  }
}

export default async function WishlistPage({ params }: PageProps) {
  const { locale } = await params
  const uk = locale !== 'ru'

  const session = await auth()
  if (!session?.user) notFound()

  const { items } = await getWishlist(locale)

  return (
    <div>
      <h2 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-2">
        <Heart className="size-5 text-destructive" />
        {uk ? 'Список обраного' : 'Список избранного'}
      </h2>

      {items.length === 0 ? (
        <div className="text-center py-16">
          <Heart className="size-12 text-border mx-auto mb-4" />
          <p className="text-text-muted text-sm mb-4">
            {uk ? 'Ви ще не додали жодного товару до обраного' : 'Вы ещё не добавили ни одного товара в избранное'}
          </p>
          <Link
            href={`/${locale}/catalog` as never}
            className="inline-flex items-center gap-2 h-10 px-5 bg-accent text-white font-semibold rounded-lg hover:bg-accent-hover transition-colors text-sm"
          >
            <ShoppingBag className="size-4" />
            {uk ? 'До каталогу' : 'В каталог'}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map(({ id, product }) => {
            if (!product || !product.isActive) return null
            const name = product.translations[0]?.name ?? product.sku
            const price = Number(product.price)
            const comparePrice = product.comparePrice ? Number(product.comparePrice) : null
            const imageUrl = product.images[0]?.url ?? null
            const inStock = product.stock > 0

            return (
              <div
                key={id}
                className="group bg-white border border-border rounded-2xl overflow-hidden hover:border-accent/30 hover:shadow-md transition-all"
              >
                {/* Image */}
                <Link href={`/${locale}/product/${product.slug}` as never} className="block aspect-square relative bg-surface-alt">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                      unoptimized={imageUrl.startsWith('https://placehold.co')}
                    />
                  ) : (
                    <div className="size-full flex items-center justify-center text-text-muted text-xs">
                      {uk ? 'Немає фото' : 'Нет фото'}
                    </div>
                  )}
                  {!inStock && (
                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                      <span className="text-xs font-bold text-text-muted bg-white px-3 py-1 rounded-full border border-border">
                        {uk ? 'Немає в наявності' : 'Нет в наличии'}
                      </span>
                    </div>
                  )}
                </Link>

                {/* Info */}
                <div className="p-4">
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">
                    {product.brand?.name ?? ''}
                  </p>
                  <Link href={`/${locale}/product/${product.slug}` as never} className="hover:text-accent transition-colors">
                    <h3 className="text-sm font-semibold text-text-primary line-clamp-2 mb-3">{name}</h3>
                  </Link>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-lg font-bold text-text-primary num">
                      {price.toLocaleString(locale === 'uk' ? 'uk-UA' : 'ru-RU')} ₴
                    </span>
                    {comparePrice && comparePrice > price && (
                      <span className="text-sm text-text-muted line-through num">
                        {comparePrice.toLocaleString(locale === 'uk' ? 'uk-UA' : 'ru-RU')} ₴
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
