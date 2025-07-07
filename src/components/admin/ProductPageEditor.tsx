
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ImageUpload } from '@/components/ui/image-upload';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';

interface ProductPageEditorProps {
  productId: number;
  productName: string;
  onClose: () => void;
}

interface ProductPageContent {
  hero_title: string;
  hero_subtitle: string;
  hero_description: string;
  hero_image: string;
  features_title: string;
  features_list: string[];
  benefits_title: string;
  benefits_description: string;
  benefits_image: string;
  ingredients_title: string;
  ingredients_list: string[];
  how_to_use_title: string;
  how_to_use_steps: string[];
  testimonials: Array<{
    name: string;
    content: string;
    rating: number;
  }>;
}

const ProductPageEditor: React.FC<ProductPageEditorProps> = ({ productId, productName, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<ProductPageContent>({
    hero_title: '',
    hero_subtitle: '',
    hero_description: '',
    hero_image: '',
    features_title: 'Key Features',
    features_list: [],
    benefits_title: 'Benefits',
    benefits_description: '',
    benefits_image: '',
    ingredients_title: 'Ingredients',
    ingredients_list: [],
    how_to_use_title: 'How to Use',
    how_to_use_steps: [],
    testimonials: []
  });

  useEffect(() => {
    fetchProductPageContent();
  }, [productId]);

  const fetchProductPageContent = async () => {
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
        setFormData({
          hero_title: data.hero_title || '',
          hero_subtitle: data.hero_subtitle || '',
          hero_description: data.hero_description || '',
          hero_image: data.hero_image || '',
          features_title: data.features_title || 'Key Features',
          features_list: Array.isArray(data.features_list) ? data.features_list : [],
          benefits_title: data.benefits_title || 'Benefits',
          benefits_description: data.benefits_description || '',
          benefits_image: data.benefits_image || '',
          ingredients_title: data.ingredients_title || 'Ingredients',
          ingredients_list: Array.isArray(data.ingredients_list) ? data.ingredients_list : [],
          how_to_use_title: data.how_to_use_title || 'How to Use',
          how_to_use_steps: Array.isArray(data.how_to_use_steps) ? data.how_to_use_steps : [],
          testimonials: Array.isArray(data.testimonials) ? data.testimonials : []
        });
      }
    } catch (error) {
      console.error('Error fetching product page content:', error);
      toast({
        title: "Error",
        description: "Failed to fetch product page content",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: existingData } = await supabase
        .from('product_page_content')
        .select('id')
        .eq('product_id', productId)
        .single();

      if (existingData) {
        const { error } = await supabase
          .from('product_page_content')
          .update(formData)
          .eq('product_id', productId);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('product_page_content')
          .insert([{
            ...formData,
            product_id: productId
          }]);
        
        if (error) throw error;
      }

      toast({
        title: "Success",
        description: "Product page content updated successfully"
      });
    } catch (error) {
      console.error('Error saving product page content:', error);
      toast({
        title: "Error",
        description: "Failed to save product page content",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const addListItem = (field: 'features_list' | 'ingredients_list' | 'how_to_use_steps') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const updateListItem = (field: 'features_list' | 'ingredients_list' | 'how_to_use_steps', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const removeListItem = (field: 'features_list' | 'ingredients_list' | 'how_to_use_steps', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const addTestimonial = () => {
    setFormData(prev => ({
      ...prev,
      testimonials: [...prev.testimonials, { name: '', content: '', rating: 5 }]
    }));
  };

  const updateTestimonial = (index: number, field: keyof typeof formData.testimonials[0], value: string | number) => {
    setFormData(prev => ({
      ...prev,
      testimonials: prev.testimonials.map((testimonial, i) => 
        i === index ? { ...testimonial, [field]: value } : testimonial
      )
    }));
  };

  const removeTestimonial = (index: number) => {
    setFormData(prev => ({
      ...prev,
      testimonials: prev.testimonials.filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onClose}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Edit Product Page</h2>
            <p className="text-gray-600">{productName}</p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={saving} className="bg-teal-600 hover:bg-teal-700">
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Hero Section */}
        <Card>
          <CardHeader>
            <CardTitle>Hero Section</CardTitle>
            <CardDescription>Main product introduction section</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="hero_title">Hero Title</Label>
              <Input
                id="hero_title"
                value={formData.hero_title}
                onChange={(e) => setFormData(prev => ({ ...prev, hero_title: e.target.value }))}
                placeholder="Product title for hero section"
              />
            </div>
            <div>
              <Label htmlFor="hero_subtitle">Hero Subtitle</Label>
              <Input
                id="hero_subtitle"
                value={formData.hero_subtitle}
                onChange={(e) => setFormData(prev => ({ ...prev, hero_subtitle: e.target.value }))}
                placeholder="Product subtitle"
              />
            </div>
            <div>
              <Label htmlFor="hero_description">Hero Description</Label>
              <Textarea
                id="hero_description"
                value={formData.hero_description}
                onChange={(e) => setFormData(prev => ({ ...prev, hero_description: e.target.value }))}
                placeholder="Detailed product description"
                rows={4}
              />
            </div>
            <ImageUpload
              label="Hero Image"
              value={formData.hero_image}
              onChange={(url) => setFormData(prev => ({ ...prev, hero_image: url }))}
              placeholder="Main hero image"
            />
          </CardContent>
        </Card>

        {/* Features Section */}
        <Card>
          <CardHeader>
            <CardTitle>Features Section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="features_title">Section Title</Label>
              <Input
                id="features_title"
                value={formData.features_title}
                onChange={(e) => setFormData(prev => ({ ...prev, features_title: e.target.value }))}
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Features List</Label>
                <Button type="button" size="sm" onClick={() => addListItem('features_list')}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {formData.features_list.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={feature}
                    onChange={(e) => updateListItem('features_list', index, e.target.value)}
                    placeholder="Feature description"
                  />
                  <Button 
                    type="button" 
                    size="sm" 
                    variant="outline"
                    onClick={() => removeListItem('features_list', index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Benefits Section */}
        <Card>
          <CardHeader>
            <CardTitle>Benefits Section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="benefits_title">Section Title</Label>
              <Input
                id="benefits_title"
                value={formData.benefits_title}
                onChange={(e) => setFormData(prev => ({ ...prev, benefits_title: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="benefits_description">Benefits Description</Label>
              <Textarea
                id="benefits_description"
                value={formData.benefits_description}
                onChange={(e) => setFormData(prev => ({ ...prev, benefits_description: e.target.value }))}
                rows={4}
              />
            </div>
            <ImageUpload
              label="Benefits Image"
              value={formData.benefits_image}
              onChange={(url) => setFormData(prev => ({ ...prev, benefits_image: url }))}
              placeholder="Benefits section image"
            />
          </CardContent>
        </Card>

        {/* Ingredients Section */}
        <Card>
          <CardHeader>
            <CardTitle>Ingredients Section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="ingredients_title">Section Title</Label>
              <Input
                id="ingredients_title"
                value={formData.ingredients_title}
                onChange={(e) => setFormData(prev => ({ ...prev, ingredients_title: e.target.value }))}
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Ingredients List</Label>
                <Button type="button" size="sm" onClick={() => addListItem('ingredients_list')}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {formData.ingredients_list.map((ingredient, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={ingredient}
                    onChange={(e) => updateListItem('ingredients_list', index, e.target.value)}
                    placeholder="Ingredient name"
                  />
                  <Button 
                    type="button" 
                    size="sm" 
                    variant="outline"
                    onClick={() => removeListItem('ingredients_list', index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* How to Use Section */}
        <Card>
          <CardHeader>
            <CardTitle>How to Use Section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="how_to_use_title">Section Title</Label>
              <Input
                id="how_to_use_title"
                value={formData.how_to_use_title}
                onChange={(e) => setFormData(prev => ({ ...prev, how_to_use_title: e.target.value }))}
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Steps</Label>
                <Button type="button" size="sm" onClick={() => addListItem('how_to_use_steps')}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {formData.how_to_use_steps.map((step, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={step}
                    onChange={(e) => updateListItem('how_to_use_steps', index, e.target.value)}
                    placeholder={`Step ${index + 1}`}
                  />
                  <Button 
                    type="button" 
                    size="sm" 
                    variant="outline"
                    onClick={() => removeListItem('how_to_use_steps', index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Testimonials Section */}
        <Card>
          <CardHeader>
            <CardTitle>Testimonials Section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <Label>Customer Testimonials</Label>
              <Button type="button" size="sm" onClick={addTestimonial}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {formData.testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Testimonial {index + 1}</h4>
                    <Button 
                      type="button" 
                      size="sm" 
                      variant="outline"
                      onClick={() => removeTestimonial(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label>Customer Name</Label>
                      <Input
                        value={testimonial.name}
                        onChange={(e) => updateTestimonial(index, 'name', e.target.value)}
                        placeholder="Customer name"
                      />
                    </div>
                    <div>
                      <Label>Rating (1-5)</Label>
                      <Input
                        type="number"
                        min="1"
                        max="5"
                        value={testimonial.rating}
                        onChange={(e) => updateTestimonial(index, 'rating', parseInt(e.target.value))}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Review Content</Label>
                    <Textarea
                      value={testimonial.content}
                      onChange={(e) => updateTestimonial(index, 'content', e.target.value)}
                      placeholder="Customer review"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductPageEditor;
