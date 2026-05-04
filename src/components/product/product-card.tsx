'use client'

import { useState } from 'react'
import { Check, ShoppingCart, Star, ChevronDown } from 'lucide-react'
import type { CatalogProduct, Locale } from '@/types'

interface ProductCardProps {
  product: CatalogProduct
  locale: Locale
  view?: 'grid' | 'list'
}

/** Collapsible wholesale prices dropdown */
function WholesalePrices({
  qtyBreaks,
  locale,
  compact = false,
}: {
  qtyBreaks: CatalogProduct['qtyBreaks']
  locale: Locale
  compact?: boolean
}) {
  const [open, setOpen] = useState(false)

  if (qtyBreaks.length === 0) return null

  const label = locale === 'uk' ? 'Оптові ціни' : 'Оптовые цены'
  const fromLabel = locale === 'uk' ? 'від' : 'от'
  const unitLabel = locale === 'uk' ? 'шт' : 'шт'

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setOpen(!open)
        }}
        className="inline-flex items-center gap-1 cursor-pointer transition-colors hover:opacity-80"
        style={{ color: 'var(--color-accent)' }}
      >
        <span className={compact ? 'text-[10px]' : 'text-[11px]'} style={{ fontWeight: 500 }}>
          {label}
        </span>
        <ChevronDown
          className="size-3 transition-transform duration-200"
          strokeWidth={1.5}
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>

      {open && (
        <div
          className="mt-1 rounded-md py-1.5 px-2.5 flex flex-col gap-0.5"
          style={{
            background: 'var(--color-surface-alt)',
            border: '1px solid var(--color-border)',
          }}
        >
          {qtyBreaks.map((qb) => (
            <div
              key={qb.minQty}
              className={`flex items-baseline justify-between gap-2 ${compact ? 'text-[10px]' : 'text-[11px]'}`}
            >
              <span style={{ color: 'var(--color-text-primary)', fontWeight: 600 }} className="num">
                {qb.unitPrice.toLocaleString('uk-UA', { minimumFractionDigits: 2 })} ₴
              </span>
              <span style={{ color: 'var(--color-text-muted)' }}>
                {fromLabel} {qb.minQty} {unitLabel}.
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function ProductCard({ product, locale, view = 'grid' }: ProductCardProps) {
  const inStock = product.stock > 0
  const hasDiscount = product.comparePrice && product.comparePrice > product.price
  const discount = hasDiscount
    ? Math.round((1 - product.price / product.comparePrice!) * 100)
    : 0

  const stockLabel = locale === 'uk'
    ? (inStock ? 'В наявності' : 'Немає')
    : (inStock ? 'В наличии' : 'Нет')

  const addLabel = locale === 'uk' ? 'Додати' : 'Добавить'

  if (view === 'list') {
    return (
      <article
        className="flex gap-4 rounded-lg p-4 transition-shadow hover:shadow-md group"
        style={{ border: '1px solid var(--color-border)', background: '#fff' }}
      >
        {/* Image placeholder */}
        <div
          className="relative shrink-0 w-[140px] h-[140px] rounded-md flex items-center justify-center"
          style={{ background: 'var(--color-surface-alt)' }}
        >
          {hasDiscount && (
            <div
              className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded text-[10px] font-bold text-white"
              style={{ background: 'var(--color-destructive)' }}
            >
              -{discount}%
            </div>
          )}
          <div className="size-14 rounded-lg flex items-center justify-center" style={{ background: 'var(--color-surface-raised)' }}>
            <span className="text-xl font-bold" style={{ color: 'var(--color-border-strong)' }}>
              {product.brand.charAt(0)}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col flex-1 min-w-0 gap-1">
          <span className="text-[10px] font-semibold tracking-wider uppercase" style={{ color: 'var(--color-text-muted)' }}>
            {product.brand}
          </span>
          <p className="text-[13px] font-medium leading-snug line-clamp-2 group-hover:text-[var(--color-accent)] transition-colors">
            {product.name[locale]}
          </p>
          <span className="text-[11px] font-mono" style={{ color: 'var(--color-text-muted)' }}>
            {product.sku}
          </span>

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center gap-1 mt-0.5">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className="size-3"
                    fill={s <= Math.round(product.rating!) ? 'var(--color-accent)' : 'none'}
                    stroke={s <= Math.round(product.rating!) ? 'var(--color-accent)' : 'var(--color-border-strong)'}
                    strokeWidth={1.5}
                  />
                ))}
              </div>
              <span className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>
                ({product.reviewsCount})
              </span>
            </div>
          )}

          {/* Stock badge */}
          <div
            className="inline-flex items-center gap-1 w-fit px-2 py-0.5 rounded text-[10px] font-semibold mt-1"
            style={{
              background: inStock ? 'var(--color-success-subtle)' : 'rgba(220,38,38,0.08)',
              color: inStock ? 'var(--color-success)' : 'var(--color-destructive)',
            }}
          >
            {inStock && <Check className="size-3" strokeWidth={2.5} />}
            {stockLabel}
          </div>
        </div>

        {/* Price + cart */}
        <div className="flex flex-col items-end justify-between shrink-0 ml-4">
          <div className="text-right">
            {hasDiscount && (
              <p className="text-[12px] line-through num" style={{ color: 'var(--color-text-muted)' }}>
                {product.comparePrice!.toLocaleString('uk-UA')} ₴
              </p>
            )}
            <p className="text-lg font-bold num" style={{ color: hasDiscount ? 'var(--color-destructive)' : 'var(--color-text-primary)' }}>
              {product.price.toLocaleString('uk-UA')} ₴
            </p>
            <WholesalePrices qtyBreaks={product.qtyBreaks} locale={locale} />
          </div>
          <button
            className="h-9 px-4 rounded-md flex items-center justify-center gap-2 text-[13px] font-medium transition-colors cursor-pointer"
            style={{ background: 'var(--color-accent)', color: '#fff' }}
            aria-label={`${addLabel} ${product.name[locale]}`}
          >
            <ShoppingCart className="size-4" strokeWidth={1.5} />
            {addLabel}
          </button>
        </div>
      </article>
    )
  }

  // Grid view (default)
  return (
    <article
      className="flex flex-col rounded-lg overflow-hidden transition-shadow hover:shadow-md group"
      style={{ border: '1px solid var(--color-border)', background: '#fff' }}
    >
      {/* Image placeholder */}
      <div
        className="relative h-[160px] flex items-center justify-center"
        style={{ background: 'var(--color-surface-alt)' }}
      >
        {/* Stock badge */}
        <div
          className="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold"
          style={{
            background: inStock ? 'var(--color-success-subtle)' : 'rgba(220,38,38,0.08)',
            color: inStock ? 'var(--color-success)' : 'var(--color-destructive)',
          }}
        >
          {inStock && <Check className="size-3" strokeWidth={2.5} />}
          {stockLabel}
        </div>

        {/* Discount badge */}
        {hasDiscount && (
          <div
            className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[10px] font-bold text-white"
            style={{ background: 'var(--color-destructive)' }}
          >
            -{discount}%
          </div>
        )}

        {/* Placeholder icon */}
        <div className="size-16 rounded-lg flex items-center justify-center" style={{ background: 'var(--color-surface-raised)' }}>
          <span className="text-2xl font-bold" style={{ color: 'var(--color-border-strong)' }}>
            {product.brand.charAt(0)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-3 gap-1">
        <span className="text-[10px] font-semibold tracking-wider uppercase" style={{ color: 'var(--color-text-muted)' }}>
          {product.brand}
        </span>
        <p className="text-[13px] font-medium leading-snug line-clamp-2 min-h-[36px] group-hover:text-[var(--color-accent)] transition-colors">
          {product.name[locale]}
        </p>
        <span className="text-[11px] font-mono" style={{ color: 'var(--color-text-muted)' }}>
          {product.sku}
        </span>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-1 mt-0.5">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className="size-3"
                  fill={s <= Math.round(product.rating!) ? 'var(--color-accent)' : 'none'}
                  stroke={s <= Math.round(product.rating!) ? 'var(--color-accent)' : 'var(--color-border-strong)'}
                  strokeWidth={1.5}
                />
              ))}
            </div>
            <span className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>
              ({product.reviewsCount})
            </span>
          </div>
        )}

        {/* Price + cart */}
        <div className="mt-auto pt-2 flex items-end justify-between">
          <div>
            {hasDiscount && (
              <p className="text-[11px] line-through num" style={{ color: 'var(--color-text-muted)' }}>
                {product.comparePrice!.toLocaleString('uk-UA')} ₴
              </p>
            )}
            <p className="text-lg font-bold num" style={{ color: hasDiscount ? 'var(--color-destructive)' : 'var(--color-text-primary)' }}>
              {product.price.toLocaleString('uk-UA')} ₴
            </p>
            <WholesalePrices qtyBreaks={product.qtyBreaks} locale={locale} compact />
          </div>
          <button
            className="size-9 rounded-md flex items-center justify-center transition-colors cursor-pointer hover:opacity-90"
            style={{ background: 'var(--color-accent)', color: '#fff' }}
            aria-label={`${addLabel} ${product.name[locale]}`}
          >
            <ShoppingCart className="size-[18px]" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </article>
  )
}
