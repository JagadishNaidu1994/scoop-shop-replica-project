
import React from 'react';
import { Button } from '@/components/ui/button';

const SubHeroBanner = () => {
  return (
    <section className="bg-orange-400 py-16 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
          Ancient ingredients for modern wellness
        </h2>
        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          Discover the power of functional mushrooms and adaptogens, backed by science and tradition
        </p>
        <Button className="bg-white text-orange-400 px-8 py-3 rounded-full hover:bg-gray-100 transition-colors font-semibold">
          Learn More
        </Button>
      </div>
    </section>
  );
};

export default SubHeroBanner;
