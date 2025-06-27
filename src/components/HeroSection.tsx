
import React from 'react';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  return (
    <section className="bg-gray-50 min-h-screen flex items-center w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="space-y-8 animate-fade-in">
          <h1 className="text-5xl lg:text-6xl font-bold text-black leading-tight">
            Your Daily Ritual for Focus,<br />
            <span className="text-gray-700">Energy & Calm</span>
          </h1>
          
          <p className="text-lg text-gray-600 max-w-md">
            Premium functional mushroom and adaptogen blends crafted for modern wellness
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition-colors">
              Shop Starter Bundles
            </Button>
            <Button variant="outline" className="border-black text-black px-8 py-3 rounded-full hover:bg-black hover:text-white transition-colors">
              Take Our Quiz
            </Button>
          </div>
        </div>

        {/* Right Image */}
        <div className="relative animate-fade-in-delay">
          <img 
            src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
            alt="DIRTEA products on kitchen table setup"
            className="w-full h-auto rounded-lg shadow-2xl"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
