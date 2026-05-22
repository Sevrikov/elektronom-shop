'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import {
  Heart, User, Phone,
  LayoutGrid, ChevronDown, Tag, Zap, Menu,
} from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { contactInfo, contactPhones } from '@/lib/constants'
import type { Locale } from '@/types'
import { CartButton } from '@/components/cart/cart-button'
import { SearchBox } from '@/components/search/search-box'

export default function Header() {
  const locale = useLocale() as Locale
  const t = useTranslations('header')
  const router = useRouter()
  const pathname = usePathname()

  const otherLocale: Locale = locale === 'uk' ? 'ru' : 'uk'

  function switchLocale(newLocale: Locale): string {
    const segments = pathname.split('/')
    if (segments.length > 1) {
      segments[1] = newLocale
    }
    return segments.join('/')
  }

  function lp(path: string): never {
    return `/${locale}${path}` as never
  }

  const navItems = [
    { key: 'electric', href: '/catalog/elektrika' },
    { key: 'tools', href: '/catalog/instrumenty' },
    { key: 'lighting', href: '/catalog/osvitlennya-led' },
    { key: 'cable', href: '/catalog/kabel-ta-provid' },
    { key: 'sockets', href: '/catalog/rozetky-ta-vymykachi' },
    { key: 'automation', href: '/catalog/avtomatyka' },
    { key: 'smartHome', href: '/catalog/rozumnyy-dim' },
  ] as const

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* ═══ Topbar ═══ */}
      <div
        className="border-b"
        style={{ background: 'var(--color-surface-alt)', borderColor: 'var(--color-border)' }}
      >
        <div
          className="h-9 mx-auto max-w-[1280px] px-4 lg:px-6 flex items-center justify-between text-xs"
          style={{ color: 'var(--color-text-muted)' }}
        >
          <div className="hidden sm:flex items-center gap-4">
            <a
              href={`tel:${contactPhones[0]?.replace(/[\s()-]/g, '')}`}
              className="inline-flex items-center gap-1.5 font-medium hover:opacity-80 transition-opacity"
              style={{ color: 'var(--color-text-primary)' }}
              aria-label={t('callUs')}
            >
              <Phone className="size-3.5" />
              {contactPhones[0]}
            </a>
            <span style={{ color: 'var(--color-border-strong)' }}>|</span>
            <span>{contactPhones[1]}</span>
            <span style={{ color: 'var(--color-border-strong)' }}>|</span>
            <span>{contactInfo.email}</span>
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <button
              onClick={() => router.push(switchLocale(otherLocale) as never)}
              className="inline-flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity"
              aria-label={t('language')}
            >
              <span className="font-bold" style={{ color: 'var(--color-text-primary)' }}>
                {locale.toUpperCase()}
              </span>
              {' | '}
              {otherLocale.toUpperCase()}
            </button>
            <span style={{ color: 'var(--color-border-strong)' }}>•</span>
            <span>{t('currency')}</span>
            <span style={{ color: 'var(--color-border-strong)' }}>•</span>
            <a href={lp('/login')} className="inline-flex items-center gap-1.5 hover:opacity-80 transition-opacity" style={{ color: 'var(--color-text-primary)' }}>
              <User className="size-3.5" />
              {t('login')}
            </a>
          </div>
        </div>
      </div>

      {/* ═══ Header Row 1: Logo + Search + Icons ═══ */}
      <div
        className="border-b"
        style={{ background: '#fff', borderColor: 'var(--color-border)' }}
      >
        <div className="h-[72px] mx-auto max-w-[1280px] px-4 lg:px-6 flex items-center gap-6">
          {/* Logo */}
          <Link href={lp('/')} className="flex items-center gap-2 shrink-0 group" id="header-logo">
            <div
              className="flex items-center justify-center size-6 rounded"
              style={{ background: 'var(--color-accent)' }}
            >
              <Zap className="size-3.5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-[22px] font-bold tracking-tight whitespace-nowrap" style={{ color: 'var(--color-text-primary)', fontFamily: "'Inter', sans-serif" }}>
              ЕЛЕКТРОНОМ<span style={{ color: 'var(--color-accent)' }}>.</span>
            </span>
          </Link>

          {/* Search */}
          <div className="hidden md:flex flex-1 items-center justify-center">
            <SearchBox />
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-2">
            <button
              className="size-10 rounded-md inline-flex items-center justify-center cursor-pointer transition-colors hover:bg-[var(--color-surface-alt)]"
              aria-label="Wishlist"
            >
              <Heart className="size-5" strokeWidth={1.5} style={{ color: 'var(--color-text-primary)' }} />
            </button>
            <button
              className="size-10 rounded-md inline-flex items-center justify-center cursor-pointer transition-colors hover:bg-[var(--color-surface-alt)]"
              aria-label="Account"
            >
              <User className="size-5" strokeWidth={1.5} style={{ color: 'var(--color-text-primary)' }} />
            </button>
            <CartButton label={t('cart')} />
            {/* Mobile menu toggle */}
            <button
              className="lg:hidden size-10 rounded-md inline-flex items-center justify-center cursor-pointer transition-colors hover:bg-[var(--color-surface-alt)]"
              aria-label={t('menu')}
            >
              <Menu className="size-5" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>

      {/* ═══ Header Row 2: Catalog button + Nav ═══ */}
      <div
        className="border-b"
        style={{ background: '#fff', borderColor: 'var(--color-border)' }}
      >
        <nav
          className="hidden lg:flex h-12 mx-auto max-w-[1280px] px-4 lg:px-6 items-center gap-6"
        >
          <Link
            href={lp('/catalog')}
            id="nav-catalog"
            className="inline-flex items-center gap-2 h-8 px-3.5 rounded-md text-[13px] font-semibold text-white transition-colors"
            style={{ background: 'var(--color-accent)' }}
          >
            <LayoutGrid className="size-3.5" strokeWidth={2} />
            {t('catalog')}
            <ChevronDown className="size-3.5" strokeWidth={2} />
          </Link>

          <div className="flex items-center gap-5 flex-1">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={lp(item.href)}
                className="text-sm font-medium py-2 transition-colors hover:text-[var(--color-accent)]"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {t(`nav.${item.key}`)}
              </Link>
            ))}
            <Link
              href={lp('/promotions')}
              className="ml-auto inline-flex items-center gap-1.5 text-sm font-semibold transition-colors"
              style={{ color: 'var(--color-accent)' }}
            >
              <Tag className="size-3.5" strokeWidth={1.5} />
              {t('nav.specials')}
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
}
