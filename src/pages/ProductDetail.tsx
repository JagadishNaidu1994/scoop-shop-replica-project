
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HeaderNavBar from '@/components/HeaderNavBar';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Star, Plus, Minus, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

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
  const [currentIngredient, setCurrentIngredient] = useState(0);

  // Ingredients data
  const ingredients = [
    { name: 'Vitamin B9', amount: '12% RI per serving', icon: '🟡', description: 'Essential for DNA synthesis and repair', percentage: 12 },
    { name: 'Lion\'s Mane', amount: '500mg per serving', icon: '🍄', description: 'Supports cognitive function and focus', percentage: 85 },
    { name: 'Tremella', amount: '300mg per serving', icon: '🤍', description: 'Natural beauty and hydration support', percentage: 60 },
    { name: 'Essential B Vitamins', amount: '5 vitamins', icon: '💊', description: 'Energy metabolism support', percentage: 95 },
    { name: 'Ceremonial Grade Matcha', amount: '2g per serving', icon: '🍵', description: 'Premium quality for sustained energy', percentage: 100 },
  ];

  // Auto-rotate ingredients
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIngredient((prev) => (prev + 1) % ingredients.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

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

  const subscriptionPrice = product.price * 0.8;

  return (
    <div className="min-h-screen bg-white">
      <HeaderNavBar />
      
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <nav className="flex text-sm text-gray-500 mb-8 font-medium">
          <span className="hover:text-gray-700 cursor-pointer" onClick={() => navigate('/')}>Home</span>
          <span className="mx-2">/</span>
          <span className="hover:text-gray-700 cursor-pointer" onClick={() => navigate('/shop')}>Shop</span>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        {/* Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
          {/* Product Images */}
          <div className="space-y-6">
            <div className="relative">
              <Badge className="absolute top-4 left-4 z-10 bg-black text-white text-xs font-medium px-2 py-1">
                BEST SELLER
              </Badge>
              <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden">
                <img
                  src="/lovable-uploads/8edc40eb-3dfa-45fb-8cac-fc1a12ec6a3c.png"
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            {/* Thumbnail Grid */}
            <div className="grid grid-cols-6 gap-3">
              {[1, 2, 3, 4, 5, 6].map((index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index - 1)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index - 1 ? 'border-black' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img 
                    src="/lovable-uploads/8edc40eb-3dfa-45fb-8cac-fc1a12ec6a3c.png" 
                    alt={`${product.name} ${index}`} 
                    className="w-full h-full object-cover" 
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Rating */}
            <div className="flex items-center space-x-2">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="text-sm text-gray-600 font-medium">20,564 Reviews</span>
            </div>

            {/* Product Title */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-gray-900">DIRTEA {product.name}</h1>
              <p className="text-lg text-gray-600 font-medium">Energy, focus, beauty</p>
              <p className="text-gray-600 leading-relaxed">
                The creamiest, ceremonial-grade Matcha with Lion's Mane, Tremella, and essential B vitamins.
              </p>
            </div>

            {/* Benefits */}
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="flex items-center space-x-1 text-sm font-medium">
                <span>⚡</span><span>Energy</span>
              </Badge>
              <Badge variant="outline" className="flex items-center space-x-1 text-sm font-medium">
                <span>🎯</span><span>Focus</span>
              </Badge>
              <Badge variant="outline" className="flex items-center space-x-1 text-sm font-medium">
                <span>✨</span><span>Skin</span>
              </Badge>
            </div>

            <p className="text-sm text-gray-600 font-medium">🥄 30 servings</p>

            {/* Pricing Options */}
            <div className="border border-gray-200 rounded-xl p-6 space-y-4">
              {/* One-time Purchase */}
              <div 
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  subscriptionType === 'one-time' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSubscriptionType('one-time')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <input type="radio" checked={subscriptionType === 'one-time'} readOnly className="w-4 h-4" />
                    <span className="font-semibold">One-time Purchase</span>
                  </div>
                  <span className="text-xl font-bold">£{product.price}</span>
                </div>
              </div>

              {/* Subscribe & Save */}
              <div 
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  subscriptionType === 'subscribe' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSubscriptionType('subscribe')}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <input type="radio" checked={subscriptionType === 'subscribe'} readOnly className="w-4 h-4" />
                    <span className="font-semibold">Subscribe & Save</span>
                    <Badge className="bg-purple-100 text-purple-800 text-xs font-medium">20% OFF</Badge>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-bold">£{subscriptionPrice.toFixed(2)}</span>
                    <p className="text-sm text-gray-500">£{(subscriptionPrice / 30).toFixed(2)} per serving</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3">Pouch only, free gifts NOT included</p>
                
                {subscriptionType === 'subscribe' && (
                  <select 
                    value={subscriptionFrequency}
                    onChange={(e) => setSubscriptionFrequency(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option>Every 4 weeks (Bestseller)</option>
                    <option>Every 6 weeks</option>
                    <option>Every 8 weeks</option>
                  </select>
                )}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={decrementQuantity}
                  className="p-3 hover:bg-gray-100 transition-colors"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-6 py-3 border-x border-gray-300 font-medium">{quantity}</span>
                <button
                  onClick={incrementQuantity}
                  className="p-3 hover:bg-gray-100 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <Button
              onClick={handleAddToCart}
              className="w-full bg-black text-white hover:bg-gray-800 py-4 text-lg font-semibold rounded-lg transition-colors"
            >
              ADD TO CART - £{((subscriptionType === 'subscribe' ? subscriptionPrice : product.price) * quantity).toFixed(2)}
            </Button>

            {/* Buy with Shop Pay */}
            <Button className="w-full bg-purple-600 text-white hover:bg-purple-700 py-4 text-lg font-semibold rounded-lg transition-colors">
              Buy with ShopPay
            </Button>

            <p className="text-sm text-gray-500 text-center">More payment options</p>

            {/* Trust Badges */}
            <div className="flex items-center justify-center space-x-8 text-sm text-gray-600 py-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-black rounded-full"></div>
                <span>Skip or cancel anytime</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-black rounded-full"></div>
                <span>20% off every subscription order</span>
              </div>
            </div>

            {/* Collapsible Sections */}
            <div className="space-y-1 border-t border-gray-200 pt-6">
              <Collapsible>
                <CollapsibleTrigger className="flex items-center justify-between w-full py-4 text-left font-semibold text-gray-900 hover:text-gray-700 transition-colors">
                  <span>Why choose DIRTEA</span>
                  <ChevronDown className="w-5 h-5 transition-transform" />
                </CollapsibleTrigger>
                <CollapsibleContent className="pb-4 text-gray-600 leading-relaxed">
                  Our products are made with the highest quality ingredients, sourced directly from trusted suppliers and rigorously tested for purity and potency.
                </CollapsibleContent>
              </Collapsible>

              <div className="border-t border-gray-200">
                <Collapsible>
                  <CollapsibleTrigger className="flex items-center justify-between w-full py-4 text-left font-semibold text-gray-900 hover:text-gray-700 transition-colors">
                    <span>Ingredients</span>
                    <ChevronDown className="w-5 h-5 transition-transform" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pb-4 text-gray-600 leading-relaxed">
                    100% Organic {product.category} Powder with Lion's Mane, Tremella, and essential B vitamins. All ingredients are carefully sourced and third-party tested.
                  </CollapsibleContent>
                </Collapsible>
              </div>

              <div className="border-t border-gray-200">
                <Collapsible>
                  <CollapsibleTrigger className="flex items-center justify-between w-full py-4 text-left font-semibold text-gray-900 hover:text-gray-700 transition-colors">
                    <span>The Science</span>
                    <ChevronDown className="w-5 h-5 transition-transform" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pb-4 text-gray-600 leading-relaxed">
                    Backed by extensive scientific research and clinical studies. Each ingredient is selected based on proven efficacy and safety profiles.
                  </CollapsibleContent>
                </Collapsible>
              </div>

              <div className="border-t border-gray-200">
                <Collapsible>
                  <CollapsibleTrigger className="flex items-center justify-between w-full py-4 text-left font-semibold text-gray-900 hover:text-gray-700 transition-colors">
                    <span>How to Use</span>
                    <ChevronDown className="w-5 h-5 transition-transform" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pb-4 text-gray-600 leading-relaxed">
                    Add 1-2 teaspoons to your favorite hot or cold beverage. Mix well and enjoy daily for optimal benefits. Best consumed in the morning for sustained energy.
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </div>

            {/* Review Preview */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
                  <img src="/lovable-uploads/26d45a3e-0bd4-4883-89d1-b11b087ead71.png" alt="Katarzyna W" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-semibold text-gray-900">Katarzyna W.</span>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed">"I am in love with matcha. Drink every morning with dash of oat vanilla ❤️"</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ingredients Section */}
        <section className="py-20 bg-gray-50 -mx-6 px-6 mb-20 rounded-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Side - Ingredients Display */}
            <div className="bg-white p-12 rounded-2xl shadow-sm">
              <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center leading-tight">
                Pure ingredients,<br />powerful benefits.
              </h2>
              
              {/* Current Ingredient Display */}
              <div className="text-center">
                <div className="mb-8">
                  <div className="text-7xl mb-6">{ingredients[currentIngredient].icon}</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {ingredients[currentIngredient].name}
                  </h3>
                  <p className="text-lg text-gray-600 mb-4 font-medium">
                    {ingredients[currentIngredient].amount}
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-6 max-w-xs mx-auto">
                    <div 
                      className="bg-yellow-400 h-2 rounded-full transition-all duration-500" 
                      style={{width: `${ingredients[currentIngredient].percentage}%`}}
                    ></div>
                  </div>
                  <p className="text-gray-500 max-w-sm mx-auto leading-relaxed">
                    {ingredients[currentIngredient].description}
                  </p>
                </div>
              </div>

              {/* Dots Indicator */}
              <div className="flex justify-center space-x-2 mt-8">
                {ingredients.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIngredient(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentIngredient ? 'bg-black w-6' : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Right Side - Lifestyle Image */}
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-lg">
                <img 
                  src="/lovable-uploads/a61d3c6a-fc59-45fe-9266-350a3c40ae91.png" 
                  alt="Energy Focus Beauty lifestyle" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <section className="border-t border-gray-200 pt-16">
          <h3 className="text-3xl font-bold text-gray-900 mb-12">Customer Reviews</h3>
          <div className="space-y-8">
            {[
              { name: "Sarah M.", review: "Amazing quality! I've been using this for 3 months now and really notice the difference in my energy levels. Highly recommend!", time: "2 weeks ago" },
              { name: "James L.", review: "The taste is incredible and I feel so much more focused throughout the day. Worth every penny!", time: "1 month ago" },
              { name: "Emma R.", review: "Best matcha I've ever tried. The ceremonial grade quality really shows. Will definitely reorder!", time: "3 weeks ago" }
            ].map((review, index) => (
              <div key={index} className="border-b border-gray-200 pb-8 last:border-b-0">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="font-semibold text-gray-900">{review.name}</span>
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed mb-2">{review.review}</p>
                    <p className="text-sm text-gray-500">Verified Purchase • {review.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
