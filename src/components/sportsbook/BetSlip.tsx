import { useMemo, useState } from 'react'
import { Ticket, Trash2, X } from 'lucide-react'
import { useSportsbook } from '@/context/SportsbookContext'
import type { BetMode } from '@/types'
import { Button } from '@/components/ui/button'
import { adjustTeaserLine, combineAmericanOdds, formatAmerican, formatLine, formatMoney, teaserOdds, toWinAmount } from '@/lib/odds'
import { cn } from '@/lib/utils'

interface BetSlipProps {
  mobileOpen?: boolean
  onMobileClose?: () => void
  variant?: 'panel' | 'drawer'
  mode?: BetMode
  teaserPoints?: number
  onTeaserPointsChange?: (points: number) => void
}

export function BetSlip({
  mobileOpen = false,
  onMobileClose,
  variant = 'panel',
  mode = 'straight',
  teaserPoints = 6,
  onTeaserPointsChange,
}: BetSlipProps) {
  const { slip, removeFromSlip, clearSlip, placeBet, balance } = useSportsbook()
  const [stakeInput, setStakeInput] = useState('10')
  const [error, setError] = useState<string | null>(null)
  const [justPlaced, setJustPlaced] = useState(false)

  const stake = Number(stakeInput)
  const combinedOdds = useMemo(
    () => mode === 'teaser' ? teaserOdds(slip.length, teaserPoints) : combineAmericanOdds(slip.map((l) => l.odds)),
    [slip, mode, teaserPoints],
  )
  const toWin = useMemo(
    () => (Number.isFinite(stake) && stake > 0 ? toWinAmount(stake, combinedOdds) : 0),
    [stake, combinedOdds],
  )
  const betType = mode === 'teaser' ? 'Teaser' : mode === 'parlay' ? 'Parlay' : 'Straight'
  const modeLabel = mode === 'teaser' ? `${teaserPoints}-point teaser` : mode === 'parlay' ? 'multi-leg parlay' : mode === 'straight' ? 'single bet' : 'live betting'

  function handlePlace() {
    setError(null)
    setJustPlaced(false)
    const result = placeBet(Number.isFinite(stake) ? stake : 0, mode, teaserPoints)
    if (!result.ok) {
      setError(result.error)
      return
    }
    setJustPlaced(true)
    setStakeInput('10')
    onMobileClose?.()
  }

  function displayLeg(leg: (typeof slip)[number]) {
    if (mode !== 'teaser' || leg.line == null) return { label: leg.label, line: undefined }
    const adjusted = adjustTeaserLine(leg.line, leg.side, teaserPoints)
    if (leg.market === 'spread') {
      return { label: `${leg.side === 'away' ? leg.away : leg.home} ${formatLine(adjusted)}`, line: adjusted }
    }
    return { label: `${leg.side === 'over' ? 'Over' : 'Under'} ${formatLine(adjusted)}`, line: adjusted }
  }

  const modeError = mode === 'straight' && slip.length > 1
    ? 'Switch to Parlay for multi-leg, or remove selections until one leg remains.'
    : mode === 'parlay' && slip.length < 2
      ? 'Parlay mode requires 2+ legs.'
      : mode === 'teaser' && (slip.length < 2 || slip.length > 4)
        ? 'Teaser mode requires 2–4 spread or total legs.'
        : mode === 'teaser' && slip.some((leg) => leg.market === 'moneyline')
          ? 'Remove moneyline legs to place this teaser.'
          : null

  const body = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-2 border-b border-[var(--color-border)] px-4 py-3">
        <div className="flex items-center gap-2">
          <Ticket className="h-4 w-4 text-emerald-600" />
          <div>
            <h2 className="text-sm font-semibold">Bet Slip</h2>
            <p className="text-[10px] capitalize text-[var(--color-muted-foreground)]">{modeLabel}</p>
          </div>
          {slip.length > 0 && (
            <span className="rounded-full bg-emerald-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
              {slip.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {slip.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-xs text-[var(--color-muted-foreground)]"
              onClick={() => {
                clearSlip()
                setError(null)
              }}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear
            </Button>
          )}
          {variant === 'drawer' && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onMobileClose}
              aria-label="Close slip"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3">
        {mode === 'teaser' && (
          <div className="mb-3 rounded-lg border border-emerald-200 bg-emerald-50/60 p-2.5 dark:border-emerald-900/60 dark:bg-emerald-950/20">
            <label className="flex items-center justify-between gap-2 text-xs font-semibold">
              Teaser points
              <select
                value={teaserPoints}
                onChange={(event) => onTeaserPointsChange?.(Number(event.target.value))}
                className="rounded-md border border-[var(--color-input)] bg-[var(--color-background)] px-2 py-1 text-xs outline-none focus:border-emerald-500"
              >
                {[6, 6.5, 7].map((points) => <option key={points} value={points}>{points} pts</option>)}
              </select>
            </label>
            <p className="mt-1 text-[10px] text-[var(--color-muted-foreground)]">Simplified demo payouts: 2-leg -120 · 3-leg +150 · 4-leg +200.</p>
          </div>
        )}
        {slip.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 px-4 py-10 text-center">
            <Ticket className="h-8 w-8 text-[var(--color-muted-foreground)]/40" />
            <p className="text-sm font-medium text-[var(--color-muted-foreground)]">
              Your slip is empty
            </p>
            <p className="text-xs text-[var(--color-muted-foreground)]">
              Tap Spread, Moneyline, or Total odds on the board to add a leg.
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-2">
            {slip.map((leg) => (
              <li
                key={leg.id}
                className="rounded-lg border border-[var(--color-border)] bg-[var(--color-muted)]/30 p-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs text-[var(--color-muted-foreground)]">
                      {leg.away} @ {leg.home}
                    </p>
                    <p className="text-sm font-semibold">{displayLeg(leg).label}</p>
                    <p className="text-[11px] text-[var(--color-muted-foreground)]">
                      {leg.kickoffDisplay} · {leg.market}{mode === 'teaser' ? ' · adjusted' : ''}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-sm font-bold tabular-nums text-emerald-700 dark:text-emerald-400">
                      {formatAmerican(leg.odds)}
                    </span>
                    <button
                      type="button"
                      className="text-[10px] font-medium text-[var(--color-muted-foreground)] hover:text-rose-500"
                      onClick={() => removeFromSlip(leg.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {slip.length > 0 && (
        <div className="border-t border-[var(--color-border)] px-4 py-3 pb-safe">
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="font-medium text-[var(--color-muted-foreground)]">
              {betType} · {slip.length} leg{slip.length === 1 ? '' : 's'}
            </span>
            <span className="font-semibold tabular-nums">
              {formatAmerican(combinedOdds)}
            </span>
          </div>

          <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-[var(--color-muted-foreground)]">
            Stake
          </label>
          <div className="relative mb-2">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[var(--color-muted-foreground)]">
              $
            </span>
            <input
              type="number"
              min="0"
              step="1"
              inputMode="decimal"
              value={stakeInput}
              onChange={(e) => {
                setStakeInput(e.target.value)
                setError(null)
                setJustPlaced(false)
              }}
              className={cn(
                'flex h-11 w-full rounded-lg border border-[var(--color-input)] bg-[var(--color-background)] pl-7 pr-3 text-sm tabular-nums',
                'outline-none ring-emerald-500/40 focus:border-emerald-500 focus:ring-2',
              )}
            />
          </div>

          <div className="mb-3 flex items-center justify-between text-sm">
            <span className="text-[var(--color-muted-foreground)]">To win</span>
            <span className="font-semibold tabular-nums text-emerald-700 dark:text-emerald-400">
              {formatMoney(toWin)}
            </span>
          </div>

          <p className="mb-2 text-[11px] text-[var(--color-muted-foreground)]">
            Balance {formatMoney(balance)}
          </p>

          {modeError && (
            <p role="status" className="mb-2 rounded-md border border-amber-200 bg-amber-50 px-2.5 py-1.5 text-xs text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-300">
              {modeError}
            </p>
          )}

          {error && (
            <p
              role="alert"
              className="mb-2 rounded-md border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-xs text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300"
            >
              {error}
            </p>
          )}
          {justPlaced && (
            <p className="mb-2 rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-xs text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300">
              Bet placed — demo paper wager only.
            </p>
          )}

          <Button
            className="h-11 w-full bg-emerald-600 text-white hover:bg-emerald-500 hover:opacity-100"
            onClick={handlePlace}
            disabled={Boolean(modeError)}
          >
            Place Bet
          </Button>
        </div>
      )}
    </div>
  )

  if (variant === 'drawer') {
    return (
      <>
        <div
          className={cn(
            'fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px] transition-opacity lg:hidden',
            mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
          )}
          onClick={onMobileClose}
          aria-hidden={!mobileOpen}
        />
        <aside
          className={cn(
            'fixed inset-x-0 bottom-0 z-50 flex max-h-[85dvh] flex-col rounded-t-2xl border border-[var(--color-border)] bg-[var(--color-card)] shadow-2xl transition-transform duration-200 ease-out lg:hidden',
            mobileOpen ? 'translate-y-0' : 'translate-y-full',
          )}
        >
          {body}
        </aside>
      </>
    )
  }

  return (
    <aside className="hidden h-fit max-h-[calc(100dvh-5.5rem)] sticky top-[4.25rem] w-80 shrink-0 overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] shadow-sm lg:flex lg:flex-col">
      {body}
    </aside>
  )
}

export function BetSlipFab({
  onOpen,
}: {
  onOpen: () => void
}) {
  const { slip } = useSportsbook()
  if (slip.length === 0) return null

  return (
    <button
      type="button"
      onClick={onOpen}
      className="fixed bottom-4 right-4 z-30 flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/30 lg:hidden pb-safe"
    >
      <Ticket className="h-4 w-4" />
      Slip
      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white/20 px-1.5 text-xs font-bold">
        {slip.length}
      </span>
    </button>
  )
}
