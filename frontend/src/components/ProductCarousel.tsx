
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
    if (diff === 1 || diff === -(images.length - 1)) return 'translate-x-96 scale-90 z-10 opacity-70';
    if (diff === -1 || diff === images.length - 1) return '-translate-x-96 scale-90 z-10 opacity-70';
    if (diff === 2 || diff === -(images.length - 2)) return 'translate-x-[28rem] scale-75 z-0 opacity-40';
    if (diff === -2 || diff === images.length - 2) return '-translate-x-[28rem] scale-75 z-0 opacity-40';
    return 'translate-x-[40rem] scale-50 z-0 opacity-0';
  };

  return (
    <div className={`py-20 transition-colors duration-500 relative ${images[currentIndex].bgColor}`}>
      {/* Wavy top transition */}
      <div className="absolute top-0 left-0 w-full">
        <svg viewBox="0 0 1200 120" className="w-full h-20 fill-current text-gray-50">
          <path d="M0,60 C200,0 400,120 600,60 C800,0 1000,120 1200,60 L1200,0 L0,0 Z"></path>
        </svg>
      </div>

      <div className="container mx-auto px-4 pt-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-black mb-6">
            OUR SIGNATURE ICE CREAM FLAVORS
          </h2>
        </div>

        <div className="relative flex items-center justify-center h-96 overflow-hidden px-8">
          {/* Left Arrow */}
          <button
            onClick={prevSlide}
            className="absolute left-8 z-30 p-4 rounded-full bg-white/90 hover:bg-white shadow-xl transition-all duration-200 hover:scale-110"
          >
            <ArrowLeft className="w-8 h-8 text-black" />
          </button>

          {/* Images Container */}
          <div className="relative w-full max-w-7xl h-full flex items-center justify-center">
            {images.map((image, index) => (
              <div
                key={index}
                className={`absolute transition-all duration-700 ease-in-out ${getImagePosition(index)}`}
              >
                <div className="w-72 h-80 rounded-2xl overflow-hidden shadow-2xl">
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
            className="absolute right-8 z-30 p-4 rounded-full bg-white/90 hover:bg-white shadow-xl transition-all duration-200 hover:scale-110"
          >
            <ArrowRight className="w-8 h-8 text-black" />
          </button>
        </div>

        <div className="text-center mt-16">
          <p className="text-black text-xl mb-6 font-semibold">
            OUR SIGNATURE ICE CREAM FLAVORS
          </p>
          <div className="flex justify-center space-x-12">
            <span className="text-black font-bold text-lg">ORGANIC</span>
            <span className="text-black font-bold text-lg">REGENERATIVE</span>
            <span className="text-black font-bold text-lg">PROBIOTIC</span>
          </div>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center mt-12 space-x-3">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-4 h-4 rounded-full transition-all duration-200 ${
                index === currentIndex ? 'bg-black scale-125' : 'bg-black/40'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Wavy bottom transition */}
      <div className="absolute bottom-0 left-0 w-full">
        <svg viewBox="0 0 1200 120" className="w-full h-20 fill-current text-blue-600">
          <path d="M0,60 C300,0 600,120 900,60 C1050,30 1150,90 1200,60 L1200,120 L0,120 Z"></path>
        </svg>
      </div>
    </div>
  );
};

export default ProductCarousel;
