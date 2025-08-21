
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
        
        <div className="relative overflow-hidden">
          {/* Left fade gradient */}
          <div className="absolute left-0 top-0 w-24 h-full bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
          
          {/* Right fade gradient */}
          <div className="absolute right-0 top-0 w-24 h-full bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
          
          <div className="flex animate-scroll-seamless space-x-12">
            {/* First set of logos */}
            {logos.map((logo, index) => (
              <div key={`first-${index}`} className="flex-shrink-0">
                <span className="text-2xl font-bold text-gray-400 whitespace-nowrap">{logo}</span>
              </div>
            ))}
            {/* Second set for seamless loop */}
            {logos.map((logo, index) => (
              <div key={`second-${index}`} className="flex-shrink-0">
                <span className="text-2xl font-bold text-gray-400 whitespace-nowrap">{logo}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PressFeatures;
