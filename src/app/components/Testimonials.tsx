import { Star } from 'lucide-react'

const TESTIMONIALS = [
  {
    id: '1',
    name: 'Kai M.',
    handle: '@kai_mtl',
    text: 'Estos stickers son de una calidad increíble. Los puse en mi skateboard hace 6 meses y todavía se ven como nuevos. El NEON WOLF es mi favorito.',
    rating: 5,
    product: 'Neon Wolf Sticker',
  },
  {
    id: '2',
    name: 'Sofia R.',
    handle: '@sofiar_designs',
    text: 'Pedí 10 packs para mi laptop y cuadernos. Impermeables y los colores no se desvanecen. Mandarina Store es el único lugar donde compro stickers ahora.',
    rating: 5,
    product: 'Abstract Pack x10',
  },
  {
    id: '3',
    name: 'Jordan L.',
    handle: '@jordy_streetwear',
    text: 'Los pegué en mi botella de agua y casco. Siguen intactos después del gimnasio, lluvia, todo. Envío rápido también — llegó en 3 días.',
    rating: 5,
    product: 'Street Tag Collection',
  },
  {
    id: '4',
    name: 'Mia T.',
    handle: '@mia.creative',
    text: 'La colección anime es absolutamente increíble. La calidad de impresión es muy nítida. Definitivamente volveré para el próximo lanzamiento.',
    rating: 5,
    product: 'Anime Eyes Sticker',
  },
]

export function Testimonials() {
  return (
    <section id="testimonials" className="py-20 border-t border-border">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <div className="text-xs font-['Fredoka'] tracking-widest text-primary uppercase mb-2">
            — OPINIONES REALES
          </div>
          <h2 className="font-['Fredoka'] text-4xl md:text-5xl font-900 uppercase leading-none text-foreground">
            LO QUE LA
            <br />
            CALLE DICE.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="bg-card border border-border p-5 flex flex-col justify-between hover:border-primary/40 transition-colors rounded-3xl"
            >
              <div>
                <div className="flex mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={12} className="fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed mb-4">"{t.text}"</p>
              </div>
              <div>
                <div className="border-t border-border pt-4">
                  <div className="font-['Fredoka'] font-700 text-foreground uppercase tracking-wide">
                    {t.name}
                  </div>
                  <div className="text-xs text-primary font-['Fredoka'] tracking-widest">
                    {t.handle}
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-1 font-['Fredoka'] uppercase tracking-wider">
                    {t.product}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Social proof bar */}
        <div className="mt-10 border border-border p-5 grid grid-cols-2 md:grid-cols-4 gap-5 bg-card rounded-3xl">
          {[
            { emoji: '⭐', value: '4.9 / 5', label: 'Valoración media' },
            { emoji: '📦', value: '10,000+', label: 'Clientes felices' },
            { emoji: '🔁', value: '94%', label: 'Compradores frecuentes' },
            { emoji: '🚚', value: '2–4 días', label: 'Entrega media' },
          ].map(({ emoji, value, label }) => (
            <div key={label} className="text-center">
              <div className="text-2xl mb-1">{emoji}</div>
              <div className="font-['Fredoka'] text-xl font-900 text-primary">{value}</div>
              <div className="text-xs text-muted-foreground font-['Fredoka'] tracking-wider uppercase">
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
