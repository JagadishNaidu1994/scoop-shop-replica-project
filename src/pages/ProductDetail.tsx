
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HeaderNavBar from '@/components/HeaderNavBar';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Star, ShoppingCart, Heart, Share2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';

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

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [pageContent, setPageContent] = useState<ProductPageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const productId = parseInt(id!);
      
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .eq('is_active', true)
        .single();

      if (productError) throw productError;
      
      setProduct(productData);
      setSelectedImage(productData.primary_image || '');

      // Fetch product page content
      const { data: contentData, error: contentError } = await supabase
        .from('product_page_content')
        .select('*')
        .eq('product_id', productId)
        .single();

      if (contentError && contentError.code !== 'PGRST116') {
        console.error('Error fetching product page content:', contentError);
      } else if (contentData) {
        setPageContent({
          hero_title: contentData.hero_title || '',
          hero_subtitle: contentData.hero_subtitle || '',
          hero_description: contentData.hero_description || '',
          hero_image: contentData.hero_image || '',
          features_title: contentData.features_title || 'Key Features',
          features_list: Array.isArray(contentData.features_list) ? contentData.features_list : [],
          benefits_title: contentData.benefits_title || 'Benefits',
          benefits_description: contentData.benefits_description || '',
          benefits_image: contentData.benefits_image || '',
          ingredients_title: contentData.ingredients_title || 'Ingredients',
          ingredients_list: Array.isArray(contentData.ingredients_list) ? contentData.ingredients_list : [],
          how_to_use_title: contentData.how_to_use_title || 'How to Use',
          how_to_use_steps: Array.isArray(contentData.how_to_use_steps) ? contentData.how_to_use_steps : [],
          testimonials: Array.isArray(contentData.testimonials) ? contentData.testimonials : []
        });
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      navigate('/shop');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    addToCart({
      name: product.name,
      price: product.price,
      image: product.primary_image || '',
      quantity: quantity
    });
    
    toast({
      title: "Added to cart",
      description: `${quantity} ${product.name} added to your cart`
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
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

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <HeaderNavBar />
        <div className="w-full px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
            <Button onClick={() => navigate('/shop')}>
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
      
      <main className="w-full">
        {/* Hero Section */}
        <section className="w-full py-12 bg-gray-50">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Product Images */}
              <div className="space-y-4">
                <div className="aspect-square overflow-hidden rounded-lg bg-white">
                  <img
                    src={selectedImage || pageContent?.hero_image || product.primary_image || '/placeholder.svg'}
                    alt={pageContent?.hero_title || product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {(product.primary_image || product.hover_image) && (
                  <div className="flex space-x-4">
                    {product.primary_image && (
                      <button
                        onClick={() => setSelectedImage(product.primary_image)}
                        className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                          selectedImage === product.primary_image ? 'border-black' : 'border-gray-200'
                        }`}
                      >
                        <img
                          src={product.primary_image}
                          alt="Primary"
                          className="w-full h-full object-cover"
                        />
                      </button>
                    )}
                    {product.hover_image && (
                      <button
                        onClick={() => setSelectedImage(product.hover_image)}
                        className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                          selectedImage === product.hover_image ? 'border-black' : 'border-gray-200'
                        }`}
                      >
                        <img
                          src={product.hover_image}
                          alt="Hover"
                          className="w-full h-full object-cover"
                        />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="space-y-6">
                <div>
                  {product.category && (
                    <Badge variant="outline" className="mb-2">
                      {product.category}
                    </Badge>
                  )}
                  <h1 className="text-3xl font-bold text-gray-900">
                    {pageContent?.hero_title || product.name}
                  </h1>
                  {pageContent?.hero_subtitle && (
                    <p className="text-lg text-gray-600 mt-2">{pageContent.hero_subtitle}</p>
                  )}
                </div>

                <div className="text-2xl font-bold text-gray-900">
                  £{product.price.toFixed(2)}
                </div>

                <p className="text-gray-600 leading-relaxed">
                  {pageContent?.hero_description || product.description}
                </p>

                {(product.benefits || pageContent?.features_list) && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {pageContent?.features_title || 'Benefits'}
                    </h3>
                    <ul className="space-y-1">
                      {(pageContent?.features_list || product.benefits || []).map((benefit, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-gray-600">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <label htmlFor="quantity" className="text-sm font-medium text-gray-700">
                      Quantity:
                    </label>
                    <select
                      id="quantity"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value))}
                      className="border border-gray-300 rounded-md px-3 py-2"
                    >
                      {[1, 2, 3, 4, 5].map((num) => (
                        <option key={num} value={num}>
                          {num}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex space-x-4">
                    <Button
                      onClick={handleAddToCart}
                      disabled={!product.in_stock}
                      className="flex-1 bg-black text-white hover:bg-gray-800"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      {product.in_stock ? 'Add to Cart' : 'Out of Stock'}
                    </Button>
                    <Button variant="outline" size="icon">
                      <Heart className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        {pageContent?.benefits_description && (
          <section className="w-full py-16">
            <div className="w-full px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    {pageContent.benefits_title}
                  </h2>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    {pageContent.benefits_description}
                  </p>
                </div>
                {pageContent.benefits_image && (
                  <div className="aspect-video overflow-hidden rounded-lg">
                    <img
                      src={pageContent.benefits_image}
                      alt={pageContent.benefits_title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Ingredients Section */}
        {pageContent?.ingredients_list && pageContent.ingredients_list.length > 0 && (
          <section className="w-full py-16 bg-gray-50">
            <div className="w-full px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {pageContent.ingredients_title}
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pageContent.ingredients_list.map((ingredient, index) => (
                  <Card key={index}>
                    <CardContent className="p-6 text-center">
                      <h3 className="font-semibold text-gray-900">{ingredient}</h3>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* How to Use Section */}
        {pageContent?.how_to_use_steps && pageContent.how_to_use_steps.length > 0 && (
          <section className="w-full py-16">
            <div className="w-full px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {pageContent.how_to_use_title}
                </h2>
              </div>
              <div className="space-y-8">
                {pageContent.how_to_use_steps.map((step, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-semibold">
                      {index + 1}
                    </div>
                    <p className="text-gray-700 text-lg pt-2">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Testimonials Section */}
        {pageContent?.testimonials && pageContent.testimonials.length > 0 && (
          <section className="w-full py-16 bg-gray-50">
            <div className="w-full px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  What Our Customers Say
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {pageContent.testimonials.map((testimonial, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        {renderStars(testimonial.rating)}
                      </div>
                      <p className="text-gray-600 mb-4">"{testimonial.content}"</p>
                      <p className="font-semibold text-gray-900">- {testimonial.name}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
