
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import FeaturedFlavors from '@/components/FeaturedFlavors';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <FeaturedFlavors />
        
        {/* About Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Our Story
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  Since 1985, Alec's Ice Cream has been a beloved part of our community. 
                  What started as a small family business has grown into a local institution, 
                  but we've never forgotten our roots.
                </p>
                <p className="text-lg text-gray-600 mb-8">
                  Every scoop is made with care, using time-honored recipes passed down 
                  through generations and the finest ingredients we can source. 
                  We believe that great ice cream brings people together.
                </p>
                <button className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                  Learn More About Us
                </button>
              </div>
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1595433707802-6b2626ef1c91?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Ice cream shop interior"
                  className="w-full h-96 object-cover rounded-2xl shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Location Preview */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
              Visit Our Locations
            </h2>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              Find us at multiple convenient locations throughout the city. 
              Each location offers the same quality and friendly service you've come to expect.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="bg-pink-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📍</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Downtown</h3>
                <p className="text-gray-600">123 Main Street<br />Open Daily 11am-9pm</p>
              </div>
              <div className="text-center">
                <div className="bg-pink-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📍</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Westside</h3>
                <p className="text-gray-600">456 Oak Avenue<br />Open Daily 12pm-8pm</p>
              </div>
              <div className="text-center">
                <div className="bg-pink-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📍</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Eastside</h3>
                <p className="text-gray-600">789 Pine Road<br />Open Daily 11am-10pm</p>
              </div>
            </div>
            
            <button className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors">
              View All Locations
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
