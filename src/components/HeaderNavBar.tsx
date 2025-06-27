import React, { useState, useEffect } from 'react';
import { Menu, X, ShoppingCart, User, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { supabase } from '@/integrations/supabase/client';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import CartDropdown from './CartDropdown';

const HeaderNavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [firstName, setFirstName] = useState('');
  const { user } = useAuth();
  const { getTotalItems } = useCart();
  const { isAdmin } = useAdminCheck();

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

      // Use first_name if available, otherwise extract from full_name
      const displayName = data?.first_name || data?.full_name?.split(' ')[0] || '';
      setFirstName(displayName);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  return (
    <>
      {/* Top promotional banner - now sticky */}
      <div className="bg-gray-100 text-center py-2 text-sm font-medium text-black sticky top-0 z-50">
        20% OFF EVERY SUBSCRIPTION ORDER
      </div>
      
      {/* Main header - now sticky positioned below the banner */}
      <header className="bg-white shadow-sm sticky top-8 z-40 border-b border-gray-100">
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
              <Link to="/recipes" className="text-black hover:text-gray-600 transition-colors font-medium">
                RECIPES
              </Link>
              <Link to="/journal" className="text-black hover:text-gray-600 transition-colors font-medium">
                JOURNAL
              </Link>
              <Link to="/science" className="text-black hover:text-gray-600 transition-colors font-medium">
                SCIENCE
              </Link>
              <Link to="/story" className="text-black hover:text-gray-600 transition-colors font-medium">
                OUR STORY
              </Link>
              <Link to="/wholesale" className="text-black hover:text-gray-600 transition-colors font-medium">
                WHOLESALE
              </Link>
              <Link to="/refer" className="text-black hover:text-gray-600 transition-colors font-medium">
                REFER A FRIEND
              </Link>
            </nav>

            {/* Action buttons - Right */}
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/shop">
                <button className="bg-black text-white px-6 py-2 rounded-full font-medium hover:bg-gray-800 transition-colors">
                  SHOP DIRTEA
                </button>
              </Link>
              
              {/* Show user's first name if logged in */}
              {user && firstName && (
                <span className="text-black font-medium">
                  Hi, {firstName}
                </span>
              )}
              
              {/* Admin Panel Button - Only visible for admins */}
              {isAdmin && (
                <div className="relative group">
                  <button className="text-black hover:text-gray-600 transition-colors font-medium flex items-center space-x-1">
                    <Settings className="h-4 w-4" />
                    <span>ADMIN</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <Link to="/admin/recipes" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Manage Recipes
                    </Link>
                    <Link to="/admin/products" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Manage Products
                    </Link>
                    <Link to="/admin/journals" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Manage Journals
                    </Link>
                  </div>
                </div>
              )}
              
              {user ? (
                <Link to="/account" className="text-black hover:text-gray-600 transition-colors font-medium">
                  ACCOUNT
                </Link>
              ) : (
                <Link to="/auth" className="text-black hover:text-gray-600 transition-colors font-medium">
                  ACCOUNT
                </Link>
              )}
              
              {/* Cart with dropdown */}
              <div className="relative">
                <button 
                  className="text-black hover:text-gray-600 transition-colors font-medium flex items-center space-x-1"
                  onMouseEnter={() => setIsCartOpen(true)}
                  onMouseLeave={() => setIsCartOpen(false)}
                >
                  <span>CART</span>
                  {getTotalItems() > 0 && (
                    <span className="bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {getTotalItems()}
                    </span>
                  )}
                </button>
                
                {isCartOpen && (
                  <div
                    onMouseEnter={() => setIsCartOpen(true)}
                    onMouseLeave={() => setIsCartOpen(false)}
                  >
                    <CartDropdown />
                  </div>
                )}
              </div>
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
                <Link to="/recipes" className="block px-3 py-2 text-black hover:text-gray-600 font-medium">RECIPES</Link>
                <Link to="/journal" className="block px-3 py-2 text-black hover:text-gray-600 font-medium">JOURNAL</Link>
                <Link to="/science" className="block px-3 py-2 text-black hover:text-gray-600 font-medium">SCIENCE</Link>
                <Link to="/story" className="block px-3 py-2 text-black hover:text-gray-600 font-medium">OUR STORY</Link>
                <Link to="/wholesale" className="block px-3 py-2 text-black hover:text-gray-600 font-medium">WHOLESALE</Link>
                <Link to="/refer" className="block px-3 py-2 text-black hover:text-gray-600 font-medium">REFER A FRIEND</Link>
                <div className="px-3 py-2 space-y-2">
                  <Link to="/shop">
                    <button className="w-full bg-black text-white px-6 py-2 rounded-full font-medium">
                      SHOP DIRTEA
                    </button>
                  </Link>
                  <div className="flex flex-col space-y-2">
                    {user && firstName && (
                      <span className="text-black font-medium">Hi, {firstName}</span>
                    )}
                    {isAdmin && (
                      <>
                        <Link to="/admin/recipes" className="text-black font-medium flex items-center space-x-1">
                          <Settings className="h-4 w-4" />
                          <span>ADMIN - RECIPES</span>
                        </Link>
                        <Link to="/admin/products" className="text-black font-medium flex items-center space-x-1">
                          <Settings className="h-4 w-4" />
                          <span>ADMIN - PRODUCTS</span>
                        </Link>
                        <Link to="/admin/journals" className="text-black font-medium flex items-center space-x-1">
                          <Settings className="h-4 w-4" />
                          <span>ADMIN - JOURNALS</span>
                        </Link>
                      </>
                    )}
                    {user ? (
                      <Link to="/account" className="text-black font-medium">ACCOUNT</Link>
                    ) : (
                      <Link to="/auth" className="text-black font-medium">ACCOUNT</Link>
                    )}
                    <Link to="/checkout" className="text-black font-medium flex items-center space-x-1">
                      <span>CART</span>
                      {getTotalItems() > 0 && (
                        <span className="bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {getTotalItems()}
                        </span>
                      )}
                    </Link>
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
