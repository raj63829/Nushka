import React from 'react';
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';

interface CartProps {
  onBack: () => void;
  onPageChange: (page: string) => void;
}

const Cart: React.FC<CartProps> = ({ onBack, onPageChange }) => {
  const { state, updateQuantity, removeFromCart, clearCart } = useCart();

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  const shippingCost = state.total >= 1999 ? 0 : 99;
  const finalTotal = state.total + shippingCost;

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-sage-600 hover:text-sage-800 mb-6 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Continue Shopping</span>
          </button>

          <div className="text-center py-16">
            <ShoppingBag className="mx-auto h-16 w-16 text-sage-400 mb-4" />
            <h2 className="text-2xl font-bold text-sage-800 mb-4">Your cart is empty</h2>
            <p className="text-sage-600 mb-8">Start adding some products to your cart</p>
            <button
              onClick={() => onPageChange('shop')}
              className="bg-sage-600 text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-sage-700 transition-colors duration-200"
            >
              Browse Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-sage-600 hover:text-sage-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Continue Shopping</span>
          </button>
          
          <button
            onClick={clearCart}
            className="text-red-600 hover:text-red-800 text-sm transition-colors"
          >
            Clear Cart
          </button>
        </div>

        <h1 className="text-3xl font-bold text-sage-800 mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {state.items.map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-lg shadow-sm border border-sage-100">
                <div className="flex items-start space-x-4">
                  <img 
                    src={item.images[0]} 
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-md"
                  />
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-sage-800">{item.name}</h3>
                    <p className="text-sage-600 text-sm mt-1">{item.description}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      {item.skinConcerns.slice(0, 2).map((concern, index) => (
                        <span 
                          key={index} 
                          className="px-2 py-1 bg-sage-100 text-sage-700 rounded-full text-xs"
                        >
                          {concern}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-lg font-semibold text-sage-800">
                      ₹{item.price.toLocaleString()}
                    </p>
                    {item.originalPrice && (
                      <p className="text-sm text-sage-500 line-through">
                        ₹{item.originalPrice.toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-sage-100">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      className="p-1 border border-sage-300 rounded hover:bg-sage-50 transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="px-3 py-1 border border-sage-300 rounded font-medium min-w-[2.5rem] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      className="p-1 border border-sage-300 rounded hover:bg-sage-50 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <span className="text-lg font-semibold text-sage-800">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-1 text-red-600 hover:text-red-800 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-sage-100 sticky top-4">
              <h2 className="text-xl font-semibold text-sage-800 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-sage-600">Subtotal ({state.itemCount} items)</span>
                  <span className="text-sage-800">₹{state.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sage-600">Shipping</span>
                  <span className="text-sage-800">
                    {shippingCost === 0 ? 'Free' : `₹${shippingCost}`}
                  </span>
                </div>
                {state.total >= 1999 && (
                  <p className="text-sm text-green-600">🎉 You saved ₹99 on shipping!</p>
                )}
                {state.total < 1999 && (
                  <p className="text-sm text-sage-600">
                    Add ₹{(1999 - state.total).toLocaleString()} more for free shipping
                  </p>
                )}
              </div>
              
              <div className="border-t border-sage-200 pt-3 mb-6">
                <div className="flex justify-between text-lg font-semibold">
                  <span className="text-sage-800">Total</span>
                  <span className="text-sage-800">₹{finalTotal.toLocaleString()}</span>
                </div>
              </div>
              
              <button 
                onClick={() => onPageChange('checkout')}
                className="w-full bg-sage-600 text-white py-3 rounded-md font-medium hover:bg-sage-700 transition-colors duration-200"
              >
                Proceed to Checkout
              </button>
              
              <p className="text-xs text-sage-500 mt-4 text-center">
                Secure checkout with SSL encryption
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
