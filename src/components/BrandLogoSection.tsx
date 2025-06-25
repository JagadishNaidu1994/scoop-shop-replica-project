
import React from 'react';

const BrandLogoSection = () => {
  return (
    <>
      {/* Blue wavy section leading to logo */}
      <section className="bg-blue-600 relative py-8">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-white text-2xl font-bold mb-4">
            SUPER NATURAL
          </h2>
        </div>
        
        {/* Wave effect */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg viewBox="0 0 1200 120" className="w-full h-12 fill-current text-blue-800">
            <path d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z"></path>
          </svg>
        </div>
      </section>

      {/* Large brand logo section */}
      <section className="bg-blue-800 py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-white text-8xl md:text-9xl font-bold tracking-wider">
              alec's
            </h1>
            <p className="text-white text-2xl md:text-3xl font-light mt-4 tracking-wider">
              ICE CREAM
            </p>
            <div className="mt-8">
              <div className="w-16 h-16 bg-white rounded-full mx-auto flex items-center justify-center">
                <span className="text-blue-800 text-2xl">®</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BrandLogoSection;
