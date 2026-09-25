import { useNavigate } from 'react-router-dom'
import { LogOut, Wallet, RotateCcw } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useSportsbook, STARTING_BALANCE } from '@/context/SportsbookContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatMoney } from '@/lib/odds'

export function AccountPage() {
  const { username, logout } = useAuth()
  const { balance, bets, openBetCount, resetDemo } = useSportsbook()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="mx-auto max-w-lg space-y-5">
      <div>
        <h2 className="text-lg font-semibold tracking-tight sm:text-xl">Account</h2>
        <p className="mt-0.5 text-sm text-[var(--color-muted-foreground)]">
          Demo bankroll & session
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Wallet className="h-4 w-4 text-emerald-600" />
            <CardTitle>Balance</CardTitle>
          </div>
          <CardDescription>Paper bankroll stored in localStorage</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-3xl font-bold tabular-nums tracking-tight text-emerald-700 dark:text-emerald-400">
            {formatMoney(balance)}
          </p>
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg bg-[var(--color-muted)]/50 px-3 py-2">
              <dt className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-muted-foreground)]">
                Starting
              </dt>
              <dd className="font-semibold tabular-nums">
                {formatMoney(STARTING_BALANCE, 0)}
              </dd>
            </div>
            <div className="rounded-lg bg-[var(--color-muted)]/50 px-3 py-2">
              <dt className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-muted-foreground)]">
                Open bets
              </dt>
              <dd className="font-semibold tabular-nums">{openBetCount}</dd>
            </div>
            <div className="rounded-lg bg-[var(--color-muted)]/50 px-3 py-2">
              <dt className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-muted-foreground)]">
                Total bets
              </dt>
              <dd className="font-semibold tabular-nums">{bets.length}</dd>
            </div>
            <div className="rounded-lg bg-[var(--color-muted)]/50 px-3 py-2">
              <dt className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-muted-foreground)]">
                Signed in
              </dt>
              <dd className="font-semibold">{username ?? '—'}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Demo notice</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-[var(--color-muted-foreground)]">
          <p>
            dogmoney is a <strong className="text-[var(--color-foreground)]">demo NFL sportsbook</strong> for
            paper betting only. No real money, deposits, withdrawals, or payments.
            Odds and outcomes are illustrative.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => {
                if (
                  window.confirm(
                    'Reset demo bankroll to $1,000 and clear all bets & slip?',
                  )
                ) {
                  resetDemo()
                }
              }}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset demo
            </Button>
            <Button
              variant="outline"
              className="gap-2 text-rose-600 hover:text-rose-700 dark:text-rose-400"
              onClick={handleLogout}
            >
              <LogOut className="h-3.5 w-3.5" />
              Log out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
