'use client'

// src/components/cart/cart-page-client.tsx
// Клиентская обёртка для страницы корзины — обеспечивает router.refresh()
// после мутаций (qty change, remove, clear), чтобы SSR-данные обновились
// MASTER_CONTEXT v1.2 §12.6

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { ArrowRight, ShoppingBag, Trash2, Loader2 } from 'lucide-react'
import { clearCart } from '@/actions/cart'
import { CartItem } from '@/components/cart/cart-item'
import { formatPrice } from '@/lib/utils'
import type { CartItem as CartItemType } from '@/actions/cart'
import { useCartUIStore } from '@/store/cart-store'

interface CartPageClientProps {
  items: CartItemType[]
  locale: string
}

export function CartPageClient({ items, locale }: CartPageClientProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const uk = locale !== 'ru'
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const lp = (path: string) => `/${locale}${path}` as never

  function handleRefresh() {
    router.refresh()
  }

  function handleClear() {
    startTransition(async () => {
      await clearCart()
      router.refresh()
      useCartUIStore.getState().triggerCartUpdate()
    })
  }

  // ── Breadcrumb ──────────────────────────────────────────────────────────────
  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <h1
          className="text-2xl font-bold"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {uk ? 'Кошик' : 'Корзина'}
          {totalCount > 0 && (
            <span
              className="ml-2 text-base font-normal"
              style={{ color: 'var(--color-text-muted)' }}
            >
              ({totalCount} {uk ? 'шт' : 'шт'})
            </span>
          )}
        </h1>

        {items.length > 0 && (
          <button
            onClick={handleClear}
            disabled={isPending}
            className="flex items-center gap-1.5 text-sm transition-colors hover:underline"
            style={{
              color: isPending ? 'var(--color-text-muted)' : 'var(--color-destructive)',
              cursor: isPending ? 'not-allowed' : 'pointer',
            }}
          >
            {isPending
              ? <Loader2 className="size-3.5 animate-spin" />
              : <Trash2 className="size-3.5" strokeWidth={1.5} />
            }
            {uk ? 'Очистити кошик' : 'Очистить корзину'}
          </button>
        )}
      </div>

      {items.length === 0 ? (
        /* ── Empty state ──────────────────────────────────────────────────── */
        <div
          className="flex flex-col items-center justify-center py-24 gap-6 text-center rounded-xl"
          style={{
            background: '#fff',
            border: '1px solid var(--color-border)',
          }}
        >
          <div
            className="size-24 rounded-full flex items-center justify-center"
            style={{ background: 'var(--color-surface-alt)' }}
          >
            <ShoppingBag
              className="size-12"
              style={{ color: 'var(--color-text-muted)' }}
              strokeWidth={1.5}
            />
          </div>
          <div>
            <p className="text-xl font-semibold" style={{ color: 'var(--color-text-primary)' }}>
              {uk ? 'Кошик порожній' : 'Корзина пуста'}
            </p>
            <p className="mt-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>
              {uk
                ? 'Додайте товари з каталогу, щоб оформити замовлення'
                : 'Добавьте товары из каталога, чтобы оформить заказ'}
            </p>
          </div>
          <Link
            href={lp('/catalog')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-md font-semibold text-white transition-colors"
            style={{ background: 'var(--color-accent)' }}
          >
            {uk ? 'До каталогу' : 'В каталог'}
            <ArrowRight className="size-4" strokeWidth={2} />
          </Link>
        </div>
      ) : (
        /* ── Cart with items ──────────────────────────────────────────────── */
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">

          {/* ── Left: Items list ─────────────────────────────────────────── */}
          <div
            className="rounded-xl"
            style={{
              background: '#fff',
              border: '1px solid var(--color-border)',
            }}
          >
            {/* Table header */}
            <div
              className="hidden lg:flex items-center justify-between px-5 py-3"
              style={{ borderBottom: '1px solid var(--color-border)' }}
            >
              <span
                className="text-xs font-semibold tracking-wider"
                style={{ color: 'var(--color-text-muted)' }}
              >
                {uk ? 'ТОВАР' : 'ТОВАР'}
              </span>
              <span
                className="text-xs font-semibold tracking-wider"
                style={{ color: 'var(--color-text-muted)' }}
              >
                {uk ? 'СУМА' : 'СУММА'}
              </span>
            </div>

            {/* Items — CartItem is a Client Component with its own qty state */}
            <div className="px-5">
              {items.map((item) => (
                <CartItem
                  key={item.productId}
                  item={item}
                  locale={locale}
                  onUpdate={handleRefresh}
                />
              ))}
            </div>

            {/* Continue shopping */}
            <div
              className="px-5 py-4"
              style={{ borderTop: '1px solid var(--color-border)' }}
            >
              <Link
                href={lp('/catalog')}
                className="text-sm font-medium hover:underline"
                style={{ color: 'var(--color-accent)' }}
              >
                ← {uk ? 'Продовжити покупки' : 'Продолжить покупки'}
              </Link>
            </div>
          </div>

          {/* ── Right: Order summary ──────────────────────────────────────── */}
          <div
            className="rounded-xl sticky top-[140px]"
            style={{
              background: '#fff',
              border: '1px solid var(--color-border)',
            }}
          >
            {/* Summary header */}
            <div
              className="px-5 py-4"
              style={{ borderBottom: '1px solid var(--color-border)' }}
            >
              <h2
                className="text-base font-semibold"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {uk ? 'Підсумок замовлення' : 'Итог заказа'}
              </h2>
            </div>

            <div className="px-5 py-4 flex flex-col gap-3">
              {/* Subtotal row */}
              <div className="flex items-center justify-between text-sm">
                <span style={{ color: 'var(--color-text-muted)' }}>
                  {uk ? 'Товари' : 'Товары'}{' '}
                  <span className="num">({totalCount} {uk ? 'шт' : 'шт'})</span>
                </span>
                <span
                  className="num font-medium"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  {formatPrice(subtotal)}
                </span>
              </div>

              {/* Shipping row */}
              <div className="flex items-center justify-between text-sm">
                <span style={{ color: 'var(--color-text-muted)' }}>
                  {uk ? 'Доставка' : 'Доставка'}
                </span>
                <span
                  className="text-xs font-medium"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {uk ? 'за тарифами перевізника' : 'по тарифам перевозчика'}
                </span>
              </div>

              {/* Divider */}
              <div
                style={{
                  height: 1,
                  background: 'var(--color-border)',
                  margin: '4px 0',
                }}
              />

              {/* Total */}
              <div className="flex items-center justify-between">
                <span
                  className="font-semibold"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  {uk ? 'Разом' : 'Итого'}
                </span>
                <span
                  className="text-xl font-bold num"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  {formatPrice(subtotal)}
                </span>
              </div>

              {/* Checkout CTA */}
              <Link
                href={lp('/checkout')}
                id="cart-checkout-btn"
                className="mt-2 flex items-center justify-center gap-2 h-12 rounded-md font-semibold text-white transition-colors"
                style={{ background: 'var(--color-accent)' }}
              >
                {uk ? 'Оформити замовлення' : 'Оформить заказ'}
                <ArrowRight className="size-4" strokeWidth={2} />
              </Link>

              {/* Payment info */}
              <p
                className="text-center text-xs mt-1"
                style={{ color: 'var(--color-text-muted)' }}
              >
                {uk
                  ? 'Оплата карткою, готівкою або безготівковий з ПДВ'
                  : 'Оплата картой, наличными или безналичный с НДС'}
              </p>

              {/* Payment icons */}
              <div className="flex items-center justify-center gap-2 mt-1 flex-wrap">
                {['Visa', 'MC', 'Mono', 'ПБ', 'НП'].map((badge) => (
                  <span
                    key={badge}
                    className="text-[10px] font-semibold px-2 py-1 rounded"
                    style={{
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-text-muted)',
                    }}
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
