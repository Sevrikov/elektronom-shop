// src/store/compare-store.ts
// Zustand store for product comparison (persisted to localStorage).
// Holds a lightweight snapshot per product so the card "in compare?" state and
// the floating bar work instantly/offline; full attributes for the comparison
// table are fetched on demand when the overlay opens (see compare server action).

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CompareItem {
  id: string
  slug: string
  sku: string
  name: string
  /** display image url (already transformed) or null */
  image: string | null
  price: number
  comparePrice: number | null
  brandName: string
  /** category slug — comparison is meaningful within one category */
  categorySlug: string
}

interface CompareState {
  items: CompareItem[]
  isOpen: boolean

  add: (item: CompareItem) => void
  remove: (id: string) => void
  toggle: (item: CompareItem) => void
  clear: () => void

  open: () => void
  close: () => void
}

/** Max items is intentionally unbounded — the overlay scrolls vertically (mobile-first). */
export const useCompareStore = create<CompareState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,

      add: (item) =>
        set((s) =>
          s.items.some((i) => i.id === item.id) ? s : { items: [...s.items, item] }
        ),

      remove: (id) =>
        set((s) => ({ items: s.items.filter((i) => i.id !== id) })),

      toggle: (item) =>
        set((s) =>
          s.items.some((i) => i.id === item.id)
            ? { items: s.items.filter((i) => i.id !== item.id) }
            : { items: [...s.items, item] }
        ),

      clear: () => set({ items: [], isOpen: false }),

      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
    }),
    {
      name: 'elektronom-compare',
      // do not persist the open/closed UI flag — only the chosen products
      partialize: (s) => ({ items: s.items }),
    }
  )
)

// Reactive selectors (use these in client components to avoid re-render churn):
//   const inCompare = useCompareStore((s) => s.items.some((i) => i.id === id))
//   const count     = useCompareStore((s) => s.items.length)
