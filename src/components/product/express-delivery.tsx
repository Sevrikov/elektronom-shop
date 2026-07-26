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

      {/* Delivery terms badge & free shipping threshold */}
      <div className="mt-2.5 pt-2.5 border-t border-border flex flex-col gap-1">
        <div className="flex items-center gap-1.5 text-[11.5px] font-extrabold text-success bg-success-subtle/30 px-2 py-1 rounded-md">
          <Truck className="size-3.5 text-success shrink-0" strokeWidth={2.5} />
          <span>
            {isRu
              ? 'Бесплатная доставка от 1 500 грн'
              : 'Безкоштовна доставка від 1 500 грн'}
          </span>
        </div>
        <p className="text-[10.5px] text-text-muted leading-tight px-0.5">
          {isRu
            ? 'Отправка в день заказа при оформлении до 15:00. Наложенный платёж или онлайн-оплата.'
            : 'Відправка в день замовлення при оформленні до 15:00. Післяплата або онлайн-оплата.'}
        </p>
      </div>
    </div>
  )
}
