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
    'w-7 h-7 rounded flex items-center justify-center text-text-primary hover:bg-surface-alt active:bg-surface-raised transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer'

  return (
    <div className="flex flex-col gap-3 mt-1">
      {/* Price + quantity + live sum + chart + Nova Poshta 0 UAH trigger in 1 single row */}
      <div className="flex items-center gap-x-3.5 gap-y-2 flex-wrap sm:flex-nowrap">
        <div className="flex items-end gap-2.5 shrink-0">
          <span className="text-[34px] xl:text-[38px] font-extrabold tracking-tight leading-none num text-text-primary">
            {formatPrice(price)}
          </span>
          {comparePrice && comparePrice > price && (
            <>
              <span className="text-sm line-through num text-text-muted pb-0.5">{formatPrice(comparePrice)}</span>
              <span className="text-xs font-bold text-success pb-1">−{discount}%</span>
            </>
          )}
        </div>

        {inStock && (
          <>
            <div className="flex items-center border border-border rounded-lg bg-surface-white h-10 px-1 shrink-0 select-none">
              <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1} aria-label={t('buyBox.decrease')} className={stepBtn}>
                <Minus className="size-3.5" strokeWidth={2.5} />
              </button>
              <span className="w-8 text-center font-extrabold text-text-primary text-[14px] pointer-events-none select-none">{qty}</span>
              <button type="button" onClick={() => setQty((q) => Math.min(max, q + 1))} disabled={qty >= max} aria-label={t('buyBox.increase')} className={stepBtn}>
                <Plus className="size-3.5" strokeWidth={2.5} />
              </button>
            </div>

            <div className="flex flex-col leading-tight shrink-0">
              <span className="text-[10.5px] font-medium uppercase tracking-wide text-text-muted">{t('buyBox.sum')}</span>
              <span className="text-lg font-extrabold num leading-none text-text-primary">{formatPrice(sum)}</span>
              {wholesaleDiscount > 0 && (
                <span className="text-[10px] font-semibold text-success mt-0.5 num">
                  {formatPrice(unitPrice)}/{t('qtyBreaks.unit')} · −{wholesaleDiscount}%
                </span>
              )}

              {/* Free delivery indicator connected to sum & 1500 UAH threshold */}
              <div className="mt-0.5">
                {sum >= 1500 ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-success bg-success-subtle px-1.5 py-0.5 rounded border border-success/30">
                    <Truck className="size-3 text-success shrink-0" strokeWidth={2.5} />
                    + 🚚 0 ₴
                  </span>
                ) : (
                  <span className="text-[9.5px] font-medium text-text-muted block">
                    {isRu ? 'До 🚚 0 ₴ ещё ' : 'До 🚚 0 ₴ ще '}
                    <strong className="text-success font-extrabold num">{formatPrice(1500 - sum)}</strong>
                  </span>
                )}
              </div>
            </div>

            {tiers.length > 0 && <WholesaleChart breaks={breaks} qty={qty} unitPrice={unitPrice} />}

            {/* Large Red Auto / Nova Poshta 0 UAH badge triggered at 1500 UAH */}
            {sum >= 1500 && (
              <div className="flex items-center gap-2 bg-[#da291c]/10 border-2 border-[#da291c]/40 px-2.5 py-1 rounded-xl shrink-0 animate-in fade-in zoom-in-95 duration-200 shadow-sm">
                <div className="relative flex items-center justify-center size-8 rounded-lg bg-[#da291c] text-white shrink-0 shadow-xs">
                  <Truck className="size-4 text-white" strokeWidth={2.2} />
                  <span className="absolute -bottom-1 -right-1 bg-white text-[#da291c] text-[7.5px] font-black px-0.5 rounded border border-[#da291c] leading-none">
                    НП
                  </span>
                </div>

                <div className="flex flex-col leading-tight">
                  <div className="flex items-baseline gap-1">
                    <span className="text-[14px] font-black text-[#da291c] num leading-none">0 ₴</span>
                    <span className="text-[9px] font-extrabold text-[#da291c] uppercase">{isRu ? 'Доставка' : 'Доставка'}</span>
                  </div>
                  <span className="text-[9px] font-bold text-text-muted mt-0.5">
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
