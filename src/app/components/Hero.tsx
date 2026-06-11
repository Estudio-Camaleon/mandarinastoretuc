import { Instagram, Facebook } from 'lucide-react'
import { ImageWithFallback } from './ImageWithFallback'
import { WhatsAppIcon } from './WhatsAppIcon'
import { SOCIAL_LINKS, LOGO_PATH } from '../../lib/site'

const SOCIAL_ICONS: Record<string, React.ComponentType<{ size?: number }>> = {
  Instagram,
  Facebook,
  WhatsApp: ({ size }) => <WhatsAppIcon size={size ?? 18} />,
}

export function Hero() {
  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden pt-14">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1774124031693-a585cf5e4771?w=1920&h=1080&fit=crop&auto=format"
          alt="Graffiti and stickers on urban wall"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/60 to-background" />
      </div>

      {/* Diagonal orange accent bar */}
      <div
        className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 z-0"
        style={{ clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0% 100%)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 w-full grid md:grid-cols-2 gap-12 items-center py-20">
        {/* Left: Text */}
        <div>
          {/* Logo mark */}
          <div className="flex flex-col lg:flex-row items-center lg:items-center gap-2 mb-6">
            <img
              src={LOGO_PATH}
              alt="Mandarina Store"
              className="h-35 lg:h-50 w-auto"
            />
            <h1 className=" font-['Barlow_Condensed'] text-4xl lg:text-6xl font-900 leading-none uppercase tracking-tight text-foreground mb-4">
            PEGA TU
            <br />
            <span className="text-primary">ESTILO</span>
            <br />
            EN TODAS PARTES.
          </h1>
          </div>

          

          <p className="text-muted-foreground max-w-sm mb-8 leading-relaxed">
            Stickers de vinilo premium para las calles. Resistente al agua y a los rayos UV.
          </p>

          <div className="flex items-center gap-4">
            <button
              onClick={scrollToProducts}
              className="bg-primary text-white px-8 py-3 font-['Barlow_Condensed'] text-lg font-700 tracking-widest uppercase hover:bg-primary/90 transition-colors"
            >
              COMPRAR AHORA
            </button>
            <button
              onClick={() =>
                document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' })
              }
              className="border border-border text-foreground px-8 py-3 font-['Barlow_Condensed'] text-lg font-700 tracking-widest uppercase hover:border-primary hover:text-primary transition-colors"
            >
              COLECCIONES
            </button>
          </div>

          {/* Social icons */}
          <div className="flex items-center gap-5 mt-10">
            <span className="text-xl font-['Barlow_Condensed'] tracking-widest text-muted-foreground uppercase">
              Seguinos
            </span>
            <div className="w-8 h-px bg-border" />
            {SOCIAL_LINKS.map(({ label, href }) => {
              const Icon = SOCIAL_ICONS[label]
              return (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {Icon && <Icon size={30} />}
                </a>
              )
            })}
          </div>
        </div>

        {/* Right: Sticker wall collage */}
        <div className="hidden lg:grid grid-cols-2 gap-3">
          {[
            'https://images.unsplash.com/photo-1763888647755-5754915925ff?w=600&h=400&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1770375142184-4655d2bd2d4e?w=600&h=400&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1758295099602-18bcd8c024b7?w=600&h=400&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1775496230770-d379e89b9e7e?w=600&h=400&fit=crop&auto=format',
          ].map((url, i) => (
            <div
              key={i}
              className={`overflow-hidden bg-card ${i === 0 ? 'col-span-2 aspect-video' : 'aspect-square'}`}
            >
              <ImageWithFallback
                src={url}
                alt="Street sticker art"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Stats bar */}
      
    </section>
  )
}
