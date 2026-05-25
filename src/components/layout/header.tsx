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
}

export default function Header({ categories }: Props) {
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
            <div className="hidden xl:flex flex-col items-start gap-0.5 mt-1 shrink-0">
              <div className="flex items-center gap-2">
                <a href={`tel:${contactPhones[0]?.replace(/[\s()-]/g, '')}`} className="text-xl font-bold tracking-tight text-text-primary hover:text-accent transition-colors">
                  {contactPhones[0]}
                </a>
                <a href="viber://chat?number=%2B380672206791" aria-label="Viber" className="hover:opacity-80 transition-opacity flex items-center justify-center size-6 bg-[#7360F2]/10 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#7360F2">
                    <path d="M20.5 12.33c-.15-3.83-3.13-6.93-6.94-7.22-.39-.03-.78-.05-1.17-.05-4.99 0-9.03 4.04-9.03 9.03 0 1.25.26 2.45.72 3.54a1.05 1.05 0 00.32.48l1.37 1.05c.29.22.38.61.19.92-.8 1.34-1.22 2.87-1.22 4.47 0 .24.19.43.43.43h5.27c4.61 0 8.44-3.5 8.97-8.01.03-.29.05-.59.05-.88 0-.58-.02-1.16-.08-1.74-.01-.13.06-.26.17-.32l1.65-.96a1.04 1.04 0 00.41-1.42l-.84-1.46c-.15-.27-.08-.62.15-.81l1.58-1.31c.36-.29.35-.85-.02-1.12l-1.98-1.63zM12 21.05c-1.28 0-2.52-.3-3.62-.84-.13-.06-.28-.08-.41-.05l-3.23.95c-.37.11-.7-.2-.61-.56l.86-3.39c.03-.13.02-.27-.04-.39-.5-.95-.78-2.02-.78-3.15 0-3.9 3.17-7.07 7.07-7.07 3.9 0 7.07 3.17 7.07 7.07 0 3.9-3.17 7.07-7.07 7.07zm-2.07-3.67c-1.57-.42-2.92-1.4-3.79-2.79-.31-.48-.2-1.12.24-1.51l.8-.7c.36-.31.89-.28 1.22.06l1.37 1.45c.26.27.27.7.02.99l-.36.42c-.22.25-.19.64.06.87.58.53 1.25.96 1.99 1.26.29.11.61.04.81-.19l.39-.45c.27-.31.74-.35 1.06-.11l1.52 1.15c.37.28.43.81.14 1.18l-.66.86c-.34.44-.94.63-1.47.46z"/>
                  </svg>
                </a>
                <a href="tg://resolve?domain=elektronom" aria-label="Telegram" className="hover:opacity-80 transition-opacity flex items-center justify-center size-6 bg-[#2AABEE]/10 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#2AABEE">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                  </svg>
                </a>
              </div>
              <div className="flex items-center gap-2 text-[12px] text-text-muted font-medium">
                <a href={`tel:${contactPhones[1]?.replace(/[\s()-]/g, '')}`} className="hover:text-text-primary transition-colors">
                  {contactPhones[1]}
                </a>
                <span className="text-border-strong">•</span>
                <span className="text-[11px] font-semibold text-accent uppercase tracking-wider">{t('callUs')}</span>
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
