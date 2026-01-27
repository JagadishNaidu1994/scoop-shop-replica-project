import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import HeaderNavBar from '@/components/HeaderNavBar';
import Footer from '@/components/Footer';
import ProductGrid from '@/components/shop/ProductGrid';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search, Filter, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { sampleProducts } from '@/data/sampleProducts';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [showFilters, setShowFilters] = useState(false);
  useEffect(() => {
    fetchProducts();
  }, []);
  const fetchProducts = async () => {
    try {
      const {
        data,
        error
      } = await supabase.from('products').select('*').eq('is_active', true).order('name');
      if (error) {
        console.error('Error fetching products:', error);
        // Fallback to sample data if database query fails
        setProducts(sampleProducts);
      } else if (data && data.length > 0) {
        setProducts(data);
      } else {
        // Use sample data if no products in database
        setProducts(sampleProducts);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts(sampleProducts);
    } finally {
      setLoading(false);
    }
  };

  // Memoize categories to prevent recalculation on every render
  const categories = useMemo(() => {
    return ['all', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];
  }, [products]);

  // Memoize filtered and sorted products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    }).sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });
  }, [products, searchTerm, selectedCategory, sortBy]);
  if (loading) {
    return <div className="min-h-screen bg-white">
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
            {[...Array(6)].map((_, i) => (
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
      </div>;
  }
  return <div className="min-h-screen bg-white">
      <HeaderNavBar />
      
      <div className="responsive-container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="responsive-heading font-bold text-black mb-4">Shop NASTEA</h1>
          <p className="responsive-text text-gray-600">
            Discover our premium collection of matcha and wellness products
          </p>
        </div>

        {/* Search and Filters */}
        

        {/* Results Count */}
        <div className="mb-6">
          
        </div>

        {/* Products Grid */}
        <ProductGrid products={filteredProducts} />
      </div>

      <Footer />
    </div>;
};
export default Shop;