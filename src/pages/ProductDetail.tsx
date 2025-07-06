
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HeaderNavBar from '@/components/HeaderNavBar';
import Footer from '@/components/Footer';
import AdminImageUpload from '@/components/AdminImageUpload';
import { supabase } from '@/integrations/supabase/client';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Star, Plus, Minus, ChevronDown, Heart, Share2, Truck, Shield, RefreshCw, Award, CheckCircle, X, Microscope, Leaf, Users, Globe, Zap, Brain, Sparkles, TrendingUp, Camera, Play, ChevronLeft, ChevronRight } from 'lucide-react';
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
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const ingredients = [
    {
      name: 'Vitamin B9',
      amount: '12% RI per serving',
      icon: '🟡',
      description: 'Essential for DNA synthesis and repair',
      percentage: 12
    },
    {
      name: 'Lion\'s Mane',
      amount: '500mg per serving',
      icon: '🍄',
      description: 'Supports cognitive function and focus',
      percentage: 85
    },
    {
      name: 'Tremella',
      amount: '300mg per serving',
      icon: '🤍',
      description: 'Natural beauty and hydration support',
      percentage: 60
    },
    {
      name: 'Essential B Vitamins',
      amount: '5 vitamins',
      icon: '💊',
      description: 'Energy metabolism support',
      percentage: 95
    },
    {
      name: 'Ceremonial Grade Matcha',
      amount: '2g per serving',
      icon: '🍵',
      description: 'Premium quality for sustained energy',
      percentage: 100
    }
  ];

  const productImages = [
    '/lovable-uploads/8edc40eb-3dfa-45fb-8cac-fc1a12ec6a3c.png',
    '/lovable-uploads/8edc40eb-3dfa-45fb-8cac-fc1a12ec6a3c.png',
    '/lovable-uploads/8edc40eb-3dfa-45fb-8cac-fc1a12ec6a3c.png',
    '/lovable-uploads/8edc40eb-3dfa-45fb-8cac-fc1a12ec6a3c.png',
    '/lovable-uploads/8edc40eb-3dfa-45fb-8cac-fc1a12ec6a3c.png',
    '/lovable-uploads/8edc40eb-3dfa-45fb-8cac-fc1a12ec6a3c.png'
  ];

  const testimonials = [
    {
      name: "Ellie F.",
      image: "/lovable-uploads/8edc40eb-3dfa-45fb-8cac-fc1a12ec6a3c.png",
      review: "I have been obsessed with the brand for over 2 years. Reishi changed my life for sleep and now I...",
      rating: 5
    },
    {
      name: "Atlanta R.",
      image: "/lovable-uploads/8edc40eb-3dfa-45fb-8cac-fc1a12ec6a3c.png",
      review: "Very yummy to have hot or cold!",
      rating: 5
    },
    {
      name: "Sharon S.",
      image: "/lovable-uploads/8edc40eb-3dfa-45fb-8cac-fc1a12ec6a3c.png",
      review: "My life, my skin and my energy level has changed since my very first cup of Dirtea matcha. I look...",
      rating: 5
    },
    {
      name: "Julia B.",
      image: "/lovable-uploads/8edc40eb-3dfa-45fb-8cac-fc1a12ec6a3c.png",
      review: "Just love it!",
      rating: 5
    }
  ];

  const relatedProducts = [
    {
      name: "focus gummies",
      price: "£27",
      description: "Focus, memory, cognition",
      image: "/lovable-uploads/8edc40eb-3dfa-45fb-8cac-fc1a12ec6a3c.png"
    },
    {
      name: "focus powder",
      price: "£30",
      description: "Focus, cognition, immunity",
      image: "/lovable-uploads/8edc40eb-3dfa-45fb-8cac-fc1a12ec6a3c.png"
    },
    {
      name: "immunity powder",
      price: "£30",
      description: "Energy, defence, immunity",
      image: "/lovable-uploads/8edc40eb-3dfa-45fb-8cac-fc1a12ec6a3c.png"
    },
    {
      name: "calm powder",
      price: "£30",
      description: "Calm, relax, immunity",
      image: "/lovable-uploads/8edc40eb-3dfa-45fb-8cac-fc1a12ec6a3c.png"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIngredient(prev => (prev + 1) % ingredients.length);
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
      description: `${quantity}x ${product.name} added to your cart.`
    });
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast({
      title: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
      description: isWishlisted ? "Item removed from your wishlist" : "Item saved to your wishlist"
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        text: product?.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Product link copied to clipboard"
      });
    }
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  const nextImage = () => {
    setSelectedImage(prev => (prev + 1) % productImages.length);
  };

  const prevImage = () => {
    setSelectedImage(prev => (prev - 1 + productImages.length) % productImages.length);
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <nav className="flex text-sm text-gray-500 font-medium">
          <span className="hover:text-gray-700 cursor-pointer" onClick={() => navigate('/')}>Home</span>
          <span className="mx-2">/</span>
          <span className="hover:text-gray-700 cursor-pointer" onClick={() => navigate('/shop')}>Shop</span>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Product Section with Sticky Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          {/* Left Side - Image Gallery (Sticky) */}
          <div className="lg:sticky lg:top-6 lg:h-fit space-y-3">
            {/* Main Image with Controls */}
            <div className="relative group">
              <Badge className="absolute top-4 left-4 z-10 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                BEST SELLER
              </Badge>
              
              <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden cursor-zoom-in relative" onClick={() => setShowImageModal(true)}>
                <AdminImageUpload 
                  src={productImages[selectedImage]} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  imagePath="product-detail-main" 
                />
                
                {/* Navigation Arrows */}
                <button 
                  onClick={(e) => { e.stopPropagation(); prevImage(); }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 backdrop-blur-md text-gray-800 hover:bg-white hover:shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                <button 
                  onClick={(e) => { e.stopPropagation(); nextImage(); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 backdrop-blur-md text-gray-800 hover:bg-white hover:shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              
              {/* Floating Action Buttons */}
              <div className="absolute top-4 right-4 flex flex-col space-y-2">
                <button
                  onClick={handleWishlist}
                  className={`p-2 rounded-full backdrop-blur-md transition-all duration-200 ${
                    isWishlisted 
                      ? 'bg-red-500 text-white shadow-lg' 
                      : 'bg-white/80 text-gray-600 hover:bg-white hover:shadow-lg'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 rounded-full bg-white/80 backdrop-blur-md text-gray-600 hover:bg-white hover:shadow-lg transition-all duration-200"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* Thumbnail Grid */}
            <div className="grid grid-cols-6 gap-2">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 ${
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

            {/* Image Counter */}
            <div className="text-center text-xs text-gray-500">
              {selectedImage + 1} / {productImages.length}
            </div>
          </div>

          {/* Right Side - Product Info (Scrollable) */}
          <div className="space-y-4 lg:max-h-screen lg:overflow-y-auto lg:pr-2">
            {/* Rating and Reviews */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="text-sm text-gray-600 font-medium ml-1">4.9</span>
              </div>
              <span className="text-xs text-gray-500">•</span>
              <span className="text-sm text-gray-600 font-medium">20,564 Reviews</span>
              <span className="text-xs text-gray-500">•</span>
              <span className="text-sm text-green-600 font-medium">✓ Verified</span>
            </div>

            {/* Product Title and Description */}
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                DIRTEA {product.name}
              </h1>
              <p className="text-lg text-gray-600 font-medium">
                Energy, focus, beauty
              </p>
              <p className="text-gray-700 leading-relaxed text-sm">
                The creamiest, ceremonial-grade Matcha with Lion's Mane, Tremella, and essential B vitamins.
              </p>
            </div>

            {/* Benefits Badges */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="flex items-center space-x-1 px-2 py-1 text-xs font-semibold bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
                <span>⚡</span><span>Energy</span>
              </Badge>
              <Badge variant="outline" className="flex items-center space-x-1 px-2 py-1 text-xs font-semibold bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                <span>🎯</span><span>Focus</span>
              </Badge>
              <Badge variant="outline" className="flex items-center space-x-1 px-2 py-1 text-xs font-semibold bg-gradient-to-r from-pink-50 to-rose-50 border-pink-200">
                <span>✨</span><span>Skin</span>
              </Badge>
            </div>

            {/* Servings Info */}
            <div className="flex items-center space-x-2 text-gray-600 text-sm">
              <span className="text-lg">🥄</span>
              <span className="font-semibold">30 servings</span>
              <span className="text-gray-400">•</span>
              <span className="text-xs">£{(product.price / 30).toFixed(2)} per serving</span>
            </div>

            {/* Pricing Options */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <h3 className="font-semibold text-base text-gray-900 mb-2">Choose Your Option</h3>
              
              {/* One-time Purchase */}
              <div 
                className={`p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                  subscriptionType === 'one-time' 
                    ? 'border-black bg-white shadow-md' 
                    : 'border-gray-200 hover:border-gray-300 bg-white/50'
                }`}
                onClick={() => setSubscriptionType('one-time')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <input 
                      type="radio" 
                      checked={subscriptionType === 'one-time'} 
                      readOnly 
                      className="w-4 h-4" 
                    />
                    <div>
                      <span className="font-semibold text-sm">One-time Purchase</span>
                      <p className="text-xs text-gray-500">No commitment</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-bold">£{product.price}</span>
                  </div>
                </div>
              </div>

              {/* Subscribe & Save */}
              <div 
                className={`p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                  subscriptionType === 'subscribe' 
                    ? 'border-black bg-white shadow-md' 
                    : 'border-gray-200 hover:border-gray-300 bg-white/50'
                }`}
                onClick={() => setSubscriptionType('subscribe')}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <input 
                      type="radio" 
                      checked={subscriptionType === 'subscribe'} 
                      readOnly 
                      className="w-4 h-4" 
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-sm">Subscribe & Save</span>
                        <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-1 py-0">
                          20% OFF
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500">Cancel anytime</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1">
                      <span className="text-sm text-gray-400 line-through">£{product.price}</span>
                      <span className="text-xl font-bold text-green-600">£{subscriptionPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                {subscriptionType === 'subscribe' && (
                  <select 
                    value={subscriptionFrequency} 
                    onChange={(e) => setSubscriptionFrequency(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-black bg-white"
                  >
                    <option>Every 4 weeks (Bestseller)</option>
                    <option>Every 6 weeks</option>
                    <option>Every 8 weeks</option>
                  </select>
                )}
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <label className="font-semibold text-gray-900 text-sm">Quantity:</label>
                <div className="flex items-center border-2 border-gray-300 rounded-lg">
                  <button
                    onClick={decrementQuantity}
                    className="p-2 hover:bg-gray-100 transition-colors rounded-l-lg"
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="px-4 py-2 border-x-2 border-gray-300 font-semibold min-w-[50px] text-center text-sm">
                    {quantity}
                  </span>
                  <button
                    onClick={incrementQuantity}
                    className="p-2 hover:bg-gray-100 transition-colors rounded-r-lg"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <Button
                onClick={handleAddToCart}
                className="w-full bg-black text-white hover:bg-gray-800 py-3 text-sm font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                size="sm"
              >
                ADD TO CART - £{((subscriptionType === 'subscribe' ? subscriptionPrice : product.price) * quantity).toFixed(2)}
              </Button>

              <Button
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 py-3 text-sm font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                size="sm"
              >
                Buy with ShopPay
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-200">
              <div className="flex items-center space-x-2 text-xs text-gray-600">
                <Truck className="w-4 h-4 text-green-600" />
                <span>Free shipping over £50</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-600">
                <Shield className="w-4 h-4 text-blue-600" />
                <span>30-day money back</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-600">
                <RefreshCw className="w-4 h-4 text-purple-600" />
                <span>Skip or cancel anytime</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-600">
                <Award className="w-4 h-4 text-orange-600" />
                <span>Award-winning quality</span>
              </div>
            </div>

            {/* Collapsible Sections */}
            <div className="pt-4 border-t border-gray-200 space-y-2">
              {/* Why choose DIRTEA Section */}
              <Collapsible>
                <CollapsibleTrigger className="flex items-center justify-between w-full py-2 border-b border-gray-200 hover:bg-gray-50/50 transition-colors">
                  <h3 className="text-sm font-semibold text-gray-900">Why choose DIRTEA</h3>
                  <Plus className="w-4 h-4 text-gray-500 group-data-[state=open]:rotate-45 transition-transform" />
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-2 pb-1">
                  <div className="space-y-2">
                    <div className="flex items-start space-x-2">
                      <div className="w-1 h-1 bg-black rounded-full mt-1 flex-shrink-0"></div>
                      <p className="text-xs text-gray-700">DIRTEA's Matcha Super Latte isn't just delicious - it's a powerhouse for your mind and body. Crafted with 100% pure ceremonial-grade Japanese matcha, Lion's Mane, Tremella mushrooms and vitamins, our matcha powder enhances focus, beauty, energy, supports your nervous system, mental clarity, skin health, immunity, and wellbeing.</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-1 h-1 bg-black rounded-full mt-1 flex-shrink-0"></div>
                      <p className="text-xs text-gray-700">Complete 100% plant glucans</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-1 h-1 bg-black rounded-full mt-1 flex-shrink-0"></div>
                      <p className="text-xs text-gray-700">Zero sugars and sweeteners added</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-1 h-1 bg-black rounded-full mt-1 flex-shrink-0"></div>
                      <p className="text-xs text-gray-700">Boost the skin and anti-ageing benefits</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    Feel the difference with DIRTEA Matcha Mushroom Super Latte! Elevate your daily energize and mind and stay focused!
                  </p>
                </CollapsibleContent>
              </Collapsible>

              {/* Ingredients Section */}
              <Collapsible>
                <CollapsibleTrigger className="flex items-center justify-between w-full py-2 border-b border-gray-200 hover:bg-gray-50/50 transition-colors">
                  <h3 className="text-sm font-semibold text-gray-900">Ingredients</h3>
                  <Plus className="w-4 h-4 text-gray-500 group-data-[state=open]:rotate-45 transition-transform" />
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-2 pb-1">
                  <div className="space-y-1 text-xs text-gray-700">
                    <p><strong>Organic Ceremonial-Grade Matcha Powder:</strong></p>
                    <p><strong>Organic Lion's Mane Mushroom Extract:</strong></p>
                    <p><strong>Organic Tremella Mushroom Extract:</strong></p>
                    <p><strong>Organic Mesquite Leaf Powder:</strong></p>
                    <p><strong>Organic Coconut Milk Powder:</strong></p>
                    <p><strong>Vitamin B1 (Thiamine HCI):</strong></p>
                    <p><strong>Vitamin B2 (Riboflavin):</strong></p>
                    <p><strong>Vitamin B6 (Pyridoxine HCI):</strong></p>
                    <p><strong>Vitamin B9 (Folic Acid):</strong></p>
                    <p><strong>Organic Coconut Milk Powder:</strong></p>
                    <p><strong>Organic Vanilla Extract</strong></p>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* The Science Section */}
              <Collapsible>
                <CollapsibleTrigger className="flex items-center justify-between w-full py-2 border-b border-gray-200 hover:bg-gray-50/50 transition-colors">
                  <h3 className="text-sm font-semibold text-gray-900">The Science</h3>
                  <Plus className="w-4 h-4 text-gray-500 group-data-[state=open]:rotate-45 transition-transform" />
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-2 pb-1">
                  <div className="space-y-2 text-xs text-gray-700">
                    <p>Matcha comes from the Camellia sinensis plant, like green tea, but is made by finely grinding whole tea leaves into a powder. The traditional cultivation methods cultivate a relationship with nature, using nutrients like amino and antioxidants and promotes relaxation while enhancing focus.</p>
                    
                    <p><strong>Lion's Mane mushroom supports cognitive function and focus,</strong> which supports information and neural pathways responsible for critical brain function processes like cognition and memory.</p>
                    
                    <p><strong>Tremella mushroom provides a collagen and biotin boost,</strong> which supports skin health and hydration. It's been used for centuries in traditional Chinese medicine as a beauty tonic.</p>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* How to Use Section */}
              <Collapsible>
                <CollapsibleTrigger className="flex items-center justify-between w-full py-2 border-b border-gray-200 hover:bg-gray-50/50 transition-colors">
                  <h3 className="text-sm font-semibold text-gray-900">How to Use</h3>
                  <Plus className="w-4 h-4 text-gray-500 group-data-[state=open]:rotate-45 transition-transform" />
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-2 pb-1">
                  <div className="space-y-1 text-xs text-gray-700">
                    <p>1. Add 1-2 tsp of DIRTEA Matcha to a cup</p>
                    <p>2. Pour 60ml of hot water (80°C or cold water)</p>
                    <p>3. Stir or whisk until frothy and smooth</p>
                    <p>4. Add your choice of milk and enjoy!</p>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </div>
        </div>

        {/* Product Information Tabs */}
        <section className="mb-20">
          <Tabs defaultValue="ingredients" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="ingredients" className="text-lg font-semibold">Ingredients</TabsTrigger>
              <TabsTrigger value="benefits" className="text-lg font-semibold">Benefits</TabsTrigger>
              <TabsTrigger value="usage" className="text-lg font-semibold">How to Use</TabsTrigger>
              <TabsTrigger value="reviews" className="text-lg font-semibold">Reviews</TabsTrigger>
            </TabsList>
            
            <TabsContent value="ingredients">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div className="p-8 rounded-2xl bg-white/0">
                    <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                      Pure ingredients,<br />
                      powerful benefits.
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
                            style={{ width: `${ingredients[currentIngredient].percentage}%` }}
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
                            index === currentIngredient 
                              ? 'bg-black w-6' 
                              : 'bg-gray-300 hover:bg-gray-400'
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
                  {
                    icon: '⚡',
                    title: 'Natural Energy',
                    desc: 'Sustained energy without the crash from ceremonial-grade matcha and B vitamins.'
                  },
                  {
                    icon: '🧠',
                    title: 'Mental Focus',
                    desc: 'Lion\'s Mane mushroom supports cognitive function and mental clarity.'
                  },
                  {
                    icon: '✨',
                    title: 'Beauty Support',
                    desc: 'Tremella mushroom provides natural hydration and skin health benefits.'
                  }
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
                  {
                    name: "Sarah M.",
                    review: "Amazing quality! I've been using this for 3 months now and really notice the difference in my energy levels. Highly recommend!",
                    time: "2 weeks ago",
                    rating: 5
                  },
                  {
                    name: "James L.",
                    review: "The taste is incredible and I feel so much more focused throughout the day. Worth every penny!",
                    time: "1 month ago",
                    rating: 5
                  },
                  {
                    name: "Emma R.",
                    review: "Best matcha I've ever tried. The ceremonial grade quality really shows. Will definitely reorder!",
                    time: "3 weeks ago",
                    rating: 5
                  }
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

        {/* NEW SECTION 2: Pure ingredients, powerful benefits */}
        <section className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="aspect-square rounded-3xl overflow-hidden">
                <AdminImageUpload 
                  src="/lovable-uploads/b4c48a6c-d28c-480e-b907-ec5d22258308.png" 
                  alt="Pure ingredients powerful benefits" 
                  className="w-full h-full object-cover" 
                  imagePath="pure-ingredients" 
                />
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  Pure ingredients,<br />
                  powerful benefits.
                </h2>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="text-2xl">🍃</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">100% Organic</h3>
                    <p className="text-gray-700">
                      All our ingredients are certified organic and sustainably sourced from the finest suppliers around the world.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="text-2xl">🔬</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Lab Tested</h3>
                    <p className="text-gray-700">
                      Every batch is third-party tested for purity, potency, and heavy metals to ensure the highest quality standards.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="text-2xl">⚡</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Bioavailable</h3>
                    <p className="text-gray-700">
                      Our extraction methods ensure maximum bioavailability so your body can absorb and utilize every nutrient.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* NEW SECTION 3: For calm energy and better focus */}
        <section className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <p className="text-lg text-gray-600 mb-4">Your everyday essential</p>
                <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  For calm energy and better focus
                </h2>
              </div>

              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Good for:</h3>
                  <p className="text-gray-700">
                    DIRTEA Matcha mushroom powder fortified with Lion's Mane, Tremella and B vitamin 
                    complex enhances energy, boosts focus and hydrates and nourishes the skin.
                  </p>
                </div>

                <div className="border-b border-gray-200 pb-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Tastes like:</h3>
                  <p className="text-gray-700">
                    A deliciously smooth taste with soft grassy notes and a subtly sweet and creamy flavour.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Did you know?</h3>
                  <p className="text-gray-700">
                    Samurai warriors drank matcha for its energising and calming effects, as it provided 
                    sustained focus and mental clarity, useful in battle or meditation.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-3xl overflow-hidden">
                <AdminImageUpload 
                  src="/lovable-uploads/e3cb3dde-3127-4252-8b46-ab17c78f4ad8.png" 
                  alt="Matcha powder with ceremonial design" 
                  className="w-full h-full object-cover" 
                  imagePath="matcha-ceremonial" 
                />
              </div>
            </div>
          </div>
        </section>

        {/* NEW SECTION 4: How to DIRTEA */}
        <section className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-8">
                  How to DIRTEA
                </h2>
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-900">
                  Add 6g of DIRTEA Matcha powder to a cup
                </h3>
              </div>

              {/* Step thumbnails */}
              <div className="flex space-x-4">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className={`w-24 h-24 rounded-xl overflow-hidden border-2 transition-all ${index === 0 ? 'border-black' : 'border-gray-200'}`}>
                    <AdminImageUpload 
                      src="/lovable-uploads/b9b609e5-82c9-4039-98a5-3da3b835c962.png" 
                      alt={`Step ${index + 1}`} 
                      className="w-full h-full object-cover" 
                      imagePath={`how-to-step-${index + 1}`} 
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-gray-50">
                <AdminImageUpload 
                  src="/lovable-uploads/b9b609e5-82c9-4039-98a5-3da3b835c962.png" 
                  alt="Adding matcha powder to cup" 
                  className="w-full h-full object-cover" 
                  imagePath="how-to-main" 
                />
              </div>
              <div className="absolute bottom-6 right-6 flex items-center space-x-2 text-white">
                <span className="text-sm font-medium">1/4</span>
                <ChevronLeft className="w-4 h-4" />
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </section>

        {/* NEW SECTION 5: Drink for benefits */}
        <section className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <p className="text-lg text-gray-600 mb-4">Drink for</p>
                <div className="space-y-2">
                  <h2 className="text-4xl lg:text-5xl font-bold text-gray-400">Steady energy</h2>
                  <h2 className="text-4xl lg:text-5xl font-bold text-gray-400">Calm focus</h2>
                  <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">Hydrated skin</h2>
                </div>
              </div>

              <Button 
                className="bg-gray-900 text-white hover:bg-black px-8 py-4 text-lg font-semibold rounded-full transition-all duration-200"
                onClick={() => navigate('/recipes')}
              >
                SEE RECIPES
              </Button>
            </div>

            <div className="relative">
              <div className="aspect-[4/3] rounded-3xl overflow-hidden">
                <AdminImageUpload 
                  src="/lovable-uploads/65581248-fb35-4b2f-8b55-04877e634119.png" 
                  alt="Person enjoying matcha drink" 
                  className="w-full h-full object-cover" 
                  imagePath="lifestyle-drink" 
                />
              </div>
            </div>
          </div>
        </section>

        {/* NEW SECTION 6: How it Compares */}
        <section className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50">
                <AdminImageUpload 
                  src="/lovable-uploads/45a06faf-330b-4d76-a34b-4c50248900a2.png" 
                  alt="Hands holding matcha drink with mushroom art" 
                  className="w-full h-full object-cover" 
                  imagePath="mushroom-matcha" 
                />
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <p className="text-lg text-gray-600 mb-4">Mushroom Matcha</p>
                <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  How it Compares
                </h2>
              </div>

              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">What is mushroom matcha?</h3>
                  <p className="text-gray-700 leading-relaxed">
                    DIRTEA Matcha blends premium Japanese ceremonial-grade matcha with Lion's Mane and Tremella for an 
                    elevated experience. Unlike standard matcha, our matcha mushroom blend supports focus, cognition, and 
                    skin hydration with added adaptogens.
                  </p>
                </div>

                <div className="border-b border-gray-200 pb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Matcha mushroom benefits</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Perfect for sustained energy, mental clarity, and glowing skin. While standard matcha offers antioxidants 
                    and caffeine, DIRTEA Matcha enhances cognitive function and hydration with powerful mushrooms.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Where does it fit in your routine?</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Enjoy it in the morning or early afternoon for a jitter-free energy boost. Instead of your standard matcha 
                    powder, buy matcha mushroom powder for a more nourishing, nootropic-powered ritual.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* NEW SECTION 7: Customer Reviews */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8">
              Here's what our customers say
            </h2>
          </div>

          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="border border-gray-200 hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
                      <AdminImageUpload 
                        src={testimonial.image} 
                        alt={`Customer ${testimonial.name}`} 
                        className="w-full h-full object-cover" 
                        imagePath={`testimonial-image-${index + 1}`} 
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex text-yellow-400 mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-3">{testimonial.name}</h4>
                      <p className="text-gray-700 text-sm leading-relaxed">{testimonial.review}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <button className="absolute right-0 top-1/2 -translate-y-1/2 p-2 bg-white border border-gray-300 rounded-full shadow-sm hover:shadow-md transition-all">
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </section>

        {/* NEW SECTION 8: You may also like */}
        <section className="mb-20">
          <div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">You may also like</h2>
            <div className="flex items-center space-x-4 mb-8">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <span className="text-gray-600">4.9/5 | 18,133 reviews</span>
            </div>

            <div className="relative">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((product, index) => (
                  <Card key={index} className="border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-0">
                      <div className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
                        <AdminImageUpload 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
                          imagePath={`related-product-${index + 1}`} 
                        />
                      </div>
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-bold text-gray-900">{product.name}</h3>
                          <span className="font-bold text-gray-900">{product.price}</span>
                        </div>
                        <p className="text-gray-600 text-sm">{product.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <button className="absolute right-0 top-1/2 -translate-y-1/2 p-3 bg-white border border-gray-300 rounded-full shadow-md hover:shadow-lg transition-all">
                <ChevronRight className="w-6 h-6 text-gray-600" />
              </button>
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
