
import React, { useState } from 'react';
import HeaderNavBar from '@/components/HeaderNavBar';
import Footer from '@/components/Footer';
import ProductGrid from '@/components/shop/ProductGrid';

const Shop = () => {
  return (
    <div className="min-h-screen bg-white">
      <HeaderNavBar />
      <main className="w-full px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          <ProductGrid />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Shop;
