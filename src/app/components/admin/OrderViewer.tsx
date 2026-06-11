import { useState, useEffect, useMemo } from 'react'
import {
  Plus, Pencil, Trash2, Search, X,
  ArrowUpDown, ArrowUp, ArrowDown, AlertTriangle,
} from 'lucide-react'
import { toast } from 'sonner'
import { fetchOrders, createOrder, updateOrder, deleteOrder } from '../../../lib/api'
import { WhatsAppIcon } from '../../components/WhatsAppIcon'
import { waLink, productMessage } from '../../../lib/whatsapp'
import type { Order } from '../../../lib/database.types'

type SortKey = 'order_number' | 'customer_name' | 'product_name' | 'amount' | 'status' | 'created_at'
type SortDir = 'asc' | 'desc'

const STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'] as const
type Status = (typeof STATUSES)[number]

const STATUS_CONFIG: Record<Status, { label: string; classes: string }> = {
  pending:    { label: 'Pendiente',   classes: 'text-yellow-400 bg-yellow-400/10' },
  confirmed:  { label: 'Confirmado',  classes: 'text-blue-400 bg-blue-400/10' },
  shipped:    { label: 'Enviado',     classes: 'text-primary bg-primary/10' },
  delivered:  { label: 'Entregado',   classes: 'text-green-400 bg-green-400/10' },
  cancelled:  { label: 'Cancelado',   classes: 'text-muted-foreground bg-secondary' },
}

const EMPTY_FORM: Omit<Order, 'id' | 'created_at'> = {
  order_number: '',
  customer_name: '',
  customer_phone: '',
  product_name: '',
  quantity: 1,
  amount: 0,
  status: 'pending',
  notes: '',
}

function SortIcon({ sortKey, sortDir, column }: { sortKey: SortKey; sortDir: SortDir; column: SortKey }) {
  if (sortKey !== column) return <ArrowUpDown size={12} className="opacity-40" />
  return sortDir === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />
}

export function OrderViewer() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<Status | 'all'>('all')
  const [sortKey, setSortKey] = useState<SortKey>('created_at')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  // form state
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Omit<Order, 'id' | 'created_at'>>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [formDirty, setFormDirty] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // delete state
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const nextNumber = useMemo(() => {
    const max = orders.reduce((m, o) => {
      const n = parseInt(o.order_number.replace('#', ''), 10)
      return isNaN(n) ? m : Math.max(m, n)
    }, 1042)
    return `#${max + 1}`
  }, [orders])

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      try {
        const data = await fetchOrders()
        setOrders(data)
      } catch {
        toast.error('Error al cargar órdenes')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  // computed
  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    const result = orders.filter((o) => {
      const matchSearch =
        o.customer_name.toLowerCase().includes(q) ||
        o.order_number.toLowerCase().includes(q) ||
        o.product_name.toLowerCase().includes(q)
      const matchStatus = statusFilter === 'all' || o.status === statusFilter
      return matchSearch && matchStatus
    })
    result.sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1
      if (sortKey === 'amount') return (a.amount - b.amount) * dir
      if (sortKey === 'quantity') return (a.quantity - b.quantity) * dir
      const va = String(a[sortKey] ?? '')
      const vb = String(b[sortKey] ?? '')
      return va.localeCompare(vb) * dir
    })
    return result
  }, [orders, search, statusFilter, sortKey, sortDir])

  const total = orders.reduce((s, o) => s + o.amount, 0)

  // ── Modal helpers ──

  const openAdd = () => {
    setForm({ ...EMPTY_FORM, order_number: nextNumber })
    setEditingId(null)
    setErrors({})
    setFormDirty(false)
    setShowForm(true)
  }

  const openEdit = (order: Order) => {
    setForm({
      order_number: order.order_number,
      customer_name: order.customer_name,
      customer_phone: order.customer_phone,
      product_name: order.product_name,
      quantity: order.quantity,
      amount: order.amount,
      status: order.status,
      notes: order.notes,
    })
    setEditingId(order.id)
    setErrors({})
    setFormDirty(false)
    setShowForm(true)
  }

  const closeForm = () => {
    if (formDirty) {
      if (!confirm('¿Descartar cambios no guardados?')) return
    }
    setShowForm(false)
    setEditingId(null)
  }

  const validate = (): boolean => {
    const errs: Record<string, string> = {}
    if (!form.order_number.trim()) errs.order_number = 'Requerido'
    if (!form.customer_name.trim()) errs.customer_name = 'Requerido'
    if (form.customer_phone && !/^\+?\d{7,15}$/.test(form.customer_phone.replace(/[\s-]/g, '')))
      errs.customer_phone = 'Número de teléfono inválido'
    if (!form.product_name.trim()) errs.product_name = 'Requerido'
    if (form.quantity < 1) errs.quantity = 'Mín 1'
    if (form.amount <= 0) errs.amount = 'Debe ser > 0'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSave = async () => {
    if (!validate()) return
    setSaving(true)
    try {
      if (editingId) {
        const updated = await updateOrder(editingId, form)
        setOrders((prev) => prev.map((o) => (o.id === editingId ? updated : o)))
        toast.success('Orden actualizada')
      } else {
        const created = await createOrder(form)
        setOrders((prev) => [created, ...prev])
        toast.success('Orden creada')
      }
      setShowForm(false)
      setEditingId(null)
    } catch {
      toast.error('Error al guardar la orden')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    try {
      await deleteOrder(deleteId)
      setOrders((prev) => prev.filter((o) => o.id !== deleteId))
      toast.success('Orden eliminada')
      setDeleteId(null)
    } catch {
      toast.error('Error al eliminar la orden')
    } finally {
      setDeleting(false)
    }
  }

  const clearErr = (key: string) => {
    if (errors[key]) setErrors((prev) => {
      const { [key as keyof typeof errors]: _d, ...rest } = prev
      return rest
    })
  }

  const changeForm = (patch: Partial<Omit<Order, 'id' | 'created_at'>>) => {
    setForm((prev) => ({ ...prev, ...patch }))
    setFormDirty(true)
  }

  // ── Render ──

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-['Barlow_Condensed'] text-3xl font-900 uppercase tracking-tight text-foreground">
            Órdenes
          </h2>
          <div className="text-muted-foreground text-sm mt-0.5">
            {orders.length} órdenes &middot; ${total.toFixed(2)} total
          </div>
        </div>
        <button
          onClick={openAdd}
          className="bg-primary text-white px-4 py-2 font-['Barlow_Condensed'] text-sm font-700 tracking-widest uppercase hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          <Plus size={14} />
          AGREGAR ORDEN
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-5 gap-3 mb-6">
        {STATUSES.map((s) => {
          const count = orders.filter((o) => o.status === s).length
          return (
            <div key={s} className="bg-card border border-border p-3 text-center">
              <div className={`font-['Barlow_Condensed'] text-2xl font-900 ${STATUS_CONFIG[s].classes.split(' ')[0]}`}>
                {count}
              </div>
              <div className="text-[10px] font-['Barlow_Condensed'] uppercase tracking-widest text-muted-foreground mt-0.5">
                {STATUS_CONFIG[s].label}
              </div>
            </div>
          )
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar órdenes..."
            className="bg-card border border-border pl-8 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors w-56"
          />
        </div>
        <div className="flex gap-2">
          {(['all', ...STATUSES] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 text-xs font-['Barlow_Condensed'] uppercase tracking-widest transition-all border ${
                statusFilter === s
                  ? 'bg-primary text-white border-primary'
                  : 'border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'
              }`}
            >
               {s === 'all' ? 'TODOS' : STATUS_CONFIG[s].label.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-16 text-muted-foreground font-['Barlow_Condensed'] uppercase tracking-widest text-sm">
          Cargando órdenes...
        </div>
      ) : (
        <div className="bg-card border border-border overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {([
                  { key: 'order_number', label: 'Orden' },
                  { key: 'customer_name', label: 'Cliente' },
                  { key: 'product_name', label: 'Producto' },
                  { key: 'amount', label: 'Monto' },
                  { key: 'status', label: 'Estado' },
                  { key: 'created_at', label: 'Fecha' },
                ] as { key: SortKey; label: string }[]).map(({ key, label }) => (
                  <th
                    key={key}
                    onClick={() => toggleSort(key)}
                    className="px-5 py-3 text-left text-[10px] font-['Barlow_Condensed'] uppercase tracking-widest text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      {label} <SortIcon sortKey={sortKey} sortDir={sortDir} column={key} />
                    </div>
                  </th>
                ))}
                <th className="px-5 py-3 text-right text-[10px] font-['Barlow_Condensed'] uppercase tracking-widest text-muted-foreground">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((order) => (
                <tr key={order.id} className="hover:bg-secondary/30 transition-colors group">
                  <td className="px-5 py-4 font-['Barlow_Condensed'] font-700 text-primary">
                    {order.order_number}
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-['Barlow_Condensed'] font-700 text-foreground">
                      {order.customer_name}
                    </div>
                    {order.customer_phone && (
                      <div className="text-[10px] text-muted-foreground mt-0.5">{order.customer_phone}</div>
                    )}
                  </td>
                  <td className="px-5 py-4 text-foreground">{order.product_name}</td>
                  <td className="px-5 py-4">
                    <span className="font-['Barlow_Condensed'] font-900 text-foreground">
                      ${order.amount.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-muted-foreground ml-1">×{order.quantity}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`text-[10px] font-['Barlow_Condensed'] font-700 uppercase tracking-wider px-2 py-0.5 ${
                        STATUS_CONFIG[order.status]?.classes ?? ''
                      }`}
                    >
                      {STATUS_CONFIG[order.status]?.label ?? order.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-[11px] text-muted-foreground">
                    {order.created_at
                      ? new Date(order.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })
                      : '-'}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                      <a
                        href={waLink(productMessage(order.product_name, order.amount / order.quantity, order.quantity))}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-muted-foreground hover:text-primary transition-colors"
                        title="Abrir en WhatsApp"
                      >
                        <WhatsAppIcon size={14} />
                      </a>
                      <button
                        onClick={() => openEdit(order)}
                        className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                        title="Editar"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteId(order.id)}
                        className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-16 text-muted-foreground font-['Barlow_Condensed'] uppercase tracking-widest text-sm">
              {orders.length === 0 ? 'Aún no hay órdenes.' : 'Ninguna orden coincide con tus filtros.'}
            </div>
          )}
        </div>
      )}

      {/* ── Form Modal ── */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
          onClick={closeForm}
        >
          <div
            className="bg-card border border-border w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div className="font-['Barlow_Condensed'] text-xl font-900 uppercase tracking-wide text-foreground">
                {editingId ? 'Editar Orden' : 'Agregar Orden'}
              </div>
              <button
                onClick={closeForm}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5">
              {/* Order Number */}
              <div>
                <label className="block text-xs font-['Barlow_Condensed'] tracking-widest uppercase text-muted-foreground mb-2">
                    Número de Orden *
                </label>
                <input
                  value={form.order_number}
                  onChange={(e) => { changeForm({ order_number: e.target.value }); clearErr('order_number') }}
                  className={`w-full bg-secondary border px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none transition-colors ${
                    errors.order_number ? 'border-destructive' : 'border-border focus:border-primary'
                  }`}
                  placeholder="#1043"
                />
                {errors.order_number && (
                  <div className="text-[10px] text-destructive mt-1 font-['Barlow_Condensed'] tracking-wider flex items-center gap-1">
                    <AlertTriangle size={10} /> {errors.order_number}
                  </div>
                )}
              </div>

              {/* Customer */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-['Barlow_Condensed'] tracking-widest uppercase text-muted-foreground mb-2">
                    Nombre del Cliente *
                  </label>
                  <input
                    value={form.customer_name}
                    onChange={(e) => { changeForm({ customer_name: e.target.value }); clearErr('customer_name') }}
                    className={`w-full bg-secondary border px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none transition-colors ${
                      errors.customer_name ? 'border-destructive' : 'border-border focus:border-primary'
                    }`}
                    placeholder="ej. Kai Martinez"
                  />
                  {errors.customer_name && (
                    <div className="text-[10px] text-destructive mt-1 font-['Barlow_Condensed'] tracking-wider flex items-center gap-1">
                      <AlertTriangle size={10} /> {errors.customer_name}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-['Barlow_Condensed'] tracking-widest uppercase text-muted-foreground mb-2">
                    Teléfono (opcional)
                  </label>
                  <input
                    value={form.customer_phone}
                    onChange={(e) => { changeForm({ customer_phone: e.target.value }); clearErr('customer_phone') }}
                    className={`w-full bg-secondary border px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none transition-colors ${
                      errors.customer_phone ? 'border-destructive' : 'border-border focus:border-primary'
                    }`}
                    placeholder="5491123456701"
                  />
                  {errors.customer_phone && (
                    <div className="text-[10px] text-destructive mt-1 font-['Barlow_Condensed'] tracking-wider flex items-center gap-1">
                      <AlertTriangle size={10} /> {errors.customer_phone}
                    </div>
                  )}
                </div>
              </div>

              {/* Product */}
              <div>
                <label className="block text-xs font-['Barlow_Condensed'] tracking-widest uppercase text-muted-foreground mb-2">
                    Nombre del Producto *
                </label>
                <input
                  value={form.product_name}
                  onChange={(e) => { changeForm({ product_name: e.target.value }); clearErr('product_name') }}
                  className={`w-full bg-secondary border px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none transition-colors ${
                    errors.product_name ? 'border-destructive' : 'border-border focus:border-primary'
                  }`}
                    placeholder="ej. Neon Wolf Sticker"
                />
                {errors.product_name && (
                  <div className="text-[10px] text-destructive mt-1 font-['Barlow_Condensed'] tracking-wider flex items-center gap-1">
                    <AlertTriangle size={10} /> {errors.product_name}
                  </div>
                )}
              </div>

              {/* Quantity & Amount */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-['Barlow_Condensed'] tracking-widest uppercase text-muted-foreground mb-2">
                    Cantidad *
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={form.quantity}
                    onChange={(e) => { changeForm({ quantity: parseInt(e.target.value) || 1 }); clearErr('quantity') }}
                    className={`w-full bg-secondary border px-3 py-2.5 text-sm text-foreground focus:outline-none transition-colors ${
                      errors.quantity ? 'border-destructive' : 'border-border focus:border-primary'
                    }`}
                  />
                  {errors.quantity && (
                    <div className="text-[10px] text-destructive mt-1 font-['Barlow_Condensed'] tracking-wider flex items-center gap-1">
                      <AlertTriangle size={10} /> {errors.quantity}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-['Barlow_Condensed'] tracking-widest uppercase text-muted-foreground mb-2">
                    Monto ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.amount || ''}
                    onChange={(e) => { changeForm({ amount: parseFloat(e.target.value) || 0 }); clearErr('amount') }}
                    className={`w-full bg-secondary border px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none transition-colors ${
                      errors.amount ? 'border-destructive' : 'border-border focus:border-primary'
                    }`}
                    placeholder="9.99"
                  />
                  {errors.amount && (
                    <div className="text-[10px] text-destructive mt-1 font-['Barlow_Condensed'] tracking-wider flex items-center gap-1">
                      <AlertTriangle size={10} /> {errors.amount}
                    </div>
                  )}
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-['Barlow_Condensed'] tracking-widest uppercase text-muted-foreground mb-2">
                  Estado
                </label>
                <div className="flex gap-2 flex-wrap">
                  {STATUSES.map((s) => (
                    <button
                      key={s}
                      onClick={() => changeForm({ status: s })}
                      className={`px-3 py-1.5 text-[10px] font-['Barlow_Condensed'] font-700 uppercase tracking-wider border transition-all ${
                        form.status === s
                          ? 'bg-primary text-white border-primary'
                          : 'border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'
                      }`}
                    >
                      {STATUS_CONFIG[s].label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-['Barlow_Condensed'] tracking-widest uppercase text-muted-foreground mb-2">
                  Notas
                </label>
                <textarea
                  value={form.notes}
                  onChange={(e) => changeForm({ notes: e.target.value })}
                  rows={3}
                  placeholder="Notas de la conversación de WhatsApp..."
                  className="w-full bg-secondary border border-border px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors resize-none"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
              <button
                onClick={closeForm}
                className="px-4 py-2 text-sm font-['Barlow_Condensed'] tracking-widest uppercase text-muted-foreground border border-border hover:text-foreground hover:border-foreground transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 text-sm font-['Barlow_Condensed'] tracking-widest uppercase bg-primary text-white hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {saving && <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />}
                {editingId ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation ── */}
      {deleteId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
          onClick={() => !deleting && setDeleteId(null)}
        >
          <div
            className="bg-card border border-border w-full max-w-sm p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="font-['Barlow_Condensed'] text-lg font-900 uppercase tracking-wide text-foreground mb-2">
              Eliminar Orden
            </div>
            <div className="text-sm text-muted-foreground mb-6">
              ¿Estás seguro de que deseas eliminar esta orden? Esta acción no se puede deshacer.
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                disabled={deleting}
                className="px-4 py-2 text-sm font-['Barlow_Condensed'] tracking-widest uppercase text-muted-foreground border border-border hover:text-foreground hover:border-foreground transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 text-sm font-['Barlow_Condensed'] tracking-widest uppercase bg-destructive text-white hover:bg-destructive/90 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {deleting && <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />}
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
