import { NavLink, Outlet } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { History, LogOut, Moon, Package, Palette, Printer, Settings, ShoppingCart, Sun } from 'lucide-react'
import { auth } from '../firebase'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../utils/theme'

const NAV = [
  { to: '/app', label: 'New Sale', Icon: ShoppingCart, end: true },
  { to: '/app/history', label: 'History', Icon: History },
  { to: '/app/templates', label: 'Templates', Icon: Palette },
  { to: '/app/settings', label: 'Settings', Icon: Settings },
]

// Style for each sidebar link. "isActive" is true for the page you are on.
function linkClass({ isActive }) {
  return (
    'flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold transition-all duration-200 ' +
    (isActive
      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white')
  )
}

// The whole app frame: a sidebar on desktop, a top bar with tabs on mobile.
// <Outlet /> is where the current page (New sale, History, Settings) appears.
export default function Layout() {
  const { business } = useAuth()
  const [theme, toggleTheme] = useTheme()

  const brand = business.logo ? (
    <img src={business.logo} alt="" className="h-9 w-9 rounded-xl bg-white object-contain p-1 shadow" />
  ) : (
    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-tr from-indigo-600 via-purple-600 to-pink-500 text-white shadow-lg shadow-indigo-500/20">
      <Printer className="h-4.5 w-4.5" />
    </div>
  )

  const themeButton = (
    <button
      type="button"
      onClick={toggleTheme}
      title="Switch light / dark mode"
      className="flex items-center justify-center rounded-xl border border-slate-200 bg-slate-100 p-2.5 text-indigo-600 transition-all hover:bg-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-amber-400 dark:hover:bg-slate-900"
    >
      {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  )

  return (
    <div className="min-h-screen bg-slate-50 transition-colors duration-300 dark:bg-slate-950 lg:flex print:block print:bg-white print:dark:bg-white">
      {/* Sidebar: shown from the "lg" breakpoint up */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col justify-between border-r border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/90 lg:flex print:hidden">
        <div>
          <div className="mb-8 flex items-center gap-2.5 px-1">
            {brand}
            <div className="min-w-0">
              <p className="truncate text-sm font-black tracking-wide text-slate-900 dark:text-white">{business.name}</p>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500 dark:text-indigo-400">POS PRO</span>
            </div>
          </div>
          <nav className="space-y-1">
            {NAV.map(({ to, label, Icon, end }) => (
              <NavLink key={to} to={to} end={end} className={linkClass}>
                <Icon className="h-4 w-4" /> {label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="space-y-3 border-t border-slate-100 pt-4 dark:border-slate-800">
          <div className="flex items-center justify-between">
            {themeButton}
            <button
              type="button"
              onClick={() => signOut(auth)}
              className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-100 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-500/20"
            >
              <LogOut className="h-4 w-4" /> Log out
            </button>
          </div>
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col print:min-h-0">
        {/* Top bar: shown below the "lg" breakpoint, replaces the sidebar */}
        <header className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-white/90 px-4 py-3.5 shadow-xl backdrop-blur-md transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900/90 lg:hidden print:hidden">
          <div className="flex items-center gap-3">
            {brand}
            <h1 className="text-base font-black tracking-wider text-slate-900 dark:text-white">{business.name}</h1>
          </div>

          <nav className="flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-slate-100 p-1.5 shadow-sm dark:border-slate-800 dark:bg-slate-950/80">
            {NAV.map(({ to, label, Icon, end }) => (
              <NavLink key={to} to={to} end={end} className={linkClass}>
                <Icon className="h-4 w-4" /> {label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {themeButton}
            <button
              type="button"
              onClick={() => signOut(auth)}
              className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-100 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-500/20"
            >
              <LogOut className="h-4 w-4" /> Log out
            </button>
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl flex-1 p-4 lg:p-8 print:max-w-none print:p-0">
          <Outlet />
        </main>

        <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-400 transition-colors dark:border-slate-900 dark:bg-slate-950 dark:text-slate-600 print:hidden">
          &copy; {new Date().getFullYear()} {business.name} POS Terminal. All rights reserved.
        </footer>
      </div>
    </div>
  )
}