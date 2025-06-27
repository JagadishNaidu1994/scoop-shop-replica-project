
import React from 'react';

const PressFeatures = () => {
  const logos = [
    'VOGUE', 'GQ', 'GLAMOUR', 'HARPER\'S BAZAAR', 'WOMEN\'S HEALTH', 
    'MEN\'S HEALTH', 'ELLE', 'COSMOPOLITAN'
  ];

  return (
    <section className="py-16 bg-white border-y border-gray-100 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-black mb-4">Loved by one million people worldwide</h2>
          <div className="flex justify-center">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-yellow-400 text-2xl">★</span>
            ))}
          </div>
        </div>
        
        <div className="overflow-hidden">
          <div className="flex animate-scroll-left space-x-12">
            {[...logos, ...logos].map((logo, index) => (
              <div key={index} className="flex-shrink-0">
                <span className="text-2xl font-bold text-gray-400">{logo}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PressFeatures;
