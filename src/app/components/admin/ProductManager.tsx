import { useState, useRef, useMemo, useEffect } from 'react'
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Upload,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  AlertTriangle,
} from 'lucide-react'
import { toast } from 'sonner'
import { ImageWithFallback } from '../ImageWithFallback'
import type { Product } from '../Products'
import { createProduct, updateProduct, deleteProduct, uploadImage } from '../../../lib/api'
import { FIXED_CATEGORIES } from '../../../lib/site'

interface ProductManagerProps {
  products: Product[]
  onRefresh: () => void
}

type SortKey = 'name' | 'price' | 'category'
type SortDir = 'asc' | 'desc'

const EMPTY_FORM: Omit<Product, 'id' | 'created_at'> = {
  name: '',
  price: 0,
  category: '',
  description: '',
  image: '',
  material: 'Vinilo',
  finish: 'Mate',
  size: '7.5 × 5 cm',
  waterproof: true,
  rating: 5,
  reviews: 0,
}

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']
const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB

function SortIcon({
  sortKey,
  sortDir,
  column,
}: {
  sortKey: SortKey
  sortDir: SortDir
  column: SortKey
}) {
  if (sortKey !== column) return <ArrowUpDown size={12} className="opacity-40" />
  return sortDir === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />
}

export function ProductManager({ products, onRefresh }: ProductManagerProps) {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Omit<Product, 'id'>>(EMPTY_FORM)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [search, setSearch] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [sortKey, setSortKey] = useState<SortKey>('name')
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [formDirty, setFormDirty] = useState(false)
  const [confirmClose, setConfirmClose] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const fileRef = useRef<HTMLInputElement>(null)

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    const result = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q),
    )
    result.sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1
      if (sortKey === 'price') return (a.price - b.price) * dir
      return a[sortKey].localeCompare(b[sortKey]) * dir
    })
    return result
  }, [products, search, sortKey, sortDir])

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const openAdd = () => {
    setForm(EMPTY_FORM)
    setImagePreview('')
    setEditingId(null)
    setFormDirty(false)
    setErrors({})
    setShowForm(true)
  }

  const openEdit = (product: Product) => {
    setForm({
      name: product.name,
      price: product.price,
      category: product.category,
      description: product.description,
      image: product.image,
      material: product.material,
      finish: product.finish,
      size: product.size,
      waterproof: product.waterproof,
      rating: product.rating,
      reviews: product.reviews,
    })
    setImagePreview(product.image)
    setEditingId(product.id)
    setFormDirty(false)
    setErrors({})
    setShowForm(true)
  }

  const handleClose = () => {
    if (formDirty) {
      setConfirmClose(true)
    } else {
      setShowForm(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast.error('Tipo de imagen inválido. Usa JPEG, PNG, WebP o AVIF.')
      return
    }
    if (file.size > MAX_IMAGE_SIZE) {
      toast.error('Imagen demasiado grande. Máximo 5MB.')
      return
    }

    setUploadingImage(true)
    try {
      const url = await uploadImage(file)
      setImagePreview(url)
      setForm((f) => ({ ...f, image: url }))
      setFormDirty(true)
      toast.success('Imagen subida')
    } catch (err) {
      toast.error('Error al subir imagen')
      console.error(err)
    } finally {
      setUploadingImage(false)
    }
  }

  const validate = (): boolean => {
    const errs: Record<string, string> = {}
    if (!form.name.trim()) errs.name = 'El nombre del producto es requerido'
    if (form.name.length > 100) errs.name = 'El nombre es demasiado largo (máx 100 caracteres)'
    if (!form.category) errs.category = 'Selecciona una categoría'
    if (form.price <= 0) errs.price = 'El precio debe ser mayor a 0'
    if (form.price > 9999) errs.price = 'El precio parece demasiado alto'
    if (form.description.length > 500) errs.description = 'La descripción es demasiado larga (máx 500 caracteres)'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSave = async () => {
    if (!validate()) return
    setSaving(true)
    try {
      const image =
        form.image ||
        `https://images.unsplash.com/photo-1770375142184-4655d2bd2d4e?w=400&h=400&fit=crop&auto=format`
      if (editingId) {
        await updateProduct(editingId, { ...form, image })
        toast.success('Producto actualizado')
      } else {
        await createProduct({ ...form, image })
        toast.success('Producto creado')
      }
      setShowForm(false)
      onRefresh()
    } catch (err) {
      toast.error('Error al guardar el producto')
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    setDeleting(true)
    try {
      await deleteProduct(id)
      toast.success('Producto eliminado')
      setDeleteId(null)
      onRefresh()
    } catch (err) {
      toast.error('Error al eliminar el producto')
      console.error(err)
    } finally {
      setDeleting(false)
    }
  }

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showForm && !confirmClose) {
        handleClose()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  })

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-['Barlow_Condensed'] text-3xl font-900 uppercase tracking-tight text-foreground">
            Productos
          </h2>
          <div className="text-muted-foreground text-sm mt-0.5">
            {products.length} diseños vinílicos
          </div>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 font-['Barlow_Condensed'] text-sm font-700 uppercase tracking-widest hover:bg-primary/90 transition-colors"
        >
          <Plus size={16} />
          AGREGAR PRODUCTO
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre, categoría o descripción..."
          className="w-full bg-card border border-border pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors max-w-md"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-card border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th
                  className="px-5 py-3 text-left text-[10px] font-['Barlow_Condensed'] uppercase tracking-widest text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors"
                  onClick={() => toggleSort('name')}
                >
                  <div className="flex items-center gap-1">
                    Producto <SortIcon sortKey={sortKey} sortDir={sortDir} column="name" />
                  </div>
                </th>
                <th
                  className="px-5 py-3 text-left text-[10px] font-['Barlow_Condensed'] uppercase tracking-widest text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors"
                  onClick={() => toggleSort('category')}
                >
                  <div className="flex items-center gap-1">
                    Categoría <SortIcon sortKey={sortKey} sortDir={sortDir} column="category" />
                  </div>
                </th>
                <th
                  className="px-5 py-3 text-left text-[10px] font-['Barlow_Condensed'] uppercase tracking-widest text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors"
                  onClick={() => toggleSort('price')}
                >
                  <div className="flex items-center gap-1">
                    Precio <SortIcon sortKey={sortKey} sortDir={sortDir} column="price" />
                  </div>
                </th>
                <th className="px-5 py-3 text-left text-[10px] font-['Barlow_Condensed'] uppercase tracking-widest text-muted-foreground">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((product) => (
                <tr key={product.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-secondary flex-shrink-0 overflow-hidden rounded">
                        <ImageWithFallback
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-['Barlow_Condensed'] font-700 uppercase text-sm text-foreground">
                          {product.name}
                        </div>
                        <div className="text-xs text-muted-foreground line-clamp-1 max-w-xs">
                          {product.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-xs font-['Barlow_Condensed'] uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="font-['Barlow_Condensed'] font-900 text-foreground">
                      ${product.price.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(product)}
                        className="p-1.5 text-muted-foreground hover:text-foreground border border-transparent hover:border-border transition-all"
                        aria-label="Editar"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteId(product.id)}
                        className="p-1.5 text-muted-foreground hover:text-destructive border border-transparent hover:border-destructive/30 transition-all"
                        aria-label="Eliminar"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center py-12 text-muted-foreground font-['Barlow_Condensed'] uppercase tracking-widest text-sm"
                  >
                    {search
                      ? 'No hay productos que coincidan con tu búsqueda'
                      : 'Aún no hay productos — crea tu primer diseño'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Results info */}
      {filtered.length > 0 && filtered.length < products.length && (
        <div className="text-xs text-muted-foreground mt-3 font-['Barlow_Condensed'] tracking-wider">
          Mostrando {filtered.length} de {products.length} productos
        </div>
      )}

      {/* Form modal */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose()
          }}
        >
          <div className="bg-card border border-border w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-card z-10">
              <div className="font-['Barlow_Condensed'] text-xl font-700 uppercase tracking-wide text-foreground">
                {editingId ? 'EDITAR PRODUCTO' : 'AGREGAR PRODUCTO'}
              </div>
              <button onClick={handleClose} className="text-muted-foreground hover:text-foreground">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Image upload */}
              <div>
                <label className="block text-xs font-['Barlow_Condensed'] tracking-widest uppercase text-muted-foreground mb-2">
                  Imagen del Producto
                </label>
                <div
                  className="border-2 border-dashed border-border hover:border-primary transition-colors cursor-pointer aspect-video bg-secondary flex flex-col items-center justify-center gap-3 relative overflow-hidden"
                  onClick={() => fileRef.current?.click()}
                >
                  {uploadingImage ? (
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      <div className="text-xs font-['Barlow_Condensed'] uppercase tracking-widest text-muted-foreground">
                        Subiendo...
                      </div>
                    </div>
                  ) : imagePreview ? (
                    <>
                      <ImageWithFallback
                        src={imagePreview}
                        alt="Preview"
                        className="absolute inset-0 w-full h-full object-cover opacity-70"
                      />
                      <div className="relative z-10 bg-black/60 px-3 py-1 text-xs font-['Barlow_Condensed'] uppercase tracking-widest text-white">
                        CLICK PARA CAMBIAR
                      </div>
                    </>
                  ) : (
                    <>
                      <Upload size={24} className="text-muted-foreground" />
                      <div className="text-xs font-['Barlow_Condensed'] uppercase tracking-widest text-muted-foreground">
                        CLICK PARA SUBIR IMAGEN
                      </div>
                      <div className="text-[10px] text-muted-foreground/50">
                        JPEG, PNG, WebP, AVIF · Máx 5MB
                      </div>
                    </>
                  )}
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <div className="mt-2">
                  <input
                    type="url"
                    value={form.image}
                    onChange={(e) => {
                      setForm((f) => ({ ...f, image: e.target.value }))
                      setImagePreview(e.target.value)
                      setFormDirty(true)
                      if (errors.image) setErrors(({ image: _i, ...rest }) => rest)
                    }}
                    placeholder="O pegar URL de imagen"
                    className="w-full bg-secondary border border-border px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-['Barlow_Condensed'] tracking-widest uppercase text-muted-foreground mb-2">
                  Nombre del Producto *
                </label>
                <input
                  value={form.name}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, name: e.target.value }))
                    setFormDirty(true)
                    if (errors.name) setErrors(({ name: _n, ...rest }) => rest)
                  }}
                  placeholder="ej. Neon Wolf Sticker"
                  className={`w-full bg-secondary border px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none transition-colors ${
                    errors.name ? 'border-destructive' : 'border-border focus:border-primary'
                  }`}
                  autoFocus
                />
                {errors.name && (
                  <div className="text-[10px] text-destructive mt-1 font-['Barlow_Condensed'] tracking-wider flex items-center gap-1">
                    <AlertTriangle size={10} />
                    {errors.name}
                  </div>
                )}
              </div>

              {/* Price + Category */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-['Barlow_Condensed'] tracking-widest uppercase text-muted-foreground mb-2">
                    Precio ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="9999"
                    value={form.price || ''}
                    onChange={(e) => {
                      setForm((f) => ({ ...f, price: parseFloat(e.target.value) || 0 }))
                      setFormDirty(true)
                      if (errors.price) setErrors(({ price: _p, ...rest }) => rest)
                    }}
                    placeholder="4.99"
                    className={`w-full bg-secondary border px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none transition-colors ${
                      errors.price ? 'border-destructive' : 'border-border focus:border-primary'
                    }`}
                  />
                  {errors.price && (
                    <div className="text-[10px] text-destructive mt-1 font-['Barlow_Condensed'] tracking-wider flex items-center gap-1">
                      <AlertTriangle size={10} />
                      {errors.price}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-['Barlow_Condensed'] tracking-widest uppercase text-muted-foreground mb-2">
                    Categoría *
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => {
                      setForm((f) => ({ ...f, category: e.target.value }))
                      setFormDirty(true)
                      if (errors.category) setErrors(({ category: _c, ...rest }) => rest)
                    }}
                    className={`w-full bg-secondary border px-3 py-2.5 text-sm text-foreground focus:outline-none transition-colors ${
                      errors.category ? 'border-destructive' : 'border-border focus:border-primary'
                    }`}
                  >
                    <option value="">Seleccionar...</option>
                    {FIXED_CATEGORIES.map((cat) => (
                      <option key={cat.slug} value={cat.slug}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <div className="text-[10px] text-destructive mt-1 font-['Barlow_Condensed'] tracking-wider flex items-center gap-1">
                      <AlertTriangle size={10} />
                      {errors.category}
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-['Barlow_Condensed'] tracking-widest uppercase text-muted-foreground">
                    Descripción
                  </label>
                  <span
                    className={`text-[10px] font-['Barlow_Condensed'] tracking-wider ${form.description.length > 500 ? 'text-destructive' : 'text-muted-foreground'}`}
                  >
                    {form.description.length}/500
                  </span>
                </div>
                <textarea
                  value={form.description}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, description: e.target.value }))
                    setFormDirty(true)
                    if (errors.description) setErrors(({ description: _d, ...rest }) => rest)
                  }}
                  rows={3}
                  placeholder="Describe el diseño del sticker..."
                  className={`w-full bg-secondary border px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none transition-colors resize-none ${
                    errors.description ? 'border-destructive' : 'border-border focus:border-primary'
                  }`}
                />
                {errors.description && (
                  <div className="text-[10px] text-destructive mt-1 font-['Barlow_Condensed'] tracking-wider flex items-center gap-1">
                    <AlertTriangle size={10} />
                    {errors.description}
                  </div>
                )}
              </div>

              {/* Material + Finish + Size */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-['Barlow_Condensed'] tracking-widest uppercase text-muted-foreground mb-2">
                    Material
                  </label>
                  <select
                    value={form.material}
                    onChange={(e) => {
                      setForm((f) => ({ ...f, material: e.target.value }))
                      setFormDirty(true)
                    }}
                    className="w-full bg-secondary border border-border px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                  >
                    <option value="Vinilo">Vinilo</option>
                    <option value="Vinilo Premium">Vinilo Premium</option>
                    <option value="Vinilo Reflectivo">Vinilo Reflectivo</option>
                    <option value="Vinilo Transparente">Vinilo Transparente</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-['Barlow_Condensed'] tracking-widest uppercase text-muted-foreground mb-2">
                    Acabado
                  </label>
                  <select
                    value={form.finish}
                    onChange={(e) => {
                      setForm((f) => ({ ...f, finish: e.target.value }))
                      setFormDirty(true)
                    }}
                    className="w-full bg-secondary border border-border px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                  >
                    <option value="Mate">Mate</option>
                    <option value="Brillante">Brillante</option>
                    <option value="Holográfico">Holográfico</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-['Barlow_Condensed'] tracking-widest uppercase text-muted-foreground mb-2">
                    Tamaño
                  </label>
                  <select
                    value={form.size}
                    onChange={(e) => {
                      setForm((f) => ({ ...f, size: e.target.value }))
                      setFormDirty(true)
                    }}
                    className="w-full bg-secondary border border-border px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                  >
                    <option value="5 × 5 cm">5 × 5 cm</option>
                    <option value="7.5 × 5 cm">7.5 × 5 cm</option>
                    <option value="10 × 10 cm">10 × 10 cm</option>
                    <option value="15 × 10 cm">15 × 10 cm</option>
                    <option value="20 × 15 cm">20 × 15 cm</option>
                  </select>
                </div>
              </div>

              {/* Waterproof toggle */}
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.waterproof}
                    onChange={(e) => {
                      setForm((f) => ({ ...f, waterproof: e.target.checked }))
                      setFormDirty(true)
                    }}
                    className="w-4 h-4 rounded border-border bg-secondary text-primary focus:ring-primary"
                  />
                  <span className="text-xs font-['Barlow_Condensed'] tracking-widest uppercase text-muted-foreground">
                    Impermeable
                  </span>
                </label>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleSave}
                  disabled={!form.name.trim() || !form.category || form.price <= 0 || saving}
                  className="flex-1 bg-primary text-white py-3 font-['Barlow_Condensed'] font-700 uppercase tracking-widest hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      GUARDANDO...
                    </span>
                  ) : editingId ? (
                    'GUARDAR CAMBIOS'
                  ) : (
                    'AGREGAR PRODUCTO'
                  )}
                </button>
                <button
                  onClick={handleClose}
                  className="px-5 border border-border text-muted-foreground font-['Barlow_Condensed'] uppercase tracking-widest hover:border-foreground hover:text-foreground transition-colors"
                >
                  CANCELAR
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dirty form confirmation */}
      {confirmClose && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80">
          <div className="bg-card border border-border p-6 max-w-sm w-full">
            <div className="font-['Barlow_Condensed'] text-xl font-700 uppercase tracking-wide text-foreground mb-2">
              ¿Descartar Cambios?
            </div>
            <p className="text-muted-foreground text-sm mb-6">
              Tienes cambios sin guardar. ¿Estás seguro de que quieres cerrar?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setConfirmClose(false)
                  setShowForm(false)
                }}
                className="flex-1 bg-destructive text-white py-2.5 font-['Barlow_Condensed'] font-700 uppercase tracking-widest hover:opacity-90 transition-opacity"
              >
                DESCARTAR
              </button>
              <button
                onClick={() => setConfirmClose(false)}
                className="flex-1 border border-border text-foreground py-2.5 font-['Barlow_Condensed'] font-700 uppercase tracking-widest hover:bg-secondary transition-colors"
              >
                SEGUIR EDITANDO
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <div className="bg-card border border-border p-6 max-w-sm w-full">
            <div className="font-['Barlow_Condensed'] text-xl font-700 uppercase tracking-wide text-foreground mb-2">
              ¿Eliminar Producto?
            </div>
            <p className="text-muted-foreground text-sm mb-6">Esta acción no se puede deshacer.</p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(deleteId)}
                disabled={deleting}
                className="flex-1 bg-destructive text-white py-2.5 font-['Barlow_Condensed'] font-700 uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {deleting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ELIMINANDO...
                  </span>
                ) : (
                  'ELIMINAR'
                )}
              </button>
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 border border-border text-foreground py-2.5 font-['Barlow_Condensed'] font-700 uppercase tracking-widest hover:bg-secondary transition-colors"
              >
                CANCELAR
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
