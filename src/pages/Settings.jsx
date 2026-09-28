import { useState } from 'react'
import { doc, updateDoc } from 'firebase/firestore'
import { Settings as SettingsIcon } from 'lucide-react'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'
import { resizeImage } from '../utils/image'
import ReceiptPanel from '../components/ReceiptPanel'

export default function Settings() {
  const { user, business } = useAuth()

  // Start the form with the values already saved
  const [form, setForm] = useState({
    name: business.name || '',
    address: business.address || '',
    phone: business.phone || '',
    footer: business.footer || '',
    paper: business.paper || '80',
    template: business.template || 'classic',
    logo: business.logo || '',
  })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  function update(field, value) {
    setForm((old) => ({ ...old, [field]: value }))
    setMessage('')
  }

  async function handleLogo(event) {
    const file = event.target.files[0]
    if (!file) return
    setError('')
    try {
      update('logo', await resizeImage(file))
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleSave(event) {
    event.preventDefault()
    setError('')
    setBusy(true)
    try {
      await updateDoc(doc(db, 'businesses', user.uid), {
        name: form.name.trim(),
        address: form.address.trim(),
        phone: form.phone.trim(),
        footer: form.footer.trim(),
        paper: form.paper,
        logo: form.logo,
      })
      setMessage('Settings updated successfully!')
    } catch (err) {
      setError(err.message)
    }
    setBusy(false)
  }

  // Sample receipt so the owner can see the changes before saving
  const previewSale = {
    number: (business.receiptCount || 0) + 1,
    date: new Date(),
    payment: 'Cash',
    received: null,
    items: [
      { name: 'Biscuit', price: 50, qty: 1 },
      { name: 'Bottled water', price: 30, qty: 2 },
    ],
  }

  return (
    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
      <form className="card space-y-5 lg:col-span-7 lg:p-8 print:hidden" onSubmit={handleSave}>
        <div>
          <h2 className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
            <SettingsIcon className="h-5 w-5 text-indigo-500" /> Store &amp; Terminal Settings
          </h2>
          <p className="muted text-xs">Manage the store details printed on receipts</p>
        </div>

        <div>
          <label className="label" htmlFor="logo">Logo</label>
          {form.logo && (
            <img src={form.logo} alt="Your logo" className="mb-3 max-h-24 max-w-[160px] rounded-xl border border-slate-200 bg-white object-contain p-1 dark:border-slate-700" />
          )}
          <input
            id="logo" type="file" accept="image/*" onChange={handleLogo}
            className="block w-full text-xs text-slate-500 file:mr-3 file:rounded-xl file:border-0 file:bg-indigo-600 file:px-4 file:py-2.5 file:text-xs file:font-bold file:text-white hover:file:bg-indigo-500 dark:text-slate-400"
          />
          {form.logo && (
            <button type="button" className="link mt-2" onClick={() => update('logo', '')}>Remove logo</button>
          )}
          <p className="muted mt-1 text-xs">Simple black-and-white logos print best on thermal paper.</p>
        </div>

        <div>
          <label className="label" htmlFor="name">Store name</label>
          <input id="name" required className="input font-bold" value={form.name} onChange={(e) => update('name', e.target.value)} />
        </div>
        <div>
          <label className="label" htmlFor="address">Store address / location</label>
          <input id="address" className="input" value={form.address} onChange={(e) => update('address', e.target.value)} />
        </div>
        <div>
          <label className="label" htmlFor="phone">Customer support phone</label>
          <input id="phone" type="tel" className="input font-mono" value={form.phone} onChange={(e) => update('phone', e.target.value)} />
        </div>
        <div>
          <label className="label" htmlFor="footer">Message at the bottom of the receipt</label>
          <input id="footer" className="input" value={form.footer} onChange={(e) => update('footer', e.target.value)} />
        </div>

        <div>
          <span className="label">Receipt paper width</span>
          <div className="seg">
            <button type="button" className="seg-btn" aria-pressed={form.paper === '80'} onClick={() => update('paper', '80')}>80 mm</button>
            <button type="button" className="seg-btn" aria-pressed={form.paper === '58'} onClick={() => update('paper', '58')}>58 mm</button>
          </div>
        </div>

        {error && <p className="error-text" role="alert">{error}</p>}
        {message && <p className="success-text" role="status">{message}</p>}

        <button className="btn-primary uppercase tracking-wider" disabled={busy}>
          {busy ? 'Saving...' : 'Save Settings'}
        </button>
      </form>

      <div className="lg:sticky lg:top-24 lg:col-span-5 print:hidden">
        <ReceiptPanel business={form} sale={previewSale} note="Sample receipt with your details." />
      </div>
    </div>
  )
}