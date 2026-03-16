
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  const navigate = useNavigate();

  const handleShopClick = () => {
    navigate('/shop');
  };

  return (
    <section className="relative w-full h-[600px] md:h-[700px] lg:h-[85vh] overflow-hidden">
      {/* Full-width background image */}
      <img
        src="/lovable-uploads/NDN00926-Edit.jpg"
        alt="NASTEA matcha pouring setup"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Subtle overlay for text readability on left */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />

      {/* Text content overlaid on left */}
      <div className="relative z-10 flex items-end h-full w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pb-16 md:pb-20">
        <div className="space-y-5 max-w-lg">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
            Your Daily Ritual for Focus,{' '}
            <span className="text-white/90">Energy & Calm.</span>
          </h1>
          <p className="text-lg text-white/80">
            Premium Japanese matcha crafted for modern wellness.
          </p>
          <div className="pt-2">
            <Button
              onClick={handleShopClick}
              className="bg-white text-black px-8 py-3 text-base rounded-full hover:bg-white/90 transition-colors font-semibold"
            >
              SHOP STARTER BUNDLES
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
