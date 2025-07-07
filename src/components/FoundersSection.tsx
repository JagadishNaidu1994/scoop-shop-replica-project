
import React from 'react';
import { Button } from '@/components/ui/button';

const FoundersSection = () => {
  return (
    <section className="py-20 bg-gray-50 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Image */}
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
              alt="Two founders with NASTEA products"
              className="w-full h-auto rounded-lg"
            />
          </div>

          {/* Right Content */}
          <div className="space-y-8">
            <h2 className="text-4xl font-bold text-black">Founded by two brothers on a mission</h2>
            
            <p className="text-lg text-gray-600 leading-relaxed">
              After years of relying on coffee and energy drinks, we discovered the power of functional mushrooms. 
              We started NASTEA to share these incredible adaptogens with the world, creating blends that deliver 
              real results without the crash.
            </p>
            
            <p className="text-lg text-gray-600 leading-relaxed">
              Every product is crafted with the highest quality ingredients, rigorously tested, and designed to 
              support your daily wellness journey. This is more than just another health drink – it's a commitment 
              to your wellbeing.
            </p>
            
            <Button className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition-colors">
              Our Story
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FoundersSection;
