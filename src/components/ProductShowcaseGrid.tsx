
import React from 'react';

const ProductShowcaseGrid = () => {
  return (
    <section className="py-20 bg-white w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
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
              src="https://drive.google.com/file/d/1XEcAuEs6XEUXna5LeJSoWJBUXRGjNit" 
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
