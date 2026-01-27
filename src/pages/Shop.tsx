import React, { useState, useEffect } from 'react';
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
    console.log('🔍 Starting to fetch products...');
    const startTime = Date.now();

    // Set a timeout to use sample products if query takes too long
    const timeout = setTimeout(() => {
      console.log('⏱️ Query timeout - using sample products');
      setProducts(sampleProducts);
      setLoading(false);
    }, 3000); // 3 second timeout

    try {
      console.log('📡 Querying Supabase...');
      const {
        data,
        error
      } = await supabase
        .from('products')
        .select('id, name, price, primary_image, hover_image, category, benefits, description, in_stock, is_active')
        .eq('is_active', true)
        .order('name');

      // Clear timeout if query completes
      clearTimeout(timeout);

      const elapsed = Date.now() - startTime;
      console.log(`✅ Query completed in ${elapsed}ms`);

      if (error) {
        console.error('❌ Error fetching products:', error);
        console.log('🔄 Using sample products as fallback');
        setProducts(sampleProducts);
      } else if (data && data.length > 0) {
        console.log(`✅ Got ${data.length} products from database`);
        setProducts(data);
      } else {
        console.log('⚠️ No products in database, using sample products');
        setProducts(sampleProducts);
      }
    } catch (error) {
      clearTimeout(timeout);
      console.error('❌ Catch error:', error);
      console.log('🔄 Using sample products as fallback');
      setProducts(sampleProducts);
    } finally {
      console.log('✨ Setting loading to false');
      setLoading(false);
    }
  };
  const filteredProducts = products.filter(product => {
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
  const categories = ['all', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];
  if (loading) {
    return <div className="min-h-screen bg-white">
        <HeaderNavBar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
              <p className="text-gray-600">Loading products...</p>
            </div>
          </div>
        </div>
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
