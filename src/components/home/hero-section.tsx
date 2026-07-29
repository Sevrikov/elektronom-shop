'use client'

import HeroCarousel from './hero-carousel'

/**
 * Concept 6 v2 — Hero Section (Main Promo Carousel)
 */
export default function HybridDrawer({ locale }: { locale: string }) {
  return (
    <section className="w-full rounded-lg overflow-hidden border border-border">
      <HeroCarousel locale={locale} />
    </section>
  )
}
