'use client'

import { useState, useTransition } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Store, ChevronDown, Check, Truck } from 'lucide-react'
import { createExpressOrder } from '@/actions/express-order'

type Method = 'nova_poshta' | 'ukrposhta' | 'rozetka' | 'pickup'

interface CarrierItem {
  method: Method
  mark: 'np' | 'up' | 'rozetka' | 'store'
  labelRu: string
  labelUk: string
  timeRu: string
  timeUk: string
  free?: boolean
}

const carriers: CarrierItem[] = [
  {
    method: 'nova_poshta',
    mark: 'np',
    labelRu: 'Новая Почта',
    labelUk: 'Нова Пошта',
    timeRu: '1-3 дня',
    timeUk: '1-3 дні',
  },
  {
    method: 'ukrposhta',
    mark: 'up',
    labelRu: 'Укрпочта',
    labelUk: 'Укрпошта',
    timeRu: '3-5 дней',
    timeUk: '3-5 днів',
  },
  {
    method: 'rozetka',
    mark: 'rozetka',
    labelRu: 'Точки выдачи Rozetka',
    labelUk: 'Точки видачі Rozetka',
    timeRu: '2-4 дня',
    timeUk: '2-4 дні',
  },
  {
    method: 'pickup',
    mark: 'store',
    labelRu: 'Самовывоз',
    labelUk: 'Самовивіз',
    timeRu: 'бесплатно',
    timeUk: 'безкоштовно',
    free: true,
  },
]

function Mark({ mark }: { mark: 'np' | 'up' | 'rozetka' | 'store' }) {
  if (mark === 'np') {
    return (
      <div className="shrink-0 w-12 h-6.5 rounded-md bg-[#da291c] flex items-center justify-center border border-[#b81d12] shadow-2xs">
        {/* Nova Poshta Official Box & Arrow Brand Symbol */}
        <svg viewBox="0 0 40 40" className="w-7 h-5 text-white fill-current">
          <path d="M20 4L7 11.5v17L20 36l13-7.5v-17L20 4zm0 4.2l8.8 5.1-3.8 2.2-5-2.9-5 2.9-3.8-2.2L20 8.2zm-9 6.8l3.6 2.1v7.9l-3.6-2.1V15zm10.8 10l-4.8 2.8v-7.9l4.8-2.8v7.9zm.6-10l3.6-2.1v7.9l-3.6 2.1V15z" />
        </svg>
      </div>
    )
  }

  if (mark === 'up') {
    return (
      <div className="shrink-0 w-12 h-6.5 rounded-md bg-[#ffc200] flex items-center justify-center border border-[#e0ab00] shadow-2xs">
        {/* Ukrposhta Official Postal Horn Logo Symbol */}
        <svg viewBox="0 0 32 32" className="w-6 h-5 text-[#002b66] fill-current">
          <path d="M12 8c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 12c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4zm14-10h-3v4h3c1.1 0 2 .9 2 2s-.9 2-2 2h-3v4h3c3.3 0 6-2.7 6-6s-2.7-6-6-6z" />
          <circle cx="12" cy="16" r="2" />
        </svg>
      </div>
    )
  }

  if (mark === 'rozetka') {
    return (
      <div className="shrink-0 w-12 h-6.5 rounded-md bg-[#00a046] flex items-center justify-center border border-[#008238] shadow-2xs">
        {/* Rozetka Official Green Smile Logo */}
        <svg viewBox="0 0 36 36" className="w-5 h-5 text-white fill-current">
          <circle cx="18" cy="18" r="14" fill="none" stroke="currentColor" strokeWidth="2.8" />
          <circle cx="13" cy="14" r="2" />
          <circle cx="23" cy="14" r="2" />
          <path d="M11 20.5c2 3.8 5.5 5 7 5s5-1.2 7-5" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
        </svg>
      </div>
    )
  }

  return (
    <div className="shrink-0 w-12 h-6.5 rounded-md bg-surface-alt text-text-primary flex items-center justify-center border border-border">
      <Store className="size-3.5 text-accent" strokeWidth={2.2} />
    </div>
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
              {isRu ? c.labelRu : c.labelUk}
            </span>
            <span className={`text-[11px] whitespace-nowrap ${c.free ? 'text-success font-semibold' : 'text-text-muted'}`}>
              {isRu ? c.timeRu : c.timeUk}
            </span>
            <ChevronDown
              className={`size-3.5 text-text-muted transition-transform ${openMethod === c.method ? 'rotate-180' : ''}`}
            />
          </button>

          {openMethod === c.method && (
            <form onSubmit={(e) => submit(e, c.method)} className="flex flex-col gap-2 mt-2 mb-1.5">
              <input value={city} onChange={(e) => setCity(e.target.value)} placeholder={t('express.city')} className={inputCls} />
              {c.method !== 'pickup' && (
                <input
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  placeholder={
                    c.method === 'rozetka'
                      ? isRu
                        ? '№ или адрес точки выдачи Rozetka'
                        : '№ або адреса точки видачі Rozetka'
                      : t('express.branch')
                  }
                  className={inputCls}
                />
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
        {/* Free Shipping Badge with Separated Large 1 500 ₴ Zone */}
        <div className="flex items-center justify-between gap-2.5 text-success bg-success-subtle/40 p-2.5 rounded-xl border border-success/20">
          <div className="flex items-center gap-2.5">
            <div className="size-7 rounded-full bg-success/15 text-success flex items-center justify-center shrink-0">
              <Truck className="size-4 text-success" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col text-[12px] font-extrabold leading-tight text-success">
              <span>{isRu ? 'Бесплатная доставка' : 'Безкоштовна доставка'}</span>
              <span className="text-[10.5px] text-text-muted font-semibold">
                {isRu ? 'при заказе от' : 'при замовленні від'}
              </span>
            </div>
          </div>

          {/* Separated right zone with large number */}
          <div className="shrink-0 pl-3 border-l border-success/25 flex flex-col items-end justify-center">
            <span className="text-[17px] font-black text-success tracking-tight leading-none num">
              1 500 ₴
            </span>
          </div>
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
