// components/product/product-schema.tsx
// Server Component — JSON-LD Product schema.org

import { getSiteUrl, safeJsonLd } from '@/lib/utils'

interface ProductSchemaProps {
  product: {
    slug: string
    sku: string
    price: { toString(): string } | number
    comparePrice?: { toString(): string } | number | null
    stock: number
    brand?: { name: string } | null
    images: { url: string }[]
    translations: { locale?: string; name: string; description?: string | null }[]
    reviews?: {
      rating: number
      comment?: string | null
      createdAt: Date | string
      user: { name?: string | null }
    }[]
    gtin?: string | null
    mpn?: string | null
    salePrice?: { toString(): string } | number | null
    saleStartsAt?: Date | string | null
    saleEndsAt?: Date | string | null
    isBackorder?: boolean
  }
  locale: string
}

const PRICE_VALID_UNTIL = new Date(Date.now() + 86400 * 30 * 1000)
  .toISOString()
  .split('T')[0]

export function ProductSchema({ product, locale }: ProductSchemaProps) {
  const baseUrl = getSiteUrl()
  const translation = product.translations.find((t) => t.locale === locale)
  const name = translation?.name ?? product.translations[0]?.name ?? product.sku
  const rawDesc = translation?.description ?? ''
  const cleanDescription = rawDesc.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  const description = cleanDescription || undefined

  const inStock = product.stock > 0

  // Handle price and active sale windows
  const basePrice = Number(product.price.toString())
  const comparePrice = product.comparePrice ? Number(product.comparePrice.toString()) : null
  
  let finalPrice = basePrice
  let listPrice = comparePrice

  if (product.salePrice) {
    const saleVal = Number(product.salePrice.toString())
    const now = new Date()
    const start = product.saleStartsAt ? new Date(product.saleStartsAt) : null
    const end = product.saleEndsAt ? new Date(product.saleEndsAt) : null
    const isStarted = !start || now >= start
    const isEnded = end && now > end

    if (isStarted && !isEnded) {
      finalPrice = saleVal
      listPrice = basePrice // Standard price acts as original list price during sale
    }
  }

  const reviewsList = product.reviews ?? []
  const avgRating =
    reviewsList.length > 0
      ? reviewsList.reduce((sum, r) => sum + r.rating, 0) / reviewsList.length
      : undefined

  // Build the schema object
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    ...(description && { description }),
    sku: product.sku,
    ...(product.gtin && { gtin: product.gtin }),
    ...(product.mpn && { mpn: product.mpn }),
    image: product.images.map((img) =>
      img.url.startsWith('http') ? img.url : `${baseUrl}${img.url}`
    ),
    offers: {
      '@type': 'Offer',
      price: finalPrice,
      priceCurrency: 'UAH',
      availability: inStock
        ? 'https://schema.org/InStock'
        : product.isBackorder
          ? 'https://schema.org/BackOrder'
          : 'https://schema.org/OutOfStock',
      url: `${baseUrl}/${locale}/product/${product.slug}`,
      priceValidUntil: PRICE_VALID_UNTIL,
      
      // Nova Poshta Shipping Details
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: 80.00,
          currency: 'UAH'
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'UA'
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 0,
            maxValue: 1,
            unitCode: 'DAY'
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 3,
            unitCode: 'DAY'
          }
        }
      },
      
      // 14-day return policy for Ukraine
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'UA',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnPeriod',
        merchantReturnDays: 14,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/ReturnFeesCustomerPaying'
      },

      // Price specification when list price is available
      ...(listPrice && {
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          priceType: 'https://schema.org/ListPrice',
          price: listPrice,
          priceCurrency: 'UAH'
        }
      })
    },
    ...(product.brand && {
      brand: { '@type': 'Brand', name: product.brand.name },
    }),
    ...(avgRating !== undefined &&
      reviewsList.length > 0 && {
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: avgRating.toFixed(1),
          reviewCount: reviewsList.length,
          bestRating: 5,
          worstRating: 1,
        },
      }),
    ...(reviewsList.length > 0 && {
      review: reviewsList.map((r) => ({
        '@type': 'Review',
        author: {
          '@type': 'Person',
          name: r.user?.name || (locale === 'ru' ? 'Гость' : 'Гість'),
        },
        datePublished: r.createdAt
          ? new Date(r.createdAt).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        reviewBody: r.comment || '',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: r.rating,
          bestRating: 5,
          worstRating: 1,
        },
      })),
    }),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }}
    />
  )
}
