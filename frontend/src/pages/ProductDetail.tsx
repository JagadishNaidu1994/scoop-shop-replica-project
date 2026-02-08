import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HeaderNavBar from '@/components/HeaderNavBar';
import Footer from '@/components/Footer';
import AdminImageUpload from '@/components/AdminImageUpload';
import MatchaLoadingAnimation from '@/components/MatchaLoadingAnimation';
import { supabase } from '@/integrations/supabase/client';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { Button } from '@/components/ui/button';
import { Star, Plus, Minus, ChevronDown, Heart, Share2, Truck, Shield, RefreshCw, Award, CheckCircle, X, Microscope, Leaf, Users, Globe, Zap, Brain, Sparkles, TrendingUp, Camera, Play, ChevronLeft, ChevronRight, Coffee } from 'lucide-react';
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
  const {
    id
  } = useParams();
  const navigate = useNavigate();
  const {
    addToCart
  } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<'60G' | '240G'>('60G');
  const [subscriptionType, setSubscriptionType] = useState<'one-time' | 'subscribe'>('subscribe');
  const [subscriptionFrequency, setSubscriptionFrequency] = useState('Every 4 weeks');
  const [currentIngredient, setCurrentIngredient] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [whyChooseOpen, setWhyChooseOpen] = useState(false);
  const [ingredientsOpen, setIngredientsOpen] = useState(false);
  const [scienceOpen, setScienceOpen] = useState(false);
  const [howToUseOpen, setHowToUseOpen] = useState(false);
  const ingredients = [{
    name: 'Vitamin B9',
    amount: '12% RI per serving',
    icon: '🟡',
    description: 'Essential for DNA synthesis and repair',
    percentage: 12
  }, {
    name: 'Lion\'s Mane',
    amount: '500mg per serving',
    icon: '🍄',
    description: 'Supports cognitive function and focus',
    percentage: 85
  }, {
    name: 'Tremella',
    amount: '300mg per serving',
    icon: '🤍',
    description: 'Natural beauty and hydration support',
    percentage: 60
  }, {
    name: 'Essential B Vitamins',
    amount: '5 vitamins',
    icon: '💊',
    description: 'Energy metabolism support',
    percentage: 95
  }, {
    name: 'Ceremonial Grade Matcha',
    amount: '2g per serving',
    icon: '🍵',
    description: 'Premium quality for sustained energy',
    percentage: 100
  }];
  const productImages = ['/lovable-uploads/8edc40eb-3dfa-45fb-8cac-fc1a12ec6a3c.png', '/lovable-uploads/8edc40eb-3dfa-45fb-8cac-fc1a12ec6a3c.png', '/lovable-uploads/8edc40eb-3dfa-45fb-8cac-fc1a12ec6a3c.png', '/lovable-uploads/8edc40eb-3dfa-45fb-8cac-fc1a12ec6a3c.png', '/lovable-uploads/8edc40eb-3dfa-45fb-8cac-fc1a12ec6a3c.png', '/lovable-uploads/8edc40eb-3dfa-45fb-8cac-fc1a12ec6a3c.png'];
  const testimonials = [{
    name: "Ellie F.",
    image: "/lovable-uploads/8edc40eb-3dfa-45fb-8cac-fc1a12ec6a3c.png",
    review: "I have been obsessed with the brand for over 2 years. Reishi changed my life for sleep and now I...",
    rating: 5
  }, {
    name: "Atlanta R.",
    image: "/lovable-uploads/8edc40eb-3dfa-45fb-8cac-fc1a12ec6a3c.png",
    review: "Very yummy to have hot or cold!",
    rating: 5
  }, {
    name: "Sharon S.",
    image: "/lovable-uploads/8edc40eb-3dfa-45fb-8cac-fc1a12ec6a3c.png",
    review: "My life, my skin and my energy level has changed since my very first cup of Nastea matcha. I look...",
    rating: 5
  }, {
    name: "Julia B.",
    image: "/lovable-uploads/8edc40eb-3dfa-45fb-8cac-fc1a12ec6a3c.png",
    review: "Just love it!",
    rating: 5
  }];
  const relatedProducts = [{
    name: "focus gummies",
    price: "£27",
    description: "Focus, memory, cognition",
    image: "/lovable-uploads/8edc40eb-3dfa-45fb-8cac-fc1a12ec6a3c.png"
  }, {
    name: "focus powder",
    price: "£30",
    description: "Focus, cognition, immunity",
    image: "/lovable-uploads/8edc40eb-3dfa-45fb-8cac-fc1a12ec6a3c.png"
  }, {
    name: "immunity powder",
    price: "£30",
    description: "Energy, defence, immunity",
    image: "/lovable-uploads/8edc40eb-3dfa-45fb-8cac-fc1a12ec6a3c.png"
  }, {
    name: "calm powder",
    price: "£30",
    description: "Calm, relax, immunity",
    image: "/lovable-uploads/8edc40eb-3dfa-45fb-8cac-fc1a12ec6a3c.png"
  }];
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
      const {
        data,
        error
      } = await supabase.from('products').select('*').eq('id', productId).eq('is_active', true).single();
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

    // Map subscription frequency text to database format
    const frequencyMap: { [key: string]: string } = {
      'Every 4 weeks (Bestseller)': 'monthly',
      'Every 4 weeks': 'monthly',
      'Every 6 weeks': 'biweekly',
      'Every 8 weeks': 'quarterly'
    };

    addToCart({
      product_id: product.id,
      product_name: product.name,
      product_price: subscriptionType === 'subscribe' ? product.price * 0.8 : product.price,
      quantity: quantity,
      product_image: product.primary_image,
      is_subscription: subscriptionType === 'subscribe',
      subscription_frequency: subscriptionType === 'subscribe' ? frequencyMap[subscriptionFrequency] || 'monthly' : undefined
    });
    toast({
      title: subscriptionType === 'subscribe' ? "Subscription added to cart!" : "Added to cart!",
      description: subscriptionType === 'subscribe'
        ? `${quantity}x ${product.name} subscription (${subscriptionFrequency}) added to your cart with 20% discount.`
        : `${quantity}x ${product.name} added to your cart.`
    });
  };
  const handleWishlist = async () => {
    if (!product) return;

    const isCurrentlyWishlisted = isInWishlist(product.id);

    if (isCurrentlyWishlisted) {
      await removeFromWishlist(product.id);
    } else {
      await addToWishlist({
        product_id: product.id,
        product_name: product.name,
        product_price: product.price,
        product_image: product.primary_image
      });
    }
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
    return <div className="min-h-screen bg-white">
        <HeaderNavBar />
        <MatchaLoadingAnimation message="Loading product details..." />
        <Footer />
      </div>;
  }
  if (!product) {
    return <div className="min-h-screen bg-white">
        <HeaderNavBar />
        <div className="w-full px-5 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
            <Button onClick={() => navigate('/shop')}>Back to Shop</Button>
          </div>
        </div>
        <Footer />
      </div>;
  }
  const subscriptionPrice = product.price * 0.8;
  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-50 bg-white shadow-sm">
        <HeaderNavBar />
      </div>

      <div className="w-full px-5">
        {/* Breadcrumb */}
        <div className="w-full px-0 py-3">
          <nav className="flex text-sm text-gray-500 font-medium">
            <span className="hover:text-gray-700 cursor-pointer" onClick={() => navigate('/')}>Home</span>
            <span className="mx-2">/</span>
            <span className="hover:text-gray-700 cursor-pointer" onClick={() => navigate('/shop')}>Shop</span>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{product.name}</span>
          </nav>
        </div>

        <main className="w-full px-0 pb-16">
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
                  <AdminImageUpload src={productImages[selectedImage]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" imagePath="product-detail-main" />

                  {/* Navigation Arrows */}
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      prevImage();
                    }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 backdrop-blur-md text-gray-800 hover:bg-white hover:shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <button
                    onClick={e => {
                      e.stopPropagation();
                      nextImage();
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 backdrop-blur-md text-gray-800 hover:bg-white hover:shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Floating Action Buttons */}
                <div className="absolute top-4 right-4 flex flex-col space-y-2">
                  <button onClick={handleWishlist} className={`p-2 rounded-full backdrop-blur-md transition-all duration-200 ${product && isInWishlist(product.id) ? 'bg-red-500 text-white shadow-lg' : 'bg-white/80 text-gray-600 hover:bg-white hover:shadow-lg'}`}>
                    <Heart className={`w-4 h-4 ${product && isInWishlist(product.id) ? 'fill-current' : ''}`} />
                  </button>
                  <button onClick={handleShare} className="p-2 rounded-full bg-white/80 backdrop-blur-md text-gray-600 hover:bg-white hover:shadow-lg transition-all duration-200">
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
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 ${selectedImage === index ? 'border-black shadow-lg scale-105' : 'border-gray-200 hover:border-gray-300 hover:shadow-md'}`}
                  >
                    <AdminImageUpload src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" imagePath={`product-detail-thumbnail-${index + 1}`} />
                  </button>
                ))}
              </div>

              {/* Image Counter */}
              <div className="text-center text-xs text-gray-500">
                {selectedImage + 1} / {productImages.length}
              </div>
            </div>

            {/* Right Side - Product Info (Scrollable) */}
            <div className="w-full space-y-6 lg:max-h-screen lg:overflow-y-auto lg:pr-2">
              {/* Rating and Reviews */}
              <div className="flex items-center gap-2 text-sm">
                <div className="flex items-center gap-1">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  {/* <span className="text-sm text-gray-700 font-semibold ml-1">4.9</span> */}
                </div>
                {/* <span className="text-gray-400">•</span> */}
                {/* <span className="text-sm text-gray-600 font-medium">22,196 Reviews</span> */}
                {/* <span className="text-gray-400">•</span> */}
                {/* <span className="text-sm text-green-600 font-medium">✓ Verified</span> */}
              </div>

              {/* Product Title and Description */}
              <div className="space-y-3">
                <h1 className="text-3xl font-serif font-bold text-gray-900 leading-tight">Organic Ceremonial Matcha</h1>

                {/* Servings Info */}
                <div className="flex items-center gap-2 text-gray-800 text-sm font-semibold">
                  <Coffee className="w-4 h-4" />
                  <span>30 servings</span>
                </div>

                <p className="text-sm leading-relaxed text-gray-800 max-w-prose">
                  Cert Organic | Calm Energy | No Additives
                </p>

                {/* <div className="space-y-1 text-sm text-gray-800">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-gray-900" />
                    <span>30% off on first order</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-gray-900" />
                    <span>20% off on second & third orders</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-gray-900" />
                    <span>Manage subscription anytime</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-gray-900" />
                    <span>Free delivery over ₹2500</span>
                  </div>
                </div> */}

                {/* <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-white border-gray-200">
                    <span>🎯</span>
                    <span>Focus</span>
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-white border-gray-200">
                    <span>🧠</span>
                    <span>Cognition</span>
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-white border-gray-200">
                    <span>🛡️</span>
                    <span>Immunity</span>
                  </Badge>
                </div> */}
              </div>

              {/* Size Selection (UI only, logic untouched) */}
              {/* <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-800">Size</p>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className={`px-4 py-2 rounded-full border text-sm font-semibold transition ${selectedSize === '60G' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-800 border-gray-300'}`}
                    onClick={() => setSelectedSize('60G')}
                  >
                    60G
                  </button>
                  <button
                    type="button"
                    className={`px-4 py-2 rounded-full border text-sm font-semibold transition ${selectedSize === '240G' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-800 border-gray-300'}`}
                    onClick={() => setSelectedSize('240G')}
                  >
                    240G
                  </button>
                </div>
              </div> */}

              {/* Purchase Options */}
              <div className="space-y-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                {/* Subscription first (default) */}
                <div className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${subscriptionType === 'subscribe' ? 'border-gray-900 bg-white' : 'border-gray-200 bg-white hover:border-gray-300'}`} onClick={() => setSubscriptionType('subscribe')}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <input type="radio" checked={subscriptionType === 'subscribe'} readOnly className="w-5 h-5 text-gray-900 border-2 border-gray-300 focus:ring-gray-900" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-gray-900 uppercase text-sm">Every 4 weeks</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="flex items-center justify-end gap-2">
                        <div className="bg-gray-900 text-white text-xs font-black px-2 py-1 rounded-full">20% OFF</div>
                        <div className="text-xl font-bold text-gray-900">£{subscriptionPrice.toFixed(0)}</div>
                      </div>
                      <div className="text-sm text-gray-600">£{(subscriptionPrice / 30).toFixed(2)} per serving</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-gray-900" />
                  <span>Manage your subscription anytime</span>
                </div>

                <div className="h-px bg-gray-200" />

                {/* One-time Purchase */}
                <div className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${subscriptionType === 'one-time' ? 'border-gray-900 bg-white' : 'border-gray-200 bg-white hover:border-gray-300'}`} onClick={() => setSubscriptionType('one-time')}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <input type="radio" checked={subscriptionType === 'one-time'} readOnly className="w-5 h-5 text-gray-900 border-2 border-gray-300 focus:ring-gray-900" />
                      </div>
                      <div>
                        <span className="font-semibold text-gray-900">One-time Purchase</span>
                        <p className="text-sm text-gray-600">Free gifts NOT included</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-bold text-gray-900">£{product.price.toFixed(2)}</span>
                      <div className="text-sm text-gray-600">£{(product.price / 30).toFixed(2)} per serving</div>
                    </div>
                  </div>
                </div>

                {/* Quantity + Add to Cart */}
                <div className="flex items-center gap-3 pt-2">
                  <div className="flex items-center border border-gray-300 rounded-full">
                    <button onClick={decrementQuantity} className="p-2 hover:bg-gray-100 transition-colors rounded-l-full" disabled={quantity <= 1}>
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 py-2 font-medium min-w-[50px] text-center">{quantity}</span>
                    <button onClick={incrementQuantity} className="p-2 hover:bg-gray-100 transition-colors rounded-r-full">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <Button onClick={handleAddToCart} className="flex-1 bg-gray-900 text-white hover:bg-black py-2.5 text-base font-semibold rounded-xl transition-all duration-200">
                    ADD TO CART - £{((subscriptionType === 'subscribe' ? subscriptionPrice : product.price) * quantity).toFixed(0)}
                  </Button>
                </div>

                <Button className="w-full bg-[#5c2dd5] text-white hover:bg-[#4a20b4] py-2.5 text-base font-semibold rounded-xl transition-all duration-200">
                  Buy with Shop
                </Button>

                <button className="mx-auto block text-sm text-gray-600 underline underline-offset-4">More payment options</button>
              </div>

              {/* Benefits */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm text-gray-700">Skip or cancel anytime</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm text-gray-700">20% off every subscription order</span>
                </div>
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

              {/* Accordions */}
              <div className="space-y-4 pt-4 border-t border-gray-200">
                <Collapsible open={scienceOpen} onOpenChange={setScienceOpen}>
                  <CollapsibleTrigger className="flex items-center justify-between w-full py-2 border-b border-gray-200 hover:bg-gray-50/50 transition-colors">
                    <h3 className="text-sm font-semibold text-gray-900">The Science</h3>
                    {scienceOpen ? <Minus className="w-4 h-4 text-gray-500 transition-transform" /> : <Plus className="w-4 h-4 text-gray-500 transition-transform" />}
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-2 pb-1 overflow-hidden transition-all duration-300 ease-in-out">
                    <div className="space-y-3 text-xs text-gray-700">
                      <p>
                        Matcha comes from the Camellia sinensis plant (same as green tea), but it's made differently: the leaves are shade-grown, then finely milled into a powder. That means you're not just steeping tea and tossing the leaves - you're consuming the leaf itself. Result: a richer, more concentrated matcha experience in both taste and naturally occurring compounds.
                      </p>
                      <p>
                        Matcha's energy also tends to feel… more composed. That's because matcha naturally contains caffeine + L-theanine - a tea amino acid often linked to a calmer, more focused "alert" feel compared to caffeine drinks' spike-and-crash reputation. Translation: steady energy, cleaner headspace, fewer "why am I vibrating?" moments.
                      </p>
                      <p>
                        Depending on the product you're drinking, matcha also contains a mix of plant compounds that shape how it tastes and why it's been respected for centuries:
                      </p>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>
                          <strong>L-theanine</strong> - associated with calm-focus vibes (especially alongside caffeine)
                        </li>
                        <li>
                          <strong>Catechins</strong> - the crisp, slightly bitter plant compounds in green tea (yes, the "real matcha" taste cue)
                        </li>
                        <li>
                          <strong>Chlorophyll</strong> - the pigment that makes matcha that vivid, neon-clean green (shade-growing helps)
                        </li>
                      </ul>
                      <p>
                        If you're looking at functional blends that pair matcha with other ingredients (like mushrooms or vitamins), the goal is usually to build on matcha's natural "calm energy" profile - but the core is still the same: ceremonial matcha done properly, as a daily ritual that feels good and tastes even better.
                      </p>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                <Collapsible open={howToUseOpen} onOpenChange={setHowToUseOpen}>
                  <CollapsibleTrigger className="flex items-center justify-between w-full py-2 border-b border-gray-200 hover:bg-gray-50/50 transition-colors">
                    <h3 className="text-sm font-semibold text-gray-900">How to NASTEA</h3>
                    {howToUseOpen ? <Minus className="w-4 h-4 text-gray-500 transition-transform" /> : <Plus className="w-4 h-4 text-gray-500 transition-transform" />}
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-2 pb-1 overflow-hidden transition-all duration-300 ease-in-out">
                    <div className="space-y-1 text-xs text-gray-700">
                      <p>1. Whisk 3g NR Matcha with a splash of warm water until smooth + frothy.</p>
                      <p>2. Fill a glass with ice (skip ice if you want it hot).</p>
                      <p>3. Pour in milk of choice (almond/oat milk is elite).</p>
                      <p>4. Top with the whisked matcha, stir, sip like you've got plans.</p>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </div>
          </div>

          <div className="bg-white">
            {/* SECTION 1 - Pure ingredients, powerful benefits. */}
            <section className="w-full py-16">
              <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center px-0">
                <div className="space-y-6">
                  <p className="text-sm uppercase tracking-[0.2em] text-gray-500">Mushroom Matcha</p>
                  <h2 className="text-4xl lg:text-5xl font-serif font-bold text-gray-900 leading-tight">
                    Pure ingredients,
                    <br />
                    powerful benefits.
                  </h2>
                </div>
                <div className="relative">
                  <div className="relative overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.08)] lg:translate-x-6">
                    <AdminImageUpload src="/lovable-uploads/b4c48a6c-d28c-480e-b907-ec5d22258308.png" alt="Pure ingredients macro" className="w-full h-full object-cover" imagePath="pure-ingredients-hero" />
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 2 - Ingredient Texture + Benefit Explanation */}
            <section className="w-full py-16">
              <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center px-0">
                <div className="relative">
                  <div className="overflow-hidden shadow-[0_16px_40px_rgba(0,0,0,0.06)]">
                    <AdminImageUpload src="/lovable-uploads/b9b609e5-82c9-4039-98a5-3da3b835c962.png" alt="Ingredient texture" className="w-full h-full object-cover" imagePath="texture-shot" />
                  </div>
                </div>
                <div className="space-y-6">
                  <h3 className="text-3xl lg:text-4xl font-serif font-bold text-gray-900">Your everyday essential for sharper focus and improved productivity</h3>
                  <p className="text-gray-700 text-lg leading-relaxed">Ceremonial-grade matcha paired with functional mushrooms for clean energy, calm clarity, and nourished skin-all in one ritual.</p>
                  <div className="space-y-3 text-gray-800">
                    <div className="flex items-center space-x-3">
                      <span className="w-2 h-2 rounded-full bg-gray-900 inline-block"></span>
                      <p className="font-medium">Focus</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="w-2 h-2 rounded-full bg-gray-900 inline-block"></span>
                      <p className="font-medium">Mental clarity</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="w-2 h-2 rounded-full bg-gray-900 inline-block"></span>
                      <p className="font-medium">Cognitive performance</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 3 - How to Use (Instructional) */}
            <section className="w-full py-16">
              <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center px-0">
                <div className="space-y-4">
                  <div className="w-48 overflow-hidden shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
                    <AdminImageUpload src="/lovable-uploads/8edc40eb-3dfa-45fb-8cac-fc1a12ec6a3c.png" alt="Product container" className="w-full h-full object-cover" imagePath="how-to-thumb" />
                  </div>
                  <h3 className="text-3xl font-serif font-bold text-gray-900">How to NASTEA</h3>
                  <p className="text-gray-700 text-lg leading-relaxed">Just add 2g of pure Lion’s Mane powder to hot water or add 2g to your daily coffee or workout smoothie.</p>
                </div>
                <div className="relative overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
                  <AdminImageUpload src="/lovable-uploads/65581248-fb35-4b2f-8b55-04877e634119.png" alt="Stirring powder into a drink" className="w-full h-full object-cover" imagePath="how-to-lifestyle" />
                </div>
              </div>
            </section>

            {/* SECTION 4 - Benefit Pills / Feature Highlights */}
            <section className="w-full py-16">
              <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center px-0">
                <div className="space-y-4">
                  {['Mental clarity', 'Cognitive function', 'Immune support'].map(label => (
                    <div key={label} className="px-6 py-4 bg-white/70 shadow-[0_12px_30px_rgba(0,0,0,0.06)] text-xl font-semibold text-gray-900 w-fit">
                      {label}
                    </div>
                  ))}
                </div>
                <div className="relative overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
                  <AdminImageUpload src="/lovable-uploads/e3cb3dde-3127-4252-8b46-ab17c78f4ad8.png" alt="Wellness lifestyle" className="w-full h-full object-cover" imagePath="benefit-lifestyle" />
                </div>
              </div>
            </section>

            {/* SECTION 5 - Comparison (“How it Compares”) */}
            <section className="w-full py-16">
              <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center px-0">
                <div className="relative overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
                  <AdminImageUpload src="/lovable-uploads/45a06faf-330b-4d76-a34b-4c50248900a2.png" alt="Hand holding beverage" className="w-full h-full object-cover" imagePath="compare-hand" />
                </div>
                <div className="space-y-6">
                  <h3 className="text-3xl lg:text-4xl font-serif font-bold text-gray-900">How it Compares</h3>
                  <div className="space-y-4 text-gray-800">
                    <div className="space-y-2">
                      <p className="text-lg font-semibold">NASTEA vs Coffee</p>
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-gray-800 mt-1" />
                        <p>Calm, sustained energy without jitters.</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-gray-800 mt-1" />
                        <p>Adaptogens to support focus and immunity.</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-lg font-semibold">NASTEA vs Synthetic Nootropics</p>
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-gray-800 mt-1" />
                        <p>Natural ingredients, lab-tested for purity.</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-gray-800 mt-1" />
                        <p>No crash, no artificial stimulants.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 6 - Social Proof Intro */}
            <section className="w-full py-10">
              <div className="w-full px-0 text-center">
                <h3 className="text-3xl lg:text-4xl font-serif font-bold text-gray-900">Here’s what our customers say</h3>
              </div>
            </section>

            {/* SECTION 7 - Recipe / Use-Case Cards */}
            <section className="w-full py-16">
              <div className="w-full space-y-10 px-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch bg-[#f5f5f0] shadow-[0_14px_40px_rgba(0,0,0,0.06)] overflow-hidden">
                  <div className="relative">
                    <AdminImageUpload src="/lovable-uploads/65581248-fb35-4b2f-8b55-04877e634119.png" alt="Founder Favourite Coconut Cloud Matcha" className="w-full h-full object-cover" imagePath="focus-coffee" />
                  </div>
                  <div className="p-12 flex flex-col justify-between min-h-[600px]">
                    <div className="space-y-3">
                      <p className="text-sm font-medium text-gray-600 tracking-wide">Founder&apos;s Super Blend Recipe</p>
                      <h4 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">Nastea Coconut Cloud Matcha</h4>
                      <p className="text-base text-gray-700 leading-relaxed">Light, tropical, and stupidly refreshing - calm clean energy with a smooth, airy finish.</p>
                    </div>
                    
                    <div className="space-y-3 mt-auto">
                      <h5 className="text-lg font-bold text-gray-900">Recipe:</h5>
                      <ul className="space-y-1.5 text-sm text-gray-700 leading-relaxed">
                        <li>• Whisk Nastea matcha + milk until silky and frothy (no clumps, please).</li>
                        <li>• Fill a glass with ice and pour in coconut water.</li>
                        <li>• Gently pour matcha over the top for that clean green layer.</li>
                        <li>• Taste - then decide if you want sweetener, lime, or a tiny pinch of salt.</li>
                        <li>• Stir when you&apos;re ready. Or don&apos;t. Let it look expensive first.</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch bg-[#f5f5f0] shadow-[0_14px_40px_rgba(0,0,0,0.06)] overflow-hidden">
                  <div className="p-12 flex flex-col justify-between min-h-[600px] order-2 lg:order-1">
                    <div className="space-y-3">
                      <p className="text-sm font-medium text-gray-600 tracking-wide">The Everyday Classic</p>
                      <h4 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">Iced Matcha Latte</h4>
                      <p className="text-base text-gray-700 leading-relaxed">Creamy, smooth, and steady - your daily clean-caffeine ritual with zero jitters, all vibe.</p>
                    </div>
                    
                    <div className="space-y-3 mt-auto">
                      <h5 className="text-lg font-bold text-gray-900">Recipe:</h5>
                      <ul className="space-y-1.5 text-sm text-gray-700 leading-relaxed">
                        <li>• Add Nastea matcha + water until smooth and frothy.</li>
                        <li>• Fill a glass with ice.</li>
                        <li>• Pour in milk (and sweetener, if using).</li>
                        <li>• Top with your whisked matcha - slow pour for the layered look.</li>
                        <li>• Stir, sip, and pretend you&apos;re not impressed by how good it is.</li>
                      </ul>
                    </div>
                  </div>
                  <div className="relative order-1 lg:order-2">
                    <AdminImageUpload src="/lovable-uploads/b9b609e5-82c9-4039-98a5-3da3b835c962.png" alt="Iced Matcha Latte" className="w-full h-full object-cover" imagePath="focus-smoothie" />
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 8 - You may also like (Carousel/Grid) */}
            {false && (
              <section className="w-full py-16">
                <div className="w-full px-0 space-y-8">
                  <h4 className="text-2xl font-serif font-bold text-gray-900">You may also like</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {relatedProducts.map((item, index) => (
                      <div key={index} className="bg-white/80 shadow-[0_12px_30px_rgba(0,0,0,0.05)] overflow-hidden">
                        <div className="aspect-square overflow-hidden">
                          <AdminImageUpload src={item.image} alt={item.name} className="w-full h-full object-cover" imagePath={`related-${index}`} />
                        </div>
                        <div className="p-4 space-y-1">
                          <p className="text-sm uppercase tracking-wide text-gray-500">{item.description}</p>
                          <p className="text-lg font-semibold text-gray-900">{item.name}</p>
                          <p className="text-gray-700 text-sm">{item.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* SECTION 9 - Brand Standards / FAQ (Accordion) */}
            <section className="w-full py-16">
              <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-start px-0">
                <div className="space-y-4">
                  <p className="text-sm uppercase tracking-[0.2em] text-gray-500">Quality Promise</p>
                  <h4 className="text-3xl lg:text-4xl font-serif font-bold text-gray-900">The NASTEA Standard</h4>
                  <p className="text-gray-700 leading-relaxed">Crafted with organic ingredients, rigorously tested, and designed for daily rituals that elevate body and mind.</p>
                </div>
                <div className="bg-white/80 shadow-[0_14px_40px_rgba(0,0,0,0.06)] divide-y divide-gray-200">
                  {[{
                    q: 'How does NR matcha support steady energy and calm focus?',
                    a: 'Matcha naturally contains caffeine plus L-theanine - a combo many people find feels smoother and steadier than coffee.'
                  }, {
                    q: 'How does NR matcha help the skin?',
                    a: 'Matcha contains plant antioxidants (like catechins) and chlorophylls; skincare outcomes vary by person, diet, and routine - we keep it as a daily ritual, not a miracle claim.'
                  }, {
                    q: 'What makes NR different from regular matcha?',
                    a: 'Japan-grown, shade-grown, stone-milled matcha chosen for what matters in-cup: smooth taste, vivid colour, and consistency (no “green powder” cosplay).'
                  }, {
                    q: 'What grades do you offer?',
                    a: 'Imperial Ceremonial (straight sipping + premium cups), Organic Ceremonial (daily lattes + cafes), Japanese Classic (baking/recipes/R&D).'
                  }, {
                    q: 'When is the best time to drink matcha?',
                    a: 'Morning or early afternoon is ideal for most people - especially if you’re caffeine-sensitive later in the day.'
                  }, {
                    q: 'Is NR matcha vegan?',
                    a: 'Yes - it’s pure matcha (just tea leaf powder).'
                  }, {
                    q: 'Is there any sugar in NR matcha?',
                    a: 'No added sugar - any sweetness comes from what you add (milk, honey, syrup, etc.).'
                  }, {
                    q: 'Is your matcha organic?',
                    a: 'Yes - our matcha is organic (see product page/pack for certification details per SKU).'
                  }, {
                    q: 'Is it gluten-free?',
                    a: 'Matcha is naturally gluten-free; if you have severe sensitivities, check the pack for facility/allergen statements.'
                  }, {
                    q: 'Can I drink matcha if I’m pregnant or breastfeeding?',
                    a: 'Caffeine guidelines vary - best to check with your clinician and factor in total daily caffeine from all sources.'
                  }, {
                    q: 'How should I store matcha?',
                    a: 'Seal it tight, keep it cool and dry, away from heat/light and strong smells; refrigerate only if you can prevent moisture/odours.'
                  }, {
                    q: 'How much matcha should I use per drink?',
                    a: 'Start with 2–3g per serving and adjust to taste and caffeine tolerance.'
                  }, {
                    q: 'Does matcha have caffeine?',
                    a: 'Yes - amount depends on grams used and the tea; matcha typically feels “cleaner” for many people because of L-theanine.'
                  }, {
                    q: 'Can I take matcha with other supplements?',
                    a: 'Generally yes, but if you’re on medication or sensitive to caffeine, check with a professional.'
                  }, {
                    q: 'Are there any allergens?',
                    a: 'Matcha is a single-ingredient tea leaf powder; always check your pack for facility handling statements.'
                  }, {
                    q: 'How and where is NR made?',
                    a: 'Sourced from Japan; final packing is done to keep it fresh and cafe-ready (see product page/pack for the exact details per SKU).'
                  }, {
                    q: 'Can kids have matcha?',
                    a: 'Because it contains caffeine, we generally recommend avoiding it for children unless advised by a healthcare professional.'
                  }, {
                    q: 'Can I drink it every day?',
                    a: 'Yes - many people do; just keep an eye on your total daily caffeine and how you feel.'
                  }].map((item, idx) => (
                    <Collapsible key={idx}>
                      <CollapsibleTrigger className="flex items-center justify-between w-full py-4 px-6 text-left font-semibold text-gray-900">
                        {item.q}
                        <ChevronRight className="w-5 h-5 text-gray-500" />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="px-6 pb-4 text-gray-700">{item.a}</CollapsibleContent>
                    </Collapsible>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <button onClick={() => setShowImageModal(false)} className="absolute top-4 right-4 text-white hover:text-gray-300 z-10">
              <X className="w-8 h-8" />
            </button>
            <img src={productImages[selectedImage]} alt={product.name} className="max-w-full max-h-full object-contain" />
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};
export default ProductDetail;
