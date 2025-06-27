
import React, { useState } from 'react';
import ProductCard from './ProductCard';
import { Grid, List, ChevronDown } from 'lucide-react';

interface ProductGridProps {
  selectedCategory: string;
  priceRange: number[];
}

const ProductGrid = ({ selectedCategory, priceRange }: ProductGridProps) => {
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid');

  const products = [
    {
      id: 1,
      name: 'Vanilla Bean Supreme',
      price: 16.99,
      originalPrice: 19.99,
      image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=400&fit=crop',
      category: 'bestsellers',
      isBestSeller: true,
      rating: 4.9,
      reviews: 247,
      description: 'Rich vanilla bean ice cream with real vanilla pods'
    },
    {
      id: 2,
      name: 'Dark Chocolate Intense',
      price: 18.99,
      image: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400&h=400&fit=crop',
      category: 'bestsellers',
      isBestSeller: true,
      rating: 4.8,
      reviews: 198,
      description: 'Decadent dark chocolate ice cream with 70% cocoa'
    },
    {
      id: 3,
      name: 'Strawberry Fields Forever',
      price: 15.99,
      image: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?w=400&h=400&fit=crop',
      category: 'bestsellers',
      isBestSeller: true,
      rating: 4.7,
      reviews: 156,
      description: 'Fresh strawberry ice cream with real fruit pieces'
    },
    {
      id: 4,
      name: 'Mint Chocolate Chip',
      price: 17.99,
      image: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400&h=400&fit=crop',
      category: 'pints',
      rating: 4.6,
      reviews: 132,
      description: 'Cool mint ice cream with premium chocolate chips'
    },
    {
      id: 5,
      name: 'Salted Caramel Swirl',
      price: 19.99,
      image: 'https://images.unsplash.com/photo-1517022812141-23620dba5c23?w=400&h=400&fit=crop',
      category: 'bestsellers',
      isBestSeller: true,
      rating: 4.9,
      reviews: 289,
      description: 'Creamy caramel ice cream with sea salt and caramel swirl'
    },
    {
      id: 6,
      name: 'Cookies & Cream',
      price: 16.99,
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=400&fit=crop',
      category: 'pints',
      rating: 4.5,
      reviews: 203,
      description: 'Classic vanilla ice cream with chocolate cookie pieces'
    }
  ];

  const filteredProducts = products.filter(product => {
    const categoryMatch = selectedCategory === 'all' || product.category === selectedCategory;
    const priceMatch = product.price >= priceRange[0] && product.price <= priceRange[1];
    return categoryMatch && priceMatch;
  });

  return (
    <div className="flex-1">
      {/* Header with Sort and View Options */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            {selectedCategory === 'all' ? 'All Products' : 'Best Sellers'}
          </h2>
          <p className="text-gray-600">{filteredProducts.length} products</p>
        </div>
        
        <div className="flex items-center gap-4">
          {/* View Mode Toggle */}
          <div className="flex items-center border rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Best Rating</option>
              <option value="newest">Date: New to Old</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className={`grid gap-6 ${
        viewMode === 'grid' 
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
          : 'grid-cols-1'
      }`}>
        {filteredProducts.map((product, index) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            index={index}
            viewMode={viewMode}
          />
        ))}
      </div>

      {/* Load More */}
      <div className="text-center mt-12">
        <button className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium">
          Load More
        </button>
      </div>
    </div>
  );
};

export default ProductGrid;
