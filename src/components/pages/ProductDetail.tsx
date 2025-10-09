import React, { useState } from 'react';
import { ArrowLeft, Heart, ShoppingBag, Star, Minus, Plus } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { reviews } from '../../data/products';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onBack }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useCart();
  
  const inWishlist = isInWishlist(product.id);
  const productReviews = reviews.filter(r => r.productId === product.id);
  const averageRating = productReviews.length > 0 
    ? productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length 
    : 4.8;

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  const handleWishlistToggle = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-sage-600 hover:text-sage-800 mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Products</span>
        </button>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-sage-50">
              <img 
                src={product.images[selectedImageIndex]} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex space-x-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`w-16 h-16 rounded-md overflow-hidden border-2 ${
                      selectedImageIndex === index ? 'border-sage-600' : 'border-sage-200'
                    }`}
                  >
                    <img src={image} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-sage-800 mb-4">{product.name}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-5 w-5 ${i < averageRating ? 'text-gold-400 fill-current' : 'text-sage-300'}`} />
                  ))}
                </div>
                <span className="text-sage-600">
                  {averageRating.toFixed(1)} ({productReviews.length} reviews)
                </span>
              </div>
              
              <div className="flex items-center space-x-3 mb-6">
                <span className="text-3xl font-bold text-sage-800">
                  ₹{product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-sage-500 line-through">
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            <p className="text-sage-700 text-lg leading-relaxed">
              {product.description}
            </p>

            {/* Benefits */}
            <div>
              <h3 className="text-lg font-semibold text-sage-800 mb-3">Key Benefits</h3>
              <ul className="space-y-2">
                {product.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-sage-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sage-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Skin Concerns */}
            <div>
              <h3 className="text-lg font-semibold text-sage-800 mb-3">Best For</h3>
              <div className="flex flex-wrap gap-2">
                {product.skinConcerns.map((concern, index) => (
                  <span 
                    key={index} 
                    className="px-3 py-1 bg-sage-100 text-sage-700 rounded-full text-sm"
                  >
                    {concern}
                  </span>
                ))}
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4 pt-6 border-t border-sage-200">
              <div className="flex items-center space-x-4">
                <span className="text-sage-700 font-medium">Quantity:</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="p-2 border border-sage-300 rounded-md hover:bg-sage-50 transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-2 border border-sage-300 rounded-md font-medium min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="p-2 border border-sage-300 rounded-md hover:bg-sage-50 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-sage-600 text-white py-3 px-6 rounded-md font-medium hover:bg-sage-700 transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <ShoppingBag className="h-5 w-5" />
                  <span>Add to Cart</span>
                </button>
                <button
                  onClick={handleWishlistToggle}
                  className={`p-3 rounded-md border transition-colors duration-200 ${
                    inWishlist
                      ? 'border-red-300 bg-red-50 text-red-600'
                      : 'border-sage-300 text-sage-600 hover:bg-sage-50'
                  }`}
                >
                  <Heart className={`h-5 w-5 ${inWishlist ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information Tabs */}
        <div className="mt-16">
          <div className="border-b border-sage-200 mb-8">
            <div className="flex space-x-8">
              <button className="py-4 px-2 border-b-2 border-sage-600 text-sage-800 font-medium">
                Ingredients
              </button>
              <button className="py-4 px-2 text-sage-600 hover:text-sage-800">
                How to Use
              </button>
              <button className="py-4 px-2 text-sage-600 hover:text-sage-800">
                Reviews ({productReviews.length})
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-sage-800 mb-4">Ingredients</h3>
              <ul className="space-y-2">
                {product.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-gold-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sage-700">{ingredient}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-sage-800 mb-4">How to Use</h3>
              <p className="text-sage-700 leading-relaxed">{product.usage}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
