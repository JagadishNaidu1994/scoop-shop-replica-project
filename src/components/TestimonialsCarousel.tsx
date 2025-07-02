
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const TestimonialsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const testimonials = [
    {
      text: "I love this product so much I've gifted a starter kit to two of my friends! I'm going to order...",
      author: "Tracey S.",
      rating: 5
    },
    {
      text: "DIRTEA has completely transformed my morning routine. I feel focused and energized without the jitters.",
      author: "Sarah M.",
      rating: 5
    },
    {
      text: "The Lion's Mane blend has improved my mental clarity significantly. I can't start my day without it!",
      author: "Michael R.",
      rating: 5
    },
    {
      text: "Amazing quality and taste. The Reishi blend helps me unwind perfectly after stressful days.",
      author: "Emma L.",
      rating: 5
    }
  ];

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <section className="py-20 bg-gray-100 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Title and Rating */}
          <div className="space-y-6">
            <h2 className="text-5xl lg:text-6xl font-bold text-black leading-tight">
              Loved by one million<br />
              people worldwide
            </h2>
            <div className="flex items-center space-x-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-black text-xl">★</span>
                ))}
              </div>
              <span className="text-lg font-medium text-black">4.8/5</span>
            </div>
          </div>

          {/* Right side - Testimonials Carousel */}
          <div className="relative max-w-lg mx-auto">
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="w-full flex-shrink-0 px-4">
                    <div className="p-8 space-y-6">
                      <blockquote className="text-lg text-gray-800 leading-relaxed">
                        "{testimonial.text}"
                      </blockquote>
                      <div className="flex justify-center mb-3">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <span key={i} className="text-black text-lg">★</span>
                        ))}
                      </div>
                      <p className="font-semibold text-gray-600 text-center">{testimonial.author}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Navigation buttons */}
            <button
              onClick={prevTestimonial}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-white border border-gray-300 rounded-full p-2 hover:bg-gray-50 shadow-lg"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            
            <button
              onClick={nextTestimonial}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-white border border-gray-300 rounded-full p-2 hover:bg-gray-50 shadow-lg"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
            
            {/* Pagination dots */}
            <div className="flex justify-center space-x-2 mt-6">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToSlide(i)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i === currentIndex ? 'bg-black' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsCarousel;
