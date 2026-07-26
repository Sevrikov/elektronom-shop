'use client'

import { useState, useTransition } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Store, ChevronDown, Check, Truck, ShieldCheck, FileCheck, RotateCcw } from 'lucide-react'
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
        {/* Nova Poshta Official Box Logo (White Hex Box with Red Arrows) */}
        <svg viewBox="0 0 40 40" className="w-6 h-6 text-white fill-current">
          <path d="M20 4L7 11.5v17L20 36l13-7.5v-17L20 4zm0 4.5l9 5.2-3.8 2.2-5.2-3-5.2 3-3.8-2.2 9-5.2zm-9.2 7l3.8 2.2v8.2l-3.8-2.2v-8.2zm11.2 10.4l-5 2.9v-8.2l5-2.9v8.2zm.8-10.4l3.8-2.2v8.2l-3.8 2.2v-8.2z" />
        </svg>
      </div>
    )
  }

  if (mark === 'up') {
    return (
      <div className="shrink-0 w-12 h-6.5 rounded-md bg-[#ffc200] flex items-center justify-center border border-[#e0ab00] shadow-2xs">
        {/* Ukrposhta Official Logo (Dark Blue Horn + Horn Circle) */}
        <svg viewBox="0 0 44 28" className="w-7 h-5 text-[#002b66] fill-current">
          <path d="M12 4c-5.5 0-10 4.5-10 10s4.5 10 10 10 10-4.5 10-10S17.5 4 12 4zm0 15c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5zm16-13h-4v4h4c1.7 0 3 1.3 3 3s-1.3 3-3 3h-4v4h4c3.9 0 7-3.1 7-7s-3.1-7-7-7z" />
          <circle cx="12" cy="14" r="2.5" />
        </svg>
      </div>
    )
  }

  if (mark === 'rozetka') {
    return (
      <div className="shrink-0 w-12 h-6.5 rounded-md bg-[#00a046] flex items-center justify-center border border-[#008238] shadow-2xs">
        {/* Rozetka Official Smiling Monster Face Logo */}
        <svg viewBox="0 0 36 36" className="w-5.5 h-5.5 text-white fill-current">
          <circle cx="18" cy="18" r="14" fill="none" stroke="currentColor" strokeWidth="3" />
          <circle cx="13" cy="14" r="2.2" />
          <circle cx="23" cy="14" r="2.2" />
          <path d="M10.5 20c2 4 5.5 5.5 7.5 5.5s5.5-1.5 7.5-5.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
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

      {/* Merged High-Trust Cards ("Плашки") with Pictograms on Left */}
      <div className="mt-3 pt-3 border-t border-border flex flex-col gap-2.5">
        {/* Card 1: Free Shipping Threshold */}
        <div className="flex items-start gap-3 p-3 rounded-xl bg-success-subtle/40 border border-success/30">
          <div className="size-8 rounded-lg bg-success text-white flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
            <Truck className="size-4 text-white" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col flex-1 leading-tight">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[12.5px] font-black text-success">
                {isRu ? 'Бесплатная доставка' : 'Безкоштовна доставка'}
              </span>
              <span className="text-[13px] font-black text-success num bg-white/70 px-1.5 py-0.5 rounded border border-success/20">
                1 500 ₴
              </span>
            </div>
            <p className="text-[11px] text-text-muted mt-1 leading-snug">
              {isRu
                ? 'Отправка Новой Почтой, Укрпочтой или в точки выдачи Rozetka за наш счёт при заказе от 1 500 грн.'
                : 'Відправка Новою Поштою, Укрпоштою або в точки видачі Rozetka нашим коштом при замовленні від 1 500 грн.'}
            </p>
          </div>
        </div>

        {/* Card 2: Inspection & Right to refuse */}
        <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-alt/80 border border-border">
          <div className="size-8 rounded-lg bg-accent/15 text-accent flex items-center justify-center shrink-0 border border-accent/20 mt-0.5">
            <ShieldCheck className="size-4.5 text-accent" strokeWidth={2.2} />
          </div>
          <div className="flex flex-col flex-1 leading-tight">
            <span className="text-[12px] font-bold text-text-primary">
              {isRu ? 'Осмотр при получении & Право отказа' : 'Огляд при отриманні & Право відмови'}
            </span>
            <p className="text-[11px] text-text-muted mt-1 leading-snug">
              {isRu
                ? 'Вы принимаете решение о покупке после личного осмотра товара на почте. Есть полное право отказаться на месте без обязательств.'
                : 'Ви приймаєте рішення про покупку після особистого огляду товару на пошті. Є повне право відмовитися на місці без зобовʼязань.'}
            </p>
          </div>
        </div>

        {/* Card 3: Fiscal receipt (ПРРО) & Warranty */}
        <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-alt/80 border border-border">
          <div className="size-8 rounded-lg bg-accent/15 text-accent flex items-center justify-center shrink-0 border border-accent/20 mt-0.5">
            <FileCheck className="size-4.5 text-accent" strokeWidth={2.2} />
          </div>
          <div className="flex flex-col flex-1 leading-tight">
            <span className="text-[12px] font-bold text-text-primary">
              {isRu ? 'Электронный чек (ПРРО) & Гарантия' : 'Електронний чек (ПРРО) & Гарантія'}
            </span>
            <p className="text-[11px] text-text-muted mt-1 leading-snug">
              {isRu
                ? 'Фискальный чек автоматически отправляется в Viber, Telegram или E-mail после получения. Дата чека фиксирует официальную гарантию.'
                : 'Фіскальний чек автоматично надсилається у Viber, Telegram або E-mail після отримання. Дата чека фіксує офіційну гарантію.'}
            </p>
          </div>
        </div>

        {/* Card 4: 14-day Return & Easy Return */}
        <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-alt/80 border border-border">
          <div className="size-8 rounded-lg bg-success/15 text-success flex items-center justify-center shrink-0 border border-success/20 mt-0.5">
            <RotateCcw className="size-4.5 text-success" strokeWidth={2.2} />
          </div>
          <div className="flex flex-col flex-1 leading-tight">
            <span className="text-[12px] font-bold text-text-primary">
              {isRu ? '14 дней Возврат & «Легкий возврат»' : '14 днів Повернення & «Легке повернення»'}
            </span>
            <p className="text-[11px] text-text-muted mt-1 leading-snug">
              {isRu
                ? 'Гарантированный возврат денег или обмен в течение 14 дней. Бесплатный сервис «Легкий возврат» в приложении Новой Почты.'
                : 'Гарантоване повернення коштів або обмін протягом 14 днів. Безкоштовний сервіс «Легке повернення» у додатку Нової Пошти.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
