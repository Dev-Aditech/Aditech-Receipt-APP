// A quiet, modern receipt: plain sans-serif type, thin solid lines,
// no logo badge. Good for a tidy, understated look.
import { calcTotal, formatMoney, lineTotal, padNumber } from '../utils/money'

export default function MinimalReceipt({ business, sale, paper }) {
  const items = sale.items.filter((i) => (i.name || '').trim() || parseFloat(i.price) > 0)
  const total = calcTotal(sale.items)
  const received = parseFloat(sale.received)
  const showChange = sale.payment === 'Cash' && received > 0 && total > 0 && received >= total

  const date = sale.date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  const time = sale.date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })

  return (
    <div
      className={
        'mx-auto w-full rounded-xl border border-slate-200 bg-white p-5 font-sans text-slate-900 shadow-2xl ' +
        (paper === '58' ? 'text-[10px] ' : 'text-[11px] ') +
        'print:m-0 print:rounded-none print:border-0 print:px-[2mm] print:py-[4mm] print:shadow-none'
      }
      style={{ maxWidth: paper === '58' ? '58mm' : '76mm' }}
    >
      <div className="mb-3 space-y-0.5">
        {business.logo && (
          <img src={business.logo} alt="" className="mb-2 max-h-12 max-w-[50%] object-contain" />
        )}
        <h2 className="break-words text-sm font-bold tracking-tight">{business.name}</h2>
        {business.address && <p className="text-slate-500">{business.address}</p>}
        {business.phone && <p className="text-slate-500">Tel: {business.phone}</p>}
      </div>

      <div className="my-3 border-b border-slate-200" />

      <div className="flex justify-between text-slate-500">
        <span>Receipt #{padNumber(sale.number)}</span>
        <span>{date} &middot; {time}</span>
      </div>

      <div className="my-3 border-b border-slate-200" />

      <div className="min-h-[60px] space-y-2.5">
        {items.length === 0 && <p className="py-6 text-center italic text-slate-400">No items in cart</p>}
        {items.map((item, index) => (
          <div key={index} className="flex justify-between gap-3">
            <div className="min-w-0">
              <p className="break-words font-medium leading-tight">{(item.name || '').trim() || 'Item'}</p>
              <p className="text-slate-400">{parseFloat(item.qty) || 0} &times; {formatMoney(parseFloat(item.price) || 0)}</p>
            </div>
            <span className="shrink-0 font-semibold">{formatMoney(lineTotal(item))}</span>
          </div>
        ))}
      </div>

      <div className="my-3 border-b border-slate-200" />

      <div className="space-y-1.5">
        <div className="flex justify-between text-sm font-bold">
          <span>Total</span>
          <span>{formatMoney(total)}</span>
        </div>
        <div className="flex justify-between text-slate-500">
          <span>Payment</span>
          <span className="font-medium">{sale.payment}</span>
        </div>
        {showChange && (
          <>
            <div className="flex justify-between text-slate-500">
              <span>Cash received</span>
              <span>{formatMoney(received)}</span>
            </div>
            <div className="flex justify-between font-medium text-slate-600">
              <span>Change</span>
              <span>{formatMoney(received - total)}</span>
            </div>
          </>
        )}
      </div>

      {business.footer && (
        <>
          <div className="my-3 border-b border-slate-200" />
          <p className="break-words text-center text-slate-500">{business.footer}</p>
        </>
      )}
    </div>
  )
}