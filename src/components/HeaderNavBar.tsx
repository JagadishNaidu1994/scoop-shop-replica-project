
import React, { useState } from 'react';
import { Menu, X, ShoppingCart, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeaderNavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* Top promotional banner */}
      <div className="bg-gray-100 text-center py-2 text-sm font-medium text-black">
        20% OFF EVERY SUBSCRIPTION ORDER
      </div>
      
      {/* Main header */}
      <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo - Left */}
            <div className="flex-shrink-0">
              <Link to="/">
                <h1 className="text-2xl font-bold text-black">DIRTEA</h1>
              </Link>
            </div>

            {/* Desktop Navigation - Center */}
            <nav className="hidden md:flex space-x-8">
              <Link to="/shop" className="text-black hover:text-gray-600 transition-colors font-medium">
                SHOP
              </Link>
              <Link to="/science" className="text-black hover:text-gray-600 transition-colors font-medium">
                SCIENCE
              </Link>
              <Link to="/story" className="text-black hover:text-gray-600 transition-colors font-medium">
                OUR STORY
              </Link>
              <Link to="/refer" className="text-black hover:text-gray-600 transition-colors font-medium">
                REFER A FRIEND
              </Link>
            </nav>

            {/* Action buttons - Right */}
            <div className="hidden md:flex items-center space-x-4">
              <button className="bg-black text-white px-6 py-2 rounded-full font-medium hover:bg-gray-800 transition-colors">
                SHOP DIRTEA
              </button>
              <button className="text-black hover:text-gray-600 transition-colors font-medium">
                ACCOUNT
              </button>
              <button className="text-black hover:text-gray-600 transition-colors font-medium">
                CART
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-black hover:text-gray-600"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-100">
                <Link to="/shop" className="block px-3 py-2 text-black hover:text-gray-600 font-medium">SHOP</Link>
                <Link to="/science" className="block px-3 py-2 text-black hover:text-gray-600 font-medium">SCIENCE</Link>
                <Link to="/story" className="block px-3 py-2 text-black hover:text-gray-600 font-medium">OUR STORY</Link>
                <Link to="/refer" className="block px-3 py-2 text-black hover:text-gray-600 font-medium">REFER A FRIEND</Link>
                <div className="px-3 py-2 space-y-2">
                  <button className="w-full bg-black text-white px-6 py-2 rounded-full font-medium">
                    SHOP DIRTEA
                  </button>
                  <div className="flex space-x-4">
                    <button className="text-black font-medium">ACCOUNT</button>
                    <button className="text-black font-medium">CART</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default HeaderNavBar;
