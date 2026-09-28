// Picks the business's chosen template and draws the receipt with it.
// Used for the live preview, printing, reprints and the template picker.
import { getTemplate } from '../templates'

export default function Receipt({ business, sale }) {
  const paper = business.paper === '58' ? '58' : '80'
  const { Component } = getTemplate(business.template)

  return (
    <>
      {/* Tells the printer how wide the paper is, whichever template is used */}
      <style>{`@media print { @page { size: ${paper}mm auto; margin: 0 } }`}</style>
      <Component business={business} sale={sale} paper={paper} />
    </>
  )
}