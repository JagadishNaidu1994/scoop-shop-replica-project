
import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import MobileProductCard from './MobileProductCard';
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    fetchProducts();
    
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
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

      // Transform data to match expected format with better images
      const transformedProducts = data.map(product => ({
        id: product.id,
        name: product.name,
        price: product.price,
        primary_image: getProductImage(product.category, 'primary'),
        hover_image: getProductImage(product.category, 'hover'),
        description: getProductDescription(product.category),
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

  const getProductImage = (category: string, type: 'primary' | 'hover') => {
    const imageMap = {
      'Matcha': {
        primary: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=400&h=400&fit=crop&bg=f5f5f5',
        hover: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574'
      },
      'Mushrooms': {
        primary: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=400&fit=crop&bg=f5f5f5',
        hover: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4'
      },
      'Blends': {
        primary: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&bg=f5f5f5',
        hover: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b'
      }
    };

    return imageMap[category as keyof typeof imageMap]?.[type] || 
           'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&bg=f5f5f5';
  };

  const getProductDescription = (category: string) => {
    const descriptions = {
      'Matcha': 'Energy, focus, immunity',
      'Mushrooms': 'Cognitive support, immunity',
      'Blends': 'Energy, focus, immunity'
    };
    return descriptions[category as keyof typeof descriptions] || 'Premium quality supplement';
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
    <div className={`grid ${isMobile ? 'grid-cols-1 gap-6' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'}`}>
      {products.map((product) => {
        const productData = {
          id: product.id,
          name: product.name,
          price: `£${product.price}`,
          primaryImage: product.primary_image,
          hoverImage: product.hover_image,
          description: product.description
        };

        return isMobile ? (
          <MobileProductCard key={product.id} product={productData} />
        ) : (
          <ProductCard key={product.id} product={productData} />
        );
      })}
    </div>
  );
};

export default ProductGrid;
