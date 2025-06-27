
import React from 'react';
import ProductCard from './ProductCard';

interface ProductGridProps {
  selectedCategory: string;
  priceRange: number[];
}

const ProductGrid = ({ selectedCategory, priceRange }: ProductGridProps) => {
  const products = [
    {
      id: 1,
      name: 'focus gummies',
      description: 'Focus, memory, cognition',
      price: '£27',
      primaryImage: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=400&fit=crop',
      hoverImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop'
    },
    {
      id: 2,
      name: 'focus powder',
      description: 'Focus, Cognitive, Immunity',
      price: '£30',
      primaryImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
      hoverImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop'
    },
    {
      id: 3,
      name: 'immunity powder',
      description: 'Energy, Balance, Immunity',
      price: '£30',
      primaryImage: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop',
      hoverImage: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=400&fit=crop'
    },
    {
      id: 4,
      name: 'calm powder',
      description: 'Calm, Relax, Immunity',
      price: '£30',
      primaryImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
      hoverImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop'
    },
    {
      id: 5,
      name: 'performance powder',
      description: 'Performance, Energy, Focus',
      price: '£30',
      primaryImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
      hoverImage: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop'
    },
    {
      id: 6,
      name: 'beauty powder',
      description: 'Hair, Skin, Nails',
      price: '£30',
      primaryImage: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop',
      hoverImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop'
    },
    {
      id: 7,
      name: 'pures boxset',
      description: 'Energy, Focus, Beauty',
      price: '£114',
      primaryImage: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop',
      hoverImage: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=400&fit=crop'
    },
    {
      id: 8,
      name: 'beauty gummies',
      description: 'Hair, Skin, Nails',
      price: '£27',
      primaryImage: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=400&fit=crop',
      hoverImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop'
    },
    {
      id: 9,
      name: 'performance gummies',
      description: 'Performance, Energy, Focus',
      price: '£27',
      primaryImage: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=400&fit=crop',
      hoverImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop'
    },
    {
      id: 10,
      name: 'gummies boxset',
      description: 'Energy, Focus, Beauty',
      price: '£85',
      primaryImage: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop',
      hoverImage: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop'
    },
    {
      id: 11,
      name: 'immunity gummies',
      description: 'Energy, Balance, Immunity',
      price: '£27',
      primaryImage: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=400&fit=crop',
      hoverImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop'
    },
    {
      id: 12,
      name: 'the dirtea tote bag',
      description: 'Sustainable shopping companion',
      price: '£14.99',
      primaryImage: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
      hoverImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop'
    },
    {
      id: 13,
      name: 'blend boxset',
      description: 'Energy, Focus, Beauty',
      price: '£199.99',
      primaryImage: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop',
      hoverImage: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=400&fit=crop'
    },
    {
      id: 14,
      name: 'coffee blend',
      description: 'Energy, Focus, Immunity',
      price: '£30',
      primaryImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
      hoverImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop'
    },
    {
      id: 15,
      name: 'cacao blend',
      description: 'Calm, Relaxing, Focus',
      price: '£30',
      primaryImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
      hoverImage: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop'
    },
    {
      id: 16,
      name: 'matcha blend',
      description: 'Energy, Focus, Beauty',
      price: '£30',
      primaryImage: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop',
      hoverImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
