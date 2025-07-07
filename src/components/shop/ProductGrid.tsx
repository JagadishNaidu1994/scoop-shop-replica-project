
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import ProductCard from './ProductCard';
import MobileProductCard from './MobileProductCard';
import { useToast } from '@/hooks/use-toast';

interface DatabaseProduct {
  id: number;
  name: string;
  description: string | null;
  price: number;
  category: string | null;
  in_stock: boolean | null;
  is_active: boolean | null;
  primary_image: string | null;
  hover_image: string | null;
  benefits: string[] | null;
}

interface ComponentProduct {
  id: number;
  name: string;
  description: string | null;
  price: string;
  category: string | null;
  in_stock: boolean | null;
  is_active: boolean | null;
  primary_image: string | null;
  hover_image: string | null;
  benefits: string[] | null;
  primaryImage: string;
  hoverImage: string;
}

const ProductGrid = () => {
  const [products, setProducts] = useState<ComponentProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();

    // Set up real-time subscription for product updates
    const channel = supabase
      .channel('products-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products'
        },
        () => {
          console.log('Product updated, refetching...');
          fetchProducts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching products:', error);
        toast({
          title: "Error",
          description: "Failed to load products",
          variant: "destructive"
        });
        return;
      }

      console.log('Fetched products:', data);
      
      // Map database products to component products with proper type conversion
      const mappedProducts: ComponentProduct[] = data?.map((product: DatabaseProduct) => ({
        ...product,
        price: product.price.toString(), // Convert number to string
        primaryImage: product.primary_image || '/placeholder.svg',
        hoverImage: product.hover_image || product.primary_image || '/placeholder.svg'
      })) || [];
      
      setProducts(mappedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No products available</h3>
        <p className="text-gray-600">Check back soon for new products!</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Desktop Grid */}
      <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Mobile Grid */}
      <div className="md:hidden space-y-4">
        {products.map((product) => (
          <MobileProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
