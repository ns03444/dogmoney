import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Radio, Sparkles } from 'lucide-react'
import week from '@/data/nfl-week3.json'
import type { BetMode, NflGame, WeekData } from '@/types'
import { GameRow } from '@/components/sportsbook/GameRow'
import { BetSlip, BetSlipFab } from '@/components/sportsbook/BetSlip'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const data = week as WeekData
const modes: { id: BetMode; label: string; description: string }[] = [
  { id: 'straight', label: 'Straight', description: 'Single-game bets' },
  { id: 'parlay', label: 'Parlay', description: '2+ legs' },
  { id: 'teaser', label: 'Teaser', description: 'Move lines in your favor' },
  { id: 'live', label: 'Live', description: 'Coming soon' },
]
const validModes = new Set<BetMode>(modes.map((mode) => mode.id))

function groupByKickoff(games: NflGame[]) {
  const map = new Map<string, NflGame[]>()
  for (const g of games) {
    const key = g.kickoffDisplay
    const list = map.get(key) ?? []
    list.push(g)
    map.set(key, list)
  }
  return [...map.entries()]
}

export function LinesPage() {
  const [slipOpen, setSlipOpen] = useState(false)
  const [teaserPoints, setTeaserPoints] = useState(6)
  const [searchParams, setSearchParams] = useSearchParams()
  const requestedMode = searchParams.get('tab') as BetMode | null
  const mode: BetMode = requestedMode && validModes.has(requestedMode) ? requestedMode : 'straight'
  const groups = useMemo(() => groupByKickoff(data.games), [])

  function selectMode(nextMode: BetMode) {
    setSearchParams({ tab: nextMode })
  }

  return (
    <div className="space-y-4">
      <nav
        aria-label="Betting modes"
        className="-mx-1 flex overflow-x-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-1 shadow-sm sm:mx-0"
      >
        {modes.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-current={mode === item.id ? 'page' : undefined}
            onClick={() => selectMode(item.id)}
            className={cn(
              'min-w-[108px] flex-1 rounded-lg px-3 py-2 text-left transition-colors sm:min-w-0 sm:text-center',
              mode === item.id
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-[var(--color-muted-foreground)] hover:bg-emerald-500/10 hover:text-[var(--color-foreground)]',
            )}
          >
            <span className="block text-sm font-semibold">{item.label}</span>
            <span className={cn('hidden text-[10px] sm:block', mode === item.id ? 'text-white/80' : 'text-[var(--color-muted-foreground)]')}>
              {item.description}
            </span>
          </button>
        ))}
      </nav>

      <div className="flex gap-5">
        <div className="min-w-0 flex-1 space-y-5 pb-20 lg:pb-0">
          {mode === 'live' ? (
            <Card>
              <CardContent className="flex min-h-[360px] flex-col items-center justify-center px-6 py-12 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600/10 text-emerald-600">
                  <Radio className="h-7 w-7" />
                </div>
                <h2 className="text-lg font-semibold">Live betting coming soon</h2>
                <p className="mt-2 max-w-sm text-sm text-[var(--color-muted-foreground)]">
                  We are keeping live games off the board until live lines are ready. Check back soon.
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
                    NFL Lines
                  </h2>
                  {mode === 'teaser' && <Sparkles className="h-4 w-4 text-emerald-600" aria-label="Teaser mode" />}
                </div>
                <p className="mt-0.5 text-sm text-[var(--color-muted-foreground)]">
                  {mode === 'teaser'
                    ? `${data.weekLabel} · pick spreads or totals · lines adjust in your slip`
                    : `${data.weekLabel} · tap odds to build your ${mode === 'parlay' ? 'parlay' : 'slip'} · paper betting only`}
                </p>
              </div>

              {mode === 'teaser' && (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 px-3 py-2 text-xs text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/20 dark:text-emerald-200">
                  <span className="font-semibold">{teaserPoints}-point teaser:</span> select 2–4 spread or total legs. Simplified payouts are 2-leg -120, 3-leg +150, and 4-leg +200.
                </div>
              )}

              {groups.map(([label, games]) => (
                <section key={label} className="space-y-2.5">
                  <h3 className="sticky top-12 z-10 -mx-1 bg-[var(--color-muted)]/80 px-1 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-muted-foreground)] backdrop-blur-sm lg:top-14 dark:bg-[var(--color-background)]/80">
                    {label}
                  </h3>
                  <div className="space-y-2.5">
                    {games.map((g) => (
                      <GameRow key={g.id} game={g} mode={mode} />
                    ))}
                  </div>
                </section>
              ))}
            </>
          )}
        </div>

        <BetSlip mode={mode} teaserPoints={teaserPoints} onTeaserPointsChange={setTeaserPoints} />
        <BetSlip
          variant="drawer"
          mode={mode}
          teaserPoints={teaserPoints}
          onTeaserPointsChange={setTeaserPoints}
          mobileOpen={slipOpen}
          onMobileClose={() => setSlipOpen(false)}
        />
        <BetSlipFab onOpen={() => setSlipOpen(true)} />
      </div>
    </div>
  )
}
