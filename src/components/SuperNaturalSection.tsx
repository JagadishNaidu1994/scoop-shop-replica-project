
import React from 'react';

const SuperNaturalSection = () => {
  const brandLogos = [
    {
      src: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      alt: "Brand 1",
      name: "TechCorp"
    },
    {
      src: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      alt: "Brand 2",
      name: "CodeFlow"
    },
    {
      src: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      alt: "Brand 3",
      name: "DevTools"
    },
    {
      src: "https://images.unsplash.com/photo-1483058712412-4245e9b90334?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      alt: "Brand 4",
      name: "AppleTech"
    },
    {
      src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      alt: "Brand 5",
      name: "GlassCorp"
    },
    {
      src: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      alt: "Brand 6",
      name: "InnovateLab"
    },
    {
      src: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      alt: "Brand 7",
      name: "DataFlow"
    },
    {
      src: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      alt: "Brand 8",
      name: "CloudSys"
    },
    {
      src: "https://images.unsplash.com/photo-1483058712412-4245e9b90334?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      alt: "Brand 9",
      name: "PixelPro"
    },
    {
      src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      alt: "Brand 10",
      name: "MetaTech"
    }
  ];

  const nutritionalBenefits = [
    {
      icon: "🌱",
      label: "PLANT BASED",
      description: "Made from plants"
    },
    {
      icon: "🥛",
      label: "DAIRY FREE",
      description: "No dairy ingredients"
    },
    {
      icon: "🍯",
      label: "0g SUGAR",
      description: "Zero added sugar"
    },
    {
      icon: "🔢",
      label: "10 CALORIES",
      description: "Low calorie treat"
    },
    {
      icon: "🌾",
      label: "GLUTEN FREE",
      description: "No gluten ingredients"
    },
    {
      icon: "🥑",
      label: "KETO",
      description: "Keto friendly"
    },
    {
      icon: "🧬",
      label: "NON-GMO",
      description: "No GMO ingredients"
    }
  ];

  return (
    <>
      {/* Blue wavy section */}
      <section className="bg-blue-600 relative py-20">
        {/* Wavy top transition */}
        <div className="absolute top-0 left-0 w-full">
          <svg viewBox="0 0 1200 120" className="w-full h-20 fill-current text-yellow-400">
            <path d="M0,60 C300,120 600,0 900,60 C1050,90 1150,30 1200,60 L1200,0 L0,0 Z"></path>
          </svg>
        </div>

        <div className="container mx-auto px-4 text-center pt-16">
          <div className="mb-12">
            <span className="text-white text-lg font-semibold">AS SEEN IN:</span>
            <div className="flex justify-center items-center space-x-12 mt-6 text-white text-lg">
              <span className="font-bold">Forbes</span>
              <span className="font-bold">Prevention</span>
              <span className="font-bold">EatThis.NotThat</span>
            </div>
          </div>

          {/* Nutritional Benefits Icons */}
          <div className="mt-16">
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
              {nutritionalBenefits.map((benefit, index) => (
                <div key={index} className="flex flex-col items-center text-white">
                  <div className="text-4xl mb-2">{benefit.icon}</div>
                  <div className="text-sm font-bold mb-1">{benefit.label}</div>
                  <div className="text-xs text-blue-200">{benefit.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Wavy bottom transition */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg viewBox="0 0 1200 120" className="w-full h-20 fill-current text-gray-100">
            <path d="M0,60 C400,0 800,120 1200,60 L1200,120 L0,120 Z"></path>
          </svg>
        </div>
      </section>

      {/* Light section with Super Natural branding */}
      <section className="bg-gray-100 py-20 relative">
        {/* Wavy top transition */}
        <div className="absolute top-0 left-0 w-full">
          <svg viewBox="0 0 1200 120" className="w-full h-20 fill-current text-blue-600">
            <path d="M0,60 C400,120 800,0 1200,60 L1200,0 L0,0 Z"></path>
          </svg>
        </div>

        <div className="container mx-auto px-4 text-center pt-16">
          <div className="mb-16">
            <h2 className="text-5xl font-bold text-blue-600 mb-8">
              SUPER NATURAL
            </h2>
            <div className="flex justify-center mb-12">
              <img 
                src="https://images.unsplash.com/photo-1563805042-7684c019e1cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
                alt="Ice cream cone illustration"
                className="w-32 h-32 rounded-full shadow-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🌱</span>
              </div>
              <h3 className="font-bold text-xl mb-4">100% Organic</h3>
              <p className="text-gray-600 text-lg">Made with certified organic ingredients</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🔄</span>
              </div>
              <h3 className="font-bold text-xl mb-4">Regenerative</h3>
              <p className="text-gray-600 text-lg">Supporting sustainable farming practices</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">💫</span>
              </div>
              <h3 className="font-bold text-xl mb-4">Probiotic</h3>
              <p className="text-gray-600 text-lg">Good for your gut health</p>
            </div>
          </div>
        </div>

        {/* Wavy bottom transition */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg viewBox="0 0 1200 120" className="w-full h-20 fill-current text-orange-400">
            <path d="M0,60 C300,120 600,0 900,80 C1050,40 1150,100 1200,60 L1200,120 L0,120 Z"></path>
          </svg>
        </div>
      </section>

      {/* Orange/Red section */}
      <section className="bg-gradient-to-r from-orange-400 to-red-500 py-20 relative">
        {/* Wavy top transition */}
        <div className="absolute top-0 left-0 w-full">
          <svg viewBox="0 0 1200 120" className="w-full h-20 fill-current text-gray-100">
            <path d="M0,60 C300,0 600,120 900,40 C1050,80 1150,20 1200,60 L1200,0 L0,0 Z"></path>
          </svg>
        </div>

        <div className="container mx-auto px-4 pt-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="text-center lg:text-left">
              <img 
                src="https://images.unsplash.com/photo-1551024601-bec78aea704b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                alt="Ice cream scoop"
                className="w-full max-w-lg mx-auto lg:mx-0 rounded-3xl shadow-2xl"
              />
            </div>
            <div className="text-white text-center lg:text-left">
              <h2 className="text-5xl font-bold mb-8 leading-tight">
                PREMIUM QUALITY<br />
                NATURAL INGREDIENTS
              </h2>
              <p className="text-xl mb-10 leading-relaxed">
                Every scoop is crafted with care using the finest organic ingredients
              </p>
              <button className="bg-white text-orange-500 px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg">
                SHOP NOW
              </button>
            </div>
          </div>
        </div>

        {/* Wavy bottom transition */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg viewBox="0 0 1200 120" className="w-full h-20 fill-current text-gray-100">
            <path d="M0,60 C200,0 400,120 600,40 C800,100 1000,20 1200,80 L1200,120 L0,120 Z"></path>
          </svg>
        </div>
      </section>

      {/* Scrolling brand logos section */}
      <section className="bg-gray-100 py-16 overflow-hidden relative">
        {/* Wavy top transition */}
        <div className="absolute top-0 left-0 w-full">
          <svg viewBox="0 0 1200 120" className="w-full h-20 fill-current text-red-500">
            <path d="M0,60 C200,120 400,0 600,80 C800,20 1000,100 1200,40 L1200,0 L0,0 Z"></path>
          </svg>
        </div>

        <div className="container mx-auto px-4 text-center mb-12 pt-16">
          <h3 className="text-2xl font-bold">TRUSTED BY LEADING BRANDS</h3>
        </div>
        
        <div className="relative">
          <div className="flex animate-scroll-left space-x-12">
            {/* First set of logos */}
            {brandLogos.map((brand, index) => (
              <div
                key={`first-${index}`}
                className="flex-shrink-0 w-32 h-20 bg-white rounded-xl shadow-lg flex items-center justify-center p-4 hover:shadow-xl transition-shadow"
              >
                <img
                  src={brand.src}
                  alt={brand.alt}
                  className="max-w-full max-h-full object-contain grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>
            ))}
            {/* Duplicate set for seamless loop */}
            {brandLogos.map((brand, index) => (
              <div
                key={`second-${index}`}
                className="flex-shrink-0 w-32 h-20 bg-white rounded-xl shadow-lg flex items-center justify-center p-4 hover:shadow-xl transition-shadow"
              >
                <img
                  src={brand.src}
                  alt={brand.alt}
                  className="max-w-full max-h-full object-contain grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Wavy bottom transition */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg viewBox="0 0 1200 120" className="w-full h-20 fill-current text-blue-600">
            <path d="M0,60 C300,0 600,120 900,60 C1050,30 1150,90 1200,60 L1200,120 L0,120 Z"></path>
          </svg>
        </div>
      </section>
    </>
  );
};

export default SuperNaturalSection;
