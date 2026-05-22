import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { isValidLocale } from '@/i18n/request'
import { Users, ShoppingCart, Package, RefreshCw, ArrowRight } from 'lucide-react'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const uk = locale !== 'ru'
  return {
    title: `${uk ? 'Панель адміністратора' : 'Панель администратора'} | ЕЛЕКТРОНОМ`,
    robots: { index: false, follow: false },
  }
}

export default async function AdminDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isValidLocale(locale)) notFound()

  const uk = locale !== 'ru'

  try {
    await requireAdmin()
  } catch {
    redirect(`/${locale}/login?callbackUrl=/${locale}/admin` as never)
  }

  // Fetch quick dashboard stats from database
  const [totalOrders, totalUsers, totalProducts, recentOrders] = await Promise.all([
    prisma.order.count(),
    prisma.user.count(),
    prisma.product.count(),
    prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        number: true,
        total: true,
        status: true,
        customerData: true,
        createdAt: true,
      },
    }),
  ])

  return (
    <div className="min-h-[calc(100vh-200px)] bg-surface-alt py-8">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-20">
        
        {/* Title */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">
              {uk ? 'Панель адміністратора' : 'Панель администратора'}
            </h1>
            <p className="text-xs text-text-muted mt-1">
              {uk ? 'Огляд роботи інтернет-магазину' : 'Обзор работы интернет-магазина'}
            </p>
          </div>
          <button className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-white border border-border rounded-lg text-text-primary hover:bg-surface-alt transition-colors">
            <RefreshCw className="size-3.5" />
            {uk ? 'Оновити дані' : 'Обновить данные'}
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Orders Stat */}
          <div className="bg-white border border-border rounded-2xl p-6 shadow-sm flex items-center gap-5">
            <div className="size-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
              <ShoppingCart className="size-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-text-muted uppercase tracking-wider">
                {uk ? 'Всього замовлень' : 'Всего заказов'}
              </p>
              <h3 className="text-2xl font-bold text-text-primary num mt-0.5">{totalOrders}</h3>
            </div>
          </div>

          {/* Users Stat */}
          <div className="bg-white border border-border rounded-2xl p-6 shadow-sm flex items-center gap-5">
            <div className="size-12 rounded-xl bg-success/10 text-success flex items-center justify-center">
              <Users className="size-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-text-muted uppercase tracking-wider">
                {uk ? 'Користувачі' : 'Пользователи'}
              </p>
              <h3 className="text-2xl font-bold text-text-primary num mt-0.5">{totalUsers}</h3>
            </div>
          </div>

          {/* Products Stat */}
          <div className="bg-white border border-border rounded-2xl p-6 shadow-sm flex items-center gap-5">
            <div className="size-12 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
              <Package className="size-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-text-muted uppercase tracking-wider">
                {uk ? 'Товари' : 'Товары'}
              </p>
              <h3 className="text-2xl font-bold text-text-primary num mt-0.5">{totalProducts}</h3>
            </div>
          </div>
        </div>

        {/* Recent Orders Section */}
        <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-5 border-b border-border flex justify-between items-center">
            <h2 className="text-lg font-bold text-text-primary">
              {uk ? 'Останні замовлення' : 'Последние заказы'}
            </h2>
            <button className="text-xs font-semibold text-accent hover:underline inline-flex items-center gap-1">
              {uk ? 'Усі замовлення' : 'Все заказы'}
              <ArrowRight className="size-3.5" />
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-alt border-b border-border text-[11px] font-bold text-text-muted uppercase tracking-wider">
                  <th className="px-6 py-3">{uk ? 'Номер' : 'Номер'}</th>
                  <th className="px-6 py-3">{uk ? 'Клієнт' : 'Клиент'}</th>
                  <th className="px-6 py-3">{uk ? 'Статус' : 'Статус'}</th>
                  <th className="px-6 py-3">{uk ? 'Дата' : 'Дата'}</th>
                  <th className="px-6 py-3 text-right">{uk ? 'Сума' : 'Сумма'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm text-text-primary">
                {recentOrders.map((order) => {
                  const cust = order.customerData as { firstName?: string; lastName?: string } | null
                  const name = cust ? `${cust.firstName ?? ''} ${cust.lastName ?? ''}`.trim() : 'Гість'
                  const dateStr = new Date(order.createdAt).toLocaleDateString(
                    locale === 'uk' ? 'uk-UA' : 'ru-RU',
                    { day: 'numeric', month: 'short' }
                  )

                  return (
                    <tr key={order.id} className="hover:bg-surface-alt/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-accent num">{order.number}</td>
                      <td className="px-6 py-4">{name}</td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-accent-subtle text-accent border border-accent/15">
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-text-muted">{dateStr}</td>
                      <td className="px-6 py-4 text-right font-bold num">
                        {Number(order.total).toLocaleString(locale === 'uk' ? 'uk-UA' : 'ru-RU')} ₴
                      </td>
                    </tr>
                  )
                })}
                {recentOrders.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-text-muted">
                      {uk ? 'Замовлень немає' : 'Заказов нет'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  )
}
