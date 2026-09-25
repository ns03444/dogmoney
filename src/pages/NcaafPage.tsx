import week from '@/data/week.json'
import { SuggestionCardList } from '@/components/SuggestionCard'
import { Skips } from '@/components/Skips'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { WeekData } from '@/types'

const data = week as WeekData
const section = data.ncaaf

export function NcaafPage() {
  return (
    <div className="flex flex-col gap-4 md:gap-5 lg:gap-6 lg:max-w-3xl">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{section.label}</CardTitle>
          {section.focusNote && (
            <CardDescription>{section.focusNote}</CardDescription>
          )}
        </CardHeader>
        <CardContent className="text-sm text-[var(--color-muted-foreground)]">
          {data.focusDay} · {section.suggestions.length} suggestion
          {section.suggestions.length === 1 ? '' : 's'}
        </CardContent>
      </Card>

      <SuggestionCardList cards={section.suggestions} />

      <Skips skips={section.skips ?? data.skips} />
    </div>
  )
}
