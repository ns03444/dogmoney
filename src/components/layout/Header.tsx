import { Menu, Moon, Sun, PanelLeftClose, PanelLeft, Radio } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useTheme } from '@/hooks/useTheme'
import week from '@/data/week.json'

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
  const openBets = week.stats?.openBets ?? 0
  const isLive = openBets > 0

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
          {isLive ? (
            <Badge
              variant="open"
              className="inline-flex items-center gap-1 px-1.5 py-0 text-[10px] font-semibold uppercase tracking-wide"
            >
              <Radio className="h-2.5 w-2.5 animate-pulse" />
              Live
            </Badge>
          ) : (
            <Badge
              variant="secondary"
              className="px-1.5 py-0 text-[10px] font-semibold uppercase tracking-wide"
            >
              Closed
            </Badge>
          )}
        </div>
        <p className="truncate text-[11px] text-[var(--color-muted-foreground)] sm:text-xs">
          {week.weekShort}
          {subtitle ? ` · ${subtitle}` : ''}
          {isLive ? ` · ${openBets} open` : ''}
        </p>
      </div>

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
