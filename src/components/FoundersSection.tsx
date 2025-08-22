
import React from 'react';
import { Button } from '@/components/ui/button';

const FoundersSection = () => {
  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Meet Our Founders</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover the passionate team behind NASTEA and our mission to bring you the finest functional mushrooms and adaptogens.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold">Our Story</h3>
            <p className="text-gray-600 leading-relaxed">
              Founded with a passion for wellness and natural ingredients, NASTEA was born from the belief that everyone deserves access to premium functional beverages that support their daily wellness journey.
            </p>
            <Button className="bg-primary text-white hover:bg-primary/90">
              Learn More About Us
            </Button>
          </div>
          
          <div className="bg-gray-100 rounded-lg p-8 text-center">
            <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4"></div>
            <h4 className="text-xl font-semibold mb-2">Founders</h4>
            <p className="text-gray-600">Coming Soon</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FoundersSection;
