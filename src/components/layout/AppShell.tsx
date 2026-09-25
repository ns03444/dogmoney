import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import week from '@/data/week.json'

const titles: Record<string, { title: string; subtitle?: string }> = {
  '/': { title: 'Dashboard', subtitle: week.focusDay },
  '/ncaaf': { title: 'NCAAF', subtitle: 'CFB · Saturday slate' },
  '/nfl': { title: 'NFL', subtitle: week.nfl.label },
  '/history': { title: 'History', subtitle: 'Past weeks' },
}

export function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const { pathname } = useLocation()
  const meta = titles[pathname] ?? { title: 'Weekly Card' }

  return (
    <div className="flex min-h-dvh w-full bg-[var(--color-muted)]/30 dark:bg-[var(--color-background)]">
      <Sidebar
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        collapsed={collapsed}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          title={meta.title}
          subtitle={meta.subtitle}
          onMenuClick={() => setMobileOpen(true)}
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((c) => !c)}
        />

        <main className="flex-1 overflow-x-hidden pb-safe">
          <div className="mx-auto w-full max-w-[1400px] px-3 py-3 sm:px-4 sm:py-4 md:px-5 md:py-5 lg:px-6 lg:py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
