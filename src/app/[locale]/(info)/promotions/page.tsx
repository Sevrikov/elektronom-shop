import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isValidLocale } from '@/i18n/request'
import Breadcrumbs from '@/components/layout/breadcrumbs'
import { Tag, Sparkles, Percent, Calendar, Compass, Phone } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface PageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const uk = locale !== 'ru'
  return {
    title: `${uk ? 'Акції та знижки' : 'Акции и скидки'} | Electronom`,
    description: uk
      ? 'Актуальні акції, розпродажі та спеціальні пропозиції в інтернет-магазині Electronom. Купуйте вигідно!'
      : 'Актуальные акции, распродажи и специальные предложения в интернет-магазине Electronom. Покупайте выгодно!',
  }
}

export default async function PromotionsPage({ params }: PageProps) {
  const { locale } = await params
  if (!isValidLocale(locale)) notFound()
  const uk = locale !== 'ru'

  const breadcrumbs = [
    { name: uk ? 'Головна' : 'Главная', url: '/' },
    { name: uk ? 'Акції' : 'Акции' },
  ]

  const promotions = [
    {
      icon: Sparkles,
      title: uk ? 'Безкоштовна доставка' : 'Бесплатная доставка',
      desc: uk
        ? 'Замовляйте будь-яке обладнання на суму від 5000 грн та отримуйте безкоштовну доставку у відділення Нової Пошти.'
        : 'Заказывайте любое оборудование на сумму от 5000 грн и получайте бесплатную доставку в отделение Новой Почты.',
      badge: uk ? 'Акція діє постійно' : 'Акция действует постоянно',
      color: 'bg-indigo-50 border-indigo-100 text-indigo-700 hover:bg-indigo-100/50',
    },
    {
      icon: Percent,
      title: uk ? 'Знижки на комплекти кабелю' : 'Скидки на комплекты кабеля',
      desc: uk
        ? 'Купуйте бухту кабелю та комплект підрозетників разом і отримуйте додаткову знижку 10% на все замовлення.'
        : 'Покупайте бухту кабеля и комплект подрозетников вместе и получайте дополнительную скидку 10% на весь заказ.',
      badge: uk ? 'До 31 червня' : 'До 31 июня',
      color: 'bg-emerald-50 border-emerald-100 text-emerald-700 hover:bg-emerald-100/50',
    },
    {
      icon: Tag,
      title: uk ? 'Знижка 5% на перше замовлення' : 'Скидка 5% на первый заказ',
      desc: uk
        ? 'Зареєструйтеся на нашому сайті та отримайте вітальну знижку 5% на першу покупку будь-якого товару.'
        : 'Зарегистрируйтесь на нашем сайте и получите приветственную скидку 5% на первую покупку любого товара.',
      badge: uk ? 'Для нових клієнтів' : 'Для новых клиентов',
      color: 'bg-amber-50 border-amber-100 text-amber-700 hover:bg-amber-100/50',
    },
  ]

  return (
    <div className="min-h-[calc(100vh-200px)] bg-surface-alt py-6 lg:py-8">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-20">
        <Breadcrumbs items={breadcrumbs} locale={locale} />

        <h1 className="text-3xl font-extrabold text-text-primary mt-4 mb-2">
          {uk ? 'Акції та спеціальні пропозиції' : 'Акции и специальные предложения'}
        </h1>
        <p className="text-sm text-text-muted mb-8">
          {uk ? 'Купуйте якісне електрообладнання за вигідними цінами' : 'Покупайте качественное электрооборудование по выгодным ценам'}
        </p>

        {/* Big Promo Banner (Local mock style, premium layout) */}
        <div className="relative bg-gradient-to-r from-accent to-[#60a5fa] rounded-3xl p-6 lg:p-10 text-white mb-10 overflow-hidden shadow-md">
          <div className="relative z-10 max-w-lg">
            <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-md">
              {uk ? 'Суперпропозиція' : 'Суперпредложение'}
            </span>
            <h2 className="text-2xl lg:text-4xl font-black mt-4 leading-tight">
              {uk ? 'Резервне живлення для дому під ключ' : 'Резервное питание для дома под ключ'}
            </h2>
            <p className="mt-2 text-sm lg:text-base text-white/90 leading-relaxed">
              {uk
                ? 'Комплекти АВР, реле напруги та акумуляторних батарей зі знижкою до 15%. Забезпечте повну енергонезалежність вашого житла.'
                : 'Комплекты АВР, реле напряжения и аккумуляторных батарей со скидкой до 15%. Обеспечьте полную энергонезависимость вашего жилья.'}
            </p>
            <div className="mt-6 flex flex-wrap gap-4 items-center">
              <Link
                href="/catalog"
                className="bg-white hover:bg-white/90 text-accent font-bold text-sm px-6 py-3 rounded-xl transition-all shadow-sm"
              >
                {uk ? 'Дивитись товари' : 'Смотреть товары'}
              </Link>
              <span className="text-xs text-white/80 font-medium">
                {uk ? '*Пропозиція діє до кінця місяця' : '*Предложение действует до конца месяца'}
              </span>
            </div>
          </div>
          {/* Subtle background abstract shapes */}
          <div className="absolute right-[-100px] bottom-[-100px] w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-1/3 hidden lg:flex items-center justify-center opacity-85 pointer-events-none">
            <Compass className="w-48 h-48 text-white/10 rotate-12" />
          </div>
        </div>

        {/* Other Promo cards list */}
        <section className="mb-10">
          <h3 className="text-xl font-bold text-text-primary mb-6 pb-2 border-b border-border">
            {uk ? 'Діючі акції' : 'Действующие акции'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {promotions.map(({ icon: Icon, title, desc, badge, color }) => (
              <div key={title} className={`bg-white border rounded-2xl p-6 shadow-sm flex flex-col justify-between transition-all duration-200 border-border hover:shadow-md hover:border-accent/20`}>
                <div>
                  <div className={`size-12 rounded-xl flex items-center justify-center mb-4 ${color.split(' ')[0]} ${color.split(' ')[2]}`}>
                    <Icon className="size-6" />
                  </div>
                  <h4 className="font-bold text-text-primary text-base mb-2">{title}</h4>
                  <p className="text-sm text-text-muted leading-relaxed mb-4">{desc}</p>
                </div>
                <div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-surface-alt text-text-muted border border-border">
                    <Calendar className="size-3" />
                    {badge}
                  </span>
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
              {uk ? 'Маєте питання щодо гуртових знижок?' : 'Есть вопросы по оптовым скидкам?'}
            </p>
            <p className="text-sm text-text-muted mt-0.5">
              {uk
                ? 'Зв’яжіться з нашим корпоративним відділом: '
                : 'Свяжитесь с нашим корпоративным отделом: '}
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
