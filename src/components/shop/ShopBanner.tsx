
import React from 'react';

const ShopBanner = () => {
  return (
    <section className="relative bg-gradient-to-r from-green-800 to-green-600 py-16">
      <div className="absolute inset-0 bg-black opacity-10"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight">
          BEST SELLERS
        </h1>
        <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
          Discover our most popular premium ice cream collection
        </p>
        <div className="flex justify-center gap-4 text-sm text-white/80">
          <span>FREE SHIPPING OVER $50</span>
          <span>•</span>
          <span>HANDCRAFTED QUALITY</span>
          <span>•</span>
          <span>NATURAL INGREDIENTS</span>
        </div>
      </div>
    </section>
  );
};

export default ShopBanner;
