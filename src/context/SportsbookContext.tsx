import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { BetMode, MarketType, NflGame, PlacedBet, SelectionSide, SlipLeg } from '@/types'
import { useAuth } from '@/context/AuthContext'
import { combineAmericanOdds, formatLine, teaserOdds, toWinAmount } from '@/lib/odds'

const BALANCE_KEY = 'dm_balance'
const BETS_KEY = 'dm_bets'
const SLIP_KEY = 'dm_slip'

function userKey(key: string, userId: string | null) {
  return `${key}_${userId ?? 'guest'}`
}
const STARTING_BALANCE = 1000

interface SportsbookContextValue {
  balance: number
  slip: SlipLeg[]
  bets: PlacedBet[]
  openBetCount: number
  addToSlip: (game: NflGame, market: MarketType, side: SelectionSide) => void
  removeFromSlip: (legId: string) => void
  clearSlip: () => void
  isOnSlip: (gameId: string, market: MarketType, side: SelectionSide) => boolean
  placeBet: (stake: number, mode: BetMode, teaserPoints?: number) =>
    { ok: true } | { ok: false; error: string }
  resetDemo: () => void
}

const SportsbookContext = createContext<SportsbookContextValue | null>(null)

function readNumber(key: string, fallback: number): number {
  try {
    const raw = localStorage.getItem(key)
    if (raw == null) return fallback
    const n = Number(raw)
    return Number.isFinite(n) ? n : fallback
  } catch {
    return fallback
  }
}

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function buildLeg(
  game: NflGame,
  market: MarketType,
  side: SelectionSide,
): SlipLeg | null {
  const { markets } = game
  let odds = 0
  let line: number | undefined
  let label = ''

  if (market === 'spread') {
    if (side === 'away') {
      odds = markets.spread.awayOdds
      line = markets.spread.awayLine
      label = `${game.away} ${formatLine(markets.spread.awayLine)}`
    } else if (side === 'home') {
      odds = markets.spread.homeOdds
      line = markets.spread.homeLine
      label = `${game.home} ${formatLine(markets.spread.homeLine)}`
    } else return null
  } else if (market === 'moneyline') {
    if (side === 'away') {
      odds = markets.moneyline.away
      label = `${game.away} ML`
    } else if (side === 'home') {
      odds = markets.moneyline.home
      label = `${game.home} ML`
    } else return null
  } else if (market === 'total') {
    if (side === 'over') {
      odds = markets.total.overOdds
      line = markets.total.line
      label = `Over ${markets.total.line}`
    } else if (side === 'under') {
      odds = markets.total.underOdds
      line = markets.total.line
      label = `Under ${markets.total.line}`
    } else return null
  }

  return {
    id: `${game.id}:${market}:${side}`,
    gameId: game.id,
    market,
    side,
    label,
    odds,
    line,
    away: game.away,
    home: game.home,
    kickoffDisplay: game.kickoffDisplay,
  }
}

export function SportsbookProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [storageUserId, setStorageUserId] = useState<string | null>(user?.id ?? null)
  const [balance, setBalance] = useState(() =>
    readNumber(userKey(BALANCE_KEY, user?.id ?? null), STARTING_BALANCE),
  )
  const [slip, setSlip] = useState<SlipLeg[]>(() =>
    readJson<SlipLeg[]>(userKey(SLIP_KEY, user?.id ?? null), []),
  )
  const [bets, setBets] = useState<PlacedBet[]>(() =>
    readJson<PlacedBet[]>(userKey(BETS_KEY, user?.id ?? null), []),
  )

  useEffect(() => {
    const userId = user?.id ?? null
    setStorageUserId(userId)
    setBalance(readNumber(userKey(BALANCE_KEY, userId), STARTING_BALANCE))
    setSlip(readJson<SlipLeg[]>(userKey(SLIP_KEY, userId), []))
    setBets(readJson<PlacedBet[]>(userKey(BETS_KEY, userId), []))
  }, [user?.id])

  useEffect(() => {
    if (!user?.id || storageUserId !== user.id) return
    try {
      localStorage.setItem(userKey(BALANCE_KEY, user.id), String(balance))
    } catch { /* ignore */ }
  }, [balance, storageUserId, user?.id])

  useEffect(() => {
    if (!user?.id || storageUserId !== user.id) return
    try {
      localStorage.setItem(userKey(SLIP_KEY, user.id), JSON.stringify(slip))
    } catch { /* ignore */ }
  }, [slip, storageUserId, user?.id])

  useEffect(() => {
    if (!user?.id || storageUserId !== user.id) return
    try {
      localStorage.setItem(userKey(BETS_KEY, user.id), JSON.stringify(bets))
    } catch { /* ignore */ }
  }, [bets, storageUserId, user?.id])

  const addToSlip = useCallback(
    (game: NflGame, market: MarketType, side: SelectionSide) => {
      if (game.status !== 'open') return
      const leg = buildLeg(game, market, side)
      if (!leg) return

      setSlip((prev) => {
        const withoutGame = prev.filter((l) => l.gameId !== game.id)
        const existingSame = prev.find((l) => l.id === leg.id)
        if (existingSame) {
          return withoutGame
        }
        return [...withoutGame, leg]
      })
    },
    [],
  )

  const removeFromSlip = useCallback((legId: string) => {
    setSlip((prev) => prev.filter((l) => l.id !== legId))
  }, [])

  const clearSlip = useCallback(() => setSlip([]), [])

  const isOnSlip = useCallback(
    (gameId: string, market: MarketType, side: SelectionSide) =>
      slip.some(
        (l) => l.gameId === gameId && l.market === market && l.side === side,
      ),
    [slip],
  )

  const placeBet = useCallback(
    (stake: number, mode: BetMode, teaserPoints = 6): { ok: true } | { ok: false; error: string } => {
      if (mode === 'live') return { ok: false, error: 'Live betting is coming soon.' }
      if (slip.length < 1) return { ok: false, error: 'Add at least one selection.' }
      if (mode === 'straight' && slip.length !== 1) {
        return { ok: false, error: 'Switch to Parlay for multi-leg bets, or remove selections until one leg remains.' }
      }
      if (mode === 'parlay' && slip.length < 2) {
        return { ok: false, error: 'Parlays require at least 2 legs.' }
      }
      if (mode === 'teaser') {
        if (slip.length < 2 || slip.length > 4) {
          return { ok: false, error: 'Teasers require 2 to 4 legs.' }
        }
        if (slip.some((leg) => leg.market === 'moneyline')) {
          return { ok: false, error: 'Teasers can only use spread and total legs.' }
        }
      }
      if (!(stake > 0)) return { ok: false, error: 'Enter a stake greater than $0.' }
      if (stake > balance)
        return { ok: false, error: 'Stake exceeds available balance.' }

      const odds = mode === 'teaser'
        ? teaserOdds(slip.length, teaserPoints)
        : combineAmericanOdds(slip.map((l) => l.odds))
      const toWin = toWinAmount(stake, odds)
      const bet: PlacedBet = {
        id: `bet_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        placedAt: new Date().toISOString(),
        type: mode === 'teaser' ? 'teaser' : slip.length >= 2 ? 'parlay' : 'single',
        teaserPoints: mode === 'teaser' ? teaserPoints : undefined,
        legs: [...slip],
        stake,
        odds,
        toWin,
        status: 'Open',
      }

      setBets((prev) => [bet, ...prev])
      setBalance((b) => Math.round((b - stake) * 100) / 100)
      setSlip([])
      return { ok: true }
    },
    [slip, balance],
  )

  const resetDemo = useCallback(() => {
    setBalance(STARTING_BALANCE)
    setBets([])
    setSlip([])
  }, [])

  const openBetCount = useMemo(
    () => bets.filter((b) => b.status === 'Open').length,
    [bets],
  )

  const value = useMemo(
    () => ({
      balance,
      slip,
      bets,
      openBetCount,
      addToSlip,
      removeFromSlip,
      clearSlip,
      isOnSlip,
      placeBet,
      resetDemo,
    }),
    [
      balance,
      slip,
      bets,
      openBetCount,
      addToSlip,
      removeFromSlip,
      clearSlip,
      isOnSlip,
      placeBet,
      resetDemo,
    ],
  )

  return (
    <SportsbookContext.Provider value={value}>
      {children}
    </SportsbookContext.Provider>
  )
}

export function useSportsbook() {
  const ctx = useContext(SportsbookContext)
  if (!ctx) throw new Error('useSportsbook must be used within SportsbookProvider')
  return ctx
}

export { STARTING_BALANCE }
