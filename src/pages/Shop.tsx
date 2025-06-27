
import React, { useState } from 'react';
import HeaderNavBar from '@/components/HeaderNavBar';
import Footer from '@/components/Footer';
import ProductGrid from '@/components/shop/ProductGrid';
import ProductCard from '@/components/shop/ProductCard';

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 100]);

  // Additional products for "You may also like" section
  const additionalProducts = [
    {
      id: 9,
      name: 'focus gummies',
      description: 'Lion\'s Mane, Cordyceps, Ginseng',
      price: '£27',
      primaryImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
      hoverImage: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=400&fit=crop'
    },
    {
      id: 10,
      name: 'focus powder',
      description: 'Focus, Cognitive, Immunity',
      price: '£30',
      primaryImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
      hoverImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop'
    },
    {
      id: 11,
      name: 'immunity powder',
      description: 'Energy, Balance, Immunity',
      price: '£30',
      primaryImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
      hoverImage: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <HeaderNavBar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="py-8 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Best Sellers</h1>
          <p className="text-gray-600 max-w-3xl">
            Save 20% on every subscription order—no code needed. Get the best of DIRTEA by shopping our best selling mushroom products. Shop the most popular mushroom powders and organic super blends.
          </p>
        </div>

        <div className="py-8">
          <ProductGrid 
            selectedCategory={selectedCategory}
            priceRange={priceRange}
          />
        </div>

        {/* You may also like section */}
        <div className="py-16 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">You may also like</h2>
          <p className="text-gray-600 mb-8">Your Daily Ritual for Focus, Energy & Calm</p>
          <div className="flex items-center mb-6">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <span key={i}>★</span>
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-600">4.6 | 183 REVIEWS</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {additionalProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Shop;
