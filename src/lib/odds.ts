/** American odds → decimal multiplier (includes stake). */
export function americanToDecimal(american: number): number {
  if (american === 0) return 1
  if (american > 0) return 1 + american / 100
  return 1 + 100 / Math.abs(american)
}

/** Decimal multiplier → American odds. */
export function decimalToAmerican(decimal: number): number {
  if (decimal <= 1) return 0
  if (decimal >= 2) return Math.round((decimal - 1) * 100)
  return Math.round(-100 / (decimal - 1))
}

/** Profit (to-win) for a stake at American odds. */
export function toWinAmount(stake: number, american: number): number {
  if (stake <= 0 || american === 0) return 0
  if (american > 0) return (stake * american) / 100
  return (stake * 100) / Math.abs(american)
}

/** Combine American odds for a parlay (product of decimals). */
export function combineAmericanOdds(legs: number[]): number {
  if (legs.length === 0) return 0
  if (legs.length === 1) return legs[0]!
  const product = legs.reduce((acc, a) => acc * americanToDecimal(a), 1)
  return decimalToAmerican(product)
}

export function formatAmerican(odds: number): string {
  if (odds > 0) return `+${odds}`
  return String(odds)
}

export function formatLine(line: number): string {
  if (line > 0) return `+${line}`
  return String(line)
}

export function formatMoney(n: number, digits = 2): string {
  return n.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })
}


/** Move an NFL spread/total line in the bettor's favor for a teaser. */
export function adjustTeaserLine(
  line: number,
  side: 'away' | 'home' | 'over' | 'under',
  points: number,
): number {
  if (side === 'away' || side === 'over') return line + (side === 'over' ? -points : points)
  return line + (side === 'under' ? points : -points)
}

/** Simplified demo teaser payout table. */
export function teaserOdds(legs: number, _points: number): number {
  if (legs === 2) return -120
  if (legs === 3) return 150
  if (legs === 4) return 200
  return 0
}
