'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import {
  Heart, User, Phone,
  LayoutGrid, ChevronDown, Tag, Menu,
} from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { contactInfo, contactPhones } from '@/lib/constants'
import type { Locale } from '@/types'
import { CartButton } from '@/components/cart/cart-button'
import { SearchBox } from '@/components/search/search-box'
import type { CategoryTreeNode } from '@/queries/categories'

interface Props {
  categories: CategoryTreeNode[]
  workload?: number
}

export default function Header({ categories, workload = 0 }: Props) {
  const locale = useLocale() as Locale
  const t = useTranslations('header')
  const router = useRouter()
  const pathname = usePathname()
  const headerRef = useRef<HTMLElement>(null)

  const [prevPathname, setPrevPathname] = useState(pathname)

  // Expose header height as CSS variable so the menu can position itself
  useEffect(() => {
    const update = () => {
      const h = headerRef.current?.getBoundingClientRect().height ?? 220
      document.documentElement.style.setProperty('--header-height', `${h}px`)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

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
    <>
      <header ref={headerRef} className="sticky top-0 z-50 w-full">
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
              <span className="font-medium hover:text-text-primary transition-colors cursor-pointer">{contactInfo.email}</span>
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
          <div className="h-[100px] mx-auto max-w-[1280px] px-4 lg:px-6 flex items-center gap-6">
            {/* Logo */}
            <Link
              href={lp('/')}
              className="flex items-center shrink-0 group"
              id="header-logo"
              aria-label={locale === 'uk' ? 'Electronom — головна' : 'Electronom — главная'}
            >
              {/* Desktop Full Logo */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo/electronom.svg"
                alt="Electronom"
                className="hidden sm:block h-[96px] w-auto select-none"
              />
              {/* Mobile Mark Logo */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo/electronom-mark.svg"
                alt="Electronom"
                className="block sm:hidden h-20 w-auto select-none"
              />
            </Link>

            {/* Contact info (moved from topbar) */}
            <div className="hidden xl:flex flex-col items-start gap-1 mt-1 shrink-0">
              <div className="flex items-center gap-3">
                <a href={`tel:${contactPhones[0]?.replace(/[\s()-]/g, '')}`} className="text-2xl font-black tracking-tight text-text-primary hover:text-accent transition-colors">
                  {contactPhones[0]}
                </a>
                <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider ml-1">{locale === 'uk' ? 'Напишіть нам:' : 'Напишите нам:'}</span>
                <div className="flex items-center gap-2">
                  <a href="viber://chat?number=%2B380672206791" aria-label="Viber" className="hover:opacity-80 transition-opacity flex items-center justify-center size-8">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#7360F2">
                      <path d="M21.246 16.923c-.144-4.148-3.385-7.51-7.515-7.822-.423-.03-.845-.054-1.267-.054-5.405 0-9.782 4.377-9.782 9.782 0 1.354.282 2.654.78 3.835a1.137 1.137 0 00.347.52l1.484 1.137c.314.238.411.66.205.996-.866 1.452-1.321 3.109-1.321 4.842 0 .26.205.466.466.466h5.708c4.993 0 9.14-3.791 9.715-8.677.032-.314.054-.64.054-.953 0-.628-.022-1.256-.086-1.885-.01-.14.065-.281.184-.346l1.787-1.04a1.126 1.126 0 00.444-1.538l-.91-1.581c-.162-.293-.086-.672.163-.878l1.711-1.42c.39-.314.379-.92-.021-1.213l-2.146-1.765zM12 24c-1.386 0-2.73-.325-3.92-.91-.141-.065-.303-.087-.444-.054l-3.5.1.03c-.4.12-.758-.217-.66-.607l.93-3.672c.032-.14.022-.292-.043-.422-.541-1.029-.844-2.188-.844-3.412 0-4.225 3.433-7.658 7.658-7.658 4.225 0 7.658 3.433 7.658 7.658 0 4.225-3.433 7.658-7.658 7.658zM9.757 20.02c-1.7-.455-3.162-1.516-4.105-3.022-.336-.52-.217-1.213.26-1.636l.866-.758c.39-.336.964-.303 1.321.065l1.484 1.57c.281.293.292.758.021 1.072l-.39.455c-.238.27-.205.693.065.942.628.574 1.354 1.04 2.155 1.365.314.12.66.043.878-.206l.422-.487c.292-.336.801-.379 1.148-.12l1.646 1.246c.401.303.466.877.151 1.278l-.715.932c-.368.476-1.018.682-1.592.498z"/>
                    </svg>
                  </a>
                  <a href="tg://resolve?domain=elektronom" aria-label="Telegram" className="hover:opacity-80 transition-opacity flex items-center justify-center size-8">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#24A1DE">
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                    </svg>
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[12px] font-medium mt-0.5">
                <span className="text-green-600 font-bold">{contactInfo.workingHours[locale]}</span>
                <span className="text-border-strong">•</span>
                <div className="flex items-center gap-1.5 text-green-600 bg-green-500/10 px-2 py-0.5 rounded-full">
                  <span className="relative flex size-[6px]">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full size-[6px] bg-green-500"></span>
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest leading-none mt-0.5">{locale === 'uk' ? 'онлайн' : 'онлайн'}</span>
                </div>
                
                {/* Workload Scale */}
                <div className="relative h-[18px] w-[160px] bg-surface-alt rounded-full overflow-hidden border border-border ml-3 flex items-center shadow-inner" title={`${t('workload', { fallback: 'Завантаженість' })}: ${workload}%`}>
                  {/* Fill Container (clips the fixed-width gradient) */}
                  <div 
                    className="absolute left-0 top-0 bottom-0 overflow-hidden"
                    style={{ width: `${workload}%`, transition: 'width 1s ease-out' }}
                  >
                    {/* Fixed-width gradient so colors don't squash */}
                    <div 
                      className="absolute left-0 top-0 bottom-0 w-[160px]"
                      style={{ background: 'linear-gradient(90deg, #3b82f6 0%, #10b981 35%, #eab308 70%, #ef4444 100%)' }}
                    />
                  </div>
                  {/* Text on top */}
                  <span 
                    className="relative z-10 w-full text-center text-[9px] font-bold uppercase tracking-widest text-white px-2"
                    style={{ textShadow: '0px 1px 2px rgba(0,0,0,0.8)' }}
                  >
                    {locale === 'uk' ? 'Завантаженість' : 'Загруженность'}: {workload}%
                  </span>
                </div>
              </div>
            </div>

            {/* Search */}
            <div className="hidden md:flex flex-1 max-w-[480px] ml-auto mr-4 justify-end">
              <div className="w-full">
                <SearchBox />
              </div>
            </div>

            {/* Right icons */}
            <div className="flex items-center gap-2">
              <Link
                href={lp('/wishlist')}
                className="size-10 rounded-md inline-flex items-center justify-center cursor-pointer transition-colors hover:bg-[var(--color-surface-alt)]"
                aria-label="Wishlist"
              >
                <Heart className="size-5" strokeWidth={1.5} style={{ color: 'var(--color-text-primary)' }} />
              </Link>
              <Link
                href={lp('/profile')}
                className="size-10 rounded-md inline-flex items-center justify-center cursor-pointer transition-colors hover:bg-[var(--color-surface-alt)]"
                aria-label="Account"
              >
                <User className="size-5" strokeWidth={1.5} style={{ color: 'var(--color-text-primary)' }} />
              </Link>
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
            {/* Catalog toggle button -> Now a Link */}
            <Link
              id="nav-catalog"
              href={lp('/catalog')}
              className="inline-flex items-center gap-2 h-8 px-3.5 rounded-md text-[13px] font-semibold text-white transition-colors cursor-pointer bg-accent hover:bg-[#4F8EF7]"
            >
              <LayoutGrid className="size-3.5" strokeWidth={2} />
              {t('catalog')}
            </Link>

            <div className="flex items-center gap-5 flex-1">
              {navItems.map((item) => (
                <Link
                  key={item.key}
                  href={lp(item.href)}
                  className="text-sm font-medium py-2 transition-colors hover:text-[#4F8EF7]"
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
    </>
  )
}
