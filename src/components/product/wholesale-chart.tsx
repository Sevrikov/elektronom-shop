'use client'

import { useLocale } from 'next-intl'
import { discountForQty, normalizeTiers, type WholesaleTier } from '@/lib/wholesale'

/**
 * Interactive wholesale sparkline chart with ruler scale, active quantity tracking,
 * peak discount label (e.g. -25% / -15%), +🚚 0₴ free shipping indicator, and right-side discount badge.
 */
export function WholesaleChart({
  breaks,
  qty,
  unitPrice = 0,
}: {
  breaks: WholesaleTier[]
  qty: number
  unitPrice?: number
}) {
  const locale = useLocale()
  const isRu = locale === 'ru'
  const yAxisLabel = isRu ? 'Скидка %' : 'Знижка %'

  const tiers = normalizeTiers(breaks)
  const lastTier = tiers[tiers.length - 1]
  if (!lastTier) return null

  const points = [{ min: 1, discount: 0 }, ...tiers]
  const maxQ = lastTier.min
  const maxDiscount = lastTier.discount

  const W = 118
  const H = 54
  const padLeft = 8
  const padRight = 8
  const padTop = 16
  const padBottom = 14

  const innerW = W - padLeft - padRight
  const innerH = H - padTop - padBottom

  const xOf = (q: number) => padLeft + (innerW * (Math.min(Math.max(q, 1), maxQ) - 1)) / Math.max(1, maxQ - 1)
  const yOf = (d: number) => padTop + innerH - (innerH * d) / maxDiscount
  const baseY = padTop + innerH

  // Real polyline: straight segments through the actual tier points
  let line = `M ${xOf(1)} ${yOf(0)}`
  for (let i = 1; i < points.length; i++) {
    const cur = points[i]
    if (!cur) continue
    line += ` L ${xOf(cur.min)} ${yOf(cur.discount)}`
  }
  const area = `${line} L ${xOf(maxQ)} ${baseY} L ${xOf(1)} ${baseY} Z`

  const curDiscount = discountForQty(qty, tiers)
  const curX = xOf(qty)
  const curY = yOf(curDiscount)

  const currentTotal = unitPrice * qty
  const hasFreeDelivery = currentTotal >= 1500

  const hasActiveDiscount = curDiscount > 0

  return (
    <div className="flex items-center gap-1 shrink-0 select-none">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width={W}
        height={H}
        className="shrink-0 overflow-visible"
        role="img"
        aria-label={`${yAxisLabel} до -${maxDiscount}%`}
      >
        <defs>
          <linearGradient id="wsSpark" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.22" />
            <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Top Y-axis Label: Знижка % / Скидка % */}
        <text x={padLeft} y={9} fontSize="7.5" fontWeight="700" fill="var(--color-text-muted)" textAnchor="start">
          {yAxisLabel}
        </text>

        {/* Peak Max Discount Label on Peak of Curve (e.g. -25% or -15%) */}
        <text x={xOf(maxQ)} y={yOf(maxDiscount) - 3} fontSize="8.5" fontWeight="900" fill="#ef4444" textAnchor="end">
          -{maxDiscount}%
        </text>

        {/* Gradient fill area under line */}
        <path d={area} fill="url(#wsSpark)" />

        {/* Main discount line */}
        <path d={line} fill="none" stroke="var(--color-accent)" strokeWidth="1.75" strokeLinejoin="round" strokeLinecap="round" />

        {/* Ruler Base Line (X Axis) */}
        <line x1={padLeft} y1={baseY} x2={padLeft + innerW} y2={baseY} stroke="var(--color-border-strong)" strokeWidth="1" />

        {/* Ruler Ticks and Quantity Labels along X Axis */}
        {points.map((p) => {
          const px = xOf(p.min)
          return (
            <g key={p.min}>
              {/* Tick line on ruler */}
              <line x1={px} y1={baseY} x2={px} y2={baseY + 3} stroke="var(--color-text-muted)" strokeWidth="1" />
              {/* Quantity number under tick */}
              <text x={px} y={baseY + 10} fontSize="7.5" fontWeight="700" fill="var(--color-text-muted)" textAnchor="middle">
                {p.min}
              </text>
              {/* Breakpoint dot on line */}
              {p.discount > 0 && (
                <circle cx={px} cy={yOf(p.discount)} r="1.75" fill="var(--color-accent)" />
              )}
            </g>
          )
        })}

        {/* Active Selection vertical line */}
        <line x1={curX} y1={baseY} x2={curX} y2={curY} stroke="#ef4444" strokeWidth="1" strokeDasharray="2 2" opacity="0.8" />

        {/* Free Shipping Badge +🚚 0₴ when currentTotal >= 1500 */}
        {hasFreeDelivery && (
          <g transform={`translate(${Math.min(W - padRight - 15, Math.max(padLeft + 15, curX))}, ${Math.max(6, curY - 12)})`}>
            <rect x="-16" y="-8" width="32" height="11" rx="2.5" fill="#16a34a" />
            <text x="0" y="0" fontSize="7.5" fontWeight="900" fill="#ffffff" textAnchor="middle">
              +🚚0₴
            </text>
          </g>
        )}

        {/* Active Selection RED/GREEN Dot */}
        <circle cx={curX} cy={curY} r="3" fill={hasFreeDelivery ? '#16a34a' : '#ef4444'} stroke="#ffffff" strokeWidth="1.25" />
      </svg>

      {/* Red Discount Plashka to the Right of the Chart */}
      <div
        className={`flex flex-col items-center justify-center px-2 py-0.5 rounded-lg shrink-0 shadow-2xs border transition-all ${
          hasActiveDiscount
            ? 'bg-red-500/10 border-red-500/40 text-red-500'
            : 'bg-surface-alt border-border text-text-muted opacity-90'
        }`}
      >
        <span className="text-[8.5px] font-extrabold uppercase tracking-tight leading-none text-text-muted">
          {isRu ? 'Скидка' : 'Знижка'}
        </span>
        <span className="text-[13px] font-black num leading-tight text-red-500">
          {hasActiveDiscount ? `−${curDiscount}%` : `до −${maxDiscount}%`}
        </span>
      </div>
    </div>
  )
}
