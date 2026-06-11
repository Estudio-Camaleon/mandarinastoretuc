import { useState } from "react";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { Categories } from "./components/Categories";
import { Products } from "./components/Products";
import type { Product } from "./components/Products";
import { Testimonials } from "./components/Testimonials";
import { CTA } from "./components/CTA";
import { Footer } from "./components/Footer";
import { CartDrawer } from "./components/CartDrawer";
import { AdminLogin } from "./components/admin/AdminLogin";
import { AdminPanel } from "./components/admin/AdminPanel";

interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
  count: number;
}

interface CartItem extends Product {
  qty: number;
}

const INITIAL_CATEGORIES: Category[] = [
  { id: "1", name: "Street Art", slug: "street-art", color: "#FF5500", count: 3 },
  { id: "2", name: "Anime", slug: "anime", color: "#a855f7", count: 2 },
  { id: "3", name: "Nature", slug: "nature", color: "#22c55e", count: 2 },
  { id: "4", name: "Animals", slug: "animals", color: "#3b82f6", count: 2 },
  { id: "5", name: "Abstract", slug: "abstract", color: "#eab308", count: 2 },
  { id: "6", name: "Retro", slug: "retro", color: "#ec4899", count: 2 },
];

const INITIAL_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Neon Wolf",
    price: 4.99,
    category: "animals",
    description: "A bold neon wolf design with electric blue highlights. Perfect for helmets, laptops, and water bottles. Weatherproof and UV-resistant.",
    image: "https://images.unsplash.com/photo-1770375142184-4655d2bd2d4e?w=400&h=400&fit=crop&auto=format",
    rating: 5,
    reviews: 47,
  },
  {
    id: "2",
    name: "Street Tag Vol.2",
    price: 3.99,
    category: "street-art",
    description: "Raw street tag aesthetic in classic black and white. Inspired by NYC subway art. Die-cut vinyl, ultra-durable.",
    image: "https://images.unsplash.com/photo-1600440699677-c6f39725adf6?w=400&h=400&fit=crop&auto=format",
    rating: 5,
    reviews: 83,
  },
  {
    id: "3",
    name: "Anime Eyes",
    price: 4.99,
    category: "anime",
    description: "Hypnotic anime-inspired eyes sticker. Holographic finish, glossy surface. Sticks on anything and lasts.",
    image: "https://images.unsplash.com/photo-1758295099602-18bcd8c024b7?w=400&h=400&fit=crop&auto=format",
    rating: 5,
    reviews: 62,
  },
  {
    id: "4",
    name: "Wild Cactus",
    price: 3.49,
    category: "nature",
    description: "Desert vibes. A clean minimal cactus illustration with matte finish. Great for journals and notebooks.",
    image: "https://images.unsplash.com/photo-1775496230770-d379e89b9e7e?w=400&h=400&fit=crop&auto=format",
    rating: 4,
    reviews: 28,
  },
  {
    id: "5",
    name: "Graffiti Skull",
    price: 5.49,
    category: "street-art",
    description: "Classic graffiti-style skull with drip effect. High contrast black and orange. Holographic outline.",
    image: "https://images.unsplash.com/photo-1763888647755-5754915925ff?w=400&h=400&fit=crop&auto=format",
    rating: 5,
    reviews: 101,
  },
  {
    id: "6",
    name: "Bear Club",
    price: 3.99,
    category: "animals",
    description: "A street-style teddy bear with attitude. Matte finish, die-cut, waterproof. Part of the Bear Club series.",
    image: "https://images.unsplash.com/photo-1774918700856-d0a09c2af44e?w=400&h=400&fit=crop&auto=format",
    rating: 5,
    reviews: 55,
  },
  {
    id: "7",
    name: "Retro Vibes",
    price: 4.49,
    category: "retro",
    description: "80s-inspired retro design with sunset gradient and palm trees. Glossy finish with rounded corners.",
    image: "https://images.unsplash.com/photo-1764567386744-090d5ff67d66?w=400&h=400&fit=crop&auto=format",
    rating: 4,
    reviews: 34,
  },
  {
    id: "8",
    name: "Cosmic Drip",
    price: 5.99,
    category: "abstract",
    description: "Cosmic abstract drip design with galaxy colors. Holographic foil finish. Statement piece for any surface.",
    image: "https://images.unsplash.com/photo-1775665422545-42848b8536b9?w=400&h=400&fit=crop&auto=format",
    rating: 5,
    reviews: 72,
  },
];

type AppView = "public" | "admin-login" | "admin";

export default function App() {
  const [view, setView] = useState<AppView>("public");
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [activeCategory, setActiveCategory] = useState("all");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) => (i.id === product.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const updateCartQty = (id: string, qty: number) => {
    setCart((prev) => prev.map((i) => (i.id === id ? { ...i, qty } : i)));
  };

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  if (view === "admin-login") {
    return (
      <AdminLogin
        onLogin={() => setView("admin")}
        onBack={() => setView("public")}
      />
    );
  }

  if (view === "admin") {
    return (
      <AdminPanel
        products={products}
        categories={categories}
        onProductsChange={setProducts}
        onCategoriesChange={setCategories}
        onLogout={() => setView("public")}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar
        cartCount={cartCount}
        onAdminClick={() => setView("admin-login")}
        onCartClick={() => setCartOpen(true)}
      />

      <Hero />

      <Categories
        categories={categories}
        activeCategory={activeCategory}
        onCategorySelect={setActiveCategory}
      />

      <Products
        products={products}
        activeCategory={activeCategory}
        onAddToCart={addToCart}
      />

      <Testimonials />

      <CTA />

      <Footer />

      {cartOpen && (
        <CartDrawer
          items={cart}
          onClose={() => setCartOpen(false)}
          onRemove={removeFromCart}
          onUpdateQty={updateCartQty}
        />
      )}
    </div>
  );
}
