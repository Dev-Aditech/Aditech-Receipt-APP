import { useState } from 'react'
import { Link } from 'react-router-dom'
import { sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth'
import { KeyRound, Mail } from 'lucide-react'
import { auth } from '../firebase'
import { friendlyError } from '../utils/errors'
import AuthShell, { AuthButton, AuthField, AuthMessage } from '../components/AuthShell'

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
      // The router sends them to the app automatically.
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
    <AuthShell
      title="Receipt Desk"
      subtitle="Secure POS Terminal & Business Sign-in"
      footer="Secure Terminal • Your data stays private to your business"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <AuthMessage>{error}</AuthMessage>}
        {info && <AuthMessage type="success">{info}</AuthMessage>}

        <AuthField
          id="email" label="Email" icon={Mail} type="email" required
          autoComplete="email" placeholder="you@yourstore.com"
          value={email} onChange={(e) => setEmail(e.target.value)}
        />
        <AuthField
          id="password" label="Password" icon={KeyRound} type="password" required
          autoComplete="current-password" placeholder="Enter your password"
          value={password} onChange={(e) => setPassword(e.target.value)}
        />

        <AuthButton busy={busy} busyText="Signing in...">Sign In to Terminal</AuthButton>
      </form>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-2">
        <button type="button" onClick={handleReset} className="text-xs font-semibold text-emerald-600 hover:underline dark:text-emerald-400">
          Forgot password?
        </button>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          New here?{' '}
          <Link to="/register" className="font-semibold text-emerald-600 hover:underline dark:text-emerald-400">
            Register your business
          </Link>
        </span>
      </div>
    </AuthShell>
  )
}