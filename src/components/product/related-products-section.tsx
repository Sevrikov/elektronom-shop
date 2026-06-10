import { getSimilarProducts } from '@/queries/products'
import ProductCard from '@/components/product/product-card'
import type { Locale } from '@/types'
import { getTranslations } from 'next-intl/server'

interface RelatedProductsSectionProps {
  categoryId: string
  excludeId: string
  locale: Locale
}

export async function RelatedProductsSection({
  categoryId,
  excludeId,
  locale,
}: RelatedProductsSectionProps) {
  // Fetch 4 related products
  const products = await getSimilarProducts(categoryId, excludeId, locale, 4)

  if (products.length === 0) return null

  const t = await getTranslations({ locale, namespace: 'pdp' })
  const title = t('relatedProducts')

  return (
    <section className="mt-8 border-t border-border pt-8">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[20px] font-extrabold text-text-primary tracking-tight">
          {title}
        </h2>
      </div>
      
      {/* 4 Cards Grid - responsive */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} locale={locale} />
        ))}
      </div>
    </section>
  )
}
