import { Star } from "lucide-react";

const TESTIMONIALS = [
  {
    id: "1",
    name: "Kai M.",
    handle: "@kai_mtl",
    text: "These stickers are insane quality. Put them on my skateboard deck 6 months ago and they still look fresh. The NEON WOLF one is my favorite.",
    rating: 5,
    product: "Neon Wolf Sticker",
  },
  {
    id: "2",
    name: "Sofia R.",
    handle: "@sofiar_designs",
    text: "Ordered 10 packs for my laptop and notebooks. Waterproof and the colors don't fade. STKR.CO is the only place I buy stickers now.",
    rating: 5,
    product: "Abstract Pack x10",
  },
  {
    id: "3",
    name: "Jordan L.",
    handle: "@jordy_streetwear",
    text: "Dropped them on my water bottle and helmet. Still holding up after the gym, rain, everything. Fast shipping too — came in 3 days.",
    rating: 5,
    product: "Street Tag Collection",
  },
  {
    id: "4",
    name: "Mia T.",
    handle: "@mia.creative",
    text: "The anime collection is absolutely fire. The print quality is so sharp. I'll definitely be back for the next drop.",
    rating: 5,
    product: "Anime Eyes Sticker",
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-20 border-t border-border">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <div className="text-xs font-['Barlow_Condensed'] tracking-widest text-primary uppercase mb-2">
            — REAL TALK
          </div>
          <h2 className="font-['Barlow_Condensed'] text-4xl md:text-5xl font-900 uppercase leading-none text-foreground">
            WHAT THE<br />STREETS SAY.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="bg-card border border-border p-5 flex flex-col justify-between hover:border-primary/40 transition-colors"
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
                  <div className="font-['Barlow_Condensed'] font-700 text-foreground uppercase tracking-wide">
                    {t.name}
                  </div>
                  <div className="text-xs text-primary font-['Barlow_Condensed'] tracking-widest">
                    {t.handle}
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-1 font-['Barlow_Condensed'] uppercase tracking-wider">
                    {t.product}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Social proof bar */}
        <div className="mt-10 border border-border p-5 grid grid-cols-2 md:grid-cols-4 gap-5 bg-card">
          {[
            { emoji: "⭐", value: "4.9 / 5", label: "Average rating" },
            { emoji: "📦", value: "10,000+", label: "Happy customers" },
            { emoji: "🔁", value: "94%", label: "Repeat buyers" },
            { emoji: "🚚", value: "2–4 days", label: "Avg. delivery" },
          ].map(({ emoji, value, label }) => (
            <div key={label} className="text-center">
              <div className="text-2xl mb-1">{emoji}</div>
              <div className="font-['Barlow_Condensed'] text-xl font-900 text-primary">{value}</div>
              <div className="text-xs text-muted-foreground font-['Barlow_Condensed'] tracking-wider uppercase">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
