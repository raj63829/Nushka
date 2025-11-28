"use client"

import type React from "react"
import { useState } from "react"
import { ArrowLeft, CreditCard, Wallet, DollarSign, MapPin, Phone, Mail, User, Shield } from "lucide-react"
import { useCart } from "../../context/CartContext"
import { useAuth } from "../../context/AuthContext"
import PaymentGateway from "../PaymentGateway"
import { orderService, type OrderData } from "../../lib/orderService"

interface CheckoutProps {
  onBack: () => void
  onPageChange: (page: string) => void
}

const Checkout: React.FC<CheckoutProps> = ({ onBack, onPageChange }) => {
  const { state, clearCart, getCartSummary } = useCart()
  const { state: authState } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderNumber, setOrderNumber] = useState("")
  const [isProcessingOrder, setIsProcessingOrder] = useState(false)

  const [formData, setFormData] = useState({
    email: authState.user?.email || "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
  })

  const { subtotal, shipping, total } = getCartSummary()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const createOrderData = (paymentData?: any): OrderData => {
    return {
      user_id: authState.user?.user_id,
      guest_email: !authState.user ? formData.email : undefined,
      items: state.items.map((item) => ({
        product_id: item.id,
        product_name: item.name,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity,
      })),
      subtotal,
      shipping_amount: shipping,
      tax_amount: 0,
      total_amount: total,
      shipping_address: formData,
      payment_method: paymentData?.method || "cod",
      payment_id: paymentData?.payment_id,
      payment_status: paymentData?.status === "completed" ? "paid" : "pending",
    }
  }

  const handlePaymentSuccess = async (paymentData: any) => {
    setIsProcessingOrder(true)

    try {
      const orderData = createOrderData(paymentData)
      const result = await orderService.createOrder(orderData)

      if (result.success && result.order) {
        setOrderNumber(result.order.order_number)
        setOrderPlaced(true)
        clearCart()
      } else {
        throw new Error(result.error || "Failed to create order")
      }
    } catch (error) {
      console.error("Error creating order:", error)
      // Handle error - show error message to user
    } finally {
      setIsProcessingOrder(false)
    }
  }

  const handlePaymentError = (error: string) => {
    console.error("Payment error:", error)
    // Handle payment error - show error message to user
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-sm text-center max-w-md mx-4">
          <div className="bg-green-100 p-4 rounded-full inline-block mb-4">
            <Shield className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-sage-800 mb-4">Order Confirmed!</h2>
          <p className="text-sage-600 mb-6">Thank you for your order. You will receive a confirmation email shortly.</p>
          <p className="text-sm text-sage-500 mb-6">Order ID: #{orderNumber}</p>
          <button
            onClick={() => onPageChange("home")}
            className="bg-sage-600 text-white px-6 py-2 rounded-md hover:bg-sage-700 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    )
  }

  const paymentMethods = [
    { id: "card", label: "Credit/Debit Card", icon: CreditCard },
    { id: "upi", label: "UPI", icon: Wallet },
    { id: "cod", label: "Cash on Delivery", icon: DollarSign },
  ]

  const steps = [
    { id: 1, title: "Shipping Information" },
    { id: 2, title: "Payment Method" },
    { id: 3, title: "Order Review" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-sage-600 hover:text-sage-800 mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Cart</span>
        </button>

        <h1 className="text-3xl font-bold text-sage-800 mb-8">Checkout</h1>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step.id ? "bg-sage-600 text-white" : "bg-sage-200 text-sage-600"
                }`}
              >
                {step.id}
              </div>
              <span className="ml-2 text-sm text-sage-600">{step.title}</span>
              {index < steps.length - 1 && (
                <div className={`w-16 h-0.5 mx-4 ${currentStep > step.id ? "bg-sage-600" : "bg-sage-200"}`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {currentStep === 1 && (
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold text-sage-800 mb-6">Shipping Information</h2>

                {!authState.isAuthenticated && (
                  <div className="bg-sage-50 p-4 rounded-md mb-6">
                    <p className="text-sage-700 mb-3">
                      Have an account? Sign in for faster checkout with saved addresses.
                    </p>
                    <button
                      onClick={() => onPageChange("home")} // This would trigger auth modal
                      className="text-sage-600 hover:text-sage-800 font-medium underline"
                    >
                      Sign In to Your Account
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-sage-700 mb-2">
                      <Mail className="h-4 w-4 inline mr-1" />
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-sage-200 rounded-md focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-sage-700 mb-2">
                      <Phone className="h-4 w-4 inline mr-1" />
                      Phone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-sage-200 rounded-md focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-sage-700 mb-2">
                      <User className="h-4 w-4 inline mr-1" />
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-sage-200 rounded-md focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-sage-700 mb-2">Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-sage-200 rounded-md focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-sage-700 mb-2">
                      <MapPin className="h-4 w-4 inline mr-1" />
                      Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-sage-200 rounded-md focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-sage-700 mb-2">City *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-sage-200 rounded-md focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-sage-700 mb-2">State *</label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-sage-200 rounded-md focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                      required
                    >
                      <option value="">Select State</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Gujarat">Gujarat</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-sage-700 mb-2">PIN Code *</label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-sage-200 rounded-md focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                      required
                    />
                  </div>
                </div>
                <button
                  onClick={() => setCurrentStep(2)}
                  className="mt-6 w-full bg-sage-600 text-white py-3 rounded-md hover:bg-sage-700 transition-colors"
                >
                  Continue to Payment
                </button>
              </div>
            )}

            {currentStep === 2 && (
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold text-sage-800 mb-6">Payment</h2>

                <PaymentGateway
                  amount={total}
                  onPaymentSuccess={handlePaymentSuccess}
                  onPaymentError={handlePaymentError}
                  customerInfo={{
                    name: `${formData.firstName} ${formData.lastName}`,
                    email: formData.email,
                    phone: formData.phone,
                  }}
                />

                <div className="flex space-x-4 mt-6">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="flex-1 border border-sage-300 text-sage-600 py-3 rounded-md hover:bg-sage-50 transition-colors"
                  >
                    Back
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm sticky top-4">
              <h2 className="text-xl font-semibold text-sage-800 mb-4">Order Summary</h2>

              <div className="space-y-4 mb-6">
                {state.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <img
                      src={item.images[0] || "/placeholder.svg"}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-sage-800 text-sm">{item.name}</p>
                      <p className="text-sage-600 text-sm">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sage-800 font-medium">₹{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-sage-200 pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sage-600">Subtotal</span>
                  <span className="text-sage-800">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sage-600">Shipping</span>
                  <span className="text-sage-800">{shipping === 0 ? "Free" : `₹${shipping}`}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold pt-2 border-t border-sage-200">
                  <span className="text-sage-800">Total</span>
                  <span className="text-sage-800">₹{total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
