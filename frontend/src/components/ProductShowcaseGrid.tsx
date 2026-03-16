import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ProductShowcaseGrid = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const products = [{
    id: 0,
    name: "Japan Classic",
    description: "Japan-Grown | Daily Driver | No Additives",
    thumbnail: "/lovable-uploads/NDN00932-Edit.jpg",
    mainImage: "/lovable-uploads/NDN00932-Edit.jpg"
  }, {
    id: 1,
    name: "Organic Ceremonial",
    description: "Cert Organic | Calm Energy | No Additives",
    thumbnail: "/lovable-uploads/NDN00607-Edit.jpg",
    mainImage: "/lovable-uploads/NDN00607-Edit.jpg"
  }];
  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % products.length);
  };
  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + products.length) % products.length);
  };
  return <section className="bg-gray-50 w-full py-[17px]">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Half - Images on top, Content on bottom */}
          <div className="space-y-8">
            {/* Product Thumbnails */}
            <div className="flex space-x-4 justify-center lg:justify-start">
              {products.map((product, index) => <button key={product.id} onClick={() => setSelectedImage(index)} className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${selectedImage === index ? 'border-black shadow-lg transform scale-105' : 'border-gray-200 hover:border-gray-400'}`}>
                  <img src={product.thumbnail} alt={product.name} className="w-full h-full object-cover" />
                </button>)}
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-black">
                Choose your ritual for flex, for everyday, for chaos in the kitchen.
              </h2>
            </div>

            {/* Product Categories with Dynamic Colors */}
            <div className="space-y-6">
              <div>
                <h3 className={`text-2xl font-bold mb-2 transition-colors duration-300 ${selectedImage === 0 ? 'text-black' : 'text-gray-600'}`}>
                  Organic Ceremonial
                </h3>
                <h4 className={`text-xl font-semibold transition-colors duration-300 ${selectedImage === 1 ? 'text-black' : 'text-gray-600'}`}>
                  Japan Classic
                </h4>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="/shop">
                <button className="bg-black text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-800 transition-colors">
                  Shop Now
                </button>
              </a>
            </div>

            {/* Selected Product Info */}
            <div className="space-y-2">
              <h4 className="text-lg font-semibold text-black">
                {products[selectedImage].name}
              </h4>
              <p className="text-gray-600 text-sm">
                {products[selectedImage].description}
              </p>
            </div>
          </div>

          {/* Right Half - Main Product Image with Carousel Controls */}
          <div className="relative">
            <div className="aspect-square overflow-hidden rounded-lg bg-white">
              <img src={products[selectedImage].mainImage} alt={products[selectedImage].name} className="w-full h-full object-cover transition-all duration-500 ease-in-out" />
            </div>
            
            {/* Carousel Controls */}
            <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-colors">
              <ChevronLeft className="w-6 h-6 text-black" />
            </button>
            
            <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-colors">
              <ChevronRight className="w-6 h-6 text-black" />
            </button>
            
            {/* Image Counter */}
            <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
              {selectedImage + 1}/3
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default ProductShowcaseGrid;