import React, { useState, useMemo } from 'react';
import { Filter, Grid, List, Search } from 'lucide-react';
import { Product } from '../../types';
import { products } from '../../data/products';
import ProductCard from '../ProductCard';

interface ShopProps {
  onProductClick: (product: Product) => void;
}

const Shop: React.FC<ShopProps> = ({ onProductClick }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSkinConcern, setSelectedSkinConcern] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories = [
    { id: 'all', label: 'All Products' },
    { id: 'cleanser', label: 'Cleansers' },
    { id: 'serum', label: 'Serums' },
    { id: 'moisturizer', label: 'Moisturizers' },
    { id: 'mask', label: 'Masks' },
    { id: 'oil', label: 'Face Oils' },
    { id: 'toner', label: 'Toners' }
  ];

  const skinConcerns = [
    { id: 'all', label: 'All Concerns' },
    { id: 'Acne', label: 'Acne' },
    { id: 'Anti-aging', label: 'Anti-aging' },
    { id: 'Dryness', label: 'Dryness' },
    { id: 'Sensitivity', label: 'Sensitivity' },
    { id: 'Dullness', label: 'Dullness' },
    { id: 'Large pores', label: 'Large Pores' }
  ];

  const sortOptions = [
    { id: 'featured', label: 'Featured' },
    { id: 'price-low-high', label: 'Price: Low to High' },
    { id: 'price-high-low', label: 'Price: High to Low' },
    { id: 'name', label: 'Name A-Z' }
  ];

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filter by skin concern
    if (selectedSkinConcern !== 'all') {
      filtered = filtered.filter(product =>
        product.skinConcerns.includes(selectedSkinConcern)
      );
    }

    // Sort products
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'price-low-high':
          return a.price - b.price;
        case 'price-high-low':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'featured':
        default:
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      }
    });

    return sorted;
  }, [selectedCategory, selectedSkinConcern, sortBy, searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-sage-800 mb-4">Our Products</h1>
          <p className="text-xl text-sage-700">Discover our complete range of natural skincare products</p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-sage-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-sage-200 rounded-md focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
          />
        </div>

        {/* Filters and Controls */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8 border border-sage-100">
          <div className="grid md:grid-cols-4 gap-4 mb-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-sage-700 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2 border border-sage-200 rounded-md focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Skin Concern Filter */}
            <div>
              <label className="block text-sm font-medium text-sage-700 mb-2">Skin Concern</label>
              <select
                value={selectedSkinConcern}
                onChange={(e) => setSelectedSkinConcern(e.target.value)}
                className="w-full p-2 border border-sage-200 rounded-md focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
              >
                {skinConcerns.map((concern) => (
                  <option key={concern.id} value={concern.id}>
                    {concern.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-sage-700 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full p-2 border border-sage-200 rounded-md focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
              >
                {sortOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* View Mode */}
            <div>
              <label className="block text-sm font-medium text-sage-700 mb-2">View</label>
              <div className="flex space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-sage-600 text-white' : 'bg-sage-100 text-sage-600'}`}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-sage-600 text-white' : 'bg-sage-100 text-sage-600'}`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between text-sm text-sage-600">
            <span>Showing {filteredAndSortedProducts.length} products</span>
            {(selectedCategory !== 'all' || selectedSkinConcern !== 'all' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedSkinConcern('all');
                  setSearchQuery('');
                }}
                className="text-sage-600 hover:text-sage-800 underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>

        {/* Products Grid */}
        {filteredAndSortedProducts.length === 0 ? (
          <div className="text-center py-16">
            <Filter className="mx-auto h-12 w-12 text-sage-400 mb-4" />
            <h3 className="text-lg font-medium text-sage-800 mb-2">No products found</h3>
            <p className="text-sage-600">Try adjusting your filters or search query</p>
          </div>
        ) : (
          <div className={`grid gap-8 ${
            viewMode === 'grid' 
              ? 'md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
          }`}>
            {filteredAndSortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onProductClick={onProductClick}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
