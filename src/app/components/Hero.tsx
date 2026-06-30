import { Instagram, Facebook } from 'lucide-react'
import { WhatsAppIcon } from './WhatsAppIcon'
import { SOCIAL_LINKS, LOGO_PATH } from '../../lib/site'

const SOCIAL_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Instagram,
  Facebook,
  WhatsApp: ({ size, className }) => <WhatsAppIcon size={size ?? 18} className={className} />,
}

const DECORATIVE_LINE = 'M0 0 L50 25 L100 0'

export function Hero() {
  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="hero" className="relative min-h-[100dvh] flex items-center overflow-hidden pt-14">
      {/* Subtle decorative background */}
      <div className="absolute inset-0 z-0">
        <svg className="w-full h-full opacity-[0.04]" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#dots)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 w-full">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto gap-6 md:gap-8 py-10 md:py-20">
          {/* Big logo */}
          <div className="animate-fade-in">
            <img
              src={LOGO_PATH}
              alt="Mandarina Store"
              className="h-32 sm:h-40 md:h-52 lg:h-64 w-auto"
            />
          </div>

          {/* Decorative divider */}
          <svg viewBox="0 0 100 12" className="w-32 h-3 text-primary/40">
            <path d={DECORATIVE_LINE} stroke="currentColor" strokeWidth="1.5" fill="none" />
          </svg>

          {/* Headline */}
          <h1 className="font-['Barlow_Condensed'] text-5xl sm:text-7xl lg:text-8xl font-900 leading-none uppercase tracking-tight text-foreground">
            PEGA TU
            <br />
            <span className="text-primary">ESTILO</span>
            <br />
            EN TODAS PARTES.
          </h1>

          {/* Subtitle */}
          <p className="text-muted-foreground max-w-md leading-relaxed text-sm md:text-base">
            Stickers de vinilo premium para las calles. Resistente al agua y a los rayos UV.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-2">
            <button
              onClick={scrollToProducts}
              className="bg-primary text-white px-8 sm:px-10 py-3 font-['Barlow_Condensed'] text-base sm:text-lg font-700 tracking-widest uppercase hover:bg-primary/90 transition-colors text-center"
            >
              COMPRAR AHORA
            </button>
            <button
              onClick={() =>
                document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' })
              }
              className="border border-border text-foreground px-8 sm:px-10 py-3 font-['Barlow_Condensed'] text-base sm:text-lg font-700 tracking-widest uppercase hover:border-primary hover:text-primary transition-colors text-center"
            >
              COLECCIONES
            </button>
          </div>

          {/* Social icons */}
          <div className="flex items-center gap-4 pt-4">
            <span className="text-xs md:text-sm font-['Barlow_Condensed'] tracking-widest text-muted-foreground uppercase">
              Seguinos
            </span>
            <div className="w-8 h-px bg-border" />
            <div className="flex items-center gap-2">
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
        </div>
      </div>
    </section>
  )
}
