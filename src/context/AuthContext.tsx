import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export interface AuthUser {
  id: string
  username: string
  role: 'admin' | 'user'
  active: boolean
}

interface AuthContextValue {
  isAuthenticated: boolean
  loading: boolean
  user: AuthUser | null
  username: string | null
  role: AuthUser['role'] | null
  login: (username: string, password: string) => Promise<{ ok: boolean; error?: string }>
  register: (username: string, password: string) => Promise<{ ok: boolean; error?: string }>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

async function authRequest(path: string, options?: RequestInit) {
  const response = await fetch(path, {
    ...options,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  })
  const payload = (await response.json().catch(() => ({}))) as { user?: AuthUser; error?: string }
  if (!response.ok) throw new Error(payload.error || 'Request failed.')
  return payload
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    authRequest('/api/auth/me')
      .then((payload) => setUser(payload.user ?? null))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  const login = useCallback(async (username: string, password: string) => {
    try {
      const payload = await authRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      })
      setUser(payload.user ?? null)
      return { ok: true }
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : 'Unable to sign in.' }
    }
  }, [])

  const register = useCallback(async (username: string, password: string) => {
    try {
      const payload = await authRequest('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      })
      setUser(payload.user ?? null)
      return { ok: true }
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : 'Unable to create account.' }
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await authRequest('/api/auth/logout', { method: 'POST' })
    } finally {
      setUser(null)
    }
  }, [])

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(user),
      loading,
      user,
      username: user?.username ?? null,
      role: user?.role ?? null,
      login,
      register,
      logout,
    }),
    [user, loading, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
