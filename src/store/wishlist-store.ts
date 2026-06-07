import { create } from 'zustand'
import { toggleWishlist, getWishlistSnapshot } from '@/actions/user'

interface WishlistStore {
  wishlistIds: string[]
  isLoaded: boolean
  isAuthenticated: boolean
  fetchWishlist: () => Promise<void>
  toggleWishlist: (productId: string) => Promise<void>
}

export const useWishlistStore = create<WishlistStore>((set, get) => ({
  wishlistIds: [],
  isLoaded: false,
  isAuthenticated: false,
  fetchWishlist: async () => {
    let localIds: string[] = []
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('elektronom_guest_wishlist')
        if (stored) {
          localIds = JSON.parse(stored)
        }
      } catch {}
    }

    try {
      const snapshot = await getWishlistSnapshot()
      if (snapshot.isAuthenticated) {
        set({ wishlistIds: snapshot.productIds, isLoaded: true, isAuthenticated: true })
        if (typeof window !== 'undefined') {
          localStorage.removeItem('elektronom_guest_wishlist')
        }
        return
      }
    } catch {}

    set({ wishlistIds: localIds, isLoaded: true, isAuthenticated: false })
  },
  toggleWishlist: async (productId: string) => {
    const { wishlistIds, isAuthenticated } = get()
    const exists = wishlistIds.includes(productId)
    const updatedIds = exists
      ? wishlistIds.filter(id => id !== productId)
      : [...wishlistIds, productId]

    set({ wishlistIds: updatedIds })

    if (!isAuthenticated) {
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('elektronom_guest_wishlist', JSON.stringify(updatedIds))
        } catch {}
      }
      return
    }

    try {
      const res = await toggleWishlist({ productId })
      if (res.success) {
        const snapshot = await getWishlistSnapshot()
        if (snapshot.isAuthenticated) {
          set({ wishlistIds: snapshot.productIds, isAuthenticated: true })
        }
      } else {
        set({ wishlistIds })
      }
    } catch {
      set({ wishlistIds })
    }
  }
}))
