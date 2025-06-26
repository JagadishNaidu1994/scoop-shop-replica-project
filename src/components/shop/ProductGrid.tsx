
import React, { useState } from 'react';
import ProductCard from './ProductCard';

interface ProductGridProps {
  selectedCategory: string;
  priceRange: number[];
}

const ProductGrid = ({ selectedCategory, priceRange }: ProductGridProps) => {
  const [sortBy, setSortBy] = useState('featured');

  const products = [
    {
      id: 1,
      name: 'Vanilla Bean Dream',
      price: 12.99,
      originalPrice: 15.99,
      image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=400&fit=crop',
      category: 'pints',
      isNew: true,
      rating: 4.8,
      reviews: 124
    },
    {
      id: 2,
      name: 'Chocolate Indulgence',
      price: 13.99,
      image: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400&h=400&fit=crop',
      category: 'pints',
      rating: 4.9,
      reviews: 89
    },
    {
      id: 3,
      name: 'Strawberry Fields',
      price: 11.99,
      image: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?w=400&h=400&fit=crop',
      category: 'pints',
      rating: 4.7,
      reviews: 156
    },
    {
      id: 4,
      name: 'Cookie Sandwich Delight',
      price: 8.99,
      image: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400&h=400&fit=crop',
      category: 'sandwiches',
      rating: 4.6,
      reviews: 78
    },
    {
      id: 5,
      name: 'Premium Chocolate Bar',
      price: 6.99,
      image: 'https://images.unsplash.com/photo-1517022812141-23620dba5c23?w=400&h=400&fit=crop',
      category: 'bars',
      rating: 4.5,
      reviews: 45
    },
    {
      id: 6,
      name: 'Mint Chocolate Chip',
      price: 13.49,
      image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=400&fit=crop',
      category: 'pints',
      rating: 4.8,
      reviews: 203
    }
  ];

  const filteredProducts = products.filter(product => {
    const categoryMatch = selectedCategory === 'all' || product.category === selectedCategory;
    const priceMatch = product.price >= priceRange[0] && product.price <= priceRange[1];
    return categoryMatch && priceMatch;
  });

  return (
    <div className="flex-1">
      {/* Sort and Results Header */}
      <div className="flex justify-between items-center mb-8 animate-fade-in">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {selectedCategory === 'all' ? 'All Products' : 'Filtered Products'}
          </h2>
          <p className="text-gray-600">{filteredProducts.length} products found</p>
        </div>
        <select 
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="featured">Featured</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
          <option value="newest">Newest</option>
        </select>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product, index) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            index={index}
          />
        ))}
      </div>

      {/* Load More Button */}
      <div className="text-center mt-12 animate-fade-in">
        <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 hover:scale-105">
          Load More Products
        </button>
      </div>
    </div>
  );
};

export default ProductGrid;
