'use client'

// src/hooks/use-cart.ts
// Обёртка над cart actions с оптимистичным UI
// ТЗ §15: use-cart.ts — обёртка над cart actions + optimistic UI
// MASTER_CONTEXT v1.2

import { useTransition, useCallback } from 'react'
import {
  addToCart,
  removeFromCart,
  updateCartQuantity,
  clearCart,
} from '@/actions/cart'

export function useCart() {
  const [isPending, startTransition] = useTransition()

  const add = useCallback(
    (
      productId: string,
      quantity = 1,
      onSuccess?: () => void,
      onError?: (err: string) => void
    ) => {
      startTransition(async () => {
        const result = await addToCart({ productId, quantity })
        if (result.success) {
          onSuccess?.()
        } else {
          onError?.(result.error ?? 'Помилка')
        }
      })
    },
    []
  )

  const remove = useCallback(
    (
      productId: string,
      onSuccess?: () => void,
      onError?: (err: string) => void
    ) => {
      startTransition(async () => {
        const result = await removeFromCart({ productId })
        if (result.success) {
          onSuccess?.()
        } else {
          onError?.(result.error ?? 'Помилка')
        }
      })
    },
    []
  )

  const updateQty = useCallback(
    (
      productId: string,
      quantity: number,
      onSuccess?: () => void,
      onError?: (err: string) => void
    ) => {
      startTransition(async () => {
        const result = await updateCartQuantity({ productId, quantity })
        if (result.success) {
          onSuccess?.()
        } else {
          onError?.(result.error ?? 'Помилка')
        }
      })
    },
    []
  )

  const clear = useCallback((onSuccess?: () => void) => {
    startTransition(async () => {
      await clearCart()
      onSuccess?.()
    })
  }, [])

  return { add, remove, updateQty, clear, isPending }
}
