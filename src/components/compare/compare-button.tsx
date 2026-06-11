'use client'

import React from 'react'
import { Scale, ArrowRight } from 'lucide-react'
import { useCompareStore, type CompareItem } from '@/store/compare-store'

interface CompareButtonProps {
  productId: string
  slug: string
  sku: string
  name: string
  imageUrl: string | null
  price: number
  comparePrice: number | null
  brandName: string
  categorySlug: string
}

export function CompareButton({
  productId,
  slug,
  sku,
  name,
  imageUrl,
  price,
  comparePrice,
  brandName,
  categorySlug,
}: CompareButtonProps) {
  const items = useCompareStore((s) => s.items)
  const toggle = useCompareStore((s) => s.toggle)
  const openCompare = useCompareStore((s) => s.open)

  const inCompare = items.some((i) => i.id === productId)

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const item: CompareItem = {
      id: productId,
      slug,
      sku,
      name,
      image: imageUrl,
      price,
      comparePrice,
      brandName,
      categorySlug,
    }
    toggle(item)
  }

  const handleOpenCompare = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    openCompare()
  }

  if (inCompare) {
    return (
      <div
        className="absolute top-2 left-2 z-20 flex items-center bg-accent border border-accent text-white rounded-full shadow-md transition-all duration-300 p-1"
        onClick={handleOpenCompare}
        title="Перейти до порівняння"
      >
        {/* Toggle / Remove part */}
        <button
          type="button"
          onClick={handleToggle}
          className="flex items-center justify-center size-6 rounded-full hover:bg-white/20 transition-colors cursor-pointer"
          title="Видалити з порівняння"
        >
          <Scale className="size-3.5" />
        </button>

        {/* Divider */}
        <div className="w-[1px] h-3 bg-white/40 mx-1" />

        {/* Go to compare part */}
        <button
          type="button"
          onClick={handleOpenCompare}
          className="flex items-center justify-center size-6 rounded-full hover:bg-white/20 transition-colors cursor-pointer"
          title="Відкрити таблицю порівняння"
        >
          <ArrowRight className="size-3.5" />
        </button>
      </div>
    )
  }

  // Not in compare: show on hover of parent card (using group-hover)
  return (
    <button
      type="button"
      onClick={handleToggle}
      className="absolute top-2 left-2 z-20 flex items-center justify-center size-8 rounded-full border border-accent text-accent bg-surface-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-accent hover:text-white cursor-pointer"
      title="Додати до порівняння"
    >
      <Scale className="size-4" />
    </button>
  )
}
