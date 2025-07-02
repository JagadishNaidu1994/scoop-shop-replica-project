
import React from 'react';
import { Button } from '@/components/ui/button';
import AdminImageUpload from './AdminImageUpload';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <AdminImageUpload
          src="/lovable-uploads/da6fe5b0-6a57-4ada-a9b8-042646881f03.png"
          alt="Background pattern"
          className="w-full h-full object-cover opacity-10"
          imagePath="hero-background"
        />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 z-10 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6">
            Functional <span className="text-orange-500">mushroom</span> coffee
          </h1>
          <p className="text-xl sm:text-2xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Unlock the power of adaptogens with our premium mushroom coffee blends
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-lg rounded-full">
              Shop Now
            </Button>
            <Button size="lg" variant="outline" className="border-orange-500 text-orange-500 hover:bg-orange-50 px-8 py-4 text-lg rounded-full">
              Learn More
            </Button>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
