import { redirect } from 'next/navigation'
import Link from 'next/link'
import { auth } from '@/lib/auth'
import { isValidLocale } from '@/i18n/request'
import Breadcrumbs from '@/components/layout/breadcrumbs'
import { Heart, ShoppingBag, User } from 'lucide-react'
import { SignOutButton } from './signout-button'

export default async function AccountLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isValidLocale(locale)) redirect('/uk')

  const session = await auth()
  if (!session?.user) {
    redirect(`/${locale}/login?callbackUrl=/${locale}/orders` as never)
  }

  const uk = locale !== 'ru'

  const breadcrumbs = [
    { name: uk ? 'Головна' : 'Главная', url: `/${locale}` },
    { name: uk ? 'Особистий кабінет' : 'Личный кабинет' },
  ]

  return (
    <div className="min-h-[calc(100vh-200px)] bg-surface-alt py-6 lg:py-8">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-20">
        <Breadcrumbs items={breadcrumbs} locale={locale} />

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 mt-4 items-start">
          {/* Navigation Sidebar */}
          <aside className="bg-white border border-border rounded-2xl p-4 flex flex-col gap-1.5 shadow-sm">
            <Link
              href={`/${locale}/orders` as never}
              className="flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl text-text-primary hover:bg-surface-alt transition-colors"
            >
              <ShoppingBag className="size-4 text-text-muted" />
              {uk ? 'Мої замовлення' : 'Мои заказы'}
            </Link>
            <Link
              href={`/${locale}/profile` as never}
              className="flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl text-text-primary hover:bg-surface-alt transition-colors"
            >
              <User className="size-4 text-text-muted" />
              {uk ? 'Профіль' : 'Профиль'}
            </Link>
            <Link
              href={`/${locale}/wishlist` as never}
              className="flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl text-text-primary hover:bg-surface-alt transition-colors"
            >
              <Heart className="size-4 text-text-muted" />
              {uk ? 'Обране' : 'Избранное'}
            </Link>
            <div className="border-t border-border my-2" />
            <SignOutButton locale={locale} />
          </aside>

          {/* Page Content */}
          <main className="bg-white border border-border rounded-2xl p-6 lg:p-8 shadow-sm">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
