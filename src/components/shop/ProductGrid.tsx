
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
      primaryImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
      hoverImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop'
    },
    {
      id: 2,
      name: 'focus powder',
      description: 'Focus, cognition, immunity',
      price: '£30',
      primaryImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
      hoverImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop'
    },
    {
      id: 3,
      name: 'immunity powder',
      description: 'Energy, defence, immunity',
      price: '£30',
      primaryImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
      hoverImage: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=400&fit=crop'
    },
    {
      id: 4,
      name: 'calm powder',
      description: 'Calm, relax, immunity',
      price: '£30',
      primaryImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
      hoverImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop'
    },
    {
      id: 5,
      name: 'performance powder',
      description: 'Performance, energy, focus',
      price: '£30',
      primaryImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
      hoverImage: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop'
    },
    {
      id: 6,
      name: 'beauty powder',
      description: 'Hair, skin, nails',
      price: '£30',
      primaryImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
      hoverImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop'
    },
    {
      id: 7,
      name: 'pures boxset',
      description: 'Energy, focus, immunity',
      price: '£133',
      primaryImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
      hoverImage: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=400&fit=crop'
    },
    {
      id: 8,
      name: 'beauty gummies',
      description: 'Hair, skin, nails',
      price: '£27',
      primaryImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
      hoverImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
