// lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js"

// Load Supabase URL and anon key from environment variables
// For Vite, use import.meta.env instead of process.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://placeholder.supabase.co"
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "placeholder-key"

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Helper to check if Supabase is properly configured
export const isSupabaseConfigured = (): boolean => {
  return !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY)
}

// -------------------------
// Database Types
// -------------------------
export interface User {
  user_id: string
  name: string
  email: string
  phone?: string
  addresses: Address[]
  created_at: string
}

export interface Address {
  id: string
  user_id: string
  name: string
  address_line_1: string
  address_line_2?: string
  city: string
  state: string
  pincode: string
  phone: string
  is_default: boolean
}

export interface Order {
  order_id: string
  user_id: string
  total_amount: number
  payment_status: "pending" | "completed" | "failed" | "cod"
  order_status: "processing" | "shipped" | "delivered" | "cancelled"
  shipping_address: Address
  payment_method: string
  razorpay_order_id?: string
  razorpay_payment_id?: string
  created_at: string
  items: OrderItem[]
}

export interface OrderItem {
  order_item_id: string
  order_id: string
  product_id: string
  quantity: number
  price: number
  product_name: string
}

export interface CartItem {
  cart_id: string
  user_id: string
  product_id: string
  quantity: number
  created_at: string
}

export interface WishlistItem {
  wishlist_id: string
  user_id: string
  product_id: string
  created_at: string
}

// -------------------------
// Example default user
// -------------------------
export const defaultUser: User = {
  user_id: "1",
  name: "Raj Sharma",
  email: "rajsharma63829@gmail.com",
  phone: "9618113710",
  addresses: [],
  created_at: new Date().toISOString(),
}
