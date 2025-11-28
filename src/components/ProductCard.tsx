import React from 'react';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  onProductClick: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onProductClick }) => {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useCart();
  const inWishlist = isInWishlist(product.id);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <div 
      className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer overflow-hidden border border-sage-100"
      onClick={() => onProductClick(product)}
    >
      <div className="relative aspect-square overflow-hidden">
        <img 
          src={product.images[0]} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <button
          onClick={handleWishlistClick}
          className={`absolute top-3 right-3 p-2 rounded-full shadow-md transition-colors duration-200 ${
            inWishlist 
              ? 'bg-red-100 text-red-600' 
              : 'bg-white text-sage-600 hover:bg-sage-50'
          }`}
        >
          <Heart className={`h-4 w-4 ${inWishlist ? 'fill-current' : ''}`} />
        </button>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-medium text-sage-800 mb-2 group-hover:text-sage-900 transition-colors">
          {product.name}
        </h3>
        
        <p className="text-sm text-sage-600 mb-3 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-current text-gold-400" />
            ))}
          </div>
          <span className="text-sm text-sage-600 ml-2">(4.8)</span>
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
            onClick={handleAddToCart}
            className="flex items-center space-x-2 bg-sage-600 text-white px-3 py-2 rounded-md text-sm hover:bg-sage-700 transition-colors duration-200"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
