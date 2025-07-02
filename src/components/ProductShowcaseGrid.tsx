
import React from 'react';
import { Button } from '@/components/ui/button';
import AdminImageUpload from './AdminImageUpload';

const ProductShowcaseGrid = () => {
  const products = [
    {
      id: 1,
      name: "Lion's Mane Coffee",
      description: "Boost cognitive function and mental clarity",
      price: "$24.99",
      image: "/lovable-uploads/50613e1a-332e-4401-ad6b-f7849805d249.png",
      imagePath: "product-lions-mane"
    },
    {
      id: 2,
      name: "Reishi Blend",
      description: "Promote relaxation and better sleep",
      price: "$26.99",
      image: "/lovable-uploads/5bb3c112-8b5a-4427-a43f-d5e5fc935e8d.png",
      imagePath: "product-reishi"
    },
    {
      id: 3,
      name: "Cordyceps Energy",
      description: "Natural energy and endurance support",
      price: "$28.99",
      image: "/lovable-uploads/cfe9af70-3679-48c2-a090-99c899b9cfef.png",
      imagePath: "product-cordyceps"
    },
    {
      id: 4,
      name: "Chaga Immunity",
      description: "Support your immune system naturally",
      price: "$25.99",
      image: "/lovable-uploads/fb93161d-5e4c-405d-a9f0-22e74b7cfc0d.png",
      imagePath: "product-chaga"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Products</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our premium collection of functional mushroom coffee blends
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="aspect-square relative overflow-hidden">
                <AdminImageUpload
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  imagePath={product.imagePath}
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-4">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-orange-500">{product.price}</span>
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button size="lg" variant="outline" className="border-orange-500 text-orange-500 hover:bg-orange-50">
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcaseGrid;
