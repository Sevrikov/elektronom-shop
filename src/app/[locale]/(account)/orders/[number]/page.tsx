import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { auth } from '@/lib/auth'
import { getOrderByNumber } from '@/queries/orders'
import Breadcrumbs from '@/components/layout/breadcrumbs'
import { ArrowLeft, Package } from 'lucide-react'

interface PageProps {
  params: Promise<{ locale: string; number: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, number } = await params
  const uk = locale !== 'ru'
  return {
    title: `${uk ? 'Замовлення' : 'Заказ'} ${number} | ЕЛЕКТРОНОМ`,
    robots: { index: false, follow: false },
  }
}

export default async function OrderDetailPage({ params }: PageProps) {
  const { locale, number } = await params
  const uk = locale !== 'ru'

  const session = await auth()
  if (!session?.user?.id) notFound()

  const order = await getOrderByNumber(number, session.user.id)
  if (!order) notFound()

  const cust = order.customerData as {
    firstName?: string; lastName?: string; email?: string; phone?: string;
    city?: string; street?: string; building?: string; apartment?: string | null
  } | null

  const statusColors: Record<string, string> = {
    PENDING: 'bg-accent-subtle text-accent border-accent/15',
    CONFIRMED: 'bg-success/10 text-success border-success/20',
    PROCESSING: 'bg-accent-subtle text-accent border-accent/15',
    SHIPPED: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    DELIVERED: 'bg-success/10 text-success border-success/20',
    CANCELLED: 'bg-destructive/10 text-destructive border-destructive/20',
    REFUNDED: 'bg-surface-raised text-text-muted border-border',
  }

  const paymentStatusColors: Record<string, string> = {
    PENDING: 'bg-surface-raised text-text-muted border-border',
    PAID: 'bg-success/10 text-success border-success/20',
    FAILED: 'bg-destructive/10 text-destructive border-destructive/20',
    REFUNDED: 'bg-surface-raised text-text-muted border-border',
  }

  const formatDate = (d: Date) =>
    new Date(d).toLocaleDateString(locale === 'uk' ? 'uk-UA' : 'ru-RU', {
      day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
    })

  const breadcrumbs = [
    { name: uk ? 'Головна' : 'Главная', url: '/' },
    { name: uk ? 'Мої замовлення' : 'Мои заказы', url: '/orders' },
    { name: `${uk ? 'Замовлення' : 'Заказ'} ${order.number}` },
  ]

  return (
    <div>
      <Breadcrumbs items={breadcrumbs} locale={locale} />
      <div className="mt-4 mb-6 flex items-center gap-4">
        <Link
          href={`/${locale}/orders` as never}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-text-muted hover:text-accent transition-colors"
        >
          <ArrowLeft className="size-4" />
          {uk ? 'Назад до замовлень' : 'Назад к заказам'}
        </Link>
      </div>

      <h2 className="text-xl font-bold text-text-primary mb-6">
        {uk ? 'Замовлення' : 'Заказ'}{' '}
        <span className="text-accent num">{order.number}</span>
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* Left: Items */}
        <div className="flex flex-col gap-6">
          {/* Status Bar */}
          <div className="flex flex-wrap gap-3">
            <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${statusColors[order.status] ?? ''}`}>
              {order.status}
            </span>
            <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${paymentStatusColors[order.paymentStatus] ?? ''}`}>
              {order.paymentStatus}
            </span>
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full border border-border bg-surface-alt text-text-muted">
              {order.paymentMethod.replace('_', ' ')}
            </span>
          </div>

          {/* Order Items */}
          <div className="border border-border rounded-xl overflow-hidden shadow-sm">
            <div className="bg-surface-alt px-5 py-3 border-b border-border">
              <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                <Package className="size-4 text-text-muted" />
                {uk ? 'Товари у замовленні' : 'Товары в заказе'}
              </h3>
            </div>
            <div className="divide-y divide-border">
              {order.items.map((item) => {
                const snap = item.snapshot as { name?: string; sku?: string; image?: string | null; price?: number }
                return (
                  <div key={item.id} className="flex gap-4 p-4 items-center">
                    {/* Image */}
                    <div className="size-14 rounded-lg border border-border bg-surface-alt overflow-hidden shrink-0">
                      {(snap.image ?? item.product?.images?.[0]?.url) ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={snap.image ?? item.product?.images?.[0]?.url ?? ''}
                          alt={snap.name ?? ''}
                          className="size-full object-cover"
                        />
                      ) : (
                        <div className="size-full flex items-center justify-center text-text-muted text-xs">
                          —
                        </div>
                      )}
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-text-primary truncate">
                        {item.product?.slug ? (
                          <Link href={`/${locale}/product/${item.product.slug}` as never} className="hover:text-accent transition-colors">
                            {snap.name ?? 'Товар'}
                          </Link>
                        ) : (snap.name ?? 'Товар')}
                      </p>
                      <p className="text-xs text-text-muted mt-0.5">SKU: {snap.sku ?? '—'}</p>
                    </div>
                    {/* Qty & Price */}
                    <div className="text-right shrink-0">
                      <p className="font-bold text-sm text-text-primary num">
                        {Number(item.price).toLocaleString(locale === 'uk' ? 'uk-UA' : 'ru-RU')} ₴
                      </p>
                      <p className="text-xs text-text-muted mt-0.5">
                        {item.quantity} {uk ? 'шт.' : 'шт.'}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Delivery Info */}
          {cust && (
            <div className="border border-border rounded-xl overflow-hidden shadow-sm">
              <div className="bg-surface-alt px-5 py-3 border-b border-border">
                <h3 className="text-sm font-bold text-text-primary">
                  {uk ? 'Дані доставки' : 'Данные доставки'}
                </h3>
              </div>
              <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-0.5">
                    {uk ? "Одержувач" : "Получатель"}
                  </p>
                  <p className="font-semibold text-text-primary">
                    {`${cust.firstName ?? ''} ${cust.lastName ?? ''}`.trim()}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-0.5">
                    {uk ? "Телефон" : "Телефон"}
                  </p>
                  <p className="font-semibold text-text-primary">{cust.phone ?? '—'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-0.5">Email</p>
                  <p className="font-semibold text-text-primary">{cust.email ?? '—'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-0.5">
                    {uk ? "Адреса" : "Адрес"}
                  </p>
                  <p className="font-semibold text-text-primary">
                    {[cust.city, cust.street, cust.building, cust.apartment].filter(Boolean).join(', ')}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Totals */}
        <div className="flex flex-col gap-4">
          <div className="border border-border rounded-xl overflow-hidden shadow-sm">
            <div className="bg-surface-alt px-5 py-3 border-b border-border">
              <h3 className="text-sm font-bold text-text-primary">
                {uk ? 'Підсумок' : 'Итого'}
              </h3>
            </div>
            <div className="p-5 flex flex-col gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-text-muted">{uk ? 'Товари' : 'Товары'}</span>
                <span className="font-semibold num">
                  {Number(order.subtotal).toLocaleString(locale === 'uk' ? 'uk-UA' : 'ru-RU')} ₴
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">{uk ? 'Доставка' : 'Доставка'}</span>
                <span className="font-semibold num">
                  {Number(order.shipping) === 0
                    ? (uk ? 'Безкоштовно' : 'Бесплатно')
                    : `${Number(order.shipping).toLocaleString(locale === 'uk' ? 'uk-UA' : 'ru-RU')} ₴`}
                </span>
              </div>
              {Number(order.discount) > 0 && (
                <div className="flex justify-between text-success">
                  <span>{uk ? 'Знижка' : 'Скидка'}</span>
                  <span className="font-semibold num">
                    −{Number(order.discount).toLocaleString(locale === 'uk' ? 'uk-UA' : 'ru-RU')} ₴
                  </span>
                </div>
              )}
              <div className="border-t border-border my-1" />
              <div className="flex justify-between text-base font-bold text-text-primary">
                <span>{uk ? 'Всього' : 'Итого'}</span>
                <span className="text-accent num">
                  {Number(order.total).toLocaleString(locale === 'uk' ? 'uk-UA' : 'ru-RU')} ₴
                </span>
              </div>
            </div>
          </div>

          {/* Date */}
          <div className="border border-border rounded-xl p-4 text-sm text-center text-text-muted">
            <p className="text-[10px] font-bold uppercase tracking-wider mb-1">
              {uk ? 'Дата замовлення' : 'Дата заказа'}
            </p>
            <p className="font-semibold text-text-primary">{formatDate(order.createdAt)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
