import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import HeaderNavBar from '@/components/HeaderNavBar';
import Footer from '@/components/Footer';
import ProductGrid from '@/components/shop/ProductGrid';
import { supabase } from '@/integrations/supabase/client';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string | null;
  primary_image: string | null;
  hover_image: string | null;
  category: string | null;
  benefits: string[] | null;
  in_stock: boolean | null;
  is_active: boolean | null;
}

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      // Only select essential fields - exclude large image data initially
      const { data, error } = await supabase
        .from('products')
        .select('id, name, price, primary_image, hover_image, category, benefits, description, in_stock, is_active')
        .eq('is_active', true)
        .order('name')
        .limit(50);

      if (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } else {
        // Filter out products with massive base64 images (> 10KB) and use placeholder
        const processedProducts = (data || []).map(product => ({
          ...product,
          primary_image: isValidImageUrl(product.primary_image) ? product.primary_image : '/placeholder.svg',
          hover_image: isValidImageUrl(product.hover_image) ? product.hover_image : null
        }));
        setProducts(processedProducts);
      }
    } catch (error) {
      console.error('Error:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Check if image is a valid URL (not a huge base64 string)
  const isValidImageUrl = (url: string | null): boolean => {
    if (!url) return false;
    // If it's a base64 image larger than 5KB, skip it
    if (url.startsWith('data:image')) {
      return url.length < 5000;
    }
    // Accept regular URLs
    return url.startsWith('/') || url.startsWith('http');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <HeaderNavBar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
              <p className="text-gray-600">Loading products...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <HeaderNavBar />

      <div className="responsive-container py-8">
        <div className="mb-8">
          <h1 className="responsive-heading font-bold text-black mb-4">Shop NASTEA</h1>
          <p className="responsive-text text-gray-600">
            Discover our premium collection of matcha and wellness products
          </p>
        </div>

        <ProductGrid products={products} />
      </div>

      <Footer />
    </div>
  );
};

export default Shop;
