
import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const ProductCarousel = () => {
  const images = [
    {
      src: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      alt: "Vanilla Ice Cream",
      bgColor: "bg-yellow-400"
    },
    {
      src: "https://images.unsplash.com/photo-1551024601-bec78aea704b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      alt: "Chocolate Ice Cream",
      bgColor: "bg-amber-600"
    },
    {
      src: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      alt: "Strawberry Ice Cream",
      bgColor: "bg-pink-400"
    },
    {
      src: "https://images.unsplash.com/photo-1582716401301-b2407dc7563d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      alt: "Mint Ice Cream",
      bgColor: "bg-green-400"
    },
    {
      src: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      alt: "Cookie Ice Cream",
      bgColor: "bg-orange-400"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  // Auto-scroll functionality
  useEffect(() => {
    const interval = setInterval(nextSlide, 3000);
    return () => clearInterval(interval);
  }, []);

  const getImagePosition = (index: number) => {
    const diff = index - currentIndex;
    if (diff === 0) return 'translate-x-0 scale-110 z-20 opacity-100';
    if (diff === 1 || diff === -(images.length - 1)) return 'translate-x-32 scale-90 z-10 opacity-60';
    if (diff === -1 || diff === images.length - 1) return '-translate-x-32 scale-90 z-10 opacity-60';
    if (diff === 2 || diff === -(images.length - 2)) return 'translate-x-64 scale-75 z-0 opacity-30';
    if (diff === -2 || diff === images.length - 2) return '-translate-x-64 scale-75 z-0 opacity-30';
    return 'translate-x-96 scale-50 z-0 opacity-0';
  };

  return (
    <div className={`py-16 transition-colors duration-500 ${images[currentIndex].bgColor}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-black mb-4">
            OUR SIGNATURE ICE CREAM FLAVORS
          </h2>
        </div>

        <div className="relative flex items-center justify-center h-80 overflow-hidden">
          {/* Left Arrow */}
          <button
            onClick={prevSlide}
            className="absolute left-4 z-30 p-3 rounded-full bg-white/80 hover:bg-white shadow-lg transition-all duration-200 hover:scale-110"
          >
            <ArrowLeft className="w-6 h-6 text-black" />
          </button>

          {/* Images Container */}
          <div className="relative w-full h-full flex items-center justify-center">
            {images.map((image, index) => (
              <div
                key={index}
                className={`absolute transition-all duration-500 ease-in-out ${getImagePosition(index)}`}
              >
                <div className="w-48 h-64 rounded-lg overflow-hidden shadow-xl">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={nextSlide}
            className="absolute right-4 z-30 p-3 rounded-full bg-white/80 hover:bg-white shadow-lg transition-all duration-200 hover:scale-110"
          >
            <ArrowRight className="w-6 h-6 text-black" />
          </button>
        </div>

        <div className="text-center mt-12">
          <p className="text-black text-lg mb-4">
            OUR SIGNATURE ICE CREAM FLAVORS
          </p>
          <div className="flex justify-center space-x-8">
            <span className="text-black font-semibold">ORGANIC</span>
            <span className="text-black font-semibold">REGENERATIVE</span>
            <span className="text-black font-semibold">PROBIOTIC</span>
          </div>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center mt-8 space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentIndex ? 'bg-black' : 'bg-black/30'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductCarousel;
