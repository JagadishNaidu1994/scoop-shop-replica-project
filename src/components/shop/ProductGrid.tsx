
import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { supabase } from '@/integrations/supabase/client';

interface Product {
  id: number;
  name: string;
  price: number;
  primary_image: string;
  hover_image: string;
  description: string;
  category: string;
  benefits: string[];
}

interface ProductGridProps {
  selectedCategory?: string;
  priceRange?: number[];
}

const ProductGrid: React.FC<ProductGridProps> = ({ selectedCategory = 'all', priceRange = [0, 100] }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .eq('in_stock', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
        return;
      }

      // Transform data to match expected format
      const transformedProducts = data.map(product => ({
        id: product.id,
        name: product.name,
        price: product.price,
        primary_image: product.primary_image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
        hover_image: product.hover_image || 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
        description: product.description || '',
        category: product.category || '',
        benefits: product.benefits || []
      }));

      setProducts(transformedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No products available</h3>
        <p className="text-gray-600">Check back soon for new products!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product) => (
        <ProductCard 
          key={product.id} 
          product={{
            id: product.id,
            name: product.name,
            price: `£${product.price}`,
            primaryImage: product.primary_image,
            hoverImage: product.hover_image
          }} 
        />
      ))}
    </div>
  );
};

export default ProductGrid;
