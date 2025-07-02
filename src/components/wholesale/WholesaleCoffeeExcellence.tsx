import React from 'react';
import AdminImageUpload from '@/components/AdminImageUpload';
import { Award, Coffee, Users } from 'lucide-react';

const WholesaleCoffeeExcellence = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <AdminImageUpload
              src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=500&fit=crop"
              alt="Coffee beans being roasted"
              className="rounded-2xl shadow-lg w-full"
              imagePath="wholesale-coffee-excellence"
            />
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Coffee Excellence</h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              We source our beans directly from farmers and cooperatives around the world, ensuring fair trade practices and exceptional quality. Our roasting process brings out the unique characteristics of each origin.
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Award className="text-amber-600 flex-shrink-0" size={24} />
                <span className="text-gray-700">Award-winning coffee beans</span>
              </div>
              <div className="flex items-center space-x-3">
                <Coffee className="text-amber-600 flex-shrink-0" size={24} />
                <span className="text-gray-700">Expert roasting techniques</span>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="text-amber-600 flex-shrink-0" size={24} />
                <span className="text-gray-700">Dedicated support team</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WholesaleCoffeeExcellence;