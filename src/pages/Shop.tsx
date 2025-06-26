
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ShopHero from '@/components/shop/ShopHero';
import ProductGrid from '@/components/shop/ProductGrid';
import FilterSidebar from '@/components/shop/FilterSidebar';

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 100]);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <ShopHero />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            <FilterSidebar 
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
            />
            <ProductGrid 
              selectedCategory={selectedCategory}
              priceRange={priceRange}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Shop;
