
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
    <section className="bg-gray-50 min-h-screen flex items-center w-full py-12 lg:py-0">
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-7xl mx-auto">
        {/* Left Content - Increased size and spacing */}
        <div className="space-y-8 lg:space-y-10 animate-fade-in px-4 sm:px-6 lg:px-12 lg:pr-8">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-black leading-tight">
            Your Daily Ritual for Focus,<br />
            <span className="text-gray-700">Energy & Calm</span>
          </h1>
          
          <p className="text-xl lg:text-2xl text-gray-600 max-w-xl leading-relaxed">
            Premium Japanese matcha crafted for modern wellness.
          </p>
          
          <div className="pt-6">
            <Button onClick={handleShopClick} className="bg-black text-white px-10 py-4 text-lg rounded-full hover:bg-gray-800 transition-colors">
              Shop Starter Bundles
            </Button>
          </div>
        </div>

        {/* Right Image - Increased size */}
        <div className="relative animate-fade-in-delay order-first lg:order-last px-4 sm:px-6 lg:px-0">
          <AdminImageUpload 
            src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
            alt="NASTEA products on kitchen table setup" 
            className="w-full h-auto max-h-[600px] lg:max-h-[700px] object-cover rounded-2xl shadow-2xl" 
            imagePath="hero-section-main" 
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
