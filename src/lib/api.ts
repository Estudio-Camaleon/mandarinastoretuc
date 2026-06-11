import { supabase } from './supabase'
import type { Product, Category, Order } from './database.types'

// ── Products ──────────────────────────────────────────

export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

export async function createProduct(product: Omit<Product, 'id' | 'created_at'>): Promise<Product> {
  const { data, error } = await supabase.from('products').insert(product).select().single()

  if (error) throw error
  return data
}

export async function updateProduct(
  id: string,
  product: Partial<Omit<Product, 'id'>>,
): Promise<Product> {
  const { data, error } = await supabase
    .from('products')
    .update(product)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) throw error
}

// ── Categories ────────────────────────────────────────

export async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true })

  if (error) throw error
  return data ?? []
}

export async function createCategory(
  category: Omit<Category, 'id' | 'created_at'>,
): Promise<Category> {
  const { data, error } = await supabase.from('categories').insert(category).select().single()

  if (error) throw error
  return data
}

export async function updateCategory(
  id: string,
  category: Partial<Omit<Category, 'id'>>,
): Promise<Category> {
  const { data, error } = await supabase
    .from('categories')
    .update(category)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteCategory(id: string): Promise<void> {
  const { error } = await supabase.from('categories').delete().eq('id', id)
  if (error) throw error
}

// ── Image upload ───────────────────────────────────────

const STORAGE_BUCKET = 'product-images'

export async function uploadImage(file: File): Promise<string> {
  const ext = file.name.split('.').pop() ?? 'png'
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(fileName, file, { cacheControl: '3600', upsert: false })

  if (error) throw error

  const { data: urlData } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(fileName)

  return urlData.publicUrl
}

// ── Orders ────────────────────────────────────────────

export async function fetchOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

export async function createOrder(
  order: Omit<Order, 'id' | 'created_at'>,
): Promise<Order> {
  const { data, error } = await supabase.from('orders').insert(order).select().single()

  if (error) throw error
  return data
}

export async function updateOrder(
  id: string,
  order: Partial<Omit<Order, 'id'>>,
): Promise<Order> {
  const { data, error } = await supabase
    .from('orders')
    .update(order)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteOrder(id: string): Promise<void> {
  const { error } = await supabase.from('orders').delete().eq('id', id)
  if (error) throw error
}
