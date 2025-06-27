
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderNavBar from '@/components/HeaderNavBar';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  primary_image: string;
  hover_image: string;
  category: string;
  benefits: string[];
  is_active: boolean;
  created_at: string;
}

const AdminProducts = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    primary_image: '',
    hover_image: '',
    category: '',
    benefits: '',
    is_active: true
  });

  useEffect(() => {
    if (user) {
      checkAdminStatus();
    } else {
      navigate('/auth');
    }
  }, [user, navigate]);

  const checkAdminStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error) {
        console.error('Not an admin user:', error);
        navigate('/');
        return;
      }

      setIsAdmin(true);
      fetchProducts();
    } catch (error) {
      console.error('Error checking admin status:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    // For now, we'll use mock data since we don't have a products table yet
    const mockProducts: Product[] = [
      {
        id: 1,
        name: 'focus gummies',
        description: 'Focus, memory, cognition',
        price: '£27',
        primary_image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
        hover_image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
        category: 'Gummies',
        benefits: ['Focus', 'Memory', 'Cognition'],
        is_active: true,
        created_at: new Date().toISOString()
      }
    ];
    setProducts(mockProducts);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // For now, just show success message since we don't have products table
    toast({ title: "Product functionality coming soon!" });
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      primary_image: '',
      hover_image: '',
      category: '',
      benefits: '',
      is_active: true
    });
    setShowForm(false);
    setEditingProduct(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <HeaderNavBar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-white">
        <HeaderNavBar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
            <p className="text-gray-600">You don't have permission to access this page.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <HeaderNavBar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-black text-white hover:bg-gray-800"
          >
            Add New Product
          </Button>
        </div>

        {showForm && (
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="price">Price *</Label>
                  <Input
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="£27"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="primary_image">Primary Image URL</Label>
                  <Input
                    id="primary_image"
                    name="primary_image"
                    value={formData.primary_image}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div>
                  <Label htmlFor="hover_image">Hover Image URL</Label>
                  <Input
                    id="hover_image"
                    name="hover_image"
                    value={formData.hover_image}
                    onChange={handleInputChange}
                    placeholder="https://example.com/hover-image.jpg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    placeholder="e.g., Powders, Gummies"
                  />
                </div>
                <div>
                  <Label htmlFor="benefits">Benefits (comma separated)</Label>
                  <Input
                    id="benefits"
                    name="benefits"
                    value={formData.benefits}
                    onChange={handleInputChange}
                    placeholder="Focus, Energy, Immunity"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_active"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleInputChange}
                  className="rounded"
                />
                <Label htmlFor="is_active">Active Product</Label>
              </div>

              <div className="flex space-x-4">
                <Button type="submit" className="bg-black text-white hover:bg-gray-800">
                  Create Product
                </Button>
                <Button type="button" onClick={resetForm} variant="outline">
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Product Management</h2>
          <p className="text-gray-600">
            Product management functionality will be implemented after setting up the products database table. 
            For now, you can manage recipes from the Recipe Management page.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminProducts;
