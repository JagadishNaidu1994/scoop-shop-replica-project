
import React from 'react';

const SuperNaturalSection = () => {
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

      {/* Retail partners section */}
      <section className="bg-gray-100 py-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-lg font-bold mb-6">FIND ALEC'S ICE CREAM AT A STORE NEAR YOU</h3>
          <div className="flex justify-center items-center space-x-8 text-gray-600">
            <span className="bg-green-600 text-white px-4 py-2 rounded">WHOLE FOODS</span>
            <span className="bg-blue-600 text-white px-4 py-2 rounded">GELSON'S</span>
            <span className="bg-green-700 text-white px-4 py-2 rounded">SPROUTS</span>
          </div>
        </div>
      </section>
    </>
  );
};

export default SuperNaturalSection;
