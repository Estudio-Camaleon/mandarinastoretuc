import { useState, useEffect } from 'react'
import { Package, ShoppingBag, TrendingUp, ArrowRight } from 'lucide-react'
import { Skeleton } from '../ui/skeleton'
import type { Product } from '../Products'
import { fetchOrders } from '../../../lib/api'
import { MATERIALS } from '../../../lib/site'

type AdminView = 'dashboard' | 'products'

interface DashboardProps {
  products: Product[]
  onNavigate: (view: AdminView) => void
}

const STATUS_COLORS: Record<string, string> = {
  shipped: 'text-primary bg-primary/10',
  confirmed: 'text-blue-400 bg-blue-400/10',
  delivered: 'text-green-400 bg-green-400/10',
  pending: 'text-yellow-400 bg-yellow-400/10',
  cancelled: 'text-muted-foreground bg-secondary',
}

function StatCard({
  label,
  value,
  Icon,
  color,
  action,
}: {
  label: string
  value: string | number
  Icon: React.FC<{ size?: number }>
  color: string
  action: () => void
}) {
  return (
    <button
      onClick={action}
      className="bg-card border border-border p-5 text-left hover:border-primary/50 transition-colors group"
    >
      <div className={`${color} mb-3`}>
        <Icon size={20} />
      </div>
      <div className="font-['Fredoka'] text-3xl font-900 text-foreground">{value}</div>
      <div className="text-xs font-['Fredoka'] tracking-widest text-muted-foreground uppercase mt-1">
        {label}
      </div>
      <div className="text-primary opacity-0 group-hover:opacity-100 transition-opacity text-xs font-['Fredoka'] uppercase tracking-widest mt-2">
        GESTIONAR →
      </div>
    </button>
  )
}

export function Dashboard({ products, onNavigate }: DashboardProps) {
  const [orders, setOrders] = useState<
    {
      id: string
      order_number: string
      customer_name: string
      product_name: string
      status: string
      amount: number
      date: string
    }[]
  >([])
  const [ordersLoading, setOrdersLoading] = useState(false)

  useEffect(() => {
    ;(async () => {
      setOrdersLoading(true)
      try {
        const data = await fetchOrders()
        setOrders(
          data.slice(0, 5).map((o) => ({
            id: o.id,
            order_number: o.order_number,
            customer_name: o.customer_name,
            product_name: o.product_name,
            status: o.status,
            amount: o.amount,
            date: o.created_at
              ? new Date(o.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })
              : '',
          })),
        )
      } catch (err) {
        console.error('Failed to load orders:', err)
      } finally {
        setOrdersLoading(false)
      }
    })()
  }, [])

  const revenue = orders.reduce((sum, o) => sum + o.amount, 0)

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Productos"
          value={products.length}
          Icon={Package}
          color="text-primary"
          action={() => onNavigate('products')}
        />
        <StatCard
          label="Materiales"
          value={MATERIALS.length}
          Icon={Package}
          color="text-blue-400"
          action={() => {}}
        />
        <StatCard
          label="Órdenes"
          value={ordersLoading ? '...' : orders.length}
          Icon={ShoppingBag}
          color="text-green-400"
          action={() => {}}
        />
        <StatCard
          label="Ingresos"
          value={ordersLoading ? '...' : `$${revenue.toFixed(2)}`}
          Icon={TrendingUp}
          color="text-yellow-400"
          action={() => {}}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent orders */}
        <div className="lg:col-span-2 bg-card border border-border">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <div className="font-['Fredoka'] font-700 uppercase tracking-wide text-foreground">
              Órdenes Recientes
            </div>
            <button className="text-xs text-primary font-['Fredoka'] uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">
              VER TODO <ArrowRight size={12} />
            </button>
          </div>
          {ordersLoading ? (
            <div className="divide-y divide-border">
              {[1, 2, 3].map((i) => (
                <div key={i} className="px-5 py-4 flex items-center gap-4">
                  <Skeleton className="h-4 w-16" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-3.5 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                  <div className="text-right space-y-2">
                    <Skeleton className="h-4 w-16 ml-auto" />
                    <Skeleton className="h-3 w-12 ml-auto" />
                  </div>
                </div>
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-muted-foreground font-['Fredoka'] uppercase tracking-widest">
              Aún no hay órdenes
            </div>
          ) : (
            <div className="divide-y divide-border">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="px-5 py-3 flex items-center justify-between gap-3 hover:bg-secondary/30 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="font-['Fredoka'] text-primary text-sm font-700 w-14 flex-shrink-0">
                      {order.order_number}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm text-foreground font-['Fredoka'] font-600 truncate">
                        {order.customer_name}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {order.product_name}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span
                      className={`text-[10px] font-['Fredoka'] font-700 uppercase tracking-wider px-2 py-0.5 ${STATUS_COLORS[order.status] ?? ''}`}
                    >
                      {order.status}
                    </span>
                    <div className="text-right">
                      <div className="font-['Fredoka'] font-900 text-foreground">
                        ${order.amount.toFixed(2)}
                      </div>
                      <div className="text-[10px] text-muted-foreground">{order.date}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Design categories breakdown */}
        <div className="bg-card border border-border">
          <div className="px-5 py-4 border-b border-border">
            <div className="font-['Fredoka'] font-700 uppercase tracking-wide text-foreground">
              Por Categoría
            </div>
          </div>
          <div className="p-5 space-y-3">
            {(() => {
              const counts: Record<string, number> = {}
              products.forEach((p) => {
                const key = p.category || 'Sin categoría'
                counts[key] = (counts[key] || 0) + 1
              })
              const entries = Object.entries(counts).sort((a, b) => b[1] - a[1])
              return entries.length ? entries.map(([name, count]) => {
                const pct = products.length ? Math.round((count / products.length) * 100) : 0
                return (
                  <div key={name}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-['Fredoka'] uppercase tracking-wider text-foreground capitalize">
                        {name}
                      </span>
                      <span className="text-muted-foreground">{count} productos</span>
                    </div>
                    <div className="w-full bg-secondary h-1.5">
                      <div
                        className="h-full bg-primary transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              }) : (
                <div className="text-xs text-muted-foreground font-['Fredoka'] uppercase tracking-widest text-center py-4">
                  Sin datos
                </div>
              )
            })()}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div>
        <div className="font-['Fredoka'] text-sm font-700 uppercase tracking-widest text-muted-foreground mb-4">
          Acciones Rápidas
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            {
              label: 'Agregar Producto',
              action: () => onNavigate('products'),
              desc: 'Subir un nuevo diseño vinílico',
            },
            {
              label: 'Todos los Productos',
              action: () => onNavigate('products'),
              desc: 'Gestionar tu catálogo',
            },
          ].map(({ label, action, desc }) => (
            <button
              key={label}
              onClick={action}
              className="bg-card border border-border p-4 text-left hover:border-primary hover:bg-primary/5 transition-all group"
            >
              <div className="font-['Fredoka'] font-700 uppercase tracking-wide text-foreground group-hover:text-primary transition-colors text-sm">
                {label}
              </div>
              <div className="text-xs text-muted-foreground mt-1">{desc}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
