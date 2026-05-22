'use client'

// components/cart/cart-item.tsx
// Элемент корзины: фото, название, qty stepper, delete
// MASTER_CONTEXT v1.2 §2.11

import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, Trash2, Loader2 } from 'lucide-react'
import { useState, useTransition } from 'react'
import { removeFromCart, updateCartQuantity } from '@/actions/cart'
import { formatPrice } from '@/lib/utils'

interface CartItemProps {
  item: {
    productId: string
    quantity: number
    name: string
    sku: string
    price: number
    comparePrice?: number | null
    imageUrl?: string | null
    slug: string
    stock: number
    inStock: boolean
  }
  locale: string
  onUpdate?: () => void
}

export function CartItem({ item, locale, onUpdate }: CartItemProps) {
  const [qty, setQty] = useState(item.quantity)
  const [isPending, startTransition] = useTransition()

  const total = item.price * qty
  const lp = (path: string) => `/${locale}${path}` as never

  function changeQty(delta: number) {
    const next = Math.max(1, Math.min(item.stock, qty + delta))
    if (next === qty) return
    setQty(next)
    startTransition(async () => {
      await updateCartQuantity({ productId: item.productId, quantity: next })
      onUpdate?.()
    })
  }

  function handleRemove() {
    startTransition(async () => {
      await removeFromCart({ productId: item.productId })
      onUpdate?.()
    })
  }

  return (
    <div className="flex gap-3 py-4 border-b border-border">
      {/* Image */}
      <Link
        href={lp(`/product/${item.slug}`)}
        className="relative shrink-0 w-[72px] h-[72px] rounded-md overflow-hidden bg-surface-alt border border-border"
      >
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-contain p-1.5"
            sizes="72px"
            unoptimized={item.imageUrl.startsWith('https://placehold.co')}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-lg font-bold text-border-strong">
              {item.name.charAt(0)}
            </span>
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="flex flex-col flex-1 min-w-0 gap-1">
        <Link
          href={lp(`/product/${item.slug}`)}
          className="text-[13px] font-medium leading-snug line-clamp-2 hover:text-accent transition-colors text-text-primary"
        >
          {item.name}
        </Link>
        <span className="text-[11px] num text-text-muted">
          {item.sku}
        </span>

        <div className="flex items-center justify-between mt-auto pt-1 gap-2">
          {/* Qty stepper */}
          <div
            className={`flex items-center rounded-md overflow-hidden border border-border-strong h-8 ${
              isPending ? 'opacity-60' : 'opacity-100'
            }`}
          >
            <button
              onClick={() => changeQty(-1)}
              disabled={isPending || qty <= 1}
              aria-label="Зменшити кількість"
              className="flex items-center justify-center transition-colors hover:bg-surface-alt w-7 h-8 disabled:cursor-not-allowed cursor-pointer"
            >
              <Minus className="size-3" strokeWidth={2} />
            </button>
            <span className="flex items-center justify-center text-[13px] font-semibold num w-8 h-8 border-l border-r border-border-strong">
              {isPending ? <Loader2 className="size-3 animate-spin" /> : qty}
            </span>
            <button
              onClick={() => changeQty(1)}
              disabled={isPending || qty >= item.stock}
              aria-label="Збільшити кількість"
              className="flex items-center justify-center transition-colors hover:bg-surface-alt w-7 h-8 disabled:cursor-not-allowed cursor-pointer"
            >
              <Plus className="size-3" strokeWidth={2} />
            </button>
          </div>

          {/* Price */}
          <span className="text-[15px] font-bold num text-text-primary">
            {formatPrice(total)}
          </span>

          {/* Delete */}
          <button
            onClick={handleRemove}
            disabled={isPending}
            aria-label={`Видалити ${item.name}`}
            className={`flex items-center justify-center size-7 rounded transition-colors hover:bg-error-subtle disabled:cursor-not-allowed cursor-pointer ${
              isPending ? 'text-text-muted' : 'text-error'
            }`}
          >
            <Trash2 className="size-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  )
}
