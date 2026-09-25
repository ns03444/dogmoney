import { useMemo, useState } from 'react'
import week from '@/data/nfl-week3.json'
import type { NflGame, WeekData } from '@/types'
import { GameRow } from '@/components/sportsbook/GameRow'
import { BetSlip, BetSlipFab } from '@/components/sportsbook/BetSlip'

const data = week as WeekData

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
  const groups = useMemo(() => groupByKickoff(data.games), [])

  return (
    <div className="flex gap-5">
      <div className="min-w-0 flex-1 space-y-5 pb-20 lg:pb-0">
        <div>
          <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
            NFL Lines
          </h2>
          <p className="mt-0.5 text-sm text-[var(--color-muted-foreground)]">
            {data.weekLabel} · tap odds to build your slip · paper betting only
          </p>
        </div>

        {groups.map(([label, games]) => (
          <section key={label} className="space-y-2.5">
            <h3 className="sticky top-12 z-10 -mx-1 bg-[var(--color-muted)]/80 px-1 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-muted-foreground)] backdrop-blur-sm lg:top-14 dark:bg-[var(--color-background)]/80">
              {label}
            </h3>
            <div className="space-y-2.5">
              {games.map((g) => (
                <GameRow key={g.id} game={g} />
              ))}
            </div>
          </section>
        ))}
      </div>

      <BetSlip />
      <BetSlip
        variant="drawer"
        mobileOpen={slipOpen}
        onMobileClose={() => setSlipOpen(false)}
      />
      <BetSlipFab onOpen={() => setSlipOpen(true)} />
    </div>
  )
}
