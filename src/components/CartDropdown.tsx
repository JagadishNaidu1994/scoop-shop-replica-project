
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Plus, Minus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';

const CartDropdown = () => {
  const { items, updateQuantity, removeFromCart, getTotalPrice, getTotalItems } = useCart();

  if (items.length === 0) {
    return (
      <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50">
        <div className="text-center py-8">
          <ShoppingCart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500">Your cart is empty</p>
          <Link to="/shop" className="text-black hover:text-gray-600 font-medium mt-2 inline-block">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute right-0 top-full mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-lg">Shopping Cart ({getTotalItems()} items)</h3>
      </div>
      
      <div className="max-h-80 overflow-y-auto">
        {items.map((item) => (
          <div key={item.id} className="p-4 border-b border-gray-100 flex items-center space-x-4">
            <img 
              src={item.product_image || "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=60&h=60&fit=crop"} 
              alt={item.product_name}
              className="w-16 h-16 object-cover rounded"
            />
            <div className="flex-1">
              <h4 className="font-medium text-sm">{item.product_name}</h4>
              <p className="text-gray-600 text-sm">£{item.product_price}</p>
              <div className="flex items-center space-x-2 mt-2">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                >
                  <Minus size={12} />
                </button>
                <span className="text-sm font-medium">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                >
                  <Plus size={12} />
                </button>
              </div>
            </div>
            <button
              onClick={() => removeFromCart(item.id)}
              className="text-gray-400 hover:text-red-500"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <span className="font-semibold">Total: £{getTotalPrice().toFixed(2)}</span>
        </div>
        <div className="space-y-2">
          <Link to="/checkout" className="w-full">
            <Button className="w-full bg-black text-white hover:bg-gray-800">
              Checkout
            </Button>
          </Link>
          <Link to="/shop" className="w-full">
            <Button variant="outline" className="w-full">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartDropdown;
