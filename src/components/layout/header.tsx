'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'
import {
  Heart, User,
  LayoutGrid, Tag, Menu,
} from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { contactInfo, contactPhones } from '@/lib/constants'
import type { Locale } from '@/types'
import { CartButton } from '@/components/cart/cart-button'
import { SearchBox } from '@/components/search/search-box'
import { useWishlistStore } from '@/store/wishlist-store'

import { StarfieldBanner } from '@/components/layout/starfield-banner'
import { Truck, Percent, MessageCircle, Package } from 'lucide-react'
import type { CategoryTreeNode } from '@/queries/categories'

interface Props {
  categories: CategoryTreeNode[]
  workload?: number
}

export default function Header({ workload = 0 }: Props) {
  const locale = useLocale() as Locale
  const t = useTranslations('header')
  const router = useRouter()
  const pathname = usePathname()
  const isHome = pathname === `/${locale}` || pathname === `/${locale}/` || pathname === '/'
  const headerRef = useRef<HTMLElement>(null)

  const otherLocale: Locale = locale === 'uk' ? 'ru' : 'uk'

  const fetchWishlist = useWishlistStore(s => s.fetchWishlist)
  const wishlistCount = useWishlistStore(s => s.wishlistIds.length)

  useEffect(() => {
    fetchWishlist()
  }, [fetchWishlist])

  const [isDark, setIsDark] = useState(false)

  // Listen to dark mode changes
  useEffect(() => {
    const check = () => {
      setIsDark(document.documentElement.classList.contains('dark'))
    }
    check()
    const observer = new MutationObserver(check)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

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

  return (
    <>
      <header ref={headerRef} className="sticky top-0 z-50 w-full">
        {/* ═══ Animated Hyperspace Promo Banner ═══ */}
        <div className="relative w-full overflow-hidden bg-white border-b border-border select-none h-10">
          
          {/* Canvas Starfield Animation */}
          <StarfieldBanner />

          {/* Text Content: Pixel Marquee */}
          <div className="absolute inset-0 z-10 flex items-center overflow-hidden pointer-events-none">
            <div 
              className="animate-marquee flex items-center w-max" 
              style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '11px', textShadow: '1px 1px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff' }}
            >
              {[1, 2, 3].map((set) => (
                <div key={set} className="flex items-center gap-16 px-8 whitespace-nowrap text-[#24A1DE] drop-shadow-[0_1px_1px_rgba(255,255,255,1)]">
                  <div className="flex items-center gap-2">
                    <Percent className="size-5" strokeWidth={3} />
                    <span>{locale === 'uk' ? 'ЗНИЖКИ ДЛЯ ОПТУ' : 'СКИДКИ ДЛЯ ОПТА'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="size-5" strokeWidth={3} />
                    <span>{locale === 'uk' ? 'ВІД 1500 ГРН ДОСТАВКА БЕЗКОШТОВНО' : 'ОТ 1500 ГРН ДОСТАВКА БЕСПЛАТНО'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageCircle className="size-5" strokeWidth={3} />
                    <span>{locale === 'uk' ? 'ОПТОВІ ЗНИЖКИ - ДЕТАЛІ У VIBER' : 'ОПТОВЫЕ СКИДКИ - ДЕТАЛИ В VIBER'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="size-5" strokeWidth={3} />
                    <span>{locale === 'uk' ? 'ДРОПШИПІНГ: ВІДПРАВКА ТОВАРУ' : 'ДРОПШИПИНГ: ОТПРАВКА ТОВАРА'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ═══ Topbar ═══ */}
        <div
          className="border-b"
          style={{ background: 'var(--color-surface-alt)', borderColor: 'var(--color-border)' }}
        >
          <div
            className="h-9 mx-auto max-w-[1280px] px-4 lg:px-6 flex items-center justify-between text-xs"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <div className="hidden sm:flex items-center">
              <a href={`mailto:${contactInfo.email}`} className="hover:text-text-primary transition-colors font-semibold text-[11px] sm:text-xs">
                {contactInfo.email}
              </a>
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
          style={{ background: 'var(--color-surface-white)', borderColor: 'var(--color-border)' }}
        >
          <div className="h-[76px] mx-auto max-w-[1280px] px-4 lg:px-6 flex items-center gap-6">
            {/* Logo */}
            <Link
              href={lp('/')}
              className="flex items-center shrink-0 group relative overflow-hidden w-36 h-12 sm:w-[180px] sm:h-[64px] rounded-lg"
              id="header-logo"
              aria-label={locale === 'uk' ? 'Electronom — головна' : 'Electronom — главная'}
            >
              {/* Full Logo (Desktop & Mobile) */}
              {isHome ? (
                // Главная: анимированное видео, но с постером и без авто-предзагрузки
                <video
                  key={isDark ? 'dark' : 'light'}
                  src={isDark ? "/logo/electronom-dark-60fps.webm" : "/logo/electronom-light-60fps.webm"}
                  poster={isDark ? "/logo/electronom-dark.webp" : "/logo/electronom-light.webp"}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="none"
                  className="w-full h-full select-none"
                  style={{ objectFit: 'contain', objectPosition: 'left' }}
                />
              ) : (
                // Остальные страницы: лёгкая статика по теме
                <Image
                  src={isDark ? "/logo/electronom-dark.webp" : "/logo/electronom-light.webp"}
                  alt="Electronom"
                  width={isDark ? 296 : 295}
                  height={isDark ? 119 : 117}
                  priority
                  sizes="180px"
                  className="w-full h-full object-contain object-left select-none"
                />
              )}
            </Link>

            {/* Contact info (moved from topbar) */}
            <div className="hidden xl:flex flex-col items-start gap-1 mt-1 shrink-0">
              <div className="flex items-center gap-3">
                <a href={`tel:${contactPhones[0]?.replace(/[\s()-]/g, '')}`} className="text-2xl font-black tracking-tight text-text-primary hover:text-accent transition-colors">
                  {contactPhones[0]}
                </a>
                <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider ml-1">{locale === 'uk' ? 'Напишіть нам:' : 'Напишите нам:'}</span>
                <div className="flex items-center gap-2">
                  <a href="viber://chat?number=%2B380672206791" aria-label="Viber" className="hover:opacity-80 transition-opacity flex items-center justify-center size-8 relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/logo/Viber.webp" alt="Viber" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[68px] h-[68px] max-w-none object-contain" />
                    {/* Golden Crown */}
                    <span className="absolute -top-[8px] right-[0px] text-[12px] drop-shadow-md z-10" style={{ transform: 'rotate(15deg)' }}>👑</span>
                  </a>
                  <a href="tg://resolve?domain=elektronom" aria-label="Telegram" className="hover:opacity-80 transition-opacity flex items-center justify-center size-8 ml-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="#24A1DE">
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
                    className="relative z-10 w-full text-center text-[9px] font-extrabold uppercase tracking-widest text-slate-600 dark:text-white px-2"
                    style={{ textShadow: isDark ? '0px 1px 2px rgba(0,0,0,0.8)' : 'none' }}
                  >
                    {locale === 'uk' ? 'Завантаженість' : 'Загруженность'}: {workload}%
                  </span>
                </div>
              </div>
            </div>

            {/* Search */}
            <div className="hidden md:flex flex-1 max-w-[640px] ml-6 mr-4">
              <div className="w-full">
                <SearchBox />
              </div>
            </div>

            {/* Right icons */}
            <div className="flex items-center gap-2">
              <Link
                href={lp('/wishlist')}
                className="relative size-10 rounded-md inline-flex items-center justify-center cursor-pointer transition-colors hover:bg-[var(--color-surface-alt)]"
                aria-label="Wishlist"
              >
                <Heart className="size-5" strokeWidth={1.5} style={{ color: 'var(--color-text-primary)' }} />
                {wishlistCount > 0 && (
                  <span
                    className="absolute top-1 right-1 flex items-center justify-center size-4 rounded-full text-[10px] font-bold text-white leading-none bg-accent"
                  >
                    {wishlistCount}
                  </span>
                )}
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
          style={{ background: 'var(--color-surface-white)', borderColor: 'var(--color-border)' }}
        >
          <nav
            className="hidden lg:flex h-12 mx-auto max-w-[1280px] px-4 lg:px-6 items-center gap-5 justify-between"
          >
            {/* Catalog toggle button -> Now a Link */}
            <Link
              id="nav-catalog"
              href={lp('/catalog')}
              className="inline-flex items-center gap-2 h-8 px-3.5 rounded-md text-[13px] font-semibold text-white transition-colors cursor-pointer bg-accent hover:bg-[#4F8EF7] shrink-0"
            >
              <LayoutGrid className="size-3.5" strokeWidth={2} />
              {t('catalog')}
            </Link>

            {/* Middle Nav Links (Scrollable on small desktops) */}
            <div className="flex items-center gap-3.5 xl:gap-5 overflow-x-auto no-scrollbar whitespace-nowrap py-1">
              <Link href={lp('/about')} className="text-[13px] font-medium py-2 transition-colors text-text-primary hover:text-accent">
                {locale === 'uk' ? 'Про магазин' : 'О магазине'}
              </Link>
              <Link href={lp('/delivery')} className="text-[13px] font-medium py-2 transition-colors text-text-primary hover:text-accent">
                {locale === 'uk' ? 'Доставка' : 'Доставка'}
              </Link>
              <Link href={lp('/payment')} className="text-[13px] font-medium py-2 transition-colors text-text-primary hover:text-accent">
                {locale === 'uk' ? 'Оплата' : 'Оплата'}
              </Link>
              <Link href={lp('/warranty')} className="text-[13px] font-medium py-2 transition-colors text-text-primary hover:text-accent">
                {locale === 'uk' ? 'Гарантія' : 'Гарантия'}
              </Link>
              <Link href={lp('/returns')} className="text-[13px] font-medium py-2 transition-colors text-text-primary hover:text-accent">
                {locale === 'uk' ? 'Повернення' : 'Возврат'}
              </Link>
              <Link href={lp('/contacts')} className="text-[13px] font-medium py-2 transition-colors text-text-primary hover:text-accent">
                {locale === 'uk' ? 'Контакти' : 'Контакты'}
              </Link>
              <Link href={lp('/reviews')} className="text-[13px] font-medium py-2 transition-colors text-text-primary hover:text-accent">
                {locale === 'uk' ? 'Відгуки' : 'Отзывы'}
              </Link>
              <Link href={lp('/brands')} className="text-[13px] font-medium py-2 transition-colors text-text-primary hover:text-accent">
                {locale === 'uk' ? 'Виробники' : 'Производители'}
              </Link>
              <Link href={lp('/blog')} className="text-[13px] font-semibold py-2 transition-colors text-accent hover:text-accent-hover">
                {locale === 'uk' ? 'Блог' : 'Блог'}
              </Link>
              <Link href={lp('/calculators')} className="text-[13px] font-medium py-2 transition-colors text-text-primary hover:text-accent">
                {locale === 'uk' ? 'Калькулятори' : 'Калькуляторы'}
              </Link>
            </div>

            {/* Promotions Link on the right */}
            <Link
              href={lp('/promotions')}
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold transition-colors text-accent hover:text-accent-hover shrink-0 ml-auto"
            >
              <Tag className="size-3.5" strokeWidth={1.5} />
              <span>{locale === 'uk' ? 'Спецпропозиції та акції' : 'Спецпредложения и акции'}</span>
              <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                2
              </span>
            </Link>
          </nav>
        </div>
      </header>
    </>
  )
}
