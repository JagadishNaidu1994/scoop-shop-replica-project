
import React from 'react';
import { Button } from '@/components/ui/button';

const CultureCupSection = () => {
  return (
    <>
      {/* Orange promotional banner */}
      <div className="bg-orange-500 text-white text-center py-3 text-sm font-medium">
        New Flavor!! Brown Butter Peach Cobbler LEARN MORE
      </div>
      
      {/* Main hero section with brown background */}
      <section className="bg-amber-900 relative overflow-hidden min-h-screen">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[600px]">
            {/* Left side - Text content */}
            <div className="text-left space-y-6">
              {/* Yellow "NEW LINE!!" badge */}
              <div className="inline-block bg-yellow-400 text-black px-4 py-2 font-bold text-sm rounded">
                NEW LINE!!
              </div>
              
              {/* Main heading */}
              <h1 className="text-white text-6xl md:text-7xl font-bold leading-tight">
                YOUR NEW<br />
                DAILY<br />
                CRAVE!
              </h1>
              
              {/* Description */}
              <p className="text-yellow-200 text-lg leading-relaxed max-w-md">
                Meet our one-of-a-kind anytime treat:<br />
                real, creamy probiotic ice cream under<br />
                a crackable chocolatey dark shell.
              </p>
              
              {/* Learn More button */}
              <Button className="bg-yellow-400 hover:bg-yellow-500 text-black px-8 py-4 rounded text-lg font-bold mt-8">
                LEARN MORE
              </Button>
            </div>

            {/* Right side - Product images */}
            <div className="relative flex items-center justify-center">
              {/* Culture Cup boxes and container */}
              <div className="relative">
                {/* Main Culture Cup box - Madagascar Vanilla Bean */}
                <div className="relative z-10">
                  <img 
                    src="https://images.unsplash.com/photo-1563805042-7684c019e1cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                    alt="Culture Cup Madagascar Vanilla Bean"
                    className="w-80 h-96 object-cover rounded-lg"
                  />
                </div>
                
                {/* Second Culture Cup box - Dark Chocolate Honeycomb */}
                <div className="absolute top-8 right-0 z-20">
                  <img 
                    src="https://images.unsplash.com/photo-1582716401301-b2407dc7563d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
                    alt="Culture Cup Dark Chocolate Honeycomb"
                    className="w-64 h-80 object-cover rounded-lg"
                  />
                </div>
                
                {/* Individual Culture Cup container */}
                <div className="absolute bottom-0 left-16 z-15">
                  <img 
                    src="https://images.unsplash.com/photo-1551024601-bec78aea704b?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
                    alt="Culture Cup Individual Container"
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Blue wave transition */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg viewBox="0 0 1200 120" className="w-full h-20 fill-current text-blue-600">
            <path d="M0,60 C300,0 900,120 1200,60 L1200,120 L0,120 Z"></path>
          </svg>
        </div>
      </section>

      {/* Blue section with "FIRST EVER" text */}
      <section className="bg-blue-600 py-16 relative">
        <div className="container mx-auto px-4 text-center">
          <div className="text-white">
            <div className="flex items-center justify-center space-x-4 text-2xl md:text-3xl font-bold">
              <span className="text-yellow-300">✱</span>
              <span>FIRST EVER</span>
              <span className="text-yellow-300">✱</span>
            </div>
            <div className="mt-4 text-xl md:text-2xl font-semibold">
              A2 + REGENERATIVE
            </div>
            <div className="mt-2 text-3xl md:text-4xl font-bold tracking-wider">
              ORGANIC ICE CREAM
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CultureCupSection;
