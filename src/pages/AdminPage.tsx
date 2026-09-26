import { useEffect, useState } from 'react'
import { ShieldCheck, UserRound } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatMoney } from '@/lib/odds'

interface AdminUser {
  id: string
  username: string
  role: 'admin' | 'user'
  active: boolean
  balance: number
  bets: number
  createdAt: string
}

export function AdminPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [balanceInputs, setBalanceInputs] = useState<Record<string, string>>({})

  async function loadUsers() {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/users', { credentials: 'include' })
      const payload = (await response.json()) as { users?: AdminUser[]; error?: string }
      if (!response.ok) throw new Error(payload.error || 'Unable to load users.')
      setUsers(payload.users ?? [])
      setError(null)
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load users.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void loadUsers() }, [])

  async function updateUser(user: AdminUser, changes: { balance?: number; active?: boolean }) {
    setSaving(user.id)
    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(changes),
      })
      const payload = (await response.json()) as { error?: string }
      if (!response.ok) throw new Error(payload.error || 'Unable to update user.')
      await loadUsers()
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'Unable to update user.')
    } finally {
      setSaving(null)
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-emerald-600" /><h2 className="text-lg font-semibold tracking-tight sm:text-xl">Admin portal</h2></div>
        <p className="mt-0.5 text-sm text-[var(--color-muted-foreground)]">Manage demo users and paper balances.</p>
      </div>
      {error && <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300">{error}</p>}
      <Card>
        <CardHeader><CardTitle className="text-base">Users</CardTitle></CardHeader>
        <CardContent>
          {loading ? <p className="text-sm text-[var(--color-muted-foreground)]">Loading users…</p> : (
            <div className="space-y-3">
              {users.map((user) => (
                <div key={user.id} className="rounded-lg border border-[var(--color-border)] p-3">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-center gap-2"><UserRound className="h-4 w-4 text-emerald-600" /><div><p className="text-sm font-semibold">{user.username}</p><p className="text-xs text-[var(--color-muted-foreground)]">{user.bets} bets · {user.role}</p></div></div>
                    <Badge variant={user.active ? 'open' : 'lost'}>{user.active ? 'Active' : 'Inactive'}</Badge>
                  </div>
                  <div className="mt-3 flex flex-wrap items-end gap-2">
                    <label className="text-xs text-[var(--color-muted-foreground)]">Balance<input type="number" min="0" step="0.01" value={balanceInputs[user.id] ?? String(user.balance)} onChange={(event) => setBalanceInputs((prev) => ({ ...prev, [user.id]: event.target.value }))} className="mt-1 block h-9 w-32 rounded-md border border-[var(--color-input)] bg-[var(--color-background)] px-2 text-sm outline-none focus:border-emerald-500" /></label>
                    <Button size="sm" disabled={saving === user.id} onClick={() => updateUser(user, { balance: Number(balanceInputs[user.id] ?? user.balance) })}>Save balance</Button>
                    <Button size="sm" variant="outline" disabled={saving === user.id || user.role === 'admin'} onClick={() => updateUser(user, { active: !user.active })}>{user.active ? 'Deactivate' : 'Reactivate'}</Button>
                    <span className="ml-auto text-sm font-semibold tabular-nums text-emerald-700 dark:text-emerald-400">{formatMoney(user.balance)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      <p className="text-xs text-[var(--color-muted-foreground)]">Admin changes apply to the API account record. Paper bets remain a demo feature and never involve real money.</p>
    </div>
  )
}
