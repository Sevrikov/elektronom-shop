// src/app/[locale]/(shop)/blog/page.tsx
// Список статей (Блог)
// MASTER_CONTEXT v1.2 §12

import type { Metadata } from 'next'
import Link from 'next/link'
import { setRequestLocale } from 'next-intl/server'
import { isValidLocale } from '@/i18n/request'
import { articles } from '@/lib/articles'
import Breadcrumbs from '@/components/layout/breadcrumbs'
import { BookOpen, Calendar, Clock, ArrowRight } from 'lucide-react'
import type { Locale } from '@/types'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const isUk = locale === 'uk'
  return {
    title: isUk ? 'Корисні статті та огляди | Electronom' : 'Полезные статьи и обзоры | Electronom',
    description: isUk 
      ? 'База знань інтернет-магазину Electronom: поради щодо вибору автоматики, ДБЖ, розрахунку перетину кабелю та вибору інструментів.'
      : 'База знаний интернет-магазина Electronom: советы по выбору автоматики, ИБП, расчету сечения кабеля и выбору инструментов.',
  }
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  if (!isValidLocale(locale)) return null
  const isUk = locale === 'uk'

  const breadcrumbs = [
    { name: isUk ? 'Головна' : 'Главная', url: '/' },
    { name: isUk ? 'Блог та статті' : 'Блог и статьи' },
  ]

  return (
    <div className="max-w-[1280px] mx-auto px-4 lg:px-7 py-6">
      <Breadcrumbs items={breadcrumbs} locale={locale} />

      <div className="mt-6 flex items-center gap-3">
        <div className="size-10 rounded-xl bg-accent text-white flex items-center justify-center">
          <BookOpen className="size-5" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-text-primary">
            {isUk ? 'Корисні статті та огляди' : 'Полезные статьи и обзоры'}
          </h1>
          <p className="text-sm text-text-muted mt-1">
            {isUk 
              ? 'Професійні поради та технічні посібники від фахівців Electronom' 
              : 'Профессиональные советы и технические руководства от специалистов Electronom'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {articles.map((art) => (
          <article 
            key={art.slug}
            className="group flex flex-col bg-surface-white border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all"
          >
            {/* Image */}
            <div className="relative h-48 w-full overflow-hidden bg-surface-alt">
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
              {/* Date & Time */}
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
              <h2 className="font-extrabold text-lg text-text-primary leading-snug mb-2 group-hover:text-accent transition-colors line-clamp-2">
                <Link href={`/${locale}/blog/${art.slug}` as never}>
                  {art.title[locale as 'uk' | 'ru']}
                </Link>
              </h2>

              {/* Summary */}
              <p className="text-sm text-text-muted line-clamp-3 mb-5 flex-1">
                {art.summary[locale as 'uk' | 'ru']}
              </p>

              {/* Link */}
              <Link 
                href={`/${locale}/blog/${art.slug}` as never}
                className="inline-flex items-center gap-1 text-xs font-bold text-accent hover:underline mt-auto group-hover:gap-1.5 transition-all"
              >
                <span>{isUk ? 'Читати повністю' : 'Читать полностью'}</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
