import type { Product, ProductInput, Order, AdminStats } from "../types/admin"

// Mock data for admin functionality
const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Premium Cotton T-Shirt",
    description: "High-quality cotton t-shirt with premium finish",
    price: 899,
    stock: 50,
    category: "Clothing",
    image_url: "/cotton-tshirt.png",
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Wireless Bluetooth Headphones",
    description: "Premium wireless headphones with noise cancellation",
    price: 2999,
    stock: 25,
    category: "Electronics",
    image_url: "/bluetooth-headphones.png",
    created_at: new Date().toISOString(),
  },
]

const MOCK_ORDERS: Order[] = [
  {
    id: "order_1",
    user_id: "user_1",
    user_email: "customer@example.com",
    status: "pending",
    total_amount: 1798,
    payment_status: "completed",
    payment_method: "razorpay",
    created_at: new Date().toISOString(),
    items: [
      {
        id: "item_1",
        order_id: "order_1",
        product_id: "1",
        product_name: "Premium Cotton T-Shirt",
        quantity: 2,
        price: 899,
      },
    ],
  },
]

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function getProducts(): Promise<Product[]> {
  await delay(500)
  const stored = localStorage.getItem("admin_products")
  return stored ? JSON.parse(stored) : MOCK_PRODUCTS
}

export async function createProduct(product: ProductInput): Promise<Product> {
  await delay(500)
  const products = await getProducts()
  const newProduct: Product = {
    ...product,
    id: Date.now().toString(),
    created_at: new Date().toISOString(),
  }

  const updatedProducts = [...products, newProduct]
  localStorage.setItem("admin_products", JSON.stringify(updatedProducts))
  return newProduct
}

export async function updateProduct(id: string, product: Partial<ProductInput>): Promise<Product> {
  await delay(500)
  const products = await getProducts()
  const index = products.findIndex((p) => p.id === id)

  if (index === -1) {
    throw new Error("Product not found")
  }

  const updatedProduct = {
    ...products[index],
    ...product,
    updated_at: new Date().toISOString(),
  }

  products[index] = updatedProduct
  localStorage.setItem("admin_products", JSON.stringify(products))
  return updatedProduct
}

export async function deleteProduct(id: string): Promise<void> {
  await delay(500)
  const products = await getProducts()
  const filteredProducts = products.filter((p) => p.id !== id)
  localStorage.setItem("admin_products", JSON.stringify(filteredProducts))
}

export async function getOrders(): Promise<Order[]> {
  await delay(500)
  const stored = localStorage.getItem("admin_orders")
  return stored ? JSON.parse(stored) : MOCK_ORDERS
}

export async function updateOrderStatus(id: string, status: Order["status"]): Promise<Order> {
  await delay(500)
  const orders = await getOrders()
  const index = orders.findIndex((o) => o.id === id)

  if (index === -1) {
    throw new Error("Order not found")
  }

  orders[index] = {
    ...orders[index],
    status,
    updated_at: new Date().toISOString(),
  }

  localStorage.setItem("admin_orders", JSON.stringify(orders))
  return orders[index]
}

export async function getAdminStats(): Promise<AdminStats> {
  await delay(500)
  const products = await getProducts()
  const orders = await getOrders()

  return {
    totalProducts: products.length,
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, order) => sum + order.total_amount, 0),
    pendingOrders: orders.filter((order) => order.status === "pending").length,
  }
}
