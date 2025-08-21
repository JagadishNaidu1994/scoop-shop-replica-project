
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
    <section className="bg-gray-50 min-h-screen flex items-center w-full -mt-2">
      <div className="w-full px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-7xl mx-auto">
        {/* Left Content */}
        <div className="space-y-6 lg:space-y-8 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-black leading-tight">
            Your Daily Ritual for Focus,<br />
            <span className="text-gray-700">Energy & Calm</span>
          </h1>
          
          <p className="text-lg text-gray-600 max-w-md">
            Premium functional mushroom and adaptogen blends crafted for modern wellness
          </p>
          
          <div className="pt-4">
            <Button onClick={handleShopClick} className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition-colors">
              Shop Starter Bundles
            </Button>
          </div>
        </div>

        {/* Right Image */}
        <div className="relative animate-fade-in-delay order-first lg:order-last">
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
