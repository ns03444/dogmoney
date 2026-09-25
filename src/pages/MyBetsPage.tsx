import { Link } from 'react-router-dom'
import { Ticket } from 'lucide-react'
import { useSportsbook } from '@/context/SportsbookContext'
import { Badge, statusBadgeVariant } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatAmerican, formatMoney } from '@/lib/odds'
import type { PlacedBet } from '@/types'

function BetCard({ bet }: { bet: PlacedBet }) {
  const placed = new Date(bet.placedAt)
  const when = placed.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'America/New_York',
  })

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between gap-3 space-y-0 pb-2">
        <div>
          <CardTitle className="text-sm sm:text-base">
            {bet.type === 'parlay'
              ? `${bet.legs.length}-Leg Parlay`
              : 'Single'}
          </CardTitle>
          <p className="mt-1 text-[11px] text-[var(--color-muted-foreground)]">
            {when} ET · {formatAmerican(bet.odds)}
          </p>
        </div>
        <Badge variant={statusBadgeVariant(bet.status)}>{bet.status}</Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        <ul className="space-y-1.5">
          {bet.legs.map((leg) => (
            <li
              key={leg.id}
              className="flex items-center justify-between gap-2 rounded-md bg-[var(--color-muted)]/40 px-2.5 py-1.5 text-sm"
            >
              <span className="min-w-0 truncate">
                <span className="font-medium">{leg.label}</span>
                <span className="ml-1.5 text-xs text-[var(--color-muted-foreground)]">
                  {leg.away}@{leg.home}
                </span>
              </span>
              <span className="shrink-0 tabular-nums text-xs font-semibold">
                {formatAmerican(leg.odds)}
              </span>
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-4 border-t border-[var(--color-border)] pt-3 text-sm">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-muted-foreground)]">
              Stake
            </p>
            <p className="font-semibold tabular-nums">{formatMoney(bet.stake)}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-muted-foreground)]">
              To win
            </p>
            <p className="font-semibold tabular-nums text-emerald-700 dark:text-emerald-400">
              {formatMoney(bet.toWin)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function MyBetsPage() {
  const { bets } = useSportsbook()
  const open = bets.filter((b) => b.status === 'Open')
  const settled = bets.filter((b) => b.status !== 'Open')

  if (bets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <Ticket className="h-10 w-10 text-[var(--color-muted-foreground)]/40" />
        <h2 className="text-lg font-semibold">No bets yet</h2>
        <p className="max-w-sm text-sm text-[var(--color-muted-foreground)]">
          Head to the lines board, add selections to your slip, and place a demo
          paper bet.
        </p>
        <Link
          to="/"
          className="mt-2 inline-flex h-11 items-center justify-center rounded-md bg-emerald-600 px-4 text-sm font-medium text-white hover:bg-emerald-500"
        >
          View NFL Lines
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold tracking-tight sm:text-xl">My Bets</h2>
        <p className="mt-0.5 text-sm text-[var(--color-muted-foreground)]">
          Open and settled paper wagers stored in this browser
        </p>
      </div>

      <section className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted-foreground)]">
          Open ({open.length})
        </h3>
        {open.length === 0 ? (
          <p className="text-sm text-[var(--color-muted-foreground)]">No open bets.</p>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {open.map((b) => (
              <BetCard key={b.id} bet={b} />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted-foreground)]">
          Settled ({settled.length})
        </h3>
        {settled.length === 0 ? (
          <p className="text-sm text-[var(--color-muted-foreground)]">
            Settled bets will appear here after outcomes are marked (demo stays Open).
          </p>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {settled.map((b) => (
              <BetCard key={b.id} bet={b} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
