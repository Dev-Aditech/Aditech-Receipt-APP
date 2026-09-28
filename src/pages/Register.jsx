import { useState } from 'react'
import { Link } from 'react-router-dom'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { Package } from 'lucide-react'
import { auth, db } from '../firebase'
import { friendlyError } from '../utils/errors'

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
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      <form className="card w-full max-w-md space-y-4" onSubmit={handleSubmit}>
        <div className="card-bar bg-linear-to-b from-purple-500 to-pink-500" />
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center rounded-2xl bg-linear-to-tr from-indigo-600 via-purple-600 to-pink-500 p-2.5 text-white shadow-lg shadow-indigo-500/20">
            <Package className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-wide text-slate-900 dark:text-white">Register your business</h1>
            <p className="muted text-xs">Set up once. Then you only type the items for each sale.</p>
          </div>
        </div>

        <div>
          <label className="label" htmlFor="name">Business name</label>
          <input id="name" required className="input" placeholder="ABC Mini Mart" value={form.name} onChange={(e) => update('name', e.target.value)} />
        </div>
        <div>
          <label className="label" htmlFor="address">Address</label>
          <input id="address" className="input" placeholder="12 Main Street, Ibadan" value={form.address} onChange={(e) => update('address', e.target.value)} />
        </div>
        <div>
          <label className="label" htmlFor="phone">Phone</label>
          <input id="phone" type="tel" className="input font-mono" placeholder="0801 234 5678" value={form.phone} onChange={(e) => update('phone', e.target.value)} />
        </div>
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" type="email" required autoComplete="email" className="input" value={form.email} onChange={(e) => update('email', e.target.value)} />
        </div>
        <div>
          <label className="label" htmlFor="password">Password (at least 6 characters)</label>
          <input id="password" type="password" required minLength={6} autoComplete="new-password" className="input" value={form.password} onChange={(e) => update('password', e.target.value)} />
        </div>

        {error && <p className="error-text" role="alert">{error}</p>}

        <button className="btn-primary w-full uppercase tracking-wider" disabled={busy}>
          {busy ? 'Creating account...' : 'Create account'}
        </button>
        <p className="muted text-xs">You can add your logo after you log in, under Settings.</p>
        <p className="muted text-xs">Already registered? <Link to="/login" className="link">Log in</Link></p>
      </form>
    </div>
  )
}