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

            {/* Search */}
            <div className="hidden md:flex flex-1 items-center justify-center">
              <SearchBox />
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
