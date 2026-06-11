import { Package, MapPin, Calendar, Search } from "lucide-react";
import { useState } from "react";

const MOCK_ORDERS = [
  {
    id: "#1042",
    customer: "Kai Martinez",
    email: "kai@example.com",
    address: "3rd & Broadway, NYC",
    product: "Neon Wolf Sticker",
    qty: 2,
    status: "Shipped" as const,
    amount: 9.98,
    date: "Jun 9, 2026",
    tracking: "1Z999AA10123456784",
  },
  {
    id: "#1041",
    customer: "Sofia R.",
    email: "sofia@example.com",
    address: "Mission District, SF",
    product: "Abstract Pack x5",
    qty: 1,
    status: "Processing" as const,
    amount: 14.95,
    date: "Jun 9, 2026",
    tracking: null,
  },
  {
    id: "#1040",
    customer: "Jordan L.",
    email: "jordy@example.com",
    address: "Shoreditch, London",
    product: "Street Tag Vol.2",
    qty: 3,
    status: "Delivered" as const,
    amount: 11.97,
    date: "Jun 8, 2026",
    tracking: "1Z999AA10123456001",
  },
  {
    id: "#1039",
    customer: "Mia Torres",
    email: "mia@example.com",
    address: "Williamsburg, NYC",
    product: "Anime Eyes",
    qty: 1,
    status: "Delivered" as const,
    amount: 4.99,
    date: "Jun 7, 2026",
    tracking: "1Z999AA10123456002",
  },
  {
    id: "#1038",
    customer: "Alex K.",
    email: "alexk@example.com",
    address: "Kreuzberg, Berlin",
    product: "Bear Club Sticker",
    qty: 2,
    status: "Delivered" as const,
    amount: 7.98,
    date: "Jun 6, 2026",
    tracking: "1Z999AA10123456003",
  },
  {
    id: "#1037",
    customer: "James W.",
    email: "jwicks@example.com",
    address: "Haight-Ashbury, SF",
    product: "Retro Vibes Pack",
    qty: 1,
    status: "Processing" as const,
    amount: 12.99,
    date: "Jun 5, 2026",
    tracking: null,
  },
];

type Status = "Shipped" | "Processing" | "Delivered";

const STATUS_CONFIG: Record<Status, { label: string; classes: string }> = {
  Shipped: { label: "Shipped", classes: "text-primary bg-primary/10" },
  Processing: { label: "Processing", classes: "text-yellow-400 bg-yellow-400/10" },
  Delivered: { label: "Delivered", classes: "text-green-400 bg-green-400/10" },
};

export function OrderViewer() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Status>("all");

  const filtered = MOCK_ORDERS.filter((o) => {
    const matchSearch =
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.product.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const total = MOCK_ORDERS.reduce((s, o) => s + o.amount, 0);

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="font-['Barlow_Condensed'] text-3xl font-900 uppercase tracking-tight text-foreground">
          Orders
        </h2>
        <div className="text-muted-foreground text-sm mt-0.5">
          {MOCK_ORDERS.length} orders · ${total.toFixed(2)} total revenue (demo data)
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "PROCESSING", count: MOCK_ORDERS.filter((o) => o.status === "Processing").length, color: "text-yellow-400" },
          { label: "SHIPPED", count: MOCK_ORDERS.filter((o) => o.status === "Shipped").length, color: "text-primary" },
          { label: "DELIVERED", count: MOCK_ORDERS.filter((o) => o.status === "Delivered").length, color: "text-green-400" },
        ].map(({ label, count, color }) => (
          <div key={label} className="bg-card border border-border p-4 text-center">
            <div className={`font-['Barlow_Condensed'] text-3xl font-900 ${color}`}>{count}</div>
            <div className="text-[10px] font-['Barlow_Condensed'] uppercase tracking-widest text-muted-foreground mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search orders..."
            className="bg-card border border-border pl-8 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "Processing", "Shipped", "Delivered"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 text-xs font-['Barlow_Condensed'] uppercase tracking-widest transition-all border ${
                statusFilter === s
                  ? "bg-primary text-white border-primary"
                  : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
              }`}
            >
              {s === "all" ? "ALL" : s}
            </button>
          ))}
        </div>
      </div>

      {/* Orders list */}
      <div className="space-y-3">
        {filtered.map((order) => (
          <div key={order.id} className="bg-card border border-border p-5 hover:border-primary/30 transition-colors">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-secondary flex items-center justify-center flex-shrink-0">
                  <Package size={18} className="text-muted-foreground" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-['Barlow_Condensed'] font-700 text-primary">{order.id}</span>
                    <span
                      className={`text-[10px] font-['Barlow_Condensed'] font-700 uppercase tracking-wider px-2 py-0.5 ${STATUS_CONFIG[order.status].classes}`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <div className="font-['Barlow_Condensed'] font-700 uppercase text-foreground">{order.customer}</div>
                  <div className="text-xs text-muted-foreground">{order.email}</div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                    <Package size={11} />
                    {order.product} × {order.qty}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="font-['Barlow_Condensed'] text-2xl font-900 text-foreground">
                  ${order.amount.toFixed(2)}
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground justify-end mt-1">
                  <Calendar size={11} />
                  {order.date}
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground justify-end mt-0.5">
                  <MapPin size={11} />
                  {order.address}
                </div>
                {order.tracking && (
                  <div className="text-[10px] text-primary font-['Barlow_Condensed'] mt-1 font-700 tracking-wider">
                    {order.tracking}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground font-['Barlow_Condensed'] uppercase tracking-widest text-sm">
            No orders match your search.
          </div>
        )}
      </div>
    </div>
  );
}
