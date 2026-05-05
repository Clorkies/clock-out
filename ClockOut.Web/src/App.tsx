import { Navigate, Route, Routes } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import DashboardPage from './pages/DashboardPage'
import { useTheme } from './hooks/useTheme'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'

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
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route
        path="/dashboard"
        element={
          <DashboardPage
            theme={theme}
            resolvedTheme={resolvedTheme}
            setTheme={setTheme}
          />
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
