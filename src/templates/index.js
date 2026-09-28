// The list of receipt templates a business can choose between.
// Add a new template by writing a component (see ClassicReceipt.jsx for the
// simplest example) and adding one line to this list.
import ClassicReceipt from './ClassicReceipt'
import ModernReceipt from './ModernReceipt'
import MinimalReceipt from './MinimalReceipt'

export const TEMPLATES = [
  {
    id: 'classic',
    name: 'Classic Thermal',
    description: 'Plain black and white. The safest choice for 58mm/80mm thermal printers.',
    Component: ClassicReceipt,
  },
  {
    id: 'modern',
    name: 'Modern Purple',
    description: 'A bold logo badge and colour accents. Best for a colour printer or an emailed PDF.',
    Component: ModernReceipt,
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean sans-serif type with light, simple lines.',
    Component: MinimalReceipt,
  },
]

export function getTemplate(id) {
  return TEMPLATES.find((t) => t.id === id) || TEMPLATES[0]
}