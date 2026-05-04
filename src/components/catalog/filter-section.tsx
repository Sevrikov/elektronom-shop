'use client'

import { useState, type ReactNode } from 'react'
import { ChevronUp } from 'lucide-react'

interface FilterSectionProps {
  title: string
  count?: number
  defaultOpen?: boolean
  children: ReactNode
}

export default function FilterSection({ title, count, defaultOpen = true, children }: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div style={{ borderBottom: '1px solid var(--color-border)' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 text-left cursor-pointer transition-colors hover:bg-[var(--color-surface-alt)]"
        aria-expanded={isOpen}
      >
        <span className="text-[13px] font-semibold" style={{ color: 'var(--color-text-primary)' }}>
          {title}
        </span>
        <div className="flex items-center gap-2">
          {count !== undefined && (
            <span className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>
              {count}
            </span>
          )}
          <ChevronUp
            className="size-4 transition-transform duration-200"
            strokeWidth={1.5}
            style={{
              color: 'var(--color-text-muted)',
              transform: isOpen ? 'rotate(0deg)' : 'rotate(180deg)',
            }}
          />
        </div>
      </button>

      {/* Collapsible content */}
      <div
        className="overflow-hidden transition-all duration-200"
        style={{
          maxHeight: isOpen ? '600px' : '0px',
          opacity: isOpen ? 1 : 0,
        }}
      >
        <div className="px-4 pb-3">
          {children}
        </div>
      </div>
    </div>
  )
}
