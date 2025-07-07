
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ImageUpload } from '@/components/ui/image-upload';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, Save } from 'lucide-react';

interface ProductPageContent {
  id?: string;
  product_id: number;
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

interface ProductPageEditorProps {
  productId: number;
  productName: string;
  onClose: () => void;
}

const ProductPageEditor: React.FC<ProductPageEditorProps> = ({ productId, productName, onClose }) => {
  const [content, setContent] = useState<ProductPageContent>({
    product_id: productId,
    hero_title: '',
    hero_subtitle: '',
    hero_description: '',
    hero_image: '',
    features_title: 'Key Features',
    features_list: [''],
    benefits_title: 'Benefits',
    benefits_description: '',
    benefits_image: '',
    ingredients_title: 'Ingredients',
    ingredients_list: [''],
    how_to_use_title: 'How to Use',
    how_to_use_steps: [''],
    testimonials: [{ name: '', content: '', rating: 5 }]
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

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
        setContent({
          ...data,
          features_list: data.features_list || [''],
          ingredients_list: data.ingredients_list || [''],
          how_to_use_steps: data.how_to_use_steps || [''],
          testimonials: data.testimonials || [{ name: '', content: '', rating: 5 }]
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
      const dataToSave = {
        ...content,
        features_list: content.features_list.filter(item => item.trim() !== ''),
        ingredients_list: content.ingredients_list.filter(item => item.trim() !== ''),
        how_to_use_steps: content.how_to_use_steps.filter(item => item.trim() !== ''),
        testimonials: content.testimonials.filter(t => t.name.trim() !== '' && t.content.trim() !== '')
      };

      const { error } = await supabase
        .from('product_page_content')
        .upsert(dataToSave, {
          onConflict: 'product_id'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Product page content saved successfully"
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

  const addListItem = (listType: 'features_list' | 'ingredients_list' | 'how_to_use_steps') => {
    setContent(prev => ({
      ...prev,
      [listType]: [...prev[listType], '']
    }));
  };

  const removeListItem = (listType: 'features_list' | 'ingredients_list' | 'how_to_use_steps', index: number) => {
    setContent(prev => ({
      ...prev,
      [listType]: prev[listType].filter((_, i) => i !== index)
    }));
  };

  const updateListItem = (listType: 'features_list' | 'ingredients_list' | 'how_to_use_steps', index: number, value: string) => {
    setContent(prev => ({
      ...prev,
      [listType]: prev[listType].map((item, i) => i === index ? value : item)
    }));
  };

  const addTestimonial = () => {
    setContent(prev => ({
      ...prev,
      testimonials: [...prev.testimonials, { name: '', content: '', rating: 5 }]
    }));
  };

  const removeTestimonial = (index: number) => {
    setContent(prev => ({
      ...prev,
      testimonials: prev.testimonials.filter((_, i) => i !== index)
    }));
  };

  const updateTestimonial = (index: number, field: 'name' | 'content' | 'rating', value: string | number) => {
    setContent(prev => ({
      ...prev,
      testimonials: prev.testimonials.map((testimonial, i) => 
        i === index ? { ...testimonial, [field]: value } : testimonial
      )
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
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold">Edit Product Page: {productName}</h3>
          <p className="text-gray-600">Customize the individual product page content</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={handleSave} disabled={saving} className="bg-teal-600 hover:bg-teal-700">
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Hero Section */}
        <Card>
          <CardHeader>
            <CardTitle>Hero Section</CardTitle>
            <CardDescription>Main banner content at the top of the product page</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="hero_title">Hero Title</Label>
                <Input
                  id="hero_title"
                  value={content.hero_title}
                  onChange={(e) => setContent(prev => ({ ...prev, hero_title: e.target.value }))}
                  placeholder="Main product title"
                />
              </div>
              <div>
                <Label htmlFor="hero_subtitle">Hero Subtitle</Label>
                <Input
                  id="hero_subtitle"
                  value={content.hero_subtitle}
                  onChange={(e) => setContent(prev => ({ ...prev, hero_subtitle: e.target.value }))}
                  placeholder="Product subtitle"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="hero_description">Hero Description</Label>
              <Textarea
                id="hero_description"
                value={content.hero_description}
                onChange={(e) => setContent(prev => ({ ...prev, hero_description: e.target.value }))}
                placeholder="Product description"
                rows={3}
              />
            </div>
            <div>
              <ImageUpload
                label="Hero Image"
                value={content.hero_image}
                onChange={(url) => setContent(prev => ({ ...prev, hero_image: url }))}
                placeholder="Main product hero image"
              />
            </div>
          </CardContent>
        </Card>

        {/* Features Section */}
        <Card>
          <CardHeader>
            <CardTitle>Features Section</CardTitle>
            <CardDescription>Key features and selling points</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="features_title">Section Title</Label>
              <Input
                id="features_title"
                value={content.features_title}
                onChange={(e) => setContent(prev => ({ ...prev, features_title: e.target.value }))}
              />
            </div>
            <div>
              <Label>Features List</Label>
              {content.features_list.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2 mt-2">
                  <Input
                    value={feature}
                    onChange={(e) => updateListItem('features_list', index, e.target.value)}
                    placeholder={`Feature ${index + 1}`}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeListItem('features_list', index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addListItem('features_list')}
                className="mt-2"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Feature
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Benefits Section */}
        <Card>
          <CardHeader>
            <CardTitle>Benefits Section</CardTitle>
            <CardDescription>Health and wellness benefits</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="benefits_title">Section Title</Label>
              <Input
                id="benefits_title"
                value={content.benefits_title}
                onChange={(e) => setContent(prev => ({ ...prev, benefits_title: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="benefits_description">Benefits Description</Label>
              <Textarea
                id="benefits_description"
                value={content.benefits_description}
                onChange={(e) => setContent(prev => ({ ...prev, benefits_description: e.target.value }))}
                placeholder="Describe the benefits of this product"
                rows={4}
              />
            </div>
            <div>
              <ImageUpload
                label="Benefits Image"
                value={content.benefits_image}
                onChange={(url) => setContent(prev => ({ ...prev, benefits_image: url }))}
                placeholder="Image to illustrate benefits"
              />
            </div>
          </CardContent>
        </Card>

        {/* Ingredients Section */}
        <Card>
          <CardHeader>
            <CardTitle>Ingredients Section</CardTitle>
            <CardDescription>Product ingredients and components</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="ingredients_title">Section Title</Label>
              <Input
                id="ingredients_title"
                value={content.ingredients_title}
                onChange={(e) => setContent(prev => ({ ...prev, ingredients_title: e.target.value }))}
              />
            </div>
            <div>
              <Label>Ingredients List</Label>
              {content.ingredients_list.map((ingredient, index) => (
                <div key={index} className="flex items-center space-x-2 mt-2">
                  <Input
                    value={ingredient}
                    onChange={(e) => updateListItem('ingredients_list', index, e.target.value)}
                    placeholder={`Ingredient ${index + 1}`}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeListItem('ingredients_list', index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addListItem('ingredients_list')}
                className="mt-2"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Ingredient
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* How to Use Section */}
        <Card>
          <CardHeader>
            <CardTitle>How to Use Section</CardTitle>
            <CardDescription>Step-by-step usage instructions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="how_to_use_title">Section Title</Label>
              <Input
                id="how_to_use_title"
                value={content.how_to_use_title}
                onChange={(e) => setContent(prev => ({ ...prev, how_to_use_title: e.target.value }))}
              />
            </div>
            <div>
              <Label>Usage Steps</Label>
              {content.how_to_use_steps.map((step, index) => (
                <div key={index} className="flex items-center space-x-2 mt-2">
                  <Input
                    value={step}
                    onChange={(e) => updateListItem('how_to_use_steps', index, e.target.value)}
                    placeholder={`Step ${index + 1}`}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeListItem('how_to_use_steps', index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addListItem('how_to_use_steps')}
                className="mt-2"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Step
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Testimonials Section */}
        <Card>
          <CardHeader>
            <CardTitle>Testimonials Section</CardTitle>
            <CardDescription>Customer reviews and testimonials</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {content.testimonials.map((testimonial, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Testimonial {index + 1}</h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
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
                  <Label>Testimonial Content</Label>
                  <Textarea
                    value={testimonial.content}
                    onChange={(e) => updateTestimonial(index, 'content', e.target.value)}
                    placeholder="Customer testimonial"
                    rows={3}
                  />
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addTestimonial}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Testimonial
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductPageEditor;
