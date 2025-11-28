export interface Product {
  id: string
  name: string
  description?: string
  price: number
  stock: number
  category?: string
  image_url?: string
  created_at?: string
  updated_at?: string
}

export interface ProductInput {
  name: string
  description?: string
  price: number
  stock: number
  category?: string
  image_url?: string
}

export interface Order {
  id: string
  user_id: string
  user_email?: string
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  total_amount: number
  payment_status: "pending" | "completed" | "failed"
  payment_method: string
  created_at: string
  updated_at?: string
  items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  product_name: string
  quantity: number
  price: number
}

export interface AdminStats {
  totalProducts: number
  totalOrders: number
  totalRevenue: number
  pendingOrders: number
}
