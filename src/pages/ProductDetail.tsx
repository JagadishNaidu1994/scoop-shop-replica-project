
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import HeaderNavBar from '@/components/HeaderNavBar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { ArrowLeft, Plus, Minus, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Product {
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

interface ProductPageContent {
  hero_title: string | null;
  hero_subtitle: string | null;
  hero_description: string | null;
  hero_image: string | null;
  features_title: string | null;
  features_list: string[] | null;
  benefits_title: string | null;
  benefits_description: string | null;
  benefits_image: string | null;
  ingredients_title: string | null;
  ingredients_list: string[] | null;
  how_to_use_title: string | null;
  how_to_use_steps: string[] | null;
  testimonials: Array<{name: string, text: string}> | null;
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [pageContent, setPageContent] = useState<ProductPageContent | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchProduct(parseInt(id));
      fetchPageContent(parseInt(id));
    }
  }, [id]);

  const fetchProduct = async (productId: number) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Error fetching product:', error);
        return;
      }

      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPageContent = async (productId: number) => {
    try {
      const { data, error } = await supabase
        .from('product_page_content')
        .select('*')
        .eq('product_id', productId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching page content:', error);
        return;
      }

      if (data) {
        const processedContent: ProductPageContent = {
          ...data,
          features_list: Array.isArray(data.features_list) ? data.features_list : [],
          ingredients_list: Array.isArray(data.ingredients_list) ? data.ingredients_list : [],
          how_to_use_steps: Array.isArray(data.how_to_use_steps) ? data.how_to_use_steps : [],
          testimonials: Array.isArray(data.testimonials) ? data.testimonials.map((t: any) => ({
            name: t.name || '',
            text: t.text || ''
          })) : []
        };
        setPageContent(processedContent);
      }
    } catch (error) {
      console.error('Error fetching page content:', error);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.primary_image || '',
      quantity: quantity
    });

    toast({
      title: "Added to cart",
      description: `${quantity} ${product.name} added to your cart`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <HeaderNavBar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <HeaderNavBar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
            <p className="text-gray-600 mb-8">The product you're looking for doesn't exist or isn't available.</p>
            <Button onClick={() => navigate('/shop')} className="bg-teal-600 hover:bg-teal-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Shop
            </Button>
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
        <Button 
          onClick={() => navigate('/shop')} 
          variant="outline" 
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Shop
        </Button>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {pageContent?.hero_title || product.name}
              </h1>
              {pageContent?.hero_subtitle && (
                <p className="text-xl text-gray-600 mb-4">{pageContent.hero_subtitle}</p>
              )}
              <p className="text-gray-700 leading-relaxed">
                {pageContent?.hero_description || product.description}
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-teal-600">£{product.price}</span>
              {product.category && (
                <Badge variant="outline" className="text-sm">
                  {product.category}
                </Badge>
              )}
            </div>

            {product.benefits && product.benefits.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Benefits:</h3>
                <div className="flex flex-wrap gap-2">
                  {product.benefits.map((benefit, index) => (
                    <Badge key={index} variant="secondary">
                      {benefit}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center space-x-4 pt-4">
              <div className="flex items-center border rounded-lg">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="px-4 py-2 font-medium">{quantity}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <Button
                onClick={handleAddToCart}
                disabled={!product.in_stock}
                className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3"
              >
                {product.in_stock ? 'Add to Cart' : 'Out of Stock'}
              </Button>
            </div>
          </div>

          <div className="flex justify-center">
            <img
              src={pageContent?.hero_image || product.primary_image || '/placeholder.svg'}
              alt={product.name}
              className="w-full max-w-md h-auto object-contain rounded-lg"
            />
          </div>
        </div>

        {/* Features Section */}
        {pageContent?.features_list && pageContent.features_list.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              {pageContent?.features_title || 'Key Features'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pageContent.features_list.map((feature, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <p className="text-gray-700">{feature}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Benefits Section */}
        {pageContent?.benefits_description && (
          <section className="mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  {pageContent?.benefits_title || 'Benefits'}
                </h2>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {pageContent.benefits_description}
                </p>
              </div>
              {pageContent?.benefits_image && (
                <div className="flex justify-center">
                  <img
                    src={pageContent.benefits_image}
                    alt="Benefits"
                    className="w-full max-w-md h-auto object-contain rounded-lg"
                  />
                </div>
              )}
            </div>
          </section>
        )}

        {/* Ingredients Section */}
        {pageContent?.ingredients_list && pageContent.ingredients_list.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              {pageContent?.ingredients_title || 'Ingredients'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
              {pageContent.ingredients_list.map((ingredient, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">{ingredient}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* How to Use Section */}
        {pageContent?.how_to_use_steps && pageContent.how_to_use_steps.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              {pageContent?.how_to_use_title || 'How to Use'}
            </h2>
            <div className="space-y-6 max-w-4xl mx-auto">
              {pageContent.how_to_use_steps.map((step, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <p className="text-gray-700 pt-1">{step}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Testimonials Section */}
        {pageContent?.testimonials && pageContent.testimonials.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              What Our Customers Say
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pageContent.testimonials.map((testimonial, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-700 mb-4">"{testimonial.text}"</p>
                    <p className="font-semibold text-gray-900">- {testimonial.name}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
