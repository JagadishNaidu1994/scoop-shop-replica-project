
import React from 'react';
import { MapPin, Leaf, ShieldCheck, BarChart3, Sprout } from 'lucide-react';

const WhyNasteaSection = () => {
  const features = [
    {
      icon: <MapPin className="w-10 h-10 text-white" />,
      title: "Single-origin Kagoshima, Japan",
      description: "Kagoshima is Japan's second-largest tea region and the #1 leader in organic cultivation thanks to its isolated, pristine environment. Its mineral-rich volcanic soil and humid, misty climate help produce a naturally sweeter, more vibrant leaf."
    },
    {
      icon: <Leaf className="w-10 h-10 text-white" />,
      title: "Farm-to-Whisk freshness",
      description: "We cut out the middlemen common in India and source directly from heritage farmers—so our matcha doesn't sit for months in hot warehouses. You get maximum freshness and potency."
    },
    {
      icon: <ShieldCheck className="w-10 h-10 text-white" />,
      title: "JAS-certified organic (the real kind)",
      description: "In an unregulated market, \"organic\" can be a buzzword. We carry JAS (Japanese Agricultural Standard) certification—strictly audited and verified free from synthetic fertilisers, pesticides, and chemical contaminants."
    },
    {
      icon: <BarChart3 className="w-10 h-10 text-white" />,
      title: "Consistency, not batch roulette",
      description: "Matcha in India often varies pouch to pouch. We use professional Tea Sommeliers to grade every harvest, ensuring the same electric emerald colour and silky umami finish every time."
    },
    {
      icon: <Sprout className="w-10 h-10 text-white" />,
      title: "Ichibancha (First Flush) only",
      description: "We use early-spring first flush leaves—the first buds after winter dormancy—naturally sweet and creamy, and up to 3x higher in amino acids than summer-harvested tea."
    }
  ];

  return (
    <section className="py-20 bg-[#0a1628] w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white">What makes Nastea Rituals different?</h2>
        </div>
        
        {/* Top row - 3 items */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          {features.slice(0, 3).map((feature, index) => (
            <div 
              key={index} 
              className="text-center space-y-4"
            >
              <div className="flex justify-center mb-2">
                {feature.icon}
              </div>
              <p className="text-base text-gray-300 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom row - 2 items centered */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          {features.slice(3).map((feature, index) => (
            <div 
              key={index + 3} 
              className="text-center space-y-4"
            >
              <div className="flex justify-center mb-2">
                {feature.icon}
              </div>
              <p className="text-base text-gray-300 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyNasteaSection;
