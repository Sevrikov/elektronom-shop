'use client'

import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { LayoutGrid, Search, ShoppingCart, User } from 'lucide-react'
import type { Locale } from '@/types'

export default function MobileNav() {
  const locale = useLocale() as Locale
  const t = useTranslations('mobile')
  const lp = (path: string) => `/${locale}${path}`

  const tabs = [
    { label: t('catalog'), icon: LayoutGrid, href: '/catalog' },
    { label: t('search'), icon: Search, href: '/search' },
    { label: t('cart'), icon: ShoppingCart, href: '/cart', badge: 3 },
    { label: t('account'), icon: User, href: '/account' },
  ] as const

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t"
      style={{
        background: '#fff',
        borderColor: 'var(--color-border)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div className="flex h-14">
        {tabs.map((tab) => (
          <Link
            key={tab.label}
            href={lp(tab.href)}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <div className="relative">
              <tab.icon className="size-5" strokeWidth={1.5} />
              {'badge' in tab && tab.badge !== undefined && tab.badge > 0 && (
                <span
                  className="absolute -top-1.5 -right-2 flex items-center justify-center size-4 rounded-full text-[10px] font-bold text-white leading-none"
                  style={{ background: 'var(--color-accent)' }}
                >
                  {tab.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] font-medium">{tab.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}
