'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import {
  Search, ShoppingCart, Heart, User, Phone,
  LayoutGrid, ChevronDown, Tag, Zap, Menu,
} from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { contactInfo, contactPhones } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import type { Locale } from '@/types'

export default function Header() {
  const locale = useLocale() as Locale
  const t = useTranslations('header')
  const router = useRouter()
  const pathname = usePathname()
  const [activeSearchPill, setActiveSearchPill] = useState<'name' | 'sku' | 'mpn'>('name')

  const otherLocale: Locale = locale === 'uk' ? 'ru' : 'uk'

  function switchLocale(newLocale: Locale): string {
    const segments = pathname.split('/')
    if (segments.length > 1) {
      segments[1] = newLocale
    }
    return segments.join('/')
  }

  function lp(path: string): string {
    return `/${locale}${path}`
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
        className="h-9 border-b flex items-center justify-between px-4 lg:px-20 text-xs"
        style={{ background: 'var(--color-surface-alt)', borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}
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
            onClick={() => router.push(switchLocale(otherLocale))}
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

      {/* ═══ Header Row 1: Logo + Search + Icons ═══ */}
      <div
        className="h-[72px] border-b flex items-center px-4 lg:px-20 gap-6"
        style={{ background: '#fff', borderColor: 'var(--color-border)' }}
      >
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
        <div
          className="hidden md:flex flex-1 h-12 items-center gap-3 rounded-md px-4 pr-2"
          style={{ border: '1px solid var(--color-border-strong)', background: '#fff' }}
        >
          <Search className="size-[18px] shrink-0" style={{ color: 'var(--color-text-muted)' }} strokeWidth={1.5} />
          <input
            type="search"
            id="search-input"
            placeholder={t('search')}
            className="flex-1 border-0 outline-none bg-transparent text-sm"
            style={{ color: 'var(--color-text-primary)', fontFamily: "'Inter', sans-serif" }}
          />
          <div className="flex rounded-md p-0.5 gap-0.5" style={{ background: 'var(--color-surface-alt)' }}>
            {(['name', 'sku', 'mpn'] as const).map((pill) => (
              <button
                key={pill}
                onClick={() => setActiveSearchPill(pill)}
                className={cn(
                  'px-2.5 py-1.5 text-xs font-medium rounded cursor-pointer transition-colors',
                  activeSearchPill === pill
                    ? 'font-semibold'
                    : ''
                )}
                style={{
                  background: activeSearchPill === pill ? 'var(--color-accent-subtle)' : 'transparent',
                  color: activeSearchPill === pill ? 'var(--color-accent)' : 'var(--color-text-muted)',
                }}
              >
                {pill === 'name' ? t('searchByName') : pill === 'sku' ? t('searchBySku') : t('searchByMpn')}
              </button>
            ))}
          </div>
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
          <Link href={lp('/cart')} id="header-cart">
            <button
              className="relative size-10 rounded-md inline-flex items-center justify-center cursor-pointer transition-colors hover:bg-[var(--color-surface-alt)]"
              aria-label={t('cart')}
            >
              <ShoppingCart className="size-5" strokeWidth={1.5} style={{ color: 'var(--color-text-primary)' }} />
              <span
                className="absolute top-1 right-1 flex items-center justify-center size-4 rounded-full text-[10px] font-bold text-white leading-none"
                style={{ background: 'var(--color-accent)' }}
              >
                3
              </span>
            </button>
          </Link>
          {/* Mobile menu toggle */}
          <button
            className="lg:hidden size-10 rounded-md inline-flex items-center justify-center cursor-pointer transition-colors hover:bg-[var(--color-surface-alt)]"
            aria-label={t('menu')}
          >
            <Menu className="size-5" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* ═══ Header Row 2: Catalog button + Nav ═══ */}
      <nav
        className="hidden lg:flex h-12 items-center px-4 lg:px-20 gap-6 border-b"
        style={{ background: '#fff', borderColor: 'var(--color-border)' }}
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
    </header>
  )
}
