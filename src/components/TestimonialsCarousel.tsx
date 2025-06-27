
import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

const TestimonialsCarousel = () => {
  const testimonials = [
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
    <section className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-black mb-4">What our customers say</h2>
        </div>
        
        <Carousel className="w-full">
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index}>
                <div className="text-center space-y-6 p-8">
                  <div className="flex justify-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-2xl">★</span>
                    ))}
                  </div>
                  <blockquote className="text-xl text-gray-700 leading-relaxed max-w-2xl mx-auto">
                    "{testimonial.text}"
                  </blockquote>
                  <p className="font-semibold text-black">— {testimonial.author}</p>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
};

export default TestimonialsCarousel;
