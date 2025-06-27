
import React from 'react';

const ProductShowcaseGrid = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Side - Product Categories */}
          <div className="space-y-12">
            <div className="space-y-4">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">DIRTEA Coffee</p>
              <h3 className="text-2xl font-bold text-black">DIRTEA Matcha</h3>
              <p className="text-gray-600">
                Premium ceremonial grade matcha enhanced with Lion's Mane and Chaga mushrooms for sustained focus and energy.
              </p>
            </div>
            
            <div className="space-y-4">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">DIRTEA Cacao</p>
              <h3 className="text-2xl font-bold text-black">DIRTEA Blends</h3>
              <p className="text-gray-600">
                Functional mushroom blends designed to support your daily wellness routine with adaptogens and superfoods.
              </p>
            </div>
          </div>

          {/* Right Side - Product Image */}
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1544787219-7f47ccb76574?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
              alt="DIRTEA product pouring into cup"
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcaseGrid;
