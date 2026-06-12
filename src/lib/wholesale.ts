export interface WholesaleTier {
  min: number
  discount: number
}

/** Valid, sorted tiers (min > 1, discount > 0), ascending by min. */
export function normalizeTiers(breaks: WholesaleTier[]): WholesaleTier[] {
  return breaks
    .filter((b) => b.min > 1 && b.discount > 0)
    .sort((a, b) => a.min - b.min)
}

/**
 * Wholesale discount (%) for a quantity — flexible model: linear interpolation
 * between the points (1, 0%) and the tier points, so intermediate quantities get
 * a real proportional discount (no fake step). Capped at the last tier's discount.
 */
export function discountForQty(qty: number, tiers: WholesaleTier[]): number {
  if (tiers.length === 0 || qty <= 1) return 0
  const sorted = [...tiers].sort((a, b) => a.min - b.min)
  const points = [{ min: 1, discount: 0 }, ...sorted]
  const last = points[points.length - 1]
  if (!last) return 0
  if (qty >= last.min) return last.discount

  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1]
    const cur = points[i]
    if (!prev || !cur) continue
    if (qty < cur.min) {
      const ratio = (qty - prev.min) / (cur.min - prev.min)
      return Math.round(prev.discount + (cur.discount - prev.discount) * ratio)
    }
  }
  return last.discount
}
