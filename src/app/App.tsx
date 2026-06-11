import { useState, useEffect } from 'react'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { Categories } from './components/Categories'
import { Products } from './components/Products'
import type { Product } from './components/Products'
import { Testimonials } from './components/Testimonials'
import { CTA } from './components/CTA'
import { Footer } from './components/Footer'
import { CartDrawer } from './components/CartDrawer'
import { Toaster } from './components/ui/sonner'
import { AdminLogin } from './components/admin/AdminLogin'
import { AdminPanel } from './components/admin/AdminPanel'
import { fetchProducts, fetchCategories } from '../lib/api'
import type { Category } from '../lib/database.types'

interface CartItem extends Product {
  qty: number
}

type AppView = 'public' | 'admin-login' | 'admin'

export default function App() {
  const [view, setView] = useState<AppView>('public')
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('all')
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)

  const loadData = async () => {
    try {
      setLoading(true)
      const [productsData, categoriesData] = await Promise.all([
        fetchProducts(),
        fetchCategories(),
      ])
      setProducts(productsData)
      setCategories(categoriesData)
    } catch (err) {
      console.error('Failed to load data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id)
      if (existing) {
        return prev.map((i) => (i.id === product.id ? { ...i, qty: i.qty + 1 } : i))
      }
      return [...prev, { ...product, qty: 1 }]
    })
  }

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id))
  }

  const updateCartQty = (id: string, qty: number) => {
    setCart((prev) => prev.map((i) => (i.id === id ? { ...i, qty } : i)))
  }

  const cartCount = cart.reduce((s, i) => s + i.qty, 0)

  const content = (() => {
    if (view === 'admin-login') {
      return <AdminLogin onLogin={() => setView('admin')} onBack={() => setView('public')} />
    }

    if (view === 'admin') {
      return (
        <AdminPanel
          products={products}
          categories={categories}
          onRefresh={loadData}
          onLogout={() => setView('public')}
        />
      )
    }

    if (loading) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="font-['Barlow_Condensed'] text-lg text-muted-foreground uppercase tracking-widest">
            Cargando...
          </div>
        </div>
      )
    }

    return (
      <>
        <Navbar
          cartCount={cartCount}
          onAdminClick={() => setView('admin-login')}
          onCartClick={() => setCartOpen(true)}
        />

        <Hero />

        <Categories
          categories={categories}
          activeCategory={activeCategory}
          onCategorySelect={setActiveCategory}
        />

        <Products products={products} activeCategory={activeCategory} onAddToCart={addToCart} />

        <Testimonials />

        <CTA />

        <Footer />

        {cartOpen && (
          <CartDrawer
            items={cart}
            onClose={() => setCartOpen(false)}
            onRemove={removeFromCart}
            onUpdateQty={updateCartQty}
          />
        )}
      </>
    )
  })()

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      {/* Noise overlay */}
      <div
        className="fixed inset-0 z-0 pointer-events-none opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '256px 256px',
        }}
      />
      <div className="relative z-10">
        {content}
      </div>
      <Toaster />
    </div>
  )
}
