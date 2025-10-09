"use client"

import type React from "react"
import { useState } from "react"
import { Search, Package, Truck, CheckCircle, Clock, AlertCircle } from "lucide-react"
import type { Order } from "../lib/orderService"

const GuestOrderTracking: React.FC = () => {
  const [orderNumber, setOrderNumber] = useState("")
  const [email, setEmail] = useState("")
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setOrder(null)

    try {
      // In demo mode, search through localStorage orders
      const orders = JSON.parse(localStorage.getItem("nushka-orders") || "[]")
      const foundOrder = orders.find(
        (o: Order) => o.order_number === orderNumber && (o.guest_email === email || o.user_id),
      )

      if (foundOrder) {
        setOrder(foundOrder)
      } else {
        setError("Order not found. Please check your order number and email address.")
      }
    } catch (error) {
      setError("An error occurred while tracking your order. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "confirmed":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "processing":
        return <Package className="h-5 w-5 text-blue-500" />
      case "shipped":
        return <Truck className="h-5 w-5 text-purple-500" />
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "cancelled":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusText = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "Order Pending"
      case "confirmed":
        return "Order Confirmed"
      case "processing":
        return "Processing"
      case "shipped":
        return "Shipped"
      case "delivered":
        return "Delivered"
      case "cancelled":
        return "Cancelled"
      default:
        return "Unknown Status"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-sage-800 mb-6">Track Your Order</h2>

        <form onSubmit={handleTrackOrder} className="space-y-4 mb-8">
          <div>
            <label className="block text-sm font-medium text-sage-700 mb-2">Order Number</label>
            <input
              type="text"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="Enter your order number (e.g., NUSHKA123456)"
              className="w-full p-3 border border-sage-200 rounded-md focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-sage-700 mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter the email used for the order"
              className="w-full p-3 border border-sage-200 rounded-md focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
              required
            />
          </div>

          {error && <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">{error}</div>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-sage-600 text-white py-3 rounded-md font-medium hover:bg-sage-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Tracking Order...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <Search className="h-4 w-4" />
                <span>Track Order</span>
              </div>
            )}
          </button>
        </form>

        {order && (
          <div className="border-t pt-6">
            <div className="bg-sage-50 p-4 rounded-lg mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-sage-800">Order #{order.order_number}</h3>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(order.status)}
                  <span className="font-medium text-sage-800">{getStatusText(order.status)}</span>
                </div>
              </div>
              <p className="text-sm text-sage-600">Placed on {formatDate(order.created_at)}</p>
              <p className="text-sm text-sage-600">Total: ₹{order.total_amount.toLocaleString()}</p>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-sage-800 mb-2">Shipping Address</h4>
                <div className="text-sm text-sage-600">
                  <p>
                    {order.shipping_address.firstName} {order.shipping_address.lastName}
                  </p>
                  <p>{order.shipping_address.address}</p>
                  <p>
                    {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.pincode}
                  </p>
                  <p>{order.shipping_address.phone}</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-sage-800 mb-2">Payment Information</h4>
                <div className="text-sm text-sage-600">
                  <p>Method: {order.payment_method}</p>
                  <p>Status: {order.payment_status}</p>
                  {order.payment_id && <p>Payment ID: {order.payment_id}</p>}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-sage-800 mb-2">Order Items</h4>
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span className="text-sage-800">
                        {item.product_name} x {item.quantity}
                      </span>
                      <span className="text-sage-600">₹{item.total_price.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default GuestOrderTracking
