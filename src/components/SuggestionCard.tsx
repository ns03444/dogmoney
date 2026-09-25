import { Clock } from 'lucide-react'
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
import type { SuggestionCard as SuggestionCardData } from '@/types'

export function SuggestionCard({ card }: { card: SuggestionCardData }) {
  const isParlay = card.type === 'parlay'

  return (
    <Card className="min-w-0 overflow-hidden">
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle className="truncate">{card.name}</CardTitle>
            <Badge variant={statusBadgeVariant(card.status)}>{card.status}</Badge>
            <Badge variant="outline" className="capitalize">
              {card.type}
            </Badge>
          </div>
          <CardDescription className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>{card.odds}</span>
            {card.stake != null && (
              <>
                <span aria-hidden>·</span>
                <span>Stake {formatMoney(card.stake)}</span>
              </>
            )}
            {card.toWin != null && (
              <>
                <span aria-hidden>·</span>
                <span>To win {formatMoney(card.toWin)}</span>
              </>
            )}
          </CardDescription>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant={leagueBadgeVariant(card.league)}>{card.league}</Badge>
          <Badge variant={confidenceBadgeVariant(card.confidence)}>
            {card.confidence}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {isParlay && card.legs && card.legs.length > 0 ? (
          <div className="space-y-3">
            {card.legs.map((leg, i) => (
              <div key={leg.id}>
                {i > 0 && <Separator className="mb-3" />}
                <div className="flex flex-col gap-2 rounded-lg bg-[var(--color-muted)]/50 p-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                  <div className="min-w-0 space-y-1">
                    <p className="text-base font-semibold tracking-tight">{leg.pick}</p>
                    <p className="text-sm text-[var(--color-muted-foreground)]">
                      {leg.matchup}
                    </p>
                    <p className="inline-flex items-center gap-1.5 text-xs text-[var(--color-muted-foreground)]">
                      <Clock className="h-3.5 w-3.5" />
                      {leg.when}
                      {leg.odds ? ` · ${leg.odds}` : ''}
                    </p>
                  </div>
                  <Badge variant={confidenceBadgeVariant(leg.confidence)}>
                    {leg.confidence}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg bg-[var(--color-muted)]/50 p-3 sm:p-4">
            <p className="text-base font-semibold tracking-tight">
              {card.pick ?? card.name}
            </p>
            {card.matchup && (
              <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
                {card.matchup}
              </p>
            )}
            <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-[var(--color-muted-foreground)]">
              <Clock className="h-3.5 w-3.5" />
              {card.when}
            </p>
          </div>
        )}

        <p className="text-sm leading-relaxed text-[var(--color-muted-foreground)]">
          {card.rationale}
        </p>
      </CardContent>
    </Card>
  )
}

export function SuggestionCardList({
  cards,
  emptyNote,
}: {
  cards: SuggestionCardData[]
  emptyNote?: string
}) {
  if (cards.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-sm text-[var(--color-muted-foreground)]">
          {emptyNote ?? 'No suggestions this week.'}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-3 md:gap-4">
      {cards.map((card) => (
        <SuggestionCard key={card.id} card={card} />
      ))}
    </div>
  )
}

/** Compact preview row for dashboard teaser */
export function SuggestionPreviewCard({ card }: { card: SuggestionCardData }) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-4">
      <div className="min-w-0 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-semibold tracking-tight">{card.name}</p>
          <Badge variant="outline" className="capitalize text-[10px]">
            {card.type}
          </Badge>
        </div>
        <p className="text-sm text-[var(--color-muted-foreground)]">
          {card.type === 'parlay' && card.legs
            ? card.legs.map((l) => l.pick).join(' · ')
            : (card.pick ?? card.matchup)}
        </p>
        <p className="inline-flex items-center gap-1.5 text-xs text-[var(--color-muted-foreground)]">
          <Clock className="h-3.5 w-3.5" />
          {card.when} · {card.odds}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Badge variant={leagueBadgeVariant(card.league)}>{card.league}</Badge>
        <Badge variant={confidenceBadgeVariant(card.confidence)}>
          {card.confidence}
        </Badge>
      </div>
    </div>
  )
}
