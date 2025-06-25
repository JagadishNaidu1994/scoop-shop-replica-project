
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-blue-700 shadow-sm fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-white">alec's</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a href="/" className="text-white hover:text-yellow-300 transition-colors">Home</a>
            <a href="/products" className="text-white hover:text-yellow-300 transition-colors">Products</a>
            <a href="/culture-cup" className="text-white hover:text-yellow-300 transition-colors">Culture Cup</a>
            <a href="/stores" className="text-white hover:text-yellow-300 transition-colors">Find Stores</a>
            <a href="/about" className="text-white hover:text-yellow-300 transition-colors">About</a>
            <a href="/contact" className="text-white hover:text-yellow-300 transition-colors">Contact</a>
          </nav>

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
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-blue-700 border-t border-blue-600">
              <a href="/" className="block px-3 py-2 text-white hover:text-yellow-300">Home</a>
              <a href="/products" className="block px-3 py-2 text-white hover:text-yellow-300">Products</a>
              <a href="/culture-cup" className="block px-3 py-2 text-white hover:text-yellow-300">Culture Cup</a>
              <a href="/stores" className="block px-3 py-2 text-white hover:text-yellow-300">Find Stores</a>
              <a href="/about" className="block px-3 py-2 text-white hover:text-yellow-300">About</a>
              <a href="/contact" className="block px-3 py-2 text-white hover:text-yellow-300">Contact</a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
