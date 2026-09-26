import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) return <div className="flex min-h-dvh items-center justify-center text-sm text-[var(--color-muted-foreground)]">Loading session…</div>
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }
  return <>{children}</>
}

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { loading, role } = useAuth()
  if (loading) return <div className="flex min-h-dvh items-center justify-center text-sm text-[var(--color-muted-foreground)]">Loading session…</div>
  if (role !== 'admin') return <Navigate to="/" replace />
  return <>{children}</>
}
