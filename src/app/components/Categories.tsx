import { useRef, useState, useEffect, useMemo } from 'react'
import { Disc3, Sparkles, Tag, Gem } from 'lucide-react'
import { ImageWithFallback } from './ImageWithFallback'
import { toMaterialSlug, DESIGN_CATEGORIES } from '../../lib/site'

const MATERIALS = [
  {
    slug: 'vinilos',
    name: 'Papel Vinilo',
    Icon: Disc3,
    btnActive: 'bg-violet-600 text-white border-violet-600',
    btnInactive:
      'bg-transparent border-border text-muted-foreground md:hover:border-violet-500 md:hover:text-violet-200',
    sub: 'Clásicos en papel vinilo',
    image: './media/mascota/materiales/Mikan_vinilo.webp',
  },
  {
    slug: 'vinilo-holografico',
    name: 'Papel Vinilo Holográfico',
    Icon: Sparkles,
    btnActive: 'bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white border-pink-500',
    btnInactive:
      'bg-transparent border-border text-muted-foreground md:hover:border-pink-500 md:hover:text-pink-200',
    sub: 'Efecto iridiscente',
    image: './media/mascota/materiales/Mikan_holografico.webp',
  },
  {
    slug: 'stickers-comun',
    name: 'Stickers común',
    Icon: Tag,
    btnActive: 'bg-amber-600 text-white border-amber-600',
    btnInactive:
      'bg-transparent border-border text-muted-foreground md:hover:border-amber-500 md:hover:text-amber-200',
    sub: 'Económicos y versátiles',
    image: './media/mascota/materiales/Mikan_sticker_comun.webp',
  },
  {
    slug: 'vinilo-transparente',
    name: 'Papel Vinilo Transparente',
    Icon: Gem,
    btnActive: 'bg-cyan-600 text-white border-cyan-600',
    btnInactive:
      'bg-transparent border-border text-muted-foreground md:hover:border-cyan-500 md:hover:text-cyan-200',
    sub: 'Sutil y elegante',
    image: './media/mascota/materiales/Mikan_sticker_transparente.png',
  },
]

interface CategoriesProps {
  activeMaterial: string
  activeCategory: string | null
  onMaterialSelect: (slug: string) => void
  onCategorySelect: (category: string | null) => void
  products?: { material: string; category: string }[]
}

/* ── Individual material card ── */

function MaterialCard({
  material,
  index,
  isActive,
  onSelect,
  productCount,
}: {
  material: (typeof MATERIALS)[number]
  index: number
  isActive: boolean
  onSelect: () => void
  productCount: number
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const shineRef = useRef<HTMLDivElement>(null)

  const [isMobile, setIsMobile] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    setIsMobile(window.matchMedia('(hover: none)').matches)
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reducedMotion) return
    const card = cardRef.current
    if (!card) return

    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const px = x / rect.width
    const py = y / rect.height

    const rotateY = (px - 0.5) * 12
    const rotateX = (py - 0.5) * -10

    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`

    if (shineRef.current) {
      shineRef.current.style.backgroundPosition = `${x * 1.2}px ${y * 1.2}px`
      shineRef.current.style.opacity = '1'
    }
  }

  function handleMouseLeave() {
    const card = cardRef.current
    if (!card) return
    card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)'
    if (shineRef.current) shineRef.current.style.opacity = ''
  }

  const hasImage = !!material.image

  const maskStyle = hasImage
    ? {
        WebkitMaskImage: `url(${material.image})`,
        maskImage: `url(${material.image})`,
      }
    : {}

  return (
    <div
      className="animate-fade-in"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div
        ref={cardRef}
        className="group cursor-pointer sticker-card"
        onClick={onSelect}
        {...(!isMobile ? { onMouseMove: handleMouseMove, onMouseLeave: handleMouseLeave } : {})}
      >
        {hasImage ? (
          <>
            <div className="relative sticker-content">
              <ImageWithFallback
                src={material.image!}
                alt={material.name}
                className="w-full h-full object-contain aspect-[4/5]"
              />
              <div ref={shineRef} className="sticker-shine" style={maskStyle} />
              {isActive && (
                <div className="absolute inset-0 ring-2 ring-primary ring-inset rounded-3xl z-10 pointer-events-none" />
              )}
            </div>
            <div className="pt-1.5 md:pt-2">
              <div className="font-['Fredoka'] text-sm md:text-base font-700 uppercase leading-tight text-foreground truncate">
                {material.name}
              </div>
              <div className="font-['Fredoka'] text-[10px] md:text-xs tracking-widest text-muted-foreground uppercase truncate">
                {material.sub}
              </div>
              <div className="font-['Fredoka'] text-xs md:text-sm font-700 text-primary">
                {productCount} diseños
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center aspect-[4/5] bg-secondary rounded-3xl sticker-content">
            <material.Icon
              className="mb-2 drop-shadow-lg text-muted-foreground"
              size={36}
              strokeWidth={1.5}
            />
            <div className="w-full px-3 text-center">
              <div className="font-['Fredoka'] text-sm md:text-lg font-700 tracking-widest uppercase text-foreground truncate">
                {material.name}
              </div>
              <div className="text-[10px] md:text-xs text-muted-foreground mt-1">
                {productCount} diseños
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Design categories (unfolded below a material) ── */

function DesignCategoryCard({
  name,
  count,
  index,
  isActive,
  onSelect,
}: {
  name: string
  count: number
  index: number
  isActive: boolean
  onSelect: () => void
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const shineRef = useRef<HTMLDivElement>(null)

  const [isMobile, setIsMobile] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    setIsMobile(window.matchMedia('(hover: none)').matches)
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reducedMotion) return
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const px = x / rect.width
    const py = y / rect.height
    const rotateY = (px - 0.5) * 12
    const rotateX = (py - 0.5) * -10
    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`
    if (shineRef.current) {
      shineRef.current.style.backgroundPosition = `${x * 1.2}px ${y * 1.2}px`
      shineRef.current.style.opacity = '1'
    }
  }

  function handleMouseLeave() {
    const card = cardRef.current
    if (!card) return
    card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)'
    if (shineRef.current) shineRef.current.style.opacity = ''
  }

  const catDef = DESIGN_CATEGORIES.find(
    (c) => c.name.toLowerCase() === name.toLowerCase() || c.slug === name.toLowerCase(),
  )
  const hasImage = !!catDef?.image
  const maskStyle = hasImage
    ? { WebkitMaskImage: `url(${catDef!.image})`, maskImage: `url(${catDef!.image})` }
    : {}

  return (
    <div className="animate-fade-in" style={{ animationDelay: `${index * 0.08}s` }}>
      <div
        ref={cardRef}
        className="group cursor-pointer sticker-card"
        onClick={onSelect}
        {...(!isMobile ? { onMouseMove: handleMouseMove, onMouseLeave: handleMouseLeave } : {})}
      >
        {hasImage ? (
          <>
            <div className="relative sticker-content">
              <ImageWithFallback
                src={catDef!.image!}
                alt={name}
                className="w-full h-full object-contain aspect-[8/5]"
              />
              <div ref={shineRef} className="sticker-shine" style={maskStyle} />
              {isActive && (
                <div className="absolute inset-0 ring-2 ring-primary ring-inset rounded-3xl z-10 pointer-events-none" />
              )}
            </div>
            <div className="pt-1.5 md:pt-2">
              <div className="font-['Fredoka'] text-sm md:text-base font-700 uppercase leading-tight text-foreground truncate">
                {name}
              </div>
              <div className="font-['Fredoka'] text-xs md:text-sm font-700 text-primary">
                {count} diseños
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center aspect-[8/5] bg-secondary rounded-3xl sticker-content">
            <div className="w-full px-3 text-center">
              <div className="font-['Fredoka'] text-sm md:text-lg font-700 tracking-widest uppercase text-foreground truncate">
                {name}
              </div>
              <div className="text-[10px] md:text-xs text-muted-foreground mt-1">
                {count} diseños
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function DesignCategories({
  products,
  activeCategory,
  onSelect,
}: {
  products: { material: string; category: string }[]
  activeCategory: string | null
  onSelect: (category: string | null) => void
}) {
  const cats = useMemo(() => {
    const map = new Map<string, number>()
    products.forEach((p) => {
      const key = p.category || 'Sin categoría'
      map.set(key, (map.get(key) || 0) + 1)
    })
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1])
  }, [products])

  if (cats.length === 0) return null

  return (
    <div className="mt-8 md:mt-12 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="text-xs font-['Fredoka'] tracking-widest text-muted-foreground uppercase">
          — CATEGORÍAS DE DISEÑO
        </div>
        <div className="h-px flex-1 bg-border" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        <DesignCategoryCard
          name="TODOS"
          count={products.length}
          index={-1}
          isActive={activeCategory === null}
          onSelect={() => onSelect(null)}
        />
        {cats.map(([name, count], i) => (
          <DesignCategoryCard
            key={name}
            name={name}
            count={count}
            index={i}
            isActive={activeCategory === name}
            onSelect={() => onSelect(name)}
          />
        ))}
      </div>
    </div>
  )
}

/* ── Categories section ── */

export function Categories({ activeMaterial, activeCategory, onMaterialSelect, onCategorySelect, products }: CategoriesProps) {
  return (
    <section id="categories" className="scroll-mt-20 pt-16 md:pt-28 pb-16 md:pb-20 border-t border-border">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-end justify-between mb-10 md:mb-14">
          <div className="space-y-3">
            <div className="text-xs font-['Fredoka'] tracking-widest text-primary uppercase">
              — EXPLORA POR MATERIAL
            </div>
            <h2 className="font-['Fredoka'] text-4xl sm:text-5xl md:text-6xl font-900 uppercase leading-none text-foreground">
              ELEGÍ TU MATERIAL.
              
            </h2>
          </div>
          <button
            onClick={() => { onMaterialSelect('all'); onCategorySelect(null) }}
            className="text-xs font-['Fredoka'] tracking-widest text-muted-foreground hover:text-foreground uppercase transition-colors hidden md:block"
          >
            VER TODO →
          </button>
        </div>

        {/* Filter buttons - horizontal scroll on mobile */}
        <div className="overflow-x-auto -mx-4 px-4 mb-8 scrollbar-hide">
          <div className="flex gap-3 w-max">
            <button
              onClick={() => { onMaterialSelect('all'); onCategorySelect(null) }}
              className={`px-5 py-2 font-['Fredoka'] text-sm font-700 tracking-widest uppercase transition-all border rounded-xl shrink-0 ${
                activeMaterial === 'all'
                  ? 'bg-primary text-white border-primary'
                  : 'bg-transparent text-muted-foreground border-border md:hover:border-primary md:hover:text-foreground'
              }`}
            >
              TODOS
            </button>
            {MATERIALS.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => { onMaterialSelect(cat.slug); onCategorySelect(null) }}
                className={`px-5 py-2 font-['Fredoka'] text-sm font-700 tracking-widest uppercase transition-all border rounded-xl shrink-0 ${
                  activeMaterial === cat.slug ? cat.btnActive : cat.btnInactive
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Material cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {MATERIALS.map((material, i) => (
            <MaterialCard
              key={material.slug}
              material={material}
              index={i}
              isActive={activeMaterial === material.slug}
              onSelect={() => { onMaterialSelect(material.slug); onCategorySelect(null) }}
              productCount={products ? products.filter((p) => toMaterialSlug(p.material) === material.slug).length : 0}
            />
          ))}
        </div>

        {/* Design categories — shown when a material is selected */}
        {activeMaterial !== 'all' && products && (
          <DesignCategories
            products={products.filter((p) => toMaterialSlug(p.material) === activeMaterial)}
            activeCategory={activeCategory}
            onSelect={onCategorySelect}
          />
        )}
      </div>
    </section>
  )
}
