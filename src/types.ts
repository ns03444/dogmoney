export type Confidence = 'High' | 'Medium' | 'Low'
export type BetStatus = 'Open' | 'Won' | 'Lost' | 'Push' | 'Settled'
export type SuggestionType = 'parlay' | 'straight'
export type League = 'NFL' | 'CFB' | 'NCAAF' | string

export interface Leg {
  id: string
  pick: string
  matchup: string
  when: string
  league: League
  confidence: Confidence
  odds?: string
}

export interface Parlay {
  id: string
  name: string
  combinedOdds: string
  stake: number
  toWin: number
  status: BetStatus
  legs: Leg[]
}

export interface SuggestionCard {
  id: string
  name: string
  type: SuggestionType
  pick?: string
  legs?: Leg[]
  matchup?: string
  when: string
  odds: string
  stake?: number
  toWin?: number
  confidence: Confidence
  rationale: string
  status: BetStatus
  league: League
}

export interface LeagueSection {
  label: string
  focusNote?: string
  emptySaturday?: boolean
  suggestions: SuggestionCard[]
  skips?: { pick: string; reason: string }[]
}

export interface WeekData {
  weekLabel: string
  weekShort: string
  focusDay: string
  stats: {
    risked: number
    toWin: number
    record: string
    openBets: number
  }
  weeklyPnL: { day: string; pnl: number }[]
  stakeDistribution: { name: string; value: number; fill: string }[]
  ncaaf: LeagueSection
  nfl: LeagueSection
  /** @deprecated Prefer ncaaf / nfl suggestion lists */
  featuredParlay?: Parlay
  skips: { pick: string; reason: string }[]
  history: {
    week: string
    label: string
    risked: number
    pnl: number
    record: string
    status: string
  }[]
}
