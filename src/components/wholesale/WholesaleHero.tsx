import React from 'react';
import AdminImageUpload from '@/components/AdminImageUpload';

const WholesaleHero = () => {
  return (
    <section className="relative bg-gradient-to-br from-amber-50 to-orange-100 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Your Next Partnership<br />
              <span className="text-amber-600">Exceptional Coffee</span>
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              Great coffee, barista training, high-quality equipment, a commitment to sustainability, and a team you can rely on.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-amber-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors">
                Get Started
              </button>
              <button className="border-2 border-amber-600 text-amber-600 px-8 py-3 rounded-lg font-semibold hover:bg-amber-50 transition-colors">
                Learn More
              </button>
            </div>
          </div>
          <div className="relative">
            <AdminImageUpload
              src="https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&h=400&fit=crop"
              alt="Professional coffee setup"
              className="rounded-2xl shadow-2xl"
              imagePath="wholesale-hero"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default WholesaleHero;