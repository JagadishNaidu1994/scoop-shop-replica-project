import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HeaderNavBar from '@/components/HeaderNavBar';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Star, Plus, Minus, Shield, Truck, RotateCcw } from 'lucide-react';
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
}

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const productId = parseInt(id as string);
      if (isNaN(productId)) {
        navigate('/shop');
        return;
      }

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Error fetching product:', error);
        navigate('/shop');
        return;
      }

      setProduct(data);
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
      product_id: product.id,
      product_name: product.name,
      product_price: product.price,
      quantity: quantity,
      product_image: product.primary_image
    });
    
    toast({
      title: "Added to cart!",
      description: `${quantity}x ${product.name} added to your cart.`,
    });
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
            <Button onClick={() => navigate('/shop')}>Back to Shop</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const productImages = [product.primary_image, product.hover_image].filter(Boolean);

  return (
    <div className="min-h-screen bg-white">
      <HeaderNavBar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex text-sm text-gray-500 mb-8">
          <span className="hover:text-gray-700 cursor-pointer" onClick={() => navigate('/')}>Home</span>
          <span className="mx-2">/</span>
          <span className="hover:text-gray-700 cursor-pointer" onClick={() => navigate('/shop')}>Shop</span>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
              <img
                src={productImages[selectedImage] || product.primary_image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {productImages.length > 1 && (
              <div className="flex space-x-2">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? 'border-black' : 'border-gray-200'
                    }`}
                  >
                    <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <span className="text-sm text-gray-600">4.8 (127 reviews)</span>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed">{product.description}</p>
            </div>

            {/* Benefits */}
            {product.benefits && product.benefits.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Benefits</h3>
                <div className="grid grid-cols-2 gap-2">
                  {product.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Price */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-3xl font-bold text-gray-900">£{product.price}</span>
                  <span className="text-sm text-gray-500 ml-2">One-time purchase</span>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-sm font-medium text-gray-900">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    className="p-2 hover:bg-gray-100"
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
                  <button
                    onClick={() => setQuantity(prev => prev + 1)}
                    className="p-2 hover:bg-gray-100"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <Button
                onClick={handleAddToCart}
                className="w-full bg-black text-white hover:bg-gray-800 py-3 text-lg font-medium mb-4"
              >
                Add to Cart - £{(product.price * quantity).toFixed(2)}
              </Button>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <Shield className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                  <p className="text-xs text-gray-600">Secure Payment</p>
                </div>
                <div className="text-center">
                  <Truck className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                  <p className="text-xs text-gray-600">Free Shipping</p>
                </div>
                <div className="text-center">
                  <RotateCcw className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                  <p className="text-xs text-gray-600">30-Day Returns</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16 border-t border-gray-200 pt-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">How to Use</h3>
              <div className="space-y-4 text-gray-700">
                <p>1. Add 1-2 teaspoons to your favorite beverage</p>
                <p>2. Mix well until fully dissolved</p>
                <p>3. Enjoy immediately for best results</p>
                <p>4. Use daily for optimal benefits</p>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Ingredients</h3>
              <p className="text-gray-700">
                100% Organic {product.category} Powder. No artificial additives, preservatives, or fillers.
                Sourced from premium suppliers and third-party tested for purity and potency.
              </p>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16 border-t border-gray-200 pt-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Customer Reviews</h3>
          <div className="space-y-6">
            {[1, 2, 3].map((review) => (
              <div key={review} className="border-b border-gray-200 pb-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-medium text-gray-900">Sarah M.</span>
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700">
                      Amazing quality! I've been using this for 3 months now and really notice the difference in my energy levels. Highly recommend!
                    </p>
                    <p className="text-sm text-gray-500 mt-2">Verified Purchase • 2 weeks ago</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
