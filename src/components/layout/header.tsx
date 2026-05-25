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
import { CatalogMegaMenuClient } from '@/components/layout/catalog-mega-menu-client'

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

  const [menuOpen, setMenuOpen] = useState(false)

  const otherLocale: Locale = locale === 'uk' ? 'ru' : 'uk'

  const closeMenu = useCallback(() => setMenuOpen(false), [])
  const toggleMenu = useCallback(() => setMenuOpen((v) => !v), [])

  const [prevPathname, setPrevPathname] = useState(pathname)

  // Close menu on route change during render
  if (prevPathname !== pathname) {
    setPrevPathname(pathname)
    setMenuOpen(false)
  }

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
                <div className="flex items-center gap-1.5">
                  <a href="viber://chat?number=%2B380672206791" aria-label="Viber" className="hover:opacity-80 transition-opacity flex items-center justify-center size-7 rounded-full shadow-sm" style={{ background: '#7360F2' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 512 512">
                      <path fill="#FFF" d="M380.5 240.2c-1.1-39.7-32.5-72-72-75.1-4-.3-8.2-.5-12.2-.5-51.8 0-93.8 42-93.8 93.8 0 13 2.7 25.4 7.5 36.8a10.8 10.8 0 0 0 3.3 5l14.2 10.9c3 2.3 4 6.3 2 9.5-8.3 14-12.7 30-12.7 46.5 0 2.5 2 4.5 4.5 4.5h54.7c47.8 0 87.7-36.4 93.1-83.3.3-3 .5-6.1.5-9.1 0-6-.2-12-.8-18.1-.1-1.3.6-2.7 1.8-3.3l17.1-10a10.8 10.8 0 0 0 4.3-14.8l-8.7-15.2c-1.5-2.8-.8-6.4 1.5-8.4l16.4-13.6c3.8-3.1 3.7-8.9-.2-11.7l-20.5-16.9zm-136.5 73.5c-13.3 0-26.2-3.1-37.6-8.7-1.3-.6-2.9-.8-4.2-.5l-33.5 9.8c-3.8 1.1-7.2-2.1-6.3-5.8l8.9-35.2c.3-1.3.2-2.8-.4-4-5.2-9.9-8.1-21-8.1-32.8 0-40.5 32.9-73.4 73.4-73.4s73.4 32.9 73.4 73.4-32.9 73.4-73.4 73.4zm-21.5-38.1c-16.3-4.4-30.3-14.5-39.3-29-.3-5-.2-11.6 2.5-15.6l8.3-7.2c3.7-3.2 9.2-2.9 12.6.6l14.2 15a10.5 10.5 0 0 1 .2 10.3l-3.8 4.4c-2.3 2.6-2 6.7.6 9 6 5.5 13 10 20.6 13.1 3 1.1 6.3.4 8.4-2l4-4.7c2.8-3.2 7.7-3.6 11-.1l15.8 11.9c3.8 2.9 4.4 8.4 1.4 12.2l-6.8 8.9c-3.5 4.5-9.7 6.5-15.2 4.7z"/>
                    </svg>
                  </a>
                  <a href="tg://resolve?domain=elektronom" aria-label="Telegram" className="hover:opacity-80 transition-opacity flex items-center justify-center size-7 rounded-full shadow-sm" style={{ background: '#24A1DE' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 240 240">
                      <path fill="#FFF" d="M53.6 116.6l125.8-48.4c5.8-2.2 11.2 1.4 9.1 10.3l-21.3 100.4c-1.8 8.1-6.6 10.2-13.4 6.3l-37-27.2-17.8 17.2c-2 2-3.6 3.6-7.4 3.6l2.6-38 69.1-62.4c3-2.7-.7-4.2-4.6-1.6l-85.4 53.7-36.8-11.5c-8-2.5-8.2-8 1.7-11.9z"/>
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
              {/* Mobile menu toggle — opens mega menu on mobile too */}
              <button
                className="lg:hidden size-10 rounded-md inline-flex items-center justify-center cursor-pointer transition-colors hover:bg-[var(--color-surface-alt)]"
                aria-label={t('menu')}
                aria-expanded={menuOpen}
                aria-controls="catalog-mega-menu"
                onClick={toggleMenu}
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
            {/* Catalog toggle button */}
            <button
              id="nav-catalog"
              type="button"
              onClick={toggleMenu}
              aria-expanded={menuOpen}
              aria-controls="catalog-mega-menu"
              className={[
                'inline-flex items-center gap-2 h-8 px-3.5 rounded-md text-[13px] font-semibold text-white transition-colors cursor-pointer',
                menuOpen ? 'bg-accent-hover' : 'bg-accent hover:bg-accent-hover',
              ].join(' ')}
            >
              <LayoutGrid className="size-3.5" strokeWidth={2} />
              {t('catalog')}
              <ChevronDown
                className={['size-3.5 transition-transform duration-200', menuOpen ? 'rotate-180' : ''].join(' ')}
                strokeWidth={2}
              />
            </button>

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

      {/* Mega menu rendered outside <header> to avoid stacking context issues */}
      <CatalogMegaMenuClient
        categories={categories}
        isOpen={menuOpen}
        onClose={closeMenu}
      />
    </>
  )
}
