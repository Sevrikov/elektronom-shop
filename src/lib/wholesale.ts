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

/** Highest applicable wholesale discount (%) for a quantity (0 if none applies). */
export function discountForQty(qty: number, tiers: WholesaleTier[]): number {
  let d = 0
  for (const tier of tiers) {
    if (qty >= tier.min && tier.discount > d) d = tier.discount
  }
  return d
}
