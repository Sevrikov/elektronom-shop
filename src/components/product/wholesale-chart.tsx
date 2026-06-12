'use client'

import { discountForQty, normalizeTiers, type WholesaleTier } from '@/lib/wholesale'

interface WholesaleChartProps {
  breaks: WholesaleTier[]
  qty: number
  onSelectQty: (q: number) => void
  title: string
}

function smoothPath(pts: { x: number; y: number }[]): string {
  const first = pts[0]
  if (!first) return ''
  let d = `M ${first.x} ${first.y}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i]
    const p1 = pts[i + 1]
    if (!p0 || !p1) continue
    const midX = (p0.x + p1.x) / 2
    d += ` C ${midX} ${p0.y}, ${midX} ${p1.y}, ${p1.x} ${p1.y}`
  }
  return d
}

export function WholesaleChart({ breaks, qty, onSelectQty, title }: WholesaleChartProps) {
  const tiers = normalizeTiers(breaks)
  const lastTier = tiers[tiers.length - 1]
  if (!lastTier) return null

  const points = [{ min: 1, discount: 0 }, ...tiers]
  const maxQ = lastTier.min
  const maxDiscount = lastTier.discount

  const W = 280
  const H = 118
  const padX = 18
  const padTop = 22
  const padBottom = 22
  const innerW = W - padX * 2
  const innerH = H - padTop - padBottom

  const xOf = (q: number) => padX + (innerW * (Math.min(Math.max(q, 1), maxQ) - 1)) / Math.max(1, maxQ - 1)
  const yOf = (d: number) => padTop + innerH - (innerH * d) / maxDiscount

  const coords = points.map((p) => ({ ...p, x: xOf(p.min), y: yOf(p.discount) }))
  const line = smoothPath(coords)
  const baseY = padTop + innerH
  const firstCoord = coords[0]
  const lastCoord = coords[coords.length - 1]
  const area = firstCoord && lastCoord ? `${line} L ${lastCoord.x} ${baseY} L ${firstCoord.x} ${baseY} Z` : ''

  const curDiscount = discountForQty(qty, tiers)
  const curX = xOf(qty)
  const curY = yOf(curDiscount)

  return (
    <div className="rounded-xl border border-border bg-surface-white px-2.5 pt-2 pb-1.5 select-none">
      <div className="flex items-center justify-between mb-0.5 px-0.5">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-accent">{title}</span>
        <span className="text-[10px] font-bold text-success">−{maxDiscount}%</span>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label={title}>
        <defs>
          <linearGradient id="wholesaleGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.20" />
            <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {area && <path d={area} fill="url(#wholesaleGrad)" />}
        <path d={line} fill="none" stroke="var(--color-accent)" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />

        {/* current-qty guide + marker */}
        <line x1={curX} y1={baseY} x2={curX} y2={curY} stroke="var(--color-accent)" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
        <circle cx={curX} cy={curY} r="4.5" fill="var(--color-accent)" stroke="var(--color-surface-white)" strokeWidth="2" />

        {/* clickable tier points */}
        {coords.map((c) => {
          const active = qty >= c.min
          return (
            <g key={c.min} onClick={() => onSelectQty(c.min)} className="cursor-pointer">
              <circle cx={c.x} cy={c.y} r="9" fill="transparent" />
              <circle cx={c.x} cy={c.y} r="3" fill={active ? 'var(--color-accent)' : 'var(--color-surface-white)'} stroke="var(--color-accent)" strokeWidth="1.5" />
              {c.discount > 0 && (
                <text x={c.x} y={c.y - 8} textAnchor="middle" fontSize="9" fontWeight="800" fill="var(--color-text-primary)">
                  −{c.discount}%
                </text>
              )}
              <text x={c.x} y={H - 6} textAnchor="middle" fontSize="8.5" fill="var(--color-text-muted)">
                {c.min === 1 ? '1' : `${c.min}+`}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
