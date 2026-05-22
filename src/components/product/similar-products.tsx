// components/product/similar-products.tsx
// Server Component — блок похожих товаров

import { getSimilarProducts } from '@/queries/products'
import ProductCard from '@/components/product/product-card'
import type { Locale } from '@/types'

interface SimilarProductsProps {
  categoryId: string
  excludeId: string
  locale: Locale
}

export async function SimilarProducts({
  categoryId,
  excludeId,
  locale,
}: SimilarProductsProps) {
  const products = await getSimilarProducts(categoryId, excludeId, locale, 4)

  if (products.length === 0) return null

  const title = locale === 'ru' ? 'Похожие товары' : 'Схожі товари'

  return (
    <section className="mt-8">
      <div className="flex items-center justify-between mb-4 border-b border-border pb-3">
        <h2 className="text-xl font-semibold text-text-primary">
          {title}
        </h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} locale={locale} />
        ))}
      </div>
    </section>
  )
}
