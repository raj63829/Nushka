"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Package, Eye, Download, RefreshCw } from "lucide-react"
import { useAuth } from "../context/AuthContext"
import { orderService, type Order } from "../lib/orderService"

const OrderManagement: React.FC = () => {
  const { state: authState } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  useEffect(() => {
    if (authState.isAuthenticated && authState.user) {
      loadUserOrders()
    }
  }, [authState.isAuthenticated, authState.user])

  const loadUserOrders = async () => {
    if (!authState.user) return

    setIsLoading(true)
    try {
      const result = await orderService.getUserOrders(authState.user.user_id)
      if (result.success && result.orders) {
        setOrders(result.orders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()))
      }
    } catch (error) {
      console.error("Error loading orders:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "shipped":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const downloadInvoice = (order: Order) => {
    // In a real implementation, this would generate and download a PDF invoice
    const invoiceData = {
      orderNumber: order.order_number,
      date: order.created_at,
      customer: `${order.shipping_address.firstName} ${order.shipping_address.lastName}`,
      items: order.items,
      total: order.total_amount,
    }

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(invoiceData, null, 2))
    const downloadAnchorNode = document.createElement("a")
    downloadAnchorNode.setAttribute("href", dataStr)
    downloadAnchorNode.setAttribute("download", `invoice-${order.order_number}.json`)
    document.body.appendChild(downloadAnchorNode)
    downloadAnchorNode.click()
    downloadAnchorNode.remove()
  }

  if (!authState.isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <Package className="h-16 w-16 text-sage-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-sage-800 mb-2">Sign In Required</h2>
        <p className="text-sage-600 mb-6">Please sign in to view your order history.</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-sage-600" />
          <span className="ml-2 text-sage-600">Loading your orders...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-sage-800">My Orders</h1>
        <button
          onClick={loadUserOrders}
          className="flex items-center space-x-2 text-sage-600 hover:text-sage-800 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Refresh</span>
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-sage-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-sage-800 mb-2">No Orders Yet</h2>
          <p className="text-sage-600">When you place your first order, it will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-sm border border-sage-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-sage-800">Order #{order.order_number}</h3>
                  <p className="text-sm text-sage-600">Placed on {formatDate(order.created_at)}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                  <span className="text-lg font-semibold text-sage-800">₹{order.total_amount.toLocaleString()}</span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="font-medium text-sage-800 mb-1">Items ({order.items.length})</h4>
                  <div className="text-sm text-sage-600">
                    {order.items.slice(0, 2).map((item, index) => (
                      <p key={index}>
                        {item.product_name} x {item.quantity}
                      </p>
                    ))}
                    {order.items.length > 2 && <p>+{order.items.length - 2} more items</p>}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-sage-800 mb-1">Delivery Address</h4>
                  <p className="text-sm text-sage-600">
                    {order.shipping_address.firstName} {order.shipping_address.lastName}
                    <br />
                    {order.shipping_address.city}, {order.shipping_address.state}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-sage-200">
                <div className="text-sm text-sage-600">
                  Payment: {order.payment_method} • {order.payment_status}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="flex items-center space-x-1 px-3 py-1 text-sm text-sage-600 hover:text-sage-800 border border-sage-300 rounded-md hover:bg-sage-50 transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                    <span>View Details</span>
                  </button>
                  <button
                    onClick={() => downloadInvoice(order)}
                    className="flex items-center space-x-1 px-3 py-1 text-sm text-sage-600 hover:text-sage-800 border border-sage-300 rounded-md hover:bg-sage-50 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    <span>Invoice</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-sage-800">Order Details</h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-sage-600 hover:text-sage-800 transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                <div className="bg-sage-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-sage-800">Order #{selectedOrder.order_number}</h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}
                    >
                      {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm text-sage-600">
                    Placed on {new Date(selectedOrder.created_at).toLocaleDateString("en-IN")}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-sage-800 mb-3">Order Items</h4>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-sage-200">
                        <div>
                          <p className="font-medium text-sage-800">{item.product_name}</p>
                          <p className="text-sm text-sage-600">Quantity: {item.quantity}</p>
                        </div>
                        <span className="font-medium text-sage-800">₹{item.total_price.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-sage-800 mb-2">Shipping Address</h4>
                    <div className="text-sm text-sage-600">
                      <p>
                        {selectedOrder.shipping_address.firstName} {selectedOrder.shipping_address.lastName}
                      </p>
                      <p>{selectedOrder.shipping_address.address}</p>
                      <p>
                        {selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state}{" "}
                        {selectedOrder.shipping_address.pincode}
                      </p>
                      <p>{selectedOrder.shipping_address.phone}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sage-800 mb-2">Payment Information</h4>
                    <div className="text-sm text-sage-600">
                      <p>Method: {selectedOrder.payment_method}</p>
                      <p>Status: {selectedOrder.payment_status}</p>
                      {selectedOrder.payment_id && <p>Payment ID: {selectedOrder.payment_id}</p>}
                    </div>
                  </div>
                </div>

                <div className="bg-sage-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sage-600">Subtotal</span>
                    <span className="text-sage-800">₹{selectedOrder.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sage-600">Shipping</span>
                    <span className="text-sage-800">₹{selectedOrder.shipping_amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-semibold pt-2 border-t border-sage-200">
                    <span className="text-sage-800">Total</span>
                    <span className="text-sage-800">₹{selectedOrder.total_amount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrderManagement
