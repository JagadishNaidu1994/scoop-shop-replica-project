
import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import HeaderNavBar from '@/components/HeaderNavBar';
import AdminImageUpload from '@/components/AdminImageUpload';

const OurStory = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const storyCards = [
    {
      text: "Three friends, one plan: upgrade your caffeine ritual without the crashy chaos.",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
      text: "Inspired by Japan's matcha heritage - delivered with NR personality.",
      image: "https://images.unsplash.com/photo-1544787219-7f47181a629a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
      text: "We went to the source (Kagoshima) to understand what separates real matcha from green imposters.",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
      text: "We chose single-origin, shade-grown, stone-milled matcha because quality is… kind of the point.",
      image: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
      text: "Designed to work everywhere: whisked, shaken, iced, latte'd, and café-served.",
      image: "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400&h=400&fit=crop"
    },
    {
      text: "Pure leaf. Loud standards.",
      image: "https://images.unsplash.com/photo-1582793988951-9aed5509eb97?w=400&h=400&fit=crop"
    },
    {
      text: "Nastea Rituals was born.",
      image: "https://images.unsplash.com/photo-1563822249366-707a0051d2f7?w=400&h=400&fit=crop"
    }
  ];

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      const newScrollLeft = direction === 'left'
        ? scrollContainerRef.current.scrollLeft - scrollAmount
        : scrollContainerRef.current.scrollLeft + scrollAmount;

      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <HeaderNavBar />
      
      {/* Hero Banner Section */}
      <section className="relative h-screen bg-black overflow-hidden">
        <div className="absolute inset-0">
          <AdminImageUpload
            src="https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            alt="Tea ceremony background"
            className="w-full h-full object-cover opacity-60"
            imagePath="our-story-hero-background"
          />
        </div>
        <div className="relative z-10 flex items-center justify-center h-full px-4">
          <div className="text-center text-white max-w-4xl">
            <h1 className="text-6xl md:text-8xl font-light mb-8 tracking-wider">
              OUR STORY
            </h1>
            <p className="text-xl md:text-2xl font-light max-w-3xl mx-auto leading-relaxed">
              From ancient wisdom to modern wellness - discover how NASTEA is revolutionizing 
              the way we think about functional mushrooms and daily rituals.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-5xl lg:text-6xl font-light text-black leading-tight">
                Our mission
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                To deliver premium, organic matcha that energises, empowers, and elevates the everyday lives of a new generation. Through bold flavors, cheeky vibes, we're here to make a ritual that's as fun as it is healthy.
                <br />
                <br />
                We're not here to "fix" you. We're here to upgrade your ritual. Matcha has been a daily staple for generations — steady energy, intentional pace, proper craft. We take that heritage, source it properly from Japan, and bring it into your world: busy mornings, big ambitions, and aesthetic iced lattes. Less crash. More control. Still a vibe.
                <br />
                <br />
                We discovered the power of matcha and experienced a transformation in our energy, focus, and resilience.
              </p>
            </div>
            <div className="relative">
              <AdminImageUpload
                src="https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Two people having tea"
                className="w-full h-96 object-cover rounded-lg shadow-lg"
                imagePath="our-story-tea-ceremony"
              />
            </div>
          </div>
        </div>
      </section>

      {/* The NASTEA Story Section */}
      <section className="py-20 px-4 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-16">
            <h2 className="text-5xl lg:text-6xl font-light">
              The NASTEA story
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => scroll('left')}
                className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              <button
                onClick={() => scroll('right')}
                className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>

          {/* Horizontal Carousel */}
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {storyCards.map((card, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-[350px] relative group snap-start"
              >
                <img
                  src={card.image}
                  alt={`Story card ${index + 1}`}
                  className="w-full h-96 object-cover rounded-lg"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg">
                  <p className="text-white text-sm leading-relaxed">
                    {card.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-20 px-4 bg-black text-white">
        <div className="max-w-5xl mx-auto text-center">
          <blockquote className="text-3xl lg:text-4xl font-light leading-relaxed italic mb-8">
            “We started Nastea Rituals because we were tired of matcha that looked premium but drank mid. So we went back to the source in Japan, obsessed over quality, and built a matcha ritual that’s smooth, vibrant, and consistent enough for real daily life. NR is wellness with a personality - clean caffeine, zero boring, and a little main-character energy in every cup. Welcome to your new green flag.”
          </blockquote>
          <div className="text-xl text-gray-300">
            - Founders, Nastea Rituals

          </div>
        </div>
      </section>

      {/* Health Rooted in Nature */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl lg:text-5xl font-light text-black">
Wellness, Rooted in Ritual
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                The best habits aren’t forced - they’re repeated. Matcha has been a daily ritual for centuries, and when it’s done right, it’s the simplest upgrade: clean energy, calm focus, zero drama.

              </p>
              
            </div>
            <div className="relative">
              <AdminImageUpload
                src="/lovable-uploads/cfe9af70-3679-48c2-a090-99c899b9cfef.png"
                alt="Natural mushroom pattern"
                className="w-full h-96 object-cover rounded-lg shadow-lg"
                imagePath="our-story-mushroom-pattern"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Centuries of Wisdom */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative order-2 lg:order-1">
              <img src="https://images.unsplash.com/photo-1594736797933-d0200ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Ancient wisdom" className="w-full h-96 object-cover rounded-lg shadow-lg" />
            </div>
            <div className="space-y-6 order-1 lg:order-2">
              <h2 className="text-4xl lg:text-5xl font-light text-black">
Japanese Craft, Made for Today
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Matcha comes from a deep tradition of patience and precision - shade-grown leaves, careful harvests, and slow stone-milling. We keep the craft intact, then bring it into modern life with premium standards and a little personality.

              </p>
              
            </div>
          </div>
        </div>
      </section>

      {/* Product Showcase */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-light text-black text-center mb-16">
Pure Leaf, Loud Standards
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <img src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="Clarity Focus" className="w-full h-80 object-cover rounded-lg mb-6 group-hover:scale-105 transition-transform duration-300" />
              <h3 className="text-2xl font-light text-black mb-2">Clarity Focus</h3>
              <p className="text-gray-600">Enhanced cognitive function and mental clarity</p>
            </div>
            <div className="text-center group">
              <img src="https://images.unsplash.com/photo-1571115764595-644a1f56a55c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="Balance Adaptogen" className="w-full h-80 object-cover rounded-lg mb-6 group-hover:scale-105 transition-transform duration-300" />
              <h3 className="text-2xl font-light text-black mb-2">Balance Adaptogen</h3>
              <p className="text-gray-600">Stress support and hormonal balance</p>
            </div>
            <div className="text-center group">
              <img src="https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="Immunity Support" className="w-full h-80 object-cover rounded-lg mb-6 group-hover:scale-105 transition-transform duration-300" />
              <h3 className="text-2xl font-light text-black mb-2">Immunity Support</h3>
              <p className="text-gray-600">Natural immune system enhancement</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quality Commitment */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl lg:text-5xl font-light text-black">
                Commitment to Quality & Manufacturing
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                We don’t do fillers, flavour tricks, or “green powder” cosplay. Just Japan-grown matcha selected for the things that matter in a cup: smooth taste, vivid colour, and consistency you can trust.

              </p>
              <ul className="space-y-3 text-lg text-gray-700">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-black rounded-full mr-4"></span>
                  Third-party tested for purity and potency
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-black rounded-full mr-4"></span>
                  Certified organic ingredients
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-black rounded-full mr-4"></span>
                  GMP certified manufacturing
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-black rounded-full mr-4"></span>
                  Sustainable sourcing practices
                </li>
              </ul>
            </div>
            <div className="relative">
              <img src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Quality manufacturing" className="w-full h-96 object-cover rounded-lg shadow-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Final Quote */}
      <section className="py-20 px-4 bg-black text-white">
        <div className="max-w-5xl mx-auto text-center">
          <blockquote className="text-3xl lg:text-4xl font-light leading-relaxed italic mb-8">
            "Our functional mushroom blends are adaptable for morning focus and resilience - 
            based on compounds from each strain that balance immunity, creativity, and physical 
            stamina. We're here to support your wellness journey with every meaningful sip."
          </blockquote>
          <div className="text-xl text-gray-300">
            To their most thoughtful form
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20 px-4 bg-white text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-6xl lg:text-8xl font-light mb-8 text-black">NASTEA</h2>
          <div className="flex justify-center space-x-2 mb-12">
            {[...Array(6)].map((_, i) => <div key={i} className="w-3 h-3 bg-black rounded-full"></div>)}
          </div>
          <p className="text-2xl text-gray-600 mb-16 font-light">
            Shop for the future
          </p>
          <div className="grid md:grid-cols-4 gap-8 text-left">
            <div>
              <h4 className="font-semibold mb-4 text-black">Products</h4>
              <ul className="space-y-2 text-gray-600">
                <li>Clarity Focus</li>
                <li>Balance Adaptogen</li>
                <li>Immunity Support</li>
                <li>All Products</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-black">Company</h4>
              <ul className="space-y-2 text-gray-600">
                <li>About Us</li>
                <li>Our Story</li>
                <li>Contact</li>
                <li>Careers</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-black">Support</h4>
              <ul className="space-y-2 text-gray-600">
                <li>FAQ</li>
                <li>Shipping</li>
                <li>Returns</li>
                <li>Support</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-black">Follow</h4>
              <ul className="space-y-2 text-gray-600">
                <li>Instagram</li>
                <li>Facebook</li>
                <li>Twitter</li>
                <li>YouTube</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OurStory;
