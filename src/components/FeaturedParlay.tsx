import { Link } from 'react-router-dom'
import { ArrowRight, Clock } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Badge,
  confidenceBadgeVariant,
  leagueBadgeVariant,
  statusBadgeVariant,
} from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { formatMoney } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { Parlay } from '@/types'

export function FeaturedParlay({
  parlay,
  detailed = false,
}: {
  parlay: Parlay
  detailed?: boolean
}) {
  return (
    <Card className="min-w-0 overflow-hidden">
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle>{parlay.name}</CardTitle>
            <Badge variant={statusBadgeVariant(parlay.status)}>{parlay.status}</Badge>
          </div>
          <CardDescription>
            Combined {parlay.combinedOdds} · Stake {formatMoney(parlay.stake)} · To win{' '}
            {formatMoney(parlay.toWin)}
          </CardDescription>
        </div>
        {!detailed && (
          <Link
            to="/card"
            className={cn(
              'inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-[var(--color-border)] px-4 text-sm font-medium transition-colors',
              'hover:bg-[var(--color-accent)] sm:w-auto md:min-h-9',
            )}
          >
            View card
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {parlay.legs.map((leg, i) => (
          <div key={leg.id}>
            {i > 0 && <Separator className="mb-3" />}
            <div className="flex flex-col gap-2 rounded-lg bg-[var(--color-muted)]/50 p-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-4">
              <div className="min-w-0 space-y-1">
                <p className="text-base font-semibold tracking-tight">{leg.pick}</p>
                <p className="text-sm text-[var(--color-muted-foreground)]">
                  {leg.matchup}
                </p>
                <p className="inline-flex items-center gap-1.5 text-xs text-[var(--color-muted-foreground)]">
                  <Clock className="h-3.5 w-3.5" />
                  {leg.when}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant={leagueBadgeVariant(leg.league)}>{leg.league}</Badge>
                <Badge variant={confidenceBadgeVariant(leg.confidence)}>
                  {leg.confidence}
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
