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
  // Fetch 5 related products
  const products = await getSimilarProducts(categoryId, excludeId, locale, 5)

  if (products.length === 0) return null

  const t = await getTranslations({ locale, namespace: 'pdp' })
  const title = t('relatedProducts')

  return (
    <section id="co-purchase" className="scroll-mt-[120px] mt-8 border-t border-border pt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[20px] font-extrabold text-text-primary tracking-tight">
          {title}
        </h2>
      </div>
      
      {/* 5 Compact Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} locale={locale} isCompact={true} />
        ))}
      </div>
    </section>
  )
}
