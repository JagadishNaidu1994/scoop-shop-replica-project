import React from 'react';
import { Check } from 'lucide-react';

const SubHeroBanner = () => {
  return (
    <section className="bg-orange-400 py-8 w-full">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
          Heritage Power. Modern Chaos. / Ancient Ingredients. Current Chaos/Obsession
        </h2>
        <p className="text-white text-lg mb-6">
          Shade-grown Japanese matcha, stone-ground for clean caffeine, calm focus, and everyday glow.
        </p>
        <div className="flex flex-wrap justify-center gap-4 max-w-5xl mx-auto">
          <span className="flex items-center gap-2 text-white"><Check className="w-5 h-5 flex-shrink-0" />100% vegan</span>
          <span className="flex items-center gap-2 text-white"><Check className="w-5 h-5 flex-shrink-0" />Formulated in the UK</span>
          <span className="flex items-center gap-2 text-white"><Check className="w-5 h-5 flex-shrink-0" />Certified Organic</span>
          <span className="flex items-center gap-2 text-white"><Check className="w-5 h-5 flex-shrink-0" />Zero Sugar</span>
          <span className="flex items-center gap-2 text-white"><Check className="w-5 h-5 flex-shrink-0" />Non-GMO</span>
        </div>
      </div>
    </section>
  );
};

export default SubHeroBanner;