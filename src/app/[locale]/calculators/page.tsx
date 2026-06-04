import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { connection } from 'next/server'
import { setRequestLocale } from 'next-intl/server'
import { isValidLocale } from '@/i18n/request'
import { EngineeringWorkspace } from '@/components/engineering/engineering-workspace'
import { getEngineeringCatalogProducts } from '@/lib/engineering/catalog'
import type { EngineeringLocale } from '@/lib/engineering/types'

interface CalculatorsPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: CalculatorsPageProps): Promise<Metadata> {
  const { locale } = await params
  if (!isValidLocale(locale)) return {}

  const isUk = locale === 'uk'
  return {
    title: isUk
      ? 'Інженерний калькулятор щита | Electronom'
      : 'Инженерный калькулятор щита | Electronom',
    description: isUk
      ? 'Розрахунок ліній квартири або будинку, схема щита, кабелі, автомати, УЗО і специфікація з прив’язкою до каталогу Electronom.'
      : 'Расчет линий квартиры или дома, схема щита, кабели, автоматы, УЗО и спецификация с привязкой к каталогу Electronom.',
  }
}

export default async function CalculatorsPage({ params }: CalculatorsPageProps) {
  const { locale } = await params
  if (!isValidLocale(locale)) notFound()

  setRequestLocale(locale)
  await connection()
  const products = await getEngineeringCatalogProducts(locale as EngineeringLocale)

  return <EngineeringWorkspace locale={locale as EngineeringLocale} products={products} />
}
