export type GameStatus = 'open' | 'locked' | 'final'
export type MarketType = 'spread' | 'moneyline' | 'total'
export type SelectionSide = 'away' | 'home' | 'over' | 'under'
export type BetStatus = 'Open' | 'Won' | 'Lost' | 'Push' | 'Void'
export type BetMode = 'straight' | 'parlay' | 'teaser' | 'live'

export interface SpreadMarket {
  awayLine: number
  homeLine: number
  awayOdds: number
  homeOdds: number
}

export interface MoneylineMarket {
  away: number
  home: number
}

export interface TotalMarket {
  line: number
  overOdds: number
  underOdds: number
}

export interface GameMarkets {
  spread: SpreadMarket
  moneyline: MoneylineMarket
  total: TotalMarket
}

export interface NflGame {
  id: string
  away: string
  home: string
  awayName: string
  homeName: string
  kickoff: string
  kickoffDisplay: string
  status: GameStatus
  note?: string
  markets: GameMarkets
}

export interface WeekData {
  weekLabel: string
  weekShort: string
  games: NflGame[]
}

export interface SlipLeg {
  id: string
  gameId: string
  market: MarketType
  side: SelectionSide
  label: string
  odds: number
  line?: number
  away: string
  home: string
  kickoffDisplay: string
}

export interface PlacedBet {
  id: string
  placedAt: string
  type: 'single' | 'parlay' | 'teaser'
  teaserPoints?: number
  legs: SlipLeg[]
  stake: number
  odds: number
  toWin: number
  status: BetStatus
}
