import { Ban } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { WeekData } from '@/types'

export function Skips({ skips }: { skips: WeekData['skips'] }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Ban className="h-4 w-4 text-rose-500" />
          Skips
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {skips.map((s) => (
            <span
              key={s.pick}
              title={s.reason}
              className="inline-flex min-h-10 items-center rounded-full border border-[var(--color-border)] bg-[var(--color-muted)]/60 px-3 py-1.5 text-sm font-medium text-[var(--color-muted-foreground)]"
            >
              {s.pick}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
