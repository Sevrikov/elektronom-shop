'use client'

import { useUIStore } from '@/store/ui-store'
import MobileFilterDrawer from './mobile-filter-drawer'
import type { ActiveFilters, FilterDefinition, BrandFacetItem, AttributeFacetItem } from '@/types'

interface DeferredMobileFilterDrawerProps {
  filters: FilterDefinition[]
  activeFilters: ActiveFilters
  brandCounts: BrandFacetItem[]
  priceRange: { min: number; max: number; availableMin?: number; availableMax?: number; buckets?: number[] | undefined }
  attributeCounts: Record<string, AttributeFacetItem[]>
  total: number
}

export default function DeferredMobileFilterDrawer(props: DeferredMobileFilterDrawerProps) {
  const isOpen = useUIStore((s) => s.isMobileFiltersOpen)
  const onClose = useUIStore((s) => s.closeMobileFilters)

  return <MobileFilterDrawer {...props} isOpen={isOpen} onClose={onClose} />
}
