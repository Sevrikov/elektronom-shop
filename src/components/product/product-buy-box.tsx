'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Minus, Plus, Truck } from 'lucide-react'
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
  const locale = useLocale()
  const isRu = locale === 'ru'

  const max = Math.max(1, stock)
  const [qty, setQty] = useState(1)

  const tiers = normalizeTiers(breaks)
  const wholesaleDiscount = discountForQty(qty, tiers)
  const unitPrice = price * (1 - wholesaleDiscount / 100)
  const sum = unitPrice * qty

  const stepBtn =
    'w-6 h-6 rounded flex items-center justify-center text-text-primary hover:bg-surface-alt active:bg-surface-raised transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer'

  return (
    <div className="flex flex-col gap-2 mt-1">
      {/* 1-row layout with STABLE FIXED HEIGHTS & MINIMAL GAPS */}
      <div className="flex items-center gap-x-1.5 gap-y-1 flex-wrap sm:flex-nowrap">
        {/* Main Unit Price */}
        <div className="flex items-end gap-1 shrink-0 min-w-[95px]">
          <span className="text-[28px] xl:text-[32px] font-extrabold tracking-tight leading-none num text-text-primary">
            {formatPrice(price)}
          </span>
          {comparePrice && comparePrice > price && (
            <div className="flex flex-col leading-none pb-0.5">
              <span className="text-[11px] line-through num text-text-muted">{formatPrice(comparePrice)}</span>
              <span className="text-[10px] font-bold text-success">−{discount}%</span>
            </div>
          )}
        </div>

        {inStock && (
          <>
            {/* Stepper */}
            <div className="flex items-center border border-border rounded-lg bg-surface-white h-9 px-1 shrink-0 select-none">
              <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1} aria-label={t('buyBox.decrease')} className={stepBtn}>
                <Minus className="size-3 text-text-primary" strokeWidth={2.5} />
              </button>
              <span className="w-7 text-center font-extrabold text-text-primary text-[13px] pointer-events-none select-none">{qty}</span>
              <button type="button" onClick={() => setQty((q) => Math.min(max, q + 1))} disabled={qty >= max} aria-label={t('buyBox.increase')} className={stepBtn}>
                <Plus className="size-3 text-text-primary" strokeWidth={2.5} />
              </button>
            </div>

            {/* Live Sum & Free Delivery progress - FIXED WIDTH + RESERVED HEIGHT (no vertical jitter) */}
            <div className="flex flex-col leading-tight shrink-0 w-[112px]">
              <span className="text-[10px] font-medium uppercase tracking-wide text-text-muted">{t('buyBox.sum')}</span>
              <span className="text-[15px] xl:text-[16px] font-extrabold num leading-none text-text-primary truncate">{formatPrice(sum)}</span>

              {/* Wholesale unit price line with fixed height slot */}
              <div className="h-[14px] flex items-center">
                {wholesaleDiscount > 0 ? (
                  <span className="text-[9px] font-semibold text-success num truncate">
                    {formatPrice(unitPrice)}/{t('qtyBreaks.unit')} · −{wholesaleDiscount}%
                  </span>
                ) : (
                  <span className="text-[8.5px] font-medium text-text-muted truncate">
                    {formatPrice(price)}/{t('qtyBreaks.unit')}
                  </span>
                )}
              </div>

              {/* Free delivery indicator connected to sum & 1500 UAH threshold - RESERVED CONSTANT HEIGHT (NO JITTER!) */}
              <div className="h-[18px] flex items-center mt-0.5">
                {sum >= 1500 ? (
                  <span className="inline-flex items-center gap-1 text-[8.5px] font-extrabold text-success bg-success-subtle px-1.5 py-0.5 rounded border border-success/30">
                    <Truck className="size-2.5 text-success shrink-0" strokeWidth={2.5} />
                    + 🚚 0 ₴
                  </span>
                ) : (
                  <span className="text-[8.5px] font-medium text-text-muted block truncate">
                    {isRu ? 'До 🚚 0 ₴ ещё ' : 'До 🚚 0 ₴ ще '}
                    <strong className="text-success font-extrabold num">{formatPrice(1500 - sum)}</strong>
                  </span>
                )}
              </div>
            </div>

            {/* Sparkline chart - Position is now strictly tight against Sum with NO gap! */}
            {tiers.length > 0 && <WholesaleChart breaks={breaks} qty={qty} unitPrice={unitPrice} />}

            {/* Compact Red Nova Poshta 0 UAH badge triggered at 1500 UAH */}
            {sum >= 1500 && (
              <div className="flex items-center gap-1.5 bg-[#da291c]/10 border border-[#da291c]/40 px-2 py-0.5 rounded-lg shrink-0 animate-in fade-in zoom-in-95 duration-200 shadow-2xs">
                <div className="relative flex items-center justify-center size-7 rounded bg-[#da291c] text-white shrink-0">
                  <Truck className="size-3.5 text-white" strokeWidth={2.2} />
                  <span className="absolute -bottom-1 -right-1 bg-white text-[#da291c] text-[6.5px] font-black px-0.5 rounded border border-[#da291c] leading-none">
                    НП
                  </span>
                </div>

                <div className="flex flex-col leading-tight">
                  <div className="flex items-baseline gap-1">
                    <span className="text-[13px] font-black text-[#da291c] num leading-none">0 ₴</span>
                    <span className="text-[8.5px] font-extrabold text-[#da291c] uppercase">{isRu ? 'Доставка' : 'Доставка'}</span>
                  </div>
                  <span className="text-[8.5px] font-bold text-text-muted mt-0.5">
                    {isRu ? 'Новая Почта' : 'Нова Пошта'}
                  </span>
                </div>
              </div>
            )}
          </>
        )}
      </div>

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
