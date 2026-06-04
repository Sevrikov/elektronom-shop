import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isValidLocale } from '@/i18n/request'
import Breadcrumbs from '@/components/layout/breadcrumbs'
import { CreditCard, Truck, RefreshCw, Landmark, ShieldCheck, Phone } from 'lucide-react'

interface PageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const uk = locale !== 'ru'
  return {
    title: `${uk ? 'Оплата' : 'Оплата'} | Electronom`,
    description: uk
      ? 'Способи оплати товарів в інтернет-магазині Electronom. Зручна та безпечна оплата онлайн, післяплата або безготівковий розрахунок.'
      : 'Способы оплаты товаров в интернет-магазине Electronom. Удобная и безопасная оплата онлайн, наложенный платеж или безналичный расчет.',
  }
}

export default async function PaymentPage({ params }: PageProps) {
  const { locale } = await params
  if (!isValidLocale(locale)) notFound()
  const uk = locale !== 'ru'

  const breadcrumbs = [
    { name: uk ? 'Головна' : 'Главная', url: '/' },
    { name: uk ? 'Оплата' : 'Оплата' },
  ]

  const paymentMethods = [
    {
      icon: CreditCard,
      title: uk ? 'Оплата карткою онлайн' : 'Оплата картой онлайн',
      desc: uk
        ? 'Миттєва оплата картками Visa або Mastercard через безпечний платіжний сервіс LiqPay без додаткових комісій.'
        : 'Мгновенная оплата картами Visa или Mastercard через безопасный платежный сервис LiqPay без дополнительных комиссий.',
    },
    {
      icon: Truck,
      title: uk ? 'Оплата при отриманні (Накладений платіж)' : 'Оплата при получении (Наложенный платеж)',
      desc: uk
        ? 'Сплачуйте готівкою або карткою у відділенні Нової Пошти після огляду та перевірки замовленого товару.'
        : 'Оплачивайте наличными или картой в отделении Новой Почты после осмотра и проверки заказанного товара.',
    },
    {
      icon: RefreshCw,
      title: uk ? 'Покупка частинами (Розстрочка)' : 'Покупка частями (Рассрочка)',
      desc: uk
        ? 'Оформлюйте безвідсоткову розстрочку від Monobank або ПриватБанк терміном від 3 до 24 місяців безпосередньо при покупці.'
        : 'Оформляйте беспроцентную рассрочку от Monobank или ПриватБанк сроком от 3 до 24 месяцев непосредственно при покупке.',
    },
    {
      icon: Landmark,
      title: uk ? 'Безготівковий розрахунок (з ПДВ)' : 'Безналичный расчет (с НДС)',
      desc: uk
        ? 'Для юридичних та фізичних осіб-підприємців. Надаємо повний пакет бухгалтерських документів та видаткові накладні.'
        : 'Для юридических и физических лиц-предпринимателей. Предоставляем полный пакет бухгалтерских документов и расходные накладные.',
    },
  ]

  return (
    <div className="min-h-[calc(100vh-200px)] bg-surface-alt py-6 lg:py-8">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-20">
        <Breadcrumbs items={breadcrumbs} locale={locale} />

        <h1 className="text-3xl font-extrabold text-text-primary mt-4 mb-8">
          {uk ? 'Оплата' : 'Оплата'}
        </h1>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-text-primary mb-4 pb-2 border-b border-border">
            {uk ? 'Способи оплати замовлення' : 'Способы оплаты заказа'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {paymentMethods.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white border border-border rounded-2xl p-6 shadow-sm flex gap-4">
                <div className="size-12 rounded-xl bg-success/10 text-success flex items-center justify-center shrink-0">
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

        {/* Security Info Banner */}
        <div className="mb-10 bg-white border border-border rounded-2xl p-6 shadow-sm flex gap-4 items-start">
          <div className="size-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
            <ShieldCheck className="size-5" />
          </div>
          <div>
            <h3 className="font-bold text-text-primary mb-1">
              {uk ? 'Безпека платежів' : 'Безопасность платежей'}
            </h3>
            <p className="text-sm text-text-muted leading-relaxed">
              {uk
                ? 'Всі операції з оплати карткою проводяться на захищеній платіжній сторінці банку-еквайєра. Ми не зберігаємо та не обробляємо дані ваших карток. Дані передаються по захищеному каналу SSL.'
                : 'Все операции по оплате картой проводятся на защищенной платежной странице банка-эквайера. Мы не храним и не обрабатываем данные ваших карт. Данные передаются по защищенному каналу SSL.'}
            </p>
          </div>
        </div>

        {/* Help CTA */}
        <div className="bg-accent/5 border border-accent/20 rounded-2xl p-6 flex items-center gap-4">
          <div className="size-10 rounded-xl bg-accent text-white flex items-center justify-center shrink-0">
            <Phone className="size-5" />
          </div>
          <div>
            <p className="font-bold text-text-primary">
              {uk ? 'Маєте питання щодо оплати?' : 'Есть вопросы по оплате?'}
            </p>
            <p className="text-sm text-text-muted mt-0.5">
              {uk
                ? 'Зверніться до нашої служби підтримки: '
                : 'Обратитесь в нашу службу поддержки: '}
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
