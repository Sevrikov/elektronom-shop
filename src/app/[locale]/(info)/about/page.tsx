import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isValidLocale } from '@/i18n/request'
import Breadcrumbs from '@/components/layout/breadcrumbs'
import { Users, Award, Package, Truck } from 'lucide-react'

interface PageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const uk = locale !== 'ru'
  return {
    title: `${uk ? 'Про компанію' : 'О компании'} | ЕЛЕКТРОНОМ`,
    description: uk
      ? 'ЕЛЕКТРОНОМ — офіційний дистриб\'ютор 40+ брендів електрообладнання в Україні. Надійний постачальник для будівельних компаній та електриків.'
      : 'ЕЛЕКТРОНОМ — официальный дистрибьютор 40+ брендов электрооборудования в Украине. Надёжный поставщик для строительных компаний и электриков.',
  }
}

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params
  if (!isValidLocale(locale)) notFound()
  const uk = locale !== 'ru'

  const breadcrumbs = [
    { name: uk ? 'Головна' : 'Главная', url: `/${locale}` },
    { name: uk ? 'Про компанію' : 'О компании' },
  ]

  const stats = [
    { icon: Package, value: '10 000+', label: uk ? 'SKU в каталозі' : 'SKU в каталоге' },
    { icon: Award, value: '40+', label: uk ? 'Офіційних брендів' : 'Официальных брендов' },
    { icon: Users, value: '5 000+', label: uk ? 'Клієнтів' : 'Клиентов' },
    { icon: Truck, value: '1-2', label: uk ? 'Дні доставки' : 'Дня доставки' },
  ]

  return (
    <div className="min-h-[calc(100vh-200px)] bg-surface-alt py-6 lg:py-8">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-20">
        <Breadcrumbs items={breadcrumbs} locale={locale} />

        {/* Hero Section */}
        <div className="bg-white border border-border rounded-2xl p-8 lg:p-12 mt-4 mb-8 shadow-sm">
          <h1 className="text-3xl font-extrabold text-text-primary mb-4">
            ЕЛЕКТРОНОМ
          </h1>
          <p className="text-text-muted text-base leading-relaxed max-w-2xl">
            {uk
              ? 'Офіційний дистриб\'ютор провідних світових брендів електрообладнання. Ми постачаємо якісний електротехнічний товар для будівельних компаній, підприємств і приватних електриків по всій Україні.'
              : 'Официальный дистрибьютор ведущих мировых брендов электрооборудования. Мы поставляем качественную электротехническую продукцию для строительных компаний, предприятий и частных электриков по всей Украине.'}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map(({ icon: Icon, value, label }) => (
            <div key={label} className="bg-white border border-border rounded-2xl p-6 shadow-sm text-center">
              <div className="size-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center mx-auto mb-3">
                <Icon className="size-6" />
              </div>
              <p className="text-2xl font-extrabold text-text-primary num">{value}</p>
              <p className="text-xs text-text-muted mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-text-primary mb-4">
              {uk ? 'Наші переваги' : 'Наши преимущества'}
            </h2>
            <ul className="flex flex-col gap-3 text-sm text-text-primary">
              {[
                uk ? 'Офіційний дистриб\'ютор 40+ брендів' : 'Официальный дистрибьютор 40+ брендов',
                uk ? 'Склад у Києві — товари в наявності' : 'Склад в Киеве — товары в наличии',
                uk ? 'Доставка по всій Україні від 1 дня' : 'Доставка по всей Украине от 1 дня',
                uk ? 'Оплата з ПДВ для юридичних осіб' : 'Оплата с НДС для юридических лиц',
                uk ? 'Оптові ціни від 10 одиниць' : 'Оптовые цены от 10 единиц',
                uk ? 'Технічна підтримка та консультації' : 'Техническая поддержка и консультации',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="size-1.5 rounded-full bg-accent mt-2 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-text-primary mb-4">
              {uk ? 'Для кого ми працюємо' : 'Для кого мы работаем'}
            </h2>
            <ul className="flex flex-col gap-3 text-sm text-text-primary">
              {[
                uk ? 'Будівельні та монтажні компанії' : 'Строительные и монтажные компании',
                uk ? 'Промислові підприємства' : 'Промышленные предприятия',
                uk ? 'Приватні електрики та майстри' : 'Частные электрики и мастера',
                uk ? 'Дизайнери та архітектори' : 'Дизайнеры и архитекторы',
                uk ? 'Роздрібні покупці' : 'Розничные покупатели',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="size-1.5 rounded-full bg-success mt-2 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
