import { getRequestConfig } from 'next-intl/server'
import { notFound } from 'next/navigation'

export const locales = ['uk', 'ru'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'uk'

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale)
}

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale

  if (!locale || !isValidLocale(locale)) notFound()

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  }
})
