import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import {
  AlertTriangle, History, LogOut, Menu, Moon, Package, Palette, Printer, Settings, ShoppingCart, Sun, X,
} from 'lucide-react'
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
    'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ' +
    (isActive
      ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800')
  )
}

// The whole app frame: a sidebar that stays on screen on desktop, and slides
// in as a drawer over a dimmed backdrop on phones and tablets.
// <Outlet /> is where the current page (New sale, History, Settings) appears.
export default function Layout() {
  const { business } = useAuth()
  const [theme, toggleTheme] = useTheme()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [logoutOpen, setLogoutOpen] = useState(false)

  const brand = business.logo ? (
    <img src={business.logo} alt="" className="h-9 w-9 rounded-xl bg-white object-contain p-1 shadow" />
  ) : (
    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 text-white shadow-md shadow-violet-600/20">
      <Printer className="h-4.5 w-4.5" />
    </div>
  )

  const themeButton = (
    <button
      type="button"
      onClick={toggleTheme}
      title="Switch light / dark mode"
      className="flex items-center justify-center rounded-xl bg-slate-100 p-2.5 text-slate-600 transition-all hover:bg-slate-200 dark:bg-slate-800 dark:text-amber-400 dark:hover:bg-slate-700"
    >
      {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  )

  return (
    <div className="min-h-screen bg-slate-50 transition-colors duration-300 dark:bg-slate-950 lg:flex print:block print:bg-white">
      {/* Mobile header bar: logo, theme toggle, and the hamburger that opens the drawer */}
      <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:hidden print:hidden">
        <div className="flex min-w-0 items-center gap-2.5">
          {brand}
          <div className="min-w-0">
            <h1 className="truncate text-xs font-bold tracking-tight text-slate-900 dark:text-white">{business.name}</h1>
            <span className="text-[10px] font-semibold tracking-wide text-violet-600 dark:text-violet-400">POS PRO</span>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {themeButton}
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            title="Open menu"
            className="rounded-xl bg-violet-50 p-2.5 text-violet-600 transition-colors hover:bg-violet-100 dark:bg-slate-800 dark:text-violet-400 dark:hover:bg-slate-700"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Dimmed backdrop behind the drawer, only on phones/tablets */}
      {drawerOpen && (
        <div
          onClick={() => setDrawerOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm transition-opacity lg:hidden print:hidden"
        />
      )}

      {/* Sidebar: a slide-over drawer below "lg", a fixed column from "lg" up */}
      <aside
        className={
          'fixed inset-y-0 left-0 z-50 flex w-72 flex-col justify-between bg-white p-5 shadow-2xl transition-transform duration-300 ease-in-out dark:bg-slate-900 ' +
          'lg:sticky lg:top-0 lg:z-auto lg:h-screen lg:w-64 lg:translate-x-0 lg:border-r lg:border-slate-200 lg:shadow-sm lg:dark:border-slate-800 print:hidden ' +
          (drawerOpen ? 'translate-x-0' : '-translate-x-full')
        }
      >
        <div>
          {/* Brand header, shown only on the desktop sidebar */}
          <div className="mb-8 hidden items-center gap-2.5 px-1 lg:flex">
            {brand}
            <div className="min-w-0">
              <p className="truncate text-sm font-black tracking-wide text-slate-900 dark:text-white">{business.name}</p>
              <span className="text-[10px] font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">POS PRO</span>
            </div>
          </div>

          {/* Drawer header, shown only on the mobile drawer */}
          <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800 lg:hidden">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 text-white">
                <Printer className="h-4 w-4" />
              </div>
              <span className="text-sm font-bold text-slate-900 dark:text-white">Menu</span>
            </div>
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              title="Close menu"
              className="rounded-lg bg-slate-100 p-2 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <nav className="space-y-1">
            {NAV.map(({ to, label, Icon, end }) => (
              <NavLink key={to} to={to} end={end} onClick={() => setDrawerOpen(false)} className={linkClass}>
                <Icon className="h-4 w-4 shrink-0" /> {label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="space-y-3 border-t border-slate-100 pt-4 dark:border-slate-800">
          <div className="hidden lg:flex">{themeButton}</div>
          <button
            type="button"
            onClick={() => setLogoutOpen(true)}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-100 px-4 py-2.5 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50 dark:border-rose-500/20 dark:text-rose-400 dark:hover:bg-rose-500/10"
          >
            <LogOut className="h-4 w-4" /> Log out
          </button>
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col print:min-h-0">
        <main className="mx-auto w-full max-w-7xl flex-1 p-4 lg:p-8 print:max-w-none print:p-0">
          <Outlet />
        </main>

        <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-400 transition-colors dark:border-slate-900 dark:bg-slate-950 dark:text-slate-600 print:hidden">
          &copy; {new Date().getFullYear()} {business.name} POS Terminal. All rights reserved.
        </footer>
      </div>

      {/* Logout confirmation, so a stray tap can't sign someone out mid-sale */}
      {logoutOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm print:hidden" role="dialog" aria-modal="true">
          <div className="card w-full max-w-sm space-y-4 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Confirm Logout</h3>
              <p className="muted text-xs">Are you sure you want to end your POS session?</p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button type="button" className="btn-secondary" onClick={() => setLogoutOpen(false)}>Cancel</button>
              <button
                type="button"
                onClick={() => signOut(auth)}
                className="btn bg-rose-600 text-white shadow-md hover:bg-rose-500"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}