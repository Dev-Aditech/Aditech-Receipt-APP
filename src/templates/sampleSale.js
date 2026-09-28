// Sample data used to preview receipt templates, so the person can see
// roughly what a real receipt will look like before picking a template.
export function sampleSale(receiptCount) {
  return {
    number: (receiptCount || 0) + 1,
    date: new Date(),
    payment: 'Cash',
    received: null,
    items: [
      { name: 'Biscuit', price: 50, qty: 1 },
      { name: 'Bottled water', price: 30, qty: 2 },
    ],
  }
}