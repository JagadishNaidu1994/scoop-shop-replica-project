import React from 'react';

const ScienceHeroBanner = () => {
  return (
    <div>
      {/* Full-width hero image */}
      <section className="relative w-full h-[400px] md:h-[500px] overflow-hidden">
        <img 
          src="/lovable-uploads/NDN00951.jpg" 
          alt="Matcha whisk in bowl"
          className="w-full h-full object-cover"
        />
      </section>

      {/* Text section below image */}
      <section className="bg-background py-16 md:py-24 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Our science
          </h1>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            At NASTEA, we don't just sell matcha — we deliver the purest, most potent, and most effective functional matcha extracts available.
          </p>
        </div>
      </section>
    </div>
  );
};

export default ScienceHeroBanner;
