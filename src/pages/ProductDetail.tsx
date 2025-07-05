
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HeaderNavBar from '@/components/HeaderNavBar';
import Footer from '@/components/Footer';
import AdminImageUpload from '@/components/AdminImageUpload';
import { supabase } from '@/integrations/supabase/client';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Star, Plus, Minus, ChevronDown, Heart, Share2, Truck, Shield, RefreshCw, Award, CheckCircle, X, Microscope, Leaf, Users, Globe, Zap, Brain, Sparkles, TrendingUp, Camera, Play } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

  const ingredients = [
    { name: 'Vitamin B9', amount: '12% RI per serving', icon: '🟡', description: 'Essential for DNA synthesis and repair', percentage: 12 },
    { name: 'Lion\'s Mane', amount: '500mg per serving', icon: '🍄', description: 'Supports cognitive function and focus', percentage: 85 },
    { name: 'Tremella', amount: '300mg per serving', icon: '🤍', description: 'Natural beauty and hydration support', percentage: 60 },
    { name: 'Essential B Vitamins', amount: '5 vitamins', icon: '💊', description: 'Energy metabolism support', percentage: 95 },
    { name: 'Ceremonial Grade Matcha', amount: '2g per serving', icon: '🍵', description: 'Premium quality for sustained energy', percentage: 100 },
  ];

  const productImages = [
    '/lovable-uploads/8edc40eb-3dfa-45fb-8cac-fc1a12ec6a3c.png',
    '/lovable-uploads/8edc40eb-3dfa-45fb-8cac-fc1a12ec6a3c.png',
    '/lovable-uploads/8edc40eb-3dfa-45fb-8cac-fc1a12ec6a3c.png',
    '/lovable-uploads/8edc40eb-3dfa-45fb-8cac-fc1a12ec6a3c.png',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIngredient((prev) => (prev + 1) % ingredients.length);
    }, 4000);
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
      product_price: subscriptionType === 'subscribe' ? product.price * 0.8 : product.price,
      quantity: quantity,
      product_image: product.primary_image
    });
    
    toast({
      title: "Added to cart!",
      description: `${quantity}x ${product.name} added to your cart.`,
    });
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast({
      title: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
      description: isWishlisted ? "Item removed from your wishlist" : "Item saved to your wishlist",
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        text: product?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Product link copied to clipboard",
      });
    }
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
      
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex text-sm text-gray-500 font-medium">
          <span className="hover:text-gray-700 cursor-pointer" onClick={() => navigate('/')}>Home</span>
          <span className="mx-2">/</span>
          <span className="hover:text-gray-700 cursor-pointer" onClick={() => navigate('/shop')}>Shop</span>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative group">
              <Badge className="absolute top-6 left-6 z-10 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold px-3 py-1 rounded-full">
                BEST SELLER
              </Badge>
              <div 
                className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden cursor-zoom-in"
                onClick={() => setShowImageModal(true)}
              >
                <AdminImageUpload
                  src={productImages[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  imagePath="product-detail-main"
                />
              </div>
              
              {/* Floating Action Buttons */}
              <div className="absolute top-6 right-6 flex flex-col space-y-2">
                <button
                  onClick={handleWishlist}
                  className={`p-3 rounded-full backdrop-blur-md transition-all duration-200 ${
                    isWishlisted 
                      ? 'bg-red-500 text-white shadow-lg' 
                      : 'bg-white/80 text-gray-600 hover:bg-white hover:shadow-lg'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={handleShare}
                  className="p-3 rounded-full bg-white/80 backdrop-blur-md text-gray-600 hover:bg-white hover:shadow-lg transition-all duration-200"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Thumbnail Grid */}
            <div className="grid grid-cols-4 gap-3">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                    selectedImage === index 
                      ? 'border-black shadow-lg scale-105' 
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  <AdminImageUpload
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                    imagePath={`product-detail-thumbnail-${index + 1}`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            {/* Rating and Reviews */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <span className="text-sm text-gray-600 font-medium ml-2">4.9</span>
              </div>
              <span className="text-sm text-gray-500">•</span>
              <span className="text-sm text-gray-600 font-medium">20,564 Reviews</span>
              <span className="text-sm text-gray-500">•</span>
              <span className="text-sm text-green-600 font-medium">✓ Verified Reviews</span>
            </div>

            {/* Product Title and Description */}
            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-gray-900 leading-tight">
                DIRTEA {product.name}
              </h1>
              <p className="text-xl text-gray-600 font-medium">
                Energy, focus, beauty
              </p>
              <p className="text-gray-700 leading-relaxed text-lg">
                The creamiest, ceremonial-grade Matcha with Lion's Mane, Tremella, and essential B vitamins.
              </p>
            </div>

            {/* Benefits Badges */}
            <div className="flex flex-wrap gap-3">
              <Badge variant="outline" className="flex items-center space-x-2 px-4 py-2 text-sm font-semibold bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
                <span>⚡</span><span>Energy</span>
              </Badge>
              <Badge variant="outline" className="flex items-center space-x-2 px-4 py-2 text-sm font-semibold bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                <span>🎯</span><span>Focus</span>
              </Badge>
              <Badge variant="outline" className="flex items-center space-x-2 px-4 py-2 text-sm font-semibold bg-gradient-to-r from-pink-50 to-rose-50 border-pink-200">
                <span>✨</span><span>Skin</span>
              </Badge>
            </div>

            {/* Servings Info */}
            <div className="flex items-center space-x-2 text-gray-600">
              <span className="text-2xl">🥄</span>
              <span className="font-semibold">30 servings</span>
              <span className="text-gray-400">•</span>
              <span className="text-sm">£{(product.price / 30).toFixed(2)} per serving</span>
            </div>

            {/* Pricing Options */}
            <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
              <h3 className="font-semibold text-lg text-gray-900 mb-4">Choose Your Option</h3>
              
              {/* One-time Purchase */}
              <div 
                className={`p-5 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                  subscriptionType === 'one-time' 
                    ? 'border-black bg-white shadow-md' 
                    : 'border-gray-200 hover:border-gray-300 bg-white/50'
                }`}
                onClick={() => setSubscriptionType('one-time')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <input type="radio" checked={subscriptionType === 'one-time'} readOnly className="w-5 h-5" />
                    <div>
                      <span className="font-semibold text-lg">One-time Purchase</span>
                      <p className="text-sm text-gray-500">No commitment, order when you want</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold">£{product.price}</span>
                  </div>
                </div>
              </div>

              {/* Subscribe & Save */}
              <div 
                className={`p-5 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                  subscriptionType === 'subscribe' 
                    ? 'border-black bg-white shadow-md' 
                    : 'border-gray-200 hover:border-gray-300 bg-white/50'
                }`}
                onClick={() => setSubscriptionType('subscribe')}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <input type="radio" checked={subscriptionType === 'subscribe'} readOnly className="w-5 h-5" />
                    <div>
                      <div className="flex items-center space-x-3">
                        <span className="font-semibold text-lg">Subscribe & Save</span>
                        <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-2 py-1">
                          20% OFF
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500">Cancel anytime, skip or pause deliveries</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg text-gray-400 line-through">£{product.price}</span>
                      <span className="text-2xl font-bold text-green-600">£{subscriptionPrice.toFixed(2)}</span>
                    </div>
                    <p className="text-sm text-gray-500">£{(subscriptionPrice / 30).toFixed(2)} per serving</p>
                  </div>
                </div>
                
                {subscriptionType === 'subscribe' && (
                  <select 
                    value={subscriptionFrequency}
                    onChange={(e) => setSubscriptionFrequency(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black bg-white"
                  >
                    <option>Every 4 weeks (Bestseller)</option>
                    <option>Every 6 weeks</option>
                    <option>Every 8 weeks</option>
                  </select>
                )}
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="font-semibold text-gray-900">Quantity:</label>
                <div className="flex items-center border-2 border-gray-300 rounded-lg">
                  <button
                    onClick={decrementQuantity}
                    className="p-3 hover:bg-gray-100 transition-colors rounded-l-lg"
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-6 py-3 border-x-2 border-gray-300 font-semibold min-w-[60px] text-center">{quantity}</span>
                  <button
                    onClick={incrementQuantity}
                    className="p-3 hover:bg-gray-100 transition-colors rounded-r-lg"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <Button
                onClick={handleAddToCart}
                className="w-full bg-black text-white hover:bg-gray-800 py-4 text-lg font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                size="lg"
              >
                ADD TO CART - £{((subscriptionType === 'subscribe' ? subscriptionPrice : product.price) * quantity).toFixed(2)}
              </Button>

              <Button 
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 py-4 text-lg font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                size="lg"
              >
                Buy with ShopPay
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-200">
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <Truck className="w-5 h-5 text-green-600" />
                <span>Free shipping over £50</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <Shield className="w-5 h-5 text-blue-600" />
                <span>30-day money back</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <RefreshCw className="w-5 h-5 text-purple-600" />
                <span>Skip or cancel anytime</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <Award className="w-5 h-5 text-orange-600" />
                <span>Award-winning quality</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Information Tabs */}
        <section className="mb-20">
          <Tabs defaultValue="ingredients" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="ingredients" className="text-sm font-medium">Ingredients</TabsTrigger>
              <TabsTrigger value="benefits" className="text-sm font-medium">Benefits</TabsTrigger>
              <TabsTrigger value="usage" className="text-sm font-medium">How to Use</TabsTrigger>
              <TabsTrigger value="reviews" className="text-sm font-medium">Reviews</TabsTrigger>
            </TabsList>
            
            <TabsContent value="ingredients">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div className="bg-white p-8 rounded-2xl shadow-sm">
                    <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                      Pure ingredients,<br />powerful benefits.
                    </h3>
                    
                    <div className="text-center">
                      <div className="mb-6">
                        <div className="text-6xl mb-4">{ingredients[currentIngredient].icon}</div>
                        <h4 className="text-xl font-bold text-gray-900 mb-2">
                          {ingredients[currentIngredient].name}
                        </h4>
                        <p className="text-lg text-gray-600 mb-4 font-medium">
                          {ingredients[currentIngredient].amount}
                        </p>
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-4 max-w-xs mx-auto">
                          <div 
                            className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-500" 
                            style={{width: `${ingredients[currentIngredient].percentage}%`}}
                          ></div>
                        </div>
                        <p className="text-gray-500 max-w-sm mx-auto leading-relaxed">
                          {ingredients[currentIngredient].description}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-center space-x-2 mt-6">
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

                  <div className="relative">
                    <div className="aspect-square rounded-2xl overflow-hidden shadow-xl">
                      <AdminImageUpload
                        src="/lovable-uploads/a61d3c6a-fc59-45fe-9266-350a3c40ae91.png"
                        alt="Energy Focus Beauty lifestyle"
                        className="w-full h-full object-cover"
                        imagePath="product-detail-lifestyle"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="benefits">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { icon: '⚡', title: 'Natural Energy', desc: 'Sustained energy without the crash from ceremonial-grade matcha and B vitamins.' },
                  { icon: '🧠', title: 'Mental Focus', desc: 'Lion\'s Mane mushroom supports cognitive function and mental clarity.' },
                  { icon: '✨', title: 'Beauty Support', desc: 'Tremella mushroom provides natural hydration and skin health benefits.' },
                ].map((benefit, index) => (
                  <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
                    <div className="text-4xl mb-4">{benefit.icon}</div>
                    <h4 className="text-xl font-semibold mb-3 text-gray-900">{benefit.title}</h4>
                    <p className="text-gray-600 leading-relaxed">{benefit.desc}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="usage">
              <div className="bg-white p-8 rounded-xl border border-gray-200">
                <h3 className="text-2xl font-bold mb-6 text-gray-900">How to Use</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="bg-black text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">1</div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Add 1-2 teaspoons</h4>
                      <p className="text-gray-600">Add to your favorite hot or cold beverage</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="bg-black text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">2</div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Mix well</h4>
                      <p className="text-gray-600">Use a whisk or frother for best results</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="bg-black text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">3</div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Enjoy daily</h4>
                      <p className="text-gray-600">Best consumed in the morning for sustained energy</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="reviews">
              <div className="space-y-6">
                {[
                  { name: "Sarah M.", review: "Amazing quality! I've been using this for 3 months now and really notice the difference in my energy levels. Highly recommend!", time: "2 weeks ago", rating: 5 },
                  { name: "James L.", review: "The taste is incredible and I feel so much more focused throughout the day. Worth every penny!", time: "1 month ago", rating: 5 },
                  { name: "Emma R.", review: "Best matcha I've ever tried. The ceremonial grade quality really shows. Will definitely reorder!", time: "3 weeks ago", rating: 5 }
                ].map((review, index) => (
                  <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center text-white font-bold">
                        {review.name[0]}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <span className="font-semibold text-gray-900">{review.name}</span>
                            <div className="flex text-yellow-400 mt-1">
                              {[...Array(review.rating)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-current" />
                              ))}
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">{review.time}</span>
                        </div>
                        <p className="text-gray-700 leading-relaxed">{review.review}</p>
                        <p className="text-sm text-green-600 mt-2 flex items-center">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Verified Purchase
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </section>

        {/* Scientific Research & Testing Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-3 bg-gray-100 px-6 py-3 rounded-full mb-6">
              <Microscope className="w-6 h-6 text-gray-800" />
              <span className="text-gray-900 font-semibold">Science-Backed Excellence</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Proven by Research,<br />
              <span className="text-gray-700">Validated by Results</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Every ingredient is meticulously tested and scientifically validated to deliver optimal benefits for your mind and body.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Lab Testing Card */}
            <Card className="relative overflow-hidden border-2 border-gray-200 hover:shadow-xl transition-all duration-500 group">
              <CardHeader className="relative">
                <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Microscope className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">Third-Party Lab Tested</CardTitle>
                <CardDescription className="text-gray-600">
                  Independent verification for purity, potency, and safety standards.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Heavy Metals</span>
                    <Badge className="bg-gray-100 text-gray-900 border-gray-300">✓ Passed</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Pesticides</span>
                    <Badge className="bg-gray-100 text-gray-900 border-gray-300">✓ Passed</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Microbiology</span>
                    <Badge className="bg-gray-100 text-gray-900 border-gray-300">✓ Passed</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Clinical Studies Card */}
            <Card className="relative overflow-hidden border-2 border-gray-200 hover:shadow-xl transition-all duration-500 group">
              <CardHeader className="relative">
                <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">Clinical Research</CardTitle>
                <CardDescription className="text-gray-600">
                  Backed by peer-reviewed studies on cognitive enhancement and wellness.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900 mb-1">73%</div>
                    <div className="text-sm text-gray-600">Improved Focus</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-xl font-bold text-gray-900">12</div>
                      <div className="text-xs text-gray-600">Studies</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-gray-900">2,847</div>
                      <div className="text-xs text-gray-600">Participants</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Innovation Card */}
            <Card className="relative overflow-hidden border-2 border-gray-200 hover:shadow-xl transition-all duration-500 group">
              <CardHeader className="relative">
                <div className="w-16 h-16 bg-gray-700 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">Bioavailability Enhanced</CardTitle>
                <CardDescription className="text-gray-600">
                  Advanced extraction methods for maximum nutrient absorption.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-gray-700 rounded-full"></div>
                    <span className="text-sm text-gray-700">Dual extraction process</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-gray-700 rounded-full"></div>
                    <span className="text-sm text-gray-700">Nano-encapsulation tech</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-gray-700 rounded-full"></div>
                    <span className="text-sm text-gray-700">95% absorption rate</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Research Metrics */}
          <div className="bg-black rounded-3xl p-12 text-white">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-white mb-2">50+</div>
                <div className="text-gray-300 text-sm uppercase tracking-wide">Research Papers</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-2">99.9%</div>
                <div className="text-gray-300 text-sm uppercase tracking-wide">Purity Level</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-2">15+</div>
                <div className="text-gray-300 text-sm uppercase tracking-wide">Years R&D</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-2">100%</div>
                <div className="text-gray-300 text-sm uppercase tracking-wide">Natural Sourced</div>
              </div>
            </div>
          </div>
        </section>

        {/* Sustainability & Ethics Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-3 bg-gray-100 px-6 py-3 rounded-full mb-6">
              <Leaf className="w-6 h-6 text-gray-800" />
              <span className="text-gray-900 font-semibold">Planet & People First</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Sustainable by Design,<br />
              <span className="text-gray-700">Ethical at Heart</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Our commitment extends beyond quality products to regenerative practices that benefit communities and restore ecosystems.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
            {/* Sustainability Image */}
            <div className="relative">
              <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-gray-100">
                <AdminImageUpload
                  src="/lovable-uploads/a61d3c6a-fc59-45fe-9266-350a3c40ae91.png"
                  alt="Sustainable farming practices"
                  className="w-full h-full object-cover"
                  imagePath="sustainability-hero"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-6 shadow-xl border border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">Carbon Negative</div>
                    <div className="text-sm text-gray-600">Since 2020</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sustainability Features */}
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Leaf className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Regenerative Agriculture</h3>
                  <p className="text-gray-600 leading-relaxed">
                    We partner with farmers who use regenerative practices that improve soil health, increase biodiversity, and sequester carbon from the atmosphere.
                  </p>
                  <div className="flex items-center space-x-4 mt-3">
                    <Badge className="bg-gray-100 text-gray-900 border-gray-300">Soil Health +40%</Badge>
                    <Badge className="bg-gray-100 text-gray-900 border-gray-300">Biodiversity +60%</Badge>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gray-800 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Fair Trade Certified</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Every ingredient is sourced through fair trade partnerships, ensuring farmers receive fair compensation and communities thrive.
                  </p>
                  <div className="flex items-center space-x-4 mt-3">
                    <Badge className="bg-gray-100 text-gray-900 border-gray-300">1,200+ Farmers</Badge>
                    <Badge className="bg-gray-100 text-gray-900 border-gray-300">12 Countries</Badge>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gray-700 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <RefreshCw className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Zero Waste Packaging</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Our packaging is 100% recyclable, made from post-consumer materials, and designed for minimal environmental impact.
                  </p>
                  <div className="flex items-center space-x-4 mt-3">
                    <Badge className="bg-gray-100 text-gray-900 border-gray-300">100% Recyclable</Badge>
                    <Badge className="bg-gray-100 text-gray-900 border-gray-300">Carbon Neutral Shipping</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Impact Metrics */}
          <div className="bg-gray-900 rounded-3xl p-12 text-white">
            <h3 className="text-3xl font-bold text-center mb-12">Our Impact This Year</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">2.5M</div>
                <div className="text-gray-300 text-sm uppercase tracking-wide">Trees Planted</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">500T</div>
                <div className="text-gray-300 text-sm uppercase tracking-wide">CO₂ Offset</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">95%</div>
                <div className="text-gray-300 text-sm uppercase tracking-wide">Waste Diverted</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">£2M</div>
                <div className="text-gray-300 text-sm uppercase tracking-wide">Fair Trade Premium</div>
              </div>
            </div>
          </div>
        </section>

        {/* Community & Lifestyle Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-3 bg-gray-100 px-6 py-3 rounded-full mb-6">
              <Users className="w-6 h-6 text-gray-800" />
              <span className="text-gray-900 font-semibold">Join the Movement</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              More Than a Product,<br />
              <span className="text-gray-700">It's a Lifestyle</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Join thousands of wellness enthusiasts who've transformed their daily routine with DIRTEA's premium matcha blends.
            </p>
          </div>

          {/* Community Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-200">
              <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">250K+</div>
              <div className="text-sm text-gray-600">Community Members</div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-200">
              <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Camera className="w-8 h-8 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">50K+</div>
              <div className="text-sm text-gray-600">Daily Posts</div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-200">
              <div className="w-16 h-16 bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">4.9★</div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-200">
              <div className="w-16 h-16 bg-gray-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">1M+</div>
              <div className="text-sm text-gray-600">Lives Transformed</div>
            </div>
          </div>

          {/* Social Proof & UGC */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
            {/* User Generated Content */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Real Stories, Real Results</h3>
              <div className="space-y-6">
                {[
                  {
                    name: "Sarah Chen",
                    handle: "@sarahwellness",
                    content: "6 months with DIRTEA matcha and I've never felt more energized! The Lion's Mane really helps with my focus during work.",
                    image: "/lovable-uploads/8edc40eb-3dfa-45fb-8cac-fc1a12ec6a3c.png",
                    verified: true
                  },
                  {
                    name: "Marcus Thompson",
                    handle: "@marcusfitness",
                    content: "Replaced my morning coffee with this matcha blend. The sustained energy without crashes is incredible. Best decision ever!",
                    image: "/lovable-uploads/8edc40eb-3dfa-45fb-8cac-fc1a12ec6a3c.png",
                    verified: true
                  },
                  {
                    name: "Emma Rodriguez",
                    handle: "@emmahealthy",
                    content: "The ceremonial grade quality is unmatched. Plus knowing it's sustainably sourced makes me feel even better about my choice.",
                    image: "/lovable-uploads/8edc40eb-3dfa-45fb-8cac-fc1a12ec6a3c.png",
                    verified: true
                  }
                ].map((testimonial, index) => (
                  <Card key={index} className="border border-gray-200 bg-gray-50 hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                          <AdminImageUpload
                            src={testimonial.image}
                            alt={testimonial.name}
                            className="w-full h-full object-cover"
                            imagePath={`testimonial-${index + 1}`}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="font-semibold text-gray-900">{testimonial.name}</span>
                            {testimonial.verified && (
                              <CheckCircle className="w-4 h-4 text-gray-600" />
                            )}
                            <span className="text-gray-500 text-sm">{testimonial.handle}</span>
                          </div>
                          <p className="text-gray-700 leading-relaxed">{testimonial.content}</p>
                          <div className="flex text-yellow-400 mt-3">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-current" />
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Lifestyle Content */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Your Wellness Journey Starts Here</h3>
              <div className="space-y-6">
                <Card className="border border-gray-200 bg-gray-50 hover:shadow-xl transition-all duration-500 group cursor-pointer">
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Play className="w-8 h-8 text-white" />
                      </div>
                      <Badge className="bg-white text-gray-900 border border-gray-300">NEW</Badge>
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-3">Morning Ritual Masterclass</h4>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      Learn how to create the perfect morning routine with our wellness experts. Free 30-minute workshop.
                    </p>
                    <Button className="w-full bg-gray-900 hover:bg-black text-white">
                      Watch Now
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border border-gray-200 bg-gray-50 hover:shadow-xl transition-all duration-500 group cursor-pointer">
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Users className="w-8 h-8 text-white" />
                      </div>
                      <Badge className="bg-white text-gray-900 border border-gray-300">EXCLUSIVE</Badge>
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-3">VIP Community Access</h4>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      Join our exclusive community of wellness enthusiasts. Get recipes, tips, and connect with like-minded people.
                    </p>
                    <Button className="w-full bg-gray-700 hover:bg-gray-800 text-white">
                      Join Community
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border border-gray-200 bg-gray-50 hover:shadow-xl transition-all duration-500 group cursor-pointer">
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-16 h-16 bg-gray-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Sparkles className="w-8 h-8 text-white" />
                      </div>
                      <Badge className="bg-white text-gray-900 border border-gray-300">POPULAR</Badge>
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-3">30-Day Transformation</h4>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      Follow our proven 30-day wellness program and track your progress with our mobile app.
                    </p>
                    <Button className="w-full bg-gray-500 hover:bg-gray-600 text-white">
                      Start Challenge
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-black rounded-3xl p-12 text-center text-white">
            <div className="max-w-3xl mx-auto">
              <h3 className="text-4xl font-bold mb-6">
                Ready to Transform Your Morning?
              </h3>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Join thousands who've already discovered the power of premium, sustainable wellness. Your journey to better health starts with a single sip.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={handleAddToCart}
                  size="lg"
                  className="bg-white text-black hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-xl"
                >
                  Start Your Journey - £{((subscriptionType === 'subscribe' ? subscriptionPrice : product.price) * quantity).toFixed(2)}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-white text-white hover:bg-white hover:text-black px-8 py-4 text-lg font-semibold rounded-xl"
                >
                  Learn More
                </Button>
              </div>
              <div className="flex items-center justify-center space-x-6 mt-8 text-sm text-gray-400">
                <div className="flex items-center space-x-2">
                  <Truck className="w-4 h-4" />
                  <span>Free shipping</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span>30-day guarantee</span>
                </div>
                <div className="flex items-center space-x-2">
                  <RefreshCw className="w-4 h-4" />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <X className="w-8 h-8" />
            </button>
            <img
              src={productImages[selectedImage]}
              alt={product.name}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ProductDetail;
