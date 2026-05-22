// src/store/cart-store.ts
// Zustand — только UI-состояние корзины (isDrawerOpen)
// MASTER_CONTEXT v1.2 §14

import { create } from 'zustand'

interface CartUIStore {
  isDrawerOpen: boolean
  openDrawer: () => void
  closeDrawer: () => void
  toggleDrawer: () => void
}

export const useCartUIStore = create<CartUIStore>((set) => ({
  isDrawerOpen: false,
  openDrawer: () => set({ isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false }),
  toggleDrawer: () => set((s) => ({ isDrawerOpen: !s.isDrawerOpen })),
}))
