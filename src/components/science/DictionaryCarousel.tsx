
import React from 'react';

const DictionaryCarousel = () => {
  const mushrooms = [
    {
      name: "Lion's Mane",
      image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=300&h=300&fit=crop",
      description: "Supports cognitive function and nerve health",
      tag: "Brain"
    },
    {
      name: "Reishi",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop",
      description: "Promotes relaxation and stress relief",
      tag: "Calm"
    },
    {
      name: "Cordyceps",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop",
      description: "Enhances energy and athletic performance",
      tag: "Energy"
    },
    {
      name: "Chaga",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop",
      description: "Rich in antioxidants for immune support",
      tag: "Immunity"
    }
  ];

  return (
    <section className="py-20 bg-gray-50 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-4xl font-bold text-black">NASTEA Dictionary</h2>
          <button className="bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors">
            See the full dictionary
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {mushrooms.map((mushroom, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <img 
                src={mushroom.image} 
                alt={mushroom.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <div className="space-y-3">
                <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                  {mushroom.tag}
                </span>
                <h3 className="text-xl font-bold text-black">{mushroom.name}</h3>
                <p className="text-gray-600 text-sm">{mushroom.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DictionaryCarousel;
