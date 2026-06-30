const PHONE = import.meta.env.VITE_WHATSAPP_PHONE ?? '5491123456789'

export function waLink(message: string): string {
  return `https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`
}

export function productInquiryMessage(name: string, price: number): string {
  return [
    '¡Hola! Quiero consultar por este producto:',
    `- ${name}`,
    `- Precio: $${price.toFixed(2)}`,
  ].join('\n')
}
