import { useState } from 'react'
import { Link } from 'react-router-dom'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { KeyRound, Mail, MapPin, Phone, Store } from 'lucide-react'
import { auth, db } from '../firebase'
import { friendlyError } from '../utils/errors'
import AuthShell, { AuthButton, AuthField, AuthMessage } from '../components/AuthShell'

export default function Register() {
  // One piece of "state" holding everything the person types
  const [form, setForm] = useState({ name: '', address: '', phone: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  // Update one field without touching the others
  function update(field, value) {
    setForm((old) => ({ ...old, [field]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault() // stop the browser from reloading the page
    setError('')
    setBusy(true)
    try {
      // 1. Create the login
      const cred = await createUserWithEmailAndPassword(auth, form.email.trim(), form.password)

      // 2. Create the business profile. Its ID is the user's ID,
      //    which is how the security rules know who owns it.
      await setDoc(doc(db, 'businesses', cred.user.uid), {
        name: form.name.trim(),
        address: form.address.trim(),
        phone: form.phone.trim(),
        ownerEmail: form.email.trim(),
        footer: 'Thank you for your patronage!',
        logo: '',
        paper: '80',
        receiptCount: 0,
        createdAt: serverTimestamp(),
      })
      // The router will now send them to the app automatically.
    } catch (err) {
      setError(friendlyError(err))
      setBusy(false)
    }
  }

  return (
    <AuthShell
      wide
      title="Register Your Business"
      subtitle="Set up once. Then you only type the items for each sale."
      footer="Secure Terminal • Add your logo later under Settings"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <AuthMessage>{error}</AuthMessage>}

        <AuthField
          id="name" label="Business name" icon={Store} required
          placeholder="e.g. ABC Mini Mart"
          value={form.name} onChange={(e) => update('name', e.target.value)}
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <AuthField
            id="address" label="Address" icon={MapPin}
            placeholder="12 Main Street, Ibadan"
            value={form.address} onChange={(e) => update('address', e.target.value)}
          />
          <AuthField
            id="phone" label="Phone" icon={Phone} type="tel"
            placeholder="0801 234 5678"
            value={form.phone} onChange={(e) => update('phone', e.target.value)}
          />
        </div>

        <AuthField
          id="email" label="Email" icon={Mail} type="email" required
          autoComplete="email" placeholder="you@yourstore.com"
          value={form.email} onChange={(e) => update('email', e.target.value)}
        />
        <AuthField
          id="password" label="Password (at least 6 characters)" icon={KeyRound} type="password"
          required minLength={6} autoComplete="new-password" placeholder="Choose a password"
          value={form.password} onChange={(e) => update('password', e.target.value)}
        />

        <AuthButton busy={busy} busyText="Creating account...">Create Account</AuthButton>
      </form>

      <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
        Already registered?{' '}
        <Link to="/login" className="font-semibold text-emerald-600 hover:underline dark:text-emerald-400">
          Sign in
        </Link>
      </p>
    </AuthShell>
  )
}