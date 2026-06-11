import { useState } from 'react'
import {
  LayoutDashboard,
  Package,
  Tag,
  ShoppingBag,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react'
import type { Product } from '../Products'
import type { Category } from '../../../lib/database.types'
import { Dashboard } from './Dashboard'
import { ProductManager } from './ProductManager'
import { CategoryManager } from './CategoryManager'
import { OrderViewer } from './OrderViewer'

interface AdminPanelProps {
  products: Product[]
  categories: Category[]
  onRefresh: () => void
  onLogout: () => void
}

type AdminView = 'dashboard' | 'products' | 'categories' | 'orders'

const NAV_ITEMS: { id: AdminView; label: string; Icon: React.FC<{ size?: number }> }[] = [
  { id: 'dashboard', label: 'Panel', Icon: LayoutDashboard },
  { id: 'products', label: 'Productos', Icon: Package },
  { id: 'categories', label: 'Categorías', Icon: Tag },
  { id: 'orders', label: 'Órdenes', Icon: ShoppingBag },
]

export function AdminPanel({ products, categories, onRefresh, onLogout }: AdminPanelProps) {
  const [view, setView] = useState<AdminView>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const renderView = () => {
    switch (view) {
      case 'dashboard':
        return <Dashboard products={products} categories={categories} onNavigate={setView} />
      case 'products':
        return <ProductManager products={products} categories={categories} onRefresh={onRefresh} />
      case 'categories':
        return <CategoryManager categories={categories} products={products} onRefresh={onRefresh} />
      case 'orders':
        return <OrderViewer />
    }
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-56 bg-card border-r border-border flex flex-col transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="px-5 py-5 border-b border-border flex items-center justify-between">
          <img
            src="/media/logos/sticker_mandarina.png"
            alt="MandarinaStore"
            className="h-7 w-auto"
          />
          <button
            className="md:hidden text-muted-foreground hover:text-foreground"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-3 py-2 border-b border-border">
          <div className="text-[10px] font-['Barlow_Condensed'] tracking-widest text-muted-foreground uppercase px-2">
            Panel de Administración
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-2 py-3">
          {NAV_ITEMS.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => {
                setView(id)
                setSidebarOpen(false)
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 mb-1 transition-all text-sm font-['Barlow_Condensed'] font-600 tracking-wide uppercase ${
                view === id
                  ? 'bg-primary text-white'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
            >
              <Icon size={16} />
              {label}
              {view === id && <ChevronRight size={14} className="ml-auto" />}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-border">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-muted-foreground hover:text-destructive transition-colors text-sm font-['Barlow_Condensed'] uppercase tracking-wide"
          >
            <LogOut size={16} />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

        {/* Main content */}
      <div className="flex-1 md:ml-56 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-card border-b border-border px-4 md:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden text-muted-foreground hover:text-foreground"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            {view !== 'dashboard' ? (
              <button
                onClick={() => setView('dashboard')}
                className="flex items-center gap-1 text-xs font-['Barlow_Condensed'] tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
              >
                ← PANEL
              </button>
            ) : (
              <div className="font-['Barlow_Condensed'] text-lg font-700 uppercase tracking-wide text-foreground">
                {NAV_ITEMS.find((n) => n.id === view)?.label}
              </div>
            )}
          </div>
          <button
            onClick={onLogout}
            className="text-xs font-['Barlow_Condensed'] tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors hidden md:block"
          >
            ← VOLVER A LA TIENDA
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-8">{renderView()}</main>
      </div>
    </div>
  )
}
