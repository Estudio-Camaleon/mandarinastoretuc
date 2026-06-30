import { Disc3, Sparkles, Tag, Gem } from 'lucide-react'

const FIXED_CATEGORIES = [
  {
    slug: 'vinilos',
    name: 'Papel Vinilo',
    Icon: Disc3,
    gradient: 'from-violet-700 to-indigo-950',
    activeBorder: 'border-violet-500',
    btnActive: 'bg-violet-600 text-white border-violet-600',
    btnInactive:
      'bg-transparent border-border text-muted-foreground md:hover:border-violet-500 md:hover:text-violet-200',
    sub: 'Clásicos en papel vinilo',
    pattern:
      'radial-gradient(circle at 50% 50%, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 40%, rgba(255,255,255,0.05) 42%, rgba(255,255,255,0) 44%, rgba(255,255,255,0) 60%, rgba(255,255,255,0.03) 62%, rgba(255,255,255,0) 64%)',
  },
  {
    slug: 'vinilo-holografico',
    name: 'Papel Vinilo Holográfico',
    Icon: Sparkles,
    gradient: 'from-pink-500 via-fuchsia-500 to-cyan-500',
    activeBorder: 'border-pink-400',
    btnActive: 'bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white border-pink-500',
    btnInactive:
      'bg-transparent border-border text-muted-foreground md:hover:border-pink-500 md:hover:text-pink-200',
    sub: 'Efecto iridiscente',
    pattern:
      'repeating-linear-gradient(45deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 2px, transparent 2px, transparent 6px)',
  },
  {
    slug: 'stickers-comun',
    name: 'Stickers común',
    Icon: Tag,
    gradient: 'from-amber-500 to-orange-900',
    activeBorder: 'border-amber-500',
    btnActive: 'bg-amber-600 text-white border-amber-600',
    btnInactive:
      'bg-transparent border-border text-muted-foreground md:hover:border-amber-500 md:hover:text-amber-200',
    sub: 'Económicos y versátiles',
    pattern:
      'radial-gradient(circle at 30% 70%, rgba(255,255,255,0.08) 0%, transparent 30%), radial-gradient(circle at 70% 30%, rgba(255,255,255,0.05) 0%, transparent 25%)',
  },
  {
    slug: 'vinilo-transparente',
    name: 'Papel Vinilo Transparente',
    Icon: Gem,
    gradient: 'from-cyan-400 to-teal-950',
    activeBorder: 'border-cyan-400',
    btnActive: 'bg-cyan-600 text-white border-cyan-600',
    btnInactive:
      'bg-transparent border-border text-muted-foreground md:hover:border-cyan-500 md:hover:text-cyan-200',
    sub: 'Sutil y elegante',
    pattern:
      'linear-gradient(110deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 40%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0) 90%)',
  },
]

interface CategoriesProps {
  activeCategory: string
  onCategorySelect: (slug: string) => void
  products?: { category: string }[]
}

export function Categories({ activeCategory, onCategorySelect, products }: CategoriesProps) {
  return (
    <section id="categories" className="scroll-mt-20 pt-16 md:pt-28 pb-16 md:pb-20 border-t border-border">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-end justify-between mb-10 md:mb-14">
          <div className="space-y-3">
            <div className="text-xs font-['Barlow_Condensed'] tracking-widest text-primary uppercase">
              — EXPLORA POR COLECCIÓN
            </div>
            <h2 className="font-['Barlow_Condensed'] text-4xl sm:text-5xl md:text-6xl font-900 uppercase leading-none text-foreground">
              ELEGÍ TU VIBRA.
              
            </h2>
          </div>
          <button
            onClick={() => onCategorySelect('all')}
            className="text-xs font-['Barlow_Condensed'] tracking-widest text-muted-foreground hover:text-foreground uppercase transition-colors hidden md:block"
          >
            VER TODO →
          </button>
        </div>

        {/* Filter buttons - horizontal scroll on mobile */}
        <div className="overflow-x-auto -mx-4 px-4 mb-8 scrollbar-hide">
          <div className="flex gap-3 w-max">
            <button
              onClick={() => onCategorySelect('all')}
              className={`px-5 py-2 font-['Barlow_Condensed'] text-sm font-700 tracking-widest uppercase transition-all border rounded-md shrink-0 ${
                activeCategory === 'all'
                  ? 'bg-primary text-white border-primary'
                  : 'bg-transparent text-muted-foreground border-border md:hover:border-primary md:hover:text-foreground'
              }`}
            >
              TODOS
            </button>
            {FIXED_CATEGORIES.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => onCategorySelect(cat.slug)}
                className={`px-5 py-2 font-['Barlow_Condensed'] text-sm font-700 tracking-widest uppercase transition-all border rounded-md shrink-0 ${
                  activeCategory === cat.slug ? cat.btnActive : cat.btnInactive
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Category cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {FIXED_CATEGORIES.map((cat, i) => (
            <button
              key={cat.slug}
              onClick={() => onCategorySelect(cat.slug)}
              style={{ animationDelay: `${i * 0.1}s` }}
              className={`group relative aspect-square flex flex-col items-center justify-center rounded-xl overflow-hidden border-2 transition-all duration-300 animate-fade-in ${
                activeCategory === cat.slug
                  ? `${cat.activeBorder} scale-[1.02]`
                  : 'border-transparent'
              } ${activeCategory !== cat.slug ? 'md:hover:scale-[1.02]' : ''}`}
            >
              {/* Gradient background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} transition-opacity duration-300 ${
                  activeCategory === cat.slug ? 'opacity-100' : 'opacity-80'
                } ${activeCategory !== cat.slug ? 'md:group-hover:opacity-100' : ''}`}
              />

              {/* Decorative pattern */}
              <div
                className="absolute inset-0 opacity-20"
                style={{ backgroundImage: cat.pattern }}
              />

              {/* Icon */}
              <cat.Icon
                className="relative mb-2 md:mb-3 drop-shadow-lg"
                size={36}
                strokeWidth={1.5}
                color="white"
              />

              {/* Name */}
              <div className="relative w-full px-2 text-center">
                <div className="font-['Barlow_Condensed'] text-sm md:text-lg font-700 tracking-widest uppercase text-white drop-shadow-lg truncate">
                  {cat.name}
                </div>
              </div>

              {/* Sub label - hide on mobile */}
              <div className="relative text-xs text-white/70 mt-1 drop-shadow font-['Barlow_Condensed'] tracking-wider uppercase hidden md:block truncate max-w-[90%]">
                {cat.sub}
              </div>

              {/* Products count */}
              <div className="relative text-[10px] md:text-xs text-white/50 mt-1">
                {products ? products.filter((p) => p.category === cat.slug).length : 0} diseños
              </div>

              {/* Active indicator */}
              {activeCategory === cat.slug && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/60 z-10" />
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
