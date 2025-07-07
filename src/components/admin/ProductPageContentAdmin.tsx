
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ImageUpload } from '@/components/ui/image-upload';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Save, Trash2 } from 'lucide-react';

interface ProductPageContent {
  id: string;
  product_id: number;
  hero_title: string | null;
  hero_subtitle: string | null;
  hero_description: string | null;
  hero_image: string | null;
  features_title: string | null;
  features_list: any[] | null;
  benefits_title: string | null;
  benefits_description: string | null;
  benefits_image: string | null;
  ingredients_title: string | null;
  ingredients_list: any[] | null;
  how_to_use_title: string | null;
  how_to_use_steps: any[] | null;
  testimonials: any[] | null;
}

interface Product {
  id: number;
  name: string;
}

const ProductPageContentAdmin = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [content, setContent] = useState<ProductPageContent | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    hero_title: '',
    hero_subtitle: '',
    hero_description: '',
    hero_image: '',
    features_title: 'Key Features',
    features_list: '',
    benefits_title: 'Benefits',
    benefits_description: '',
    benefits_image: '',
    ingredients_title: 'Ingredients',
    ingredients_list: '',
    how_to_use_title: 'How to Use',
    how_to_use_steps: '',
    testimonials: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (selectedProductId) {
      fetchProductContent(selectedProductId);
    }
  }, [selectedProductId]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive"
      });
    }
  };

  const fetchProductContent = async (productId: number) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('product_page_content')
        .select('*')
        .eq('product_id', productId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setContent(data);
        setFormData({
          hero_title: data.hero_title || '',
          hero_subtitle: data.hero_subtitle || '',
          hero_description: data.hero_description || '',
          hero_image: data.hero_image || '',
          features_title: data.features_title || 'Key Features',
          features_list: Array.isArray(data.features_list) ? data.features_list.join('\n') : '',
          benefits_title: data.benefits_title || 'Benefits',
          benefits_description: data.benefits_description || '',
          benefits_image: data.benefits_image || '',
          ingredients_title: data.ingredients_title || 'Ingredients',
          ingredients_list: Array.isArray(data.ingredients_list) ? data.ingredients_list.join('\n') : '',
          how_to_use_title: data.how_to_use_title || 'How to Use',
          how_to_use_steps: Array.isArray(data.how_to_use_steps) ? data.how_to_use_steps.join('\n') : '',
          testimonials: Array.isArray(data.testimonials) ? data.testimonials.map(t => `${t.name}: ${t.text}`).join('\n') : ''
        });
      } else {
        setContent(null);
        resetForm();
      }
    } catch (error) {
      console.error('Error fetching product content:', error);
      toast({
        title: "Error",
        description: "Failed to fetch product content",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      hero_title: '',
      hero_subtitle: '',
      hero_description: '',
      hero_image: '',
      features_title: 'Key Features',
      features_list: '',
      benefits_title: 'Benefits',
      benefits_description: '',
      benefits_image: '',
      ingredients_title: 'Ingredients',
      ingredients_list: '',
      how_to_use_title: 'How to Use',
      how_to_use_steps: '',
      testimonials: ''
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId) return;

    try {
      const contentData = {
        product_id: selectedProductId,
        hero_title: formData.hero_title || null,
        hero_subtitle: formData.hero_subtitle || null,
        hero_description: formData.hero_description || null,
        hero_image: formData.hero_image || null,
        features_title: formData.features_title || 'Key Features',
        features_list: formData.features_list ? formData.features_list.split('\n').filter(f => f.trim()) : [],
        benefits_title: formData.benefits_title || 'Benefits',
        benefits_description: formData.benefits_description || null,
        benefits_image: formData.benefits_image || null,
        ingredients_title: formData.ingredients_title || 'Ingredients',
        ingredients_list: formData.ingredients_list ? formData.ingredients_list.split('\n').filter(i => i.trim()) : [],
        how_to_use_title: formData.how_to_use_title || 'How to Use',
        how_to_use_steps: formData.how_to_use_steps ? formData.how_to_use_steps.split('\n').filter(s => s.trim()) : [],
        testimonials: formData.testimonials ? formData.testimonials.split('\n').filter(t => t.trim()).map(t => {
          const [name, ...textParts] = t.split(':');
          return { name: name.trim(), text: textParts.join(':').trim() };
        }) : []
      };

      if (content) {
        const { error } = await supabase
          .from('product_page_content')
          .update(contentData)
          .eq('id', content.id);
        
        if (error) throw error;
        toast({ title: "Success", description: "Product page content updated successfully" });
      } else {
        const { error } = await supabase
          .from('product_page_content')
          .insert([contentData]);
        
        if (error) throw error;
        toast({ title: "Success", description: "Product page content created successfully" });
      }

      fetchProductContent(selectedProductId);
    } catch (error) {
      console.error('Error saving product content:', error);
      toast({
        title: "Error",
        description: "Failed to save product content",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Product Page Content Management</h2>
        <p className="text-gray-600">Manage individual product page content and layout</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Product</CardTitle>
          <CardDescription>Choose a product to edit its page content</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {products.map((product) => (
              <Button
                key={product.id}
                variant={selectedProductId === product.id ? "default" : "outline"}
                onClick={() => setSelectedProductId(product.id)}
                className="h-auto p-4 text-left"
              >
                <div>
                  <div className="font-medium">{product.name}</div>
                  <div className="text-sm text-gray-500">ID: {product.id}</div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedProductId && (
        <Card>
          <CardHeader>
            <CardTitle>
              {content ? 'Edit' : 'Create'} Page Content
            </CardTitle>
            <CardDescription>
              Configure the individual product page layout and content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Hero Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Hero Section</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="hero_title">Hero Title</Label>
                    <Input
                      id="hero_title"
                      value={formData.hero_title}
                      onChange={(e) => setFormData({...formData, hero_title: e.target.value})}
                      placeholder="Main product title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="hero_subtitle">Hero Subtitle</Label>
                    <Input
                      id="hero_subtitle"
                      value={formData.hero_subtitle}
                      onChange={(e) => setFormData({...formData, hero_subtitle: e.target.value})}
                      placeholder="Product subtitle"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="hero_description">Hero Description</Label>
                  <Textarea
                    id="hero_description"
                    value={formData.hero_description}
                    onChange={(e) => setFormData({...formData, hero_description: e.target.value})}
                    placeholder="Product description"
                    rows={3}
                  />
                </div>
                <div>
                  <ImageUpload
                    label="Hero Image"
                    value={formData.hero_image}
                    onChange={(url) => setFormData({...formData, hero_image: url})}
                    placeholder="Main product hero image"
                  />
                </div>
              </div>

              {/* Features Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Features Section</h3>
                <div>
                  <Label htmlFor="features_title">Features Title</Label>
                  <Input
                    id="features_title"
                    value={formData.features_title}
                    onChange={(e) => setFormData({...formData, features_title: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="features_list">Features List (one per line)</Label>
                  <Textarea
                    id="features_list"
                    value={formData.features_list}
                    onChange={(e) => setFormData({...formData, features_list: e.target.value})}
                    placeholder="Enter features, one per line"
                    rows={4}
                  />
                </div>
              </div>

              {/* Benefits Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Benefits Section</h3>
                <div>
                  <Label htmlFor="benefits_title">Benefits Title</Label>
                  <Input
                    id="benefits_title"
                    value={formData.benefits_title}
                    onChange={(e) => setFormData({...formData, benefits_title: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="benefits_description">Benefits Description</Label>
                  <Textarea
                    id="benefits_description"
                    value={formData.benefits_description}
                    onChange={(e) => setFormData({...formData, benefits_description: e.target.value})}
                    placeholder="Describe the benefits"
                    rows={3}
                  />
                </div>
                <div>
                  <ImageUpload
                    label="Benefits Image"
                    value={formData.benefits_image}
                    onChange={(url) => setFormData({...formData, benefits_image: url})}
                    placeholder="Benefits section image"
                  />
                </div>
              </div>

              {/* Ingredients Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Ingredients Section</h3>
                <div>
                  <Label htmlFor="ingredients_title">Ingredients Title</Label>
                  <Input
                    id="ingredients_title"
                    value={formData.ingredients_title}
                    onChange={(e) => setFormData({...formData, ingredients_title: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="ingredients_list">Ingredients List (one per line)</Label>
                  <Textarea
                    id="ingredients_list"
                    value={formData.ingredients_list}
                    onChange={(e) => setFormData({...formData, ingredients_list: e.target.value})}
                    placeholder="Enter ingredients, one per line"
                    rows={4}
                  />
                </div>
              </div>

              {/* How to Use Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">How to Use Section</h3>
                <div>
                  <Label htmlFor="how_to_use_title">How to Use Title</Label>
                  <Input
                    id="how_to_use_title"
                    value={formData.how_to_use_title}
                    onChange={(e) => setFormData({...formData, how_to_use_title: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="how_to_use_steps">Usage Steps (one per line)</Label>
                  <Textarea
                    id="how_to_use_steps"
                    value={formData.how_to_use_steps}
                    onChange={(e) => setFormData({...formData, how_to_use_steps: e.target.value})}
                    placeholder="Enter steps, one per line"
                    rows={4}
                  />
                </div>
              </div>

              {/* Testimonials Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Testimonials Section</h3>
                <div>
                  <Label htmlFor="testimonials">Testimonials (format: Name: Testimonial text, one per line)</Label>
                  <Textarea
                    id="testimonials"
                    value={formData.testimonials}
                    onChange={(e) => setFormData({...formData, testimonials: e.target.value})}
                    placeholder="John Doe: This product is amazing!"
                    rows={4}
                  />
                </div>
              </div>

              <div className="flex space-x-2">
                <Button type="submit" className="bg-teal-600 hover:bg-teal-700" disabled={loading}>
                  <Save className="w-4 h-4 mr-2" />
                  {content ? 'Update' : 'Create'} Content
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProductPageContentAdmin;
