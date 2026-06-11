import { Instagram, Facebook } from 'lucide-react'
import { WhatsAppIcon } from './WhatsAppIcon'
import {
  LOGO_PATH,
  SITE_TAGLINE,
  SOCIAL_LINKS,
  INFO_LINKS,
  LEGAL_LINKS,
  COPYRIGHT,
} from '../../lib/site'

interface Category {
  id: string
  name: string
  slug: string
}

interface FooterProps {
  categories: Category[]
}

const SOCIAL_ICONS: Record<string, React.ComponentType<{ size?: number }>> = {
  Instagram,
  Facebook,
  WhatsApp: ({ size }) => <WhatsAppIcon size={size ?? 18} />,
}

export function Footer({ categories }: FooterProps) {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer className="border-t border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-y-10 gap-x-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2 text-center md:text-left">
            <img
              src={LOGO_PATH}
              alt="MandarinaStore"
              className="h-25 w-auto mb-4 md:mx-0 mx-auto"
            />
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm md:mx-0 mx-auto">
              {SITE_TAGLINE}
            </p>
            <div className="flex gap-4 mt-6 md:justify-start justify-center">
              {SOCIAL_LINKS.map(({ label, href }) => {
                const Icon = SOCIAL_ICONS[label]
                return (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {Icon && <Icon size={18} />}
                  </a>
                )
              })}
            </div>
          </div>

          {/* Shop */}
          <div className="text-center md:text-left">
            <div className="font-['Barlow_Condensed'] text-sm font-700 tracking-widest uppercase text-foreground mb-4">
              Tienda
            </div>
            <ul className="space-y-2.5">
              <li>
                <button
                  onClick={() => scrollTo('products')}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Todos los Stickers
                </button>
              </li>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => scrollTo('products')}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div className="text-center md:text-left">
            <div className="font-['Barlow_Condensed'] text-sm font-700 tracking-widest uppercase text-foreground mb-4">
              Info
            </div>
            <ul className="space-y-2.5">
              {INFO_LINKS.map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground font-['Barlow_Condensed'] tracking-wide">
            {COPYRIGHT}
          </p>
          <div className="flex gap-6">
            {LEGAL_LINKS.map((item) => (
              <a
                key={item}
                href="#"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors font-['Barlow_Condensed'] tracking-wider uppercase"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}