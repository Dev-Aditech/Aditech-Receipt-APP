// A bolder receipt with a colour badge and a coloured top edge.
// Looks great on screen, in an emailed PDF, or on a colour printer.
// On a black-and-white thermal printer, the colours print as solid black.
import { calcTotal, formatMoney, lineTotal, padNumber } from '../utils/money'

export default function ModernReceipt({ business, sale, paper }) {
  const items = sale.items.filter((i) => (i.name || '').trim() || parseFloat(i.price) > 0)
  const total = calcTotal(sale.items)
  const received = parseFloat(sale.received)
  const showChange = sale.payment === 'Cash' && received > 0 && total > 0 && received >= total
  const initials = (business.name || '').trim().slice(0, 2).toUpperCase()

  const date = sale.date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  const time = sale.date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })

  return (
    <div
      className={
        'mx-auto w-full rounded-2xl border-t-8 border-indigo-600 bg-white p-5 font-mono text-slate-900 shadow-2xl ' +
        (paper === '58' ? 'text-[10px] ' : 'text-[11px] ') +
        'print:m-0 print:rounded-none print:border-0 print:px-[2mm] print:py-[4mm] print:shadow-none'
      }
      style={{ maxWidth: paper === '58' ? '58mm' : '76mm' }}
    >
      <div className="mb-3 space-y-1 text-center">
        {business.logo ? (
          <img
            src={business.logo}
            alt=""
            className="mx-auto mb-2 h-14 w-14 rounded-full border border-slate-200 object-contain bg-white p-1"
          />
        ) : (
          <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-tr from-indigo-600 to-purple-600 text-sm font-black text-white shadow">
            {initials}
          </div>
        )}
        <h2 className="break-words text-sm font-bold uppercase tracking-widest">{business.name}</h2>
        {business.address && <p className="text-indigo-400">{business.address}</p>}
        {business.phone && <p className="text-indigo-400">Tel: {business.phone}</p>}
      </div>

      <div className="my-3 border-b border-dashed border-slate-200" />

      <div className="flex justify-between font-bold">
        <span>Receipt #{padNumber(sale.number)}</span>
        <span>{date}</span>
      </div>
      <div className="flex justify-end text-slate-400">
        <span>{time}</span>
      </div>

      <div className="my-3 border-b border-dashed border-slate-200" />

      <div className="min-h-[60px] space-y-3">
        {items.length === 0 && <p className="py-6 text-center italic text-slate-400">No items in cart</p>}
        {items.map((item, index) => (
          <div key={index}>
            <p className="break-words font-bold leading-tight">{(item.name || '').trim() || 'Item'}</p>
            <div className="flex justify-between gap-2">
              <span className="text-slate-500">{parseFloat(item.qty) || 0} x {formatMoney(parseFloat(item.price) || 0)}</span>
              <span className="font-bold">{formatMoney(lineTotal(item))}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="my-3 border-b border-dashed border-slate-200" />

      <div className="space-y-1.5">
        <div className="flex justify-between text-sm font-bold">
          <span>TOTAL</span>
          <span>{formatMoney(total)}</span>
        </div>
        <div className="flex justify-between text-slate-500">
          <span>Payment</span>
          <span className="font-bold uppercase">{sale.payment}</span>
        </div>
        {showChange && (
          <>
            <div className="flex justify-between text-slate-500">
              <span>Cash received</span>
              <span>{formatMoney(received)}</span>
            </div>
            <div className="flex justify-between font-bold text-slate-600">
              <span>Change</span>
              <span>{formatMoney(received - total)}</span>
            </div>
          </>
        )}
      </div>

      {business.footer && (
        <>
          <div className="my-3 border-b border-dashed border-slate-200" />
          <p className="break-words text-center font-bold uppercase tracking-wide text-indigo-600">{business.footer}</p>
        </>
      )}
    </div>
  )
}