const PHONE = import.meta.env.VITE_WHATSAPP_PHONE ?? '5491123456789'

export function waLink(message: string): string {
  return `https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`
}

export function productMessage(name: string, price: number, qty = 1): string {
  const total = (price * qty).toFixed(2)
  return [
    `Hi! I'd like to order:`,
    `- ${name} x${qty} = $${total}`,
    '',
    `Total: $${total}`,
  ].join('\n')
}

export function cartMessage(
  items: { name: string; price: number; qty: number }[],
): string {
  const lines = items.map(
    (i) => `- ${i.name} x${i.qty} = $${(i.price * i.qty).toFixed(2)}`,
  )
  const total = items.reduce((s, i) => s + i.price * i.qty, 0)
  return [`Hi! I'd like to order:`, ...lines, '', `Total: $${total.toFixed(2)}`].join('\n')
}
