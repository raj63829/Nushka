"use client"

interface OrderItem {
  product_id: string
  product_name: string
  variant_name?: string
  quantity: number
  unit_price: number
  total_price: number
}

interface ShippingAddress {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  pincode: string
}

interface OrderData {
  user_id?: string
  guest_email?: string
  items: OrderItem[]
  subtotal: number
  shipping_amount: number
  tax_amount: number
  total_amount: number
  shipping_address: ShippingAddress
  billing_address?: ShippingAddress
  payment_method: string
  payment_id?: string
  payment_status: "pending" | "paid" | "failed"
  notes?: string
}

interface Order extends OrderData {
  id: string
  order_number: string
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled"
  created_at: string
  updated_at: string
}

class OrderService {
  private generateOrderNumber(): string {
    const timestamp = Date.now().toString().slice(-6)
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0")
    return `NUSHKA${timestamp}${random}`
  }

  async createOrder(orderData: OrderData): Promise<{ success: boolean; order?: Order; error?: string }> {
    try {
      const order: Order = {
        id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        order_number: this.generateOrderNumber(),
        status: orderData.payment_status === "paid" ? "confirmed" : "pending",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...orderData,
      }

      // In a real implementation, this would save to Supabase
      // const { data, error } = await supabase.from('orders').insert(order).select().single();

      // For demo, save to localStorage
      const existingOrders = JSON.parse(localStorage.getItem("nushka-orders") || "[]")
      existingOrders.push(order)
      localStorage.setItem("nushka-orders", JSON.stringify(existingOrders))

      // Also save order items
      const orderItems = orderData.items.map((item) => ({
        id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        order_id: order.id,
        ...item,
        created_at: new Date().toISOString(),
      }))

      const existingOrderItems = JSON.parse(localStorage.getItem("nushka-order-items") || "[]")
      existingOrderItems.push(...orderItems)
      localStorage.setItem("nushka-order-items", JSON.stringify(existingOrderItems))

      return { success: true, order }
    } catch (error) {
      console.error("Error creating order:", error)
      return { success: false, error: "Failed to create order" }
    }
  }

  async getOrder(orderId: string): Promise<{ success: boolean; order?: Order; error?: string }> {
    try {
      const orders = JSON.parse(localStorage.getItem("nushka-orders") || "[]")
      const order = orders.find((o: Order) => o.id === orderId)

      if (!order) {
        return { success: false, error: "Order not found" }
      }

      return { success: true, order }
    } catch (error) {
      console.error("Error fetching order:", error)
      return { success: false, error: "Failed to fetch order" }
    }
  }

  async getUserOrders(userId: string): Promise<{ success: boolean; orders?: Order[]; error?: string }> {
    try {
      const orders = JSON.parse(localStorage.getItem("nushka-orders") || "[]")
      const userOrders = orders.filter((o: Order) => o.user_id === userId)

      return { success: true, orders: userOrders }
    } catch (error) {
      console.error("Error fetching user orders:", error)
      return { success: false, error: "Failed to fetch orders" }
    }
  }

  async updateOrderStatus(
    orderId: string,
    status: Order["status"],
    notes?: string,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const orders = JSON.parse(localStorage.getItem("nushka-orders") || "[]")
      const orderIndex = orders.findIndex((o: Order) => o.id === orderId)

      if (orderIndex === -1) {
        return { success: false, error: "Order not found" }
      }

      orders[orderIndex].status = status
      orders[orderIndex].updated_at = new Date().toISOString()

      if (notes) {
        orders[orderIndex].notes = notes
      }

      localStorage.setItem("nushka-orders", JSON.stringify(orders))

      // Add to status history
      const statusHistory = {
        id: `status_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        order_id: orderId,
        status,
        notes,
        created_at: new Date().toISOString(),
      }

      const existingHistory = JSON.parse(localStorage.getItem("nushka-order-status-history") || "[]")
      existingHistory.push(statusHistory)
      localStorage.setItem("nushka-order-status-history", JSON.stringify(existingHistory))

      return { success: true }
    } catch (error) {
      console.error("Error updating order status:", error)
      return { success: false, error: "Failed to update order status" }
    }
  }

  async processPayment(
    orderId: string,
    paymentData: {
      payment_id: string
      payment_method: string
      amount: number
      status: "completed" | "failed"
    },
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const orders = JSON.parse(localStorage.getItem("nushka-orders") || "[]")
      const orderIndex = orders.findIndex((o: Order) => o.id === orderId)

      if (orderIndex === -1) {
        return { success: false, error: "Order not found" }
      }

      orders[orderIndex].payment_id = paymentData.payment_id
      orders[orderIndex].payment_status = paymentData.status === "completed" ? "paid" : "failed"
      orders[orderIndex].updated_at = new Date().toISOString()

      if (paymentData.status === "completed") {
        orders[orderIndex].status = "confirmed"
      }

      localStorage.setItem("nushka-orders", JSON.stringify(orders))

      return { success: true }
    } catch (error) {
      console.error("Error processing payment:", error)
      return { success: false, error: "Failed to process payment" }
    }
  }
}

export const orderService = new OrderService()
export type { Order, OrderData, OrderItem, ShippingAddress }
