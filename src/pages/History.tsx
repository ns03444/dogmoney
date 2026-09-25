import week from '@/data/week.json'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge, statusBadgeVariant } from '@/components/ui/badge'
import { formatMoney } from '@/lib/utils'
import type { WeekData } from '@/types'
import { cn } from '@/lib/utils'

const data = week as WeekData

export function History() {
  return (
    <div className="flex flex-col gap-4 md:gap-5">
      <Card>
        <CardHeader>
          <CardTitle>Past weeks</CardTitle>
          <CardDescription>Placeholder rows — replace as weeks settle</CardDescription>
        </CardHeader>
        <CardContent className="p-0 sm:p-0 md:p-0">
          {/* Mobile cards */}
          <div className="flex flex-col gap-3 p-4 md:hidden">
            {data.history.map((row) => (
              <div
                key={row.week}
                className="rounded-lg border border-[var(--color-border)] p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium">{row.week}</p>
                    <p className="text-xs text-[var(--color-muted-foreground)]">
                      {row.label}
                    </p>
                  </div>
                  <Badge variant={statusBadgeVariant(row.status)}>{row.status}</Badge>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <p className="text-xs text-[var(--color-muted-foreground)]">Risked</p>
                    <p className="font-medium">{formatMoney(row.risked)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--color-muted-foreground)]">P/L</p>
                    <p
                      className={cn(
                        'font-medium',
                        row.pnl > 0 && 'text-emerald-600 dark:text-emerald-400',
                        row.pnl < 0 && 'text-rose-600 dark:text-rose-400',
                      )}
                    >
                      {row.pnl > 0 ? '+' : ''}
                      {formatMoney(row.pnl)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--color-muted-foreground)]">Record</p>
                    <p className="font-medium">{row.record}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)] text-left text-[var(--color-muted-foreground)]">
                  <th className="px-6 py-3 font-medium">Week</th>
                  <th className="px-6 py-3 font-medium">Label</th>
                  <th className="px-6 py-3 font-medium">Risked</th>
                  <th className="px-6 py-3 font-medium">P/L</th>
                  <th className="px-6 py-3 font-medium">Record</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.history.map((row) => (
                  <tr
                    key={row.week}
                    className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-muted)]/40"
                  >
                    <td className="px-6 py-4 font-medium">{row.week}</td>
                    <td className="px-6 py-4 text-[var(--color-muted-foreground)]">
                      {row.label}
                    </td>
                    <td className="px-6 py-4">{formatMoney(row.risked)}</td>
                    <td
                      className={cn(
                        'px-6 py-4 font-medium',
                        row.pnl > 0 && 'text-emerald-600 dark:text-emerald-400',
                        row.pnl < 0 && 'text-rose-600 dark:text-rose-400',
                      )}
                    >
                      {row.pnl > 0 ? '+' : ''}
                      {formatMoney(row.pnl)}
                    </td>
                    <td className="px-6 py-4">{row.record}</td>
                    <td className="px-6 py-4">
                      <Badge variant={statusBadgeVariant(row.status)}>{row.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
