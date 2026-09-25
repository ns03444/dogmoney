import { Link } from 'react-router-dom'
import { ArrowRight, CalendarDays } from 'lucide-react'
import week from '@/data/week.json'
import { StatCards } from '@/components/StatCards'
import { PnLChart, StakeChart } from '@/components/PnLChart'
import { SuggestionPreviewCard } from '@/components/SuggestionCard'
import { Skips } from '@/components/Skips'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { WeekData } from '@/types'

const data = week as WeekData
const topNcaaf = data.ncaaf.suggestions.slice(0, 3)
const nflTeaser = data.nfl.suggestions.slice(0, 2)

export function Dashboard() {
  return (
    <div className="flex flex-col gap-4 md:gap-5 lg:gap-6">
      <Card className="overflow-hidden border-emerald-200/80 bg-gradient-to-br from-emerald-50/80 to-transparent dark:border-emerald-900/50 dark:from-emerald-950/40">
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-center gap-2">
            <CalendarDays className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <CardTitle>Saturday focus</CardTitle>
          </div>
          <CardDescription className="text-base font-medium text-[var(--color-foreground)]">
            {data.focusDay}
          </CardDescription>
          <CardDescription>{data.weekLabel}</CardDescription>
        </CardHeader>
      </Card>

      <StatCards stats={data.stats} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5 lg:gap-6">
        <div className="lg:col-span-3">
          <PnLChart data={data.weeklyPnL} />
        </div>
        <div className="lg:col-span-2">
          <StakeChart data={data.stakeDistribution} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle>Top NCAAF suggestions</CardTitle>
              <CardDescription>{data.ncaaf.focusNote}</CardDescription>
            </div>
            <Link
              to="/ncaaf"
              className={cn(
                'inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-[var(--color-border)] px-4 text-sm font-medium transition-colors',
                'hover:bg-[var(--color-accent)] sm:w-auto md:min-h-9',
              )}
            >
              All NCAAF
              <ArrowRight className="h-4 w-4" />
            </Link>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {topNcaaf.map((card) => (
              <SuggestionPreviewCard key={card.id} card={card} />
            ))}
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <CardTitle className="text-base">NFL weekend</CardTitle>
                <CardDescription>
                  {data.nfl.emptySaturday
                    ? 'No Sat slate — Sun/MNF'
                    : data.nfl.label}
                </CardDescription>
              </div>
              <Link
                to="/nfl"
                className={cn(
                  'inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-md border border-[var(--color-border)] px-3 text-sm font-medium transition-colors',
                  'hover:bg-[var(--color-accent)] sm:w-auto',
                )}
              >
                NFL
                <ArrowRight className="h-4 w-4" />
              </Link>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {nflTeaser.map((card) => (
                <SuggestionPreviewCard key={card.id} card={card} />
              ))}
            </CardContent>
          </Card>

          <Skips skips={data.skips} />
        </div>
      </div>
    </div>
  )
}
