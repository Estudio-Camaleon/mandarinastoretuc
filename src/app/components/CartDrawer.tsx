import { X, Trash2, ShoppingBag } from 'lucide-react'
import { ImageWithFallback } from './ImageWithFallback'
import { WhatsAppIcon } from './WhatsAppIcon'
import { waLink, cartMessage } from '../../lib/whatsapp'
import type { Product } from './Products'

interface CartItem extends Product {
  qty: number
}

interface CartDrawerProps {
  items: CartItem[]
  onClose: () => void
  onRemove: (id: string) => void
  onUpdateQty: (id: string, qty: number) => void
}

export function CartDrawer({ items, onClose, onRemove, onUpdateQty }: CartDrawerProps) {
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0)

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-card border-l border-border flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="font-['Barlow_Condensed'] text-xl font-900 uppercase tracking-wide text-foreground flex items-center gap-2">
            <ShoppingBag size={18} className="text-primary" />
            TU CARRITO
            {items.length > 0 && (
              <span className="text-primary">({items.reduce((s, i) => s + i.qty, 0)})</span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-3">
              <ShoppingBag size={40} />
              <div className="font-['Barlow_Condensed'] tracking-widest uppercase text-sm">
                Tu carrito está vacío
              </div>
              <button
                onClick={onClose}
                className="text-xs text-primary font-['Barlow_Condensed'] tracking-widest uppercase hover:underline"
              >
                SEGUIR COMPRANDO →
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-3 border border-border p-3">
                <div className="w-16 h-16 bg-secondary flex-shrink-0 overflow-hidden">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-['Barlow_Condensed'] font-700 uppercase text-sm leading-tight truncate">
                    {item.name}
                  </div>
                  <div className="text-primary font-['Barlow_Condensed'] font-900">
                    ${item.price.toFixed(2)}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => onUpdateQty(item.id, Math.max(1, item.qty - 1))}
                      className="w-6 h-6 border border-border flex items-center justify-center text-xs hover:bg-secondary transition-colors"
                    >
                      −
                    </button>
                    <span className="text-sm font-['Barlow_Condensed'] font-700 w-4 text-center">
                      {item.qty}
                    </span>
                    <button
                      onClick={() => onUpdateQty(item.id, item.qty + 1)}
                      className="w-6 h-6 border border-border flex items-center justify-center text-xs hover:bg-secondary transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => onRemove(item.id)}
                  className="text-muted-foreground hover:text-destructive transition-colors self-start"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-5 py-5 border-t border-border">
            <div className="flex justify-between items-center mb-4">
              <span className="font-['Barlow_Condensed'] text-sm tracking-widest uppercase text-muted-foreground">
                TOTAL
              </span>
              <span className="font-['Barlow_Condensed'] text-2xl font-900 text-primary">
                ${total.toFixed(2)}
              </span>
            </div>
            <a
              href={waLink(cartMessage(items))}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-primary text-white py-3 font-['Barlow_Condensed'] text-lg font-700 tracking-widest uppercase hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
            >
              <WhatsAppIcon size={18} />
              ENVIAR VIA WHATSAPP →
            </a>
            <button
              onClick={onClose}
              className="w-full mt-2 border border-border text-muted-foreground py-2 font-['Barlow_Condensed'] text-sm font-700 tracking-widest uppercase hover:border-foreground hover:text-foreground transition-colors"
            >
              SEGUIR COMPRANDO
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
