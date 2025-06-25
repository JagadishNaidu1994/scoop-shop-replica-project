
import React from 'react';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-r from-pink-100 to-blue-100 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Welcome to
              <span className="text-pink-600 block">Alec's Ice Cream</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Handcrafted premium ice cream made with the finest ingredients. 
              Experience the perfect blend of traditional recipes and innovative flavors 
              that have been delighting customers for generations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-3 text-lg">
                View Our Flavors
              </Button>
              <Button variant="outline" className="border-pink-600 text-pink-600 hover:bg-pink-50 px-8 py-3 text-lg">
                Find Locations
              </Button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative w-full h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1563805042-7684c019e1cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                alt="Delicious ice cream scoops"
                className="w-full h-full object-cover"
              />
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 bg-white rounded-full p-4 shadow-lg">
                <span className="text-2xl">🍦</span>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white rounded-full p-4 shadow-lg">
                <span className="text-2xl">🍨</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
