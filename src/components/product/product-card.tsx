import Image from 'next/image'
import Link from 'next/link'
import { Check } from 'lucide-react'
import type { Locale } from '@/types'
import { formatPrice, getDiscountPercent } from '@/lib/utils'
import { AddToCartButton } from '@/components/cart/add-to-cart-button'

// ─── Тип товара из Prisma (tasks 1.9 productCardSelect) ──────────────────────

export interface PrismaProductCard {
  id: string
  slug: string
  sku: string
  price: { toString(): string } // Decimal
  comparePrice: { toString(): string } | null
  stock: number
  isActive: boolean
  isFeatured: boolean
  createdAt: Date
  translations: { locale: string; name: string }[]
  images: { url: string; alt: string | null; sortOrder: number }[]
  brand: { slug: string; name: string } | null
  category: { slug: string }
}

interface ProductCardProps {
  product: PrismaProductCard
  locale: Locale
  view?: 'grid' | 'list'
}

export default function ProductCard({ product, locale, view = 'grid' }: ProductCardProps) {
  const name = product.translations.find(t => t.locale === locale)?.name
    ?? product.translations[0]?.name
    ?? product.sku

  const price = Number(product.price.toString())
  const comparePrice = product.comparePrice ? Number(product.comparePrice.toString()) : null

  const inStock = product.stock > 0
  const discount = getDiscountPercent(price, comparePrice)
  const mainImage = product.images[0]

  const stockLabel = locale === 'uk'
    ? (inStock ? 'В наявності' : 'Немає')
    : (inStock ? 'В наличии' : 'Нет')

  const brandName = product.brand?.name ?? ''

  if (view === 'list') {
    return (
      <article className="flex gap-4 rounded-lg p-4 transition-shadow hover:shadow-md group border border-border bg-surface-white">
        {/* Image */}
        <Link
          href={`/${locale}/product/${product.slug}`}
          className="relative shrink-0 w-[140px] h-[140px] rounded-md flex items-center justify-center overflow-hidden bg-surface-alt"
        >
          {discount > 0 && (
            <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded text-[10px] font-bold text-white z-10 bg-destructive">
              -{discount}%
            </div>
          )}
          {mainImage ? (
            <Image
              src={mainImage.url}
              alt={mainImage.alt ?? name}
              fill
              className="object-contain p-2"
              sizes="140px"
              unoptimized={mainImage.url.startsWith('https://placehold.co')}
            />
          ) : (
            <div className="size-14 rounded-lg flex items-center justify-center bg-surface-raised">
              <span className="text-xl font-bold text-border-strong">
                {brandName.charAt(0)}
              </span>
            </div>
          )}
        </Link>

        {/* Info */}
        <div className="flex flex-col flex-1 min-w-0 gap-1">
          <span className="text-[10px] font-semibold tracking-wider uppercase text-text-muted">
            {brandName}
          </span>
          <Link
            href={`/${locale}/product/${product.slug}`}
            className="text-[13px] font-medium leading-snug line-clamp-2 hover:text-accent transition-colors"
          >
            {name}
          </Link>
          <span className="text-[11px] font-mono text-text-muted">
            {product.sku}
          </span>

          {/* Stock badge */}
          <div
            className={`inline-flex items-center gap-1 w-fit px-2 py-0.5 rounded text-[10px] font-semibold mt-1 ${
              inStock ? 'bg-success-subtle text-success' : 'bg-destructive/8 text-destructive'
            }`}
          >
            {inStock && <Check className="size-3" strokeWidth={2.5} />}
            {stockLabel}
          </div>
        </div>

        {/* Price + cart */}
        <div className="flex flex-col items-end justify-between shrink-0 ml-4">
          <div className="text-right">
            {comparePrice && comparePrice > price && (
              <p className="text-[12px] line-through num text-text-muted">
                {formatPrice(comparePrice)}
              </p>
            )}
            <p
              className={`text-lg font-bold num ${
                discount > 0 ? 'text-destructive' : 'text-text-primary'
              }`}
            >
              {formatPrice(price)}
            </p>
          </div>
          <AddToCartButton
            productId={product.id}
            productName={name}
            disabled={!inStock}
            variant="full"
            className="h-9 px-4 text-[13px]"
          />
        </div>
      </article>
    )
  }

  // Grid view (default)
  return (
    <article className="flex flex-col rounded-lg overflow-hidden transition-shadow hover:shadow-md group border border-border bg-surface-white">
      {/* Image */}
      <Link
        href={`/${locale}/product/${product.slug}`}
        className="relative h-[160px] flex items-center justify-center overflow-hidden bg-surface-alt"
      >
        {/* Stock badge */}
        <div
          className={`absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold z-10 ${
            inStock ? 'bg-success-subtle text-success' : 'bg-destructive/8 text-destructive'
          }`}
        >
          {inStock && <Check className="size-3" strokeWidth={2.5} />}
          {stockLabel}
        </div>

        {/* Discount badge */}
        {discount > 0 && (
          <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[10px] font-bold text-white z-10 bg-destructive">
            -{discount}%
          </div>
        )}

        {mainImage ? (
          <Image
            src={mainImage.url}
            alt={mainImage.alt ?? name}
            fill
            className="object-contain p-3"
            sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
            unoptimized={mainImage.url.startsWith('https://placehold.co')}
          />
        ) : (
          <div className="size-16 rounded-lg flex items-center justify-center bg-surface-raised">
            <span className="text-2xl font-bold text-border-strong">
              {brandName.charAt(0)}
            </span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-3 gap-1">
        <span className="text-[10px] font-semibold tracking-wider uppercase text-text-muted">
          {brandName}
        </span>
        <Link
          href={`/${locale}/product/${product.slug}`}
          className="text-[13px] font-medium leading-snug line-clamp-2 min-h-[36px] hover:text-accent transition-colors"
        >
          {name}
        </Link>
        <span className="text-[11px] font-mono text-text-muted">
          {product.sku}
        </span>

        {/* Price + cart */}
        <div className="mt-auto pt-2 flex items-end justify-between">
          <div>
            {comparePrice && comparePrice > price && (
              <p className="text-[11px] line-through num text-text-muted">
                {formatPrice(comparePrice)}
              </p>
            )}
            <p
              className={`text-lg font-bold num ${
                discount > 0 ? 'text-destructive' : 'text-text-primary'
              }`}
            >
              {formatPrice(price)}
            </p>
          </div>
          <AddToCartButton
            productId={product.id}
            productName={name}
            disabled={!inStock}
            variant="icon"
          />
        </div>
      </div>
    </article>
  )
}
