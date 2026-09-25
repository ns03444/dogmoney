import { cn } from '@/lib/utils'
import { formatAmerican, formatLine } from '@/lib/odds'

interface OddsPillProps {
  label: string
  odds: number
  line?: number
  selected?: boolean
  disabled?: boolean
  onClick?: () => void
}

export function OddsPill({
  label,
  odds,
  line,
  selected,
  disabled,
  onClick,
}: OddsPillProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'flex min-h-11 w-full flex-col items-center justify-center gap-0.5 rounded-lg border px-1.5 py-1.5 text-center transition-colors',
        'md:min-h-10',
        disabled
          ? 'cursor-not-allowed opacity-40'
          : selected
            ? 'border-emerald-500 bg-emerald-600 text-white shadow-sm shadow-emerald-600/25'
            : 'border-[var(--color-border)] bg-[var(--color-muted)]/40 hover:border-emerald-500/60 hover:bg-emerald-500/10',
      )}
    >
      <span
        className={cn(
          'text-[10px] font-medium leading-tight sm:text-[11px]',
          selected ? 'text-white/85' : 'text-[var(--color-muted-foreground)]',
        )}
      >
        {label}
        {line != null ? ` ${formatLine(line)}` : ''}
      </span>
      <span
        className={cn(
          'text-xs font-semibold tabular-nums sm:text-sm',
          selected ? 'text-white' : 'text-[var(--color-foreground)]',
        )}
      >
        {formatAmerican(odds)}
      </span>
    </button>
  )
}
