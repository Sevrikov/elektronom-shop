import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isValidLocale } from '@/i18n/request'
import Breadcrumbs from '@/components/layout/breadcrumbs'
import { RefreshCw, ClipboardList, HelpCircle, PackageOpen, AlertCircle, Phone } from 'lucide-react'

interface PageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const uk = locale !== 'ru'
  return {
    title: `${uk ? 'Повернення та обмін' : 'Возврат и обмен'} | Electronom`,
    description: uk
      ? 'Умови обміну та повернення товарів в інтернет-магазині Electronom. Повернення товару належної якості протягом 14 днів.'
      : 'Условия обмена и возврата товаров в интернет-магазине Electronom. Возврат товара надлежащего качества в течение 14 дней.',
  }
}

export default async function ReturnsPage({ params }: PageProps) {
  const { locale } = await params
  if (!isValidLocale(locale)) notFound()
  const uk = locale !== 'ru'

  const breadcrumbs = [
    { name: uk ? 'Головна' : 'Главная', url: '/' },
    { name: uk ? 'Повернення' : 'Возврат' },
  ]

  const returnRules = [
    {
      icon: PackageOpen,
      title: uk ? 'Товар належної якості' : 'Товар надлежащего качества',
      desc: uk
        ? 'Ви можете повернути або обміняти товар протягом 14 днів з моменту покупки, якщо він не використовувався, зберіг свій товарний вигляд, пломби, ярлики та заводську упаковку.'
        : 'Вы можете вернуть или обменять товар в течение 14 дней с момента покупки, если он не использовался, сохранил свой товарный вид, пломбы, ярлыки и заводскую упаковку.',
    },
    {
      icon: AlertCircle,
      title: uk ? 'Товар неналежної якості (Брак)' : 'Товар ненадлежащего качества (Брак)',
      desc: uk
        ? 'У разі виявлення виробничих дефектів під час експлуатації протягом гарантійного терміну, товар підлягає безкоштовному сервісному ремонту, обміну або поверненню грошових коштів.'
        : 'При обнаружении производственных дефектов во время эксплуатации в течение гарантийного срока, товар подлежит бесплатному сервисному ремонту, обмену или возврату денежных средств.',
    },
    {
      icon: ClipboardList,
      title: uk ? 'Необхідні документи' : 'Необходимые документы',
      desc: uk
        ? 'Для оформлення повернення знадобляться: документ, що підтверджує покупку (чек або видаткова накладна), заповнена заява на повернення та документ, що засвідчує особу (паспорт).'
        : 'Для оформления возврата понадобятся: документ, подтверждающий покупку (чек или расходная накладная), заполненное заявление на возврат и документ, удостоверяющий личность (паспорт).',
    },
    {
      icon: RefreshCw,
      title: uk ? 'Повернення коштів' : 'Возврат средств',
      desc: uk
        ? 'Повернення коштів здійснюється у термін до 7 робочих днів на банківську картку покупця або за реквізитами банківського рахунку.'
        : 'Возврат средств осуществляется в срок до 7 рабочих дней на банковскую карту покупателя или по реквизитам банковского счета.',
    },
  ]

  return (
    <div className="min-h-[calc(100vh-200px)] bg-surface-alt py-6 lg:py-8">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-20">
        <Breadcrumbs items={breadcrumbs} locale={locale} />

        <h1 className="text-3xl font-extrabold text-text-primary mt-4 mb-8">
          {uk ? 'Повернення та обмін' : 'Возврат и обмен'}
        </h1>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-text-primary mb-4 pb-2 border-b border-border">
            {uk ? 'Правила повернення товарів' : 'Правила возврата товаров'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {returnRules.map(({ icon: Icon, title, desc }) => (
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

        {/* Info Box */}
        <div className="mb-10 bg-white border border-border rounded-2xl p-6 shadow-sm flex gap-4 items-start">
          <div className="size-10 rounded-xl bg-warning/10 text-warning flex items-center justify-center shrink-0">
            <HelpCircle className="size-5" />
          </div>
          <div>
            <h3 className="font-bold text-text-primary mb-1">
              {uk ? 'Хто сплачує транспортні витрати?' : 'Кто оплачивает транспортные расходы?'}
            </h3>
            <p className="text-sm text-text-muted leading-relaxed">
              {uk
                ? 'Якщо ви повертаєте товар належної якості (не підійшов за кольором, розміром тощо), доставку сплачує покупець. Якщо повернення відбувається через виробничий брак або помилку комплектації з нашого боку, доставку сплачує магазин.'
                : 'Если вы возвращаете товар надлежащего качества (не подошел по цвету, размеру и т.д.), доставку оплачивает покупатель. Если возврат происходит из-за производственного брака или ошибки комплектации с нашей стороны, доставку оплачивает магазин.'}
            </p>
          </div>
        </div>

        {/* Support CTA */}
        <div className="bg-accent/5 border border-accent/20 rounded-2xl p-6 flex items-center gap-4">
          <div className="size-10 rounded-xl bg-accent text-white flex items-center justify-center shrink-0">
            <Phone className="size-5" />
          </div>
          <div>
            <p className="font-bold text-text-primary">
              {uk ? 'Бажаєте оформити повернення?' : 'Хотите оформить возврат?'}
            </p>
            <p className="text-sm text-text-muted mt-0.5">
              {uk
                ? 'Зв’яжіться з нашою підтримкою для отримання деталей відправлення: '
                : 'Свяжитесь с нашей поддержкой для получения деталей отправки: '}
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
