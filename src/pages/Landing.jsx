// The public home page. Visitors see this first; logged-in users are sent to /app.
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, Briefcase, Building2, Check, CheckCircle2, ChevronDown, ChevronRight,
  CreditCard, History, Laptop, Menu, Package, Plus, Printer, Receipt, Settings,
  ShieldCheck, Smartphone, Sparkles, Store, TrendingUp, X,
} from 'lucide-react'
import { formatMoney } from '../utils/money'

// ---- Page content lives here, so it is easy to edit without touching the layout ----
const NAV_LINKS = [
  ['Features', '#features'],
  ['How It Works', '#how-it-works'],
  ['Customization', '#customization'],
  ['Businesses', '#businesses'],
  ['Pricing', '#pricing'],
  ['FAQ', '#faq'],
]

const STRIP = [
  { title: 'Professional receipts', icon: Receipt },
  { title: 'Custom business branding', icon: Store },
  { title: 'Fast checkout', icon: TrendingUp },
  { title: 'Thermal printer support', icon: Printer },
  { title: 'Sales history', icon: History },
  { title: 'Cash, Transfer & POS', icon: CreditCard },
]

const FEATURES = [
  { title: 'Custom Business Branding', icon: Store, desc: 'Upload your logo and automatically include your business name, address, phone number and a custom message on every receipt.' },
  { title: 'Fast Receipt Creation', icon: Receipt, desc: 'Type the item, price and quantity. The total is worked out for you, and for cash sales the change too.' },
  { title: 'Thermal Printing', icon: Printer, desc: 'Receipts are sized for 58mm and 80mm thermal printers, so they come out clean on the paper roll.' },
  { title: 'Sales History', icon: History, desc: 'Every receipt is saved. See the sales you made today and reprint any past receipt in one click.' },
  { title: 'Saved Products', icon: Package, soon: true, desc: 'Save the items you sell often, with their prices, so you never retype them.' },
  { title: 'Business Ready', icon: Briefcase, desc: 'Built for shops, supermarkets, pharmacies, restaurants, boutiques, POS operators and service businesses.' },
]

const STEPS = [
  { step: '01', title: 'Set up your business', desc: 'Create your account, add your business details, and upload your logo.' },
  { step: '02', title: 'Create your receipt', desc: 'Type the items sold with their prices and quantities, then choose the payment method.' },
  { step: '03', title: 'Print and go', desc: 'Print your receipt on your thermal printer. It is saved automatically in your sales history.' },
]

const BUSINESSES = [
  { name: 'Supermarkets', desc: 'Fast checkout and itemized totals.', icon: Store },
  { name: 'Mini Marts', desc: 'Effortless daily sales recording.', icon: Package },
  { name: 'Pharmacies', desc: 'Clear receipts for every sale.', icon: ShieldCheck },
  { name: 'Boutiques', desc: 'Stylish branding for fashion retail.', icon: Briefcase },
  { name: 'Restaurants', desc: 'Food and drink itemized billing.', icon: TrendingUp },
  { name: 'Electronics Shops', desc: 'Neat receipts for every device sold.', icon: Laptop },
  { name: 'Beauty Businesses', desc: 'Salon and spa service receipts.', icon: Sparkles },
  { name: 'POS Operators', desc: 'Receipts for transfers and withdrawals.', icon: History },
  { name: 'Service Businesses', desc: 'Professional service receipts.', icon: Building2 },
]

const FREE_FEATURES = [
  'Create receipts instantly',
  'Your logo and business details on every receipt',
  '58mm and 80mm thermal receipt printing',
  'Sales history with daily total',
  'Reprint any past receipt',
]
const PRO_FEATURES = [
  'Saved product list',
  'Multiple staff accounts and cashier roles',
  'Advanced sales analytics and reports',
  'Custom receipt templates',
  'Priority support',
]

const FAQS = [
  { q: 'What is Aditech Receipt?', a: 'Aditech Receipt is a web-based receipt creation and printing platform for small businesses, shops, supermarkets, pharmacies, restaurants, boutiques and POS operators.' },
  { q: 'Can I add my business logo?', a: 'Yes. You can add your logo, business name, phone number, address and a custom message at the bottom of every receipt.' },
  { q: 'Can I print using a thermal printer?', a: 'Yes. Receipts are sized for 58mm and 80mm thermal printers. You print from your browser, so it works with any printer installed on your computer. Results depend on your printer and its settings.' },
  { q: 'Do I need special hardware?', a: 'No. You only need a device with a web browser. To print a paper receipt you need a thermal printer, or any printer your computer can print to.' },
  { q: 'Can I save my products?', a: 'Not yet. For now you type the item name, price and quantity for each sale, which takes a few seconds. A saved product list is coming soon.' },
  { q: 'Can I see previous receipts?', a: 'Yes. Every receipt is saved in your sales history, where you can see today\'s total and reprint any receipt.' },
  { q: 'Can I use it on my phone?', a: 'Yes. The site works on phones and tablets. Printing is usually easiest from a computer connected to your printer.' },
]

const SAMPLE_SALES = [
  { id: '#0048', items: '3 items', total: 24000, time: '12:42 PM', method: 'Cash' },
  { id: '#0047', items: '1 item', total: 8500, time: '12:15 PM', method: 'Transfer' },
  { id: '#0046', items: '5 items', total: 42000, time: '11:30 AM', method: 'POS' },
]

function Heading({ kicker, title, children, dark }) {
  return (
    <div className="mx-auto mb-16 max-w-3xl text-center">
      <h2 className={'mb-2 text-sm font-bold uppercase tracking-wider ' + (dark ? 'text-indigo-400' : 'text-indigo-600')}>{kicker}</h2>
      <h3 className={'text-3xl font-extrabold tracking-tight sm:text-4xl ' + (dark ? 'text-white' : 'text-slate-900')}>{title}</h3>
      {children && <p className="mt-4 text-lg text-slate-600">{children}</p>}
    </div>
  )
}

export default function Landing() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState(0)

  // Interactive demo in the hero section
  const [demoItems, setDemoItems] = useState([
    { name: 'Rice (50kg)', qty: 2, price: 45000 },
    { name: 'Vegetable Oil (4L)', qty: 1, price: 12500 },
    { name: 'Tomato Paste (Ctn)', qty: 3, price: 8200 },
  ])
  const [newName, setNewName] = useState('')
  const [newQty, setNewQty] = useState(1)
  const [newPrice, setNewPrice] = useState(2500)
  const [adding, setAdding] = useState(false)
  const [demoNote, setDemoNote] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const total = demoItems.reduce((sum, i) => sum + i.qty * i.price, 0)
  const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  const now = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })

  function addDemoItem(e) {
    e.preventDefault()
    if (!newName.trim()) return
    setDemoItems([...demoItems, { name: newName.trim(), qty: newQty, price: newPrice }])
    setNewName('')
    setAdding(false)
  }

  function demoPrint() {
    setDemoNote(true)
    setTimeout(() => setDemoNote(false), 4000)
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased selection:bg-indigo-600 selection:text-white">
      {/* ---------- Navigation ---------- */}
      <nav className={'fixed inset-x-0 top-0 z-50 transition-all duration-300 ' + (scrolled ? 'border-b border-slate-200/80 bg-white/80 py-3 shadow-sm backdrop-blur-md' : 'bg-transparent py-5')}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <a href="#top" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-200">
              <Printer className="h-5 w-5" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900">Aditech Receipt</span>
              <span className="-mt-1 block text-[10px] font-medium uppercase tracking-widest text-indigo-600">Create. Customize. Print.</span>
            </div>
          </a>

          <div className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            {NAV_LINKS.map(([label, href]) => (
              <a key={href} href={href} className="transition-colors hover:text-indigo-600">{label}</a>
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <Link to="/login" className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:text-slate-900">Sign In</Link>
            <Link to="/register" className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-200 transition-all hover:bg-indigo-700">
              Get Started Free <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <button type="button" onClick={() => setMenuOpen(!menuOpen)} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden" aria-label="Toggle menu">
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {menuOpen && (
          <div className="absolute left-0 right-0 top-full flex flex-col gap-4 border-b border-slate-200 bg-white px-6 py-4 shadow-xl md:hidden">
            {NAV_LINKS.map(([label, href]) => (
              <a key={href} href={href} onClick={() => setMenuOpen(false)} className="py-1 text-base font-medium text-slate-700 hover:text-indigo-600">{label}</a>
            ))}
            <div className="flex flex-col gap-2 border-t border-slate-100 pt-2">
              <Link to="/login" className="w-full rounded-xl bg-slate-100 py-2.5 text-center font-semibold text-slate-700">Sign In</Link>
              <Link to="/register" className="w-full rounded-xl bg-indigo-600 py-2.5 text-center font-semibold text-white shadow-md">Get Started Free</Link>
            </div>
          </div>
        )}
      </nav>

      {/* ---------- Hero ---------- */}
      <section id="top" className="relative overflow-hidden bg-linear-to-b from-indigo-50/50 via-white to-white pb-20 pt-32 md:pb-32 md:pt-40">
        <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-96 w-full max-w-7xl -translate-x-1/2 rounded-full bg-indigo-200/20 blur-3xl" />
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3.5 py-1.5 text-xs font-semibold text-indigo-700 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-indigo-600" /> Simple receipts. Professional business.
          </div>

          <h1 className="mx-auto max-w-4xl text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
            Create professional receipts in <span className="text-indigo-600">seconds.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 sm:text-xl">
            Aditech Receipt helps businesses create, customize and print professional receipts with their own logo and business details. Just type the items, and print.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/register" className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-indigo-200 transition-all hover:scale-[1.02] hover:bg-indigo-700 active:scale-[0.98] sm:w-auto">
              Get Started Free <ArrowRight className="h-5 w-5" />
            </Link>
            <a href="#how-it-works" className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-8 py-4 text-base font-semibold text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 sm:w-auto">
              See How It Works
            </a>
          </div>

          <div className="mt-6 flex items-center justify-center gap-6 text-xs font-medium text-slate-500">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> No complicated setup</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Built for small businesses</span>
          </div>

          {/* Interactive demo */}
          <div className="mx-auto mt-16 max-w-5xl">
            <div className="relative rounded-2xl border border-slate-800 bg-slate-900 p-2 shadow-2xl sm:p-4">
              <div className="absolute -right-3 -top-3 flex items-center gap-1 rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-white shadow-md">
                <Check className="h-3.5 w-3.5" /> Ready to print
              </div>
              <div className="absolute -left-3 -top-3 flex items-center gap-1 rounded-full bg-indigo-600 px-3 py-1 text-xs font-bold text-white shadow-md">
                <Receipt className="h-3.5 w-3.5" /> Try the demo
              </div>

              <div className="grid grid-cols-1 overflow-hidden rounded-xl border border-slate-200 bg-white text-left shadow-inner lg:grid-cols-12">
                <div className="flex flex-col justify-between border-r border-slate-200 bg-slate-50 p-4 sm:p-6 lg:col-span-7">
                  <div>
                    <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500 text-lg font-bold text-white shadow-sm">A</div>
                        <div>
                          <h3 className="text-sm font-bold text-slate-900 sm:text-base">Aditech Supermarket</h3>
                          <p className="text-xs text-slate-500">Ikeja, Lagos • 0803 123 4567</p>
                        </div>
                      </div>
                      <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-800">Demo</span>
                    </div>

                    <div className="mb-3 flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">Items sold</h4>
                      <button type="button" onClick={() => setAdding(!adding)} className="flex items-center gap-1 rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700">
                        <Plus className="h-3.5 w-3.5" /> Add Item
                      </button>
                    </div>

                    {adding && (
                      <form onSubmit={addDemoItem} className="mb-4 flex flex-col gap-2 rounded-xl border border-indigo-200 bg-white p-3 shadow-sm">
                        <input type="text" required placeholder="Product name (e.g. Milk)" value={newName} onChange={(e) => setNewName(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:border-indigo-500 focus:outline-none" />
                        <div className="grid grid-cols-2 gap-2">
                          <input type="number" min="1" placeholder="Qty" value={newQty} onChange={(e) => setNewQty(parseInt(e.target.value) || 1)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:border-indigo-500 focus:outline-none" />
                          <input type="number" min="0" placeholder="Price (₦)" value={newPrice} onChange={(e) => setNewPrice(parseInt(e.target.value) || 0)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:border-indigo-500 focus:outline-none" />
                        </div>
                        <div className="mt-1 flex justify-end gap-2">
                          <button type="button" onClick={() => setAdding(false)} className="rounded-lg px-3 py-1 text-xs text-slate-600 hover:bg-slate-100">Cancel</button>
                          <button type="submit" className="rounded-lg bg-indigo-600 px-3 py-1 text-xs font-semibold text-white hover:bg-indigo-700">Add to Receipt</button>
                        </div>
                      </form>
                    )}

                    <div className="mb-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                      <div className="grid grid-cols-12 bg-slate-100 px-4 py-2 text-[11px] font-bold uppercase text-slate-600">
                        <div className="col-span-6">Product</div>
                        <div className="col-span-2 text-center">Qty</div>
                        <div className="col-span-4 text-right">Amount</div>
                      </div>
                      <div className="max-h-40 divide-y divide-slate-100 overflow-y-auto">
                        {demoItems.map((item, index) => (
                          <div key={index} className="grid grid-cols-12 items-center px-4 py-2.5 text-xs">
                            <div className="col-span-6 truncate font-medium text-slate-800">{item.name}</div>
                            <div className="col-span-2 text-center font-semibold text-slate-600">{item.qty}</div>
                            <div className="col-span-4 text-right font-semibold text-slate-900">{formatMoney(item.qty * item.price)}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm">
                    <div className="mb-3 flex justify-between text-sm font-bold text-slate-900">
                      <span>Total Amount</span>
                      <span className="text-indigo-600">{formatMoney(total)}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <div className="rounded-md bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600">
                        Payment: <span className="font-bold text-slate-900">Cash</span>
                      </div>
                      <button type="button" onClick={demoPrint} className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-indigo-700">
                        <Printer className="h-3.5 w-3.5" /> Print Receipt
                      </button>
                    </div>
                    {demoNote && (
                      <p className="mt-2 text-center text-[11px] font-bold text-indigo-600">
                        This is a demo. <Link to="/register" className="underline">Register free</Link> to print real receipts.
                      </p>
                    )}
                  </div>
                </div>

                <div className="relative flex flex-col items-center justify-center overflow-hidden bg-slate-900 p-6 lg:col-span-5">
                  <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] opacity-10 [background-size:16px_16px]" />
                  <div className="relative w-full max-w-[260px] rounded-sm border-t-4 border-amber-600 bg-amber-50 p-5 font-mono text-[11px] text-slate-900 shadow-2xl">
                    <div className="border-b border-dashed border-slate-300 pb-3 text-center">
                      <div className="text-sm font-bold uppercase tracking-wide">Aditech Supermarket</div>
                      <div className="mt-0.5 text-[10px] text-slate-600">Ikeja, Lagos</div>
                      <div className="text-[10px] text-slate-600">Tel: 0803 123 4567</div>
                    </div>
                    <div className="space-y-0.5 border-b border-dashed border-slate-300 py-2 text-[10px]">
                      <div className="flex justify-between"><span>Receipt #0089</span><span>{today}</span></div>
                      <div className="flex justify-end"><span>{now}</span></div>
                    </div>
                    <div className="border-b border-dashed border-slate-300 py-2">
                      <div className="grid grid-cols-12 pb-1 text-[10px] font-bold">
                        <span className="col-span-6">ITEM</span><span className="col-span-2 text-center">QTY</span><span className="col-span-4 text-right">AMT</span>
                      </div>
                      {demoItems.map((item, idx) => (
                        <div key={idx} className="grid grid-cols-12 py-0.5 text-[10px]">
                          <span className="col-span-6 truncate">{item.name}</span>
                          <span className="col-span-2 text-center">{item.qty}</span>
                          <span className="col-span-4 text-right">{formatMoney(item.qty * item.price)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-b border-dashed border-slate-300 py-2">
                      <div className="flex justify-between text-sm font-bold"><span>TOTAL</span><span>{formatMoney(total)}</span></div>
                    </div>
                    <div className="space-y-0.5 border-b border-dashed border-slate-300 py-2 text-[10px]">
                      <div className="flex justify-between"><span>PAYMENT:</span><span className="font-bold">CASH</span></div>
                      <div className="flex justify-between"><span>CASH RECEIVED:</span><span>{formatMoney(total)}</span></div>
                      <div className="flex justify-between"><span>CHANGE:</span><span>₦0</span></div>
                    </div>
                    <div className="pt-3 text-center text-[10px] text-slate-600">
                      <p className="font-bold">THANK YOU FOR YOUR PATRONAGE!</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Quick strip ---------- */}
      <section className="border-y border-slate-200 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-8 text-xs font-bold uppercase tracking-widest text-slate-400">Everything you need to handle everyday receipts</h2>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
            {STRIP.map(({ title, icon: Icon }) => (
              <div key={title} className="flex flex-col items-center rounded-xl border border-slate-100 bg-slate-50 p-4 transition-colors hover:bg-indigo-50/50">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600"><Icon className="h-5 w-5" /></div>
                <span className="text-center text-xs font-bold text-slate-800">{title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Features ---------- */}
      <section id="features" className="scroll-mt-16 bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Heading kicker="Powerful Features" title="Everything you need to create better receipts">
            Designed to make everyday sales simpler for businesses of every size.
          </Heading>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ title, desc, icon: Icon, soon }) => (
              <div key={title} className="group rounded-2xl border border-slate-200/80 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                  <Icon className="h-6 w-6" />
                </div>
                <h4 className="mb-2 flex items-center gap-2 text-xl font-bold text-slate-900">
                  {title}
                  {soon && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-800">Soon</span>}
                </h4>
                <p className="text-sm leading-relaxed text-slate-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- How it works ---------- */}
      <section id="how-it-works" className="scroll-mt-16 border-t border-slate-200 bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Heading kicker="Simple Workflow" title="From sale to receipt in three simple steps" />
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.step} className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50 p-8">
                <div>
                  <span className="mb-4 block text-4xl font-black text-indigo-200">{s.step}</span>
                  <h4 className="mb-2 text-xl font-bold text-slate-900">{s.title}</h4>
                  <p className="text-sm leading-relaxed text-slate-600">{s.desc}</p>
                </div>
                <div className="mt-8 border-t border-slate-200/60 pt-4 text-xs font-semibold text-indigo-600">Step {s.step} of 03</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Customization ---------- */}
      <section id="customization" className="scroll-mt-16 overflow-hidden bg-slate-900 py-24 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <span className="mb-2 block text-sm font-bold uppercase tracking-wider text-indigo-400">Brand Identity</span>
              <h3 className="mb-6 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Make every receipt yours.</h3>
              <p className="mb-8 text-base leading-relaxed text-slate-300">
                Your receipt should represent your business. Add your logo, business name, phone number, address and your own thank-you message to build trust with every customer.
              </p>
              <Link to="/register" className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-indigo-900/40 transition-all hover:bg-indigo-700">
                Customize Your Business <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="flex justify-center lg:col-span-6">
              <div className="w-full max-w-sm rounded-xl border-t-8 border-indigo-600 bg-white p-6 font-mono text-xs text-slate-900 shadow-2xl">
                <div className="border-b border-dashed border-slate-200 pb-4 text-center">
                  <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-xl font-bold text-white">AP</div>
                  <div className="text-base font-bold uppercase">Aditech Pharmacy Ltd</div>
                  <div className="mt-0.5 text-[11px] text-slate-500">Plot 45, Ozumba Mbadiwe, Victoria Island</div>
                  <div className="text-[11px] text-slate-500">Tel: +234 801 234 5678</div>
                </div>
                <div className="space-y-1 border-b border-dashed border-slate-200 py-3">
                  <div className="flex justify-between font-semibold"><span>Receipt #0121</span><span>28 Sep 2026</span></div>
                  <div className="flex justify-end text-slate-500"><span>13:57</span></div>
                </div>
                <div className="border-b border-dashed border-slate-200 py-3">
                  {[['Paracetamol 500mg', '4 x ₦500', '₦2,000'], ['Vitamin C Syrup', '1 x ₦3,500', '₦3,500'], ['Digital Thermometer', '1 x ₦6,000', '₦6,000']].map(([name, calc, amt]) => (
                    <div key={name} className="py-1">
                      <div className="font-bold">{name}</div>
                      <div className="flex justify-between text-slate-600"><span>{calc}</span><span className="font-bold text-slate-900">{amt}</span></div>
                    </div>
                  ))}
                </div>
                <div className="space-y-1 border-b border-dashed border-slate-200 py-3">
                  <div className="flex justify-between font-bold"><span>TOTAL</span><span>₦11,500</span></div>
                  <div className="flex justify-between text-[11px]"><span>Payment</span><span className="font-bold">POS</span></div>
                </div>
                <div className="pt-4 text-center">
                  <p className="font-bold text-indigo-600">GET WELL SOON!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Printer ---------- */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <span className="mb-2 block text-sm font-bold uppercase tracking-wider text-indigo-600">Hardware Compatible</span>
          <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Ready for the printer.</h2>
          <p className="mx-auto mb-12 max-w-2xl text-lg text-slate-600">
            Receipts are sized for the thermal paper rolls used in shops every day.
          </p>
          <div className="mx-auto mb-10 max-w-4xl rounded-2xl border border-slate-200 bg-slate-50 p-8 shadow-sm sm:p-12">
            <div className="flex flex-col items-center justify-center gap-4 text-sm font-bold text-slate-700 sm:gap-6 md:flex-row">
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-4 shadow-sm"><Laptop className="h-5 w-5 text-indigo-600" /> Website</div>
              <ChevronRight className="hidden h-5 w-5 text-slate-400 md:block" />
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-4 shadow-sm"><Smartphone className="h-5 w-5 text-indigo-600" /> Computer / Phone</div>
              <ChevronRight className="hidden h-5 w-5 text-slate-400 md:block" />
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-4 shadow-sm"><Printer className="h-5 w-5 text-indigo-600" /> Thermal Printer</div>
              <ChevronRight className="hidden h-5 w-5 text-slate-400 md:block" />
              <div className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-4 text-white shadow-md shadow-indigo-200"><Receipt className="h-5 w-5" /> Clean Receipt</div>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-semibold text-slate-700">
            <span className="rounded-lg border border-slate-200 bg-slate-100 px-4 py-2">58mm Thermal</span>
            <span className="rounded-lg border border-slate-200 bg-slate-100 px-4 py-2">80mm Thermal</span>
          </div>
        </div>
      </section>

      {/* ---------- Businesses ---------- */}
      <section id="businesses" className="scroll-mt-16 border-t border-slate-200 bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Heading kicker="Versatile Platform" title="Built for businesses like yours" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {BUSINESSES.map(({ name, desc, icon: Icon }) => (
              <div key={name} className="flex items-start gap-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all hover:border-indigo-300">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600"><Icon className="h-5 w-5" /></div>
                <div>
                  <h4 className="mb-1 text-base font-bold text-slate-900">{name}</h4>
                  <p className="text-xs leading-relaxed text-slate-600">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Dashboard preview ---------- */}
      <section id="dashboard-preview" className="scroll-mt-16 border-t border-slate-200 bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Heading kicker="Complete Platform" title="More than a receipt generator">
            Every receipt is saved in your sales history, with today's total at a glance.
          </Heading>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-2 shadow-2xl sm:p-4">
            <div className="grid min-h-[440px] grid-cols-1 overflow-hidden rounded-xl bg-slate-950 text-left text-slate-200 lg:grid-cols-12">
              <div className="hidden flex-col justify-between border-r border-slate-800 bg-slate-900 p-6 lg:col-span-3 lg:flex">
                <div>
                  <div className="mb-8 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white"><Printer className="h-4 w-4" /></div>
                    <span className="text-base font-bold text-white">Aditech Receipt</span>
                  </div>
                  <div className="space-y-1 text-xs font-medium">
                    <div className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-slate-400"><Receipt className="h-4 w-4" /> New Sale</div>
                    <div className="flex items-center gap-3 rounded-lg bg-indigo-600 px-3 py-2.5 font-semibold text-white"><History className="h-4 w-4" /> History</div>
                    <div className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-slate-400"><Settings className="h-4 w-4" /> Settings</div>
                    <div className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-slate-500"><Package className="h-4 w-4" /> Products <span className="ml-auto rounded bg-amber-500/20 px-1.5 py-0.5 text-[9px] font-bold uppercase text-amber-400">Soon</span></div>
                  </div>
                </div>
                <div className="flex items-center gap-2 border-t border-slate-800 pt-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-indigo-400">AD</div>
                  <p className="text-xs font-bold text-white">Your Store</p>
                </div>
              </div>

              <div className="bg-slate-900 p-6 sm:p-8 lg:col-span-9">
                <div className="mb-8 flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <h4 className="text-xl font-bold text-white">Sales History</h4>
                    <p className="text-xs text-slate-400">Review past receipts and print copies.</p>
                  </div>
                  <span className="rounded-full border border-slate-700 px-3 py-1 text-[11px] font-semibold text-slate-400">Sample data</span>
                </div>

                <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="rounded-xl border border-slate-700/60 bg-slate-800/60 p-4">
                    <p className="mb-1 text-xs text-slate-400">Today's sales</p>
                    <h3 className="text-2xl font-black text-white">₦74,500</h3>
                  </div>
                  <div className="rounded-xl border border-slate-700/60 bg-slate-800/60 p-4">
                    <p className="mb-1 text-xs text-slate-400">Receipts today</p>
                    <h3 className="text-2xl font-black text-white">3</h3>
                  </div>
                  <div className="rounded-xl border border-slate-700/60 bg-slate-800/60 p-4">
                    <p className="mb-1 text-xs text-slate-400">Receipt paper</p>
                    <h3 className="text-2xl font-black text-white">80mm</h3>
                  </div>
                </div>

                <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
                  <div className="border-b border-slate-800 p-4 text-sm font-bold text-white">Recent receipts</div>
                  <div className="divide-y divide-slate-800 text-xs">
                    {SAMPLE_SALES.map((s) => (
                      <div key={s.id} className="flex items-center justify-between gap-2 p-3.5">
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-indigo-400">{s.id}</span>
                          <span className="text-slate-500">{s.items}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-bold text-white">{formatMoney(s.total)}</span>
                          <span className="hidden text-slate-400 sm:inline">{s.time}</span>
                          <span className="rounded bg-purple-500/10 px-2 py-0.5 text-[10px] font-semibold text-purple-400">{s.method}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Pricing ---------- */}
      <section id="pricing" className="scroll-mt-16 border-t border-slate-200 bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Heading kicker="Simple Pricing" title="Transparent plans for your business">
            Start free and scale when you need advanced tools.
          </Heading>
          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
            <div className="relative flex flex-col justify-between rounded-2xl border-2 border-indigo-600 bg-white p-8 shadow-xl">
              <div className="absolute -top-4 right-8 rounded-full bg-indigo-600 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">Available now</div>
              <div>
                <h4 className="mb-2 text-2xl font-black text-slate-900">Free</h4>
                <div className="mb-6 flex items-baseline gap-1">
                  <span className="text-4xl font-black text-slate-900">₦0</span>
                  <span className="text-sm text-slate-500">/ forever</span>
                </div>
                <p className="mb-6 text-xs font-medium text-slate-600">For businesses getting started.</p>
                <div className="mb-8 space-y-3 text-sm text-slate-700">
                  {FREE_FEATURES.map((f) => (
                    <div key={f} className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" /><span>{f}</span></div>
                  ))}
                </div>
              </div>
              <Link to="/register" className="w-full rounded-xl bg-indigo-600 py-3.5 text-center font-semibold text-white shadow-md transition-all hover:bg-indigo-700">Get Started</Link>
            </div>

            <div className="relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-8 opacity-90 shadow-sm">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="text-2xl font-black text-slate-900">Pro</h4>
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">Coming Soon</span>
                </div>
                <div className="mb-6 flex items-baseline gap-1">
                  <span className="text-4xl font-black text-slate-400">--</span>
                  <span className="text-sm text-slate-400">/ monthly</span>
                </div>
                <p className="mb-6 text-xs font-medium text-slate-600">For growing businesses scaling fast.</p>
                <div className="mb-8 space-y-3 text-sm">
                  {PRO_FEATURES.map((f) => (
                    <div key={f} className="flex items-center gap-3 text-slate-500"><CheckCircle2 className="h-4 w-4 shrink-0 text-slate-400" /><span>{f}</span></div>
                  ))}
                </div>
              </div>
              <button type="button" disabled className="w-full cursor-not-allowed rounded-xl bg-slate-100 py-3.5 font-semibold text-slate-400">Coming Soon</button>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section id="faq" className="scroll-mt-16 border-t border-slate-200 bg-white py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Heading kicker="Support & FAQ" title="Frequently asked questions" />
          <div className="space-y-4">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx
              return (
                <div key={faq.q} className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                  <button type="button" onClick={() => setOpenFaq(isOpen ? null : idx)} aria-expanded={isOpen} className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left font-bold text-slate-900">
                    <span className="text-base">{faq.q}</span>
                    <ChevronDown className={'h-5 w-5 shrink-0 text-slate-500 transition-transform duration-200 ' + (isOpen ? 'rotate-180 text-indigo-600' : '')} />
                  </button>
                  {isOpen && <div className="border-t border-slate-200/60 px-6 pb-4 pt-3 text-sm leading-relaxed text-slate-600">{faq.a}</div>}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ---------- Final call to action ---------- */}
      <section className="relative overflow-hidden bg-indigo-600 py-24 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] opacity-10 [background-size:20px_20px]" />
        <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-6 text-3xl font-extrabold tracking-tight sm:text-5xl">Make every sale look professional.</h2>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-indigo-100">
            Set up your business once, create receipts faster, and keep your sales organized with Aditech Receipt.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/register" className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 font-bold text-indigo-600 shadow-lg transition-all hover:bg-slate-100 sm:w-auto">
              Get Started Free <ArrowRight className="h-5 w-5" />
            </Link>
            <Link to="/login" className="flex w-full items-center justify-center gap-2 rounded-xl border border-indigo-500 bg-indigo-700 px-8 py-4 font-bold text-white transition-all hover:bg-indigo-800 sm:w-auto">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- Footer ---------- */}
      <footer className="border-t border-slate-900 bg-slate-950 py-16 text-slate-400">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
            <div className="lg:col-span-2">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white"><Printer className="h-5 w-5" /></div>
                <span className="text-lg font-bold text-white">Aditech Receipt</span>
              </div>
              <p className="mb-6 max-w-sm text-sm leading-relaxed">Simple, professional receipt printing for modern businesses, shops and supermarkets.</p>
              <p className="text-xs font-semibold text-slate-500">Built by Aditech</p>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">Product</h4>
              <ul className="space-y-2.5 text-sm">
                <li><a href="#features" className="transition-colors hover:text-white">Features</a></li>
                <li><a href="#how-it-works" className="transition-colors hover:text-white">How It Works</a></li>
                <li><a href="#pricing" className="transition-colors hover:text-white">Pricing</a></li>
                <li><a href="#faq" className="transition-colors hover:text-white">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">Account</h4>
              <ul className="space-y-2.5 text-sm">
                <li><Link to="/login" className="transition-colors hover:text-white">Sign In</Link></li>
                <li><Link to="/register" className="transition-colors hover:text-white">Register your business</Link></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col items-center justify-between border-t border-slate-900 pt-8 text-xs text-slate-500 sm:flex-row">
            <p>© {new Date().getFullYear()} Aditech Receipt. All rights reserved.</p>
            <p className="mt-2 sm:mt-0">Create. Customize. Print.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}