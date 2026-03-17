import React from 'react';

const ScienceHeroBanner = () => {
  return (
    <section className="relative w-full h-[400px] md:h-[500px] overflow-hidden">
      <img 
        src="/lovable-uploads/NDN00951.jpg" 
        alt="Matcha whisk in bowl"
        className="w-full h-full object-cover"
      />

      {/* Centered-right text overlay */}
      <div className="absolute inset-0 flex items-center justify-center px-4">
        <div className="text-center max-w-xl ml-0 md:ml-[10%]">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Our science
          </h1>
          <p className="text-sm md:text-base text-white/90 leading-relaxed">
            At NASTEA, we don't just sell matcha — we deliver the purest, most potent, and most effective functional matcha extracts available.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ScienceHeroBanner;
