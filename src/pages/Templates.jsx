import { useState } from 'react'
import { doc, updateDoc } from 'firebase/firestore'
import { Check, Palette } from 'lucide-react'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'
import { TEMPLATES } from '../templates'
import { sampleSale } from '../templates/sampleSale'

export default function Templates() {
  const { user, business } = useAuth()

  const [selected, setSelected] = useState(business.template || 'classic')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const preview = sampleSale(business.receiptCount)
  const changed = selected !== (business.template || 'classic')

  async function handleSave() {
    setError('')
    setBusy(true)
    try {
      await updateDoc(doc(db, 'businesses', user.uid), { template: selected })
      setMessage('Template saved. It will be used on your next receipt.')
    } catch (err) {
      setError(err.message)
    }
    setBusy(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
          <Palette className="h-5 w-5 text-violet-600" /> Receipt Templates
        </h2>
        <p className="muted text-xs">Pick how your printed receipts look. Your logo and details show on every template.</p>
      </div>

      {error && <p className="error-text" role="alert">{error}</p>}
      {message && !changed && <p className="success-text" role="status">{message}</p>}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {TEMPLATES.map(({ id, name, description, Component }) => {
          const isSelected = selected === id
          return (
            <div
              key={id}
              className={
                'card p-4! transition-all ' +
                (isSelected ? 'ring-2 ring-violet-500 ring-offset-2 ring-offset-slate-50 dark:ring-offset-slate-950' : '')
              }
            >
              <div className="mb-1 flex items-start justify-between gap-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{name}</h3>
                {isSelected && (
                  <span className="flex shrink-0 items-center gap-1 rounded-full bg-violet-600 px-2 py-0.5 text-[10px] font-bold text-white">
                    <Check className="h-3 w-3" /> Selected
                  </span>
                )}
              </div>
              <p className="muted mb-4 text-xs">{description}</p>

              {/* A scaled-down live preview, using the business's real logo and details */}
              <div className="mb-4 flex h-72 items-start justify-center overflow-hidden rounded-xl bg-slate-200 p-4 dark:bg-slate-950">
                <div className="origin-top scale-[0.62]">
                  <Component business={{ ...business, template: id }} sale={preview} paper={business.paper === '58' ? '58' : '80'} />
                </div>
              </div>

              <button
                type="button"
                onClick={() => { setSelected(id); setMessage('') }}
                disabled={isSelected}
                className={isSelected ? 'btn-secondary w-full cursor-default! opacity-70' : 'btn-primary w-full'}
              >
                {isSelected ? 'Currently selected' : 'Choose this template'}
              </button>
            </div>
          )
        })}
      </div>

      {changed && (
        <div className="card flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-slate-700 dark:text-slate-300">
            You picked a new template. Save to use it on your next receipt.
          </p>
          <button type="button" className="btn-primary" onClick={handleSave} disabled={busy}>
            {busy ? 'Saving...' : 'Save template'}
          </button>
        </div>
      )}
    </div>
  )
}