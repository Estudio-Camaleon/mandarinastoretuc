import { useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import type { Product } from "../Products";

interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
  count: number;
}

interface CategoryManagerProps {
  categories: Category[];
  products: Product[];
  onChange: (categories: Category[]) => void;
}

const toSlug = (name: string) =>
  name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

const COLORS = ["#FF5500", "#3b82f6", "#22c55e", "#a855f7", "#eab308", "#ec4899", "#14b8a6"];

export function CategoryManager({ categories, products, onChange }: CategoryManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [color, setColor] = useState(COLORS[0]);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const openAdd = () => {
    setName("");
    setColor(COLORS[0]);
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (cat: Category) => {
    setName(cat.name);
    setColor(cat.color);
    setEditingId(cat.id);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!name.trim()) return;
    const slug = toSlug(name);
    if (editingId) {
      onChange(categories.map((c) => (c.id === editingId ? { ...c, name: name.trim(), slug, color } : c)));
    } else {
      const count = products.filter((p) => p.category === slug).length;
      onChange([...categories, { id: Date.now().toString(), name: name.trim(), slug, color, count }]);
    }
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    onChange(categories.filter((c) => c.id !== id));
    setDeleteId(null);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-['Barlow_Condensed'] text-3xl font-900 uppercase tracking-tight text-foreground">
            Categories
          </h2>
          <div className="text-muted-foreground text-sm mt-0.5">{categories.length} collections</div>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 font-['Barlow_Condensed'] text-sm font-700 uppercase tracking-widest hover:bg-primary/90 transition-colors"
        >
          <Plus size={16} />
          NEW CATEGORY
        </button>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => {
          const productCount = products.filter((p) => p.category === cat.slug).length;
          return (
            <div
              key={cat.id}
              className="bg-card border border-border p-5 flex items-center justify-between group hover:border-primary/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-10 h-10 flex-shrink-0 flex items-center justify-center font-['Barlow_Condensed'] text-white font-900 text-lg"
                  style={{ backgroundColor: cat.color }}
                >
                  {cat.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-['Barlow_Condensed'] font-700 uppercase tracking-wide text-foreground">
                    {cat.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {productCount} product{productCount !== 1 ? "s" : ""} · /{cat.slug}
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
          );
        })}

        {categories.length === 0 && (
          <div className="col-span-3 text-center py-20 text-muted-foreground font-['Barlow_Condensed'] uppercase tracking-widest text-sm">
            No categories yet — create your first collection.
          </div>
        )}
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-card border border-border w-full max-w-sm">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div className="font-['Barlow_Condensed'] text-xl font-700 uppercase tracking-wide text-foreground">
                {editingId ? "EDIT CATEGORY" : "NEW CATEGORY"}
              </div>
              <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-['Barlow_Condensed'] tracking-widest uppercase text-muted-foreground mb-2">
                  Category Name *
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Street Art"
                  className="w-full bg-secondary border border-border px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
                  onKeyDown={(e) => e.key === "Enter" && handleSave()}
                  autoFocus
                />
                {name && (
                  <div className="text-[10px] text-muted-foreground mt-1 font-['Barlow_Condensed'] tracking-wider">
                    Slug: /{toSlug(name)}
                  </div>
                )}
              </div>

              {/* Color picker */}
              <div>
                <label className="block text-xs font-['Barlow_Condensed'] tracking-widest uppercase text-muted-foreground mb-2">
                  Accent Color
                </label>
                <div className="flex gap-2 flex-wrap">
                  {COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className="w-8 h-8 transition-transform hover:scale-110 relative"
                      style={{ backgroundColor: c }}
                    >
                      {color === c && (
                        <div className="absolute inset-0 border-2 border-white ring-1 ring-offset-1 ring-offset-card ring-white" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleSave}
                  disabled={!name.trim()}
                  className="flex-1 bg-primary text-white py-3 font-['Barlow_Condensed'] font-700 uppercase tracking-widest hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {editingId ? "SAVE" : "CREATE"}
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
              Delete Category?
            </div>
            <p className="text-muted-foreground text-sm mb-6">
              Products in this category won't be deleted, but they'll lose their category assignment.
            </p>
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
