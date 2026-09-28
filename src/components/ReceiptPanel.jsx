import { Receipt as ReceiptIcon } from 'lucide-react'
import Receipt from './Receipt'

// The card that holds a receipt on screen. When printing, everything around
// the receipt is hidden ("print:hidden") so only the paper comes out.
//   note:     small caption under the receipt
//   children: extra buttons (hidden when printing)
export default function ReceiptPanel({ business, sale, note, children }) {
  const paper = business.paper === '58' ? '58' : '80'

  return (
    <div className="card flex flex-col items-center shadow-2xl print:border-0 print:bg-transparent print:p-0 print:shadow-none">
      <div className="mb-5 flex w-full items-center justify-between border-b border-slate-100 pb-3 text-slate-500 dark:border-slate-800 dark:text-slate-400 print:hidden">
        <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider">
          <ReceiptIcon className="h-4 w-4 text-indigo-500" /> Live Thermal Receipt
        </span>
        <span className="rounded-xl border border-slate-200 bg-slate-100 px-2.5 py-1 font-mono text-[10px] text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
          {paper}mm Thermal
        </span>
      </div>

      <Receipt business={business} sale={sale} />

      {note && <p className="mt-4 text-center text-[11px] italic text-slate-400 dark:text-slate-500 print:hidden">{note}</p>}
      {children && <div className="mt-4 print:hidden">{children}</div>}
    </div>
  )
}