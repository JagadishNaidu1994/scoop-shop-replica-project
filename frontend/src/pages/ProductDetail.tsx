import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import ReviewsSection from '@/components/ReviewsSection';
import HeaderNavBar from '@/components/HeaderNavBar';
import Footer from '@/components/Footer';
import AdminImageUpload from '@/components/AdminImageUpload';
import MatchaLoadingAnimation from '@/components/MatchaLoadingAnimation';
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

  const productImages = [
  '/lovable-uploads/8edc40eb-3dfa-45fb-8cac-fc1a12ec6a3c.png',
  '/lovable-uploads/8edc40eb-3dfa-45fb-8cac-fc1a12ec6a3c.png',
  '/lovable-uploads/8edc40eb-3dfa-45fb-8cac-fc1a12ec6a3c.png',
  '/lovable-uploads/8edc40eb-3dfa-45fb-8cac-fc1a12ec6a3c.png',
  '/lovable-uploads/8edc40eb-3dfa-45fb-8cac-fc1a12ec6a3c.png',
  '/lovable-uploads/8edc40eb-3dfa-45fb-8cac-fc1a12ec6a3c.png'];

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
  { name: "Cliff W.", image: "/lovable-uploads/8edc40eb-3dfa-45fb-8cac-fc1a12ec6a3c.png", review: "Most of all my memory is improving it's more that I remember rather than forget...", rating: 5 }];


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
    return subscriptionFrequency === '4weeks' ? 0.8 : 0.85;
  };

  const getDiscountLabel = () => subscriptionFrequency === '4weeks' ? '20%' : '15%';

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
          <div className="grid grid-cols-1 lg:grid-cols-[54%_1fr] gap-6 items-start mb-20">

            {/* ===== LEFT SIDE – IMAGE GALLERY ===== */}
            <div className="lg:sticky lg:top-24 lg:h-fit space-y-3">
              {/* Main Image */}
              <div className="relative group">
                <div
                  className="aspect-square rounded-lg overflow-hidden cursor-zoom-in relative"
                  style={{ background: 'linear-gradient(135deg, #F9FAFB, #F3F0EB)' }}
                  onClick={() => setShowImageModal(true)}>
                  
                  <AdminImageUpload
                    src={productImages[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    imagePath="product-detail-main" />
                  

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
                  
                    <AdminImageUpload src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" imagePath={`product-detail-thumbnail-${index + 1}`} />
                  </button>
                )}
              </div>
            </div>

            {/* ===== RIGHT SIDE – PRODUCT INFO ===== */}
            <div className="space-y-5">

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

              {/* 3.4 Description */}
              <p className="text-[15px] leading-relaxed" style={{ color: '#6B7280' }}>
                {product.description || 'Pure and organic Lion\'s Mane mushroom extract powder with organic zinc.'}
              </p>

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
                {[
                { label: 'Why choose NASTEA', open: whyChooseOpen, setOpen: setWhyChooseOpen, content: 'Japan-sourced, shade-grown, stone-milled ceremonial matcha. Organic, lab-tested, no fillers. Clean energy meets calm focus — the way matcha was meant to be.' },
                { label: 'Ingredients', open: ingredientsOpen, setOpen: setIngredientsOpen, content: 'Organic ceremonial grade matcha (Camellia sinensis), organic Lion\'s Mane extract, organic Tremella extract, organic zinc, B-vitamin complex.' },
                { label: 'The Science', open: scienceOpen, setOpen: setScienceOpen, content: 'Matcha naturally contains caffeine + L-theanine — a combo linked to calmer, more focused alertness. You consume the whole leaf, getting a richer concentration of plant compounds.' },
                { label: 'How to Use', open: howToUseOpen, setOpen: setHowToUseOpen, content: '1. Whisk 2-3g with a splash of warm water until smooth.\n2. Add ice (or keep hot).\n3. Pour in milk of choice.\n4. Stir and enjoy.' }].
                map((item, idx) =>
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
            {/* Pure ingredients section */}
            <section className="w-full py-16">
              <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                  <p className="text-sm uppercase tracking-[0.2em]" style={{ color: '#6B7280' }}>Mushroom Matcha</p>
                  <h2 className="text-4xl lg:text-5xl font-serif font-bold leading-tight" style={{ color: '#0D1B2A' }}>
                    Pure ingredients,<br />powerful benefits.
                  </h2>
                </div>
                <div className="relative">
                  <div className="relative overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
                    <AdminImageUpload src="/lovable-uploads/b4c48a6c-d28c-480e-b907-ec5d22258308.png" alt="Pure ingredients macro" className="w-full h-full object-cover" imagePath="pure-ingredients-hero" />
                  </div>
                </div>
              </div>
            </section>

            {/* Ingredient Texture */}
            <section className="w-full py-16">
              <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="relative">
                  <div className="overflow-hidden shadow-[0_16px_40px_rgba(0,0,0,0.06)]">
                    <AdminImageUpload src="/lovable-uploads/b9b609e5-82c9-4039-98a5-3da3b835c962.png" alt="Ingredient texture" className="w-full h-full object-cover" imagePath="texture-shot" />
                  </div>
                </div>
                <div className="space-y-6">
                  <h3 className="text-3xl lg:text-4xl font-serif font-bold" style={{ color: '#0D1B2A' }}>Your everyday essential for sharper focus and improved productivity</h3>
                  <p className="text-lg leading-relaxed" style={{ color: '#6B7280' }}>Ceremonial-grade matcha paired with functional mushrooms for clean energy, calm clarity, and nourished skin—all in one ritual.</p>
                  <div className="space-y-3">
                    {['Focus', 'Mental clarity', 'Cognitive performance'].map((label) =>
                    <div key={label} className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: '#0D1B2A' }} />
                        <p className="font-medium" style={{ color: '#0D1B2A' }}>{label}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* How to use */}
            <section className="w-full py-16">
              <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <div className="w-48 overflow-hidden shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
                    <AdminImageUpload src="/lovable-uploads/8edc40eb-3dfa-45fb-8cac-fc1a12ec6a3c.png" alt="Product container" className="w-full h-full object-cover" imagePath="how-to-thumb" />
                  </div>
                  <h3 className="text-3xl font-serif font-bold" style={{ color: '#0D1B2A' }}>How to NASTEA</h3>
                  <p className="text-lg leading-relaxed" style={{ color: '#6B7280' }}>Just add 2g of pure Lion's Mane powder to hot water or add 2g to your daily coffee or workout smoothie.</p>
                </div>
                <div className="relative overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
                  <AdminImageUpload src="/lovable-uploads/65581248-fb35-4b2f-8b55-04877e634119.png" alt="Stirring powder into a drink" className="w-full h-full object-cover" imagePath="how-to-lifestyle" />
                </div>
              </div>
            </section>

            {/* Benefit pills */}
            <section className="w-full py-16">
              <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  {['Mental clarity', 'Cognitive function', 'Immune support'].map((label) =>
                  <div key={label} className="px-6 py-4 bg-white/70 shadow-[0_12px_30px_rgba(0,0,0,0.06)] text-xl font-semibold w-fit" style={{ color: '#0D1B2A' }}>
                      {label}
                    </div>
                  )}
                </div>
                <div className="relative overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
                  <AdminImageUpload src="/lovable-uploads/e3cb3dde-3127-4252-8b46-ab17c78f4ad8.png" alt="Wellness lifestyle" className="w-full h-full object-cover" imagePath="benefit-lifestyle" />
                </div>
              </div>
            </section>

            {/* Comparison */}
            <section className="w-full py-16">
              <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="relative overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
                  <AdminImageUpload src="/lovable-uploads/45a06faf-330b-4d76-a34b-4c50248900a2.png" alt="Hand holding beverage" className="w-full h-full object-cover" imagePath="compare-hand" />
                </div>
                <div className="space-y-6">
                  <h3 className="text-3xl lg:text-4xl font-serif font-bold" style={{ color: '#0D1B2A' }}>How it Compares</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <p className="text-lg font-semibold" style={{ color: '#0D1B2A' }}>NASTEA vs Coffee</p>
                      <div className="flex items-start gap-3"><CheckCircle className="w-5 h-5 mt-0.5" style={{ color: '#0D1B2A' }} /><p style={{ color: '#6B7280' }}>Calm, sustained energy without jitters.</p></div>
                      <div className="flex items-start gap-3"><CheckCircle className="w-5 h-5 mt-0.5" style={{ color: '#0D1B2A' }} /><p style={{ color: '#6B7280' }}>Adaptogens to support focus and immunity.</p></div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-lg font-semibold" style={{ color: '#0D1B2A' }}>NASTEA vs Synthetic Nootropics</p>
                      <div className="flex items-start gap-3"><CheckCircle className="w-5 h-5 mt-0.5" style={{ color: '#0D1B2A' }} /><p style={{ color: '#6B7280' }}>Natural ingredients, lab-tested for purity.</p></div>
                      <div className="flex items-start gap-3"><CheckCircle className="w-5 h-5 mt-0.5" style={{ color: '#0D1B2A' }} /><p style={{ color: '#6B7280' }}>No crash, no artificial stimulants.</p></div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Reviews */}
            <ReviewsSection productId={product.id} />

            {/* Recipe Cards */}
            <section className="w-full py-16">
              <div className="w-full space-y-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch bg-white/70 shadow-[0_14px_40px_rgba(0,0,0,0.06)] overflow-hidden">
                  <div className="relative">
                    <AdminImageUpload src="/lovable-uploads/65581248-fb35-4b2f-8b55-04877e634119.png" alt="The Focus Coffee" className="w-full h-full object-cover" imagePath="focus-coffee" />
                  </div>
                  <div className="p-8 flex flex-col justify-center space-y-4">
                    <p className="text-sm font-medium" style={{ color: '#6B7280' }}>Founder's Super Blend Recipe</p>
                    <h4 className="text-3xl font-serif font-bold" style={{ color: '#0D1B2A' }}>Nastea Coconut Cloud Matcha</h4>
                    <p className="text-base" style={{ color: '#6B7280' }}>Light, tropical, and stupidly refreshing.</p>
                    <h5 className="text-lg font-bold pt-4" style={{ color: '#0D1B2A' }}>Recipe:</h5>
                    <ul className="space-y-2" style={{ color: '#6B7280' }}>
                      <li>• Whisk Nastea matcha + milk until silky and frothy.</li>
                      <li>• Fill a glass with ice and pour in coconut water.</li>
                      <li>• Gently pour matcha over the top.</li>
                      <li>• Add sweetener, lime, or a pinch of salt to taste.</li>
                    </ul>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch bg-white/70 shadow-[0_14px_40px_rgba(0,0,0,0.06)] overflow-hidden">
                  <div className="p-8 flex flex-col justify-center space-y-4 order-2 lg:order-1">
                    <p className="text-sm font-medium" style={{ color: '#6B7280' }}>The Everyday Classic</p>
                    <h4 className="text-3xl font-serif font-bold" style={{ color: '#0D1B2A' }}>Iced Matcha Latte</h4>
                    <p className="text-base" style={{ color: '#6B7280' }}>Creamy, smooth, and steady.</p>
                    <h5 className="text-lg font-bold pt-4" style={{ color: '#0D1B2A' }}>Recipe:</h5>
                    <ul className="space-y-2" style={{ color: '#6B7280' }}>
                      <li>• Add Nastea matcha + water until smooth.</li>
                      <li>• Fill a glass with ice.</li>
                      <li>• Pour in milk (and sweetener, if using).</li>
                      <li>• Top with whisked matcha for the layered look.</li>
                    </ul>
                  </div>
                  <div className="relative order-1 lg:order-2">
                    <AdminImageUpload src="/lovable-uploads/b9b609e5-82c9-4039-98a5-3da3b835c962.png" alt="The Focus Smoothie" className="w-full h-full object-cover" imagePath="focus-smoothie" />
                  </div>
                </div>
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