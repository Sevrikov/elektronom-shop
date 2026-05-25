// src/components/product/same-series-products.tsx
import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight, ImageIcon } from 'lucide-react'
import { getSameSeriesProducts } from '@/queries/products'
import { formatPrice } from '@/lib/utils'
import { AddToCartButton } from '@/components/cart/add-to-cart-button'

interface SameSeriesProductsProps {
  productId: string
  categoryId: string
  brandId: string | null
  attributes: Record<string, unknown>
  locale: string
}

export async function SameSeriesProducts({
  productId,
  categoryId,
  brandId,
  attributes,
  locale,
}: SameSeriesProductsProps) {
  const products = await getSameSeriesProducts(
    productId,
    categoryId,
    brandId,
    attributes || {},
    locale,
    5
  )

  if (products.length === 0) return null

  const loc = locale === 'ru' ? 'ru' : 'uk'
  const title = loc === 'ru' ? 'Другие товары этой серии' : 'Інші товари тієї ж серії'
  const allText = loc === 'ru' ? 'Все' : 'Всі'
  const viewAllText = loc === 'ru' ? 'Все товары' : 'Всі товари'

  // We display up to 4 items in the list, and show "All" if we fetched 5 items
  const displayProducts = products.slice(0, 4)
  const hasMore = products.length > 4

  return (
    <section className="bg-surface-white border border-border rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-border">
        <h2 className="text-base font-extrabold text-text-primary tracking-tight">
          {title}
        </h2>
        {hasMore && (
          <Link
            href={`/${locale}/catalog` as never}
            className="text-xs font-bold text-accent hover:underline flex items-center gap-0.5"
          >
            {allText}
            <ChevronRight className="size-3" strokeWidth={2.5} />
          </Link>
        )}
      </div>

      <div className="flex flex-col">
        {displayProducts.map((p) => {
          const name = p.translations[0]?.name ?? p.sku
          const price = Number(p.price.toString())
          const image = p.images[0]?.url ?? null
          const inStock = p.stock > 0
          const stockText = inStock
            ? loc === 'ru' ? 'В наличии' : 'В наявності'
            : loc === 'ru' ? 'Нет в наличии' : 'Немає в наявності'

          return (
            <div
              key={p.id}
              className="flex items-center gap-3 py-3 border-b border-border last:border-b-0 hover:bg-surface-alt/40 transition-colors rounded-lg px-2 -mx-2"
            >
              {/* Image */}
              <Link
                href={`/${locale}/product/${p.slug}` as never}
                className="w-14 h-14 relative rounded-md border border-border bg-image-container shrink-0 overflow-hidden flex items-center justify-center"
              >
                {image ? (
                  <Image
                    src={image}
                    alt={name}
                    fill
                    className="object-contain p-1"
                    sizes="56px"
                  />
                ) : (
                  <ImageIcon className="size-6 text-border-strong" strokeWidth={1.5} />
                )}
              </Link>

              {/* Title & SKU & Stock */}
              <div className="flex-1 min-w-0">
                <Link
                  href={`/${locale}/product/${p.slug}` as never}
                  className="block text-[13px] font-bold text-text-primary hover:text-accent transition-colors line-clamp-2 leading-snug"
                >
                  {name}
                </Link>
                <div className="flex items-center gap-2 mt-1 text-[11px] text-text-muted">
                  <span>Код: {p.sku}</span>
                  <span className={`font-semibold ${inStock ? 'text-success' : 'text-error'}`}>
                    {stockText}
                  </span>
                </div>
              </div>

              {/* Price & Cart button */}
              <div className="flex items-center gap-3 shrink-0 pl-1">
                <span className="text-[14px] font-extrabold text-text-primary num">
                  {formatPrice(price)}
                </span>
                <AddToCartButton
                  productId={p.id}
                  productName={name}
                  disabled={!inStock}
                  variant="icon"
                />
              </div>
            </div>
          )
        })}
      </div>

      {hasMore && (
        <div className="mt-4 pt-2 border-t border-border">
          <Link
            href={`/${locale}/catalog` as never}
            className="w-full h-10 rounded-lg flex items-center justify-center border border-border hover:bg-surface-alt transition-colors text-xs font-bold text-text-primary"
          >
            {viewAllText}
          </Link>
        </div>
      )}
    </section>
  )
}
