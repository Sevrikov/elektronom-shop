'use client'

// Animated comparison table (mobile-first).
// Layout is transposed vs typical compare pages: PRODUCTS are rows (scroll down,
// unlimited), CHARACTERISTICS are columns. Tapping a column header makes it the
// active priority: its column animates to the front AND rows re-sort by it.
// Per-column coloring: best = green, worst = red + down-arrow (direction from config).
// Reorder is animated with motion's `layout`.

import { useMemo, useState } from 'react'
import { motion, LayoutGroup } from 'motion/react'
import { ArrowDown, X } from 'lucide-react'
import { AddToCartButton } from '@/components/cart/add-to-cart-button'
import { useCompareStore } from '@/store/compare-store'

export type CompareDirection = 'higher' | 'lower' | 'text'

export interface CompareColumn {
  key: string
  label: string
  /** 'higher' = bigger is better, 'lower' = smaller is better, 'text' = no better/worse */
  direction: CompareDirection
  unit?: string
}

export interface CompareProduct {
  id: string
  name: string
  image: string | null
  values: Record<string, string | number | null | undefined>
}

interface CompareTableProps {
  products: CompareProduct[]
  /** characteristic columns in priority order (most important first) */
  columns: CompareColumn[]
  locale?: 'uk' | 'ru'
}

const ROW_H = 56 // px — keeps rows aligned across columns

/** Parse a single comparable number. Lists/ranges ("1,5,2,5", "16/25", "1-2") → null (text). */
function toNum(v: unknown): number | null {
  if (v === null || v === undefined) return null
  if (typeof v === 'number') return Number.isFinite(v) ? v : null
  const raw = String(v).trim()
  if (/\d\s*[,;/–-]\s*\d/.test(raw) && !/^-?\d+,\d+$/.test(raw)) return null
  const m = raw.replace(/\s/g, '').replace(',', '.').match(/^-?\d+(\.\d+)?/)
  return m ? parseFloat(m[0]) : null
}

export function CompareTable({ products, columns, locale = 'uk' }: CompareTableProps) {
  const [activeKey, setActiveKey] = useState<string>(columns[0]?.key ?? '')
  const [dir, setDir] = useState<'asc' | 'desc'>('asc')

  // active column first; the rest keep their priority order
  const orderedColumns = useMemo(() => {
    const active = columns.find((c) => c.key === activeKey)
    return active ? [active, ...columns.filter((c) => c.key !== activeKey)] : columns
  }, [columns, activeKey])

  // per-column best/worst for coloring
  const stats = useMemo(() => {
    const map = new Map<string, { numeric: boolean; best: number | null; worst: number | null }>()
    for (const col of columns) {
      const nums = products
        .map((p) => toNum(p.values[col.key]))
        .filter((n): n is number => n !== null)
      const numeric = col.direction !== 'text' && new Set(nums).size >= 2
      map.set(col.key, {
        numeric,
        best: numeric ? (col.direction === 'lower' ? Math.min(...nums) : Math.max(...nums)) : null,
        worst: numeric ? (col.direction === 'lower' ? Math.max(...nums) : Math.min(...nums)) : null,
      })
    }
    return map
  }, [columns, products])

  const sorted = useMemo(() => {
    const col = columns.find((c) => c.key === activeKey)
    const arr = [...products]
    if (!col) return arr
    arr.sort((a, b) => {
      const na = toNum(a.values[col.key])
      const nb = toNum(b.values[col.key])
      if (na !== null && nb !== null) return dir === 'asc' ? na - nb : nb - na
      const sa = String(a.values[col.key] ?? '')
      const sb = String(b.values[col.key] ?? '')
      return dir === 'asc' ? sa.localeCompare(sb, locale) : sb.localeCompare(sa, locale)
    })
    return arr
  }, [products, columns, activeKey, dir, locale])

  function onHeaderClick(key: string, direction: CompareDirection) {
    if (key === activeKey) {
      setDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setActiveKey(key)
      setDir(direction === 'higher' ? 'desc' : 'asc') // best on top by default
    }
  }

  function tone(colKey: string, value: unknown): 'best' | 'worst' | 'none' {
    const st = stats.get(colKey)
    if (!st || !st.numeric) return 'none'
    const n = toNum(value)
    if (n === null) return 'none'
    if (n === st.best) return 'best'
    if (n === st.worst) return 'worst'
    return 'none'
  }

  return (
    <LayoutGroup>
      <div className="overflow-x-auto overscroll-x-contain rounded-lg border border-border">
        <div className="flex w-max">
          {/* Sticky product column */}
          <div className="sticky left-0 z-20 bg-surface-white shrink-0 w-[175px] border-r border-border shadow-[2px_0_5px_rgba(0,0,0,0.05)]">
            <div className="h-12 border-b border-border bg-surface-alt flex items-center px-2.5 text-[10px] font-bold tracking-wider uppercase text-text-muted">
              Товар
            </div>
            {sorted.map((p) => (
              <motion.div
                layout
                key={p.id}
                className="flex items-center gap-1.5 px-2 border-b border-border last:border-b-0 bg-surface-white"
                style={{ height: ROW_H }}
              >
                <div className="relative shrink-0 size-8 group/img">
                  {p.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.image} alt={p.name} className="size-8 object-contain" />
                  ) : (
                    <div className="size-8 rounded bg-surface-alt" />
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      useCompareStore.getState().remove(p.id)
                    }}
                    className="absolute -top-1.5 -left-1.5 size-4 rounded-full bg-destructive text-white flex items-center justify-center cursor-pointer hover:bg-red-600 transition-colors shadow-sm"
                    title="Видалити з порівняння"
                  >
                    <X className="size-2.5" strokeWidth={3} />
                  </button>
                </div>
                <div className="flex flex-col min-w-0 flex-1 justify-center">
                  <span className="text-[10px] leading-tight font-medium line-clamp-2 text-text-primary" title={p.name}>
                    {p.name}
                  </span>
                </div>
                <AddToCartButton
                  productId={p.id}
                  productName={p.name}
                  variant="icon"
                  className="size-7 p-1 rounded bg-accent text-white"
                />
              </motion.div>
            ))}
          </div>

          {/* Characteristic columns */}
          {orderedColumns.map((col) => {
            const isActive = col.key === activeKey
            return (
              <motion.div layout key={col.key} className={`shrink-0 w-[114px] ${isActive ? 'bg-accent/5' : ''}`}>
                <button
                  type="button"
                  onClick={() => onHeaderClick(col.key, col.direction)}
                  className={`h-12 w-full px-2 flex items-center justify-center gap-1 border-b border-border text-[11px] font-semibold leading-tight cursor-pointer ${
                    isActive ? 'text-accent' : 'text-text-muted'
                  }`}
                >
                  <span className="line-clamp-2 text-center">{col.label}</span>
                  {isActive && (
                    <ArrowDown className={`size-3 shrink-0 transition-transform ${dir === 'asc' ? 'rotate-180' : ''}`} />
                  )}
                </button>

                {sorted.map((p) => {
                  const t = tone(col.key, p.values[col.key])
                  const val = p.values[col.key]
                  const display = val === null || val === undefined || val === '' ? '—' : String(val)
                  return (
                    <motion.div
                      layout
                      key={p.id}
                      className={`flex items-center justify-center gap-0.5 px-1.5 border-b border-border last:border-b-0 text-[12px] num text-center ${
                        t === 'best'
                          ? 'bg-success-subtle text-success font-semibold'
                          : t === 'worst'
                            ? 'bg-destructive/8 text-destructive'
                            : 'text-text-primary'
                      }`}
                      style={{ height: ROW_H }}
                    >
                      <span className="line-clamp-2">
                        {display}
                        {col.unit && display !== '—' ? ` ${col.unit}` : ''}
                      </span>
                      {t === 'worst' && <ArrowDown className="size-3 shrink-0" strokeWidth={2.5} />}
                    </motion.div>
                  )
                })}
              </motion.div>
            )
          })}
        </div>
      </div>
    </LayoutGroup>
  )
}
