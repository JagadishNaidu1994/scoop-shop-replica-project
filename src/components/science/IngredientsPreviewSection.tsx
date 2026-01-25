
import React from 'react';

const IngredientsPreviewSection = () => {
  return (
    <section className="py-20 bg-white w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-4xl font-bold text-black">What goes into our products?</h2>
              <button className="text-black hover:text-gray-600 font-medium underline">
                View All
              </button>
            </div>
            
            <p className="text-lg text-gray-600 leading-relaxed">
              Every ingredient in our products is carefully selected and rigorously tested. 
              We use only the finest organic mushrooms, sourced from trusted farms and 
              processed using our proprietary extraction methods to ensure maximum potency and purity.
            </p>
          </div>

          {/* Right Image */}
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=600&h=500&fit=crop" 
              alt="Hand holding mushroom coffee cup"
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default IngredientsPreviewSection;
