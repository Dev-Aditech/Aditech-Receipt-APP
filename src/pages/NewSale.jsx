import { useRef, useState } from 'react'
import { collection, doc, Timestamp, writeBatch } from 'firebase/firestore'
import { CheckCircle, CreditCard, DollarSign, Plus, Printer, Smartphone, Sparkles, Trash2 } from 'lucide-react'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'
import ReceiptPanel from '../components/ReceiptPanel'
import { calcTotal, formatMoney, padNumber } from '../utils/money'

const METHODS = [
  { name: 'Cash', Icon: DollarSign },
  { name: 'Transfer', Icon: Smartphone },
  { name: 'POS', Icon: CreditCard },
]

export default function NewSale() {
  const { user, business } = useAuth()

  const nextId = useRef(1)       // gives every item its own ID
  const nameInput = useRef(null) // lets us put the cursor back in the name box

  const [items, setItems] = useState([])
  const [itemName, setItemName] = useState('')
  const [itemPrice, setItemPrice] = useState('')
  const [itemQty, setItemQty] = useState(1)
  const [payment, setPayment] = useState('Cash')
  const [received, setReceived] = useState('')
  const [number, setNumber] = useState((business.receiptCount || 0) + 1)
  const [saved, setSaved] = useState(false)      // true after the sale is saved
  const [saleDate, setSaleDate] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [toast, setToast] = useState('')

  const total = calcTotal(items)
  const cash = parseFloat(received) || 0

  function showToast(message) {
    setToast(message)
    setTimeout(() => setToast(''), 3500)
  }

  function handleAddItem(event) {
    event.preventDefault()
    const price = parseFloat(itemPrice)
    const qty = parseFloat(itemQty)

    if (!itemName.trim() || !(price > 0)) {
      showToast('Please enter a valid item name and price.')
      return
    }
    if (!(qty > 0)) {
      showToast('Quantity must be at least 1.')
      return
    }

    setItems((old) => [...old, { id: nextId.current++, name: itemName.trim(), price, qty }])
    setItemName('')
    setItemPrice('')
    setItemQty(1)
    nameInput.current?.focus() // ready for the next item
  }

  function removeItem(id) {
    setItems((old) => old.filter((item) => item.id !== id))
  }

  // Empties the cart without completing a sale. The receipt number is untouched.
  function clearSale() {
    if (items.length === 0) return
    setItems([])
    setReceived('')
    showToast('Sale cleared')
  }

  function completeSale() {
    if (items.length === 0) return

    const date = new Date()
    const sale = {
      number,
      items: items.map(({ name, price, qty }) => ({ name, price, qty })),
      total,
      payment,
      received: payment === 'Cash' && cash > 0 ? cash : null,
      createdAt: Timestamp.fromDate(date),
    }

    // Save the sale and bump the receipt counter together.
    // We do not "await": if the internet is down, Firebase keeps the data
    // and sends it later, and the cashier can still print right away.
    const batch = writeBatch(db)
    batch.set(doc(collection(db, 'businesses', user.uid, 'sales')), sale)
    batch.update(doc(db, 'businesses', user.uid), { receiptCount: number })
    batch.commit().catch((err) => {
      console.error(err)
      showToast('This sale could not be saved: ' + err.message)
    })

    setSaleDate(date)
    setSaved(true)
    setShowModal(true)
    // Short pause so the screen updates before the print window opens
    setTimeout(() => window.print(), 150)
  }

  function startNewSale() {
    setItems([])
    setItemName('')
    setItemPrice('')
    setItemQty(1)
    setPayment('Cash')
    setReceived('')
    setSaved(false)
    setSaleDate(null)
    setShowModal(false)
    setNumber(number + 1)
  }

  const previewSale = { number, date: saleDate || new Date(), items, payment, received }

  return (
    <>
      {toast && (
        <div className="fixed right-4 top-20 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs font-medium text-white shadow-2xl print:hidden" role="alert">
          <CheckCircle className="h-4 w-4 text-emerald-400" /> {toast}
        </div>
      )}

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        {/* LEFT: item entry and payment */}
        <div className="space-y-6 lg:col-span-7 print:hidden">
          {/* A disabled fieldset locks every box and button inside it after the sale is saved */}
          <fieldset disabled={saved} className="m-0 min-w-0 space-y-6 border-0 p-0">
            <div className="card">
              <div className="card-topbar" />
              <div className="mb-5 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-800 dark:text-slate-200">
                  <Sparkles className="h-4 w-4 text-violet-600" /> Item Entry
                </h2>
                <span className="rounded-full border border-violet-100 bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700 dark:border-slate-800 dark:bg-slate-950 dark:text-violet-400">
                  Receipt #{padNumber(number)}
                </span>
              </div>

              <form onSubmit={handleAddItem} className="grid grid-cols-1 items-end gap-4 sm:grid-cols-12">
                <div className="sm:col-span-6">
                  <label className="label" htmlFor="itemName">Item Name</label>
                  <input
                    id="itemName" ref={nameInput} type="text" autoComplete="off"
                    className="input" placeholder="e.g. USB-C Cable"
                    value={itemName} onChange={(e) => setItemName(e.target.value)}
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className="label" htmlFor="itemPrice">Price (₦)</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-3 font-medium text-slate-400">₦</span>
                    <input
                      id="itemPrice" type="number" inputMode="decimal" min="0" step="any"
                      className="input pl-8 font-mono" placeholder="0"
                      value={itemPrice} onChange={(e) => setItemPrice(e.target.value)}
                    />
                  </div>
                </div>
                <div className="sm:col-span-3">
                  <label className="label" htmlFor="itemQty">Qty</label>
                  <input
                    id="itemQty" type="number" inputMode="decimal" min="1" step="any"
                    className="input px-3 text-center font-mono"
                    value={itemQty} onChange={(e) => setItemQty(e.target.value)}
                  />
                </div>
                <div className="pt-2 sm:col-span-12">
                  <button type="submit" className="btn w-full bg-slate-900 text-white shadow-md hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 sm:w-auto">
                    <Plus className="h-4 w-4" /> Add to Sale
                  </button>
                </div>
              </form>

              <div className="mt-6 border-t border-slate-100 pt-6 dark:border-slate-800">
                <div className="mb-6 max-h-56 space-y-2.5 overflow-y-auto pr-1">
                  {items.length === 0 ? (
                    <p className="py-4 text-center text-sm italic text-slate-400 dark:text-slate-600">
                      No items added yet. Fill in the details above.
                    </p>
                  ) : (
                    items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3 text-sm dark:border-slate-800 dark:bg-slate-950/60">
                        <div>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">{item.name}</span>
                          <div className="text-xs text-slate-500 dark:text-slate-400">{formatMoney(item.price)} × {item.qty}</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-slate-900 dark:text-white">{formatMoney(item.price * item.qty)}</span>
                          <button
                            type="button" title="Remove" aria-label={'Remove ' + item.name}
                            onClick={() => removeItem(item.id)}
                            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Always dark, so the total stands out against either theme */}
                <div className="flex items-center justify-between rounded-2xl bg-slate-900 p-5 shadow-lg">
                  <span className="text-sm font-semibold tracking-wide text-slate-300">TOTAL DUE</span>
                  <span className="font-mono text-2xl font-bold tracking-tight text-violet-400">{formatMoney(total)}</span>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-topbar" />
              <h3 className="mb-5 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-800 dark:text-slate-200">
                <CreditCard className="h-4 w-4 text-violet-600" /> Payment Type
              </h3>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {METHODS.map(({ name, Icon }) => {
                  const active = payment === name
                  return (
                    <button
                      key={name} type="button" onClick={() => setPayment(name)}
                      className={
                        'flex items-center justify-center gap-2 rounded-xl border-2 px-4 py-3.5 text-sm font-medium transition-all ' +
                        (active
                          ? 'border-violet-600 bg-violet-600 text-white shadow-sm'
                          : 'border-slate-200 text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-600')
                      }
                    >
                      <Icon className="h-4 w-4" /> {name}
                    </button>
                  )
                })}
              </div>

              {payment === 'Cash' && (
                <div className="mt-5 space-y-2">
                  <label className="label" htmlFor="received">Cash tendered (₦), optional. Calculates change.</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-3 font-medium text-slate-400">₦</span>
                    <input
                      id="received" type="number" inputMode="decimal" min="0" step="any"
                      className="input pl-8 font-mono" placeholder="Amount given by customer..."
                      value={received} onChange={(e) => setReceived(e.target.value)}
                    />
                  </div>
                  {cash > 0 && total > 0 && (
                    <div className={'flex items-center justify-between px-2 pt-1 font-mono text-xs font-bold ' + (cash >= total ? 'text-emerald-500' : 'text-rose-500')}>
                      <span>{cash >= total ? 'Change due:' : 'Still short by:'}</span>
                      <span>{formatMoney(Math.abs(cash - total))}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-5 dark:border-slate-800 sm:flex-row sm:justify-end">
                <button type="button" className="btn-secondary" onClick={clearSale} disabled={items.length === 0}>
                  Clear Sale
                </button>
                <button
                  type="button"
                  onClick={completeSale}
                  disabled={items.length === 0}
                  className="btn bg-emerald-600 text-white shadow-md shadow-emerald-600/25 hover:bg-emerald-500"
                >
                  <CheckCircle className="h-4 w-4" /> Complete Sale &amp; Print
                </button>
              </div>
            </div>
          </fieldset>

          {saved && (
            <div className="flex flex-wrap gap-3">
              <button type="button" className="btn-secondary" onClick={() => window.print()}>
                <Printer className="h-4 w-4" /> Print again
              </button>
              <button type="button" className="btn-primary" onClick={startNewSale}>Start new sale</button>
            </div>
          )}
        </div>

        {/* RIGHT: live receipt */}
        <div className="lg:sticky lg:top-24 lg:col-span-5">
          <ReceiptPanel business={business} sale={previewSale} note="Real-time preview of what the thermal printer will output." />
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md print:hidden" role="dialog" aria-modal="true">
          <div className="card w-full max-w-sm text-center shadow-2xl">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-500">
              <CheckCircle className="h-8 w-8" />
            </div>
            <h3 className="mb-1 text-lg font-bold text-slate-900 dark:text-white">Sale Successful!</h3>
            <p className="muted mb-6 text-xs">Receipt #{padNumber(number)} saved and sent to the printer.</p>
            <div className="flex flex-wrap gap-3">
              <button type="button" className="btn-primary flex-1" onClick={startNewSale}>New Sale</button>
              <button type="button" className="btn-secondary" onClick={() => window.print()}>Print again</button>
              <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}