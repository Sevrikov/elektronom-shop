import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { getCart } from '@/actions/cart'
import { CheckoutForm } from './checkout-form'
import Breadcrumbs from '@/components/layout/breadcrumbs'
import { isValidLocale } from '@/i18n/request'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const uk = locale !== 'ru'
  return {
    title: `${uk ? 'Оформлення замовлення' : 'Оформление заказа'} | ЕЛЕКТРОНОМ`,
    robots: { index: false, follow: true },
  }
}

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isValidLocale(locale)) notFound()

  const uk = locale !== 'ru'
  const cartItems = await getCart(locale)

  if (cartItems.length === 0) {
    redirect(`/${locale}/cart`)
  }

  const breadcrumbs = [
    { name: uk ? 'Головна' : 'Главная', url: '/' },
    { name: uk ? 'Кошик' : 'Корзина', url: '/cart' },
    { name: uk ? 'Оформлення замовлення' : 'Оформление заказа' },
  ]

  return (
    <div className="min-h-[calc(100vh-200px)] bg-surface-alt py-6 lg:py-8">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-20">
        <Breadcrumbs items={breadcrumbs} locale={locale} />
        
        <h1 className="text-2xl font-bold text-text-primary mb-6">
          {uk ? 'Оформлення замовлення' : 'Оформление заказа'}
        </h1>

        <CheckoutForm items={cartItems} locale={locale} />
      </div>
    </div>
  )
}
