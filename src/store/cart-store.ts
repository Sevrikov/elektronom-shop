import { create } from 'zustand'
import { getCartProductIds } from '@/actions/cart'

interface CartUIStore {
  isDrawerOpen: boolean
  openDrawer: () => void
  closeDrawer: () => void
  toggleDrawer: () => void
  cartVersion: number
  triggerCartUpdate: () => void
  cartProductIds: string[]
  fetchCartProductIds: () => Promise<void>
}

export const useCartUIStore = create<CartUIStore>((set, get) => ({
  isDrawerOpen: false,
  openDrawer: () => set({ isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false }),
  toggleDrawer: () => set((s) => ({ isDrawerOpen: !s.isDrawerOpen })),
  cartVersion: 0,
  cartProductIds: [],
  triggerCartUpdate: () => {
    set((s) => ({ cartVersion: s.cartVersion + 1 }))
    void get().fetchCartProductIds()
  },
  fetchCartProductIds: async () => {
    try {
      const ids = await getCartProductIds()
      set({ cartProductIds: ids })
    } catch {}
  }
}))
