import React from 'react';

const ScienceHeroBanner = () => {
  return (
    <section className="relative w-full h-[500px] md:h-[600px] overflow-hidden">
      {/* Background Image - Full Width */}
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1578662896442-48f60103fc96?w=2000&h=800&fit=crop" 
          alt="Mushroom science background"
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Optional subtle overlay for better text readability */}
      <div className="absolute inset-0 bg-white/10"></div>
      
      {/* Centered Text Overlay */}
      <div className="relative z-10 flex items-center justify-center h-full px-4">
        <div className="text-center max-w-4xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Our science
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-gray-800 leading-relaxed">
At Nastea Rituals, we’re not here to be another wellness brand. We’re here to set the matcha standard - clean, consistent, and barista-proof.          </p>
        </div>
      </div>
    </section>
  );
};

export default ScienceHeroBanner;
