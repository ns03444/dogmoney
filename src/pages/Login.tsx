import { useState, type FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { CircleDot, Lock, User } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function Login() {
  const { isAuthenticated, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from =
    (location.state as { from?: string } | null)?.from &&
    (location.state as { from?: string }).from !== '/login'
      ? (location.state as { from: string }).from
      : '/'

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (isAuthenticated) {
    return <Navigate to={from} replace />
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    const ok = login(username.trim(), password)
    setSubmitting(false)
    if (ok) {
      navigate(from, { replace: true })
    } else {
      setError('Invalid username or password.')
    }
  }

  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[var(--color-background)] px-4 py-10">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(16,185,129,0.12),_transparent_55%),radial-gradient(ellipse_at_bottom,_rgba(15,23,42,0.06),_transparent_50%)] dark:bg-[radial-gradient(ellipse_at_top,_rgba(16,185,129,0.15),_transparent_50%),radial-gradient(ellipse_at_bottom,_rgba(0,0,0,0.4),_transparent_55%)]"
        aria-hidden
      />

      <div className="relative w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/25">
            <CircleDot className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Weekly Card Admin
          </h1>
          <p className="mt-1.5 text-sm text-[var(--color-muted-foreground)]">
            Sign in to manage this week&apos;s card
          </p>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-xl shadow-black/5 dark:shadow-black/40 sm:p-8">
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="username"
                className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted-foreground)]"
              >
                Username
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted-foreground)]" />
                <input
                  id="username"
                  name="username"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={cn(
                    'flex h-11 w-full rounded-lg border border-[var(--color-input)] bg-[var(--color-background)] pl-10 pr-3 text-sm',
                    'outline-none ring-emerald-500/40 focus:border-emerald-500 focus:ring-2',
                  )}
                  placeholder="admin"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="password"
                className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted-foreground)]"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted-foreground)]" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={cn(
                    'flex h-11 w-full rounded-lg border border-[var(--color-input)] bg-[var(--color-background)] pl-10 pr-3 text-sm',
                    'outline-none ring-emerald-500/40 focus:border-emerald-500 focus:ring-2',
                  )}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/50 dark:text-rose-300"
              >
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={submitting}
              className="mt-1 h-11 w-full bg-emerald-600 text-white hover:bg-emerald-500 hover:opacity-100"
            >
              {submitting ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>

          <p className="mt-5 text-center text-[11px] leading-relaxed text-[var(--color-muted-foreground)]">
            Demo auth only — credentials are checked client-side.
            <br />
            Not for production use.
          </p>
        </div>
      </div>
    </div>
  )
}
