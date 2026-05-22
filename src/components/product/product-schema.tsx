// components/product/product-schema.tsx
// Server Component — JSON-LD Product schema.org

interface ProductSchemaProps {
  product: {
    slug: string
    sku: string
    price: { toString(): string }
    comparePrice?: { toString(): string } | null
    stock: number
    brand?: { name: string } | null
    images: { url: string }[]
    translations: { locale?: string; name: string; description?: string | null }[]
    reviews?: { rating: number }[]
  }
  locale: string
}

const PRICE_VALID_UNTIL = new Date(Date.now() + 86400 * 30 * 1000)
  .toISOString()
  .split('T')[0]

export function ProductSchema({ product, locale }: ProductSchemaProps) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://elektronom.com.ua'
  const translation = product.translations.find((t) => t.locale === locale)
  const name = translation?.name ?? product.translations[0]?.name ?? product.sku
  const rawDesc = translation?.description ?? ''
  const cleanDescription = rawDesc.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  const description = cleanDescription || undefined

  const price = Number(product.price.toString())
  const inStock = product.stock > 0

  const reviews = product.reviews ?? []
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : undefined

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    ...(description && { description }),
    sku: product.sku,
    image: product.images.map((img) =>
      img.url.startsWith('http') ? img.url : `${baseUrl}${img.url}`
    ),
    offers: {
      '@type': 'Offer',
      price,
      priceCurrency: 'UAH',
      availability: inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url: `${baseUrl}/${locale}/product/${product.slug}`,
      priceValidUntil: PRICE_VALID_UNTIL,
    },
    ...(product.brand && {
      brand: { '@type': 'Brand', name: product.brand.name },
    }),
    ...(avgRating !== undefined &&
      reviews.length > 0 && {
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: avgRating.toFixed(1),
          reviewCount: reviews.length,
          bestRating: 5,
          worstRating: 1,
        },
      }),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
