import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, ChevronRight } from 'lucide-react'
import { useAuth } from '../components/admin/AuthContext'

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { session } = useAuth()
  const isLoggedIn = !!session

  useEffect(() => {
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  const scrollTo = (id: string) => {
    if (location.pathname !== '/') {
      navigate('/')
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({
          behavior: reducedMotion ? 'auto' : 'smooth',
        })
      }, 100)
    } else {
      document.getElementById(id)?.scrollIntoView({
        behavior: reducedMotion ? 'auto' : 'smooth',
      })
    }
    setMenuOpen(false)
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur border-b border-border">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
        {/* Logo */}
        <button onClick={() => scrollTo('hero')} className="flex items-center">
          <img
            src="/media/logos/Mandarina_logo_v2.svg"
            alt="MandarinaStore"
            className="h-9 w-auto"
          />
        </button>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          <button
            onClick={() => scrollTo('hero')}
            className="text-xs font-['Barlow_Condensed'] tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
          >
            Inicio
          </button>
          <button
            onClick={() => scrollTo('categories')}
            className="text-xs font-['Barlow_Condensed'] tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
          >
            Colecciones
          </button>
          <button
            onClick={() => scrollTo('products')}
            className="text-xs font-['Barlow_Condensed'] tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
          >
            Productos
          </button>
          <button
            onClick={() => navigate(isLoggedIn ? '/admin' : '/login')}
            className={`text-xs font-['Barlow_Condensed'] tracking-widest transition-colors px-2 py-1 border ${
              isLoggedIn
                ? 'text-foreground border-primary'
                : 'text-muted-foreground border-border hover:text-foreground hover:border-primary'
            }`}
          >
            {isLoggedIn ? 'PANEL' : 'ADMIN'}
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-3 -mr-3"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden bg-card border-t border-border overflow-hidden transition-all duration-300 ${
          menuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 py-3 flex flex-col gap-1">
          {[
            { label: 'Inicio', id: 'hero' },
            { label: 'Colecciones', id: 'categories' },
            { label: 'Productos', id: 'products' },
          ].map(({ label, id }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="flex items-center justify-between w-full py-3 px-2 text-left font-['Barlow_Condensed'] text-lg font-700 tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
            >
              {label}
              <ChevronRight size={14} className="text-muted-foreground" />
            </button>
          ))}
          <div className="border-t border-border my-1" />
          <button
            onClick={() => {
              navigate(isLoggedIn ? '/admin' : '/login')
              setMenuOpen(false)
            }}
            className={`flex items-center justify-between w-full py-3 px-2 text-left font-['Barlow_Condensed'] text-lg font-700 tracking-widest uppercase transition-colors ${
              isLoggedIn ? 'text-primary' : 'text-muted-foreground hover:text-primary'
            }`}
          >
            {isLoggedIn ? 'PANEL' : 'ADMIN'}
            <ChevronRight size={14} className="text-muted-foreground" />
          </button>
        </div>
      </div>
    </nav>
  )
}
