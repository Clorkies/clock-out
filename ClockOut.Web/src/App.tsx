import { Navigate, Route, Routes } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import DashboardPage from './pages/DashboardPage'
import { useTheme } from './hooks/useTheme'

function App() {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme()

  return (
    <Routes>
      <Route
        path="/"
        element={
          <LandingPage
            theme={theme}
            resolvedTheme={resolvedTheme}
            setTheme={setTheme}
            toggleTheme={toggleTheme}
          />
        }
      />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
