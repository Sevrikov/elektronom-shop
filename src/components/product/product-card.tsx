import Link from 'next/link'
import { Check } from 'lucide-react'
import { useTranslations } from 'next-intl'
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
  const t = useTranslations('productCard')

  const name = product.translations.find(t => t.locale === locale)?.name
    ?? product.translations[0]?.name
    ?? product.sku

  const price = Number(product.price.toString())
  const comparePrice = product.comparePrice ? Number(product.comparePrice.toString()) : null

  const inStock = product.stock > 0
  const stockLabel = inStock ? t('inStock') : t('outOfStock')

  const discount = getDiscountPercent(price, comparePrice)
  const mainImage = product.images[0]
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
      <article className="flex gap-4 rounded-lg p-4 transition-shadow hover:shadow-md group border border-border bg-surface-white [&_button.absolute]:max-lg:opacity-100">
        {/* Image */}
        <Link
          href={`/${locale}/product/${product.slug}`}
          className="relative shrink-0 w-[140px] h-[140px] rounded-md flex items-center justify-center overflow-hidden bg-surface-alt border border-border/10"
        >
          {discount > 0 && (
            <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded text-[10px] font-bold text-white z-10 bg-destructive select-none">
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
        <div className="flex flex-col flex-1 min-w-0 gap-0.5">
          <span className="text-[10px] font-bold tracking-wider uppercase text-text-muted">
            {brandName}
          </span>

          {/* Stock line */}
          <div
            className={`inline-flex items-center gap-1.5 text-[11.5px] font-bold py-0.5 ${
              inStock ? 'text-success' : 'text-error'
            }`}
          >
            {inStock ? (
              <Check className="size-3" strokeWidth={3} />
            ) : (
              <span className="size-1.5 rounded-full bg-error" />
            )}
            <span>{stockLabel}</span>
          </div>

          <Link
            href={`/${locale}/product/${product.slug}`}
            className="text-[13.5px] font-semibold leading-snug line-clamp-2 hover:text-accent transition-colors mt-0.5 text-text-primary"
          >
            {name}
          </Link>

          <span className="text-[10.5px] font-mono text-text-muted mt-0.5">
            {t('sku')}: {product.sku}
          </span>

          {/* Attributes List */}
          {displayEntries.length > 0 && (
            <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1.5 text-[11px] border-t border-border/60 pt-2.5 max-w-[480px]">
              {displayEntries.map(([key, value]) => {
                const label = translateAttributeKey(key, locale === 'ru' ? 'ru' : 'uk')
                let valStr = ''
                if (typeof value === 'boolean') {
                  valStr = value ? t('yes') : t('no')
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
        <div className="flex flex-col items-end justify-between shrink-0 ml-4 min-w-[145px]">
          <div className="text-right flex flex-col gap-0.5">
            {comparePrice && comparePrice > price && (
              <>
                <span className="text-[12px] line-through num text-text-muted">
                  {formatPrice(comparePrice)}
                </span>
                <span className="text-[11px] font-semibold text-success bg-success-subtle px-1.5 py-0.5 rounded leading-none inline-block">
                  {t('savings', { amount: formatPrice(comparePrice - price) })}
                </span>
              </>
            )}
            <span
              className={`text-xl font-extrabold num leading-tight ${
                discount > 0 ? 'text-destructive' : 'text-text-primary'
              }`}
            >
              {formatPrice(price)}
            </span>
          </div>
          <div className="flex items-center gap-1.5 w-full mt-3 justify-end">
            <WishlistButton productId={product.id} className="size-9" />
            <AddToCartButton
              productId={product.id}
              productName={name}
              disabled={!inStock}
              variant="full"
              text={t('buy')}
              className="h-9 px-4 text-xs font-bold font-sans rounded-lg"
            />
          </div>
        </div>
      </article>
    )
  }

  // Grid view (default)

  return (
    <article className="relative flex flex-col rounded-xl border border-border bg-surface-white transition-all duration-200 group hover:shadow-lg hover:border-accent/40 hover:z-20 [&_button.absolute]:max-lg:opacity-100">
      {/* Image */}
      <Link
        href={`/${locale}/product/${product.slug}`}
        className="relative w-full aspect-square flex items-center justify-center overflow-hidden bg-surface-alt rounded-t-xl"
      >
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

        <WishlistButton
          productId={product.id}
          className="absolute top-2 right-2 z-20 bg-surface-white border border-border hover:border-destructive hover:text-destructive rounded-full w-8 h-8 flex items-center justify-center p-0 shadow-sm opacity-0 group-hover:opacity-100 max-lg:opacity-100 transition-opacity duration-200"
        />

        {/* Badges aligned below top actions */}
        {product.isFeatured && (
          <div className="absolute top-[44px] left-2 z-10 px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider text-white bg-warning shadow-sm select-none">
            {t('hit')}
          </div>
        )}

        {discount > 0 && (
          <div className="absolute top-[44px] right-2 z-10 px-1.5 py-0.5 rounded text-[9px] font-extrabold text-white bg-destructive shadow-sm select-none">
            -{discount}%
          </div>
        )}

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
      <div className="flex flex-col flex-1 p-3 gap-1">
        {/* Brand + Stock Line */}
        <div className="flex flex-col gap-0.5">
          {brandName && (
            <span className="text-[10px] font-bold tracking-wider uppercase text-text-muted">
              {brandName}
            </span>
          )}
          {/* Stock line */}
          <div
            className={`inline-flex items-center gap-1.5 text-[11.5px] font-bold py-0.5 ${
              inStock ? 'text-success' : 'text-error'
            }`}
          >
            {inStock ? (
              <Check className="size-3" strokeWidth={3} />
            ) : (
              <span className="size-1.5 rounded-full bg-error" />
            )}
            <span>{stockLabel}</span>
          </div>
        </div>

        {/* Title */}
        <Link
          href={`/${locale}/product/${product.slug}`}
          className="text-[13px] font-semibold leading-snug line-clamp-2 min-h-[38px] text-text-primary hover:text-accent transition-colors mt-0.5"
        >
          {name}
        </Link>

        <span className="text-[10px] font-mono text-text-muted -mt-0.5">
          {t('sku')}: {product.sku}
        </span>

        {/* Top 2-3 specifications inline immediately */}
        {displayEntries.length > 0 && (
          <div className="mt-1.5 flex flex-col gap-0.5 text-[11px] border-t border-border/30 pt-2 pb-1">
            {displayEntries.slice(0, 3).map(([key, value]) => {
              const label = translateAttributeKey(key, locale === 'ru' ? 'ru' : 'uk')
              let valStr = ''
              if (typeof value === 'boolean') {
                valStr = value ? t('yes') : t('no')
              } else {
                valStr = translateAttributeValue(value, locale === 'ru' ? 'ru' : 'uk')
              }
              return (
                <div key={key} className="flex justify-between items-start gap-2 py-0.5">
                  <span className="text-text-muted font-medium text-left truncate max-w-[60%]">{label}:</span>
                  <span className="text-text-primary text-right font-semibold truncate max-w-[40%]">{valStr}</span>
                </div>
              )
            })}
          </div>
        )}

        {/* Price + cart */}
        <div className="mt-auto pt-2 flex flex-col gap-1 border-t border-border/20">
          <div className="flex items-baseline justify-between flex-wrap gap-x-2">
            <div className="flex flex-col">
              {comparePrice && comparePrice > price && (
                <span className="text-[11px] line-through num text-text-muted leading-tight">
                  {formatPrice(comparePrice)}
                </span>
              )}
              <span
                className={`text-lg font-extrabold num leading-none ${
                  discount > 0 ? 'text-destructive' : 'text-text-primary'
                }`}
              >
                {formatPrice(price)}
              </span>
            </div>
            {comparePrice && comparePrice > price && (
              <span className="text-[10px] font-bold text-success bg-success-subtle px-1.5 py-0.5 rounded leading-none inline-block">
                {t('savings', { amount: formatPrice(comparePrice - price) })}
              </span>
            )}
          </div>

          <div className="mt-2 w-full">
            <AddToCartButton
              productId={product.id}
              productName={name}
              disabled={!inStock}
              variant="full"
              text={t('buy')}
              className="h-9 px-4 text-xs font-bold font-sans rounded-lg w-full flex items-center justify-center gap-1.5"
            />
          </div>
        </div>
      </div>

      {/* Attributes Hover Panel (expanded specs on desktop hover) */}
      {displayEntries.length > 0 && (
        <div className="absolute -left-[1px] -right-[1px] top-full bg-surface-white border border-t-0 border-border group-hover:border-accent/40 rounded-b-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-30 px-2.5 pb-3 pt-1">
          <div className="border-t border-border/60 my-1.5" />
          <div className="flex flex-col gap-1 text-[11px]">
            {displayEntries.map(([key, value]) => {
              const label = translateAttributeKey(key, locale === 'ru' ? 'ru' : 'uk')
              let valStr = ''
              if (typeof value === 'boolean') {
                valStr = value ? t('yes') : t('no')
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
