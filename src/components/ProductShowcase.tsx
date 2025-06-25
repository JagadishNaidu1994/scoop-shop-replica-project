
import React from 'react';

const ProductShowcase = () => {
  return (
    <section className="bg-yellow-400 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-black mb-4">
            OUR SIGNATURE ICE CREAM FLAVORS
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <img 
              src="https://images.unsplash.com/photo-1563805042-7684c019e1cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
              alt="Alec's Ice Cream Pint"
              className="w-full h-64 object-cover rounded-lg mb-4"
            />
          </div>
          <div className="text-center">
            <img 
              src="https://images.unsplash.com/photo-1551024601-bec78aea704b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
              alt="Alec's Ice Cream Pint"
              className="w-full h-64 object-cover rounded-lg mb-4"
            />
          </div>
          <div className="text-center">
            <img 
              src="https://images.unsplash.com/photo-1570197788417-0e82375c9371?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
              alt="Alec's Ice Cream Pint"
              className="w-full h-64 object-cover rounded-lg mb-4"
            />
          </div>
          <div className="text-center">
            <img 
              src="https://images.unsplash.com/photo-1582716401301-b2407dc7563d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
              alt="Alec's Ice Cream Pint"
              className="w-full h-64 object-cover rounded-lg mb-4"
            />
          </div>
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
      </div>
    </section>
  );
};

export default ProductShowcase;
