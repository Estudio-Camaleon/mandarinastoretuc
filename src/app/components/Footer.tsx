import { Instagram, Facebook } from 'lucide-react'
import { WhatsAppIcon } from './WhatsAppIcon'
import {
  MATERIALS,
  SITE_TAGLINE,
  SOCIAL_LINKS,
  INFO_LINKS,
  LEGAL_LINKS,
  COPYRIGHT,
} from '../../lib/site'

const SOCIAL_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Instagram,
  Facebook,
  WhatsApp: ({ size, className }) => <WhatsAppIcon size={size ?? 18} className={className} />,
}

const FOOTER_CATEGORIES = MATERIALS.map((m) => ({ id: m.slug, ...m }))

export function Footer() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer className="border-t border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="grid md:grid-cols-4 gap-y-8 md:gap-y-10 gap-x-12 mb-10 md:mb-12">
          {/* Brand */}
          <div className="md:col-span-2 text-center md:text-left">
            <img
              src="/media/logos/Mandarina_logo_v2.svg"
              alt="MandarinaStore"
              className="h-10 md:h-12 w-auto mb-4 md:mx-0 mx-auto"
            />
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm md:mx-0 mx-auto">
              {SITE_TAGLINE}
            </p>
            <div className="flex gap-2 mt-6 md:justify-start justify-center">
              {SOCIAL_LINKS.map(({ label, href }) => {
                const Icon = SOCIAL_ICONS[label]
                return (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="text-muted-foreground hover:text-primary transition-colors p-2"
                  >
                    {Icon && <Icon size={22} />}
                  </a>
                )
              })}
            </div>
          </div>

          {/* Shop */}
          <div className="text-center md:text-left">
            <div className="font-['Fredoka'] text-sm font-700 tracking-widest uppercase text-foreground mb-4">
              Tienda
            </div>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => scrollTo('products')}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
                >
                  Todos los Stickers
                </button>
              </li>
              {FOOTER_CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => scrollTo('products')}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div className="text-center md:text-left">
            <div className="font-['Fredoka'] text-sm font-700 tracking-widest uppercase text-foreground mb-4">
              Info
            </div>
            <ul className="space-y-3">
              {INFO_LINKS.map((item, i) => (
                <li key={i}>
                  <span className="text-sm text-muted-foreground py-1 block">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground font-['Fredoka'] tracking-wide text-center md:text-left">
            {COPYRIGHT}
          </p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            {LEGAL_LINKS.map((item, i) => (
              <span
                key={i}
                className="text-xs text-muted-foreground font-['Fredoka'] tracking-wider uppercase"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
