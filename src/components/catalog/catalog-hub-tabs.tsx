'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Wrench, SlidersHorizontal, ArrowRightLeft, Sparkles,
  Zap, Cable, UploadCloud, ChevronDown, ChevronRight,
} from 'lucide-react'
import type { Locale } from '@/types'
import { aiPromptChips } from '@/lib/catalog-hub-data'

interface CatalogHubTabsProps {
  locale: string
}

const tabs = [
  { id: 'ai', icon: Sparkles, label: { uk: 'Опиши об\'єкт — AI підбере', ru: 'Опиши объект — AI подберёт' }, badge: 'NEW', mobileOrder: 0 },
  { id: 'sku', icon: Wrench, label: { uk: 'Знаю артикул', ru: 'Знаю артикул' }, mobileOrder: 1 },
  { id: 'task', icon: SlidersHorizontal, label: { uk: 'Знаю задачу', ru: 'Знаю задачу' }, mobileOrder: 2 },
  { id: 'cross', icon: ArrowRightLeft, label: { uk: 'Артикул конкурента', ru: 'Артикул конкурента' }, mobileOrder: 3 },
]

// Desktop order: sku, task, cross, ai (AI last)
const desktopTabs = [...tabs].sort((a, b) => {
  const order: Record<string, number> = { sku: 0, task: 1, cross: 2, ai: 3 }
  return (order[a.id] ?? 0) - (order[b.id] ?? 0)
})
// Mobile order matches tabs array: ai first (expanded by default), then sku, task, cross
const mobileTabs = tabs

export default function CatalogHubTabs({ locale }: CatalogHubTabsProps) {
  const loc = locale as Locale
  const router = useRouter()
  const [active, setActive] = useState('ai')
  const [aiText, setAiText] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const textareaMobileRef = useRef<HTMLTextAreaElement>(null)

  // Auto-grow textarea
  useEffect(() => {
    const el = textareaRef.current
    if (el) {
      el.style.height = '100px'
      el.style.height = Math.min(el.scrollHeight, 200) + 'px'
    }
    const elM = textareaMobileRef.current
    if (elM) {
      elM.style.height = '88px'
      elM.style.height = Math.min(elM.scrollHeight, 200) + 'px'
    }
  }, [aiText])

  const handleChipClick = (text: string) => {
    if (aiText.length > 0) {
      if (!confirm(loc === 'uk' ? 'Замінити поточний текст?' : 'Заменить текущий текст?')) return
    }
    setAiText(text)
    textareaRef.current?.focus()
    textareaMobileRef.current?.focus()
  }

  const renderTabContent = (tabId: string, isMobile = false) => {
    switch (tabId) {
      case 'sku':
        return (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:h-9">
            <div className="flex items-center gap-3">
              <Zap className="size-[18px] shrink-0" strokeWidth={1.5} style={{ color: '#3B7BD9' }} />
              <span className="text-[13px] font-semibold shrink-0" style={{ color: '#1A1F2B' }}>
                {loc === 'uk' ? 'Замовити за артикулом:' : 'Заказать по артикулу:'}
              </span>
            </div>
            <input
              type="text"
              placeholder={loc === 'uk' ? 'Введіть артикул або MPN…' : 'Введите артикул или MPN…'}
              className="flex-1 h-9 px-3 rounded-md text-[13px] outline-none transition-colors"
              style={{ border: '1px solid #E6EAF0', color: '#1A1F2B' }}
              onFocus={(e) => { e.currentTarget.style.borderColor = '#3B7BD9' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = '#E6EAF0' }}
            />
            <div className="flex items-center gap-3">
              <button
                className="h-9 px-4 rounded-md text-[13px] font-semibold shrink-0 cursor-pointer transition-opacity hover:opacity-90"
                style={{ background: '#3B7BD9', color: '#fff' }}
              >
                {loc === 'uk' ? 'Знайти →' : 'Найти →'}
              </button>
              <div className="hidden sm:block h-6 shrink-0" style={{ width: 1, background: '#E6EAF0' }} />
              <button
                className="flex items-center gap-1 text-[12px] font-medium shrink-0 cursor-pointer transition-opacity hover:opacity-80"
                style={{ color: '#3B7BD9' }}
              >
                <UploadCloud className="size-3.5" strokeWidth={1.5} />
                {loc === 'uk' ? 'Завантажити список (Excel)' : 'Загрузить список (Excel)'}
              </button>
            </div>
          </div>
        )
      case 'task':
        return (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-wrap">
            <div className="flex items-center gap-3">
              <SlidersHorizontal className="size-[18px] shrink-0" strokeWidth={1.5} style={{ color: '#3B7BD9' }} />
              <span className="text-[13px] font-semibold shrink-0" style={{ color: '#1A1F2B' }}>
                {loc === 'uk' ? 'Підібрати за параметрами:' : 'Подобрать по параметрам:'}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                className="flex items-center gap-2 px-3 py-[7px] rounded-md text-[12px] font-semibold cursor-pointer transition-all"
                style={{ background: '#F5F7FA', border: '1px solid #E6EAF0', color: '#1A1F2B' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#EEF4FF'; e.currentTarget.style.borderColor = '#3B7BD9'; e.currentTarget.style.color = '#3B7BD9' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#F5F7FA'; e.currentTarget.style.borderColor = '#E6EAF0'; e.currentTarget.style.color = '#1A1F2B' }}
              >
                <Zap className="size-3" strokeWidth={1.5} />
                {loc === 'uk' ? 'Підбір автоматів за А, полюсами, кривою →' : 'Подбор автоматов по А, полюсам, кривой →'}
              </button>
              <button
                className="flex items-center gap-2 px-3 py-[7px] rounded-md text-[12px] font-semibold cursor-pointer transition-all"
                style={{ background: '#F5F7FA', border: '1px solid #E6EAF0', color: '#1A1F2B' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#EEF4FF'; e.currentTarget.style.borderColor = '#3B7BD9'; e.currentTarget.style.color = '#3B7BD9' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#F5F7FA'; e.currentTarget.style.borderColor = '#E6EAF0'; e.currentTarget.style.color = '#1A1F2B' }}
              >
                <Cable className="size-3" strokeWidth={1.5} />
                {loc === 'uk' ? 'Підбір кабелю за перерізом і навантаженням →' : 'Подбор кабеля по сечению и нагрузке →'}
              </button>
            </div>
            <span className="sm:ml-auto text-[12px] font-medium cursor-pointer hover:underline" style={{ color: '#3B7BD9' }}>
              {loc === 'uk' ? 'Усі підбірники (8) →' : 'Все подборщики (8) →'}
            </span>
          </div>
        )
      case 'cross':
        return (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex items-center gap-3">
              <ArrowRightLeft className="size-[18px] shrink-0" strokeWidth={1.5} style={{ color: '#3B7BD9' }} />
              <span className="text-[13px] font-semibold shrink-0" style={{ color: '#1A1F2B' }}>
                {loc === 'uk' ? 'Знайти аналог:' : 'Найти аналог:'}
              </span>
            </div>
            <input
              type="text"
              placeholder="Schneider EZ9F34216, ABB SH201-C16…"
              className="flex-1 h-9 px-3 rounded-md text-[12px] outline-none transition-colors"
              style={{ border: '1px solid #E6EAF0', color: '#1A1F2B' }}
              onFocus={(e) => { e.currentTarget.style.borderColor = '#3B7BD9' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = '#E6EAF0' }}
            />
            <button
              className="h-9 px-4 rounded-md text-[12px] font-semibold shrink-0 cursor-pointer transition-all"
              style={{ background: '#F5F7FA', border: '1px solid #E6EAF0', color: '#1A1F2B' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#EEF4FF'; e.currentTarget.style.borderColor = '#3B7BD9'; e.currentTarget.style.color = '#3B7BD9' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#F5F7FA'; e.currentTarget.style.borderColor = '#E6EAF0'; e.currentTarget.style.color = '#1A1F2B' }}
            >
              {loc === 'uk' ? 'Аналог →' : 'Аналог →'}
            </button>
            <span className="sm:ml-auto text-[11px] shrink-0" style={{ color: '#9AA3AF' }}>
              {loc === 'uk' ? 'База: 12 000+ перехресних артикулів' : 'База: 12 000+ перекрёстных артикулов'}
            </span>
          </div>
        )
      case 'ai':
        return (
          <div>
            {/* Header */}
            <div className="flex items-start gap-3">
              <div
                className="size-9 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: '#3B7BD9' }}
              >
                <Sparkles className="size-[22px]" strokeWidth={1.5} style={{ color: '#fff' }} />
              </div>
              <div className="flex-1">
                <p className="text-[14px] font-semibold leading-snug" style={{ color: '#1A1F2B' }}>
                  {loc === 'uk' ? 'Опишіть об\'єкт — AI-інженер складе комплект' : 'Опишите объект — AI-инженер составит комплект'}
                </p>
                <p className="text-[12px] leading-[18px] mt-0.5" style={{ color: '#6A7280' }}>
                  {loc === 'uk'
                    ? 'Список SKU, кошторис, групування по щиту/проводці/освітленню. ~30 секунд.'
                    : 'Список SKU, смета, группировка по щиту/проводке/освещению. ~30 секунд.'}
                </p>
              </div>
            </div>

            {/* Textarea */}
            <textarea
              ref={isMobile ? textareaMobileRef : textareaRef}
              value={aiText}
              onChange={(e) => setAiText(e.target.value)}
              placeholder={loc === 'uk'
                ? 'Напр.: Однокімнатна квартира 42 м². Треба оновити проводку, щиток, розетки і світло. Підключення 3 фази, лічильник 25А, квартирний автомат 32А.'
                : 'Напр.: Однокомнатная квартира 42 м². Нужно обновить проводку, щиток, розетки и свет. Подключение 3 фазы, счётчик 25А, квартирный автомат 32А.'}
              className="w-full mt-3.5 px-3.5 py-3 rounded-lg text-[13px] leading-5 outline-none resize-none transition-colors"
              style={{
                border: '1px solid #E6EAF0',
                color: '#1A1F2B',
                height: isMobile ? 88 : 100,
                maxHeight: 200,
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = '#3B7BD9' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = '#E6EAF0' }}
            />

            {/* Prompt chips */}
            <div className="flex items-center gap-2 flex-wrap mt-3">
              <span className="text-[11px] font-medium shrink-0" style={{ color: '#6A7280' }}>
                {loc === 'uk' ? 'Швидкий старт:' : 'Быстрый старт:'}
              </span>
              {aiPromptChips.map((chip, i) => (
                <button
                  key={i}
                  onClick={() => handleChipClick(chip[loc])}
                  className="px-2.5 py-1 rounded-2xl text-[11px] font-medium cursor-pointer transition-all"
                  style={{ background: '#F5F7FA', border: '1px solid #E6EAF0', color: '#1A1F2B' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#EEF4FF'; e.currentTarget.style.borderColor = '#3B7BD9'; e.currentTarget.style.color = '#3B7BD9' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = '#F5F7FA'; e.currentTarget.style.borderColor = '#E6EAF0'; e.currentTarget.style.color = '#1A1F2B' }}
                >
                  {chip[loc]}
                </button>
              ))}
            </div>

            {/* Bottom row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-3.5">
              <button
                onClick={() => {
                  if (aiText.length >= 20) {
                    router.push(`/${loc}/assistant?prompt=${encodeURIComponent(aiText)}` as never)
                  }
                }}
                className="h-10 px-[18px] rounded-md flex items-center gap-2 text-[13px] font-semibold cursor-pointer transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto justify-center sm:justify-start"
                style={{ background: '#3B7BD9', color: '#fff' }}
                disabled={aiText.length < 20}
              >
                <Sparkles className="size-3.5" strokeWidth={2} />
                {loc === 'uk' ? 'Скласти комплект →' : 'Составить комплект →'}
              </button>
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-[10px] font-medium" style={{ color: '#6A7280' }}>🔒 {loc === 'uk' ? 'Дані не зберігаються' : 'Данные не сохраняются'}</span>
                <span className="text-[10px] font-medium" style={{ color: '#6A7280' }}>📋 {loc === 'uk' ? 'Список редагується' : 'Список редактируется'}</span>
                <span className="text-[10px] font-medium" style={{ color: '#6A7280' }}>⚡ ~30 сек</span>
                <span className="text-[10px] font-medium cursor-pointer hover:underline" style={{ color: '#6A7280' }}>📷 {loc === 'uk' ? 'Можна додати фото' : 'Можно добавить фото'}</span>
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <>
      {/* ═══ DESKTOP: Tab Switcher ═══ */}
      <div className="hidden md:block rounded-lg overflow-hidden" style={{ background: '#fff', border: '1px solid #E6EAF0' }}>
        {/* Tab Nav */}
        <div className="flex" style={{ borderBottom: '1px solid #E6EAF0' }}>
          {desktopTabs.map((tab) => {
            const Icon = tab.icon
            const isActive = active === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActive(tab.id)}
                className="flex items-center gap-2 px-4 py-3 text-[13px] font-semibold cursor-pointer transition-colors relative"
                style={{
                  color: isActive ? '#3B7BD9' : '#6A7280',
                  borderBottom: isActive ? '2px solid #3B7BD9' : '2px solid transparent',
                  marginBottom: '-1px',
                }}
                onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.color = '#1A1F2B' }}
                onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.color = '#6A7280' }}
              >
                <Icon className="size-3.5" strokeWidth={1.5} />
                <span className="whitespace-nowrap">{tab.label[loc]}</span>
                {tab.badge && (
                  <span
                    className="text-[9px] font-bold px-1.5 py-px rounded"
                    style={{ background: '#3B7BD9', color: '#fff', marginLeft: 2 }}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Tab Content */}
        <div className="p-[18px_20px]">
          {renderTabContent(active)}
        </div>
      </div>

      {/* ═══ MOBILE: Accordion ═══ */}
      <div className="md:hidden rounded-lg overflow-hidden" style={{ background: '#fff', border: '1px solid #E6EAF0' }}>
        {mobileTabs.map((tab) => {
          const Icon = tab.icon
          const isActive = active === tab.id
          return (
            <div key={tab.id}>
              {/* Accordion Header */}
              <button
                onClick={() => setActive(isActive ? '' : tab.id)}
                className="w-full flex items-center justify-between px-4 cursor-pointer transition-colors"
                style={{
                  height: 48,
                  borderBottom: '1px solid #E6EAF0',
                  background: isActive ? '#EEF4FF' : 'transparent',
                }}
              >
                <div className="flex items-center gap-2">
                  <Icon
                    className="size-4"
                    strokeWidth={1.5}
                    style={{ color: isActive ? '#3B7BD9' : '#6A7280' }}
                  />
                  <span
                    className="text-[13px] font-semibold"
                    style={{ color: isActive ? '#3B7BD9' : '#1A1F2B' }}
                  >
                    {tab.label[loc]}
                  </span>
                  {tab.badge && (
                    <span
                      className="text-[9px] font-bold px-1.5 py-px rounded"
                      style={{ background: '#3B7BD9', color: '#fff' }}
                    >
                      {tab.badge}
                    </span>
                  )}
                </div>
                {isActive ? (
                  <ChevronDown className="size-3.5" strokeWidth={1.5} style={{ color: '#6A7280' }} />
                ) : (
                  <ChevronRight className="size-3.5" strokeWidth={1.5} style={{ color: '#6A7280' }} />
                )}
              </button>

              {/* Accordion Content */}
              <div
                className="overflow-hidden transition-all duration-200"
                style={{
                  maxHeight: isActive ? '600px' : '0px',
                  opacity: isActive ? 1 : 0,
                }}
              >
                <div className="p-4">
                  {renderTabContent(tab.id, true)}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
