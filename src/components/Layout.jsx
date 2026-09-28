import { NavLink, Outlet } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { History, LogOut, Moon, Package, Settings, ShoppingCart, Sun } from 'lucide-react'
import { auth } from '../firebase'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../utils/theme'

// Style for each tab. "isActive" is true for the page you are on.
function tabClass({ isActive }) {
  return (
    'flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all duration-200 ' +
    (isActive
      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
      : 'text-slate-600 hover:bg-white hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white')
  )
}

// The top bar and footer shown on every logged-in page.
// <Outlet /> is where the current page (New sale, History, Settings) appears.
export default function Layout() {
  const { business } = useAuth()
  const [theme, toggleTheme] = useTheme()

  return (
    <div className="flex min-h-screen flex-col print:min-h-0">
      <header className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-white/90 px-4 py-3.5 shadow-xl backdrop-blur-md transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900/90 lg:px-8 print:hidden">
        <div className="flex items-center gap-3">
          {business.logo ? (
            <img src={business.logo} alt="" className="h-11 w-11 rounded-2xl bg-white object-contain p-1 shadow-lg" />
          ) : (
            <div className="flex items-center justify-center rounded-2xl bg-linear-to-tr from-indigo-600 via-purple-600 to-pink-500 p-2.5 text-white shadow-lg shadow-indigo-500/20">
              <Package className="h-6 w-6" />
            </div>
          )}
          <div>
            <h1 className="flex items-center gap-2 text-base font-black tracking-wider text-slate-900 dark:text-white lg:text-lg">
              {business.name}
              <span className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-0.5 text-[10px] font-bold text-indigo-500 dark:text-indigo-400">
                POS PRO
              </span>
            </h1>
            <p className="muted text-xs">Point of Sale &amp; Thermal Terminal</p>
          </div>
        </div>

        <nav className="flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-slate-100 p-1.5 shadow-sm dark:border-slate-800 dark:bg-slate-950/80">
          <NavLink to="/app" end className={tabClass}><ShoppingCart className="h-4 w-4" /> New Sale</NavLink>
          <NavLink to="/app/history" className={tabClass}><History className="h-4 w-4" /> History</NavLink>
          <NavLink to="/app/settings" className={tabClass}><Settings className="h-4 w-4" /> Settings</NavLink>
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            title="Switch light / dark mode"
            className="flex items-center justify-center rounded-xl border border-slate-200 bg-slate-100 p-2.5 text-indigo-600 transition-all hover:bg-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-amber-400 dark:hover:bg-slate-800"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
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
  )
}