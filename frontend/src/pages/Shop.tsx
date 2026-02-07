import { useState, useEffect } from 'react';
import HeaderNavBar from '@/components/HeaderNavBar';
import Footer from '@/components/Footer';
import ProductGrid from '@/components/shop/ProductGrid';
import MatchaLoadingAnimation from '@/components/MatchaLoadingAnimation';
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
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const startTime = Date.now();

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('name')
        .limit(50);

      if (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } else {
        // Filter out products with massive base64 images (> 5KB) and use placeholder
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
    }

    // Ensure minimum 1 second animation for better UX
    const elapsedTime = Date.now() - startTime;
    const remainingTime = Math.max(0, 1000 - elapsedTime);

    setTimeout(() => {
      setLoading(false);
    }, remainingTime);
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
        <MatchaLoadingAnimation message="Brewing your matcha experience..." showSkeleton={true} />
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
