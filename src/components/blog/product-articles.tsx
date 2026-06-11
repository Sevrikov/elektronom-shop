// src/components/blog/product-articles.tsx
// Блок статей на странице товара
// MASTER_CONTEXT v1.2 §12

import Link from 'next/link'
import { getArticlesForProduct } from '@/lib/articles'
import { BookOpen, Calendar, Clock, ArrowRight } from 'lucide-react'

interface ProductArticlesProps {
  productName: string
  productSku: string
  locale: string
}

export function ProductArticles({ productName, productSku, locale }: ProductArticlesProps) {
  const articles = getArticlesForProduct(productName, productSku)
  if (articles.length === 0) return null

  const isUk = locale === 'uk'
  const titleText = isUk ? 'Корисна інформація та огляди до товару' : 'Полезная информация и обзоры к товару'
  const readText = isUk ? 'читати статтю' : 'читать статью'

  return (
    <section className="bg-surface-white border border-border rounded-2xl p-5 shadow-sm">
      <div className="flex items-center gap-2.5 mb-5 border-b border-border pb-3">
        <div className="size-8 rounded-lg bg-accent-subtle text-accent flex items-center justify-center shrink-0">
          <BookOpen className="size-4" />
        </div>
        <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-text-primary">
          {titleText}
        </h2>
      </div>

      <div className="flex flex-col gap-4">
        {articles.slice(0, 2).map((art) => (
          <div 
            key={art.slug}
            className="flex gap-4 p-4 border border-border rounded-xl hover:bg-surface-alt transition-colors group"
          >
            {/* Tiny image */}
            <div className="relative size-20 sm:size-24 rounded-lg overflow-hidden shrink-0 bg-surface-alt">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={art.image} 
                alt={art.title[locale as 'uk' | 'ru']}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col min-w-0">
              {/* Date & Time */}
              <div className="flex items-center gap-2 text-[10px] text-text-muted mb-1 flex-wrap">
                <span className="flex items-center gap-0.5">
                  <Calendar className="size-3" />
                  {art.date}
                </span>
                <span>•</span>
                <span className="flex items-center gap-0.5">
                  <Clock className="size-3" />
                  {art.readTime[locale as 'uk' | 'ru']}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-bold text-sm text-text-primary group-hover:text-accent transition-colors line-clamp-2 mb-1.5 leading-snug">
                <Link href={`/${locale}/blog/${art.slug}` as never}>
                  {art.title[locale as 'uk' | 'ru']}
                </Link>
              </h3>

              {/* Summary */}
              <p className="text-xs text-text-muted line-clamp-2 mb-2 flex-1">
                {art.summary[locale as 'uk' | 'ru']}
              </p>

              {/* Read button */}
              <Link 
                href={`/${locale}/blog/${art.slug}` as never}
                className="inline-flex items-center gap-0.5 text-[11px] font-bold text-accent hover:underline mt-auto"
              >
                <span>{readText}</span>
                <ArrowRight className="size-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
