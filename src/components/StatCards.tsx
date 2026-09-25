import { DollarSign, Target, Trophy, Layers } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { formatMoney } from '@/lib/utils'
import type { WeekData } from '@/types'

const items = [
  {
    key: 'risked' as const,
    label: 'Risked',
    icon: DollarSign,
    tone: 'bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300',
    format: (s: WeekData['stats']) => formatMoney(s.risked),
  },
  {
    key: 'toWin' as const,
    label: 'To win',
    icon: Target,
    tone: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
    format: (s: WeekData['stats']) => formatMoney(s.toWin),
  },
  {
    key: 'record' as const,
    label: 'Record',
    icon: Trophy,
    tone: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
    format: (s: WeekData['stats']) => s.record,
  },
  {
    key: 'openBets' as const,
    label: 'Open bets',
    icon: Layers,
    tone: 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300',
    format: (s: WeekData['stats']) => String(s.openBets),
  },
]

export function StatCards({ stats }: { stats: WeekData['stats'] }) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4 lg:gap-4">
      {items.map(({ label, icon: Icon, tone, format }) => (
        <Card key={label} className="overflow-hidden">
          <CardContent className="flex items-center gap-3 p-4 sm:p-5">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${tone}`}
            >
              <Icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-[var(--color-muted-foreground)] sm:text-sm">
                {label}
              </p>
              <p className="truncate text-xl font-semibold tracking-tight sm:text-2xl">
                {format(stats)}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
