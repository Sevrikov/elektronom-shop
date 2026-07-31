// src/store/ui-store.ts
// Zustand — глобальный UI-стейт (мобильное меню, поиск)
// MASTER_CONTEXT v1.2 §14

import { create } from 'zustand'

interface UIStore {
  isMobileMenuOpen: boolean
  isSearchOpen: boolean
  isMobileFiltersOpen: boolean
  isGuidedWizardOpen: boolean
  openMobileMenu: () => void
  closeMobileMenu: () => void
  toggleMobileMenu: () => void
  openSearch: () => void
  closeSearch: () => void
  toggleSearch: () => void
  openMobileFilters: () => void
  closeMobileFilters: () => void
  openGuidedWizard: () => void
  closeGuidedWizard: () => void
}

export const useUIStore = create<UIStore>((set) => ({
  isMobileMenuOpen: false,
  isSearchOpen: false,
  isMobileFiltersOpen: false,
  isGuidedWizardOpen: false,
  openMobileMenu: () => set({ isMobileMenuOpen: true }),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
  toggleMobileMenu: () => set((s) => ({ isMobileMenuOpen: !s.isMobileMenuOpen })),
  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false }),
  toggleSearch: () => set((s) => ({ isSearchOpen: !s.isSearchOpen })),
  openMobileFilters: () => set({ isMobileFiltersOpen: true }),
  closeMobileFilters: () => set({ isMobileFiltersOpen: false }),
  openGuidedWizard: () => set({ isGuidedWizardOpen: true }),
  closeGuidedWizard: () => set({ isGuidedWizardOpen: false }),
}))
