<<<<<<< HEAD
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key"

// Create client with fallback values to prevent runtime errors
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}

// Database Types
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
=======
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database Types
export interface User {
  user_id: string;
  name: string;
  email: string;
  phone?: string;
  addresses: Address[];
  created_at: string;
}

export interface Address {
  id: string;
  user_id: string;
  name: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  is_default: boolean;
}

export interface Order {
  order_id: string;
  user_id: string;
  total_amount: number;
  payment_status: 'pending' | 'completed' | 'failed' | 'cod';
  order_status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shipping_address: Address;
  payment_method: string;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  created_at: string;
  items: OrderItem[];
}

export interface OrderItem {
  order_item_id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  product_name: string;
}

export interface CartItem {
  cart_id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
}

export interface WishlistItem {
  wishlist_id: string;
  user_id: string;
  product_id: string;
  created_at: string;
}
>>>>>>> 03c7a7604bb214e4d0f1d3102e34f6504e4c0671
