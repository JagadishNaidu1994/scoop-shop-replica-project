import React from 'react';
import { Check } from 'lucide-react';

const SubHeroBanner = () => {
  const features = [
    '100% Fruiting Body',
    'Dual Extraction',
    'Third-party Tested',
    'Organic-Certified',
    '100% Vegan',
    'Highest Quality Ingredients',
    'Formulated in the UK'
  ];

  return (
    <section className="bg-orange-400 py-8 w-full">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
          Ancient ingredients for modern wellness
        </h2>

        {/* Features Grid - 4 items per row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center justify-center gap-2 text-white">
              <Check className="w-5 h-5 flex-shrink-0" />
              <span className="text-base font-medium">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SubHeroBanner;