import { Link } from 'react-router-dom'
import { Menu, Moon, Sun, PanelLeftClose, PanelLeft, Ticket } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/hooks/useTheme'
import { useSportsbook } from '@/context/SportsbookContext'
import { formatMoney } from '@/lib/odds'
import week from '@/data/nfl-week3.json'

interface HeaderProps {
  title: string
  subtitle?: string
  onMenuClick: () => void
  collapsed: boolean
  onToggleCollapse: () => void
}

export function Header({
  title,
  subtitle,
  onMenuClick,
  collapsed,
  onToggleCollapse,
}: HeaderProps) {
  const { theme, toggle } = useTheme()
  const { balance, openBetCount } = useSportsbook()

  return (
    <header className="sticky top-0 z-30 flex h-12 shrink-0 items-center gap-2 border-b border-[var(--color-border)] bg-[var(--color-background)]/95 px-3 backdrop-blur-md sm:px-4 lg:h-14 lg:px-5">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="hidden lg:inline-flex"
        onClick={onToggleCollapse}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? (
          <PanelLeft className="h-5 w-5" />
        ) : (
          <PanelLeftClose className="h-5 w-5" />
        )}
      </Button>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="truncate text-sm font-semibold tracking-tight sm:text-base">
            {title}
          </h1>
        </div>
        <p className="truncate text-[11px] text-[var(--color-muted-foreground)] sm:text-xs">
          {week.weekShort}
          {subtitle ? ` · ${subtitle}` : ''}
        </p>
      </div>

      <Link
        to="/bets"
        className="hidden items-center gap-1.5 rounded-lg border border-[var(--color-border)] px-2.5 py-1.5 text-xs font-medium transition-colors hover:bg-[var(--color-accent)] sm:inline-flex"
      >
        <Ticket className="h-3.5 w-3.5" />
        My Bets
        {openBetCount > 0 && (
          <span className="rounded-full bg-emerald-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
            {openBetCount}
          </span>
        )}
      </Link>

      <Link
        to="/account"
        className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600/15 px-2.5 py-1.5 text-sm font-bold tabular-nums text-emerald-700 transition-colors hover:bg-emerald-600/25 dark:text-emerald-300"
        title="Account & balance"
      >
        {formatMoney(balance)}
      </Link>

      <Button
        variant="ghost"
        size="icon"
        onClick={toggle}
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? (
          <Sun className="h-4 w-4" />
        ) : (
          <Moon className="h-4 w-4" />
        )}
      </Button>
    </header>
  )
}
