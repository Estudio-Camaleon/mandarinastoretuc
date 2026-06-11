import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, X, AlertTriangle, ImageIcon } from 'lucide-react'
import { toast } from 'sonner'
import type { Product } from '../Products'
import type { Category } from '../../../lib/database.types'
import { createCategory, updateCategory, deleteCategory, uploadImage } from '../../../lib/api'

interface CategoryManagerProps {
  categories: Category[]
  products: Product[]
  onRefresh: () => void
}

const toSlug = (name: string) =>
  name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')

const COLORS = ['#FF5500', '#3b82f6', '#22c55e', '#a855f7', '#eab308', '#ec4899', '#14b8a6']

export function CategoryManager({ categories, products, onRefresh }: CategoryManagerProps) {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [color, setColor] = useState(COLORS[0])
  const [image, setImage] = useState<string>('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [formDirty, setFormDirty] = useState(false)
  const [confirmClose, setConfirmClose] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const openAdd = () => {
    setName('')
    setColor(COLORS[0])
    setImage('')
    setImageFile(null)
    setEditingId(null)
    setFormDirty(false)
    setErrors({})
    setShowForm(true)
  }

  const openEdit = (cat: Category) => {
    setName(cat.name)
    setColor(cat.color)
    setImage(cat.image ?? '')
    setImageFile(null)
    setEditingId(cat.id)
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

  const validate = (slug: string): boolean => {
    const errs: Record<string, string> = {}
    if (!name.trim()) errs.name = 'El nombre de la categoría es requerido'
    if (name.length > 50) errs.name = 'El nombre es demasiado largo (máx 50 caracteres)'

    const duplicate = categories.find((c) => c.slug === slug && c.id !== editingId)
    if (duplicate) errs.name = `Ya existe una categoría con el slug "${slug}"`

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setFormDirty(true)
    // Show local preview
    const reader = new FileReader()
    reader.onload = (ev) => setImage(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  const handleSave = async () => {
    if (!name.trim()) return
    const slug = toSlug(name)
    if (!validate(slug)) return

    setSaving(true)
    try {
      let imageUrl = image
      if (imageFile) {
        setUploadingImage(true)
        imageUrl = await uploadImage(imageFile)
        setUploadingImage(false)
      }

      const payload: Record<string, unknown> = { name: name.trim(), slug, color, image: imageUrl }
      if (!editingId) {
        payload.count = products.filter((p) => p.category === slug).length
      }

      if (editingId) {
        await updateCategory(editingId, payload)
        toast.success('Categoría actualizada')
      } else {
        await createCategory(payload as Parameters<typeof createCategory>[0])
        toast.success('Categoría creada')
      }
      setShowForm(false)
      onRefresh()
    } catch (err) {
      toast.error('Error al guardar la categoría')
      console.error(err)
    } finally {
      setSaving(false)
      setUploadingImage(false)
    }
  }

  const handleDelete = async (id: string) => {
    setDeleting(true)
    try {
      await deleteCategory(id)
      toast.success('Categoría eliminada')
      setDeleteId(null)
      onRefresh()
    } catch (err) {
      toast.error('Error al eliminar la categoría')
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
            Categorías
          </h2>
          <div className="text-muted-foreground text-sm mt-0.5">
            {categories.length} colecciones
          </div>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 font-['Barlow_Condensed'] text-sm font-700 uppercase tracking-widest hover:bg-primary/90 transition-colors"
        >
          <Plus size={16} />
          NUEVA CATEGORÍA
        </button>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => {
          const productCount = products.filter((p) => p.category === cat.slug).length
          return (
            <div
              key={cat.id}
              className="bg-card border border-border p-5 flex items-center justify-between group hover:border-primary/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-10 h-10 flex-shrink-0 flex items-center justify-center font-['Barlow_Condensed'] text-white font-900 text-lg rounded"
                  style={{ backgroundColor: cat.color }}
                >
                  {cat.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-['Barlow_Condensed'] font-700 uppercase tracking-wide text-foreground">
                    {cat.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {productCount} producto{productCount !== 1 ? 's' : ''} · /{cat.slug}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => openEdit(cat)}
                  className="p-1.5 text-muted-foreground hover:text-foreground border border-transparent hover:border-border transition-all"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => setDeleteId(cat.id)}
                  className="p-1.5 text-muted-foreground hover:text-destructive border border-transparent hover:border-destructive/30 transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          )
        })}

        {categories.length === 0 && (
          <div className="col-span-3 text-center py-20 text-muted-foreground font-['Barlow_Condensed'] uppercase tracking-widest text-sm">
            Aún no hay categorías — crea tu primera colección.
          </div>
        )}
      </div>

      {/* Form modal */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose()
          }}
        >
          <div className="bg-card border border-border w-full max-w-sm">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div className="font-['Barlow_Condensed'] text-xl font-700 uppercase tracking-wide text-foreground">
                {editingId ? 'EDITAR CATEGORÍA' : 'NUEVA CATEGORÍA'}
              </div>
              <button onClick={handleClose} className="text-muted-foreground hover:text-foreground">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-['Barlow_Condensed'] tracking-widest uppercase text-muted-foreground mb-2">
                  Nombre de la Categoría *
                </label>
                <input
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    setFormDirty(true)
                    if (errors.name) setErrors(({ name: _n, ...rest }) => rest)
                  }}
                  placeholder="ej. Street Art"
                  className={`w-full bg-secondary border px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none transition-colors ${
                    errors.name ? 'border-destructive' : 'border-border focus:border-primary'
                  }`}
                  onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                  autoFocus
                />
                {name && !errors.name && (
                  <div className="text-[10px] text-muted-foreground mt-1 font-['Barlow_Condensed'] tracking-wider">
                    Slug: /{toSlug(name)}
                  </div>
                )}
                {errors.name && (
                  <div className="text-[10px] text-destructive mt-1 font-['Barlow_Condensed'] tracking-wider flex items-center gap-1">
                    <AlertTriangle size={10} />
                    {errors.name}
                  </div>
                )}
              </div>

              {/* Image */}
              <div>
                <label className="block text-xs font-['Barlow_Condensed'] tracking-widest uppercase text-muted-foreground mb-2">
                  Imagen de Portada
                </label>
                <label className={`flex items-center gap-2 cursor-pointer bg-secondary border border-border px-4 py-3 hover:border-primary/50 transition-colors ${uploadingImage ? 'opacity-50 pointer-events-none' : ''}`}>
                  <ImageIcon size={16} className="text-muted-foreground" />
                  <span className="text-sm text-muted-foreground flex-1">
                    {uploadingImage ? 'Subiendo...' : imageFile ? imageFile.name : image ? 'Cambiar imagen' : 'Seleccionar imagen'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                    disabled={uploadingImage}
                  />
                </label>
                {image && (
                  <div className="mt-2 w-16 h-16 overflow-hidden rounded border border-border">
                    <img src={image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Color picker */}
              <div>
                <label className="block text-xs font-['Barlow_Condensed'] tracking-widest uppercase text-muted-foreground mb-2">
                  Color de Acento
                </label>
                <div className="flex gap-2 flex-wrap">
                  {COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => {
                        setColor(c)
                        setFormDirty(true)
                      }}
                      className="w-8 h-8 transition-transform hover:scale-110 relative rounded"
                      style={{ backgroundColor: c }}
                    >
                      {color === c && (
                        <div className="absolute inset-0 border-2 border-white ring-1 ring-offset-1 ring-offset-card ring-white rounded" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleSave}
                  disabled={!name.trim() || saving}
                  className="flex-1 bg-primary text-white py-3 font-['Barlow_Condensed'] font-700 uppercase tracking-widest hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      GUARDANDO...
                    </span>
                  ) : editingId ? (
                    'GUARDAR'
                  ) : (
                    'CREAR'
                  )}
                </button>
                <button
                  onClick={handleClose}
                  className="px-5 border border-border text-muted-foreground font-['Barlow_Condensed'] uppercase tracking-widest hover:border-foreground hover:text-foreground transition-colors"
                >
                  CANCELARAR
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
              ¿Eliminar Categoría?
            </div>
            <p className="text-muted-foreground text-sm mb-6">
              Los productos en esta categoría no se eliminarán, pero perderán su asignación de categoría.
            </p>
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
