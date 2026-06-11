interface Category {
  id: string
  name: string
  slug: string
  color: string
  icon: string
  image: string
  count: number
}

interface CategoriesProps {
  categories: Category[]
  activeCategory: string
  onCategorySelect: (slug: string) => void
}

export function Categories({ categories, activeCategory, onCategorySelect }: CategoriesProps) {
  return (
    <section id="categories" className="py-20 border-t border-border">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <div className="text-xs font-['Barlow_Condensed'] tracking-widest text-primary uppercase mb-2">
              — EXPLORA POR COLECCIÓN
            </div>
            <h2 className="font-['Barlow_Condensed'] text-4xl md:text-5xl font-900 uppercase leading-none text-foreground">
              ELIGE TU
              <br />
              VIBRA.
            </h2>
          </div>
          <button
            onClick={() => onCategorySelect('all')}
            className="text-xs font-['Barlow_Condensed'] tracking-widest text-muted-foreground hover:text-foreground uppercase transition-colors hidden md:block"
          >
            VER TODO →
          </button>
        </div>

        {/* All button */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={() => onCategorySelect('all')}
            className={`px-5 py-2 font-['Barlow_Condensed'] text-sm font-700 tracking-widest uppercase transition-all border rounded-md ${
              activeCategory === 'all'
                ? 'bg-primary text-white border-primary'
                : 'bg-transparent text-muted-foreground border-border hover:border-primary hover:text-foreground'
            }`}
          >
            TODOS
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategorySelect(cat.slug)}
              className={`px-5 py-2 font-['Barlow_Condensed'] text-sm font-700 tracking-widest uppercase transition-all border rounded-md ${
                activeCategory === cat.slug
                  ? 'bg-primary text-white border-primary'
                  : 'bg-transparent text-muted-foreground border-border hover:border-primary hover:text-foreground'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Category cards grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategorySelect(cat.slug)}
              className={`group relative aspect-square flex flex-col items-center justify-center border transition-all duration-200 rounded-xl overflow-hidden ${
                activeCategory === cat.slug
                  ? 'border-primary'
                  : 'border-border hover:border-primary/60'
              } ${cat.image ? 'text-white' : 'bg-card'}`}
            >
              {cat.image ? (
                <>
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/30" />
                  {cat.icon && (
                    <div className="relative text-3xl mb-2 drop-shadow-lg">{cat.icon}</div>
                  )}
                  <div className="relative font-['Barlow_Condensed'] text-sm font-700 tracking-widest uppercase drop-shadow-lg">
                    {cat.name}
                  </div>
                  <div className="relative text-xs text-white/70 mt-1 drop-shadow">
                    {cat.count} diseños
                  </div>
                </>
              ) : (
                <>
                  {cat.icon && <div className="text-3xl mb-2">{cat.icon}</div>}
                  <div className="font-['Barlow_Condensed'] text-sm font-700 tracking-widest uppercase text-foreground">
                    {cat.name}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{cat.count} diseños</div>
                </>
              )}
              {activeCategory === cat.slug && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary z-10" />
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
