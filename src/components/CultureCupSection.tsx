
import React from 'react';
import { Button } from '@/components/ui/button';

const CultureCupSection = () => {
  return (
    <section className="bg-gradient-to-b from-blue-600 to-purple-400 relative overflow-hidden">
      {/* Top promotional banner */}
      <div className="bg-blue-800 text-white text-center py-2 text-sm">
        DISCOVER YOUR NEW DAILY CRAVE!
      </div>
      
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Product images and text */}
          <div className="text-center lg:text-left">
            <div className="mb-8">
              <img 
                src="https://images.unsplash.com/photo-1563805042-7684c019e1cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                alt="Culture Cup Product"
                className="w-64 h-80 object-cover rounded-lg mx-auto lg:mx-0 mb-4"
              />
            </div>
            <h2 className="text-white text-4xl font-bold mb-4">
              DISCOVER<br />
              YOUR NEW<br />
              DAILY<br />
              CRAVE!
            </h2>
            <p className="text-white text-lg mb-6">
              Meet your new all-in-one breakfast hack.<br />
              The first ever probiotic ice cream for breakfast.
            </p>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full text-lg font-bold">
              LEARN MORE
            </Button>
          </div>

          {/* Right side - Large product image */}
          <div className="text-center">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1551024601-bec78aea704b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                alt="Culture Cup Large"
                className="w-full max-w-md mx-auto"
              />
              <div className="absolute top-0 left-0 bg-yellow-400 text-black px-4 py-2 rounded font-bold">
                #FIRST EVER • REGENERATIVE<br />
                ORGANIC ICE CREAM
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section - Crack into Culture Cup */}
        <div className="mt-16 text-center">
          <h3 className="text-white text-3xl font-bold mb-8">
            CRACK INTO... <span className="text-yellow-400">Culture Cup</span>
          </h3>
          <p className="text-white text-lg mb-8">PROBIOTIC ICE CREAM</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <img 
                src="https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
                alt="Dark Chocolate Honeycomb Crunch"
                className="w-48 h-48 object-cover rounded-full mx-auto mb-4"
              />
              <h4 className="text-white font-bold">Dark Chocolate Honeycomb</h4>
              <p className="text-white">CRUNCH</p>
            </div>
            <div className="text-center">
              <img 
                src="https://images.unsplash.com/photo-1582716401301-b2407dc7563d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
                alt="Vanilla flavor"
                className="w-48 h-48 object-cover rounded-full mx-auto mb-4"
              />
              <h4 className="text-white font-bold">Vanilla</h4>
            </div>
            <div className="text-center">
              <img 
                src="https://images.unsplash.com/photo-1570197788417-0e82375c9371?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
                alt="Berry flavor"
                className="w-48 h-48 object-cover rounded-full mx-auto mb-4"
              />
              <h4 className="text-white font-bold">Mixed Berry</h4>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CultureCupSection;
