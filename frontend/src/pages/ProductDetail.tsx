import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HeaderNavBar from '@/components/HeaderNavBar';
import Footer from '@/components/Footer';
import MatchaLoadingAnimation from '@/components/MatchaLoadingAnimation';
import { supabase } from '@/integrations/supabase/client';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Star, Plus, Minus, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  primary_image: string;
  category: string;
}

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [subscriptionType, setSubscriptionType] = useState<'subscribe' | 'one-time'>('subscribe');
  const [currentReview, setCurrentReview] = useState(0);

  // Product images for gallery
  const productImages = [
    'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1544787219-7f47181a629a?w=800&h=800&fit=crop',
  ];

  // Customer reviews
  const reviews = [
    {
      name: "Ellie F.",
      review: "I have been obsessed with the brand for over 2 years. Reishi changed my life for sleep and now I'm loving this matcha blend!",
      rating: 5,
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop"
    },
    {
      name: "Atlanta R.",
      review: "Very yummy to have hot or cold! The ceremonial grade really makes a difference.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
    },
    {
      name: "Sharon S.",
      review: "My life, my skin and my energy level has changed since my very first cup of Nastea matcha. I look forward to it every morning!",
      rating: 5,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
    },
    {
      name: "Julia B.",
      review: "Just love it! Best matcha I've ever had. The focus and energy is amazing without any jitters.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100&h=100&fit=crop"
    },
  ];

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
        toast({
          title: "Error",
          description: "Failed to load product details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product.id,
        name: product.name,
        price: subscriptionType === 'subscribe' ? product.price * 0.8 : product.price,
        quantity: quantity,
        image: product.primary_image
      });
      toast({
        title: "Added to cart",
        description: `${quantity} x ${product.name} added to your cart`,
      });
    }
  };

  if (loading) {
    return <MatchaLoadingAnimation />;
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <HeaderNavBar />
        <div className="flex items-center justify-center h-96">
          <p>Product not found</p>
        </div>
        <Footer />
      </div>
    );
  }

  const subscriptionPrice = (product.price * 0.8).toFixed(2);
  const oneTimePrice = product.price.toFixed(2);

  return (
    <div className="min-h-screen bg-white">
      <HeaderNavBar />

      {/* Product Showcase Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Column - Image Gallery */}
          <div className="flex gap-4">
            {/* Thumbnail Gallery - Vertical */}
            <div className="flex flex-col gap-3">
              {productImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === idx ? 'border-gray-900' : 'border-gray-200'
                  }`}
                >
                  <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Main Image */}
            <div className="flex-1 relative aspect-square overflow-hidden rounded-lg bg-gray-100">
              <img
                src={productImages[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right Column - Product Info */}
          <div className="space-y-6">
            {/* Rating & Reviews */}
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-sm text-gray-600">22,212 Reviews</span>
            </div>

            {/* Product Title */}
            <h1 className="text-4xl font-bold text-gray-900">{product.name}</h1>

            {/* Description */}
            <p className="text-lg text-gray-700">
              The creamiest, ceremonial-grade matcha with Lion's Mane, Tremella, and essential B vitamins.
            </p>

            {/* Key Benefits Icons */}
            <div className="flex gap-6">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                  <span className="text-2xl">⚡</span>
                </div>
                <span className="text-sm text-gray-600">Energy</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                  <span className="text-2xl">🧠</span>
                </div>
                <span className="text-sm text-gray-600">Focus</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                  <span className="text-2xl">✨</span>
                </div>
                <span className="text-sm text-gray-600">Skin</span>
              </div>
            </div>

            {/* Subscription Option */}
            <div className="border-2 border-gray-900 rounded-lg p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    checked={subscriptionType === 'subscribe'}
                    onChange={() => setSubscriptionType('subscribe')}
                    className="w-5 h-5"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">EVERY 4 WEEKS</div>
                  </div>
                </div>
                <div className="bg-black text-white px-3 py-1 rounded text-sm font-semibold">
                  20% OFF
                </div>
              </div>
              <div className="flex items-baseline justify-between mb-3">
                <div className="text-3xl font-bold text-gray-900">£{subscriptionPrice}</div>
                <div className="text-sm text-gray-500">£{(parseFloat(subscriptionPrice) / 30).toFixed(2)} per serving</div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center border border-gray-300 rounded-lg mb-4 w-32">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-gray-100 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="flex-1 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 hover:bg-gray-100 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Cart Button */}
              <Button
                onClick={handleAddToCart}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white py-6 text-base font-semibold rounded-lg mb-3"
              >
                ADD TO CART - £{subscriptionType === 'subscribe' ? subscriptionPrice : oneTimePrice}
              </Button>

              {/* Secondary CTA */}
              <Button
                className="w-full bg-[#5A31F4] hover:bg-[#4A21D4] text-white py-6 text-base font-semibold rounded-lg mb-3"
              >
                Buy with shop
              </Button>

              <div className="text-center mb-4">
                <button className="text-sm text-gray-600 underline hover:text-gray-900">
                  More payment options
                </button>
              </div>

              <p className="text-sm text-gray-600 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-xs">i</span>
                Manage your subscription anytime
              </p>
            </div>

            {/* One-Time Purchase Option */}
            <div
              onClick={() => setSubscriptionType('one-time')}
              className={`p-5 rounded-lg border-2 cursor-pointer transition-all ${
                subscriptionType === 'one-time'
                  ? 'border-gray-900 bg-gray-50'
                  : 'border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    checked={subscriptionType === 'one-time'}
                    onChange={() => setSubscriptionType('one-time')}
                    className="w-5 h-5"
                  />
                  <div className="font-semibold text-gray-900">One-Time Purchase</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">£{oneTimePrice}</div>
                  <div className="text-sm text-gray-500">£{(product.price / 30).toFixed(2)} per serving</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pure Ingredients Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Pure ingredients, powerful benefits.
              </h2>
              <div className="space-y-4">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="text-sm font-semibold text-green-600 mb-1">TREMELLA</div>
                  <div className="text-2xl font-bold text-gray-900">1,250mg per serving</div>
                </div>
              </div>
            </div>
            <div className="relative h-96">
              <img
                src="https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=600&h=600&fit=crop"
                alt="Tremella ingredient"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Founder's Video Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            See how our founders use DIRTEA Matcha in their DAILY WELLNESS ROUTINE
          </h2>
          <div className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1200&h=675&fit=crop"
              alt="Founder's video"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <button className="w-20 h-20 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                <Play className="w-10 h-10 text-gray-900 ml-1" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* For Calm Energy Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-96">
              <img
                src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=600&fit=crop"
                alt="Matcha powder"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                For calm energy and better focus
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                Our ceremonial-grade matcha combined with functional mushrooms provides sustained energy without the crash. Perfect for your daily wellness routine.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span className="text-gray-700">Steady, sustained energy</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span className="text-gray-700">Enhanced mental clarity</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span className="text-gray-700">No jitters or crash</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to DIRTEA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">How to DIRTEA</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { step: 1, text: "Add 6g of DIRTEA Matcha powder to a cup", img: "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400&h=400&fit=crop" },
              { step: 2, text: "Pour in 100ml of hot water", img: "https://images.unsplash.com/photo-1544787219-7f47181a629a?w=400&h=400&fit=crop" },
              { step: 3, text: "Whisk well until frothy", img: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop" },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="relative aspect-square mb-4 rounded-lg overflow-hidden">
                  <img src={item.img} alt={`Step ${item.step}`} className="w-full h-full object-cover" />
                </div>
                <div className="font-semibold text-green-600 mb-2">STEP {item.step}</div>
                <p className="text-gray-700">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mushroom Matcha Comparison Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-96">
              <img
                src="https://images.unsplash.com/photo-1582793988951-9aed5509eb97?w=600&h=600&fit=crop"
                alt="Matcha bowl"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Mushroom Matcha</h2>
              <h3 className="text-2xl font-semibold text-gray-700 mb-6">How it Compares</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3">What is mushroom matcha?</h4>
                  <p className="text-gray-700">
                    A premium blend of ceremonial-grade matcha with functional mushrooms like Lion's Mane and Tremella, enhanced with essential B vitamins for optimal wellness support.
                  </p>
                </div>
                
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3">Matcha mushroom benefits</h4>
                  <p className="text-gray-700">
                    Combines the sustained energy of matcha with the cognitive support of Lion's Mane and the beauty benefits of Tremella for a complete wellness experience.
                  </p>
                </div>
                
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3">Where does it fit in your routine?</h4>
                  <p className="text-gray-700">
                    Perfect as your morning ritual or afternoon pick-me-up. Replace your coffee or add to your wellness stack for enhanced focus and energy.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Drink for Benefits Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-5xl font-bold text-gray-900 mb-8">Drink for</h2>
              <div className="space-y-4 mb-8">
                <div className="text-3xl font-semibold text-gray-800">Steady energy</div>
                <div className="text-3xl font-semibold text-gray-800">Calm focus</div>
                <div className="text-3xl font-semibold text-gray-800">Hydrated skin</div>
              </div>
              <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg font-semibold rounded-lg">
                SEE RECIPES
              </Button>
            </div>
            <div className="relative h-[600px]">
              <img
                src="https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=600&h=900&fit=crop"
                alt="Woman with matcha drink"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Founder's Recipe Sections */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 space-y-20">
          {/* Hot Matcha Recipe */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-96">
              <img
                src="https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=600&h=600&fit=crop"
                alt="Hot matcha"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div>
              <div className="text-sm font-semibold text-green-600 mb-2">FOUNDER'S SUPER BLEND RECIPE</div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">The DIRTEA Matcha</h3>
              <p className="text-lg text-gray-700 mb-6">
                Enjoy this balanced, velvety blend, providing steady energy and calm focus.
              </p>
              <div className="space-y-3">
                <div className="font-bold text-gray-900 mb-3">To make:</div>
                {[
                  "Add a 6g scoop of DIRTEA Matcha powder to a cup",
                  "Pour in 100ml of hot water and whisk well",
                  "Froth 150ml milk of your choice",
                  "Pour into your cup",
                  "Enjoy!"
                ].map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">
                      {idx + 1}
                    </div>
                    <p className="text-gray-700">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Iced Matcha Recipe */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="lg:order-2 relative h-96">
              <img
                src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=600&fit=crop"
                alt="Iced matcha"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div className="lg:order-1">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">The DIRTEA Iced Matcha</h3>
              <p className="text-lg text-gray-700 mb-6">
                Enjoy calm focus and sustained energy with a refreshing and revitalising iced matcha.
              </p>
              <div className="space-y-3">
                <div className="font-bold text-gray-900 mb-3">To make:</div>
                {[
                  "Add a 6g scoop of DIRTEA Matcha powder into a small mug",
                  "Pour in 30ml of hot water and whisk well",
                  "Fill a separate glass with ice",
                  "Pour the DIRTEA matcha into the glass of ice",
                  "Top with your favourite milk (coconut milk pairs nicely)",
                  "Enjoy!"
                ].map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">
                      {idx + 1}
                    </div>
                    <p className="text-gray-700">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews Carousel */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-lg font-semibold">4.8/5</span>
              </div>
              <p className="text-gray-600">22,212 reviews</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentReview(Math.max(0, currentReview - 1))}
                className="p-2 border border-gray-300 rounded-full hover:bg-gray-100"
                disabled={currentReview === 0}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() => setCurrentReview(Math.min(reviews.length - 1, currentReview + 1))}
                className="p-2 border border-gray-300 rounded-full hover:bg-gray-100"
                disabled={currentReview === reviews.length - 1}
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {reviews.map((review, idx) => (
              <div key={idx} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={review.image}
                    alt={review.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">{review.name}</div>
                    <div className="flex">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 text-sm">{review.review}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The DIRTEA Standard Section - Keep as is */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">The DIRTEA Standard</h2>
          
          <div className="bg-white rounded-lg p-8 mb-8">
            <p className="text-lg text-gray-700 leading-relaxed">
              Our customers love DIRTEA Matcha Mushroom Super Blend for its ability to enhance focus and provide steady energy throughout the day. It has a rich, velvety blend and is made with 100% pure ceremonial-grade Japanese matcha. Blended with Lion's Mane and Tremella, as well as MCT, Moringa and essential Organic Natural B Vitamins.
            </p>
          </div>

          <div className="space-y-4">
            <Collapsible>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-6 bg-white rounded-lg hover:bg-gray-50 transition-colors">
                <span className="font-semibold text-lg text-gray-900">How does DIRTEA Matcha support steady energy and calm focus?</span>
                <Plus className="w-5 h-5 text-gray-600" />
              </CollapsibleTrigger>
              <CollapsibleContent className="p-6 bg-white border-t">
                <p className="text-gray-700">
                  DIRTEA Matcha contains L-theanine, which promotes calm alertness, combined with natural caffeine for sustained energy without the crash.
                </p>
              </CollapsibleContent>
            </Collapsible>

            <Collapsible>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-6 bg-white rounded-lg hover:bg-gray-50 transition-colors">
                <span className="font-semibold text-lg text-gray-900">What does DIRTEA Matcha taste like?</span>
                <Plus className="w-5 h-5 text-gray-600" />
              </CollapsibleTrigger>
              <CollapsibleContent className="p-6 bg-white border-t">
                <p className="text-gray-700">
                  Our ceremonial-grade matcha has a smooth, creamy taste with natural sweetness and umami notes, without any bitterness.
                </p>
              </CollapsibleContent>
            </Collapsible>

            <Collapsible>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-6 bg-white rounded-lg hover:bg-gray-50 transition-colors">
                <span className="font-semibold text-lg text-gray-900">What makes DIRTEA Matcha Mushroom Super Blend different from regular matcha?</span>
                <Plus className="w-5 h-5 text-gray-600" />
              </CollapsibleTrigger>
              <CollapsibleContent className="p-6 bg-white border-t">
                <p className="text-gray-700">
                  We've enhanced premium ceremonial matcha with Lion's Mane for cognitive support, Tremella for skin hydration, and essential B vitamins for comprehensive wellness benefits.
                </p>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProductDetail;
