
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Plus, Minus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';

const CartDropdown = () => {
  const { items, updateQuantity, removeFromCart, getTotalPrice, getTotalItems } = useCart();

  if (items.length === 0) {
    return (
      <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 max-w-[calc(100vw-2rem)] bg-white border border-gray-200 rounded-lg shadow-lg p-4 sm:p-8 z-50 mx-2 sm:mx-0">
        <div className="text-center">
          <h3 className="text-xl sm:text-2xl font-bold text-black mb-2">Your cart is empty</h3>
          <p className="text-gray-500 mb-4 sm:mb-6 text-sm sm:text-base">Add some products to get started</p>
          <Link to="/shop">
            <Button className="bg-black text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full hover:bg-gray-800 text-sm sm:text-base">
              CONTINUE SHOPPING
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 max-w-[calc(100vw-2rem)] bg-white border border-gray-200 rounded-lg shadow-lg z-50 mx-2 sm:mx-0">
      <div className="p-3 sm:p-4 border-b border-gray-200">
        <h3 className="font-semibold text-base sm:text-lg">Shopping Cart ({getTotalItems()} items)</h3>
      </div>
      
      <div className="max-h-60 sm:max-h-80 overflow-y-auto">
        {items.map((item) => (
          <div key={item.id} className="p-3 sm:p-4 border-b border-gray-100 flex items-center space-x-3 sm:space-x-4">
            <img 
              src={item.product_image || "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=60&h=60&fit=crop"} 
              alt={item.product_name}
              className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-xs sm:text-sm truncate">{item.product_name}</h4>
              <p className="text-gray-600 text-xs sm:text-sm">₹{item.product_price}</p>
              <div className="flex items-center space-x-2 mt-2">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 flex-shrink-0"
                >
                  <Minus size={10} />
                </button>
                <span className="text-xs sm:text-sm font-medium min-w-[1rem] text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 flex-shrink-0"
                >
                  <Plus size={10} />
                </button>
              </div>
            </div>
            <button
              onClick={() => removeFromCart(item.id)}
              className="text-gray-400 hover:text-red-500 flex-shrink-0"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
      
      <div className="p-3 sm:p-4 border-t border-gray-200">
        <div className="flex justify-between items-center mb-3 sm:mb-4">
          <span className="font-semibold text-sm sm:text-base">Total: ₹{getTotalPrice().toFixed(2)}</span>
        </div>
        <div className="space-y-2">
          <Link to="/checkout" className="w-full">
            <Button className="w-full bg-black text-white hover:bg-gray-800 text-sm sm:text-base py-2">
              Checkout
            </Button>
          </Link>
          <Link to="/shop" className="w-full">
            <Button variant="outline" className="w-full text-sm sm:text-base py-2">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartDropdown;
