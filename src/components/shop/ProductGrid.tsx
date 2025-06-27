
import React from 'react';

interface ProductGridProps {
  selectedCategory: string;
  priceRange: number[];
}

const ProductGrid = ({ selectedCategory, priceRange }: ProductGridProps) => {
  const products = [
    {
      id: 1,
      name: 'focus gummies',
      description: 'Lion\'s Mane, Cordyceps, Ginseng',
      price: '£27',
      image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=400&fit=crop',
      bgColor: 'bg-gray-100'
    },
    {
      id: 2,
      name: 'focus powder',
      description: 'Focus, Cognitive, Immunity',
      price: '£30',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
      bgColor: 'bg-orange-100'
    },
    {
      id: 3,
      name: 'immunity powder',
      description: 'Energy, Balance, Immunity',
      price: '£30',
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop',
      bgColor: 'bg-orange-200'
    },
    {
      id: 4,
      name: 'calm powder',
      description: 'Calm, Relax, Immunity',
      price: '£30',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
      bgColor: 'bg-pink-100'
    },
    {
      id: 5,
      name: 'performance powder',
      description: 'Performance, Energy, Focus',
      price: '£30',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
      bgColor: 'bg-yellow-100'
    },
    {
      id: 6,
      name: 'beauty powder',
      description: 'Hair, Skin, Nails',
      price: '£30',
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop',
      bgColor: 'bg-purple-100'
    },
    {
      id: 7,
      name: 'pures boxset',
      description: 'Energy, Focus, Beauty',
      price: '£114',
      image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop',
      bgColor: 'bg-amber-100'
    },
    {
      id: 8,
      name: 'beauty gummies',
      description: 'Hair, Skin, Nails',
      price: '£27',
      image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=400&fit=crop',
      bgColor: 'bg-pink-200'
    },
    {
      id: 9,
      name: 'performance gummies',
      description: 'Performance, Energy, Focus',
      price: '£27',
      image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=400&fit=crop',
      bgColor: 'bg-yellow-200'
    },
    {
      id: 10,
      name: 'gummies boxset',
      description: 'Energy, Focus, Beauty',
      price: '£85',
      image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop',
      bgColor: 'bg-amber-200'
    },
    {
      id: 11,
      name: 'immunity gummies',
      description: 'Energy, Balance, Immunity',
      price: '£27',
      image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=400&fit=crop',
      bgColor: 'bg-orange-100'
    },
    {
      id: 12,
      name: 'the dirtea tote bag',
      description: '',
      price: '£14.99',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
      bgColor: 'bg-gray-50'
    },
    {
      id: 13,
      name: 'blend boxset',
      description: 'Energy, Focus, Beauty',
      price: '£199.99',
      image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop',
      bgColor: 'bg-green-100'
    },
    {
      id: 14,
      name: 'coffee blend',
      description: 'Energy, Focus, Immunity',
      price: '£30',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
      bgColor: 'bg-amber-100'
    },
    {
      id: 15,
      name: 'cacao blend',
      description: 'Calm, Relaxing, Focus',
      price: '£30',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
      bgColor: 'bg-purple-200'
    },
    {
      id: 16,
      name: 'matcha blend',
      description: 'Energy, Focus, Beauty',
      price: '£30',
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop',
      bgColor: 'bg-green-200'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <div key={product.id} className="group cursor-pointer">
          <div className={`${product.bgColor} rounded-lg p-6 mb-4 transition-transform duration-200 group-hover:-translate-y-1`}>
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>
          <div className="text-center">
            <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
            {product.description && (
              <p className="text-sm text-gray-600 mb-2">{product.description}</p>
            )}
            <p className="text-lg font-bold text-gray-900">{product.price}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
