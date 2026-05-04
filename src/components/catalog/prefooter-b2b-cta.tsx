'use client'

import { useLocale } from 'next-intl'
import { ArrowRight } from 'lucide-react'
import type { Locale } from '@/types'

export default function PrefooterB2bCta() {
  const locale = useLocale() as Locale

  const content = {
    uk: {
      title: 'Потрібен прайс для об\'єкту?',
      description: 'Надішліть список артикулів — повернемось з комерційною пропозицією з ПДВ за 1 робочий день.',
      cta: 'Надіслати запит →',
      emailPlaceholder: 'E-mail',
      phonePlaceholder: '+380...',
      textareaPlaceholder: 'Список артикулів або SKU (по одному на рядок)',
      send: 'Надіслати',
    },
    ru: {
      title: 'Нужен прайс для объекта?',
      description: 'Отправьте список артикулов — вернёмся с коммерческим предложением с НДС за 1 рабочий день.',
      cta: 'Отправить запрос →',
      emailPlaceholder: 'E-mail',
      phonePlaceholder: '+380...',
      textareaPlaceholder: 'Список артикулов или SKU (по одному в строку)',
      send: 'Отправить',
    },
  }

  const t = content[locale]

  return (
    <section
      className="w-full"
      style={{ background: '#EEF2F7' }}
    >
      <div className="max-w-[1280px] mx-auto px-4 py-12 flex flex-col lg:flex-row gap-12">
        {/* Left */}
        <div className="flex-1">
          <h2
            className="text-[26px] leading-[34px] font-bold"
            style={{ color: '#1A1F2B' }}
          >
            {t.title}
          </h2>
          <p
            className="mt-3 text-[15px] leading-6"
            style={{ color: '#6A7280' }}
          >
            {t.description}
          </p>
          <button
            className="mt-5 h-12 px-6 rounded-md text-[14px] font-semibold text-white cursor-pointer transition-opacity hover:opacity-90 inline-flex items-center gap-2"
            style={{ background: '#3B7BD9' }}
          >
            {t.cta}
          </button>
        </div>

        {/* Right — Form */}
        <div className="w-full lg:w-[400px] shrink-0 flex flex-col gap-2">
          <input
            type="email"
            placeholder={t.emailPlaceholder}
            className="w-full h-10 px-3 rounded-md text-[13px] outline-none transition-colors"
            style={{
              border: '1px solid #E6EAF0',
              color: '#1A1F2B',
              background: '#fff',
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = '#3B7BD9' }}
            onBlur={(e) => { e.currentTarget.style.borderColor = '#E6EAF0' }}
          />
          <input
            type="tel"
            placeholder={t.phonePlaceholder}
            className="w-full h-10 px-3 rounded-md text-[13px] outline-none transition-colors"
            style={{
              border: '1px solid #E6EAF0',
              color: '#1A1F2B',
              background: '#fff',
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = '#3B7BD9' }}
            onBlur={(e) => { e.currentTarget.style.borderColor = '#E6EAF0' }}
          />
          <textarea
            placeholder={t.textareaPlaceholder}
            className="w-full px-3 py-2.5 rounded-md text-[13px] outline-none resize-none transition-colors"
            style={{
              border: '1px solid #E6EAF0',
              color: '#1A1F2B',
              background: '#fff',
              height: 80,
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = '#3B7BD9' }}
            onBlur={(e) => { e.currentTarget.style.borderColor = '#E6EAF0' }}
          />
          <button
            className="w-full h-10 rounded-md text-[13px] font-semibold text-white cursor-pointer transition-opacity hover:opacity-90"
            style={{ background: '#3B7BD9' }}
          >
            {t.send}
          </button>
        </div>
      </div>
    </section>
  )
}
