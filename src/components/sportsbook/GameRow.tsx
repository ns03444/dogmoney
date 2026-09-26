import type { BetMode, NflGame } from '@/types'
import { Badge } from '@/components/ui/badge'
import { OddsPill } from './OddsPill'
import { useSportsbook } from '@/context/SportsbookContext'
import { cn } from '@/lib/utils'

interface GameRowProps {
  game: NflGame
  mode?: BetMode
}

export function GameRow({ game, mode = 'straight' }: GameRowProps) {
  const { addToSlip, isOnSlip } = useSportsbook()
  const locked = game.status !== 'open'
  const teaserMoneyline = mode === 'teaser'
  const { spread, moneyline, total } = game.markets

  return (
    <div
      className={cn(
        'rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-3 shadow-sm sm:p-4',
        locked && 'opacity-70',
      )}
    >
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold tracking-tight sm:text-base">
              <span className="text-[var(--color-muted-foreground)]">{game.away}</span>
              <span className="mx-1.5 text-[var(--color-muted-foreground)]">@</span>
              <span>{game.home}</span>
            </p>
            {game.note && (
              <Badge variant="secondary" className="text-[10px]">
                {game.note}
              </Badge>
            )}
            {game.status === 'final' && (
              <Badge variant="lost" className="text-[10px] uppercase">
                Final
              </Badge>
            )}
            {game.status === 'locked' && (
              <Badge variant="secondary" className="text-[10px] uppercase">
                Locked
              </Badge>
            )}
          </div>
          <p className="mt-0.5 text-[11px] text-[var(--color-muted-foreground)] sm:text-xs">
            {game.awayName} at {game.homeName} · {game.kickoffDisplay}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div>
          <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-muted-foreground)]">
            Spread
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            <OddsPill
              label={game.away}
              line={spread.awayLine}
              odds={spread.awayOdds}
              selected={isOnSlip(game.id, 'spread', 'away')}
              disabled={locked}
              onClick={() => addToSlip(game, 'spread', 'away')}
            />
            <OddsPill
              label={game.home}
              line={spread.homeLine}
              odds={spread.homeOdds}
              selected={isOnSlip(game.id, 'spread', 'home')}
              disabled={locked}
              onClick={() => addToSlip(game, 'spread', 'home')}
            />
          </div>
        </div>

        <div>
          <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-muted-foreground)]">
            Moneyline{teaserMoneyline ? ' · teaser unavailable' : ''}
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            <OddsPill
              label={game.away}
              odds={moneyline.away}
              selected={isOnSlip(game.id, 'moneyline', 'away')}
              disabled={locked || teaserMoneyline}
              onClick={() => addToSlip(game, 'moneyline', 'away')}
            />
            <OddsPill
              label={game.home}
              odds={moneyline.home}
              selected={isOnSlip(game.id, 'moneyline', 'home')}
              disabled={locked || teaserMoneyline}
              onClick={() => addToSlip(game, 'moneyline', 'home')}
            />
          </div>
        </div>

        <div>
          <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-muted-foreground)]">
            Total {total.line}
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            <OddsPill
              label={`Over ${total.line}`}
              odds={total.overOdds}
              selected={isOnSlip(game.id, 'total', 'over')}
              disabled={locked}
              onClick={() => addToSlip(game, 'total', 'over')}
            />
            <OddsPill
              label={`Under ${total.line}`}
              odds={total.underOdds}
              selected={isOnSlip(game.id, 'total', 'under')}
              disabled={locked}
              onClick={() => addToSlip(game, 'total', 'under')}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
