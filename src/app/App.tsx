import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { Categories } from './components/Categories'
import { Products } from './components/Products'
import type { Product } from './components/Products'
import { ContactForm } from './components/ContactForm'
import { NotFound } from './components/NotFound'
import { Footer } from './components/Footer'
import { AdminLogin } from './components/admin/AdminLogin'
import { AdminPanel } from './components/admin/AdminPanel'
import { useAuth } from './components/admin/AuthContext'
import { fetchProducts } from '../lib/api'

export type AppView = 'public' | 'admin-login' | 'admin'
export type AuthState = 'loading' | 'authenticated' | 'unauthenticated'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="font-['Fredoka'] text-lg text-muted-foreground uppercase tracking-widest">
          Cargando sesión...
        </div>
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

function PublicLayout({
  products,
  activeMaterial,
  activeCategory,
  onMaterialSelect,
  onCategorySelect,
}: {
  products: Product[]
  activeMaterial: string
  activeCategory: string | null
  onMaterialSelect: (slug: string) => void
  onCategorySelect: (category: string | null) => void
}) {
  return (
    <>
      <Navbar />
      <Hero />
      <Categories
        activeMaterial={activeMaterial}
        activeCategory={activeCategory}
        onMaterialSelect={onMaterialSelect}
        onCategorySelect={onCategorySelect}
        products={products}
      />
      <Products products={products} activeMaterial={activeMaterial} activeCategory={activeCategory} />
      <ContactForm />
      <Footer />
    </>
  )
}

export default function App() {
  const [products, setProducts] = useState<Product[]>([])
  const [dataLoading, setDataLoading] = useState(true)
  const [activeMaterial, setActiveMaterial] = useState('all')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const loadData = async () => {
    try {
      setDataLoading(true)
      const productsData = await fetchProducts()
      setProducts(productsData)
    } catch (err) {
      console.error('Failed to load data:', err)
    } finally {
      setDataLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const noiseOverlay = (
    <div
      className="fixed inset-0 z-0 pointer-events-none opacity-[0.05] mix-blend-overlay"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '256px 256px',
      }}
    />
  )

  if (dataLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground relative">
        {noiseOverlay}
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="font-['Fredoka'] text-lg text-muted-foreground uppercase tracking-widest">
            Cargando...
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      {noiseOverlay}
      <div className="relative z-10">
        <Routes>
          <Route
            path="/"
            element={
              <PublicLayout
                products={products}
                activeMaterial={activeMaterial}
                activeCategory={activeCategory}
                onMaterialSelect={setActiveMaterial}
                onCategorySelect={setActiveCategory}
              />
            }
          />
          <Route path="/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminPanel
                  products={products}
                  onRefresh={loadData}
                />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  )
}
