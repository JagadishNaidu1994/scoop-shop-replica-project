
import React, { useState } from 'react';
import { Menu, X, ShoppingCart, User } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-blue-600 shadow-sm relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Desktop Navigation - Left */}
          <nav className="hidden md:flex space-x-8">
            <a href="/culture-cup" className="text-white hover:text-yellow-300 transition-colors font-medium">SHOP</a>
            <a href="/story" className="text-white hover:text-yellow-300 transition-colors font-medium">WHOLESALE</a>
            <a href="/find-us" className="text-white hover:text-yellow-300 transition-colors font-medium">EDITORIAL</a>
            <a href="/shop" className="text-white hover:text-yellow-300 transition-colors font-medium">OUR STORY</a>
                        <a href="/" className="text-white hover:text-yellow-300 transition-colors font-medium">SCIENCE</a>
          </nav>

          {/* Logo - Center */}
          <div className="flex-shrink-0 mx-8">
            <h1 className="text-3xl font-bold text-white">alec's</h1>
            <p className="text-xs text-white text-center">ICE CREAM</p>
          </div>

          {/* Icons - Right */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="text-white hover:text-yellow-300 transition-colors">
              <User size={20} />
            </button>
            <button className="text-white hover:text-yellow-300 transition-colors">
              <ShoppingCart size={20} />
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-yellow-300"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-blue-600 border-t border-blue-500">
              <a href="/" className="block px-3 py-2 text-white hover:text-yellow-300">HOME</a>
              <a href="/culture-cup" className="block px-3 py-2 text-white hover:text-yellow-300">CULTURE CUP</a>
              <a href="/story" className="block px-3 py-2 text-white hover:text-yellow-300">OUR STORY</a>
              <a href="/find-us" className="block px-3 py-2 text-white hover:text-yellow-300">FIND US</a>
              <a href="/shop" className="block px-3 py-2 text-white hover:text-yellow-300">SHOP</a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
