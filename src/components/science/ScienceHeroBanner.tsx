
import React from 'react';

const ScienceHeroBanner = () => {
  return (
    <section className="py-20 bg-gray-50 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          {/* Left Image */}
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=500&fit=crop" 
              alt="Mushroom close-up"
              className="w-full h-80 object-cover rounded-lg"
            />
          </div>

          {/* Center Content */}
          <div className="text-center space-y-6">
            <h1 className="text-5xl font-bold text-black">Our science</h1>
            <p className="text-lg text-gray-600 max-w-md mx-auto">
              At Nastea Rituals, we’re not here to be another wellness brand. We’re here to set the matcha standard - clean, consistent, and barista-proof.
            </p>
          </div>

          {/* Right Image */}
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=500&fit=crop" 
              alt="Lion's mane mushroom"
              className="w-full h-80 object-cover rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScienceHeroBanner;
