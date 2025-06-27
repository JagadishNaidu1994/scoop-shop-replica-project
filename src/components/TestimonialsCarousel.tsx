
import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

const TestimonialsCarousel = () => {
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
          <div className="relative">
            <Carousel className="w-full">
              <CarouselContent>
                {testimonials.map((testimonial, index) => (
                  <CarouselItem key={index}>
                    <div className="bg-white p-8 rounded-lg shadow-sm space-y-4">
                      <blockquote className="text-lg text-gray-800 leading-relaxed">
                        "{testimonial.text}"
                      </blockquote>
                      <div className="flex justify-center mb-3">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <span key={i} className="text-black text-lg">★</span>
                        ))}
                      </div>
                      <p className="font-semibold text-gray-600 text-center">{testimonial.author}</p>
                      {/* Pagination dots */}
                      <div className="flex justify-center space-x-2 pt-4">
                        {testimonials.map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full ${
                              i === index ? 'bg-black' : 'bg-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute -left-12 top-1/2 -translate-y-1/2 bg-white border-gray-300 hover:bg-gray-50" />
              <CarouselNext className="absolute -right-12 top-1/2 -translate-y-1/2 bg-white border-gray-300 hover:bg-gray-50" />
            </Carousel>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsCarousel;
