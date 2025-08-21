
import React from 'react';
import { Beaker, TestTube, Microscope } from 'lucide-react';

const WhyDirteaSection = () => {
  const features = [
    {
      icon: <Beaker className="w-12 h-12 text-white" />,
      title: "Third-party tested",
      description: "Every batch is independently tested for purity, potency, and safety by certified laboratories."
    },
    {
      icon: <TestTube className="w-12 h-12 text-white" />,
      title: "Clinically studied",
      description: "Our mushroom extracts are backed by peer-reviewed research and clinical studies."
    },
    {
      icon: <Microscope className="w-12 h-12 text-white" />,
      title: "Maximum bioavailability",
      description: "Our proprietary extraction process ensures optimal absorption and effectiveness."
    }
  ];

  return (
    <section className="py-20 bg-blue-900 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">What makes NASTEA the best?</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="text-center space-y-6 animate-fade-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="flex justify-center">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-white">{feature.title}</h3>
              <p className="text-lg text-blue-100 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyDirteaSection;
