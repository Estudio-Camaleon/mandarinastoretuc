import { useState } from 'react'
import { ShoppingCart, Menu, X } from 'lucide-react'

interface NavbarProps {
  cartCount: number
  onAdminClick: () => void
  onCartClick: () => void
}

export function Navbar({ cartCount, onAdminClick, onCartClick }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur border-b border-border">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
        {/* Logo */}
        <button onClick={() => scrollTo('hero')} className="flex items-center">
          <img
            src="/media/logos/sticker_mandarina.png"
            alt="MandarinaStore"
            className="h-9 md:h-9 w-auto"
          />
        </button>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { label: 'TIENDA', id: 'products' },
            { label: 'COLECCIONES', id: 'categories' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="text-sm font-['Barlow_Condensed'] font-700 tracking-widest text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onCartClick}
            className="relative p-2 hover:text-primary transition-colors"
            aria-label="Cart"
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-[10px] font-black rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
          <button
            onClick={onAdminClick}
            className="hidden md:block text-xs font-['Barlow_Condensed'] tracking-widest text-muted-foreground hover:text-foreground transition-colors px-2 py-1 border border-border hover:border-primary"
          >
            ADMIN
          </button>
          <button
            className="md:hidden p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-card border-t border-border px-4 py-4 flex flex-col gap-4">
          {[
            { label: 'TIENDA', id: 'products' },
            { label: 'COLECCIONES', id: 'categories' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="text-left font-['Barlow_Condensed'] text-lg font-700 tracking-widest text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => {
              onAdminClick()
              setMenuOpen(false)
            }}
            className="text-left font-['Barlow_Condensed'] text-lg font-700 tracking-widest text-muted-foreground hover:text-primary transition-colors"
          >
            ADMIN
          </button>
        </div>
      )}
    </nav>
  )
}
