
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import AdminImageUpload from '@/components/AdminImageUpload';

const HeroSection = () => {
  const navigate = useNavigate();

  const handleShopClick = () => {
    navigate('/shop');
  };

  return (
    <section className="bg-gray-50 min-h-screen flex items-center w-full">
      <div className="w-full px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-12 items-center lg:px-[32px] py-0">
        {/* Left Content */}
        <div className="space-y-3 sm:space-y-4 lg:space-y-8 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-black leading-tight">
            Your Daily Ritual for Focus,<br />
            <span className="text-gray-700">Energy & Calm</span>
          </h1>
          
          <p className="text-base sm:text-lg text-gray-600 max-w-md">
            Premium functional mushroom and adaptogen blends crafted for modern wellness
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-1 sm:pt-2">
            <Button onClick={handleShopClick} className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition-colors">
              Shop Starter Bundles
            </Button>
          </div>
        </div>

        {/* Right Image */}
        <div className="relative animate-fade-in-delay order-first lg:order-last mt-4 lg:mt-0">
          <AdminImageUpload 
            src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
            alt="NASTEA products on kitchen table setup" 
            className="w-full h-auto rounded-lg shadow-2xl" 
            imagePath="hero-section-main" 
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
