import { useState, useRef } from "react";
import { Plus, Pencil, Trash2, X, Upload, Search } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import type { Product } from "../Products";

interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
  count: number;
}

interface ProductManagerProps {
  products: Product[];
  categories: Category[];
  onChange: (products: Product[]) => void;
}

const EMPTY_FORM: Omit<Product, "id"> = {
  name: "",
  price: 0,
  category: "",
  description: "",
  image: "",
  rating: 5,
  reviews: 0,
};

export function ProductManager({ products, categories, onChange }: ProductManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Product, "id">>(EMPTY_FORM);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setImagePreview("");
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (product: Product) => {
    setForm({
      name: product.name,
      price: product.price,
      category: product.category,
      description: product.description,
      image: product.image,
      rating: product.rating,
      reviews: product.reviews,
    });
    setImagePreview(product.image);
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImagePreview(url);
    setForm((f) => ({ ...f, image: url }));
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.category || form.price <= 0) return;
    const image = form.image || `https://images.unsplash.com/photo-1770375142184-4655d2bd2d4e?w=400&h=400&fit=crop&auto=format`;
    if (editingId) {
      onChange(products.map((p) => (p.id === editingId ? { ...form, image, id: editingId } : p)));
    } else {
      onChange([...products, { ...form, image, id: Date.now().toString() }]);
    }
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    onChange(products.filter((p) => p.id !== id));
    setDeleteId(null);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-['Barlow_Condensed'] text-3xl font-900 uppercase tracking-tight text-foreground">
            Products
          </h2>
          <div className="text-muted-foreground text-sm mt-0.5">{products.length} vinyl designs</div>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 font-['Barlow_Condensed'] text-sm font-700 uppercase tracking-widest hover:bg-primary/90 transition-colors"
        >
          <Plus size={16} />
          ADD PRODUCT
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full bg-card border border-border pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors max-w-sm"
        />
      </div>

      {/* Table */}
      <div className="bg-card border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {["Product", "Category", "Price", "Actions"].map((col) => (
                  <th
                    key={col}
                    className="px-5 py-3 text-left text-[10px] font-['Barlow_Condensed'] uppercase tracking-widest text-muted-foreground"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((product) => (
                <tr key={product.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-secondary flex-shrink-0 overflow-hidden">
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
                        aria-label="Edit"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteId(product.id)}
                        className="p-1.5 text-muted-foreground hover:text-destructive border border-transparent hover:border-destructive/30 transition-all"
                        aria-label="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-muted-foreground font-['Barlow_Condensed'] uppercase tracking-widest text-sm">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-card border border-border w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-card z-10">
              <div className="font-['Barlow_Condensed'] text-xl font-700 uppercase tracking-wide text-foreground">
                {editingId ? "EDIT PRODUCT" : "ADD PRODUCT"}
              </div>
              <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Image upload */}
              <div>
                <label className="block text-xs font-['Barlow_Condensed'] tracking-widest uppercase text-muted-foreground mb-2">
                  Product Image
                </label>
                <div
                  className="border-2 border-dashed border-border hover:border-primary transition-colors cursor-pointer aspect-video bg-secondary flex flex-col items-center justify-center gap-3 relative overflow-hidden"
                  onClick={() => fileRef.current?.click()}
                >
                  {imagePreview ? (
                    <>
                      <ImageWithFallback
                        src={imagePreview}
                        alt="Preview"
                        className="absolute inset-0 w-full h-full object-cover opacity-70"
                      />
                      <div className="relative z-10 bg-black/60 px-3 py-1 text-xs font-['Barlow_Condensed'] uppercase tracking-widest text-white">
                        CLICK TO CHANGE
                      </div>
                    </>
                  ) : (
                    <>
                      <Upload size={24} className="text-muted-foreground" />
                      <div className="text-xs font-['Barlow_Condensed'] uppercase tracking-widest text-muted-foreground">
                        CLICK TO UPLOAD IMAGE
                      </div>
                    </>
                  )}
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <div className="mt-2">
                  <input
                    type="url"
                    value={form.image}
                    onChange={(e) => {
                      setForm((f) => ({ ...f, image: e.target.value }));
                      setImagePreview(e.target.value);
                    }}
                    placeholder="Or paste image URL"
                    className="w-full bg-secondary border border-border px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-['Barlow_Condensed'] tracking-widest uppercase text-muted-foreground mb-2">
                  Product Name *
                </label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Neon Wolf Sticker"
                  className="w-full bg-secondary border border-border px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              {/* Price + Category */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-['Barlow_Condensed'] tracking-widest uppercase text-muted-foreground mb-2">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.price || ""}
                    onChange={(e) => setForm((f) => ({ ...f, price: parseFloat(e.target.value) || 0 }))}
                    placeholder="4.99"
                    className="w-full bg-secondary border border-border px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-['Barlow_Condensed'] tracking-widest uppercase text-muted-foreground mb-2">
                    Category *
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    className="w-full bg-secondary border border-border px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                  >
                    <option value="">Select...</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.slug}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-['Barlow_Condensed'] tracking-widest uppercase text-muted-foreground mb-2">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  rows={3}
                  placeholder="Describe the sticker design..."
                  className="w-full bg-secondary border border-border px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleSave}
                  disabled={!form.name.trim() || !form.category || form.price <= 0}
                  className="flex-1 bg-primary text-white py-3 font-['Barlow_Condensed'] font-700 uppercase tracking-widest hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {editingId ? "SAVE CHANGES" : "ADD PRODUCT"}
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="px-5 border border-border text-muted-foreground font-['Barlow_Condensed'] uppercase tracking-widest hover:border-foreground hover:text-foreground transition-colors"
                >
                  CANCEL
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <div className="bg-card border border-border p-6 max-w-sm w-full">
            <div className="font-['Barlow_Condensed'] text-xl font-700 uppercase tracking-wide text-foreground mb-2">
              Delete Product?
            </div>
            <p className="text-muted-foreground text-sm mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 bg-destructive text-white py-2.5 font-['Barlow_Condensed'] font-700 uppercase tracking-widest hover:opacity-90 transition-opacity"
              >
                DELETE
              </button>
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 border border-border text-foreground py-2.5 font-['Barlow_Condensed'] font-700 uppercase tracking-widest hover:bg-secondary transition-colors"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
