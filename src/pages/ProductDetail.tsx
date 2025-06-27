import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HeaderNavBar from '@/components/HeaderNavBar';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Star, Plus, Minus, Shield, Truck, RotateCcw, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

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
  const [subscriptionType, setSubscriptionType] = useState<'one-time' | 'subscribe'>('one-time');
  const [subscriptionFrequency, setSubscriptionFrequency] = useState('Every 4 weeks');

  // Mock data for ingredients carousel
  const ingredients = [
    { name: 'Vitamin B9', amount: '12% RI per serving', icon: '🟡', description: 'Essential for DNA synthesis and repair' },
    { name: 'Lion\'s Mane', amount: '500mg per serving', icon: '🍄', description: 'Supports cognitive function and focus' },
    { name: 'Tremella', amount: '300mg per serving', icon: '🤍', description: 'Natural beauty and hydration support' },
    { name: 'Essential B Vitamins', amount: '5 vitamins', icon: '💊', description: 'Energy metabolism support' },
    { name: 'Ceremonial Grade Matcha', amount: '2g per serving', icon: '🍵', description: 'Premium quality for sustained energy' },
  ];

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
  const subscriptionPrice = product.price * 0.8; // 20% discount for subscription

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

        {/* First Section - Enhanced Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Product Images with Carousel - Updated with more bottom space */}
          <div className="flex flex-col h-full">
            <div className="relative flex-1 mb-6">
              <Badge className="absolute top-4 left-4 z-10 bg-black text-white">BEST SELLER</Badge>
              <div className="h-[600px] overflow-hidden rounded-lg bg-gray-100">
                <img
                  src="/lovable-uploads/8edc40eb-3dfa-45fb-8cac-fc1a12ec6a3c.png"
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            {/* Thumbnail Carousel - Made bigger with more spacing */}
            <div className="mt-6">
              <Carousel className="w-full max-w-lg mx-auto">
                <CarouselContent>
                  {[1, 2, 3, 4, 5, 6].map((index) => (
                    <CarouselItem key={index} className="basis-1/4">
                      <button
                        onClick={() => setSelectedImage(index - 1)}
                        className={`w-full aspect-square rounded-lg overflow-hidden border-2 ${
                          selectedImage === index - 1 ? 'border-black' : 'border-gray-200'
                        }`}
                      >
                        <img 
                          src="/lovable-uploads/8edc40eb-3dfa-45fb-8cac-fc1a12ec6a3c.png" 
                          alt={`${product.name} ${index}`} 
                          className="w-full h-full object-cover" 
                        />
                      </button>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
          </div>

          {/* Enhanced Product Info - Reduced spacing */}
          <div className="flex flex-col h-full space-y-3">
            <div className="flex items-center space-x-2 mb-1">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="text-sm text-gray-600">20,564 Reviews</span>
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">DIRTEA {product.name}</h1>
              <p className="text-gray-600 text-base mb-2">Energy, focus, beauty</p>
              <p className="text-sm text-gray-600 mb-3">
                The creamiest, ceremonial-grade Matcha with Lion's Mane, Tremella, and essential B vitamins.
              </p>
              <div className="flex items-center space-x-3 mb-3">
                <Badge variant="outline" className="flex items-center space-x-1 text-xs">
                  <span>⚡</span><span>Energy</span>
                </Badge>
                <Badge variant="outline" className="flex items-center space-x-1 text-xs">
                  <span>🎯</span><span>Focus</span>
                </Badge>
                <Badge variant="outline" className="flex items-center space-x-1 text-xs">
                  <span>✨</span><span>Skin</span>
                </Badge>
              </div>
              <p className="text-sm text-gray-600">🥄 30 servings</p>
            </div>

            {/* Pricing Options - Reduced spacing */}
            <div className="border rounded-lg p-3 space-y-3">
              {/* One-time Purchase */}
              <div 
                className={`p-3 border rounded-lg cursor-pointer ${subscriptionType === 'one-time' ? 'border-black bg-gray-50' : 'border-gray-200'}`}
                onClick={() => setSubscriptionType('one-time')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input type="radio" checked={subscriptionType === 'one-time'} readOnly />
                    <span className="font-medium text-sm">One-time Purchase</span>
                  </div>
                  <span className="text-lg font-bold">£{product.price}</span>
                </div>
              </div>

              {/* Subscribe & Save */}
              <div 
                className={`p-3 border rounded-lg cursor-pointer ${subscriptionType === 'subscribe' ? 'border-black bg-gray-50' : 'border-gray-200'}`}
                onClick={() => setSubscriptionType('subscribe')}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <input type="radio" checked={subscriptionType === 'subscribe'} readOnly />
                    <span className="font-medium text-sm">Subscribe & Save</span>
                    <Badge className="bg-purple-100 text-purple-800 text-xs">20% OFF</Badge>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold">£{subscriptionPrice.toFixed(2)}</span>
                    <p className="text-xs text-gray-500">£{(subscriptionPrice * 0.117).toFixed(2)} per serving</p>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mb-2">Pouch only, free gifts NOT included</p>
                
                {subscriptionType === 'subscribe' && (
                  <select 
                    value={subscriptionFrequency}
                    onChange={(e) => setSubscriptionFrequency(e.target.value)}
                    className="w-full p-2 border rounded-md text-sm"
                  >
                    <option>Every 4 weeks (Bestseller)</option>
                    <option>Every 6 weeks</option>
                    <option>Every 8 weeks</option>
                  </select>
                )}
              </div>
            </div>

            {/* Quantity Selector - Reduced spacing */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center border border-gray-300 rounded-md">
                <button
                  onClick={decrementQuantity}
                  className="p-2 hover:bg-gray-100"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
                <button
                  onClick={incrementQuantity}
                  className="p-2 hover:bg-gray-100"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Add to Cart Button - Reduced spacing */}
            <Button
              onClick={handleAddToCart}
              className="w-full bg-black text-white hover:bg-gray-800 py-2 text-base font-medium mb-2"
            >
              ADD TO CART - £{((subscriptionType === 'subscribe' ? subscriptionPrice : product.price) * quantity).toFixed(2)}
            </Button>

            {/* Buy with Shop Pay - Reduced spacing */}
            <Button className="w-full bg-purple-600 text-white hover:bg-purple-700 py-2 text-base font-medium mb-2">
              Buy with ShopPay
            </Button>

            <p className="text-xs text-gray-500 text-center mb-2">More payment options</p>

            {/* Trust Badges - Reduced spacing */}
            <div className="flex items-center space-x-4 text-xs text-gray-600 mb-3">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-black rounded-full"></div>
                <span>Skip or cancel anytime</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-black rounded-full"></div>
                <span>20% off every subscription order</span>
              </div>
            </div>

            {/* Collapsible Sections - Reduced spacing */}
            <div className="space-y-2 border-t pt-3">
              <Collapsible>
                <CollapsibleTrigger className="flex items-center justify-between w-full py-2 border-b text-sm">
                  <span className="font-medium">Why choose DIRTEA</span>
                  <ChevronDown className="w-4 h-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="py-2 text-gray-600 text-sm">
                  Our products are made with the highest quality ingredients, sourced directly from trusted suppliers.
                </CollapsibleContent>
              </Collapsible>

              <Collapsible>
                <CollapsibleTrigger className="flex items-center justify-between w-full py-2 border-b text-sm">
                  <span className="font-medium">Ingredients</span>
                  <ChevronDown className="w-4 h-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="py-2 text-gray-600 text-sm">
                  100% Organic {product.category} Powder with Lion's Mane, Tremella, and essential B vitamins.
                </CollapsibleContent>
              </Collapsible>

              <Collapsible>
                <CollapsibleTrigger className="flex items-center justify-between w-full py-2 border-b text-sm">
                  <span className="font-medium">The Science</span>
                  <ChevronDown className="w-4 h-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="py-2 text-gray-600 text-sm">
                  Backed by scientific research and third-party tested for purity and potency.
                </CollapsibleContent>
              </Collapsible>

              <Collapsible>
                <CollapsibleTrigger className="flex items-center justify-between w-full py-2 border-b text-sm">
                  <span className="font-medium">How to Use</span>
                  <ChevronDown className="w-4 h-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="py-2 text-gray-600 text-sm">
                  Add 1-2 teaspoons to your favorite beverage, mix well, and enjoy daily for optimal benefits.
                </CollapsibleContent>
              </Collapsible>
            </div>

            {/* Review Preview - Reduced spacing */}
            <div className="border-t pt-3">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gray-300 rounded-full overflow-hidden">
                  <img src="/lovable-uploads/26d45a3e-0bd4-4883-89d1-b11b087ead71.png" alt="Katarzyna W" className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-sm">Katarzyna W.</span>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-600">"I am in love with matcha. Drink every morning with dash of oat vanilla ❤️"</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Second Section - Ingredients Carousel matching the reference image */}
        <section className="py-20 bg-gray-50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Side - Ingredients with Auto-scrolling Display */}
              <div className="bg-white p-8 rounded-2xl">
                <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
                  Pure ingredients, powerful benefits.
                </h2>
                
                {/* Single ingredient display that changes automatically */}
                <div className="text-center mb-8">
                  <div className="mb-6">
                    <div className="text-6xl mb-4">🟡</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Vitamin B9</h3>
                    <p className="text-lg text-gray-600 mb-2">12% RI per serving</p>
                    <div className="w-full bg-gray-200 rounded-full h-1 mb-4">
                      <div className="bg-yellow-400 h-1 rounded-full" style={{width: '12%'}}></div>
                    </div>
                    <p className="text-sm text-gray-500 max-w-xs mx-auto">Essential for DNA synthesis and repair</p>
                  </div>
                </div>

                {/* Dots indicator */}
                <div className="flex justify-center space-x-2">
                  {ingredients.map((_, index) => (
                    <div 
                      key={index} 
                      className={`w-2 h-2 rounded-full ${index === 0 ? 'bg-black' : 'bg-gray-300'}`}
                    ></div>
                  ))}
                </div>
              </div>

              {/* Right Side - Lifestyle Image with Products */}
              <div className="relative">
                <div className="aspect-square rounded-2xl overflow-hidden">
                  <img 
                    src="/lovable-uploads/a61d3c6a-fc59-45fe-9266-350a3c40ae91.png" 
                    alt="Energy Focus Beauty lifestyle" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

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
