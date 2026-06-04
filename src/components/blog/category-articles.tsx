// src/components/blog/category-articles.tsx
// Блок статей на странице категории
// MASTER_CONTEXT v1.2 §12

import Link from 'next/link'
import { getArticlesForCategory } from '@/lib/articles'
import { BookOpen, Calendar, Clock, ArrowRight } from 'lucide-react'

interface CategoryArticlesProps {
  categorySlug: string
  locale: string
}

export function CategoryArticles({ categorySlug, locale }: CategoryArticlesProps) {
  const articles = getArticlesForCategory(categorySlug)
  if (articles.length === 0) return null

  const isUk = locale === 'uk'
  const titleText = isUk ? 'Корисні статті та огляди' : 'Полезные статьи и обзоры'
  const readText = isUk ? 'читати' : 'читать'

  return (
    <section className="mt-12 pt-10 border-t border-border">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2.5">
          <div className="size-9 rounded-lg bg-accent-subtle text-accent flex items-center justify-center">
            <BookOpen className="size-5" />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-text-primary">
            {titleText}
          </h2>
        </div>
        <Link 
          href={`/${locale}/blog` as never}
          className="text-xs sm:text-sm font-semibold text-accent hover:text-accent-hover transition-colors flex items-center gap-1 group"
        >
          <span>{isUk ? 'Всі статті' : 'Все статьи'}</span>
          <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((art) => (
          <article 
            key={art.slug}
            className="group flex flex-col bg-surface-white border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Image */}
            <div className="relative h-44 w-full overflow-hidden bg-surface-alt">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={art.image} 
                alt={art.title[locale as 'uk' | 'ru']}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-surface-white/90 backdrop-blur-xs text-[10px] font-bold uppercase tracking-wider text-text-primary px-2.5 py-1 rounded-md shadow-xs">
                {art.categoryKeywords[0]}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col p-5">
              {/* Date / Read time */}
              <div className="flex items-center gap-3 text-[11px] text-text-muted mb-2.5">
                <span className="flex items-center gap-1">
                  <Calendar className="size-3" />
                  {art.date}
                </span>
                <span className="text-border-strong">•</span>
                <span className="flex items-center gap-1">
                  <Clock className="size-3" />
                  {art.readTime[locale as 'uk' | 'ru']}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-extrabold text-base text-text-primary leading-snug mb-2 group-hover:text-accent transition-colors line-clamp-2">
                <Link href={`/${locale}/blog/${art.slug}` as never}>
                  {art.title[locale as 'uk' | 'ru']}
                </Link>
              </h3>

              {/* Summary */}
              <p className="text-sm text-text-muted line-clamp-3 mb-4 flex-1">
                {art.summary[locale as 'uk' | 'ru']}
              </p>

              {/* Link */}
              <Link 
                href={`/${locale}/blog/${art.slug}` as never}
                className="inline-flex items-center gap-1 text-xs font-bold text-accent hover:underline mt-auto"
              >
                <span>{readText}</span>
                <ArrowRight className="size-3" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
