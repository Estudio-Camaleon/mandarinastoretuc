import { Instagram, Facebook, MessageCircle } from 'lucide-react'
import { ImageWithFallback } from './ImageWithFallback'
import { SOCIAL_LINKS } from '../../lib/site'

const SOCIAL_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Instagram,
  Facebook,
  WhatsApp: ({ size, className }) => <MessageCircle size={size ?? 20} className={className} />,
}

export function CTA() {
  return (
    <section className="border-t border-border">
      {/* Orange block CTA */}
      <div className="bg-primary py-20">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="font-['Barlow_Condensed'] text-5xl md:text-7xl font-900 uppercase leading-none text-white">
              ¿LISTO PARA
              <br />
              DESTACAR?
            </h2>
            <p className="text-white/70 mt-4 max-w-sm">
              Consigue tu pack. 500+ diseños, vinilo resistente al agua, envío rápido.
            </p>
          </div>
          <div className="flex flex-col items-center gap-4">
            <button
              onClick={() =>
                document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })
              }
              className="bg-black text-white px-12 py-4 font-['Barlow_Condensed'] text-xl font-900 tracking-widest uppercase hover:bg-white hover:text-black transition-all"
            >
              COMPRAR AHORA →
            </button>
            <span className="text-white/50 text-xs font-['Barlow_Condensed'] tracking-widest">
              ENVÍO GRATIS POR MÁS DE $25
            </span>
          </div>
        </div>
      </div>

      {/* Follow section */}
      <div className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="text-xs font-['Barlow_Condensed'] tracking-widest text-primary uppercase mb-3">
            — SIGUE LA CULTURA
          </div>
          <h2 className="font-['Barlow_Condensed'] text-3xl md:text-5xl font-900 uppercase leading-none text-foreground mb-8">
            ETIQUÉTANOS @MANDARINA.STORE.TUC
          </h2>

          <div className="flex justify-center gap-6 mb-10">
            {SOCIAL_LINKS.map(({ label, href }) => {
              const Icon = SOCIAL_ICONS[label]
              return (
                <a
                  key={label}
                  href={href}
                  className="flex flex-col items-center gap-2 group"
                  aria-label={label}
                >
                  <div className="w-12 h-12 border border-border flex items-center justify-center group-hover:border-primary group-hover:bg-primary transition-all">
                    {Icon && <Icon size={20} className="group-hover:text-white transition-colors" />}
                  </div>
                  <span className="text-xs font-['Barlow_Condensed'] tracking-widest text-muted-foreground uppercase">
                    {label}
                  </span>
                </a>
              )
            })}
          </div>

          {/* UGC Grid */}
          <div className="grid grid-cols-4 md:grid-cols-6 gap-1">
            {[
              'https://images.unsplash.com/photo-1770375142184-4655d2bd2d4e?w=300&h=300&fit=crop&auto=format',
              'https://images.unsplash.com/photo-1758295099602-18bcd8c024b7?w=300&h=300&fit=crop&auto=format',
              'https://images.unsplash.com/photo-1775496230770-d379e89b9e7e?w=300&h=300&fit=crop&auto=format',
              'https://images.unsplash.com/photo-1763888647755-5754915925ff?w=300&h=300&fit=crop&auto=format',
              'https://images.unsplash.com/photo-1764567386744-090d5ff67d66?w=300&h=300&fit=crop&auto=format',
              'https://images.unsplash.com/photo-1775665422545-42848b8536b9?w=300&h=300&fit=crop&auto=format',
            ].map((url, i) => (
              <div key={i} className="aspect-square overflow-hidden bg-card">
                <ImageWithFallback
                  src={url}
                  alt="Community sticker post"
                  className="w-full h-full object-cover hover:opacity-70 transition-opacity cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
