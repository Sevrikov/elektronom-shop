import type { Metadata } from 'next'
import { getUserOrders } from '@/actions/order'
import { auth } from '@/lib/auth'
import { notFound } from 'next/navigation'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const uk = locale !== 'ru'
  return {
    title: `${uk ? 'Мої замовлення' : 'Мои заказы'} | Electronom`,
  }
}

export default async function OrdersPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const uk = locale !== 'ru'
  const session = await auth()
  if (!session?.user) notFound()

  const response = await getUserOrders()
  const orders = response.success ? response.orders : []

  return (
    <div>
      <h2 className="text-xl font-bold text-text-primary mb-6">
        {uk ? 'Історія замовлень' : 'История заказов'}
      </h2>

      {orders.length === 0 ? (
        <div className="text-center py-12 text-text-muted text-sm">
          {uk ? 'У вас ще немає замовлень' : 'У вас еще нет заказов'}
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {orders.map((order) => {
            const dateStr = new Date(order.createdAt).toLocaleDateString(
              locale === 'uk' ? 'uk-UA' : 'ru-RU',
              { day: 'numeric', month: 'long', year: 'numeric' }
            )

            return (
              <div
                key={order.id}
                className="border border-border rounded-xl overflow-hidden shadow-sm"
              >
                {/* Header */}
                <div className="bg-surface-alt px-5 py-4 border-b border-border flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-text-primary">
                      {uk ? 'Замовлення' : 'Заказ'} <span className="num font-bold text-accent">{order.number}</span>
                    </p>
                    <p className="text-xs text-text-muted mt-0.5">{dateStr}</p>
                  </div>
                  <div className="flex gap-2">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                        order.status === 'DELIVERED'
                          ? 'bg-success/10 text-success border-success/20'
                          : order.status === 'CANCELLED'
                          ? 'bg-destructive/10 text-destructive border-destructive/20'
                          : 'bg-accent-subtle text-accent border-accent/20'
                      }`}
                    >
                      {order.status}
                    </span>
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                        order.paymentStatus === 'PAID'
                          ? 'bg-success/10 text-success border-success/20'
                          : 'bg-surface-raised text-text-muted border-border'
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="p-5 flex flex-col gap-4">
                  {(order.items || []).map((item) => {
                    const snap = item.snapshot as { name: string; sku: string; price: number }
                    return (
                      <div key={item.id} className="flex justify-between items-start gap-4 text-sm">
                        <div className="min-w-0">
                          <p className="font-semibold text-text-primary truncate">{snap?.name ?? 'Товар'}</p>
                          <p className="text-xs text-text-muted mt-0.5">SKU: {snap?.sku ?? ''}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-bold text-text-primary num">
                            {Number(snap?.price || 0).toLocaleString(locale === 'uk' ? 'uk-UA' : 'ru-RU')} ₴
                          </p>
                          <p className="text-xs text-text-muted mt-0.5">
                            {item.quantity} {uk ? 'шт' : 'шт'}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Total */}
                <div className="bg-surface-alt/40 px-5 py-3 border-t border-border flex justify-between items-center text-sm font-semibold text-text-primary">
                  <span>{uk ? 'Сума до сплати:' : 'Сумма к оплате:'}</span>
                  <span className="text-base font-bold text-accent num">
                    {Number(order.total).toLocaleString(locale === 'uk' ? 'uk-UA' : 'ru-RU')} ₴
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
