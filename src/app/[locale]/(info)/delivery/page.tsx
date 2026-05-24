import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isValidLocale } from '@/i18n/request'
import Breadcrumbs from '@/components/layout/breadcrumbs'
import { Truck, CreditCard, Clock, MapPin, RefreshCw, Phone } from 'lucide-react'

interface PageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const uk = locale !== 'ru'
  return {
    title: `${uk ? 'Доставка та оплата' : 'Доставка и оплата'} | Electronom`,
    description: uk
      ? 'Умови доставки та оплати в інтернет-магазині Electronom. Доставка по Україні Новою поштою від 1 дня.'
      : 'Условия доставки и оплаты в интернет-магазине Electronom. Доставка по Украине Новой почтой от 1 дня.',
  }
}

export default async function DeliveryPage({ params }: PageProps) {
  const { locale } = await params
  if (!isValidLocale(locale)) notFound()
  const uk = locale !== 'ru'

  const breadcrumbs = [
    { name: uk ? 'Головна' : 'Главная', url: '/' },
    { name: uk ? 'Доставка та оплата' : 'Доставка и оплата' },
  ]

  const deliveryMethods = [
    {
      icon: Truck,
      title: uk ? 'Нова Пошта' : 'Новая Почта',
      desc: uk
        ? 'Доставка по всій Україні. Середній строк 1-2 робочих дні.'
        : 'Доставка по всей Украине. Средний срок 1-2 рабочих дня.',
      note: uk ? 'Оплата доставки за тарифами перевізника' : 'Оплата доставки по тарифам перевозчика',
    },
    {
      icon: MapPin,
      title: uk ? 'Самовивіз' : 'Самовывоз',
      desc: uk
        ? 'Зі складу в Києві за адресою: вул. Прикладна 10. Пн-Пт 9:00–18:00.'
        : 'Со склада в Киеве по адресу: ул. Прикладная 10. Пн-Пт 9:00–18:00.',
      note: uk ? 'Безкоштовно' : 'Бесплатно',
    },
    {
      icon: Clock,
      title: uk ? 'Термін відправлення' : 'Срок отправки',
      desc: uk
        ? 'Замовлення отримані до 14:00 відправляються в той самий день.'
        : 'Заказы, полученные до 14:00, отправляются в тот же день.',
      note: uk ? 'Пн-Пт (у робочі дні)' : 'Пн-Пт (в рабочие дни)',
    },
  ]

  const paymentMethods = [
    {
      icon: CreditCard,
      title: uk ? 'Карткою онлайн' : 'Картой онлайн',
      desc: uk ? 'Visa, Mastercard через захищений шлюз LiqPay.' : 'Visa, Mastercard через защищённый шлюз LiqPay.',
    },
    {
      icon: Truck,
      title: uk ? 'Накладений платіж' : 'Наложенный платёж',
      desc: uk ? 'Оплата при отриманні замовлення від перевізника.' : 'Оплата при получении заказа от перевозчика.',
    },
    {
      icon: RefreshCw,
      title: uk ? 'Покупка частинами' : 'Покупка частями',
      desc: uk
        ? 'Monobank та ПриватБанк. Розстрочка від 0% на 3–24 місяці.'
        : 'Monobank и ПриватБанк. Рассрочка от 0% на 3–24 месяца.',
    },
    {
      icon: CreditCard,
      title: uk ? 'Безготівковий з ПДВ' : 'Безналичный с НДС',
      desc: uk
        ? 'Для юридичних осіб за рахунком-фактурою.'
        : 'Для юридических лиц по счёт-фактуре.',
    },
  ]

  return (
    <div className="min-h-[calc(100vh-200px)] bg-surface-alt py-6 lg:py-8">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-20">
        <Breadcrumbs items={breadcrumbs} locale={locale} />

        <h1 className="text-3xl font-extrabold text-text-primary mt-4 mb-8">
          {uk ? 'Доставка та оплата' : 'Доставка и оплата'}
        </h1>

        {/* Delivery */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-text-primary mb-4 pb-2 border-b border-border">
            {uk ? 'Варіанти доставки' : 'Варианты доставки'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {deliveryMethods.map(({ icon: Icon, title, desc, note }) => (
              <div key={title} className="bg-white border border-border rounded-2xl p-6 shadow-sm">
                <div className="size-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-4">
                  <Icon className="size-5" />
                </div>
                <h3 className="font-bold text-text-primary mb-2">{title}</h3>
                <p className="text-sm text-text-muted leading-relaxed mb-3">{desc}</p>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-surface-alt text-text-muted border border-border">
                  {note}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Payment */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-text-primary mb-4 pb-2 border-b border-border">
            {uk ? 'Способи оплати' : 'Способы оплаты'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {paymentMethods.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white border border-border rounded-2xl p-6 shadow-sm flex gap-4">
                <div className="size-10 rounded-xl bg-success/10 text-success flex items-center justify-center shrink-0">
                  <Icon className="size-5" />
                </div>
                <div>
                  <h3 className="font-bold text-text-primary mb-1">{title}</h3>
                  <p className="text-sm text-text-muted">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Help CTA */}
        <div className="bg-accent/5 border border-accent/20 rounded-2xl p-6 flex items-center gap-4">
          <div className="size-10 rounded-xl bg-accent text-white flex items-center justify-center shrink-0">
            <Phone className="size-5" />
          </div>
          <div>
            <p className="font-bold text-text-primary">
              {uk ? 'Маєте питання щодо доставки?' : 'Есть вопросы по доставке?'}
            </p>
            <p className="text-sm text-text-muted mt-0.5">
              {uk
                ? 'Зателефонуйте нам: '
                : 'Позвоните нам: '}
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
