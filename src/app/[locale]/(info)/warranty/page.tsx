import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isValidLocale } from '@/i18n/request'
import Breadcrumbs from '@/components/layout/breadcrumbs'
import { Shield, ShieldAlert, Award, FileText, CheckCircle, Phone } from 'lucide-react'

interface PageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const uk = locale !== 'ru'
  return {
    title: `${uk ? 'Гарантія' : 'Гарантия'} | Electronom`,
    description: uk
      ? 'Умови офіційної гарантії на товари в інтернет-магазині Electronom. Терміни гарантійного обслуговування та сервісна підтримка.'
      : 'Условия официальной гарантии на товары в интернет-магазине Electronom. Сроки гарантийного обслуживания и сервисная поддержка.',
  }
}

export default async function WarrantyPage({ params }: PageProps) {
  const { locale } = await params
  if (!isValidLocale(locale)) notFound()
  const uk = locale !== 'ru'

  const breadcrumbs = [
    { name: uk ? 'Головна' : 'Главная', url: '/' },
    { name: uk ? 'Гарантія' : 'Гарантия' },
  ]

  const warrantyPoints = [
    {
      icon: Award,
      title: uk ? 'Офіційна гарантія' : 'Официальная гарантия',
      desc: uk
        ? 'Всі товари в нашому магазині супроводжуються офіційною гарантією від виробника терміном від 12 до 36 місяців.'
        : 'Все товары в нашем магазине сопровождаются официальной гарантией от производителя сроком от 12 до 36 месяцев.',
    },
    {
      icon: FileText,
      title: uk ? 'Гарантійний талон' : 'Гарантийный талон',
      desc: uk
        ? 'Разом із замовленням ви отримуєте чек та заповнений гарантійний талон, який дає право на безкоштовний ремонт у сервісному центрі.'
        : 'Вместе с заказом вы получаете чек и заполненный гарантийный талон, который дает право на бесплатный ремонт в сервисном центре.',
    },
    {
      icon: CheckCircle,
      title: uk ? 'Діагностика та ремонт' : 'Диагностика и ремонт',
      desc: uk
        ? 'Професійна сервісна діагностика та ремонт несправностей виконується в авторизованих сервісних центрах брендів-виробників.'
        : 'Профессиональная сервисная диагностика и ремонт неисправностей выполняется в авторизованных сервисных центрах брендов-производителей.',
    },
    {
      icon: ShieldAlert,
      title: uk ? 'Негарантійні випадки' : 'Негарантийные случаи',
      desc: uk
        ? 'Гарантія не поширюється на випадки механічних пошкоджень, порушення правил експлуатації або самостійного розбирання виробу.'
        : 'Гарантия не распространяется на случаи механических повреждений, нарушения правил эксплуатации или самостоятельной разборки изделия.',
    },
  ]

  return (
    <div className="min-h-[calc(100vh-200px)] bg-surface-alt py-6 lg:py-8">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-20">
        <Breadcrumbs items={breadcrumbs} locale={locale} />

        <h1 className="text-3xl font-extrabold text-text-primary mt-4 mb-8">
          {uk ? 'Гарантія' : 'Гарантия'}
        </h1>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-text-primary mb-4 pb-2 border-b border-border">
            {uk ? 'Умови гарантійного обслуговування' : 'Условия гарантийного обслуживания'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {warrantyPoints.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white border border-border rounded-2xl p-6 shadow-sm flex gap-4">
                <div className="size-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
                  <Icon className="size-6" />
                </div>
                <div>
                  <h3 className="font-bold text-text-primary mb-2 text-base">{title}</h3>
                  <p className="text-sm text-text-muted leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Support CTA */}
        <div className="bg-accent/5 border border-accent/20 rounded-2xl p-6 flex items-center gap-4">
          <div className="size-10 rounded-xl bg-accent text-white flex items-center justify-center shrink-0">
            <Phone className="size-5" />
          </div>
          <div>
            <p className="font-bold text-text-primary">
              {uk ? 'Потрібна сервісна підтримка?' : 'Нужна сервисная поддержка?'}
            </p>
            <p className="text-sm text-text-muted mt-0.5">
              {uk
                ? 'Зв’яжіться з нашими менеджерами: '
                : 'Свяжитесь с нашими менеджерами: '}
              <a href="tel:+380000000000" className="text-accent font-semibold hover:underline">
                +38 (000) 000-00-00
              </a>
              {uk ? ' — Пн-Пт 9:00–18:00' : ' — Пн-Пт 9:00–18:00'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
