import React from 'react';

const ScienceHeroBanner = () => {
  return (
    <section className="py-20 bg-gray-50 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Column: Image and Mission */}
          <div className="space-y-8">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=500&fit=crop" 
                alt="Mushroom close-up"
                className="w-full h-80 object-cover rounded-lg"
              />
            </div>
            <div className="text-left">
              <h2 className="text-2xl font-bold text-black">Mission:</h2>
              <p className="text-lg text-gray-600">
                To deliver premium, organic matcha that energises, empowers, and elevates the everyday lives of a new generation. Through bold flavors, cheeky vibes, we’re here to make a ritual that’s as fun as it is healthy.
              </p>
            </div>
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
