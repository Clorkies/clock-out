import type { ReactElement } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import DashboardPage from './pages/DashboardPage'
import { useTheme } from './hooks/useTheme'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import { isAuthenticated } from './lib/auth'

function ProtectedRoute({ children }: { children: ReactElement }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />
  }

  return children
}

function PublicAuthRoute({ children }: { children: ReactElement }) {
  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

function App() {
  const { theme, resolvedTheme, setTheme } = useTheme()

  return (
    <Routes>
      <Route
        path="/"
        element={
          <LandingPage
            theme={theme}
            resolvedTheme={resolvedTheme}
            setTheme={setTheme}
          />
        }
      />
      <Route
        path="/login"
        element={(
          <PublicAuthRoute>
            <LoginPage />
          </PublicAuthRoute>
        )}
      />
      <Route
        path="/signup"
        element={(
          <PublicAuthRoute>
            <SignupPage />
          </PublicAuthRoute>
        )}
      />
      <Route
        path="/dashboard"
        element={(
          <ProtectedRoute>
            <DashboardPage
              theme={theme}
              resolvedTheme={resolvedTheme}
              setTheme={setTheme}
            />
          </ProtectedRoute>
        )}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
