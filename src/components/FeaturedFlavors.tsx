
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const FeaturedFlavors = () => {
  const flavors = [
    {
      name: "Vanilla Bean Supreme",
      description: "Rich Madagascar vanilla with real vanilla bean specks",
      image: "https://images.unsplash.com/photo-1582716401301-b2407dc7563d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      price: "$4.50"
    },
    {
      name: "Chocolate Fudge Brownie",
      description: "Decadent chocolate ice cream with fudgy brownie chunks",
      image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      price: "$4.75"
    },
    {
      name: "Strawberry Fields",
      description: "Fresh strawberry ice cream made with local berries",
      image: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      price: "$4.50"
    },
    {
      name: "Mint Chocolate Chip",
      description: "Cool peppermint ice cream with dark chocolate chips",
      image: "https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      price: "$4.50"
    },
    {
      name: "Cookies & Cream",
      description: "Vanilla ice cream loaded with chocolate cookie pieces",
      image: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      price: "$4.75"
    },
    {
      name: "Salted Caramel",
      description: "Sweet caramel ice cream with a hint of sea salt",
      image: "https://images.unsplash.com/photo-1576506295286-5cda18df43e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      price: "$4.75"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Featured Flavors
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our most popular handcrafted ice cream flavors, 
            made fresh daily with premium ingredients.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {flavors.map((flavor, index) => (
            <Card key={index} className="group hover:shadow-xl transition-shadow duration-300 overflow-hidden">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={flavor.image}
                  alt={flavor.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 bg-pink-600 text-white px-3 py-1 rounded-full font-semibold">
                  {flavor.price}
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{flavor.name}</h3>
                <p className="text-gray-600">{flavor.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors">
            View All Flavors
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedFlavors;
