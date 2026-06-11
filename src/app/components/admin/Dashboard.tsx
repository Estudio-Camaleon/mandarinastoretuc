import { Package, Tag, ShoppingBag, TrendingUp, ArrowRight } from "lucide-react";
import type { Product } from "../Products";

interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
  count: number;
}

type AdminView = "dashboard" | "products" | "categories" | "orders";

interface DashboardProps {
  products: Product[];
  categories: Category[];
  onNavigate: (view: AdminView) => void;
}

const MOCK_ORDERS = [
  { id: "#1042", customer: "Kai Martinez", product: "Neon Wolf Sticker", status: "Shipped", amount: 4.99, date: "Jun 9" },
  { id: "#1041", customer: "Sofia R.", product: "Abstract Pack x5", status: "Processing", amount: 14.95, date: "Jun 9" },
  { id: "#1040", customer: "Jordan L.", product: "Street Tag Vol.2", status: "Delivered", amount: 3.99, date: "Jun 8" },
  { id: "#1039", customer: "Mia Torres", product: "Anime Eyes", status: "Delivered", amount: 4.99, date: "Jun 7" },
  { id: "#1038", customer: "Alex K.", product: "Bear Club Sticker", status: "Delivered", amount: 3.99, date: "Jun 6" },
];

const STATUS_COLORS: Record<string, string> = {
  Shipped: "text-primary bg-primary/10",
  Processing: "text-yellow-400 bg-yellow-400/10",
  Delivered: "text-green-400 bg-green-400/10",
};

export function Dashboard({ products, categories, onNavigate }: DashboardProps) {
  const revenue = MOCK_ORDERS.reduce((sum, o) => sum + o.amount, 0);

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Products", value: products.length, Icon: Package, color: "text-primary", action: () => onNavigate("products") },
          { label: "Categories", value: categories.length, Icon: Tag, color: "text-blue-400", action: () => onNavigate("categories") },
          { label: "Recent Orders", value: MOCK_ORDERS.length, Icon: ShoppingBag, color: "text-green-400", action: () => onNavigate("orders") },
          { label: "Revenue (demo)", value: `$${revenue.toFixed(2)}`, Icon: TrendingUp, color: "text-yellow-400", action: () => {} },
        ].map(({ label, value, Icon, color, action }) => (
          <button
            key={label}
            onClick={action}
            className="bg-card border border-border p-5 text-left hover:border-primary/50 transition-colors group"
          >
            <div className={`${color} mb-3`}>
              <Icon size={20} />
            </div>
            <div className="font-['Barlow_Condensed'] text-3xl font-900 text-foreground">{value}</div>
            <div className="text-xs font-['Barlow_Condensed'] tracking-widest text-muted-foreground uppercase mt-1">{label}</div>
            <div className="text-primary opacity-0 group-hover:opacity-100 transition-opacity text-xs font-['Barlow_Condensed'] uppercase tracking-widest mt-2">
              MANAGE →
            </div>
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent orders */}
        <div className="lg:col-span-2 bg-card border border-border">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <div className="font-['Barlow_Condensed'] font-700 uppercase tracking-wide text-foreground">
              Recent Orders
            </div>
            <button
              onClick={() => onNavigate("orders")}
              className="text-xs text-primary font-['Barlow_Condensed'] uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all"
            >
              VIEW ALL <ArrowRight size={12} />
            </button>
          </div>
          <div className="divide-y divide-border">
            {MOCK_ORDERS.map((order) => (
              <div key={order.id} className="px-5 py-3 flex items-center justify-between gap-3 hover:bg-secondary/30 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="font-['Barlow_Condensed'] text-primary text-sm font-700 w-14 flex-shrink-0">{order.id}</div>
                  <div className="min-w-0">
                    <div className="text-sm text-foreground font-['Barlow_Condensed'] font-600 truncate">{order.customer}</div>
                    <div className="text-xs text-muted-foreground truncate">{order.product}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={`text-[10px] font-['Barlow_Condensed'] font-700 uppercase tracking-wider px-2 py-0.5 ${STATUS_COLORS[order.status] ?? ""}`}>
                    {order.status}
                  </span>
                  <div className="text-right">
                    <div className="font-['Barlow_Condensed'] font-900 text-foreground">${order.amount.toFixed(2)}</div>
                    <div className="text-[10px] text-muted-foreground">{order.date}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category breakdown */}
        <div className="bg-card border border-border">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <div className="font-['Barlow_Condensed'] font-700 uppercase tracking-wide text-foreground">
              By Category
            </div>
            <button
              onClick={() => onNavigate("categories")}
              className="text-xs text-primary font-['Barlow_Condensed'] uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all"
            >
              EDIT <ArrowRight size={12} />
            </button>
          </div>
          <div className="p-5 space-y-3">
            {categories.map((cat) => {
              const count = products.filter((p) => p.category === cat.slug).length;
              const pct = products.length ? Math.round((count / products.length) * 100) : 0;
              return (
                <div key={cat.id}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-['Barlow_Condensed'] uppercase tracking-wider text-foreground">{cat.name}</span>
                    <span className="text-muted-foreground">{count} products</span>
                  </div>
                  <div className="w-full bg-secondary h-1.5">
                    <div className="h-full bg-primary transition-all duration-500" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
            {categories.length === 0 && (
              <div className="text-muted-foreground text-sm font-['Barlow_Condensed'] uppercase tracking-widest">
                No categories yet
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div>
        <div className="font-['Barlow_Condensed'] text-sm font-700 uppercase tracking-widest text-muted-foreground mb-4">
          Quick Actions
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Add Product", action: () => onNavigate("products"), desc: "Upload a new vinyl design" },
            { label: "New Category", action: () => onNavigate("categories"), desc: "Create a collection" },
            { label: "View Orders", action: () => onNavigate("orders"), desc: "Check purchase requests" },
            { label: "All Products", action: () => onNavigate("products"), desc: "Manage your catalog" },
          ].map(({ label, action, desc }) => (
            <button
              key={label}
              onClick={action}
              className="bg-card border border-border p-4 text-left hover:border-primary hover:bg-primary/5 transition-all group"
            >
              <div className="font-['Barlow_Condensed'] font-700 uppercase tracking-wide text-foreground group-hover:text-primary transition-colors text-sm">
                {label}
              </div>
              <div className="text-xs text-muted-foreground mt-1">{desc}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
