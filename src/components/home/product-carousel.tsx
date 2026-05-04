'use client'

import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { ChevronRight, ShoppingCart, Check } from 'lucide-react'
import type { DemoProduct } from '@/lib/constants'
import type { Locale } from '@/types'

function ProductCard({ product, locale }: { product: DemoProduct; locale: Locale }) {
  return (
    <article
      className="shrink-0 w-[220px] rounded-lg overflow-hidden flex flex-col transition-shadow hover:shadow-md group"
      style={{ border: '1px solid var(--color-border)', background: '#fff' }}
    >
      {/* Image placeholder */}
      <div
        className="relative h-[140px] flex items-center justify-center"
        style={{ background: 'var(--color-surface-alt)' }}
      >
        {/* Stock badge */}
        <div
          className="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold"
          style={{ background: 'var(--color-success-subtle)', color: 'var(--color-success)' }}
        >
          <Check className="size-3" strokeWidth={2.5} />
          В наявності
        </div>
        {/* Placeholder icon */}
        <div className="size-16 rounded-lg flex items-center justify-center" style={{ background: 'var(--color-surface-raised)' }}>
          <span className="text-2xl font-bold" style={{ color: 'var(--color-border-strong)' }}>
            {product.brand.charAt(0)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-3 gap-1.5">
        <span className="text-[10px] font-semibold tracking-wider uppercase" style={{ color: 'var(--color-text-muted)' }}>
          {product.brand}
        </span>
        <p className="text-[13px] font-medium leading-snug line-clamp-2" style={{ color: 'var(--color-text-primary)' }}>
          {product.name[locale]}
        </p>
        <span className="text-[11px] font-mono" style={{ color: 'var(--color-text-muted)' }}>
          {product.sku}
        </span>

        <div className="mt-auto pt-2 flex items-end justify-between">
          <div>
            <p className="text-lg font-bold num" style={{ color: 'var(--color-text-primary)' }}>
              {product.price.toLocaleString('uk-UA')} ₴
            </p>
            <p className="text-[10px] font-medium" style={{ color: 'var(--color-success)' }}>
              {product.qtyBreak[locale]}
            </p>
          </div>
          <button
            className="size-9 rounded-md flex items-center justify-center transition-colors cursor-pointer"
            style={{ background: 'var(--color-accent)', color: '#fff' }}
            aria-label={`Додати ${product.name[locale]}`}
          >
            <ShoppingCart className="size-[18px]" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </article>
  )
}

interface ProductCarouselProps {
  title: string
  viewAllText: string
  viewAllHref: string
  products: DemoProduct[]
}

export default function ProductCarousel({ title, viewAllText, viewAllHref, products }: ProductCarouselProps) {
  const locale = useLocale() as Locale
  const lp = (path: string) => `/${locale}${path}`

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>
          {title}
        </h2>
        <Link
          href={lp(viewAllHref)}
          className="inline-flex items-center gap-1 text-[13px] font-medium transition-colors hover:underline"
          style={{ color: 'var(--color-accent)' }}
        >
          {viewAllText}
          <ChevronRight className="size-3.5" strokeWidth={1.5} />
        </Link>
      </div>

      <div className="no-scrollbar flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} locale={locale} />
        ))}
      </div>
    </section>
  )
}
