
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductGrid from '@/components/shop/ProductGrid';

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 100]);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="py-8 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Best Sellers</h1>
          <p className="text-gray-600 max-w-3xl">
            These DIRTEA power blends have been - our mile-bestselling products. Each one has a unique 
            selling proposition, helping the most popular and trending functional adaptogenic ingredients.
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
            {/* Similar products - first 3 products */}
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <img 
                src="https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=300&h=300&fit=crop" 
                alt="Focus Gummies" 
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="font-semibold text-gray-900 mb-2">focus gummies</h3>
              <p className="text-sm text-gray-600 mb-4">Lion's Mane, Cordyceps, Ginseng</p>
              <p className="text-lg font-bold">£27</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <img 
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop" 
                alt="Focus Powder" 
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="font-semibold text-gray-900 mb-2">focus powder</h3>
              <p className="text-sm text-gray-600 mb-4">Focus, Cognitive, Immunity</p>
              <p className="text-lg font-bold">£30</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <img 
                src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop" 
                alt="Immunity Powder" 
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="font-semibold text-gray-900 mb-2">immunity powder</h3>
              <p className="text-sm text-gray-600 mb-4">Energy, Balance, Immunity</p>
              <p className="text-lg font-bold">£30</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Shop;
