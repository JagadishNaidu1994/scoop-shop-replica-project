import { useState, useEffect } from 'react';
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
        <div className="responsive-container py-8">
          {/* Matcha Loading Animation */}
          <div className="flex flex-col items-center justify-center py-16 mb-8">
            <div className="relative">
              {/* Matcha Bowl */}
              <div className="w-24 h-24 rounded-full bg-gradient-to-b from-green-100 to-green-200 border-4 border-green-800 relative overflow-hidden animate-pulse">
                {/* Matcha Liquid */}
                <div className="absolute bottom-0 w-full h-3/4 bg-gradient-to-t from-green-400 to-green-300 rounded-b-full animate-[wave_2s_ease-in-out_infinite]"></div>
                {/* Foam/Bubbles */}
                <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-green-200 rounded-full opacity-60 animate-ping"></div>
              </div>
              {/* Steam */}
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 flex gap-2">
                <div className="w-1 h-8 bg-gray-300 rounded-full opacity-40 animate-[steam_2s_ease-in-out_infinite]"></div>
                <div className="w-1 h-8 bg-gray-300 rounded-full opacity-40 animate-[steam_2s_ease-in-out_infinite_0.3s]"></div>
                <div className="w-1 h-8 bg-gray-300 rounded-full opacity-40 animate-[steam_2s_ease-in-out_infinite_0.6s]"></div>
              </div>
            </div>
            <p className="mt-8 text-gray-600 font-medium animate-pulse">Brewing your matcha experience...</p>
          </div>

          {/* Products Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>

        <style>{`
          @keyframes wave {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-4px); }
          }
          @keyframes steam {
            0% { transform: translateY(0) scale(1); opacity: 0.4; }
            50% { transform: translateY(-10px) scale(1.1); opacity: 0.2; }
            100% { transform: translateY(-20px) scale(1.2); opacity: 0; }
          }
        `}</style>
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
