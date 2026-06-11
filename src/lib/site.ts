/// <reference types="vite/client" />

/* ── Brand ─────────────────────────────────────────── */
export const SITE_NAME = 'Mandarina Store'
export const SITE_TAGLINE =
  'Stickers de vinilo premium para la generación urbana. Diseñados audaces. Hechos para durar.'
export const LOGO_PATH = '/media/logos/sticker_mandarina.png'

/* ── Social links ──────────────────────────────────── */
export interface SocialLink {
  label: string
  href: string
}

export const SOCIAL_LINKS: SocialLink[] = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/mandarina.store.tuc/?hl=es',
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/share/1H6kuhahZn/',
  },
  {
    label: 'WhatsApp',
    href: `https://wa.me/${import.meta.env.VITE_WHATSAPP_PHONE || '5491123456789'}`,
  },
]

/* ── Footer info section ───────────────────────────── */
export const INFO_LINKS = [
  'Nosotros',
  'Envíos',
  'Devoluciones',
  'FAQ',
  'Contacto',
  'Guía de Tallas',
]

/* ── Footer legal section ──────────────────────────── */
export const LEGAL_LINKS = ['Privacidad', 'Términos', 'Cookies']

/* ── Footer copyright ──────────────────────────────── */
export const COPYRIGHT = `© ${new Date().getFullYear()} ${SITE_NAME} — Todos los derechos reservados.`
