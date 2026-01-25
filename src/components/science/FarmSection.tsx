
import React from 'react';

const FarmSection = () => {
  return (
    <section className="py-20 w-full">
      <div className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
          {/* Left Image */}
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1472396961693-142e6e269027?w=800&h=600&fit=crop" 
              alt="Green mountains and forest"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right Content */}
          <div className="bg-white flex items-center">
            <div className="px-8 lg:px-16 py-12 space-y-6">
              <h2 className="text-4xl font-bold text-black leading-tight">
                Our mushrooms farm
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                All our mushrooms are grown on wood, not grain. This traditional method 
                ensures that our mushrooms develop their full spectrum of beneficial compounds, 
                just as they would in their natural forest environment.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                We partner with certified organic farms that share our commitment to 
                sustainable practices and quality. Each farm is carefully selected and 
                regularly audited to ensure they meet our stringent standards for 
                cultivation and harvesting.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                From forest to cup, we maintain complete traceability of every batch, 
                ensuring you receive the purest, most potent mushroom supplements available.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FarmSection;
