'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Minus, Plus } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { discountForQty, normalizeTiers, type WholesaleTier } from '@/lib/wholesale'
import { AddToCartButton } from '@/components/cart/add-to-cart-button'
import { ReminderRequestButton } from '@/components/product/reminder-request-button'
import { WholesaleChart } from '@/components/product/wholesale-chart'

interface ProductBuyBoxProps {
  productId: string
  productName: string
  productSku: string
  price: number
  comparePrice: number | null
  discount: number
  stock: number
  inStock: boolean
  breaks: WholesaleTier[]
}

export function ProductBuyBox({
  productId,
  productName,
  productSku,
  price,
  comparePrice,
  discount,
  stock,
  inStock,
  breaks,
}: ProductBuyBoxProps) {
  const t = useTranslations('pdp')
  const max = Math.max(1, stock)
  const [qty, setQty] = useState(1)

  const tiers = normalizeTiers(breaks)
  const wholesaleDiscount = discountForQty(qty, tiers)
  const unitPrice = price * (1 - wholesaleDiscount / 100)
  const sum = unitPrice * qty

  const stepBtn =
    'w-8 h-8 rounded flex items-center justify-center text-text-primary hover:bg-surface-alt active:bg-surface-raised transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer'

  return (
    <div className="flex flex-col gap-3 mt-1">
      {/* Price + quantity + live sum */}
      <div className="flex items-center gap-x-5 gap-y-2 flex-wrap">
        <div className="flex items-end gap-3.5">
          <span className="text-[38px] font-extrabold tracking-tight leading-none num text-text-primary">
            {formatPrice(price)}
          </span>
          {comparePrice && comparePrice > price && (
            <>
              <span className="text-base line-through num text-text-muted pb-1">{formatPrice(comparePrice)}</span>
              <span className="text-xs font-bold text-success pb-1.5">−{discount}%</span>
            </>
          )}
        </div>

        {inStock && (
          <>
            <div className="flex items-center border border-border rounded-lg bg-surface-white h-11 px-1 shrink-0 select-none">
              <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1} aria-label={t('buyBox.decrease')} className={stepBtn}>
                <Minus className="size-3.5" strokeWidth={2.5} />
              </button>
              <span className="w-10 text-center font-extrabold text-text-primary text-[15px] pointer-events-none select-none">{qty}</span>
              <button type="button" onClick={() => setQty((q) => Math.min(max, q + 1))} disabled={qty >= max} aria-label={t('buyBox.increase')} className={stepBtn}>
                <Plus className="size-3.5" strokeWidth={2.5} />
              </button>
            </div>

            <div className="flex flex-col leading-tight">
              <span className="text-[11px] font-medium uppercase tracking-wide text-text-muted">{t('buyBox.sum')}</span>
              <span className="text-xl font-extrabold num leading-none text-text-primary">{formatPrice(sum)}</span>
              {wholesaleDiscount > 0 && (
                <span className="text-[11px] font-semibold text-success mt-0.5 num">
                  {formatPrice(unitPrice)}/{t('qtyBreaks.unit')} · {t('buyBox.opt')} −{wholesaleDiscount}%
                </span>
              )}
            </div>
          </>
        )}
      </div>

      {/* Interactive wholesale chart */}
      {inStock && tiers.length > 0 && (
        <WholesaleChart breaks={breaks} qty={qty} onSelectQty={(q) => setQty(Math.min(max, Math.max(1, q)))} title={t('qtyBreaks.title')} />
      )}

      {/* CTA */}
      {inStock ? (
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="sm:flex-1">
            <AddToCartButton productId={productId} productName={productName} variant="full" quantity={qty} stock={stock} />
          </div>
          <ReminderRequestButton
            type="purchase"
            productId={productId}
            productName={productName}
            productSku={productSku}
            variant="secondary"
            className="sm:shrink-0"
          />
        </div>
      ) : (
        <ReminderRequestButton
          type="back_in_stock"
          productId={productId}
          productName={productName}
          productSku={productSku}
          variant="primary"
          className="w-full"
        />
      )}
    </div>
  )
}
