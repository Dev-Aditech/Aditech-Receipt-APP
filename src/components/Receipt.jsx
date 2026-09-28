import { calcTotal, formatMoney, lineTotal, padNumber } from '../utils/money'

// Draws one receipt on "paper". Used for the live preview, printing and reprints.
//   business: the store profile (name, address, phone, logo, footer, paper)
//   sale:     { number, date, items, payment, received }
export default function Receipt({ business, sale }) {
  const paper = business.paper === '58' ? '58' : '80'
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
        'mx-auto w-full rounded-2xl border border-slate-300 bg-white p-5 font-mono text-slate-900 shadow-2xl ' +
        (paper === '58' ? 'text-[10px] ' : 'text-[11px] ') +
        'print:m-0 print:rounded-none print:border-0 print:px-[2mm] print:py-[4mm] print:shadow-none'
      }
      // Real paper width: 58mm paper prints about 54mm, 80mm paper about 72mm
      style={{ maxWidth: paper === '58' ? '58mm' : '76mm' }}
    >
      {/* Tells the printer how wide the paper is */}
      <style>{`@media print { @page { size: ${paper}mm auto; margin: 0 } }`}</style>

      <div className="mb-3 space-y-1.5 text-center">
        {business.logo ? (
          <img src={business.logo} alt="" className="mx-auto mb-1 max-h-16 max-w-[60%] object-contain grayscale contrast-125" />
        ) : (
          // A simple badge with the store's initials (not printed)
          <div className="mx-auto mb-1 flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-xs font-black text-white shadow print:hidden">
            {initials}
          </div>
        )}
        <h2 className="break-words text-sm font-black uppercase tracking-widest">{business.name}</h2>
        {business.address && <p className="text-slate-600">{business.address}</p>}
        {business.phone && <p className="text-slate-600">Tel: {business.phone}</p>}
      </div>

      <div className="my-2.5 border-b border-dashed border-slate-400" />

      <div className="flex justify-between text-slate-600">
        <span>Receipt #{padNumber(sale.number)}</span>
        <span>{date}</span>
      </div>
      <div className="flex justify-end text-slate-600">
        <span>{time}</span>
      </div>

      <div className="my-2.5 border-b border-dashed border-slate-400" />

      <div className="my-2 min-h-[60px] space-y-2">
        {items.length === 0 && <p className="py-6 text-center italic text-slate-400">No items in cart</p>}
        {items.map((item, index) => (
          <div key={index}>
            <p className="break-words font-bold leading-tight text-slate-900">{(item.name || '').trim() || 'Item'}</p>
            <div className="flex justify-between gap-2 text-slate-700">
              <span>{parseFloat(item.qty) || 0} x {formatMoney(parseFloat(item.price) || 0)}</span>
              <span className="font-bold text-slate-900">{formatMoney(lineTotal(item))}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="my-2.5 border-b border-dashed border-slate-400" />

      <div className="space-y-1.5">
        <div className="flex justify-between pt-1 text-sm font-black text-slate-900">
          <span>TOTAL</span>
          <span>{formatMoney(total)}</span>
        </div>
        <div className="flex justify-between text-slate-600">
          <span>Payment</span>
          <span className="font-bold uppercase">{sale.payment}</span>
        </div>
        {showChange && (
          <>
            <div className="flex justify-between text-slate-600">
              <span>Cash received</span>
              <span>{formatMoney(received)}</span>
            </div>
            <div className="flex justify-between font-bold text-slate-700">
              <span>Change</span>
              <span>{formatMoney(received - total)}</span>
            </div>
          </>
        )}
      </div>

      {business.footer && (
        <>
          <div className="my-3 border-b border-dashed border-slate-400" />
          <p className="break-words text-center font-bold text-slate-700">{business.footer}</p>
        </>
      )}
    </div>
  )
}