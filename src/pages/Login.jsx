import { useState } from 'react'
import { Link } from 'react-router-dom'
import { sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth'
import { Package } from 'lucide-react'
import { auth } from '../firebase'
import { friendlyError } from '../utils/errors'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setInfo('')
    setBusy(true)
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password)
    } catch (err) {
      setError(friendlyError(err))
      setBusy(false)
    }
  }

  async function handleReset() {
    setError('')
    setInfo('')
    if (!email.trim()) {
      setError('Type your email above first, then click "Forgot password?".')
      return
    }
    try {
      await sendPasswordResetEmail(auth, email.trim())
      setInfo('Password reset email sent. Check your inbox.')
    } catch (err) {
      setError(friendlyError(err))
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      <form className="card w-full max-w-md space-y-4" onSubmit={handleSubmit}>
        <div className="card-bar bg-linear-to-b from-indigo-500 to-purple-500" />
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center rounded-2xl bg-linear-to-tr from-indigo-600 via-purple-600 to-pink-500 p-2.5 text-white shadow-lg shadow-indigo-500/20">
            <Package className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-wide text-slate-900 dark:text-white">Log in</h1>
            <p className="muted text-xs">Point of Sale &amp; Thermal Terminal</p>
          </div>
        </div>

        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" type="email" required autoComplete="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label className="label" htmlFor="password">Password</label>
          <input id="password" type="password" required autoComplete="current-password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

        {error && <p className="error-text" role="alert">{error}</p>}
        {info && <p className="success-text" role="status">{info}</p>}

        <button className="btn-primary w-full uppercase tracking-wider" disabled={busy}>
          {busy ? 'Logging in...' : 'Log in'}
        </button>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <button type="button" className="link" onClick={handleReset}>Forgot password?</button>
          <span className="muted text-xs">
            New here? <Link to="/register" className="link">Register your business</Link>
          </span>
        </div>
      </form>
    </div>
  )
}