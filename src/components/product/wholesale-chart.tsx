'use client'

import { useLocale } from 'next-intl'
import { discountForQty, normalizeTiers, type WholesaleTier } from '@/lib/wholesale'

/**
 * Interactive wholesale sparkline chart with ruler scale, active quantity tracking,
 * localized discount indicators, and +🚚 0₴ free shipping trigger.
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

  const W = 200
  const H = 72
  const padLeft = 16
  const padRight = 20
  const padTop = 22
  const padBottom = 20

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

  return (
    <div className="flex flex-col items-start gap-0.5 shrink-0 select-none">
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
        <text x={padLeft - 4} y={11} fontSize="9.5" fontWeight="700" fill="var(--color-text-muted)" textAnchor="start">
          {yAxisLabel}
        </text>

        {/* Max Discount Label (Top Right) -> RED & LARGER */}
        <text x={W - padRight + 4} y={11} fontSize="11" fontWeight="900" fill="#ef4444" textAnchor="end">
          −{maxDiscount}%
        </text>

        {/* Gradient fill area under line */}
        <path d={area} fill="url(#wsSpark)" />

        {/* Main discount line */}
        <path d={line} fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

        {/* Ruler Base Line (X Axis) */}
        <line x1={padLeft} y1={baseY} x2={padLeft + innerW} y2={baseY} stroke="var(--color-border-strong)" strokeWidth="1" />

        {/* Ruler Ticks and Quantity Labels along X Axis */}
        {points.map((p) => {
          const px = xOf(p.min)
          return (
            <g key={p.min}>
              {/* Tick line on ruler */}
              <line x1={px} y1={baseY} x2={px} y2={baseY + 4} stroke="var(--color-text-muted)" strokeWidth="1" />
              {/* Quantity number under tick */}
              <text x={px} y={baseY + 14} fontSize="8.5" fontWeight="700" fill="var(--color-text-muted)" textAnchor="middle">
                {p.min}
              </text>
              {/* Breakpoint dot on line */}
              {p.discount > 0 && (
                <circle cx={px} cy={yOf(p.discount)} r="2" fill="var(--color-accent)" />
              )}
            </g>
          )
        })}

        {/* Active Selection vertical line */}
        <line x1={curX} y1={baseY} x2={curX} y2={curY} stroke="#ef4444" strokeWidth="1" strokeDasharray="2 2" opacity="0.8" />

        {/* Free Shipping Badge +🚚 0₴ when currentTotal >= 1500 */}
        {hasFreeDelivery ? (
          <g transform={`translate(${Math.min(W - padRight - 22, Math.max(padLeft + 22, curX))}, ${Math.max(10, curY - 17)})`}>
            <rect x="-22" y="-10" width="44" height="13" rx="3.5" fill="#16a34a" />
            <text x="0" y="0" fontSize="8.5" fontWeight="900" fill="#ffffff" textAnchor="middle">
              +🚚 0₴
            </text>
          </g>
        ) : (
          /* Dynamic Discount % Label above Active Red Dot */
          <text
            x={curX}
            y={Math.max(12, curY - 6)}
            fontSize="9.5"
            fontWeight="800"
            fill="#ef4444"
            textAnchor="middle"
          >
            {curDiscount > 0 ? `−${curDiscount}%` : '0%'}
          </text>
        )}

        {/* Active Selection RED Dot */}
        <circle cx={curX} cy={curY} r="3.5" fill={hasFreeDelivery ? "#16a34a" : "#ef4444"} stroke="#ffffff" strokeWidth="1.5" />
      </svg>
    </div>
  )
}
