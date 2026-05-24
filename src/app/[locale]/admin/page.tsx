import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { isValidLocale } from '@/i18n/request'
import AdminPanelClient from './admin-panel-client'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const uk = locale !== 'ru'
  return {
    title: `${uk ? 'Панель адміністратора' : 'Панель администратора'} | Electronom`,
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

  try {
    await requireAdmin()
  } catch {
    redirect(`/${locale}/login?callbackUrl=/${locale}/admin` as never)
  }

  // Fetch quick dashboard stats & metadata from database (Select only, no direct queries without limit)
  const [totalOrders, totalUsers, totalProducts, recentOrders, categories, brands] = await Promise.all([
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
        paymentStatus: true,
        paymentMethod: true,
        customerData: true,
        notes: true,
        createdAt: true,
        items: {
          select: {
            id: true,
            quantity: true,
            price: true,
            snapshot: true,
          },
        },
      },
    }),
    prisma.category.findMany({
      orderBy: { sortOrder: 'asc' },
      take: 100,
      select: {
        id: true,
        slug: true,
        parentId: true,
        isActive: true,
        sortOrder: true,
        translations: {
          select: { locale: true, name: true, description: true },
        },
      },
    }),
    prisma.brand.findMany({
      orderBy: { name: 'asc' },
      take: 100,
      select: {
        id: true,
        slug: true,
        name: true,
        logo: true,
        isActive: true,
      },
    }),
  ])

  const initialStats = {
    totalOrders,
    totalUsers,
    totalProducts,
  }

  // Parse decimal values to number to comply with prisma/serialize rules
  const parsedRecentOrders = recentOrders.map((order) => ({
    ...order,
    total: Number(order.total),
    items: order.items.map((item) => ({
      ...item,
      price: Number(item.price),
    })),
  }))

  return (
    <AdminPanelClient
      initialStats={initialStats}
      initialRecentOrders={parsedRecentOrders}
      initialCategories={categories}
      initialBrands={brands}
      locale={locale}
    />
  )
}
