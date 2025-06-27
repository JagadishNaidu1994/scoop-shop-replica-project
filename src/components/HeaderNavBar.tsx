
import React, { useState } from 'react';
import { Menu, X, ShoppingCart, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeaderNavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Left */}
          <div className="flex-shrink-0">
            <Link to="/">
              <h1 className="text-2xl font-bold text-black">DIRTEA</h1>
            </Link>
          </div>

          {/* Desktop Navigation - Center */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/shop" className="text-gray-700 hover:text-black transition-colors font-medium relative group">
              Shop
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/journal" className="text-gray-700 hover:text-black transition-colors font-medium relative group">
              Journal
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-black transition-colors font-medium relative group">
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/science" className="text-gray-700 hover:text-black transition-colors font-medium relative group">
              Science
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </nav>

          {/* Icons - Right */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="text-gray-700 hover:text-black transition-colors">
              <User size={20} />
            </button>
            <button className="text-gray-700 hover:text-black transition-colors relative">
              <ShoppingCart size={20} />
              <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">0</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-black"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-100">
              <Link to="/shop" className="block px-3 py-2 text-gray-700 hover:text-black">Shop</Link>
              <Link to="/journal" className="block px-3 py-2 text-gray-700 hover:text-black">Journal</Link>
              <Link to="/about" className="block px-3 py-2 text-gray-700 hover:text-black">About</Link>
              <Link to="/science" className="block px-3 py-2 text-gray-700 hover:text-black">Science</Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default HeaderNavBar;
