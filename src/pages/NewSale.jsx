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
        <div className="fixed right-4 top-20 z-50 flex items-center gap-2 rounded-xl bg-rose-500 px-4 py-2.5 text-xs font-bold text-white shadow-2xl print:hidden" role="alert">
          <span>⚠️</span> {toast}
        </div>
      )}

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        {/* LEFT: item entry, payment, complete button */}
        <div className="space-y-6 lg:col-span-7 print:hidden">
          {/* A disabled fieldset locks every box and button inside it after the sale is saved */}
          <fieldset disabled={saved} className="m-0 min-w-0 space-y-6 border-0 p-0">
            <div className="card">
              <div className="card-bar bg-linear-to-b from-indigo-500 to-purple-500" />
              <div className="mb-4 flex items-center justify-between">
                <h2 className="card-title !mb-0">
                  <Sparkles className="h-4 w-4 text-indigo-500" /> Item Entry
                </h2>
                <span className="rounded-xl border border-slate-200 bg-slate-100 px-3 py-1 font-mono text-xs text-indigo-600 dark:border-slate-800 dark:bg-slate-950 dark:text-indigo-400">
                  Receipt #{padNumber(number)}
                </span>
              </div>

              <form onSubmit={handleAddItem} className="space-y-4">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-12">
                  <div className="sm:col-span-6">
                    <label className="label" htmlFor="itemName">Item Name</label>
                    <input
                      id="itemName" ref={nameInput} type="text" autoComplete="off"
                      className="input" placeholder="e.g. USB-C Cable"
                      value={itemName} onChange={(e) => setItemName(e.target.value)}
                    />
                  </div>
                  <div className="sm:col-span-4">
                    <label className="label" htmlFor="itemPrice">Price (₦)</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-3 font-bold text-slate-400">₦</span>
                      <input
                        id="itemPrice" type="number" inputMode="decimal" min="0" step="any"
                        className="input pl-8 font-mono" placeholder="0"
                        value={itemPrice} onChange={(e) => setItemPrice(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="label" htmlFor="itemQty">Qty</label>
                    <input
                      id="itemQty" type="number" inputMode="decimal" min="1" step="any"
                      className="input px-3 text-center font-mono"
                      value={itemQty} onChange={(e) => setItemQty(e.target.value)}
                    />
                  </div>
                </div>

                <button type="submit" className="btn bg-slate-800 text-white shadow-md hover:bg-slate-700 dark:border dark:border-slate-700">
                  <Plus className="h-4 w-4 text-indigo-400" /> Add to Sale
                </button>
              </form>

              <div className="mt-6 border-t border-slate-100 pt-4 dark:border-slate-800">
                <div className="max-h-56 space-y-2.5 overflow-y-auto pr-1">
                  {items.length === 0 ? (
                    <p className="py-8 text-center text-xs italic text-slate-400 dark:text-slate-600">
                      No items added yet. Fill in the details above.
                    </p>
                  ) : (
                    items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-3.5 transition-colors hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950/60 dark:hover:border-slate-700">
                        <div className="flex-1 pr-3">
                          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{item.name}</h4>
                          <p className="muted font-mono text-[11px]">{formatMoney(item.price)} × {item.qty}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-mono text-sm font-black text-indigo-500 dark:text-indigo-400">
                            {formatMoney(item.price * item.qty)}
                          </span>
                          <button
                            type="button" title="Remove" aria-label={'Remove ' + item.name}
                            onClick={() => removeItem(item.id)}
                            className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:text-slate-500 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between rounded-2xl border border-indigo-100 bg-indigo-50/50 px-5 py-4 dark:border-slate-800 dark:bg-slate-950">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-400">Total Due</span>
                  <span className="font-mono text-2xl font-black text-indigo-600 dark:text-indigo-400">{formatMoney(total)}</span>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-bar bg-linear-to-b from-purple-500 to-pink-500" />
              <h3 className="card-title !mb-3">
                <CreditCard className="h-4 w-4 text-purple-500" /> Payment Type
              </h3>

              <div className="seg mb-4">
                {METHODS.map(({ name, Icon }) => (
                  <button key={name} type="button" className="seg-btn" aria-pressed={payment === name} onClick={() => setPayment(name)}>
                    <Icon className="h-3.5 w-3.5" /> {name}
                  </button>
                ))}
              </div>

              {payment === 'Cash' && (
                <div className="space-y-2">
                  <label className="label" htmlFor="received">Cash tendered (₦), optional. Calculates change.</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-3 font-bold text-slate-400">₦</span>
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
            </div>
          </fieldset>

          {saved ? (
            <div className="flex flex-wrap gap-3">
              <button type="button" className="btn-secondary" onClick={() => window.print()}>
                <Printer className="h-4 w-4" /> Print again
              </button>
              <button type="button" className="btn-primary" onClick={startNewSale}>Start new sale</button>
            </div>
          ) : (
            <button type="button" className="btn-primary btn-big" disabled={items.length === 0} onClick={completeSale}>
              <Printer className="h-5 w-5" /> Complete Sale &amp; Print Receipt
            </button>
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