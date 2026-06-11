export interface Category {
  id: string
  name: string
  slug: string
  color: string
  icon: string
  image: string
  count: number
  created_at: string | null
}

export interface Product {
  id: string
  name: string
  price: number
  category: string
  description: string
  image: string
  material: string
  finish: string
  size: string
  waterproof: boolean
  rating: number
  reviews: number
  created_at: string | null
}

export interface Order {
  id: string
  order_number: string
  customer_name: string
  customer_phone: string
  product_name: string
  quantity: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  amount: number
  notes: string
  created_at: string | null
}

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: Category
        Insert: Omit<Category, 'id' | 'created_at'>
        Update: Partial<Omit<Category, 'id'>>
      }
      products: {
        Row: Product
        Insert: Omit<Product, 'id' | 'created_at'>
        Update: Partial<Omit<Product, 'id'>>
      }
      orders: {
        Row: Order
        Insert: Omit<Order, 'id' | 'created_at'>
        Update: Partial<Omit<Order, 'id'>>
      }
    }
  }
}
