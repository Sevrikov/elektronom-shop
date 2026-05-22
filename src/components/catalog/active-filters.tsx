'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { X } from 'lucide-react'
import { useTransition } from 'react'

interface ActiveFilterPill {
  key: string
  label: string
  value: string
  displayValue: string
}

interface ActiveFiltersProps {
  pills: ActiveFilterPill[]
}

export default function ActiveFilters({ pills }: ActiveFiltersProps) {
  const t = useTranslations('catalog')
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  if (pills.length === 0) return null

  function removePill(pill: ActiveFilterPill) {
    const params = new URLSearchParams(searchParams.toString())

    if (pill.key === 'priceMin' || pill.key === 'priceMax') {
      params.delete('priceMin')
      params.delete('priceMax')
    } else if (pill.key === 'inStock') {
      params.delete('inStock')
    } else {
      // For array-based filters (brand, dynamic attributes)
      const current = params.get(pill.key)
      if (current) {
        const values = current.split(',').filter(v => v !== pill.value)
        if (values.length > 0) {
          params.set(pill.key, values.join(','))
        } else {
          params.delete(pill.key)
        }
      }
    }

    // Reset to page 1
    params.delete('page')
    const qs = params.toString()
    startTransition(() => {
      router.replace(`${pathname}${qs ? `?${qs}` : ''}` as never, { scroll: false })
    })
  }

  function clearAll() {
    const params = new URLSearchParams()
    // Keep sort
    const sort = searchParams.get('sort')
    if (sort) params.set('sort', sort)
    const qs = params.toString()
    startTransition(() => {
      router.replace(`${pathname}${qs ? `?${qs}` : ''}` as never, { scroll: false })
    })
  }

  return (
    <div
      className="flex items-center gap-2 flex-wrap py-2"
      style={{ opacity: isPending ? 0.5 : 1, transition: 'opacity 200ms' }}
    >
      {pills.map((pill, i) => (
        <button
          key={`${pill.key}-${pill.value}-${i}`}
          onClick={() => removePill(pill)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium cursor-pointer transition-colors hover:opacity-80"
          style={{
            background: 'var(--color-accent-subtle)',
            color: 'var(--color-accent)',
            border: '1px solid var(--color-accent)',
          }}
        >
          <span>{pill.displayValue}</span>
          <X className="size-3" strokeWidth={2} />
        </button>
      ))}
      <button
        onClick={clearAll}
        className="text-[12px] font-medium cursor-pointer transition-colors hover:underline ml-1"
        style={{ color: 'var(--color-text-muted)' }}
      >
        {t('clearAll')}
      </button>
    </div>
  )
}
