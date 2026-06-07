'use client'

import React from 'react'
import { Heart } from 'lucide-react'
import { useWishlistStore } from '@/store/wishlist-store'

interface WishlistButtonProps {
  productId: string
  className?: string
}

export function WishlistButton({ productId, className }: WishlistButtonProps) {
  const wishlistIds = useWishlistStore((s) => s.wishlistIds)
  const toggle = useWishlistStore((s) => s.toggleWishlist)
  const inWishlist = wishlistIds.includes(productId)

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    void toggle(productId)
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`w-9 h-9 rounded-md flex items-center justify-center shrink-0 border transition-all duration-120 ease-in-out cursor-pointer ${
        inWishlist
          ? 'bg-red-500/5 border-red-500 text-red-500 hover:bg-red-500/10'
          : 'bg-transparent border-border text-text-muted hover:border-red-400 hover:text-red-500'
      } ${className ?? ''}`}
      title={inWishlist ? 'Видалити з обраного' : 'Додати до обраного'}
    >
      <Heart
        className="size-[18px] transition-transform duration-120 active:scale-90"
        fill={inWishlist ? 'currentColor' : 'none'}
        strokeWidth={1.5}
      />
    </button>
  )
}
