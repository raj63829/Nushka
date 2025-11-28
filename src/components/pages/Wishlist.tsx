import React from 'react';
import { ArrowLeft, Heart, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';

interface WishlistProps {
  onBack: () => void;
  onPageChange: (page: string) => void;
}

const Wishlist: React.FC<WishlistProps> = ({ onBack, onPageChange }) => {
  const { state, removeFromWishlist, addToCart } = useCart();

  if (state.wishlist.length === 0) {
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
            <Heart className="mx-auto h-16 w-16 text-sage-400 mb-4" />
            <h2 className="text-2xl font-bold text-sage-800 mb-4">Your wishlist is empty</h2>
            <p className="text-sage-600 mb-8">Save products you love for later</p>
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
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-sage-600 hover:text-sage-800 mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Continue Shopping</span>
        </button>

        <h1 className="text-3xl font-bold text-sage-800 mb-8">
          My Wishlist ({state.wishlist.length})
        </h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {state.wishlist.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden border border-sage-100">
              <div className="relative aspect-square">
                <img 
                  src={product.images[0]} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => removeFromWishlist(product.id)}
                  className="absolute top-3 right-3 p-2 bg-red-100 text-red-600 rounded-full shadow-md hover:bg-red-200 transition-colors"
                >
                  <Heart className="h-4 w-4 fill-current" />
                </button>
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-medium text-sage-800 mb-2">{product.name}</h3>
                <p className="text-sm text-sage-600 mb-3 line-clamp-2">{product.description}</p>
                
                <div className="flex items-center space-x-2 mb-4">
                  {product.skinConcerns.slice(0, 2).map((concern, index) => (
                    <span 
                      key={index} 
                      className="px-2 py-1 bg-sage-100 text-sage-700 rounded-full text-xs"
                    >
                      {concern}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-semibold text-sage-800">
                      ₹{product.price.toLocaleString()}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-sage-500 line-through">
                        ₹{product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  
                  <button
                    onClick={() => addToCart(product)}
                    className="flex items-center space-x-2 bg-sage-600 text-white px-3 py-2 rounded-md text-sm hover:bg-sage-700 transition-colors duration-200"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
