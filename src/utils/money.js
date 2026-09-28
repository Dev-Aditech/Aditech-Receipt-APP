// Small helper functions for money and numbers.

export function formatMoney(n) {
  const value = Number(n) || 0
  return '\u20A6' + value.toLocaleString('en-NG', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
}

// price and qty may be text (typed in a box) or numbers (loaded from Firebase)
export function lineTotal(item) {
  return (parseFloat(item.price) || 0) * (parseFloat(item.qty) || 0)
}

export function calcTotal(items) {
  return items.reduce((sum, item) => sum + lineTotal(item), 0)
}

export function padNumber(n, length = 4) {
  return String(n).padStart(length, '0')
}
