
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderNavBar from '@/components/HeaderNavBar';
import Footer from '@/components/Footer';
import MatchaLoadingAnimation from '@/components/MatchaLoadingAnimation';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ImageUpload } from '@/components/ui/image-upload';
import { toast } from '@/hooks/use-toast';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  primary_image: string;
  hover_image: string;
  category: string;
  benefits: string[];
  is_active: boolean;
  in_stock: boolean;
  created_at: string;
}

const AdminProducts = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isAdmin, loading } = useAdminCheck();
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
    is_active: true,
    in_stock: true
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    } else if (!loading && !isAdmin) {
      navigate('/');
    } else if (!loading && isAdmin) {
      fetchProducts();
    }
  }, [user, isAdmin, loading, navigate]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching products:', error);
        return;
      }

      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
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
    
    const productData = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      primary_image: formData.primary_image,
      hover_image: formData.hover_image,
      category: formData.category,
      benefits: formData.benefits.split(',').map(b => b.trim()).filter(b => b),
      is_active: formData.is_active,
      in_stock: formData.in_stock,
      created_by: user?.id
    };

    try {
      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id);

        if (error) throw error;
        toast({ title: "Product updated successfully!" });
      } else {
        const { error } = await supabase
          .from('products')
          .insert([productData]);

        if (error) throw error;
        toast({ title: "Product created successfully!" });
      }

      resetForm();
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      toast({ 
        title: "Error saving product", 
        description: "Please try again.",
        variant: "destructive"
      });
    }
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
      is_active: true,
      in_stock: true
    });
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      primary_image: product.primary_image || '',
      hover_image: product.hover_image || '',
      category: product.category || '',
      benefits: product.benefits?.join(', ') || '',
      is_active: product.is_active,
      in_stock: product.in_stock
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: "Product deleted successfully!" });
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({ 
        title: "Error deleting product", 
        description: "Please try again.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <HeaderNavBar />
        <MatchaLoadingAnimation message="Loading products..." />
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
            <h2 className="text-xl font-semibold mb-4">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
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
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={handleInputChange}
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
                  <ImageUpload
                    label="Primary Image"
                    value={formData.primary_image}
                    onChange={(url) => setFormData(prev => ({ ...prev, primary_image: url }))}
                    placeholder="Primary product image"
                  />
                </div>
                <div>
                  <ImageUpload
                    label="Hover Image"
                    value={formData.hover_image}
                    onChange={(url) => setFormData(prev => ({ ...prev, hover_image: url }))}
                    placeholder="Image shown on hover"
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

              <div className="flex items-center space-x-4">
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
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="in_stock"
                    name="in_stock"
                    checked={formData.in_stock}
                    onChange={handleInputChange}
                    className="rounded"
                  />
                  <Label htmlFor="in_stock">In Stock</Label>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button type="submit" className="bg-black text-white hover:bg-gray-800">
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </Button>
                <Button type="button" onClick={resetForm} variant="outline">
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Product List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">All Products ({products.length})</h2>
          {products.length === 0 ? (
            <p className="text-gray-600">No products created yet.</p>
          ) : (
            <div className="grid gap-4">
              {products.map((product) => (
                <div key={product.id} className="bg-white border rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{product.name}</h3>
                      <p className="text-gray-600 text-sm">{product.description}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <span>Price: £{product.price}</span>
                        <span>Category: {product.category || 'N/A'}</span>
                        <span>Status: {product.is_active ? 'Active' : 'Inactive'}</span>
                        <span>Stock: {product.in_stock ? 'In Stock' : 'Out of Stock'}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <Button
                        onClick={() => handleEdit(product)}
                        variant="outline"
                        size="sm"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete(product.id)}
                        variant="destructive"
                        size="sm"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminProducts;
