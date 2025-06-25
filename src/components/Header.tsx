
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-pink-600">Alec's Ice Cream</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a href="/" className="text-gray-700 hover:text-pink-600 transition-colors">Home</a>
            <a href="/flavors" className="text-gray-700 hover:text-pink-600 transition-colors">Flavors</a>
            <a href="/locations" className="text-gray-700 hover:text-pink-600 transition-colors">Locations</a>
            <a href="/about" className="text-gray-700 hover:text-pink-600 transition-colors">About</a>
            <a href="/contact" className="text-gray-700 hover:text-pink-600 transition-colors">Contact</a>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-pink-600"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              <a href="/" className="block px-3 py-2 text-gray-700 hover:text-pink-600">Home</a>
              <a href="/flavors" className="block px-3 py-2 text-gray-700 hover:text-pink-600">Flavors</a>
              <a href="/locations" className="block px-3 py-2 text-gray-700 hover:text-pink-600">Locations</a>
              <a href="/about" className="block px-3 py-2 text-gray-700 hover:text-pink-600">About</a>
              <a href="/contact" className="block px-3 py-2 text-gray-700 hover:text-pink-600">Contact</a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
