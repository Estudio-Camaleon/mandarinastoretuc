import { useState } from 'react'
import { X, ShoppingCart, Plus, Minus, Star } from 'lucide-react'
import { ImageWithFallback } from './ImageWithFallback'
import { WhatsAppIcon } from './WhatsAppIcon'
import { waLink, productMessage } from '../../lib/whatsapp'

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
  rating?: number
  reviews?: number
}

interface ProductsProps {
  products: Product[]
  activeCategory: string
  onAddToCart: (product: Product) => void
}

function ProductModal({
  product,
  onClose,
  onAddToCart,
}: {
  product: Product
  onClose: () => void
  onAddToCart: (p: Product) => void
}) {
  const [qty, setQty] = useState(1)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-card border border-border max-w-2xl w-full overflow-hidden rounded-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X size={20} />
        </button>

        <div className="grid md:grid-cols-2">
          {/* Image */}
          <div className="bg-secondary aspect-square">
            <ImageWithFallback
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details */}
          <div className="p-6 flex flex-col justify-between">
            <div>
              <div className="text-xs font-['Barlow_Condensed'] tracking-widest text-primary uppercase mb-2">
                {product.category}
              </div>
              <h3 className="font-['Barlow_Condensed'] text-3xl font-900 uppercase leading-tight text-foreground mb-3">
                {product.name}
              </h3>

              {/* Rating */}
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

              {/* Specs */}
              <div className="space-y-2 mb-6 border-t border-border pt-4">
                {[
                  { label: 'Material', value: product.material },
                  { label: 'Acabado', value: product.finish },
                  { label: 'Tamaño', value: product.size },
                  { label: 'Impermeable', value: product.waterproof ? 'Sí ✓' : 'No' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between text-xs">
                    <span className="text-muted-foreground font-['Barlow_Condensed'] tracking-wider uppercase">
                      {label}
                    </span>
                    <span className="text-foreground">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              {/* Qty + price */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center border border-border rounded-md overflow-hidden">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="p-2 hover:bg-secondary transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="px-4 font-['Barlow_Condensed'] font-700">{qty}</span>
                  <button
                    onClick={() => setQty(qty + 1)}
                    className="p-2 hover:bg-secondary transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <div className="font-['Barlow_Condensed'] text-3xl font-900 text-primary">
                  ${(product.price * qty).toFixed(2)}
                </div>
              </div>

              <button
                onClick={() => {
                  for (let i = 0; i < qty; i++) onAddToCart(product)
                  onClose()
                }}
                className="w-full bg-primary text-white py-3 font-['Barlow_Condensed'] text-lg font-700 tracking-widest uppercase hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 rounded-md"
              >
                <ShoppingCart size={18} />
                AGREGAR AL CARRITO
              </button>

              <a
                href={waLink(productMessage(product.name, product.price, qty))}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full mt-2 border border-primary text-primary py-3 font-['Barlow_Condensed'] text-base font-700 tracking-widest uppercase hover:bg-primary hover:text-white transition-colors flex items-center justify-center gap-2 rounded-md"
              >
                <WhatsAppIcon size={18} />
                COMPRAR VIA WHATSAPP
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function Products({ products, activeCategory, onAddToCart }: ProductsProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const filtered =
    activeCategory === 'all' ? products : products.filter((p) => p.category === activeCategory)

  return (
    <section id="products" className="py-20 border-t border-border">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <div className="text-xs font-['Barlow_Condensed'] tracking-widest text-primary uppercase mb-2">
            — LA COLECCIÓN
          </div>
          <h2 className="font-['Barlow_Condensed'] text-4xl md:text-5xl font-900 uppercase leading-none text-foreground">
            TODOS LOS
            <br />
            DISEÑOS.
          </h2>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground font-['Barlow_Condensed'] text-xl tracking-widest uppercase">
            Aún no hay productos en esta categoría.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((product) => (
              <div
                key={product.id}
                className="group bg-card border border-border hover:border-primary/60 transition-all duration-200 cursor-pointer rounded-xl overflow-hidden"
                onClick={() => setSelectedProduct(product)}
              >
                {/* Image */}
                <div className="relative aspect-square overflow-hidden bg-secondary">
                  <ImageWithFallback
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <span className="font-['Barlow_Condensed'] text-sm font-700 tracking-widest text-white bg-primary px-4 py-2 uppercase rounded-md">
                      VISTA RÁPIDA
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-3">
                  <div className="text-[10px] font-['Barlow_Condensed'] tracking-widest text-primary uppercase mb-1">
                    {product.category}
                  </div>
                  <h3 className="font-['Barlow_Condensed'] text-base font-700 uppercase leading-tight text-foreground mb-2 line-clamp-1">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="font-['Barlow_Condensed'] text-lg font-900 text-primary">
                      ${product.price.toFixed(2)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onAddToCart(product)
                      }}
                      className="p-2 border border-border hover:bg-primary hover:border-primary hover:text-white transition-all rounded-md"
                      aria-label={`Add ${product.name} to cart`}
                    >
                      <ShoppingCart size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={onAddToCart}
        />
      )}
    </section>
  )
}
