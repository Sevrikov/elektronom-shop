// src/components/seo/article-schema.tsx
// Server Component — JSON-LD Article/BlogPosting schema.org

interface ArticleSchemaProps {
  title: string
  description: string
  url: string
  image?: string | undefined
  datePublished: string
  dateModified?: string | undefined
  locale: 'uk' | 'ru'
  type?: 'BlogPosting' | 'TechArticle' | undefined
}

export function ArticleSchema({
  title,
  description,
  url,
  image,
  datePublished,
  dateModified,
  locale,
  type,
}: ArticleSchemaProps) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': type ?? 'BlogPosting',
    headline: title,
    description: description,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    url: url,
    ...(image && { image }),
    datePublished: datePublished,
    dateModified: dateModified ?? datePublished,
    inLanguage: locale,
    publisher: {
      '@type': 'Organization',
      'name': 'Electronom',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://elektronom.com.ua/electronom.png',
      },
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
