
import React, { useState, useEffect } from 'react';
import { Menu, X, ShoppingCart, User, Settings, Shield } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { supabase } from '@/integrations/supabase/client';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import CartDropdown from './CartDropdown';
import AuthModal from './AuthModal';

const HeaderNavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [firstName, setFirstName] = useState('');
  const { user } = useAuth();
  const { getTotalItems } = useCart();
  const { isAdmin } = useAdminCheck();
  const location = useLocation();
  
  // Check if we're on the account page
  const isAccountPage = location.pathname === '/account';

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    } else {
      setFirstName('');
    }
  }, [user]);

  const fetchUserProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('first_name, full_name')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      const displayName = data?.first_name || data?.full_name?.split(' ')[0] || '';
      setFirstName(displayName);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const handleCartClick = () => {
    setIsCartOpen(!isCartOpen);
  };

  const handleAuthClick = () => {
    if (user) {
      // Navigate to account page
      window.location.href = '/account';
    } else {
      // Open auth modal
      setIsAuthModalOpen(true);
    }
  };

  return (
    <>
      {/* Top promotional banner - fast scrolling on all devices */}
      <div className="bg-gray-100 text-center py-2 text-sm font-medium text-black sticky top-0 z-50 overflow-hidden">
        <div className="whitespace-nowrap animate-[scroll-seamless_6s_linear_infinite] sm:animate-[scroll-seamless_8s_linear_infinite] lg:animate-[scroll-seamless_8s_linear_infinite]">
          <span className="inline-block mx-8">15% OFF EVERY SUBSCRIPTION</span>
          <span className="inline-block mx-2">•</span>
          <span className="inline-block mx-8">10% OFF FIRST ORDER</span>
          <span className="inline-block mx-2">•</span>
          <span className="inline-block mx-8">FREE SHIPPING ON ORDERS ABOVE INR 1000</span>
          <span className="inline-block mx-2">•</span>
          <span className="inline-block mx-8">REFER A FRIEND & GET 150 OFF</span>
          <span className="inline-block mx-2">•</span>
          <span className="inline-block mx-8">15% OFF EVERY SUBSCRIPTION</span>
          <span className="inline-block mx-2">•</span>
          <span className="inline-block mx-8">10% OFF FIRST ORDER</span>
          <span className="inline-block mx-2">•</span>
          <span className="inline-block mx-8">FREE SHIPPING ON ORDERS ABOVE INR 1000</span>
          <span className="inline-block mx-2">•</span>
          <span className="inline-block mx-8">REFER A FRIEND & GET 150 OFF</span>
        </div>
      </div>
      
      {/* Main header */}
      <header className="bg-white shadow-sm sticky top-8 z-40 border-b border-gray-100">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Mobile menu button - Left */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-black hover:text-gray-600 rounded-full p-2 hover:bg-gray-100 transition-colors"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {/* Logo - Center on mobile, Left on desktop */}
            <div className="flex-shrink-0 md:order-first order-2">
              <Link to="/">
                <h1 className="text-2xl font-bold text-black">NASTEA</h1>
              </Link>
            </div>

            {/* Desktop Navigation - Center */}
            <nav className="hidden md:flex space-x-8">
              <Link to="/recipes" className="text-black hover:text-gray-600 transition-colors font-medium">
                RECIPES
              </Link>
              <Link to="/journal" className="text-black hover:text-gray-600 transition-colors font-medium">
                JOURNAL
              </Link>
              <Link to="/science" className="text-black hover:text-gray-600 transition-colors font-medium">
                SCIENCE
              </Link>
              <Link to="/our-story" className="text-black hover:text-gray-600 transition-colors font-medium">
                OUR STORY
              </Link>
              <Link to="/wholesale" className="text-black hover:text-gray-600 transition-colors font-medium">
                WHOLESALE
              </Link>
              <Link to="/refer-friend" className="text-black hover:text-gray-600 transition-colors font-medium">
                REFER A FRIEND
              </Link>
            </nav>

            {/* Right side icons */}
            <div className="flex items-center space-x-4 md:order-last order-3">
              {/* Desktop actions */}
              <div className="hidden md:flex items-center space-x-4">
                <Link to="/shop">
                  <button className="bg-black text-white px-6 py-2 rounded-full font-medium hover:bg-gray-800 transition-colors">
                    SHOP NASTEA
                  </button>
                </Link>
                
                {/* Hide greeting on account page */}
                {user && firstName && !isAccountPage && (
                  <span className="text-black font-medium">
                    Hi, {firstName}
                  </span>
                )}
                
                {/* Admin Icon */}
                {isAdmin && (
                  <Link 
                    to="/admin/dashboard" 
                    className="text-black hover:text-gray-600 transition-colors rounded-full p-2 hover:bg-gray-100"
                    title="Admin Dashboard"
                  >
                    <Shield size={24} />
                  </Link>
                )}
                
                {/* Account Icon */}
                <button 
                  onClick={handleAuthClick}
                  className="text-black hover:text-gray-600 transition-colors rounded-full p-2 hover:bg-gray-100"
                  title={user ? "Account" : "Sign In"}
                >
                  <User size={24} />
                </button>
              </div>

              {/* Mobile account and admin icons */}
              <div className="md:hidden flex items-center space-x-2">
                {/* Admin Icon for mobile */}
                {isAdmin && (
                  <Link 
                    to="/admin/dashboard" 
                    className="text-black hover:text-gray-600 transition-colors rounded-full p-2 hover:bg-gray-100"
                    title="Admin Dashboard"
                  >
                    <Shield size={24} />
                  </Link>
                )}
                
                {/* Account Icon for mobile */}
                <button 
                  onClick={handleAuthClick}
                  className="text-black hover:text-gray-600 transition-colors rounded-full p-2 hover:bg-gray-100"
                >
                  <User size={24} />
                </button>
              </div>
              
              {/* Cart with dropdown */}
              <div className="relative">
                <button 
                  className="text-black hover:text-gray-600 transition-colors flex items-center space-x-1 rounded-full p-2 hover:bg-gray-100"
                  onClick={handleCartClick}
                  title="Shopping Cart"
                >
                  <ShoppingCart size={24} />
                  {getTotalItems() > 0 && (
                    <span className="bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center absolute -top-1 -right-1">
                      {getTotalItems()}
                    </span>
                  )}
                </button>
                
                {isCartOpen && (
                  <div className="relative">
                    <CartDropdown />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMenuOpen && (
            <div className="md:hidden fixed inset-0 top-24 bg-white z-50">
              <div className="flex flex-col h-full">
                {/* Close button */}
                <div className="flex justify-end p-4">
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="text-black hover:text-gray-600 rounded-full p-2 hover:bg-gray-100"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Menu items */}
                <div className="flex-1 px-6 py-4 space-y-6">
                  <div className="space-y-4">
                    <Link to="/shop" className="block text-lg font-medium text-black hover:text-gray-600 border-b border-gray-200 pb-2">
                      SHOP NASTEA
                    </Link>
                    
                    <div className="space-y-4">
                      <Link to="/recipes" className="block text-lg font-medium text-black hover:text-gray-600 border-b border-gray-200 pb-2">
                        RECIPES
                      </Link>
                      
                      <Link to="/journal" className="block text-lg font-medium text-black hover:text-gray-600 border-b border-gray-200 pb-2">
                        JOURNAL
                      </Link>
                                         
                      <Link to="/science" className="block text-lg font-medium text-black hover:text-gray-600 border-b border-gray-200 pb-2">
                        SCIENCE
                      </Link>
                      
                      <Link to="/our-story" className="block text-lg font-medium text-black hover:text-gray-600 border-b border-gray-200 pb-2">
                        OUR STORY
                      </Link>
                      
                      <Link to="/wholesale" className="block text-lg font-medium text-black hover:text-gray-600 border-b border-gray-200 pb-2">
                        WHOLESALE
                      </Link>
                      
                      <Link to="/refer-friend" className="block text-lg font-medium text-black hover:text-gray-600 border-b border-gray-200 pb-2">
                        REFER A FRIEND
                      </Link>
                    </div>

                    {/* Bottom section */}
                    <div className="mt-8 pt-8 border-t border-gray-200 space-y-4">
                      {/* Admin Dashboard link for mobile */}
                      {isAdmin && (
                        <Link 
                          to="/admin/dashboard" 
                          className="flex items-center gap-2 text-base text-gray-600 hover:text-black"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <Shield size={20} />
                          Admin Dashboard
                        </Link>
                      )}
                      
                      {!user && (
                        <button 
                          onClick={() => setIsAuthModalOpen(true)}
                          className="block text-base text-gray-600 hover:text-black"
                        >
                          Log in
                        </button>
                      )}
                      
                      <Link to="/account" className="block text-base text-gray-600 hover:text-black">
                        Rewards
                      </Link>
                      
                      <Link to="/faq" className="block text-base text-gray-600 hover:text-black">
                        FAQs
                      </Link>
                      
                      <Link to="/contact" className="block text-base text-gray-600 hover:text-black">
                        Contact Us
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </>
  );
};

export default HeaderNavBar;
