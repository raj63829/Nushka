import React, { useState } from 'react';
import { ArrowLeft, CreditCard, Wallet, DollarSign, MapPin, Phone, Mail, User, Shield } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

interface CheckoutProps {
  onBack: () => void;
  onPageChange: (page: string) => void;
}

const Checkout: React.FC<CheckoutProps> = ({ onBack, onPageChange }) => {
  const { state, clearCart } = useCart();
  const { state: authState } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [orderPlaced, setOrderPlaced] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    phone: ''
  });

  const shippingCost = state.total >= 1999 ? 0 : 99;
  const finalTotal = state.total + shippingCost;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePlaceOrder = async () => {
    try {
      // Create order in database
      const orderData = {
        user_id: authState.user?.user_id || null,
        total_amount: finalTotal,
        payment_status: paymentMethod === 'cod' ? 'pending' : 'completed',
        order_status: 'processing',
        payment_method: paymentMethod,
        shipping_address: formData,
        items: state.items.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price,
          product_name: item.name
        }))
      };

      const { data: order, error } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single();

      if (error) throw error;

      // If payment method is not COD, integrate with payment gateway
      if (paymentMethod !== 'cod') {
        // Integration with Razorpay/Stripe would go here
        console.log('Processing payment for order:', order.order_id);
      }

      setOrderPlaced(true);
      clearCart();
    } catch (error) {
      console.error('Error placing order:', error);
      // Handle error - show error message to user
    }
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-sm text-center max-w-md mx-4">
          <div className="bg-green-100 p-4 rounded-full inline-block mb-4">
            <Shield className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-sage-800 mb-4">Order Confirmed!</h2>
          <p className="text-sage-600 mb-6">
            Thank you for your order. You will receive a confirmation email shortly.
          </p>
          <p className="text-sm text-sage-500 mb-6">
            Order ID: #NUSHKA{Date.now()}
          </p>
          <button
            onClick={() => onPageChange('home')}
            className="bg-sage-600 text-white px-6 py-2 rounded-md hover:bg-sage-700 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const paymentMethods = [
    { id: 'card', label: 'Credit/Debit Card', icon: CreditCard },
    { id: 'upi', label: 'UPI', icon: Wallet },
    { id: 'cod', label: 'Cash on Delivery', icon: DollarSign }
  ];

  const steps = [
    { id: 1, title: 'Shipping Information' },
    { id: 2, title: 'Payment Method' },
    { id: 3, title: 'Order Review' }
  ];

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
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= step.id ? 'bg-sage-600 text-white' : 'bg-sage-200 text-sage-600'
              }`}>
                {step.id}
              </div>
              <span className="ml-2 text-sm text-sage-600">{step.title}</span>
              {index < steps.length - 1 && (
                <div className={`w-16 h-0.5 mx-4 ${
                  currentStep > step.id ? 'bg-sage-600' : 'bg-sage-200'
                }`} />
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
                      onClick={() => onPageChange('home')} // This would trigger auth modal
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
                <h2 className="text-xl font-semibold text-sage-800 mb-6">Payment Method</h2>
                <div className="space-y-4">
                  {paymentMethods.map((method) => (
                    <label key={method.id} className="flex items-center p-4 border border-sage-200 rounded-md cursor-pointer hover:border-sage-400 transition-colors">
                      <input
                        type="radio"
                        name="payment"
                        value={method.id}
                        checked={paymentMethod === method.id}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-4 text-sage-600 focus:ring-sage-500"
                      />
                      <method.icon className="h-5 w-5 text-sage-600 mr-3" />
                      <span className="font-medium text-sage-800">{method.label}</span>
                    </label>
                  ))}
                </div>
                <div className="flex space-x-4 mt-6">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="flex-1 border border-sage-300 text-sage-600 py-3 rounded-md hover:bg-sage-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="flex-1 bg-sage-600 text-white py-3 rounded-md hover:bg-sage-700 transition-colors"
                  >
                    Review Order
                  </button>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold text-sage-800 mb-6">Review Your Order</h2>
                <div className="space-y-4 mb-6">
                  <div>
                    <h3 className="font-medium text-sage-800 mb-2">Shipping Address</h3>
                    <p className="text-sage-600 text-sm">
                      {formData.firstName} {formData.lastName}<br />
                      {formData.address}<br />
                      {formData.city}, {formData.state} {formData.pincode}<br />
                      {formData.phone}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sage-800 mb-2">Payment Method</h3>
                    <p className="text-sage-600 text-sm">
                      {paymentMethods.find(m => m.id === paymentMethod)?.label}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="flex-1 border border-sage-300 text-sage-600 py-3 rounded-md hover:bg-sage-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    className="flex-1 bg-sage-600 text-white py-3 rounded-md hover:bg-sage-700 transition-colors"
                  >
                    Place Order
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
                    <img src={item.images[0]} alt={item.name} className="w-12 h-12 object-cover rounded" />
                    <div className="flex-1">
                      <p className="font-medium text-sage-800 text-sm">{item.name}</p>
                      <p className="text-sage-600 text-sm">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sage-800 font-medium">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-sage-200 pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sage-600">Subtotal</span>
                  <span className="text-sage-800">₹{state.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sage-600">Shipping</span>
                  <span className="text-sage-800">{shippingCost === 0 ? 'Free' : `₹${shippingCost}`}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold pt-2 border-t border-sage-200">
                  <span className="text-sage-800">Total</span>
                  <span className="text-sage-800">₹{finalTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;