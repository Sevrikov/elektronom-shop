import Link from 'next/link'
import { Check } from 'lucide-react'
import type { Locale } from '@/types'
import { formatPrice, getDiscountPercent } from '@/lib/utils'
import { AddToCartButton } from '@/components/cart/add-to-cart-button'
import { getTransformedImageUrl } from '@/lib/images'
import { TransparentImage } from '@/components/shared/transparent-image'
import { CompareButton } from '@/components/compare/compare-button'
import { WishlistButton } from '@/components/wishlist/wishlist-button'
import { translateAttributeKey, translateAttributeValue, sortAttributeEntries } from '@/lib/translit-translator'

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
  images: { url: string; processedUrl?: string | null; alt: string | null; sortOrder: number; provider: string; publicId?: string | null }[]
  brand: { slug: string; name: string } | null
  category: { slug: string }
  attributes: unknown
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

  const rawEntries = product.attributes &&
    typeof product.attributes === 'object' &&
    !Array.isArray(product.attributes)
    ? Object.entries(product.attributes)
    : []
  const filteredEntries = rawEntries.filter(
    ([key, value]) => value !== null && value !== undefined && value !== '' && key !== 'qty_breaks'
  )
  const sortedEntries = sortAttributeEntries(filteredEntries)
  const displayEntries = sortedEntries.slice(0, 6)

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
          <CompareButton
            productId={product.id}
            slug={product.slug}
            sku={product.sku}
            name={name}
            imageUrl={mainImage ? getTransformedImageUrl(mainImage, { width: 320, height: 320, crop: 'limit' }) : null}
            price={price}
            comparePrice={comparePrice}
            brandName={brandName}
            categorySlug={product.category.slug}
          />
          {mainImage ? (
            <TransparentImage
              src={getTransformedImageUrl(mainImage, { width: 320, height: 320, crop: 'limit' })}
              alt={mainImage.alt ?? name}
              className="p-2"
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

          {/* Attributes List */}
          {displayEntries.length > 0 && (
            <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1.5 text-[11px] border-t border-border/60 pt-2.5 max-w-[480px]">
              {displayEntries.map(([key, value]) => {
                const label = translateAttributeKey(key, locale === 'ru' ? 'ru' : 'uk')
                let valStr = ''
                if (typeof value === 'boolean') {
                  valStr = locale === 'ru' ? (value ? 'Да' : 'Нет') : (value ? 'Так' : 'Ні')
                } else {
                  valStr = translateAttributeValue(value, locale === 'ru' ? 'ru' : 'uk')
                }
                return (
                  <div key={key} className="flex justify-between items-start gap-2 py-0.5">
                    <span className="text-text-muted font-medium text-left break-words max-w-[60%]">{label}:</span>
                    <span className="text-text-primary text-right font-semibold break-words max-w-[40%]">{valStr}</span>
                  </div>
                )
              })}
            </div>
          )}
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
          <div className="flex items-center gap-1.5 w-full mt-2 justify-end">
            <WishlistButton productId={product.id} />
            <AddToCartButton
              productId={product.id}
              productName={name}
              disabled={!inStock}
              variant="full"
              className="h-9 px-4 text-[13px]"
            />
          </div>
        </div>
      </article>
    )
  }

  // Grid view (default)

  return (
    <article className="relative flex flex-col rounded-lg border border-border bg-surface-white transition-all duration-200 group hover:shadow-lg hover:border-accent/40 hover:z-20">
      {/* Image */}
      <Link
        href={`/${locale}/product/${product.slug}`}
        className="relative h-[140px] flex items-center justify-center overflow-hidden bg-surface-alt rounded-t-lg"
      >
        {/* Discount badge */}
        {discount > 0 && (
          <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[10px] font-bold text-white z-10 bg-destructive">
            -{discount}%
          </div>
        )}

        <CompareButton
          productId={product.id}
          slug={product.slug}
          sku={product.sku}
          name={name}
          imageUrl={mainImage ? getTransformedImageUrl(mainImage, { width: 320, height: 320, crop: 'limit' }) : null}
          price={price}
          comparePrice={comparePrice}
          brandName={brandName}
          categorySlug={product.category.slug}
        />

        {mainImage ? (
          <TransparentImage
            src={getTransformedImageUrl(mainImage, { width: 320, height: 320, crop: 'limit' })}
            alt={mainImage.alt ?? name}
            className="p-3"
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
      <div className="flex flex-col flex-1 p-2.5 gap-0.5">
        <div className="flex items-center gap-2 flex-wrap min-h-[18px]">
          {brandName && (
            <span className="text-[10px] font-semibold tracking-wider uppercase text-text-muted">
              {brandName}
            </span>
          )}
          {/* Stock badge */}
          <div
            className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-semibold ${
              inStock ? 'bg-success-subtle text-success' : 'bg-destructive/8 text-destructive'
            }`}
          >
            {inStock && <Check className="size-2.5" strokeWidth={2.5} />}
            {stockLabel}
          </div>
        </div>
        <Link
          href={`/${locale}/product/${product.slug}`}
          className="text-[12.5px] font-medium leading-snug line-clamp-2 min-h-[36px] hover:text-accent transition-colors"
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
          <div className="flex items-center gap-1.5 shrink-0">
            <WishlistButton productId={product.id} />
            <AddToCartButton
              productId={product.id}
              productName={name}
              disabled={!inStock}
              variant="icon"
            />
          </div>
        </div>
      </div>

      {/* Attributes Hover Panel */}
      {displayEntries.length > 0 && (
        <div className="absolute -left-[1px] -right-[1px] top-full bg-surface-white border border-t-0 border-border group-hover:border-accent/40 rounded-b-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-30 px-2.5 pb-3 pt-1">
          <div className="border-t border-border/60 my-1.5" />
          <div className="flex flex-col gap-1 text-[11px]">
            {displayEntries.map(([key, value]) => {
              const label = translateAttributeKey(key, locale === 'ru' ? 'ru' : 'uk')
              let valStr = ''
              if (typeof value === 'boolean') {
                valStr = locale === 'ru' ? (value ? 'Да' : 'Нет') : (value ? 'Так' : 'Ні')
              } else {
                valStr = translateAttributeValue(value, locale === 'ru' ? 'ru' : 'uk')
              }
              return (
                <div key={key} className="flex justify-between items-start gap-2 py-0.5">
                  <span className="text-text-muted font-medium text-left break-words max-w-[60%]">{label}:</span>
                  <span className="text-text-primary text-right font-semibold break-words max-w-[40%]">{valStr}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </article>
  )
}

