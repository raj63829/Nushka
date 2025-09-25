"use client"

import type React from "react"
import { useState } from "react"
import { CreditCard, Banknote, Shield, AlertCircle } from "lucide-react"

interface PaymentGatewayProps {
  amount: number
  onPaymentSuccess: (paymentData: any) => void
  onPaymentError: (error: string) => void
  customerInfo: {
    name: string
    email: string
    phone: string
  }
}

declare global {
  interface Window {
    Razorpay: any
  }
}

const PaymentGateway: React.FC<PaymentGatewayProps> = ({ amount, onPaymentSuccess, onPaymentError, customerInfo }) => {
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedMethod, setSelectedMethod] = useState<"razorpay" | "stripe" | "cod">("razorpay")

  const paymentMethods = [
    {
      id: "razorpay",
      name: "Razorpay",
      description: "Credit/Debit Cards, UPI, Net Banking",
      icon: CreditCard,
      available: true,
    },
    {
      id: "stripe",
      name: "Stripe",
      description: "International Cards",
      icon: CreditCard,
      available: false, // Demo mode
    },
    {
      id: "cod",
      name: "Cash on Delivery",
      description: "Pay when you receive",
      icon: Banknote,
      available: true,
    },
  ]

  const initializeRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script")
      script.src = "https://checkout.razorpay.com/v1/checkout.js"
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const handleRazorpayPayment = async () => {
    setIsProcessing(true)

    try {
      // Initialize Razorpay script
      const isRazorpayLoaded = await initializeRazorpay()

      if (!isRazorpayLoaded) {
        throw new Error("Razorpay SDK failed to load")
      }

      // In a real implementation, you would create an order on your backend
      // and get the order_id from your server
      const orderData = {
        order_id: `order_${Date.now()}`, // This should come from your backend
        amount: amount * 100, // Razorpay expects amount in paise
        currency: "INR",
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY || "rzp_test_demo", // Demo key
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Nushka",
        description: "Order Payment",
        order_id: orderData.order_id,
        handler: (response: any) => {
          // Payment successful
          onPaymentSuccess({
            payment_id: response.razorpay_payment_id,
            order_id: response.razorpay_order_id,
            signature: response.razorpay_signature,
            method: "razorpay",
            amount: amount,
            status: "completed",
          })
        },
        prefill: {
          name: customerInfo.name,
          email: customerInfo.email,
          contact: customerInfo.phone,
        },
        theme: {
          color: "#059669", // Sage green color
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false)
            onPaymentError("Payment cancelled by user")
          },
        },
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()
    } catch (error) {
      setIsProcessing(false)
      onPaymentError("Failed to initialize payment gateway")
    }
  }

  const handleStripePayment = async () => {
    // Stripe integration would go here
    // For demo purposes, we'll simulate it
    setIsProcessing(true)

    setTimeout(() => {
      setIsProcessing(false)
      onPaymentError("Stripe integration not available in demo mode")
    }, 2000)
  }

  const handleCODPayment = () => {
    onPaymentSuccess({
      payment_id: `cod_${Date.now()}`,
      method: "cod",
      amount: amount,
      status: "pending",
    })
  }

  const handlePayment = () => {
    switch (selectedMethod) {
      case "razorpay":
        handleRazorpayPayment()
        break
      case "stripe":
        handleStripePayment()
        break
      case "cod":
        handleCODPayment()
        break
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-sage-50 p-4 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <Shield className="h-5 w-5 text-sage-600" />
          <h3 className="font-semibold text-sage-800">Secure Payment</h3>
        </div>
        <p className="text-sm text-sage-600">
          Your payment information is encrypted and secure. We never store your card details.
        </p>
      </div>

      <div className="space-y-3">
        <h3 className="font-semibold text-sage-800">Select Payment Method</h3>

        {paymentMethods.map((method) => (
          <label
            key={method.id}
            className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
              selectedMethod === method.id ? "border-sage-500 bg-sage-50" : "border-sage-200 hover:border-sage-300"
            } ${!method.available ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <input
              type="radio"
              name="payment-method"
              value={method.id}
              checked={selectedMethod === method.id}
              onChange={(e) => setSelectedMethod(e.target.value as any)}
              disabled={!method.available}
              className="sr-only"
            />
            <method.icon className="h-6 w-6 text-sage-600 mr-4" />
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-sage-800">{method.name}</span>
                {!method.available && (
                  <span className="text-xs bg-sage-200 text-sage-600 px-2 py-1 rounded">Demo Only</span>
                )}
              </div>
              <p className="text-sm text-sage-600">{method.description}</p>
            </div>
            <div
              className={`w-4 h-4 rounded-full border-2 ${
                selectedMethod === method.id ? "border-sage-500 bg-sage-500" : "border-sage-300"
              }`}
            >
              {selectedMethod === method.id && <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>}
            </div>
          </label>
        ))}
      </div>

      {selectedMethod === "razorpay" && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm text-blue-800 font-medium">Demo Mode</p>
              <p className="text-sm text-blue-700">
                This is a demo integration. Use test card: 4111 1111 1111 1111, any future date, any CVV.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="border-t pt-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-semibold text-sage-800">Total Amount</span>
          <span className="text-2xl font-bold text-sage-800">₹{amount.toLocaleString()}</span>
        </div>

        <button
          onClick={handlePayment}
          disabled={isProcessing}
          className="w-full bg-sage-600 text-white py-4 rounded-lg font-semibold hover:bg-sage-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Processing Payment...</span>
            </div>
          ) : (
            `Pay ₹${amount.toLocaleString()}`
          )}
        </button>
      </div>
    </div>
  )
}

export default PaymentGateway
