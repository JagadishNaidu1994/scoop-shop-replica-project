
import React from 'react';

const ScienceStepsGrid = () => {
  const steps = [
    {
      title: "Fruiting body vs. mycelium",
      description: "We use only the fruiting body of mushrooms, not mycelium grown on grain. This ensures maximum potency and bioavailability of active compounds.",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=400&fit=crop",
      reverse: false
    },
    {
      title: "Extraction process",
      description: "Our proprietary dual-extraction method combines both water and alcohol extraction to capture the full spectrum of beneficial compounds from each mushroom.",
      image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=500&h=400&fit=crop",
      reverse: true
    },
    {
      title: "Spray drying",
      description: "We use advanced spray-drying technology to preserve the integrity of heat-sensitive compounds while creating a fine, easily mixable powder.",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=400&fit=crop",
      reverse: false
    },
    {
      title: "Testing",
      description: "Every batch undergoes rigorous third-party testing for purity, potency, heavy metals, pesticides, and microbiological safety.",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=400&fit=crop",
      reverse: true
    },
    {
      title: "Final steps",
      description: "Our finished products are packaged in a controlled environment and undergo final quality checks before reaching you.",
      image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500&h=400&fit=crop",
      reverse: false
    }
  ];

  return (
    <section className="py-20 bg-white w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-black mb-4">Our Scientific Process</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            From cultivation to final product, every step is carefully controlled and scientifically optimized
          </p>
        </div>

        <div className="space-y-20">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center ${
                step.reverse ? 'lg:grid-flow-col-dense' : ''
              }`}
            >
              {/* Content */}
              <div className={`space-y-6 ${step.reverse ? 'lg:col-start-2' : ''}`}>
                <div className="flex items-center space-x-4">
                  <span className="bg-black text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </span>
                  <h3 className="text-2xl font-bold text-black">{step.title}</h3>
                </div>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Image */}
              <div className={`relative ${step.reverse ? 'lg:col-start-1' : ''}`}>
                <img 
                  src={step.image} 
                  alt={step.title}
                  className="w-full h-80 object-cover rounded-lg shadow-lg"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ScienceStepsGrid;
