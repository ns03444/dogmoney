import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { SportsbookProvider } from '@/context/SportsbookContext'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { AppShell } from '@/components/layout/AppShell'
import { LinesPage } from '@/pages/LinesPage'
import { MyBetsPage } from '@/pages/MyBetsPage'
import { AccountPage } from '@/pages/AccountPage'
import { Login } from '@/pages/Login'

export default function App() {
  return (
    <AuthProvider>
      <SportsbookProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              element={
                <ProtectedRoute>
                  <AppShell />
                </ProtectedRoute>
              }
            >
              <Route index element={<LinesPage />} />
              <Route path="bets" element={<MyBetsPage />} />
              <Route path="account" element={<AccountPage />} />
              <Route path="nfl" element={<Navigate to="/" replace />} />
              <Route path="history" element={<Navigate to="/bets" replace />} />
              <Route path="card" element={<Navigate to="/" replace />} />
              <Route path="ncaaf" element={<Navigate to="/" replace />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </SportsbookProvider>
    </AuthProvider>
  )
}
