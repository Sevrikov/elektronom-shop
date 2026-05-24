'use client'

import { useTransition, useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Sparkles } from 'lucide-react'
import type { CartItem } from '@/actions/cart'
import { createOrder } from '@/actions/order'

interface CheckoutFormProps {
  items: CartItem[]
  locale: string
}

export function CheckoutForm({ items, locale }: CheckoutFormProps) {
  const router = useRouter()
  const uk = locale !== 'ru'
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const idempotencyKeyRef = useRef('')

  useEffect(() => {
    idempotencyKeyRef.current = crypto.randomUUID()
  }, [])

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    street: '',
    building: '',
    apartment: '',
    paymentMethod: 'CASH_ON_DELIVERY' as 'CARD_ONLINE' | 'CASH_ON_DELIVERY' | 'MONOBANK_PARTS' | 'PRIVAT_PARTS',
    notes: '',
  })

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handlePaymentSelect = (method: typeof formData.paymentMethod) => {
    setFormData((prev) => ({
      ...prev,
      paymentMethod: method,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Basic Validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.city || !formData.street || !formData.building) {
      setError(uk ? 'Будь ласка, заповніть всі обов\'язкові поля' : 'Пожалуйста, заполните все обязательные поля')
      return
    }

    startTransition(async () => {
      const response = await createOrder({ ...formData, idempotencyKey: idempotencyKeyRef.current }, locale)
      if (response.success && response.orderNumber) {
        router.push(`/${locale}/order-success?order=${response.orderNumber}` as never)
      } else {
        setError(response.error || (uk ? 'Помилка при створенні замовлення' : 'Ошибка при создании заказа'))
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 items-start">
      {/* Left Column: Form Fields */}
      <div className="flex flex-col gap-6 bg-white p-6 rounded-2xl border border-border">
        {error && (
          <div className="p-3.5 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg text-sm font-medium">
            {error}
          </div>
        )}

        {/* Section 1: Customer Info */}
        <div>
          <h3 className="text-lg font-bold text-text-primary mb-4 pb-2 border-b border-border">
            1. {uk ? 'Контактні дані' : 'Контактные данные'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">
                {uk ? 'Ім\'я *' : 'Имя *'}
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full h-11 px-3.5 rounded-lg border border-border-strong bg-white focus:border-accent outline-none text-sm text-text-primary transition-colors"
                placeholder={uk ? 'Іван' : 'Иван'}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">
                {uk ? 'Прізвище *' : 'Фамилия *'}
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full h-11 px-3.5 rounded-lg border border-border-strong bg-white focus:border-accent outline-none text-sm text-text-primary transition-colors"
                placeholder={uk ? 'Петренко' : 'Петренко'}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full h-11 px-3.5 rounded-lg border border-border-strong bg-white focus:border-accent outline-none text-sm text-text-primary transition-colors"
                placeholder="example@mail.com"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">
                {uk ? 'Телефон *' : 'Телефон *'}
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full h-11 px-3.5 rounded-lg border border-border-strong bg-white focus:border-accent outline-none text-sm text-text-primary transition-colors"
                placeholder="+380991234567"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Address Info */}
        <div>
          <h3 className="text-lg font-bold text-text-primary mb-4 pb-2 border-b border-border">
            2. {uk ? 'Адреса доставки' : 'Адрес доставки'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">
                {uk ? 'Місто / Населений пункт *' : 'Город / Населенный пункт *'}
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full h-11 px-3.5 rounded-lg border border-border-strong bg-white focus:border-accent outline-none text-sm text-text-primary transition-colors"
                placeholder={uk ? 'Київ' : 'Киев'}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">
                {uk ? 'Вулиця *' : 'Улица *'}
              </label>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleChange}
                className="w-full h-11 px-3.5 rounded-lg border border-border-strong bg-white focus:border-accent outline-none text-sm text-text-primary transition-colors"
                placeholder={uk ? 'вул. Хрещатик' : 'ул. Крещатик'}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">
                {uk ? 'Будинок *' : 'Дом *'}
              </label>
              <input
                type="text"
                name="building"
                value={formData.building}
                onChange={handleChange}
                className="w-full h-11 px-3.5 rounded-lg border border-border-strong bg-white focus:border-accent outline-none text-sm text-text-primary transition-colors"
                placeholder="24"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">
                {uk ? 'Квартира' : 'Квартира'}
              </label>
              <input
                type="text"
                name="apartment"
                value={formData.apartment}
                onChange={handleChange}
                className="w-full h-11 px-3.5 rounded-lg border border-border-strong bg-white focus:border-accent outline-none text-sm text-text-primary transition-colors"
                placeholder="42"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Payment Method */}
        <div>
          <h3 className="text-lg font-bold text-text-primary mb-4 pb-2 border-b border-border">
            3. {uk ? 'Спосіб оплати' : 'Способ оплаты'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { id: 'CASH_ON_DELIVERY', labelUk: 'Оплата при отриманні', labelRu: 'Оплата при получении' },
              { id: 'CARD_ONLINE', labelUk: 'Карткою онлайн', labelRu: 'Картой онлайн' },
              { id: 'MONOBANK_PARTS', labelUk: 'Покупка частинами Monobank', labelRu: 'Покупка частями Monobank' },
              { id: 'PRIVAT_PARTS', labelUk: 'Оплата частинами ПриватБанк', labelRu: 'Оплата частями ПриватБанк' },
            ].map((method) => (
              <button
                type="button"
                key={method.id}
                onClick={() => handlePaymentSelect(method.id as 'CARD_ONLINE' | 'CASH_ON_DELIVERY' | 'MONOBANK_PARTS' | 'PRIVAT_PARTS')}
                className={`flex items-center justify-between p-4 rounded-xl border text-left cursor-pointer transition-all ${
                  formData.paymentMethod === method.id
                    ? 'border-accent bg-accent-subtle/40 text-accent font-semibold'
                    : 'border-border bg-white text-text-primary hover:border-border-strong'
                }`}
              >
                <span className="text-sm">{uk ? method.labelUk : method.labelRu}</span>
                {formData.paymentMethod === method.id && (
                  <div className="size-2.5 rounded-full bg-accent" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Section 4: Notes */}
        <div>
          <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">
            {uk ? 'Коментар до замовлення' : 'Комментарий к заказу'}
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            className="w-full p-3.5 rounded-lg border border-border-strong bg-white focus:border-accent outline-none text-sm text-text-primary transition-colors resize-none"
            placeholder={uk ? 'Наприклад: під\'їзд 2, домофон 15...' : 'Например: подъезд 2, домофон 15...'}
          />
        </div>
      </div>

      {/* Right Column: Order Summary */}
      <div className="flex flex-col gap-6 bg-white p-6 rounded-2xl border border-border sticky top-[140px]">
        <h3 className="text-lg font-bold text-text-primary border-b border-border pb-3">
          {uk ? 'Ваше замовлення' : 'Ваш заказ'}
        </h3>
        
        <div className="flex flex-col gap-4 max-h-[220px] overflow-y-auto pr-1">
          {items.map((item) => (
            <div key={item.productId} className="flex gap-3 text-sm">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-text-primary truncate">{item.name}</p>
                <p className="text-xs text-text-muted">
                  {item.quantity} × {item.price.toLocaleString(locale === 'uk' ? 'uk-UA' : 'ru-RU')} ₴
                </p>
              </div>
              <span className="font-bold text-text-primary num shrink-0">
                {(item.price * item.quantity).toLocaleString(locale === 'uk' ? 'uk-UA' : 'ru-RU')} ₴
              </span>
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-4 flex flex-col gap-2.5">
          <div className="flex items-center justify-between text-sm text-text-muted">
            <span>{uk ? 'Сума' : 'Сумма'}</span>
            <span className="num font-semibold">{subtotal.toLocaleString(locale === 'uk' ? 'uk-UA' : 'ru-RU')} ₴</span>
          </div>
          <div className="flex items-center justify-between text-sm text-text-muted">
            <span>{uk ? 'Доставка' : 'Доставка'}</span>
            <span>{uk ? 'Безкоштовно' : 'Бесплатно'}</span>
          </div>
          
          <div className="border-t border-border my-2" />
          
          <div className="flex items-center justify-between text-base font-bold text-text-primary">
            <span>{uk ? 'Всього' : 'Всего'}</span>
            <span className="text-xl text-accent num">
              {subtotal.toLocaleString(locale === 'uk' ? 'uk-UA' : 'ru-RU')} ₴
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full h-12 rounded-xl text-white font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors bg-accent hover:bg-accent-hover disabled:bg-surface-raised disabled:text-text-muted disabled:cursor-not-allowed mt-2"
        >
          {isPending ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            <>
              {uk ? 'Підтвердити замовлення' : 'Подтвердить заказ'}
              <Sparkles className="size-4" />
            </>
          )}
        </button>
      </div>
    </form>
  )
}
