import React from 'react';
import { Leaf, Award, Truck, Shield, Star, ArrowRight } from 'lucide-react';
import { Product } from '../../types';
import { products, reviews } from '../../data/products';
import ProductCard from '../ProductCard';

interface HomeProps {
  onPageChange: (page: string) => void;
  onProductClick: (product: Product) => void;
}

const Home: React.FC<HomeProps> = ({ onPageChange, onProductClick }) => {
  const featuredProducts = products.filter(p => p.featured);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-cream-50 to-sage-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-sage-800 mb-6 leading-tight">
                Natural Skincare
                <span className="block text-gold-600">Rituals</span>
              </h1>
              <p className="text-xl text-sage-700 mb-8 leading-relaxed">
                Discover the power of nature with our carefully crafted skincare collection. 
                Each product is formulated with pure, natural ingredients to nurture your skin's innate beauty.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => onPageChange('shop')}
                  className="bg-sage-600 text-white px-8 py-4 rounded-md text-lg font-medium hover:bg-sage-700 transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <span>Shop Collection</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
                <button 
                  onClick={() => onPageChange('rituals')}
                  className="border border-sage-600 text-sage-600 px-8 py-4 rounded-md text-lg font-medium hover:bg-sage-50 transition-colors duration-200"
                >
                  Discover Rituals
                </button>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.pexels.com/photos/7755476/pexels-photo-7755476.jpeg" 
                alt="Natural skincare products"
                className="rounded-lg shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-lg shadow-xl">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <Leaf className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sage-800">100% Natural</p>
                    <p className="text-sage-600 text-sm">Ingredients</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: Leaf, title: '100% Natural', description: 'Pure ingredients from nature' },
              { icon: Award, title: 'Cruelty Free', description: 'Never tested on animals' },
              { icon: Shield, title: 'Dermatologist Tested', description: 'Safe for all skin types' },
              { icon: Truck, title: 'Free Shipping', description: 'On orders above ₹1999' }
            ].map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="bg-sage-50 p-4 rounded-full inline-block mb-4 group-hover:bg-sage-100 transition-colors">
                  <feature.icon className="h-8 w-8 text-sage-600" />
                </div>
                <h3 className="text-lg font-semibold text-sage-800 mb-2">{feature.title}</h3>
                <p className="text-sage-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-sage-800 mb-4">Featured Products</h2>
            <p className="text-xl text-sage-700">Our most loved skincare essentials</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onProductClick={onProductClick}
              />
            ))}
          </div>
          
          <div className="text-center">
            <button 
              onClick={() => onPageChange('shop')}
              className="bg-sage-600 text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-sage-700 transition-colors duration-200 inline-flex items-center space-x-2"
            >
              <span>View All Products</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-sage-800 mb-4">What Our Customers Say</h2>
            <p className="text-xl text-sage-700">Real results from real people</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {reviews.map((review) => (
              <div key={review.id} className="bg-sage-50 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-5 w-5 ${i < review.rating ? 'text-gold-400 fill-current' : 'text-sage-300'}`} />
                  ))}
                </div>
                <p className="text-sage-700 mb-4 italic">"{review.comment}"</p>
                <p className="font-semibold text-sage-800">- {review.name}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <button 
              onClick={() => onPageChange('reviews')}
              className="border border-sage-600 text-sage-600 px-6 py-2 rounded-md hover:bg-sage-50 transition-colors duration-200"
            >
              Read All Reviews
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-sage-600 to-sage-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Begin Your Natural Skincare Journey
          </h2>
          <p className="text-xl text-sage-100 mb-8">
            Join thousands of customers who have transformed their skin with our natural rituals
          </p>
          <button 
            onClick={() => onPageChange('shop')}
            className="bg-gold-500 text-white px-8 py-4 rounded-md text-lg font-medium hover:bg-gold-600 transition-colors duration-200"
          >
            Start Shopping
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
