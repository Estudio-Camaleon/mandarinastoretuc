import { Instagram, Facebook, MessageCircle } from 'lucide-react'

export function Footer() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer className="border-t border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <img
              src="/media/logos/sticker_mandarina.png"
              alt="MandarinaStore"
              className="h-10 md:h-12 w-auto mb-3"
            />
            <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
              Stickers de vinilo premium para la generación urbana. Diseñados audaces. Hechos para
              durar.
            </p>
            <div className="flex gap-4 mt-5">
              {[
                {
                  Icon: Instagram,
                  href: 'https://www.instagram.com/mandarina.store.tuc/?hl=es',
                  label: 'Instagram',
                },
                {
                  Icon: Facebook,
                  href: 'https://www.facebook.com/share/1H6kuhahZn/',
                  label: 'Facebook',
                },
                {
                  Icon: MessageCircle,
                  href: `https://wa.me/${import.meta.env.VITE_WHATSAPP_PHONE || '5491123456789'}`,
                  label: 'WhatsApp',
                },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <div className="font-['Barlow_Condensed'] text-sm font-700 tracking-widest uppercase text-foreground mb-4">
              Tienda
            </div>
            <ul className="space-y-2">
              {[
                'Todos los Stickers',
                'Street Art',
                'Anime',
                'Naturaleza',
                'Animales',
                'Abstracto',
              ].map((item) => (
                <li key={item}>
                  <button
                    onClick={() => scrollTo('products')}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <div className="font-['Barlow_Condensed'] text-sm font-700 tracking-widest uppercase text-foreground mb-4">
              Info
            </div>
            <ul className="space-y-2">
              {['Nosotros', 'Envíos', 'Devoluciones', 'FAQ', 'Contacto', 'Guía de Tallas'].map(
                (item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-xs text-muted-foreground font-['Barlow_Condensed'] tracking-wide">
            © 2026 Mandarina Store — Todos los derechos reservados.
          </div>
          <div className="flex gap-6">
            {['Privacidad', 'Términos', 'Cookies'].map((item) => (
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
