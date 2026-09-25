import type { ComponentType } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  CircleDot,
  X,
  ListOrdered,
  Ticket,
  UserRound,
  LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/AuthContext'
import { useSportsbook } from '@/context/SportsbookContext'
import { formatMoney } from '@/lib/odds'

const primaryNav = [
  { to: '/', label: 'NFL Lines', icon: ListOrdered, end: true },
  { to: '/bets', label: 'My Bets', icon: Ticket },
  { to: '/account', label: 'Account', icon: UserRound },
]

interface SidebarProps {
  open: boolean
  onClose: () => void
  collapsed?: boolean
}

function NavItem({
  to,
  label,
  icon: Icon,
  end,
  collapsed,
  onClose,
  badge,
}: {
  to: string
  label: string
  icon: ComponentType<{ className?: string }>
  end?: boolean
  collapsed: boolean
  onClose: () => void
  badge?: number
}) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClose}
      title={label}
      className={({ isActive }) =>
        cn(
          'flex min-h-10 items-center gap-3 rounded-md px-2.5 text-sm font-medium transition-colors',
          collapsed && 'lg:justify-center lg:px-0',
          isActive
            ? 'bg-emerald-600/15 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
            : 'text-[var(--color-muted-foreground)] hover:bg-[var(--color-sidebar-accent)] hover:text-[var(--color-foreground)]',
        )
      }
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className={cn('flex-1', collapsed && 'lg:hidden')}>{label}</span>
      {badge != null && badge > 0 && (
        <span
          className={cn(
            'rounded-full bg-emerald-600 px-1.5 py-0.5 text-[10px] font-bold text-white',
            collapsed && 'lg:hidden',
          )}
        >
          {badge}
        </span>
      )}
    </NavLink>
  )
}

export function Sidebar({ open, onClose, collapsed = false }: SidebarProps) {
  const { username, logout } = useAuth()
  const { balance, openBetCount } = useSportsbook()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    onClose()
    navigate('/login', { replace: true })
  }

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px] transition-opacity lg:hidden',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={onClose}
        aria-hidden={!open}
      />

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex flex-col border-r border-[var(--color-sidebar-border)] bg-[var(--color-sidebar)] text-[var(--color-sidebar-foreground)] transition-transform duration-200 ease-out',
          'w-[min(16rem,85vw)]',
          open ? 'translate-x-0' : '-translate-x-full',
          'lg:static lg:z-auto lg:translate-x-0',
          collapsed ? 'lg:w-14' : 'lg:w-56',
        )}
      >
        <div className="flex h-12 items-center justify-between gap-2 border-b border-[var(--color-sidebar-border)] px-3 lg:h-14">
          <div className="flex min-w-0 items-center gap-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-emerald-600 text-white shadow-sm">
              <CircleDot className="h-3.5 w-3.5" />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold tracking-tight">
                  dogmoney
                </div>
                <div className="truncate text-[10px] font-medium uppercase tracking-wider text-[var(--color-muted-foreground)]">
                  NFL Sportsbook
                </div>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {!collapsed && (
          <div className="border-b border-[var(--color-sidebar-border)] px-3 py-2.5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-muted-foreground)]">
              Balance
            </p>
            <p className="text-lg font-bold tabular-nums text-emerald-700 dark:text-emerald-400">
              {formatMoney(balance)}
            </p>
          </div>
        )}

        <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-2">
          {primaryNav.map((item) => (
            <NavItem
              key={item.to}
              {...item}
              collapsed={collapsed}
              onClose={onClose}
              badge={item.to === '/bets' ? openBetCount : undefined}
            />
          ))}
        </nav>

        <div className="border-t border-[var(--color-sidebar-border)] p-2">
          {!collapsed ? (
            <div className="flex items-center gap-2 rounded-md bg-[var(--color-sidebar-accent)] px-2.5 py-2">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600/20 text-xs font-bold uppercase text-emerald-700 dark:text-emerald-300">
                {(username ?? 'a').slice(0, 1)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold">{username ?? 'admin'}</p>
                <p className="truncate text-[10px] text-[var(--color-muted-foreground)]">
                  Demo
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 md:h-8 md:w-8 md:min-h-8 md:min-w-8"
                onClick={handleLogout}
                aria-label="Log out"
                title="Log out"
              >
                <LogOut className="h-3.5 w-3.5" />
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="hidden w-full lg:inline-flex"
              onClick={handleLogout}
              aria-label="Log out"
              title="Log out"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          )}
        </div>
      </aside>
    </>
  )
}
