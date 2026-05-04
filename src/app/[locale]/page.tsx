import { Suspense } from 'react'
import HybridDrawer from '@/components/home/hero-section'
import ValueProps from '@/components/home/value-props'
import CategoriesSection from '@/components/home/categories-section'
import ProductCarousel from '@/components/home/product-carousel'
import TrustSection from '@/components/home/trust-section'
import PrefooterCta from '@/components/home/prefooter-cta'
import CategorySidebar from '@/components/layout/category-sidebar'
import { topSalesProducts, newArrivalProducts } from '@/lib/constants'
import { getTranslations } from 'next-intl/server'

async function TopSalesCarousel() {
  const t = await getTranslations('home')
  return (
    <ProductCarousel
      title={t('topSales.title')}
      viewAllText={t('topSales.viewAll')}
      viewAllHref="/catalog?sort=popular"
      products={topSalesProducts}
    />
  )
}

async function NewArrivalsCarousel() {
  const t = await getTranslations('home')
  return (
    <ProductCarousel
      title={t('newArrivals.title')}
      viewAllText={t('newArrivals.viewAll')}
      viewAllHref="/catalog?sort=new"
      products={newArrivalProducts}
    />
  )
}

function LoadingSkeleton() {
  return (
    <div className="w-full h-40 rounded-lg animate-pulse" style={{ background: 'var(--color-surface-raised)' }} />
  )
}

export default function HomePage() {
  return (
    <div className="mx-auto max-w-[1280px] px-4 lg:px-6 py-6">
      <div className="flex gap-6">
        <CategorySidebar />
        <div className="flex-1 min-w-0 flex flex-col gap-6">
          <HybridDrawer />
          <ValueProps />
          <CategoriesSection />
          <Suspense fallback={<LoadingSkeleton />}>
            <TopSalesCarousel />
          </Suspense>
          <Suspense fallback={<LoadingSkeleton />}>
            <NewArrivalsCarousel />
          </Suspense>
          <TrustSection />
          <PrefooterCta />
        </div>
      </div>
    </div>
  )
}
