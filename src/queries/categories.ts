import type { Locale } from '@/types'
import { sidebarCategories, type SidebarCategory } from '@/lib/constants'

/** Get category by slug */
export function getCategoryBySlug(slug: string): SidebarCategory | undefined {
  return sidebarCategories.find(c => c.slug === slug)
}

/** Get all categories */
export function getAllCategories(): SidebarCategory[] {
  return sidebarCategories
}
