import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isValidLocale } from '@/i18n/request'
import Breadcrumbs from '@/components/layout/breadcrumbs'
import { Star, MessageSquare, User, Calendar, ShieldCheck, Heart } from 'lucide-react'

interface PageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const uk = locale !== 'ru'
  return {
    title: `${uk ? 'Відгуки про магазин' : 'Отзывы о магазине'} | Electronom`,
    description: uk
      ? 'Відгуки клієнтів про роботу інтернет-магазину електрики та електроніки Electronom. Досвід покупок, якість обслуговування.'
      : 'Отзывы клиентов о работе интернет-магазина электрики и электроники Electronom. Опыт покупок, качество обслуживания.',
  }
}

export default async function ReviewsPage({ params }: PageProps) {
  const { locale } = await params
  if (!isValidLocale(locale)) notFound()
  const uk = locale !== 'ru'

  const breadcrumbs = [
    { name: uk ? 'Головна' : 'Главная', url: '/' },
    { name: uk ? 'Відгуки' : 'Отзывы' },
  ]

  const mockReviews = [
    {
      name: uk ? 'Олександр В.' : 'Александр В.',
      date: '2026-05-28',
      rating: 5,
      comment: uk
        ? 'Купував автоматичні перемикачі введення резерву (АВР) для приватного будинку. Доставили швидко, все відповідає опису. Дякую за консультацію!'
        : 'Покупал автоматические переключатели ввода резерва (АВР) для частного дома. Доставили быстро, все соответствует описанию. Спасибо за консультацию!',
      verified: true,
    },
    {
      name: uk ? 'Марія К.' : 'Мария К.',
      date: '2026-05-24',
      rating: 5,
      comment: uk
        ? 'Чудовий сервіс. Замовляла акумулятор Trinix для ДБЖ. Менеджер допоміг підібрати правильну модель. Забрала самовивозом у Києві.'
        : 'Отличный сервис. Заказывала аккумулятор Trinix для ИБП. Менеджер помог подобрать правильную модель. Забрала самовывозом в Киеве.',
      verified: true,
    },
    {
      name: uk ? 'Ігор Д.' : 'Игорь Д.',
      date: '2026-05-19',
      rating: 4,
      comment: uk
        ? 'Широкий асортимент та хороші ціни на кабельну продукцію. Робив велике замовлення для монтажу. Однозначно рекомендую магазин.'
        : 'Широкий ассортимент и хорошие цены на кабельную продукцию. Делал большой заказ для монтажа. Однозначно рекомендую магазин.',
      verified: true,
    },
    {
      name: uk ? 'Олена С.' : 'Елена С.',
      date: '2026-05-15',
      rating: 5,
      comment: uk
        ? 'Дуже вдячна за швидку відправку. Товар прийшов надійно упакований, з чеком та гарантійним талоном. Буду замовляти ще!'
        : 'Очень благодарна за быструю отправку. Товар пришел надежно упакованным, с чеком и гарантийным талоном. Буду заказывать еще!',
      verified: true,
    },
  ]

  return (
    <div className="min-h-[calc(100vh-200px)] bg-surface-alt py-6 lg:py-8">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-20">
        <Breadcrumbs items={breadcrumbs} locale={locale} />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-4 mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-text-primary">
              {uk ? 'Відгуки клієнтів' : 'Отзывы клиентов'}
            </h1>
            <p className="text-sm text-text-muted mt-1">
              {uk
                ? 'Що про нас говорять покупці'
                : 'Что о нас говорят покупатели'}
            </p>
          </div>
          <div className="bg-white border border-border px-4 py-2.5 rounded-2xl flex items-center gap-2 shadow-sm">
            <span className="text-xl font-black text-text-primary">4.9</span>
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="size-4 fill-current" />
              ))}
            </div>
            <span className="text-xs text-text-muted border-l pl-2 border-border">
              {uk ? 'на основі 140+ відгуків' : 'на основе 140+ отзывов'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Reviews list */}
          <div className="lg:col-span-2 space-y-6">
            {mockReviews.map((review, idx) => (
              <div key={idx} className="bg-white border border-border rounded-2xl p-6 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-accent/10 text-accent flex items-center justify-center font-bold">
                      <User className="size-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-text-primary text-sm">{review.name}</h3>
                      {review.verified && (
                        <span className="inline-flex items-center gap-1 text-xs text-success font-medium mt-0.5">
                          <ShieldCheck className="size-3.5" />
                          {uk ? 'Підтверджений покупець' : 'Подтвержденный покупатель'}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`size-3.5 ${i < review.rating ? 'fill-current' : 'text-border'}`} />
                      ))}
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] text-text-muted mt-1">
                      <Calendar className="size-3" />
                      {review.date}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-text-primary leading-relaxed">{review.comment}</p>
              </div>
            ))}
          </div>

          {/* Leave a review sidebar card */}
          <div className="space-y-6">
            <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
              <div className="size-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-4">
                <MessageSquare className="size-6" />
              </div>
              <h3 className="font-bold text-text-primary text-lg mb-2">
                {uk ? 'Залишити свій відгук' : 'Оставить свой отзыв'}
              </h3>
              <p className="text-sm text-text-muted leading-relaxed mb-4">
                {uk
                  ? 'Ваша думка дуже важлива для нас! Поділіться своїм досвідом покупок у нашому магазині, щоб допомогти іншим клієнтам зробити правильний вибір.'
                  : 'Ваше мнение очень важно для нас! Поделитесь своим опытом покупок в нашем магазине, чтобы помочь другим клиентам сделать правильный выбор.'}
              </p>
              <button className="w-full bg-accent hover:bg-accent/90 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors shadow-sm cursor-pointer">
                {uk ? 'Написати відгук' : 'Написать отзыв'}
              </button>
            </div>

            <div className="bg-success/5 border border-success/10 rounded-2xl p-6 flex gap-4">
              <Heart className="size-6 text-success shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-text-primary text-sm mb-1">
                  {uk ? 'Дякуємо за довіру!' : 'Спасибо за доверие!'}
                </h4>
                <p className="text-xs text-text-muted leading-relaxed">
                  {uk
                    ? 'Ми робимо все можливе для забезпечення найвищого рівня сервісу та постачання виключно якісного електрообладнання.'
                    : 'Мы делаем все возможное для обеспечения высочайшего уровня сервиса и поставки исключительно качественного электрооборудования.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
