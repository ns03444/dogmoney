import type { HTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-[var(--color-primary)] text-[var(--color-primary-foreground)]',
        secondary:
          'border-transparent bg-[var(--color-secondary)] text-[var(--color-secondary-foreground)]',
        outline: 'text-[var(--color-foreground)]',
        open: 'border-transparent bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300',
        won: 'border-transparent bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
        lost: 'border-transparent bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300',
      },
    },
    defaultVariants: { variant: 'secondary' },
  },
)

export function Badge({
  className,
  variant,
  ...props
}: HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export function statusBadgeVariant(status: string) {
  const s = status.toLowerCase()
  if (s === 'open') return 'open' as const
  if (s === 'won') return 'won' as const
  if (s === 'lost') return 'lost' as const
  return 'secondary' as const
}
