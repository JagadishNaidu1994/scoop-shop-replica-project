import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import ReviewsSection from '@/components/ReviewsSection';
import HeaderNavBar from '@/components/HeaderNavBar';
import Footer from '@/components/Footer';
import AdminImageUpload from '@/components/AdminImageUpload';
import MatchaLoadingAnimation from '@/components/MatchaLoadingAnimation';
import HowToSection from '@/components/HowToSection';
import { supabase } from '@/integrations/supabase/client';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { Button } from '@/components/ui/button';
import {
  Star, Plus, Minus, ChevronLeft, ChevronRight, Heart, Share2,
  Truck, Shield, RefreshCw, Award, CheckCircle, X, Zap, Brain,
  Coffee, Check } from
'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  primary_image: string | null;
  hover_image: string | null;
  category: string | null;
  benefits: string[] | null;
  in_stock: boolean | null;
  is_active: boolean | null;
}

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<'60G' | '240G'>('60G');
  const [purchaseType, setPurchaseType] = useState<'subscription' | 'onetime'>('subscription');
  const [subscriptionFrequency, setSubscriptionFrequency] = useState<'4weeks' | '8weeks'>('4weeks');
  const [showImageModal, setShowImageModal] = useState(false);
  const [whyChooseOpen, setWhyChooseOpen] = useState(false);
  const [ingredientsOpen, setIngredientsOpen] = useState(false);
  const [scienceOpen, setScienceOpen] = useState(false);
  const [howToUseOpen, setHowToUseOpen] = useState(false);

  const productId = parseInt(id as string);
  const productImages = productId === 3
    ? [
        '/images/product-3-1.jpg',
        '/images/product-3-2.jpg',
        '/images/product-3-3.jpg',
        '/images/product-3-4.jpg',
        '/images/product-3-5.jpg']
    : [
        '/images/product-2-1.jpg',
        '/images/product-2-2.jpg',
        '/images/product-2-3.jpg',
        '/images/product-2-4.jpg'];


  useEffect(() => {
    const interval = setInterval(() => {
      setSelectedImage((prev) => (prev + 1) % productImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [productImages.length]);


  const FaqItem = ({ q, a }: {q: string;a: string;}) => {
    const [open, setOpen] = useState(false);
    return (
      <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full py-4 px-6 text-left text-sm font-semibold" style={{ color: '#0D1B2A' }}>
        {q}
        <ChevronRight className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-90' : ''}`} style={{ color: '#6B7280' }} />
      </CollapsibleTrigger>
      <CollapsibleContent className="px-6 pb-4 text-sm" style={{ color: '#6B7280' }}>{a}</CollapsibleContent>
    </Collapsible>);

  };

  const testimonials = [
  { name: "Cliff W.", image: "/lovable-uploads/dde01f1c-2bc0-43ca-aed4-77931424ebcf.jpg", review: "Most of all my memory is improving it's more that I remember rather than forget...", rating: 5 }];


  useEffect(() => {
    if (id) fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const productId = parseInt(id as string);
      if (isNaN(productId)) {navigate('/shop');return;}
      const { data, error } = await supabase.from('products').select('*').eq('id', productId).eq('is_active', true).single();
      if (error) {navigate('/shop');return;}
      setProduct(data);
    } catch {navigate('/shop');} finally {setLoading(false);}
  };

  const getDiscountMultiplier = () => {
    if (purchaseType === 'onetime') return 1;
    return subscriptionFrequency === '4weeks' ? 0.85 : 0.85;
  };

  const getDiscountLabel = () => subscriptionFrequency === '4weeks' ? '15%' : '15%';

  const currentPrice = product ? product.price * getDiscountMultiplier() : 0;
  const pricePerServing = product ? (currentPrice / 30).toFixed(2) : '0';

  const handleAddToCart = () => {
    if (!product) return;
    const frequencyMap: Record<string, string> = { '4weeks': 'monthly', '8weeks': 'quarterly' };
    addToCart({
      product_id: product.id,
      product_name: product.name,
      product_price: currentPrice,
      quantity,
      product_image: product.primary_image,
      is_subscription: purchaseType === 'subscription',
      subscription_frequency: purchaseType === 'subscription' ? frequencyMap[subscriptionFrequency] : undefined
    });
    toast({
      title: purchaseType === 'subscription' ? "Subscription added to cart!" : "Added to cart!",
      description: `${quantity}x ${product.name} added to your cart.`
    });
  };

  const handleWishlist = async () => {
    if (!product) return;
    if (isInWishlist(product.id)) {await removeFromWishlist(product.id);} else
    {await addToWishlist({ product_id: product.id, product_name: product.name, product_price: product.price, product_image: product.primary_image });}
  };

  const handleShare = () => {
    if (navigator.share) {navigator.share({ title: product?.name, text: product?.description, url: window.location.href });} else
    {navigator.clipboard.writeText(window.location.href);toast({ title: "Link copied!", description: "Product link copied to clipboard" });}
  };

  const nextImage = () => setSelectedImage((prev) => (prev + 1) % productImages.length);
  const prevImage = () => setSelectedImage((prev) => (prev - 1 + productImages.length) % productImages.length);

  if (loading) {
    return <div className="min-h-screen bg-white"><HeaderNavBar /><MatchaLoadingAnimation message="Loading product details..." /><Footer /></div>;
  }
  if (!product) {
    return <div className="min-h-screen bg-white"><HeaderNavBar /><div className="w-full px-5 py-16"><div className="text-center"><h1 className="text-2xl font-bold mb-4" style={{ color: '#0D1B2A' }}>Product Not Found</h1><Button onClick={() => navigate('/shop')}>Back to Shop</Button></div></div><Footer /></div>;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="sticky top-0 z-50 bg-white shadow-sm">
        <HeaderNavBar />
      </div>

      <div className="w-full px-[10px]">
        {/* Breadcrumb */}
        <nav className="flex text-sm py-4" style={{ color: '#6B7280' }}>
          <span className="hover:opacity-70 cursor-pointer" onClick={() => navigate('/')}>Home</span>
          <span className="mx-2">/</span>
          <span className="hover:opacity-70 cursor-pointer" onClick={() => navigate('/shop')}>Shop</span>
          <span className="mx-2">/</span>
          <span style={{ color: '#0D1B2A' }}>{product.name}</span>
        </nav>

        <main className="pb-16">
          {/* ===== PRODUCT SECTION: 55% / 45% ===== */}
          <div className="grid grid-cols-1 lg:grid-cols-[54%_1fr] gap-8 items-start mb-20">

            {/* ===== LEFT SIDE – IMAGE GALLERY ===== */}
            <div className="lg:sticky lg:top-24 lg:h-fit space-y-3">
              {/* Main Image */}
              <div className="relative group">
                <div
                  className="aspect-[1/1] rounded-lg overflow-hidden cursor-zoom-in relative"
                  style={{ background: 'linear-gradient(135deg, #F9FAFB, #F3F0EB)' }}
                  onClick={() => setShowImageModal(true)}>
                  
                  <div className="absolute inset-0 flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${selectedImage * 100}%)` }}>
                    {productImages.map((image, idx) => (
                      <img
                        key={idx}
                        src={image}
                        alt={`${product.name} ${idx + 1}`}
                        className="w-full h-full flex-shrink-0 object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&h=600&fit=crop';
                        }}
                      />
                    ))}
                  </div>

                  

                  {/* Navigation Arrows – bottom right */}
                  <div className="absolute bottom-4 right-4 flex gap-2">
                    <button
                      onClick={(e) => {e.stopPropagation();prevImage();}}
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white"
                      style={{ backgroundColor: '#0D1B2A' }}>
                      
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {e.stopPropagation();nextImage();}}
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white"
                      style={{ backgroundColor: '#0D1B2A' }}>
                      
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Floating Actions */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <button onClick={handleWishlist} className={`p-2 rounded-full backdrop-blur-md transition-all ${product && isInWishlist(product.id) ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-600 hover:bg-white hover:shadow-lg'}`}>
                    <Heart className={`w-4 h-4 ${product && isInWishlist(product.id) ? 'fill-current' : ''}`} />
                  </button>
                  <button onClick={handleShare} className="p-2 rounded-full bg-white/80 backdrop-blur-md text-gray-600 hover:bg-white hover:shadow-lg transition-all">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Thumbnail Slider */}
              <div className="flex gap-3 overflow-x-auto pb-1">
                {productImages.map((image, index) =>
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className="w-20 h-20 flex-shrink-0 rounded-md overflow-hidden transition-all"
                  style={{
                    border: selectedImage === index ? '2px solid #0D1B2A' : '2px solid #E5E7EB'
                  }}>
                  
                    <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-scale-down" />
                  </button>
                )}
              </div>
            </div>

            {/* ===== RIGHT SIDE – PRODUCT INFO ===== */}
            <div className="space-y-8 flex flex-col h-full">

              {/* 3.1 Review Row */}
              






              

              {/* 3.2 Product Title */}
              <h1 className="text-4xl font-bold leading-tight" style={{ color: '#0D1B2A', fontFamily: 'Inter, sans-serif' }}>
                {product.name}
              </h1>

              {/* 3.3 Subtitle */}
              <div className="flex items-center gap-2 text-sm" style={{ color: '#6B7280' }}>
                <Coffee className="w-4 h-4" />
                <span>30 servings</span>
              </div>

              {/* 3.5 Benefit Tags */}
              <div className="flex flex-wrap gap-[10px]">
                {(product.id === 2
                  ? [
                    { icon: <Zap className="w-4 h-4" />, label: 'Japan-Grown' },
                    { icon: <Brain className="w-4 h-4" />, label: 'Daily Driver' },
                    { icon: <Shield className="w-4 h-4" />, label: 'No Additives' }
                  ]
                  : [
                    { icon: <Zap className="w-4 h-4" />, label: 'Cert Organic' },
                    { icon: <Brain className="w-4 h-4" />, label: 'Calm Energy' },
                    { icon: <Shield className="w-4 h-4" />, label: 'No Additives' }
                  ]
                ).map((tag) =>
                <span
                  key={tag.label}
                  className="flex items-center gap-2 px-[14px] py-[6px] rounded-full text-sm"
                  style={{ backgroundColor: '#F9FAFB', color: '#0D1B2A' }}>
                    {tag.icon}
                    {tag.label}
                  </span>
                )}
              </div>

              {/* 4. Size Selector */}
              

















              

              {/* ===== 5 & 6. PURCHASE OPTIONS (unified container) ===== */}
              <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid #E5E7EB' }}>
                
                {/* Subscription Option */}
                <div
                  className="p-5 space-y-4 cursor-pointer"
                  style={{
                    borderBottom: '1px solid #E5E7EB',
                    backgroundColor: purchaseType === 'subscription' ? '#FFFFFF' : '#F9FAFB'
                  }}
                  onClick={() => setPurchaseType('subscription')}>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center" style={{ borderColor: purchaseType === 'subscription' ? '#0D1B2A' : '#E5E7EB' }}>
                        {purchaseType === 'subscription' && <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#0D1B2A' }} />}
                      </div>
                      <span className="text-sm font-medium uppercase tracking-wide" style={{ color: '#0D1B2A' }}>
                        Every {subscriptionFrequency === '4weeks' ? '4' : '8'} weeks
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-white px-2 py-0.5 rounded" style={{ backgroundColor: '#0D1B2A' }}>
                        {getDiscountLabel()} OFF
                      </span>
                      <span className="text-lg font-bold" style={{ color: '#0D1B2A' }}>₹{currentPrice.toFixed(0)}</span>
                    </div>
                  </div>

                  {purchaseType === 'subscription' && <>
                    <div className="flex gap-3 ml-8" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setSubscriptionFrequency('4weeks')}
                        className="px-4 py-2 rounded-full text-xs font-medium transition-all"
                        style={{
                          backgroundColor: subscriptionFrequency === '4weeks' ? '#0D1B2A' : '#FFFFFF',
                          color: subscriptionFrequency === '4weeks' ? '#FFFFFF' : '#6B7280',
                          border: '1px solid ' + (subscriptionFrequency === '4weeks' ? '#0D1B2A' : '#E5E7EB')
                        }}>
                        Every 4 weeks
                      </button>
                      <button
                        onClick={() => setSubscriptionFrequency('8weeks')}
                        className="px-4 py-2 rounded-full text-xs font-medium transition-all"
                        style={{
                          backgroundColor: subscriptionFrequency === '8weeks' ? '#0D1B2A' : '#FFFFFF',
                          color: subscriptionFrequency === '8weeks' ? '#FFFFFF' : '#6B7280',
                          border: '1px solid ' + (subscriptionFrequency === '8weeks' ? '#0D1B2A' : '#E5E7EB')
                        }}>
                        Every 8 weeks
                      </button>
                    </div>

                    <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                      <div className="inline-flex items-center rounded-full overflow-hidden" style={{ border: '1px solid #E5E7EB' }}>
                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 h-[52px] flex items-center justify-center hover:bg-gray-50 transition-colors">
                          <Minus className="w-4 h-4" style={{ color: '#0D1B2A' }} />
                        </button>
                        <span className="w-10 h-[52px] flex items-center justify-center font-medium text-sm" style={{ color: '#0D1B2A' }}>{quantity}</span>
                        <button onClick={() => setQuantity(quantity + 1)} className="w-12 h-[52px] flex items-center justify-center hover:bg-gray-50 transition-colors">
                          <Plus className="w-4 h-4" style={{ color: '#0D1B2A' }} />
                        </button>
                      </div>
                      <button
                        onClick={handleAddToCart}
                        className="flex-1 h-[52px] rounded-full font-semibold text-sm transition-all hover:opacity-90"
                        style={{ backgroundColor: '#0D1B2A', color: '#FFFFFF' }}>
                        ADD TO CART – ₹{(currentPrice * quantity).toFixed(0)}
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4" style={{ color: '#0D1B2A' }} />
                      <span className="text-[13px]" style={{ color: '#6B7280' }}>Manage your subscription anytime</span>
                    </div>
                  </>}
                </div>

                {/* One-time Purchase Option */}
                <div
                  className="p-5 space-y-4 cursor-pointer"
                  style={{ backgroundColor: purchaseType === 'onetime' ? '#FFFFFF' : '#F9FAFB' }}
                  onClick={() => setPurchaseType('onetime')}>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center" style={{ borderColor: purchaseType === 'onetime' ? '#0D1B2A' : '#E5E7EB' }}>
                        {purchaseType === 'onetime' && <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#0D1B2A' }} />}
                      </div>
                      <span className="text-sm font-medium" style={{ color: '#0D1B2A' }}>One-time Purchase</span>
                    </div>
                    <span className="text-lg font-bold" style={{ color: '#0D1B2A' }}>₹{product.price}</span>
                  </div>
                  {purchaseType === 'onetime' && (
                    <span className="text-xs text-green-600 font-medium">First order 20% off coupon available at checkout</span>
                  )}

                  {purchaseType === 'onetime' && <>
                    <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                      <div className="inline-flex items-center rounded-full overflow-hidden" style={{ border: '1px solid #E5E7EB' }}>
                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 h-[52px] flex items-center justify-center hover:bg-gray-50 transition-colors">
                          <Minus className="w-4 h-4" style={{ color: '#0D1B2A' }} />
                        </button>
                        <span className="w-10 h-[52px] flex items-center justify-center font-medium text-sm" style={{ color: '#0D1B2A' }}>{quantity}</span>
                        <button onClick={() => setQuantity(quantity + 1)} className="w-12 h-[52px] flex items-center justify-center hover:bg-gray-50 transition-colors">
                          <Plus className="w-4 h-4" style={{ color: '#0D1B2A' }} />
                        </button>
                      </div>
                      <button
                        onClick={handleAddToCart}
                        className="flex-1 h-[52px] rounded-full font-semibold text-sm transition-all hover:opacity-90"
                        style={{ backgroundColor: '#0D1B2A', color: '#FFFFFF' }}>
                        ADD TO CART – ₹{(product.price * quantity).toFixed(0)}
                      </button>
                    </div>
                  </>}
                </div>
              </div>

              {/* ===== 7. ACCORDION SECTIONS ===== */}
              <div className="space-y-0">
                {productId === 1 ? [
                { label: 'Why choose Nastea Rituals', open: whyChooseOpen, setOpen: setWhyChooseOpen, content: 'Nastea Rituals isn\'t "just matcha." It\'s an Organic Ceremonial Japanese matcha built for real life - smooth enough to sip straight, bold enough to cut through milk, and vibrant enough to make every cup look like a flex. We source Japan-grown matcha (hello, Kagoshima), keep it clean, and obsess over the things that actually matter: flavour, colour, and consistency.\n\nMost matcha brands whisper and hope you don\'t notice the bitterness. We don\'t. Our matcha is shade-grown and stone-milled for a rounded, umami-forward taste that feels indulgent without being sugary. It\'s the kind of clean caffeine ritual that fits your mornings, your workouts, your deep-work blocks, and your "I\'m trying to be healthy but still fun" era - without the crashy chaos.' },
                { label: 'Ingredients', open: ingredientsOpen, setOpen: setIngredientsOpen, content: 'Organic Ceremonial Grade Matcha' },
                { label: 'The Science', open: scienceOpen, setOpen: setScienceOpen, content: 'Matcha comes from the Camellia sinensis plant (same as green tea), but it\'s made differently: the leaves are shade-grown, then finely milled into a powder. That means you\'re not just steeping tea and tossing the leaves - you\'re consuming the leaf itself. Result: a richer, more concentrated matcha experience in both taste and naturally occurring compounds.\n\nMatcha\'s energy also tends to feel… more composed. That\'s because matcha naturally contains caffeine + L-theanine - a tea amino acid often linked to a calmer, more focused "alert" feel compared to caffeine drinks\' spike-and-crash reputation. Translation: steady energy, cleaner headspace, fewer "why am I vibrating?" moments.\n\nDepending on the product you\'re drinking, matcha also contains a mix of plant compounds that shape how it tastes and why it\'s been respected for centuries:\n\n• L-theanine - associated with calm-focus vibes (especially alongside caffeine)\n• Catechins - the crisp, slightly bitter plant compounds in green tea (yes, the "real matcha" taste cue)\n• Chlorophyll - the pigment that makes matcha that vivid, neon-clean green (shade-growing helps)\n\nIf you\'re looking at functional blends that pair matcha with other ingredients (like mushrooms or vitamins), the goal is usually to build on matcha\'s natural "calm energy" profile - but the core is still the same: ceremonial matcha done properly, as a daily ritual that feels good and tastes even better.' },
                { label: 'How to Nastea', open: howToUseOpen, setOpen: setHowToUseOpen, content: '1. Whisk 3g NR Matcha with a splash of warm water until smooth + frothy.\n2. Fill a glass with ice (skip ice if you want it hot).\n3. Pour in milk of choice (almond/oat milk is elite).\n4. Top with the whisked matcha, stir, sip like you\'ve got plans.' }]
                : [
                { label: 'Why choose Nastea Rituals', open: whyChooseOpen, setOpen: setWhyChooseOpen, content: 'Japanese Classic Matcha is our everyday workhorse - premium Japanese matcha built to perform in the real world. It\'s smooth, vibrant, and consistent enough for daily lattes, iced drinks, tonics, and café menus that can\'t afford "batch roulette." We source Japan-grown matcha (hello, Kagoshima), keep it clean, and obsess over the things that matter in-cup: flavour, colour, and reliability.\n\nMost "premium" matcha is either bitter, dull, or disappears in milk. Ours doesn\'t. Japanese Classic is shade-grown and stone-milled to keep the cup balanced and creamy - the kind of matcha you can drink every day without needing a personality transplant. Clean caffeine. Zero boring. All standards.' },
                { label: 'Ingredients', open: ingredientsOpen, setOpen: setIngredientsOpen, content: 'Japanese Classic Grade Matcha' },
                { label: 'The Science', open: scienceOpen, setOpen: setScienceOpen, content: 'Matcha comes from the Camellia sinensis plant (same as green tea), but it\'s made differently: the leaves are shade-grown, then finely milled into a powder. That means you\'re not just steeping tea and tossing the leaves - you\'re consuming the leaf itself. Result: a richer, more concentrated matcha experience in both taste and naturally occurring compounds.\n\nMatcha\'s energy also tends to feel… more composed. That\'s because matcha naturally contains caffeine + L-theanine - a tea amino acid often linked to a calmer, more focused "alert" feel compared to coffee\'s spike-and-crash reputation. Translation: steady energy, cleaner headspace, fewer "why am I vibrating?" moments.\n\nMatcha also contains plant compounds that shape how it tastes and why it\'s been respected for centuries:\n\n• L-theanine - associated with calm-focus vibes (especially alongside caffeine)\n• Catechins - the crisp, slightly bitter plant compounds in green tea (aka the "real matcha" taste cue)\n• Chlorophyll - the pigment behind that vivid green colour (shade-growing helps)' },
                { label: 'How to Nastea', open: howToUseOpen, setOpen: setHowToUseOpen, content: 'Whisk 3g NR Matcha with a splash of warm water until smooth + frothy.\n\nFill a glass with ice (skip ice if you want it hot).\n\nPour in milk of choice (oat is elite; coconut is a close second).\n\nTop with the whisked matcha, stir, sip like you\'ve got plans.\n\nPure ingredients, powerful rituals.' }].map((item, idx) =>
                <Collapsible key={idx} open={item.open} onOpenChange={item.setOpen}>
                    <CollapsibleTrigger className="flex items-center justify-between w-full py-4 text-left" style={{ borderTop: '1px solid #E5E7EB' }}>
                      <span className="text-sm font-semibold" style={{ color: '#0D1B2A' }}>{item.label}</span>
                      {item.open ? <Minus className="w-4 h-4" style={{ color: '#6B7280' }} /> : <Plus className="w-4 h-4" style={{ color: '#6B7280' }} />}
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pb-4">
                      <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: '#6B7280' }}>{item.content}</p>
                    </CollapsibleContent>
                  </Collapsible>
                )}
              </div>


            </div>
          </div>

          {/* ===== BELOW-FOLD SECTIONS (kept from original) ===== */}
          <div className="bg-white">

            {/* Ingredient Texture */}
            <section className="py-20 bg-gray-100 w-full">
              <div className="w-full px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                  <div className="relative">
                    <AdminImageUpload src="/lovable-uploads/everyday-essential.jpg" alt="Everyday essential" className="w-full h-[700px] rounded-lg object-cover" imagePath="everyday-essential" />
                  </div>
                  <div className="flex flex-col h-[700px]">
                    <div>
                      <p className="text-sm font-medium mb-4" style={{ color: '#6B7280' }}>Your everyday essential</p>
                      <h2 className="text-5xl lg:text-6xl font-bold mb-12 leading-tight" style={{ color: '#0D1B2A' }}>For calm energy and better focus</h2>
                    </div>

                    <div className="flex-1"></div>

                    <div className="space-y-8">
                      <div className="border-b border-gray-400 pb-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <p className="font-bold text-lg" style={{ color: '#0D1B2A' }}>Good for:</p>
                          <p className="md:col-span-2 text-base leading-relaxed" style={{ color: '#0D1B2A' }}>Baking and confectionery, iced matcha, and café-style drinks - steady energy for workdays, workouts, and "I need to lock in" moments, without the crashy chaos.</p>
                        </div>
                      </div>

                      <div className="border-b border-gray-400 pb-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <p className="font-bold text-lg" style={{ color: '#0D1B2A' }}>Tastes like:</p>
                          <p className="md:col-span-2 text-base leading-relaxed" style={{ color: '#0D1B2A' }}>Smooth and balanced with soft grassy notes and a clean finish - designed to taste great in milk, stay present in iced drinks, and never go swampy.</p>
                        </div>
                      </div>

                      <div className="border-b border-gray-400 pb-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <p className="font-bold text-lg" style={{ color: '#0D1B2A' }}>Did you know?</p>
                          <p className="md:col-span-2 text-base leading-relaxed" style={{ color: '#0D1B2A' }}>In Japan, matcha isn't a "wellness trend" - it's a ritual. The modern part is just us choosing to make it delicious and consistent.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* How to use */}
            <HowToSection />

            {/* Comparison */}
            <section className="py-20 bg-white w-full">
              <div className="w-full px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                  <div className="relative">
                    <AdminImageUpload src="/lovable-uploads/compare-hand-nastea.jpg" alt="Hand holding NASTEA matcha cup" className="w-full h-[700px] rounded-lg object-cover" imagePath="compare-hand" />
                  </div>
                  <div className="flex flex-col h-[700px]">
                    <div>
                      <p className="text-sm font-medium mb-2" style={{ color: '#6B7280' }}>Product Benefits</p>
                      <h3 className="text-5xl font-bold" style={{ color: '#0D1B2A' }}>Why Nastea's matcha is better?</h3>
                    </div>

                    {/* Large blank space to push content down */}
                    <div className="flex-1"></div>

                    {/* Text blocks */}
                    <div className="space-y-8">
                      <div className="border-t border-gray-300 pt-6">
                        <p className="font-bold mb-4 text-lg" style={{ color: '#0D1B2A' }}>What is Nastea matcha?</p>
                        <p className="text-base leading-relaxed" style={{ color: '#6B7280' }}>Matcha is powdered green tea made from shade-grown leaves that are stone-milled into a vivid green powder. Unlike brewed green tea, you're consuming the leaf itself - which is why it feels more like a ritual than a drink. With Nastea Rituals, you're getting premium Japanese matcha chosen for a smooth, vibrant cup that lives up to the hype.</p>
                      </div>

                      <div className="border-t border-gray-300 pt-6">
                        <p className="font-bold mb-4 text-lg" style={{ color: '#0D1B2A' }}>Matcha benefits (the real ones)</p>
                        <p className="text-base leading-relaxed" style={{ color: '#6B7280' }}>Matcha is loved for its clean caffeine and naturally occurring tea compounds that many people associate with steadier, more focused energy. Compared to coffee, it can feel more "calm alert" than "wired." Japanese Classic is built as the daily option - easy to make, easy to love, and strong enough to hold its own in milk.</p>
                      </div>

                      <div className="border-t border-gray-300 pt-6">
                        <p className="font-bold mb-4 text-lg" style={{ color: '#0D1B2A' }}>Where does it fit in your routine?</p>
                        <p className="text-base leading-relaxed" style={{ color: '#6B7280' }}>Morning is the obvious move if you want energy that doesn't bully your nervous system. Early afternoon works just as well for a clean pick-me-up without risking sleep. This one shines as your daily latte - hot, iced, oat milk, coconut, even tonics.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Reviews */}
            <ReviewsSection productId={product.id} />

            {/* Recipe Cards */}
            <section className="py-20 bg-white w-full">
              <div className="w-full px-4 sm:px-6 lg:px-8 space-y-20">
                {productId === 1 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                  <div className="relative">
                    <AdminImageUpload src="/lovable-uploads/65581248-fb35-4b2f-8b55-04877e634119.png" alt="The Focus Coffee" className="w-full h-[700px] rounded-lg object-cover" imagePath="focus-coffee" />
                  </div>
                  <div className="flex flex-col h-[700px]">
                    <div>
                      <p className="text-sm font-medium mb-2" style={{ color: '#6B7280' }}>Founder's Super Blend Recipe</p>
                      <h4 className="text-4xl lg:text-5xl font-bold" style={{ color: '#0D1B2A' }}>Nastea Coconut Cloud Matcha</h4>
                    </div>
                    <div className="flex-1"></div>
                    <div className="space-y-6">
                      <p className="text-lg leading-relaxed border-t border-gray-300 pt-6" style={{ color: '#6B7280' }}>Light, tropical, and stupidly refreshing.</p>
                      <div className="border-t border-gray-300 pt-6">
                        <h5 className="text-lg font-bold mb-4" style={{ color: '#0D1B2A' }}>Recipe:</h5>
                        <ul className="space-y-3 text-base" style={{ color: '#6B7280' }}>
                          <li>• Whisk Nastea matcha + milk until silky and frothy.</li>
                          <li>• Fill a glass with ice and pour in coconut water.</li>
                          <li>• Gently pour matcha over the top.</li>
                          <li>• Add sweetener, lime, or a pinch of salt to taste.</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                  <div className="relative">
                    <AdminImageUpload src="/lovable-uploads/matcha-cheesecake.png" alt="No-bake matcha cheesecake" className="w-full h-[700px] rounded-lg object-cover" imagePath="cheesecake" />
                  </div>
                  <div className="flex flex-col h-[700px]">
                    <div>
                      <p className="text-sm font-medium mb-2" style={{ color: '#6B7280' }}>Founder's Favourite</p>
                      <h4 className="text-4xl lg:text-5xl font-bold" style={{ color: '#0D1B2A' }}>No-bake matcha cheesecake</h4>
                    </div>
                    <div className="flex-1"></div>
                    <div className="space-y-6">
                      <div className="border-t border-gray-300 pt-6">
                        <h5 className="text-lg font-bold mb-4" style={{ color: '#0D1B2A' }}>To make:</h5>
                        <ul className="space-y-3 text-base" style={{ color: '#6B7280' }}>
                          <li>• Mix 150g crushed graham crackers/digestive biscuits with 60g melted unsalted butter, press into a 6-inch springform pan, and chill.</li>
                          <li>• Beat 400g cream cheese with 100g powdered sugar until smooth; in a separate bowl, whip 200ml heavy cream to stiff peaks.</li>
                          <li>• Fold 15g sifted Nastea Classic Matcha into the cream cheese mixture, then gently fold in the whipped cream.</li>
                          <li>• Pour over the crust, smooth the top, and refrigerate for at least 6 hours (overnight preferred).</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                )}

                {productId === 1 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                  <div className="flex flex-col h-[700px] order-2 lg:order-1">
                    <div>
                      <p className="text-sm font-medium mb-2" style={{ color: '#6B7280' }}>The Everyday Classic</p>
                      <h4 className="text-4xl lg:text-5xl font-bold" style={{ color: '#0D1B2A' }}>Iced Matcha Latte</h4>
                    </div>
                    <div className="flex-1"></div>
                    <div className="space-y-6">
                      <p className="text-lg leading-relaxed border-t border-gray-300 pt-6" style={{ color: '#6B7280' }}>Creamy, smooth, and steady.</p>
                      <div className="border-t border-gray-300 pt-6">
                        <h5 className="text-lg font-bold mb-4" style={{ color: '#0D1B2A' }}>Recipe:</h5>
                        <ul className="space-y-3 text-base" style={{ color: '#6B7280' }}>
                          <li>• Add Nastea matcha + water until smooth.</li>
                          <li>• Fill a glass with ice.</li>
                          <li>• Pour in milk (and sweetener, if using).</li>
                          <li>• Top with whisked matcha for the layered look.</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="relative order-1 lg:order-2">
                    <AdminImageUpload src="/images/product-latte.jpg" alt="The Focus Smoothie" className="w-full h-[700px] rounded-lg object-cover" imagePath="latte-image" />
                  </div>
                </div>
                ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                  <div className="flex flex-col h-[700px] order-2 lg:order-1">
                    <div>
                      <p className="text-sm font-medium mb-2" style={{ color: '#6B7280' }}>Easy Bake</p>
                      <h4 className="text-4xl lg:text-5xl font-bold" style={{ color: '#0D1B2A' }}>White chocolate matcha cookies</h4>
                    </div>
                    <div className="flex-1"></div>
                    <div className="space-y-6">
                      <div className="border-t border-gray-300 pt-6">
                        <h5 className="text-lg font-bold mb-4" style={{ color: '#0D1B2A' }}>To make:</h5>
                        <ul className="space-y-3 text-base" style={{ color: '#6B7280' }}>
                          <li>• Beat 115g softened butter with 100g sugar until light and fluffy, then add 1 egg and mix well.</li>
                          <li>• Sift in 190g all-purpose flour, 12g Nastea Culinary Matcha, 1/2 tsp baking soda, and 1/4 tsp salt, then fold into a green dough.</li>
                          <li>• Stir in 100g white chocolate chips.</li>
                          <li>• Scoop into 2-tbsp balls and bake at 175°C for 8–10 minutes — keep them soft and vibrant green.</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="relative order-1 lg:order-2">
                    <AdminImageUpload src="/lovable-uploads/matcha-cookies.png" alt="White chocolate matcha cookies" className="w-full h-[700px] rounded-lg object-cover" imagePath="cookies-image" />
                  </div>
                </div>
                )}
              </div>
            </section>

            {/* FAQ */}
            <section className="w-full py-16">
              <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div className="space-y-4">
                  <p className="text-sm uppercase tracking-[0.2em]" style={{ color: '#6B7280' }}>Quality Promise</p>
                  <h4 className="text-3xl lg:text-4xl font-serif font-bold" style={{ color: '#0D1B2A' }}>The NASTEA Standard</h4>
                  <p className="leading-relaxed" style={{ color: '#6B7280' }}>Crafted with organic ingredients, rigorously tested, and designed for daily rituals that elevate body and mind.</p>
                </div>
                <div className="bg-white/80 shadow-[0_14px_40px_rgba(0,0,0,0.06)] divide-y" style={{ borderColor: '#E5E7EB' }}>
                  {[
                  { q: 'How does NR matcha support steady energy and calm focus?', a: 'Matcha naturally contains caffeine plus L-theanine - a combo many people find feels smoother and steadier than coffee.' },
                  { q: 'How does NR matcha help the skin?', a: 'Matcha contains plant antioxidants (like catechins) and chlorophylls; skincare outcomes vary by person, diet, and routine - we keep it as a daily ritual, not a miracle claim.' },
                  { q: 'What makes NR different from regular matcha?', a: 'Japan-grown, shade-grown, stone-milled matcha chosen for what matters in-cup: smooth taste, vivid colour, and consistency (no "green powder" cosplay).' },
                  { q: 'What grades do you offer?', a: 'Imperial Ceremonial (straight sipping + premium cups), Organic Ceremonial (daily lattes + cafés), Japanese Classic (baking/recipes/R&D).' },
                  { q: 'When is the best time to drink matcha?', a: 'Morning or early afternoon is ideal for most people - especially if you\'re caffeine-sensitive later in the day.' },
                  { q: 'Is NR matcha vegan?', a: 'Yes - it\'s pure matcha (just tea leaf powder).' },
                  { q: 'Is there any sugar in NR matcha?', a: 'No added sugar - any sweetness comes from what you add (milk, honey, syrup, etc.).' },
                  { q: 'Is your matcha organic?', a: 'Yes - our matcha is organic (see product page/pack for certification details per SKU).' },
                  { q: 'Is it gluten-free?', a: 'Matcha is naturally gluten-free; if you have severe sensitivities, check the pack for facility/allergen statements.' },
                  { q: 'Can I drink matcha if I\'m pregnant or breastfeeding?', a: 'Caffeine guidelines vary - best to check with your clinician and factor in total daily caffeine from all sources.' },
                  { q: 'How should I store matcha?', a: 'Seal it tight, keep it cool and dry, away from heat/light and strong smells; refrigerate only if you can prevent moisture/odours.' },
                  { q: 'How much matcha should I use per drink?', a: 'Start with 2–3g per serving and adjust to taste and caffeine tolerance.' },
                  { q: 'Does matcha have caffeine?', a: 'Yes - amount depends on grams used and the tea; matcha typically feels "cleaner" for many people because of L-theanine.' },
                  { q: 'Can I take matcha with other supplements?', a: 'Generally yes, but if you\'re on medication or sensitive to caffeine, check with a professional.' },
                  { q: 'Are there any allergens?', a: 'Matcha is a single-ingredient tea leaf powder; always check your pack for facility handling statements.' },
                  { q: 'How and where is NR made?', a: 'Sourced from Japan; final packing is done to keep it fresh and café-ready (see product page/pack for the exact details per SKU).' },
                  { q: 'Can kids have matcha?', a: 'Because it contains caffeine, we generally recommend avoiding it for children unless advised by a healthcare professional.' },
                  { q: 'Can I drink it every day?', a: 'Yes - many people do; just keep an eye on your total daily caffeine and how you feel.' }].
                  map((item, idx) =>
                  <FaqItem key={idx} q={item.q} a={item.a} />
                  )}
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>

      {/* Image Modal */}
      {showImageModal &&
      <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <button onClick={() => setShowImageModal(false)} className="absolute top-4 right-4 text-white hover:text-gray-300 z-10">
              <X className="w-8 h-8" />
            </button>
            <img src={productImages[selectedImage]} alt={product.name} className="max-w-full max-h-full object-contain" />
          </div>
        </div>
      }

      <Footer />
    </div>);

};

export default ProductDetail;