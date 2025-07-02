
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Star } from 'lucide-react';
import AdminImageUpload from './AdminImageUpload';

const TestimonialsCarousel = () => {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Thompson",
      role: "Wellness Coach",
      content: "DIRTEA has completely transformed my morning routine. The mental clarity I get from the Lion's Mane blend is incredible!",
      rating: 5,
      avatar: "/lovable-uploads/362012c4-dfba-48a8-afca-59e8f36ec3cf.png",
      imagePath: "testimonial-sarah"
    },
    {
      id: 2,
      name: "Mike Rodriguez",
      role: "Entrepreneur",
      content: "As someone who's always on the go, the sustained energy from Cordyceps coffee keeps me focused without the jitters.",
      rating: 5,
      avatar: "/lovable-uploads/8edc40eb-3dfa-45fb-8cac-fc1a12ec6a3c.png",
      imagePath: "testimonial-mike"
    },
    {
      id: 3,
      name: "Emma Williams",
      role: "Nutritionist",
      content: "I recommend DIRTEA to all my clients. The quality and effectiveness of their mushroom blends is unmatched.",
      rating: 5,
      avatar: "/lovable-uploads/18fa3a22-212e-489f-bdee-5bb2266db6a4.png",
      imagePath: "testimonial-emma"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join thousands of satisfied customers who have transformed their wellness journey
          </p>
        </div>
        
        <Carousel className="max-w-4xl mx-auto">
          <CarouselContent>
            {testimonials.map((testimonial) => (
              <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/3">
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <AdminImageUpload
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full mr-4 object-cover"
                        imagePath={testimonial.imagePath}
                      />
                      <div>
                        <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                        <p className="text-sm text-gray-600">{testimonial.role}</p>
                      </div>
                    </div>
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-700 italic">"{testimonial.content}"</p>
                  </CardContent>
                </Card>
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
