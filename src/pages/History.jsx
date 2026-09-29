import { useEffect, useState } from 'react'
import { collection, limit, onSnapshot, orderBy, query } from 'firebase/firestore'
import { Clock, History as HistoryIcon, Printer, Search } from 'lucide-react'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'
import ReceiptPanel from '../components/ReceiptPanel'
import { formatMoney, padNumber } from '../utils/money'

export default function History() {
  const { user, business } = useAuth()
  const [sales, setSales] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState(null)
  const [search, setSearch] = useState('')

  // Watch the latest 100 sales, newest first
  useEffect(() => {
    const q = query(
      collection(db, 'businesses', user.uid, 'sales'),
      orderBy('createdAt', 'desc'),
      limit(100)
    )
    const stop = onSnapshot(
      q,
      (snap) => {
        setSales(
          snap.docs.map((d) => {
            const data = d.data()
            return { id: d.id, ...data, date: data.createdAt?.toDate?.() || new Date() }
          })
        )
        setLoading(false)
      },
      (err) => {
        console.error(err)
        setLoading(false)
      }
    )
    return stop // stop watching when we leave the page
  }, [user.uid])

  const todayText = new Date().toDateString()
  const todaySales = sales.filter((s) => s.date.toDateString() === todayText)
  const todayTotal = todaySales.reduce((sum, s) => sum + s.total, 0)

  const q = search.trim().toLowerCase()
  const shown = sales.filter(
    (s) => padNumber(s.number).includes(q) || s.payment.toLowerCase().includes(q)
  )
  const selected = sales.find((s) => s.id === selectedId)

  function reprint(sale) {
    setSelectedId(sale.id)
    // Short pause so the receipt appears on screen before the print window opens
    setTimeout(() => window.print(), 150)
  }

  return (
    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
      <div className="space-y-6 lg:col-span-8 print:hidden">
        <div className="grid grid-cols-2 gap-4">
          <div className="card p-5!">
            <p className="label">Today&apos;s sales</p>
            <p className="font-mono text-2xl font-black text-violet-600 dark:text-violet-400">{formatMoney(todayTotal)}</p>
          </div>
          <div className="card p-5!">
            <p className="label">Receipts today</p>
            <p className="font-mono text-2xl font-black text-slate-900 dark:text-white">{todaySales.length}</p>
          </div>
        </div>

        <div className="card">
          <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
                <HistoryIcon className="h-5 w-5 text-violet-600" /> Transaction History
              </h2>
              <p className="muted text-xs">View past sales and reprint receipts</p>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text" className="input py-2.5! pl-10 text-xs"
                placeholder="Search receipt # or method..."
                value={search} onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 font-semibold uppercase text-slate-500 dark:border-slate-800 dark:text-slate-400">
                  <th className="px-4 py-3">Receipt #</th>
                  <th className="px-4 py-3">Date &amp; Time</th>
                  <th className="px-4 py-3">Items</th>
                  <th className="px-4 py-3">Method</th>
                  <th className="px-4 py-3 text-right">Total</th>
                  <th className="px-4 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {loading && (
                  <tr><td colSpan="6" className="py-10 text-center italic text-slate-400">Loading...</td></tr>
                )}
                {!loading && shown.length === 0 && (
                  <tr>
                    <td colSpan="6" className="py-10 text-center italic text-slate-400 dark:text-slate-600">
                      {sales.length === 0 ? 'No sales yet. Receipts you print will appear here.' : 'No transactions match your search.'}
                    </td>
                  </tr>
                )}
                {shown.map((s) => (
                  <tr
                    key={s.id}
                    onClick={() => setSelectedId(s.id)}
                    className={'cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-950/50 ' + (s.id === selectedId ? 'bg-slate-50 dark:bg-slate-950/50' : '')}
                  >
                    <td className="px-4 py-4 font-mono font-bold text-violet-600 dark:text-violet-400">#{padNumber(s.number)}</td>
                    <td className="whitespace-nowrap px-4 py-4 text-slate-700 dark:text-slate-300">
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-slate-400" />
                        {s.date.toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-mono text-slate-700 dark:text-slate-300">
                      {s.items.reduce((sum, i) => sum + i.qty, 0)}
                    </td>
                    <td className="px-4 py-4">
                      <span className="rounded-xl border border-purple-100 bg-purple-50 px-3 py-1 text-[11px] font-bold text-purple-700 dark:border-slate-800 dark:bg-slate-950 dark:text-purple-400">
                        {s.payment}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right font-mono text-sm font-black text-slate-900 dark:text-white">{formatMoney(s.total)}</td>
                    <td className="px-4 py-4 text-center">
                      <button
                        type="button"
                        className="btn-secondary gap-1.5! px-3! py-1.5!"
                        onClick={(e) => {
                          e.stopPropagation() // do not also trigger the row click
                          reprint(s)
                        }}
                      >
                        <Printer className="h-3.5 w-3.5 text-violet-600" /> Reprint
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="lg:sticky lg:top-24 lg:col-span-4">
        {selected ? (
          <ReceiptPanel business={business} sale={selected}>
            <button type="button" className="btn-primary" onClick={() => window.print()}>
              <Printer className="h-4 w-4" /> Reprint receipt
            </button>
          </ReceiptPanel>
        ) : (
          <div className="card text-center print:hidden">
            <p className="muted text-sm">Choose a receipt on the left to view it or print it again.</p>
          </div>
        )}
      </div>
    </div>
  )
}