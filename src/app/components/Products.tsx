import { useState, useRef, useEffect } from 'react'
import { X, Star, Instagram, Share2, Info } from 'lucide-react'
import { ImageWithFallback } from './ImageWithFallback'
import { WhatsAppIcon } from './WhatsAppIcon'
import { waLink, productInquiryMessage } from '../../lib/whatsapp'
import { toMaterialSlug } from '../../lib/site'

const INSTAGRAM_URL = 'https://www.instagram.com/mandarina.store.tuc/'

export interface Product {
  id: string
  name: string
  price: number
  category: string
  description: string
  image: string
  material: string
  finish: string
  size: string
  waterproof: boolean
  rating: number
  reviews: number
}

interface ProductsProps {
  products: Product[]
  activeMaterial: string
  activeCategory: string | null
}

/* ── Full detail modal (opened from "VER INFO") ── */

function ProductModal({ product, onClose }: { product: Product; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-card border border-border max-w-2xl w-full overflow-y-auto max-h-[90dvh] md:max-h-[85vh] rounded-t-xl md:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-2 bg-background/80 rounded-full text-muted-foreground hover:text-foreground transition-colors"
        >
          <X size={18} />
        </button>

        <div className="md:grid md:grid-cols-2">
          <div className="bg-secondary flex items-center justify-center p-6">
            <ImageWithFallback
              src={product.image}
              alt={product.name}
              className="w-full h-full max-h-[50vh] md:max-h-[70vh] object-contain"
            />
          </div>

          <div className="p-5 md:p-6 flex flex-col justify-between">
            <div>
              <div className="text-xs font-['Fredoka'] tracking-widest text-primary uppercase mb-2">
                {product.category}
              </div>
              <h3 className="font-['Fredoka'] text-2xl md:text-3xl font-900 uppercase leading-tight text-foreground mb-3">
                {product.name}
              </h3>

              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={12}
                      className={
                        i < (product.rating ?? 5)
                          ? 'fill-primary text-primary'
                          : 'text-muted-foreground'
                      }
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">
                  ({product.reviews ?? 0} reseñas)
                </span>
              </div>

              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                {product.description}
              </p>

              <div className="space-y-2 mb-6 border-t border-border pt-4">
                {[
                  { label: 'Material', value: product.material },
                  { label: 'Acabado', value: product.finish },
                  { label: 'Tamaño', value: product.size },
                  { label: 'Impermeable', value: product.waterproof ? 'Sí ✓' : 'No' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between text-xs">
                    <span className="text-muted-foreground font-['Fredoka'] tracking-wider uppercase">
                      {label}
                    </span>
                    <span className="text-foreground">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="font-['Fredoka'] text-3xl font-900 text-primary">
                ${product.price.toFixed(2)}
              </div>

              <a
                href={waLink(productInquiryMessage(product.name, product.price))}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-primary text-white py-3 font-['Fredoka'] text-base md:text-lg font-700 tracking-widest uppercase hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 rounded-xl"
              >
                <WhatsAppIcon size={18} />
                CONSULTAR POR WHATSAPP
              </a>

              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full border border-border text-muted-foreground py-3 font-['Fredoka'] text-base md:text-lg font-700 tracking-widest uppercase hover:border-foreground hover:text-foreground transition-colors flex items-center justify-center gap-2 rounded-xl"
              >
                <Instagram size={18} />
                CONSULTAR POR INSTAGRAM
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Action bubble (appears on card click) ── */

function ActionBubble({
  product,
  onViewInfo,
  onClose,
}: {
  product: Product
  onViewInfo: () => void
  onClose: () => void
}) {
  const handleShare = async () => {
    const text = `${product.name} — $${product.price.toFixed(2)}\n${product.description}\n\n${INSTAGRAM_URL}`
    if (navigator.share) {
      await navigator.share({ title: product.name, text }).catch(() => {})
    } else {
      await navigator.clipboard.writeText(text)
    }
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xs mx-0 md:mx-auto bg-card border border-border rounded-t-2xl md:rounded-[20px] shadow-2xl overflow-hidden animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Product preview */}
        <div className="flex items-center gap-3 p-4 border-b border-border">
          <div className="w-14 h-14 bg-secondary rounded-2xl overflow-hidden shrink-0">
            <ImageWithFallback
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-['Fredoka'] tracking-widest text-primary uppercase truncate">
              {product.category}
            </div>
            <div className="font-['Fredoka'] text-sm font-700 uppercase text-foreground truncate">
              {product.name}
            </div>
            <div className="font-['Fredoka'] text-base font-900 text-primary">
              ${product.price.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-2">
          <button
            onClick={() => { onViewInfo(); onClose() }}
            className="w-full flex items-center gap-3 px-3 py-3 text-sm text-foreground hover:bg-secondary/50 transition-colors rounded-2xl"
          >
            <Info size={18} className="text-muted-foreground shrink-0" />
            <span className="font-['Fredoka'] tracking-wider uppercase text-sm">Ver info</span>
          </button>

          <a
            href={waLink(productInquiryMessage(product.name, product.price))}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center gap-3 px-3 py-3 text-sm text-foreground hover:bg-secondary/50 transition-colors rounded-2xl"
          >
            <WhatsAppIcon size={18} className="text-muted-foreground shrink-0" />
            <span className="font-['Fredoka'] tracking-wider uppercase text-sm">Comprar</span>
          </a>

          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center gap-3 px-3 py-3 text-sm text-foreground hover:bg-secondary/50 transition-colors rounded-2xl"
          >
            <Instagram size={18} className="text-muted-foreground shrink-0" />
            <span className="font-['Fredoka'] tracking-wider uppercase text-sm">Instagram</span>
          </a>

          <button
            onClick={handleShare}
            className="w-full flex items-center gap-3 px-3 py-3 text-sm text-foreground hover:bg-secondary/50 transition-colors rounded-2xl"
          >
            <Share2 size={18} className="text-muted-foreground shrink-0" />
            <span className="font-['Fredoka'] tracking-wider uppercase text-sm">Compartir</span>
          </button>
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          className="w-full border-t border-border py-3 text-xs font-['Fredoka'] tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
        >
          Cerrar
        </button>
      </div>
    </div>
  )
}

/* ── Individual product card ── */

function ProductCard({
  product,
  index,
  onSelect,
}: {
  product: Product
  index: number
  onSelect: () => void
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const shineRef = useRef<HTMLDivElement>(null)
  const holoRef = useRef<HTMLDivElement>(null)

  const isHolo = product.finish?.toLowerCase().includes('holo')

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

    if (holoRef.current) {
      holoRef.current.style.backgroundPosition = `${px * 100}% ${py * 100}%, ${x}px ${y}px`
      holoRef.current.style.opacity = '0.9'
    }
  }

  function handleMouseLeave() {
    const card = cardRef.current
    if (!card) return
    card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)'
    if (shineRef.current) shineRef.current.style.opacity = ''
    if (holoRef.current) holoRef.current.style.opacity = ''
  }

  const maskStyle = {
    WebkitMaskImage: `url(${product.image})`,
    maskImage: `url(${product.image})`,
  }

  return (
    <div
      className="animate-fade-in"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div
        ref={cardRef}
        className="group cursor-pointer sticker-card"
        onClick={onSelect}
        {...(!isMobile ? { onMouseMove: handleMouseMove, onMouseLeave: handleMouseLeave } : {})}
      >
        {/* Image — just the shape, no background */}
        <div className="relative sticker-content">
          <ImageWithFallback
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain aspect-[4/5]"
          />
          <div ref={shineRef} className="sticker-shine" style={maskStyle} />
          {isHolo && <div ref={holoRef} className="sticker-holo" style={maskStyle} />}
          {/* Touch/click hint */}
          <div className="absolute inset-0 group-active:bg-black/5 md:group-hover:bg-black/5 transition-all duration-200 flex items-center justify-center opacity-0 group-active:opacity-100 md:group-hover:opacity-100 pointer-events-none">
            <span className="font-['Fredoka'] text-xs font-700 tracking-widest text-white bg-primary/80 px-3 py-1.5 uppercase rounded-lg">
              VER MÁS
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="pt-1.5 md:pt-2">
          <div className="text-[10px] font-['Fredoka'] tracking-widest text-primary uppercase truncate">
            {product.category}
          </div>
          <h3 className="font-['Fredoka'] text-sm md:text-base font-700 uppercase leading-tight text-foreground truncate">
            {product.name}
          </h3>
          <div className="font-['Fredoka'] text-base md:text-lg font-900 text-primary">
            ${product.price.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Products section ── */

export function Products({ products, activeMaterial, activeCategory }: ProductsProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [showInfoFor, setShowInfoFor] = useState<Product | null>(null)

  const filtered = products.filter((p) => {
    if (activeMaterial !== 'all' && toMaterialSlug(p.material) !== activeMaterial) return false
    if (activeCategory && p.category !== activeCategory) return false
    return true
  })

  return (
    <section id="products" className="scroll-mt-20 pt-16 md:pt-28 pb-16 md:pb-20 border-t border-border">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-10 md:mb-14 space-y-3">
          <div className="text-xs font-['Fredoka'] tracking-widest text-primary uppercase">
            — LA COLECCIÓN
          </div>
          <h2 className="font-['Fredoka'] text-4xl sm:text-5xl md:text-6xl font-900 uppercase leading-none text-foreground text-center">
            TODOS LOS DISEÑOS.
          </h2>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground font-['Fredoka'] text-xl tracking-widest uppercase animate-fade-in">
            Aún no hay productos en esta categoría.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {filtered.map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                index={i}
                onSelect={() => setSelectedProduct(product)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Action bubble */}
      {selectedProduct && !showInfoFor && (
        <ActionBubble
          product={selectedProduct}
          onViewInfo={() => setShowInfoFor(selectedProduct)}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {/* Full detail modal */}
      {showInfoFor && (
        <ProductModal
          product={showInfoFor}
          onClose={() => { setShowInfoFor(null); setSelectedProduct(null) }}
        />
      )}
    </section>
  )
}
