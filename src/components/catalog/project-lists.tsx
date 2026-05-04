'use client'

import { Folder, Plus, ArrowRight } from 'lucide-react'
import { projectLists } from '@/lib/catalog-hub-data'
import type { Locale } from '@/types'

interface ProjectListsProps {
  locale: string
}

export default function ProjectLists({ locale }: ProjectListsProps) {
  const loc = locale as Locale

  return (
    <div>
      {/* Header */}
      <div className="flex items-baseline justify-between mb-3.5">
        <div className="flex items-baseline gap-2">
          <h2 className="text-[16px] font-semibold leading-6" style={{ color: '#1A1F2B' }}>
            {loc === 'uk' ? 'Мої проєктні списки' : 'Мои проектные списки'}
          </h2>
          <span className="text-[11px]" style={{ color: '#6A7280' }}>
            {loc === 'uk' ? 'збережені BOM' : 'сохранённые BOM'}
          </span>
        </div>
        <button
          className="text-[12px] font-semibold cursor-pointer hover:underline"
          style={{ color: '#3B7BD9' }}
        >
          {loc === 'uk' ? 'Усі списки (12) →' : 'Все списки (12) →'}
        </button>
      </div>

      {/* Cards row */}
      <div className="flex gap-3 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
        {/* List cards */}
        {projectLists.map((pl) => (
          <div
            key={pl.id}
            className="flex-1 min-w-[232px] flex flex-col gap-1.5 p-3.5 rounded-lg cursor-pointer transition-all"
            style={{ background: '#fff', border: '1px solid #E6EAF0' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#3B7BD9'
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(59,123,217,0.08)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#E6EAF0'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            {/* Top row */}
            <div className="flex items-center justify-between">
              <Folder className="size-4" strokeWidth={1.5} style={{ color: '#6A7280' }} />
              <span className="text-[10px]" style={{ color: '#9AA3AF' }}>{pl.updatedLabel[loc]}</span>
            </div>
            {/* Name */}
            <p className="text-[13px] font-semibold truncate" style={{ color: '#1A1F2B' }}>
              {pl.name}
            </p>
            {/* Meta */}
            <div className="flex items-center gap-2 text-[11px] font-medium" style={{ color: '#6A7280' }}>
              <span style={{ fontVariantNumeric: 'tabular-nums' }}>{pl.skuCount} SKU</span>
              <span style={{ color: '#C9D1DC' }}>·</span>
              <span style={{ fontVariantNumeric: 'tabular-nums' }}>{pl.totalUah.toLocaleString('uk-UA')} ₴</span>
            </div>
            {/* CTA */}
            <div className="flex items-center gap-2 mt-auto pt-1">
              <span className="text-[11px] font-semibold" style={{ color: '#3B7BD9' }}>
                {loc === 'uk' ? 'Замовити повторно →' : 'Заказать повторно →'}
              </span>
              <span
                className="text-[10px] font-bold px-1.5 py-px rounded"
                style={{ background: '#EEF4FF', color: '#3B7BD9' }}
              >
                {pl.discount}
              </span>
            </div>
          </div>
        ))}

        {/* Empty-state card */}
        <div
          className="flex-1 min-w-[232px] flex flex-col items-center justify-center gap-1 p-3.5 rounded-lg cursor-pointer transition-all"
          style={{ background: '#F5F7FA', border: '1px dashed #C9D1DC' }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#3B7BD9' }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#C9D1DC' }}
        >
          <Plus className="size-[22px]" strokeWidth={1.5} style={{ color: '#6A7280' }} />
          <span className="text-[12px] font-semibold" style={{ color: '#6A7280' }}>
            {loc === 'uk' ? 'Створити список' : 'Создать список'}
          </span>
          <span className="text-[10px]" style={{ color: '#9AA3AF' }}>
            {loc === 'uk' ? 'або імпорт із Excel' : 'или импорт из Excel'}
          </span>
        </div>
      </div>
    </div>
  )
}
