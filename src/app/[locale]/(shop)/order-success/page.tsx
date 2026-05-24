import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { cookies } from 'next/headers'
import { CheckCircle2, Package, ArrowRight, ShoppingBag } from 'lucide-react'
import { isValidLocale } from '@/i18n/request'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

interface PageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ order?: string }>
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const uk = locale !== 'ru'
  return {
    title: `${uk ? 'Замовлення прийнято' : 'Заказ принят'} | ЕЛЕКТРОНОМ`,
    robots: { index: false, follow: false },
  }
}

export default async function OrderSuccessPage({ params, searchParams }: PageProps) {
  const { locale } = await params
  const { order: orderNumber } = await searchParams

  if (!isValidLocale(locale)) notFound()
  if (!orderNumber) notFound()

  const order = await prisma.order.findUnique({
    where: { number: orderNumber },
    select: { number: true, total: true, status: true, createdAt: true, userId: true },
  })

  if (!order) notFound()

  // Access validation: must be order owner or have the last_created_order cookie
  const session = await auth()
  const cookieStore = await cookies()
  const lastCreatedOrder = cookieStore.get('last_created_order')?.value

  const isOwner = !!(order.userId && session?.user?.id === order.userId)
  const isRecentCreator = lastCreatedOrder === order.number

  if (!isOwner && !isRecentCreator) {
    notFound()
  }

  const uk = locale !== 'ru'

  const formatDate = (d: Date) =>
    new Date(d).toLocaleDateString(locale === 'uk' ? 'uk-UA' : 'ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

  return (
    <div className="min-h-[calc(100vh-200px)] bg-surface-alt flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-lg">
        {/* Success Card */}
        <div className="bg-white border border-border rounded-2xl p-8 shadow-sm text-center">
          {/* Animated Icon */}
          <div className="flex justify-center mb-6">
            <div className="size-20 rounded-full bg-success/10 flex items-center justify-center animate-pulse">
              <CheckCircle2 className="size-10 text-success" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-text-primary mb-2">
            {uk ? 'Дякуємо за замовлення!' : 'Спасибо за заказ!'}
          </h1>

          {order ? (
            <>
              <p className="text-text-muted text-sm mb-6">
                {uk
                  ? `Ваше замовлення `
                  : `Ваш заказ `}
                <span className="font-bold text-accent num">{order.number}</span>
                {uk
                  ? ` успішно оформлено. Ми зв'яжемося з вами найближчим часом для підтвердження.`
                  : ` успешно оформлен. Мы свяжемся с вами в ближайшее время для подтверждения.`}
              </p>

              {/* Order Info */}
              <div className="bg-surface-alt rounded-xl p-4 mb-6 text-left flex flex-col gap-3">
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted font-medium">
                    {uk ? 'Номер замовлення' : 'Номер заказа'}
                  </span>
                  <span className="font-bold text-accent num">{order.number}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted font-medium">
                    {uk ? 'Сума замовлення' : 'Сумма заказа'}
                  </span>
                  <span className="font-bold text-text-primary num">
                    {Number(order.total).toLocaleString(locale === 'uk' ? 'uk-UA' : 'ru-RU')} ₴
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted font-medium">
                    {uk ? 'Дата' : 'Дата'}
                  </span>
                  <span className="text-text-primary">{formatDate(order.createdAt)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted font-medium">
                    {uk ? 'Статус' : 'Статус'}
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-accent-subtle text-accent border border-accent/15">
                    {uk ? 'Обробляється' : 'Обрабатывается'}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <p className="text-text-muted text-sm mb-6">
              {uk
                ? "Ваше замовлення успішно оформлено. Ми зв'яжемося з вами найближчим часом для підтвердження."
                : 'Ваш заказ успешно оформлен. Мы свяжемся с вами в ближайшее время для подтверждения.'}
            </p>
          )}

          {/* Info Block */}
          <div className="flex items-start gap-3 bg-accent/5 border border-accent/15 rounded-xl p-4 mb-8 text-left">
            <Package className="size-5 text-accent shrink-0 mt-0.5" />
            <p className="text-sm text-text-primary">
              {uk
                ? 'Наш менеджер зателефонує вам протягом 1-2 годин у робочий час (Пн-Пт 9:00–18:00) для підтвердження та уточнення деталей доставки.'
                : 'Наш менеджер позвонит вам в течение 1-2 часов в рабочее время (Пн-Пт 9:00–18:00) для подтверждения и уточнения деталей доставки.'}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href={`/${locale}/orders` as never}
              className="flex-1 inline-flex items-center justify-center gap-2 h-11 px-5 bg-accent text-white font-semibold rounded-xl hover:bg-accent-hover transition-colors text-sm"
            >
              <ShoppingBag className="size-4" />
              {uk ? 'Мої замовлення' : 'Мои заказы'}
            </Link>
            <Link
              href={`/${locale}/catalog` as never}
              className="flex-1 inline-flex items-center justify-center gap-2 h-11 px-5 bg-white border border-border text-text-primary font-semibold rounded-xl hover:bg-surface-alt transition-colors text-sm"
            >
              {uk ? 'Продовжити покупки' : 'Продолжить покупки'}
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
