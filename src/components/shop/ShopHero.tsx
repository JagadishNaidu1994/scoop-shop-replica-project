
import React from 'react';

const ShopHero = () => {
  return (
    <section className="relative bg-gradient-to-r from-blue-600 to-purple-600 py-20">
      <div className="absolute inset-0 bg-black opacity-20"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
          Find Your Favorites
        </h1>
        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto animate-fade-in">
          Discover our premium collection of artisanal ice cream flavors crafted with the finest ingredients
        </p>
        <div className="animate-fade-in">
          <button className="bg-yellow-400 text-black px-8 py-4 rounded-full font-semibold text-lg hover:bg-yellow-300 transition-all duration-300 hover:scale-105">
            Shop Now
          </button>
        </div>
      </div>
      {/* Wavy bottom transition */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg viewBox="0 0 1200 120" className="relative block w-full h-20">
          <path d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z" fill="white"></path>
        </svg>
      </div>
    </section>
  );
};

export default ShopHero;
