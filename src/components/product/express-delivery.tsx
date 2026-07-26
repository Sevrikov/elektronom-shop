'use client'

import { useState, useTransition } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Store, ChevronDown, Check, Truck } from 'lucide-react'
import { createExpressOrder } from '@/actions/express-order'

type Method = 'nova_poshta' | 'ukrposhta' | 'pickup'

const carriers: { method: Method; mark: 'np' | 'up' | 'store'; nameKey: string; timeKey: string; free?: boolean }[] = [
  { method: 'nova_poshta', mark: 'np', nameKey: 'delivery.novaPoshta', timeKey: 'delivery.timeNp' },
  { method: 'ukrposhta', mark: 'up', nameKey: 'delivery.ukrposhta', timeKey: 'delivery.timeUp' },
  { method: 'pickup', mark: 'store', nameKey: 'delivery.pickup', timeKey: 'delivery.pickupFree', free: true },
]

function Mark({ mark }: { mark: 'np' | 'up' | 'store' }) {
  if (mark === 'np')
    return <span className="shrink-0 w-12 h-6 rounded bg-[#da291c] text-white text-[9px] font-extrabold flex items-center justify-center">НП</span>
  if (mark === 'up')
    return <span className="shrink-0 w-12 h-6 rounded bg-[#ffd200] text-[#1a1a1a] text-[9px] font-extrabold flex items-center justify-center">УП</span>
  return (
    <span className="shrink-0 w-12 h-6 rounded bg-surface-alt text-text-muted flex items-center justify-center">
      <Store className="size-3.5" strokeWidth={2} />
    </span>
  )
}

export function ExpressDelivery({ productId }: { productId: string }) {
  const t = useTranslations('pdp')
  const locale = useLocale()
  const isRu = locale === 'ru'

  const [openMethod, setOpenMethod] = useState<Method | null>(null)
  const [city, setCity] = useState('')
  const [branch, setBranch] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [orderNumber, setOrderNumber] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const inputCls = 'h-9 px-2.5 rounded-md border border-border bg-surface-alt text-[12px] text-text-primary outline-none focus:border-accent transition-colors'

  function toggle(method: Method) {
    setOpenMethod((cur) => (cur === method ? null : method))
    setError(null)
  }

  function submit(e: React.FormEvent, method: Method) {
    e.preventDefault()
    if (!city.trim() || !name.trim()) {
      setError(t('express.fillRequired'))
      return
    }
    if (!/^\+380\d{9}$/.test(phone.trim())) {
      setError(t('express.phoneInvalid'))
      return
    }
    setError(null)
    startTransition(async () => {
      const res = await createExpressOrder({
        productId,
        quantity: 1,
        deliveryMethod: method,
        city: city.trim(),
        branch: branch.trim() || undefined,
        name: name.trim(),
        phone: phone.trim(),
      })
      if (res.success) setOrderNumber(res.orderNumber)
      else setError(res.error)
    })
  }

  if (orderNumber) {
    return (
      <div className="flex items-center gap-2 text-[12px] font-semibold text-success py-1">
        <Check className="size-4 shrink-0" strokeWidth={2.5} />
        <span>{t('express.success', { number: orderNumber })}</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-1.5">
      {carriers.map((c) => (
        <div key={c.method}>
          <button
            type="button"
            onClick={() => toggle(c.method)}
            className="w-full flex items-center gap-2.5 cursor-pointer group py-0.5"
          >
            <Mark mark={c.mark} />
            <span className="flex-1 text-left text-[12px] font-semibold text-text-primary group-hover:text-accent transition-colors">
              {t(c.nameKey)}
            </span>
            <span className={`text-[11px] whitespace-nowrap ${c.free ? 'text-success font-semibold' : 'text-text-muted'}`}>
              {t(c.timeKey)}
            </span>
            <ChevronDown
              className={`size-3.5 text-text-muted transition-transform ${openMethod === c.method ? 'rotate-180' : ''}`}
            />
          </button>

          {openMethod === c.method && (
            <form onSubmit={(e) => submit(e, c.method)} className="flex flex-col gap-2 mt-2 mb-1.5">
              <input value={city} onChange={(e) => setCity(e.target.value)} placeholder={t('express.city')} className={inputCls} />
              {c.method !== 'pickup' && (
                <input value={branch} onChange={(e) => setBranch(e.target.value)} placeholder={t('express.branch')} className={inputCls} />
              )}
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder={t('express.name')} className={inputCls} />
              <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+380XXXXXXXXX" inputMode="tel" className={inputCls} />
              {error && <p className="text-[11px] text-error">{error}</p>}
              <button
                type="submit"
                disabled={isPending}
                className="h-9 rounded-md bg-accent text-white text-[12px] font-bold cursor-pointer hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isPending ? '…' : t('express.cta')}
              </button>
            </form>
          )}
        </div>
      ))}

      {/* Detailed Delivery Terms & Buyer Guarantees */}
      <div className="mt-3 pt-3 border-t border-border flex flex-col gap-2">
        {/* Free Shipping Badge */}
        <div className="flex items-center gap-2 text-[12px] font-extrabold text-success bg-success-subtle/40 px-2.5 py-1.5 rounded-lg border border-success/20">
          <Truck className="size-4 text-success shrink-0" strokeWidth={2.5} />
          <span>
            {isRu
              ? 'Бесплатная доставка при заказе от 1 500 грн'
              : 'Безкоштовна доставка при замовленні від 1 500 грн'}
          </span>
        </div>

        {/* Detailed Inspection & Guarantee Info Box */}
        <div className="flex flex-col gap-2 text-[11px] text-text-primary bg-surface-alt/70 p-2.5 rounded-xl border border-border">
          {/* Inspection before payment */}
          <div className="flex items-start gap-2">
            <span className="shrink-0 size-2 rounded-full bg-accent mt-1.5" />
            <div className="flex flex-col leading-snug">
              <span className="font-bold text-text-primary">
                {isRu ? 'Осмотр перед покупкой & Право отказа:' : 'Огляд перед покупкою & Право відмови:'}
              </span>
              <span className="text-text-muted mt-0.5">
                {isRu
                  ? 'Вы принимаете решение о покупке только после личного осмотра и проверки качества товара при получении. Есть полное право отказаться на месте без каких-либо обязательств.'
                  : 'Ви приймаєте рішення про покупку тільки після особистого огляду та перевірки якості товару при отриманні. Є повне право відмовитися на місці без будь-яких зобовʼязань.'}
              </span>
            </div>
          </div>

          {/* Electronic Receipt (ПРРО) & Warranty Date */}
          <div className="flex items-start gap-2 pt-2 border-t border-border/60">
            <span className="shrink-0 size-2 rounded-full bg-accent mt-1.5" />
            <div className="flex flex-col leading-snug">
              <span className="font-bold text-text-primary">
                {isRu ? 'Электронный чек (ПРРО) & Гарантия:' : 'Електронний чек (ПРРО) & Гарантія:'}
              </span>
              <span className="text-text-muted mt-0.5">
                {isRu
                  ? 'Программный фискальный чек автоматически отправляется в Viber, Telegram или на E-mail сразу после забора посылки. Дата чека активирует и подтверждает официальный гарантийный период.'
                  : 'Програмний фіскальний чек автоматично надсилається у Viber, Telegram або на E-mail одразу після отримання посилки. Дата чека активує та підтверджує офіційний гарантійний термін.'}
              </span>
            </div>
          </div>

          {/* 14-day return & Nova Poshta Easy Return */}
          <div className="flex items-start gap-2 pt-2 border-t border-border/60">
            <span className="shrink-0 size-2 rounded-full bg-success mt-1.5" />
            <div className="flex flex-col leading-snug">
              <span className="font-bold text-text-primary">
                {isRu ? '14 дней гарантированный возврат & «Легкий возврат»:' : '14 днів гарантоване повернення & «Легке повернення»:'}
              </span>
              <span className="text-text-muted mt-0.5">
                {isRu
                  ? 'Гарантированный возврат денег или обмен в течение 14 дней. Бесплатный удобный сервис «Легкий возврат» в приложении Новой Почты.'
                  : 'Гарантоване повернення коштів або обмін протягом 14 днів. Безкоштовний зручний сервіс «Легке повернення» у додатку Нової Пошти.'}
              </span>
            </div>
          </div>

          {/* Warranty obligations */}
          <div className="flex items-start gap-2 pt-2 border-t border-border/60">
            <span className="shrink-0 size-2 rounded-full bg-accent mt-1.5" />
            <div className="flex flex-col leading-snug">
              <span className="font-bold text-text-primary">
                {isRu ? 'Официальная гарантия соблюдается:' : 'Офіційна гарантія дотримується:'}
              </span>
              <span className="text-text-muted mt-0.5">
                {isRu
                  ? 'Все гарантийные обязательства производителя строго выполняются с предоставлением полного сервисного сопровождения.'
                  : 'Усі гарантійні зобовʼязання виробника суворо виконуються з наданням повного сервісного супроводу.'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
