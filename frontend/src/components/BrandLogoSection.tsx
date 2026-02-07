
import React from 'react';

const BrandLogoSection = () => {
  return (
    <>
      {/* Blue wavy section leading to logo */}
      <section className="bg-blue-600 relative py-12">
        {/* Wavy top transition */}
        <div className="absolute top-0 left-0 w-full">
          <svg viewBox="0 0 1200 120" className="w-full h-20 fill-current text-gray-100">
            <path d="M0,60 C300,120 600,0 900,60 C1050,90 1150,30 1200,60 L1200,0 L0,0 Z"></path>
          </svg>
        </div>

        <div className="container mx-auto px-4 text-center pt-16">
          <h2 className="text-white text-3xl font-bold mb-8">
            SUPER NATURAL
          </h2>
        </div>
        
        {/* Wavy bottom transition */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg viewBox="0 0 1200 120" className="w-full h-20 fill-current text-blue-800">
            <path d="M0,60 C400,0 800,120 1200,60 L1200,120 L0,120 Z"></path>
          </svg>
        </div>
      </section>

      {/* Large brand logo section */}
      <section className="bg-blue-800 py-32 relative">
        {/* Wavy top transition */}
        <div className="absolute top-0 left-0 w-full">
          <svg viewBox="0 0 1200 120" className="w-full h-20 fill-current text-blue-600">
            <path d="M0,60 C400,120 800,0 1200,60 L1200,0 L0,0 Z"></path>
          </svg>
        </div>

        <div className="container mx-auto px-4 text-center pt-16">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-white text-8xl md:text-9xl font-bold tracking-wider mb-6">
              alec's
            </h1>
            <p className="text-white text-3xl md:text-4xl font-light mt-8 tracking-wider">
              ICE CREAM
            </p>
            <div className="mt-12">
              <div className="w-20 h-20 bg-white rounded-full mx-auto flex items-center justify-center shadow-xl">
                <span className="text-blue-800 text-3xl font-bold">®</span>
              </div>
            </div>
          </div>
        </div>

        {/* Wavy bottom transition */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg viewBox="0 0 1200 120" className="w-full h-20 fill-current text-gray-50">
            <path d="M0,60 C200,0 600,120 900,40 C1050,80 1150,20 1200,80 L1200,120 L0,120 Z"></path>
          </svg>
        </div>
      </section>
    </>
  );
};

export default BrandLogoSection;
