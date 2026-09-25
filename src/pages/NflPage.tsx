import week from '@/data/week.json'
import { SuggestionCardList } from '@/components/SuggestionCard'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { WeekData } from '@/types'

const data = week as WeekData
const section = data.nfl

export function NflPage() {
  return (
    <div className="flex flex-col gap-4 md:gap-5 lg:gap-6 lg:max-w-3xl">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{section.label}</CardTitle>
          {section.focusNote && (
            <CardDescription>{section.focusNote}</CardDescription>
          )}
        </CardHeader>
        {section.emptySaturday && (
          <CardContent>
            <div className="rounded-lg border border-dashed border-[var(--color-border)] bg-[var(--color-muted)]/40 px-4 py-3 text-sm text-[var(--color-muted-foreground)]">
              No NFL games on Saturday Sep 26. Showing Week 3 weekend picks
              (Sunday + Monday Night Football).
            </div>
          </CardContent>
        )}
      </Card>

      <SuggestionCardList cards={section.suggestions} />
    </div>
  )
}
