'use client'

// components/cart/cart-button.tsx
// Иконка корзины в хедере — открывает drawer, показывает badge
// Client Component (Zustand, getCartCount)

import { ShoppingCart } from 'lucide-react'
import { useCartUIStore } from '@/store/cart-store'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { getCartCount } from '@/actions/cart'

interface CartButtonProps {
  label: string
}

export function CartButton({ label }: CartButtonProps) {
  const openDrawer = useCartUIStore((s) => s.openDrawer)
  const cartVersion = useCartUIStore((s) => s.cartVersion)
  const [count, setCount] = useState(0)
  const pathname = usePathname()

  // Загрузить количество при маунте, изменении пути и версии корзины
  useEffect(() => {
    void getCartCount().then(setCount)
    void useCartUIStore.getState().fetchCartProductIds()
  }, [pathname, cartVersion])

  return (
    <button
      onClick={openDrawer}
      id="header-cart"
      className="relative size-10 rounded-md inline-flex items-center justify-center cursor-pointer transition-colors hover:bg-[var(--color-surface-alt)]"
      aria-label={label}
    >
      <ShoppingCart className="size-5 text-text-primary" strokeWidth={1.5} />
      {count > 0 && (
        <span
          className="absolute top-1 right-1 flex items-center justify-center size-4 rounded-full text-[10px] font-bold text-white leading-none bg-accent"
        >
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>
  )
}
