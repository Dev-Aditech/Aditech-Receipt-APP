import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import NewSale from './pages/NewSale'
import History from './pages/History'
import Settings from './pages/Settings'

function Loading({ text }) {
  return <p className="mt-[30vh] text-center text-sm text-slate-500">{text}</p>
}

// Pages that need a login. If nobody is logged in, send them to /login.
function RequireLogin({ children }) {
  const { user, business, loading } = useAuth()

  if (loading) return <Loading text="Loading..." />
  if (!user) return <Navigate to="/login" replace />
  // Logged in, but the business profile has not arrived yet
  if (!business) return <Loading text="Loading your business..." />

  return children
}

// Login and register pages: if you are already logged in, go to the app.
function GuestOnly({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <Loading text="Loading..." />
  if (user) return <Navigate to="/" replace />
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<GuestOnly><Login /></GuestOnly>} />
      <Route path="/register" element={<GuestOnly><Register /></GuestOnly>} />

      <Route element={<RequireLogin><Layout /></RequireLogin>}>
        <Route path="/" element={<NewSale />} />
        <Route path="/history" element={<History />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}