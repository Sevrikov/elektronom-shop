'use client'

import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { paymentMethods, contactPhones, contactInfo } from '@/lib/constants'
import type { Locale } from '@/types'

export default function Footer() {
  const locale = useLocale() as Locale
  const t = useTranslations('footer')
  const lp = (path: string) => `/${locale}${path}` as never

  const columns = [
    {
      title: t('info'),
      links: [
        { label: t('aboutUs'), href: '/about' },
        { label: t('warranty'), href: '/warranty' },
        { label: t('certificates'), href: '/certificates' },
        { label: t('news'), href: '/news' },
        { label: t('careers'), href: '/careers' },
      ],
    },
    {
      title: t('help'),
      links: [
        { label: t('howToOrder'), href: '/how-to-order' },
        { label: t('deliveryAndPayment'), href: '/delivery' },
        { label: t('returns'), href: '/returns' },
        { label: t('faq'), href: '/faq' },
        { label: t('feedback'), href: '/feedback' },
      ],
    },
    {
      title: t('services'),
      links: [
        { label: t('priceRequest'), href: '/price-request' },
        { label: t('electricianProgram'), href: '/electricians' },
        { label: t('dealers'), href: '/dealers' },
        { label: t('downloadPrice'), href: '/price-list' },
        { label: t('sitemap'), href: '/sitemap' },
      ],
    },
  ]

  return (
    <footer style={{ background: 'var(--color-footer-bg)', color: 'var(--color-footer-text)' }} className="pt-12 pb-6 px-4 lg:px-20">
      <div className="mx-auto max-w-[1600px]">
        {/* 4-column grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-[13px] font-semibold text-white uppercase tracking-wider mb-4">
                {col.title}
              </h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={lp(link.href)}
                      className="text-[13px] transition-colors hover:text-white"
                      style={{ color: 'var(--color-footer-text)' }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contacts column */}
          <div>
            <h4 className="text-[13px] font-semibold text-white uppercase tracking-wider mb-4">
              {t('contacts')}
            </h4>
            <ul className="space-y-2">
              {contactPhones.map((phone) => (
                <li key={phone}>
                  <a href={`tel:${phone.replace(/[\s()-]/g, '')}`} className="text-[13px] hover:text-white transition-colors" style={{ color: 'var(--color-footer-text)' }}>
                    {phone}
                  </a>
                </li>
              ))}
              <li>
                <a href={`mailto:${contactInfo.email}`} className="text-[13px] hover:text-white transition-colors" style={{ color: 'var(--color-footer-text)' }}>
                  {contactInfo.email}
                </a>
              </li>
              <li className="text-[13px]" style={{ color: 'var(--color-footer-text)' }}>
                {contactInfo.address[locale]}
              </li>
              <li className="text-[13px]" style={{ color: 'var(--color-footer-text)' }}>
                {contactInfo.workingHours[locale]}
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-8 pt-5 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: '1px solid var(--color-footer-border)' }}
        >
          <span className="text-xs" style={{ color: 'var(--color-footer-muted)' }}>
            {t('copyright')}
          </span>
          <div className="flex flex-wrap gap-2">
            {paymentMethods.map((method) => (
              <span
                key={method}
                className="px-2.5 py-1 rounded text-[11px] font-semibold"
                style={{ border: '1px solid var(--color-footer-border)', color: 'var(--color-footer-text)' }}
              >
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
