// The look shared by the Login and Register pages: soft glowing background,
// a centred card, a light/dark switch, and a few small building blocks.
import { Link } from 'react-router-dom'
import { ArrowLeft, ChevronRight, Moon, ShieldCheck, Store, Sun } from 'lucide-react'
import { useTheme } from '../utils/theme'

export default function AuthShell({ title, subtitle, footer, wide = false, children }) {
  const [theme, toggleTheme] = useTheme()

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-br from-slate-100 via-emerald-50 to-teal-100 p-4 transition-colors duration-300 dark:bg-slate-950 dark:bg-none">
      {/* Soft glowing circles in the background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl" />
      </div>

      <div
        className={
          'relative my-6 w-full rounded-3xl border border-slate-200/80 bg-white/95 p-8 shadow-2xl shadow-slate-300/60 backdrop-blur-xl transition-all duration-300 dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-emerald-950/40 ' +
          (wide ? 'max-w-lg' : 'max-w-md')
        }
      >
        <Link
          to="/"
          className="absolute left-6 top-6 flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-100 px-3 py-2.5 text-xs font-semibold text-slate-700 transition-all hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Home
        </Link>

        <button
          type="button"
          onClick={toggleTheme}
          title="Switch light / dark mode"
          className="absolute right-6 top-6 flex items-center justify-center rounded-xl border border-slate-200 bg-slate-100 p-2.5 text-slate-700 transition-all hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-amber-400 dark:hover:bg-slate-700"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        <div className="mb-8 pt-2 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-tr from-emerald-600 to-teal-500 text-white shadow-xl shadow-emerald-600/30 transition-transform hover:scale-105">
            <Store className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">{title}</h1>
          <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">{subtitle}</p>
        </div>

        {children}

        {footer && (
          <div className="mt-8 border-t border-slate-100 pt-6 text-center text-xs text-slate-400 dark:border-slate-800 dark:text-slate-500">
            <p className="flex items-center justify-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-500" /> {footer}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// A labelled box with a small icon on the left.
// Any extra props (type, value, onChange, required...) go straight to the <input>.
export function AuthField({ label, icon: Icon, id, ...inputProps }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
        {label}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3.5 top-3.5 text-slate-400">
          <Icon className="h-4 w-4" />
        </span>
        <input
          id={id}
          {...inputProps}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm font-medium text-slate-900 placeholder-slate-400 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:placeholder-slate-600"
        />
      </div>
    </div>
  )
}

// The big green submit button
export function AuthButton({ busy, busyText, children }) {
  return (
    <button
      type="submit"
      disabled={busy}
      className="flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-emerald-600/30 transition-all hover:from-emerald-500 hover:to-teal-500 active:scale-[0.99] disabled:cursor-wait disabled:opacity-70"
    >
      <span>{busy ? busyText : children}</span>
      {!busy && <ChevronRight className="h-4 w-4" />}
    </button>
  )
}

// A small red (error) or green (success) message box
export function AuthMessage({ type = 'error', children }) {
  const style =
    type === 'success'
      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
      : 'border-rose-500/30 bg-rose-500/10 text-rose-500'
  return (
    <div className={'rounded-xl border p-3 text-center text-xs font-semibold ' + style} role={type === 'error' ? 'alert' : 'status'}>
      {children}
    </div>
  )
}