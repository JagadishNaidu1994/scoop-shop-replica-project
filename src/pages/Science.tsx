
import React from 'react';
import HeaderNavBar from '@/components/HeaderNavBar';
import Footer from '@/components/Footer';

const ScienceHeroBanner = () => (
  <section className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
        The Science Behind NASTEA
      </h1>
      <p className="text-xl text-gray-700 mb-8">
        Discover the research and innovation that powers our functional mushroom blends
      </p>
    </div>
  </section>
);

const Science = () => {
  return (
    <div className="min-h-screen bg-white">
      <HeaderNavBar />
      <ScienceHeroBanner />
      <div className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Science Page</h2>
          <p className="text-lg text-gray-700">
            This page is under development. Check back soon for detailed information about our scientific approach.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Science;
