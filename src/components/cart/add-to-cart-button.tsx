'use client'

import { useState, useTransition } from 'react'
import { ShoppingCart, Check, Loader2, X, Minus, Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useCartUIStore } from '@/store/cart-store'
import { addToCart } from '@/actions/cart'

interface AddToCartButtonProps {
  productId: string
  productName: string
  disabled?: boolean
  variant?: 'icon' | 'full'
  className?: string
  stock?: number
  showQtyStepper?: boolean
  disabledText?: string | undefined
}

export function AddToCartButton({
  productId,
  productName,
  disabled = false,
  variant = 'icon',
  className,
  stock = 99,
  showQtyStepper = false,
  disabledText,
}: AddToCartButtonProps) {
  const t = useTranslations('common')
  const openDrawer = useCartUIStore((s) => s.openDrawer)
  const cartProductIds = useCartUIStore((s) => s.cartProductIds)
  const isInCart = cartProductIds.includes(productId)
  const [added, setAdded] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [quantity, setQuantity] = useState(1)

  function handleClick() {
    if (disabled || isPending || added || errorMsg) return

    setAdded(true)
    openDrawer()

    startTransition(async () => {
      const result = await addToCart({ productId, quantity })
      if (!result.success) {
        setAdded(false)
        setErrorMsg(result.error ?? 'Помилка')
        setTimeout(() => setErrorMsg(null), 3000)
      } else {
        useCartUIStore.getState().triggerCartUpdate()
        setTimeout(() => {
          setAdded(false)
          setQuantity(1)
        }, 2000)
      }
    })
  }

  const isDisabled = disabled || isPending

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation()
    setQuantity((prev) => Math.max(1, prev - 1))
  }

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation()
    setQuantity((prev) => Math.min(stock, prev + 1))
  }

  if (variant === 'icon') {
    return (
      <button
        onClick={handleClick}
        disabled={isDisabled}
        aria-label={`${t('addToCart')} ${productName}`}
        className={`w-9 h-9 rounded-md flex items-center justify-center shrink-0 transition-[background-color,border-color,color] duration-120 ease-in-out ${
          isDisabled
            ? 'bg-surface-raised cursor-not-allowed border border-border text-text-muted'
            : errorMsg
              ? 'bg-error border border-error text-white cursor-pointer'
              : added
                ? 'bg-success border border-success text-white cursor-pointer'
                : isInCart
                  ? 'bg-accent border border-accent text-white cursor-pointer hover:bg-accent-hover'
                  : 'bg-transparent border border-accent text-accent hover:bg-accent hover:text-white cursor-pointer'
        } ${className ?? ''}`}
      >
        {isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : errorMsg ? (
          <X className="size-4" strokeWidth={2.5} />
        ) : added ? (
          <Check className="size-4" strokeWidth={2.5} />
        ) : (
          <ShoppingCart
            className="size-[18px]"
            fill={isInCart ? 'currentColor' : 'none'}
            strokeWidth={1.5}
          />
        )}
      </button>
    )
  }

  // Full button variant (for product page)
  return (
    <div className="flex items-center gap-3 w-full">
      {showQtyStepper && (
        <div className="flex items-center border border-border rounded-lg bg-surface-white h-12 px-1 shrink-0 select-none">
          <button
            type="button"
            onClick={handleDecrement}
            disabled={isDisabled || quantity <= 1}
            className="w-8 h-8 rounded flex items-center justify-center text-text-primary hover:bg-surface-alt active:bg-surface-raised transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            <Minus className="size-3.5" strokeWidth={2.5} />
          </button>
          <span className="w-10 text-center font-extrabold text-text-primary text-[15px] select-none pointer-events-none">
            {quantity}
          </span>
          <button
            type="button"
            onClick={handleIncrement}
            disabled={isDisabled || quantity >= stock}
            className="w-8 h-8 rounded flex items-center justify-center text-text-primary hover:bg-surface-alt active:bg-surface-raised transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            <Plus className="size-3.5" strokeWidth={2.5} />
          </button>
        </div>
      )}

      <button
        onClick={handleClick}
        disabled={isDisabled}
        aria-label={`${t('addToCart')} ${productName}`}
        className={`h-12 px-5.5 rounded-md flex items-center justify-center gap-2 text-[15px] font-semibold border-none transition-[background-color] duration-120 ease-in-out flex-1 ${
          isDisabled
            ? 'bg-surface-raised text-text-muted cursor-not-allowed'
            : errorMsg
              ? 'bg-error text-white cursor-pointer'
              : added
                ? 'bg-success text-white cursor-pointer'
                : 'bg-accent text-white cursor-pointer'
        } ${className ?? ''}`}
      >
        {isPending ? (
          <Loader2 className="size-5 animate-spin" />
        ) : errorMsg ? (
          <X className="size-5" strokeWidth={2.5} />
        ) : added ? (
          <Check className="size-5" strokeWidth={2.5} />
        ) : (
          <ShoppingCart className="size-5" strokeWidth={1.5} />
        )}
        <span>
          {errorMsg
            ? errorMsg
            : added
              ? t('added')
              : disabled
                ? disabledText || t('outOfStock')
                : t('addToCart')}
        </span>
      </button>
    </div>
  )
}
