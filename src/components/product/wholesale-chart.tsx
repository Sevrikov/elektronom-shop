'use client'

import { discountForQty, normalizeTiers, type WholesaleTier } from '@/lib/wholesale'

/**
 * Tiny wholesale sparkline. Draws the REAL step function (flat between tiers,
 * jumps at thresholds) — no fictional smoothing. The marker sits at the actual
 * discount for the current quantity.
 */
export function WholesaleChart({ breaks, qty }: { breaks: WholesaleTier[]; qty: number }) {
  const tiers = normalizeTiers(breaks)
  const lastTier = tiers[tiers.length - 1]
  if (!lastTier) return null

  const points = [{ min: 1, discount: 0 }, ...tiers]
  const maxQ = lastTier.min
  const maxDiscount = lastTier.discount

  const W = 152
  const H = 44
  const padX = 7
  const padTop = 10
  const padBottom = 6
  const innerW = W - padX * 2
  const innerH = H - padTop - padBottom

  const xOf = (q: number) => padX + (innerW * (Math.min(Math.max(q, 1), maxQ) - 1)) / Math.max(1, maxQ - 1)
  const yOf = (d: number) => padTop + innerH - (innerH * d) / maxDiscount
  const baseY = padTop + innerH

  // Staircase: real discount per quantity, built point-by-point (no interpolation)
  let line = `M ${xOf(1)} ${yOf(0)}`
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1]
    const cur = points[i]
    if (!prev || !cur) continue
    line += ` L ${xOf(cur.min)} ${yOf(prev.discount)} L ${xOf(cur.min)} ${yOf(cur.discount)}`
  }
  const area = `${line} L ${xOf(maxQ)} ${baseY} L ${xOf(1)} ${baseY} Z`

  const curDiscount = discountForQty(qty, tiers)
  const curX = xOf(qty)
  const curY = yOf(curDiscount)

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width={W}
      height={H}
      className="shrink-0"
      role="img"
      aria-label={`опт до -${maxDiscount}%`}
    >
      <defs>
        <linearGradient id="wsSpark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.18" />
          <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
        </linearGradient>
      </defs>

      <path d={area} fill="url(#wsSpark)" />
      <path d={line} fill="none" stroke="var(--color-accent)" strokeWidth="1.75" strokeLinejoin="round" strokeLinecap="round" />

      {/* tier breakpoints */}
      {points.map((p) =>
        p.discount > 0 ? (
          <circle key={p.min} cx={xOf(p.min)} cy={yOf(p.discount)} r="1.5" fill="var(--color-accent)" />
        ) : null,
      )}

      {/* current quantity (real level) */}
      <line x1={curX} y1={baseY} x2={curX} y2={curY} stroke="var(--color-accent)" strokeWidth="0.75" strokeDasharray="2 2" opacity="0.45" />
      <circle cx={curX} cy={curY} r="2.6" fill="var(--color-accent)" stroke="var(--color-surface-white)" strokeWidth="1.25" />

      <text x={W - padX} y={padTop - 2} textAnchor="end" fontSize="7" fontWeight="800" fill="var(--color-accent)" opacity="0.65">
        −{maxDiscount}%
      </text>
    </svg>
  )
}
