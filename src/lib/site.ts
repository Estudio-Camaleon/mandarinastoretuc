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

/* ── Fixed materials (hardcoded, not from DB) ──────── */
export const MATERIALS = [
  { slug: 'vinilos', name: 'Papel Vinilo' },
  { slug: 'vinilo-holografico', name: 'Papel Vinilo Holográfico' },
  { slug: 'stickers-comun', name: 'Stickers común' },
  { slug: 'vinilo-transparente', name: 'Papel Vinilo Transparente' },
]

/* ── Design categories (can have cover images) ─────── */
export const DESIGN_CATEGORIES = [
  { slug: 'anime', name: 'Anime', image: './media/categoria/diseños/Conjunto_anime.webp' },
  { slug: 'comic', name: 'Comic', image: './media/categoria/diseños/Conjunto_comic_1.png' },
  {
    slug: 'caricaturas',
    name: 'Caricaturas',
    image: './media/categoria/diseños/Conjunto_dibujos_animados.png',
  },
  { slug: 'musica', name: 'Música', image: './media/categoria/diseños/Conjunto_musica.webp' },
  { slug: 'deportes', name: 'Deportes', image: '' },
  { slug: 'videojuegos', name: 'Videojuegos', image: './media/categoria/diseños/Conjunto_videojuego.webp' },
  { slug: 'peliculas', name: 'Películas', image: './media/categoria/diseños/Conjunto_peliculas.webp' },
  { slug: 'ticket', name: 'Ticket', image: './media/categoria/diseños/Conjunto_tickets.png' },
  { slug: 'naturaleza', name: 'Naturaleza', image: '' },
  { slug: 'animales', name: 'Animales', image: '' },
  {
    slug: 'argentina',
    name: 'Argentina',
    image: './media/categoria/diseños/Conjunto_argentina.png',
  },
  { slug: 'personalizado', name: 'Personalizado', image: '' },
  { slug: 'otro', name: 'Otro', image: '' },
]

export function findCategory(name: string): (typeof DESIGN_CATEGORIES)[number] | undefined {
  const lower = name.toLowerCase()
  return DESIGN_CATEGORIES.find((c) => c.slug === lower || c.name.toLowerCase() === lower)
}

/* Normalize any material value (slug or display name) to its slug */
const MATERIAL_SLUG_MAP: Record<string, string> = {}
for (const m of MATERIALS) {
  MATERIAL_SLUG_MAP[m.slug] = m.slug
  MATERIAL_SLUG_MAP[m.name] = m.slug
  MATERIAL_SLUG_MAP[m.name.toLowerCase()] = m.slug
}
/* Also handle old/admin display names */
MATERIAL_SLUG_MAP['Vinilo'] = 'vinilos'
MATERIAL_SLUG_MAP['Vinilo Premium'] = 'vinilos'
MATERIAL_SLUG_MAP['Vinilo Reflectivo'] = 'vinilos'
MATERIAL_SLUG_MAP['Vinilo Holográfico'] = 'vinilo-holografico'
MATERIAL_SLUG_MAP['Vinilo Transparente'] = 'vinilo-transparente'

export function toMaterialSlug(val: string): string {
  return MATERIAL_SLUG_MAP[val] ?? val
}
