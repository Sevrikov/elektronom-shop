'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { ChevronRight, ArrowLeft, X } from 'lucide-react'
import type { CategoryTreeNode } from '@/queries/categories'
import type { Locale } from '@/types'
import { getPopularForSlug, getPromoForSlug } from '@/config/catalog-mega-menu'

interface Props {
  categories: CategoryTreeNode[]
  isOpen: boolean
  onClose: () => void
}

export function CatalogMegaMenuClient({ categories, isOpen, onClose }: Props) {
  const locale = useLocale() as Locale
  const t = useTranslations('megaMenu')
  const pathname = usePathname()
  const menuRef = useRef<HTMLDivElement>(null)

  // Desktop: hovered/active top-level category
  const [activeSlug, setActiveSlug] = useState<string>(categories[0]?.slug ?? '')

  // Mobile: drill-down level (null = top level, string = subcategory view)
  const [mobileLevel, setMobileLevel] = useState<string | null>(null)

  // Close on pathname change (link navigation)
  useEffect(() => {
    onClose()
  }, [pathname, onClose])

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  // Prevent body scroll while open; mobile level is reset by parent via onClose
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const lp = useCallback((path: string) => `/${locale}${path}` as never, [locale])

  const activeCategory = categories.find((c) => c.slug === activeSlug) ?? categories[0]
  const mobileLevelCategory = mobileLevel ? categories.find((c) => c.slug === mobileLevel) : null

  const popular = activeSlug ? getPopularForSlug(activeSlug, locale) : []
  const promo = activeSlug ? getPromoForSlug(activeSlug, locale) : null

  const mobilePopular = mobileLevel ? getPopularForSlug(mobileLevel, locale) : []
  const mobilePromo = mobileLevel ? getPromoForSlug(mobileLevel, locale) : null

  if (!isOpen) return null

  return (
    <>
      {/* ── Overlay ── */}
      <div
        className="fixed inset-0 z-40 bg-black/35"
        aria-hidden="true"
        onClick={onClose}
      />

      {/* ── Desktop Mega Menu ── */}
      <div
        ref={menuRef}
        id="catalog-mega-menu"
        role="navigation"
        aria-label={t('ariaLabel')}
        className="hidden lg:flex fixed left-0 right-0 z-50 bg-surface-white border-b border-border shadow-lg overflow-hidden"
        style={{ top: 'var(--header-height, 220px)', maxHeight: 'calc(100vh - var(--header-height, 220px) - 16px)' }}
      >
        <div className="mx-auto max-w-[1600px] w-full flex">

          {/* Col 1: Top-level categories */}
          <div className="w-[300px] shrink-0 border-r border-border overflow-y-auto py-3">
            {categories.map((cat) => (
              <button
                key={cat.slug}
                type="button"
                onMouseEnter={() => setActiveSlug(cat.slug)}
                onClick={() => setActiveSlug(cat.slug)}
                className={[
                  'w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm font-medium transition-colors',
                  'hover:bg-surface-alt',
                  activeSlug === cat.slug ? 'bg-surface-alt text-accent' : 'text-text-primary',
                ].join(' ')}
              >
                {cat.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={cat.image} alt="" className="size-5 object-contain shrink-0" aria-hidden="true" />
                )}
                <span className="flex-1 truncate">{cat.name}</span>
                <ChevronRight className={['size-3.5 shrink-0 transition-opacity', activeSlug === cat.slug ? 'opacity-100 text-accent' : 'opacity-30'].join(' ')} strokeWidth={2} />
              </button>
            ))}
            {/* View all */}
            <div className="px-4 pt-2 pb-3 border-t border-border mt-1">
              <Link
                href={lp('/catalog')}
                onClick={onClose}
                className="text-sm font-semibold text-accent hover:underline"
              >
                {t('viewAll')}
              </Link>
            </div>
          </div>

          {/* Col 2: Subcategories of active category */}
          <div className="flex-1 min-w-0 overflow-y-auto px-6 py-4">
            {activeCategory && (
              <>
                <Link
                  href={lp(`/catalog/${activeCategory.slug}`)}
                  onClick={onClose}
                  className="inline-block text-base font-bold text-text-primary mb-3 hover:text-accent transition-colors"
                >
                  {activeCategory.name}
                </Link>
                {activeCategory.children.length > 0 ? (
                  <div className="grid grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-2.5">
                    {activeCategory.children.map((child) => (
                      <Link
                        key={child.slug}
                        href={lp(`/catalog/${child.slug}`)}
                        onClick={onClose}
                        className="flex items-center gap-1.5 py-1.5 text-[13px] text-text-primary hover:text-accent transition-colors group"
                      >
                        <ChevronRight className="size-3 shrink-0 text-border-strong group-hover:text-accent transition-colors" strokeWidth={2} />
                        <span className="line-clamp-2">{child.name}</span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-text-muted">{t('noSubcategories')}</p>
                )}
              </>
            )}
          </div>

          {/* Col 3: Popular items */}
          {popular.length > 0 && (
            <div className="w-[260px] shrink-0 border-l border-border overflow-y-auto px-4 py-4">
              <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-3">{t('popular')}</p>
              <ul className="space-y-0.5">
                {popular.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={lp(item.href)}
                      onClick={onClose}
                      className="flex items-center gap-2 py-2 px-2 rounded-md text-[13px] text-text-primary hover:bg-surface-alt hover:text-accent transition-colors"
                    >
                      <span className="size-1.5 rounded-full bg-accent shrink-0" />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Col 4: Promo block */}
          {promo && (
            <div className="w-[280px] shrink-0 border-l border-border overflow-y-auto p-5 flex flex-col justify-between bg-surface-alt">
              <div className="flex flex-col gap-3">
                <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">{t('promoLabel')}</p>
                <p className="text-base font-bold text-text-primary leading-snug">{promo.title}</p>
                {promo.subtitle && (
                  <p className="text-[13px] text-text-muted leading-relaxed">{promo.subtitle}</p>
                )}
                {promo.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={promo.image}
                    alt={promo.title}
                    className="w-full h-32 object-contain rounded-md mt-1"
                  />
                )}
              </div>
              <Link
                href={lp(promo.href)}
                onClick={onClose}
                className="mt-4 inline-flex items-center justify-center px-4 py-2.5 rounded-md text-sm font-semibold text-white bg-accent hover:bg-accent-hover transition-colors self-start"
              >
                {promo.cta}
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* ── Mobile Drawer (fullscreen) ── */}
      <div
        className="lg:hidden fixed inset-0 z-50 flex flex-col bg-surface-white"
        role="navigation"
        aria-label={t('ariaLabel')}
      >
        {/* Mobile header */}
        <div className="flex items-center justify-between h-14 px-4 border-b border-border shrink-0">
          {mobileLevel ? (
            <button
              type="button"
              onClick={() => setMobileLevel(null)}
              className="inline-flex items-center gap-2 text-sm font-semibold text-text-primary"
            >
              <ArrowLeft className="size-4" strokeWidth={2} />
              {t('back')}
            </button>
          ) : (
            <span className="text-sm font-bold text-text-primary">{t('catalogTitle')}</span>
          )}
          <button
            type="button"
            onClick={onClose}
            className="size-9 inline-flex items-center justify-center rounded-md hover:bg-surface-alt transition-colors text-text-muted"
            aria-label={t('close')}
          >
            <X className="size-5" strokeWidth={1.5} />
          </button>
        </div>

        {/* Mobile level 1: top categories */}
        {!mobileLevel && (
          <div className="flex-1 overflow-y-auto py-2">
            {categories.map((cat) => (
              <button
                key={cat.slug}
                type="button"
                onClick={() => {
                  if (cat.children.length > 0) {
                    setMobileLevel(cat.slug)
                  }
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-left border-b border-border last:border-0"
              >
                {cat.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={cat.image} alt="" className="size-5 object-contain shrink-0" aria-hidden="true" />
                )}
                <span className="flex-1 text-sm font-medium text-text-primary truncate">{cat.name}</span>
                {cat.children.length > 0
                  ? <ChevronRight className="size-4 text-text-muted shrink-0" strokeWidth={1.5} />
                  : null}
              </button>
            ))}
            <div className="px-4 py-3">
              <Link
                href={lp('/catalog')}
                onClick={onClose}
                className="text-sm font-semibold text-accent"
              >
                {t('viewAll')}
              </Link>
            </div>
          </div>
        )}

        {/* Mobile level 2: subcategories */}
        {mobileLevel && mobileLevelCategory && (
          <div className="flex-1 overflow-y-auto py-2">
            {/* Category link itself */}
            <Link
              href={lp(`/catalog/${mobileLevelCategory.slug}`)}
              onClick={onClose}
              className="flex items-center gap-2 px-4 py-3 border-b border-border font-semibold text-sm text-accent"
            >
              {t('allIn')} {mobileLevelCategory.name}
              <ChevronRight className="size-4" strokeWidth={2} />
            </Link>

            {mobileLevelCategory.children.map((child) => (
              <Link
                key={child.slug}
                href={lp(`/catalog/${child.slug}`)}
                onClick={onClose}
                className="flex items-center gap-2 px-4 py-3 text-sm text-text-primary border-b border-border last:border-0 hover:bg-surface-alt transition-colors"
              >
                <ChevronRight className="size-3.5 text-text-muted shrink-0" strokeWidth={2} />
                {child.name}
              </Link>
            ))}

            {/* Popular items */}
            {mobilePopular.length > 0 && (
              <div className="px-4 pt-4 pb-2">
                <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-2">{t('popular')}</p>
                {mobilePopular.map((item) => (
                  <Link
                    key={item.href}
                    href={lp(item.href)}
                    onClick={onClose}
                    className="flex items-center gap-2 py-2 text-sm text-text-primary hover:text-accent transition-colors"
                  >
                    <span className="size-1.5 rounded-full bg-accent shrink-0" />
                    {item.label}
                  </Link>
                ))}
              </div>
            )}

            {/* Promo block mobile */}
            {mobilePromo && (
              <div className="mx-4 my-4 p-4 rounded-lg bg-surface-alt border border-border">
                <p className="text-sm font-bold text-text-primary mb-1">{mobilePromo.title}</p>
                {mobilePromo.subtitle && (
                  <p className="text-[13px] text-text-muted mb-3">{mobilePromo.subtitle}</p>
                )}
                <Link
                  href={lp(mobilePromo.href)}
                  onClick={onClose}
                  className="inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-semibold text-white bg-accent hover:bg-accent-hover transition-colors"
                >
                  {mobilePromo.cta}
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}
