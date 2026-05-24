'use client'

// components/cart/cart-drawer.tsx
// Slide-in drawer корзины (справа) на основе Sheet
// MASTER_CONTEXT v1.2 §2.10

import Link from 'next/link'
import { ShoppingCart, X, ArrowRight, ShoppingBag } from 'lucide-react'
import { useEffect, useState, useTransition } from 'react'
import { useCartUIStore } from '@/store/cart-store'
import { getCart, clearCart } from '@/actions/cart'
import { CartItem } from '@/components/cart/cart-item'
import { formatPrice } from '@/lib/utils'
import type { CartItem as CartItemType } from '@/actions/cart'

interface CartDrawerProps {
  locale: string
}

export function CartDrawer({ locale }: CartDrawerProps) {
  const isOpen = useCartUIStore((s) => s.isDrawerOpen)
  const closeDrawer = useCartUIStore((s) => s.closeDrawer)
  const [items, setItems] = useState<CartItemType[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isPending, startTransition] = useTransition()

  const lp = (path: string) => `/${locale}${path}` as never

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0)

  const uk = locale !== 'ru'

  async function loadCart() {
    setIsLoading(true)
    try {
      const result = await getCart(locale)
      setItems(result)
    } finally {
      setIsLoading(false)
    }
  }

  // Загружать корзину при открытии
  useEffect(() => {
    if (isOpen) {
      void loadCart()
    }
  }, [isOpen]) // eslint-disable-line react-hooks/exhaustive-deps

  function handleClear() {
    startTransition(async () => {
      await clearCart()
      setItems([])
      useCartUIStore.getState().triggerCartUpdate()
    })
  }

  // Закрыть по Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closeDrawer()
    }
    if (isOpen) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen, closeDrawer])

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40"
        style={{ backdropFilter: 'blur(2px)', transition: 'opacity 200ms ease' }}
        onClick={closeDrawer}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={uk ? 'Кошик' : 'Корзина'}
        className="fixed right-0 top-0 bottom-0 z-50 flex flex-col"
        style={{
          width: '100%',
          maxWidth: 440,
          background: '#fff',
          boxShadow: 'var(--shadow-lg)',
          borderLeft: '1px solid var(--color-border)',
          animation: 'slideInRight 200ms ease',
        }}
      >
        {/* ── Header ── */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid var(--color-border)' }}
        >
          <div className="flex items-center gap-2">
            <ShoppingCart className="size-5" style={{ color: 'var(--color-accent)' }} strokeWidth={1.5} />
            <h2 className="text-base font-semibold" style={{ color: 'var(--color-text-primary)' }}>
              {uk ? 'Кошик' : 'Корзина'}
            </h2>
            {totalCount > 0 && (
              <span
                className="flex items-center justify-center size-5 rounded-full text-[11px] font-bold text-white"
                style={{ background: 'var(--color-accent)' }}
              >
                {totalCount}
              </span>
            )}
          </div>
          <button
            onClick={closeDrawer}
            aria-label={uk ? 'Закрити кошик' : 'Закрыть корзину'}
            className="size-8 rounded-md flex items-center justify-center transition-colors hover:bg-[var(--color-surface-alt)]"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto px-5">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-48 gap-3">
              <div
                className="size-8 rounded-full border-2 animate-spin"
                style={{ borderColor: 'var(--color-border)', borderTopColor: 'var(--color-accent)' }}
              />
              <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                {uk ? 'Завантаження...' : 'Загрузка...'}
              </span>
            </div>
          ) : items.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center h-64 gap-4 text-center">
              <div
                className="size-16 rounded-full flex items-center justify-center"
                style={{ background: 'var(--color-surface-alt)' }}
              >
                <ShoppingBag className="size-8" style={{ color: 'var(--color-text-muted)' }} strokeWidth={1.5} />
              </div>
              <div>
                <p className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  {uk ? 'Кошик порожній' : 'Корзина пуста'}
                </p>
                <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
                  {uk ? 'Додайте товари з каталогу' : 'Добавьте товары из каталога'}
                </p>
              </div>
              <Link
                href={lp('/catalog')}
                onClick={closeDrawer}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-white transition-colors"
                style={{ background: 'var(--color-accent)' }}
              >
                {uk ? 'До каталогу' : 'В каталог'}
                <ArrowRight className="size-4" />
              </Link>
            </div>
          ) : (
            <div>
              {items.map((item) => (
                <CartItem
                  key={item.productId}
                  item={item}
                  locale={locale}
                  onUpdate={loadCart}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── Footer (subtotal + checkout) ── */}
        {items.length > 0 && (
          <div
            className="px-5 py-4 flex flex-col gap-3"
            style={{ borderTop: '1px solid var(--color-border)' }}
          >
            {/* Subtotal */}
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                {uk ? 'Разом' : 'Итого'}{' '}
                <span className="text-xs">({totalCount} {uk ? 'шт' : 'шт'})</span>
              </span>
              <span className="text-xl font-bold num" style={{ color: 'var(--color-text-primary)' }}>
                {formatPrice(subtotal)}
              </span>
            </div>

            {/* Checkout CTA */}
            <Link
              href={lp('/checkout')}
              onClick={closeDrawer}
              className="flex items-center justify-center gap-2 h-12 rounded-md font-semibold text-white transition-colors"
              style={{ background: 'var(--color-accent)' }}
            >
              {uk ? 'Оформити замовлення' : 'Оформить заказ'}
              <ArrowRight className="size-4" strokeWidth={2} />
            </Link>

            {/* View cart + Clear */}
            <div className="flex items-center justify-between">
              <Link
                href={lp('/cart')}
                onClick={closeDrawer}
                className="text-sm font-medium hover:underline"
                style={{ color: 'var(--color-accent)' }}
              >
                {uk ? 'Переглянути кошик →' : 'Просмотреть корзину →'}
              </Link>
              <button
                onClick={handleClear}
                disabled={isPending}
                className="text-sm hover:underline transition-colors"
                style={{ color: 'var(--color-text-muted)', cursor: isPending ? 'not-allowed' : 'pointer' }}
              >
                {uk ? 'Очистити' : 'Очистить'}
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  )
}
