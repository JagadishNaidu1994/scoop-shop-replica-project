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

  return (
    <>
      {/* Blue wavy section */}
      <section className="bg-blue-600 relative py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-8">
            <span className="text-white text-sm">AS SEEN IN:</span>
            <div className="flex justify-center items-center space-x-8 mt-4 text-white">
              <span>Forbes</span>
              <span>Prevention</span>
              <span>EatThis.NotThat</span>
            </div>
          </div>
        </div>
        
        {/* Wave effect */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg viewBox="0 0 1200 120" className="w-full h-12 fill-current text-gray-100">
            <path d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z"></path>
          </svg>
        </div>
      </section>

      {/* Light section with Super Natural branding */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-12">
            <h2 className="text-4xl font-bold text-blue-600 mb-4">
              SUPER NATURAL
            </h2>
            <div className="flex justify-center mb-8">
              <img 
                src="https://images.unsplash.com/photo-1563805042-7684c019e1cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
                alt="Ice cream cone illustration"
                className="w-24 h-24"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌱</span>
              </div>
              <h3 className="font-bold text-lg mb-2">100% Organic</h3>
              <p className="text-gray-600">Made with certified organic ingredients</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔄</span>
              </div>
              <h3 className="font-bold text-lg mb-2">Regenerative</h3>
              <p className="text-gray-600">Supporting sustainable farming practices</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💫</span>
              </div>
              <h3 className="font-bold text-lg mb-2">Probiotic</h3>
              <p className="text-gray-600">Good for your gut health</p>
            </div>
          </div>
        </div>
      </section>

      {/* Orange/Red section */}
      <section className="bg-gradient-to-r from-orange-400 to-red-500 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <img 
                src="https://images.unsplash.com/photo-1551024601-bec78aea704b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                alt="Ice cream scoop"
                className="w-full max-w-md mx-auto lg:mx-0"
              />
            </div>
            <div className="text-white text-center lg:text-left">
              <h2 className="text-4xl font-bold mb-6">
                PREMIUM QUALITY<br />
                NATURAL INGREDIENTS
              </h2>
              <p className="text-xl mb-8">
                Every scoop is crafted with care using the finest organic ingredients
              </p>
              <button className="bg-white text-orange-500 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors">
                SHOP NOW
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Scrolling brand logos section */}
      <section className="bg-gray-100 py-12 overflow-hidden">
        <div className="container mx-auto px-4 text-center mb-8">
          <h3 className="text-lg font-bold">TRUSTED BY LEADING BRANDS</h3>
        </div>
        
        <div className="relative">
          <div className="flex animate-scroll-left space-x-12">
            {/* First set of logos */}
            {brandLogos.map((brand, index) => (
              <div
                key={`first-${index}`}
                className="flex-shrink-0 w-32 h-20 bg-white rounded-lg shadow-md flex items-center justify-center p-4 hover:shadow-lg transition-shadow"
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
                className="flex-shrink-0 w-32 h-20 bg-white rounded-lg shadow-md flex items-center justify-center p-4 hover:shadow-lg transition-shadow"
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
      </section>
    </>
  );
};

export default SuperNaturalSection;
