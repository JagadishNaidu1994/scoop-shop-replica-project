import React from 'react';
import HeaderNavBar from '@/components/HeaderNavBar';
import Footer from '@/components/Footer';

const OurStory = () => {
  return (
    <div className="min-h-screen bg-white">
      <HeaderNavBar />
      
      {/* Hero Section - Bottom Left Text Positioning */}
      <section className="relative w-full h-[640px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
          alt="Tea ceremony"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black opacity-[0.45]"></div>
        <div className="absolute left-16 bottom-[72px] max-w-[520px] text-left">
          <h1 className="text-white text-5xl font-light mb-3 leading-[1.15]">
            Our mission
          </h1>
          <p className="text-white text-lg leading-[1.6]">
            To deliver premium, organic matcha that energises, empowers, and elevates the everyday lives of a new generation. Through bold flavors, cheeky vibes, we’re here to make a ritual that’s as fun as it is healthy.
          </p>
        </div>
      </section>

      {/* Introduction Text Section */}
      <section className="py-24 px-3 bg-white">
        <div className="text-center">
          <p className="text-xl text-gray-800 leading-[1.6] max-w-[1100px] mx-auto">
            We’re not here to “fix” you. We’re here to upgrade your ritual. Matcha has been a daily staple for generations — steady energy, intentional pace, proper craft. We take that heritage, source it properly from Japan, and bring it into your world: busy mornings, big ambitions, and aesthetic iced lattes. Less crash. More control. Still a vibe.

          </p>
        </div>
      </section>

      {/* The DIRTEA Story Section */}
      <section className="py-20 px-3 bg-gray-900">
        <h2 className="text-5xl font-light text-white text-center mb-8">
          The DIRTEA story
        </h2>
        <p className="text-lg text-white text-center mb-8 max-w-3xl mx-auto">
          In 2016, we discovered the power of functional mushrooms and experienced a transformation in our energy, focus, and resilience.
        </p>
        
        {/* Carousel Container */}
        <div className="relative max-w-7xl mx-auto">
          <div className="flex gap-6 overflow-x-auto scroll-smooth scrollbar-hide snap-x snap-mandatory" id="carousel">
            {/* Slide 1 */}
            <div className="flex-shrink-0 w-[400px] snap-start">
              <div className="relative h-[500px] overflow-hidden rounded-lg group cursor-pointer">
                <img
                  src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Matcha ritual"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-white text-lg leading-relaxed">
                    Three friends, one plan: upgrade your caffeine ritual without the crashy chaos.
                  </p>
                </div>
              </div>
            </div>

            {/* Slide 2 */}
            <div className="flex-shrink-0 w-[400px] snap-start">
              <div className="relative h-[500px] overflow-hidden rounded-lg group cursor-pointer">
                <img
                  src="https://images.unsplash.com/photo-1544787219-7f47181a629a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Japan matcha heritage"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-white text-lg leading-relaxed">
                    Inspired by Japan's matcha heritage - delivered with NR personality.
                  </p>
                </div>
              </div>
            </div>

            {/* Slide 3 */}
            <div className="flex-shrink-0 w-[400px] snap-start">
              <div className="relative h-[500px] overflow-hidden rounded-lg group cursor-pointer">
                <img
                  src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Kagoshima landscape"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-white text-lg leading-relaxed">
                    We went to the source (Kagoshima) to understand what separates real matcha from green imposters.
                  </p>
                </div>
              </div>
            </div>

            {/* Slide 4 */}
            <div className="flex-shrink-0 w-[400px] snap-start">
              <div className="relative h-[500px] overflow-hidden rounded-lg group cursor-pointer">
                <img
                  src="https://images.unsplash.com/photo-1571115764595-644a1f56a55c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Matcha leaves"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-white text-lg leading-relaxed">
                    We chose single-origin, shade-grown, stone-milled matcha because quality is… kind of the point.
                  </p>
                </div>
              </div>
            </div>

            {/* Slide 5 */}
            <div className="flex-shrink-0 w-[400px] snap-start">
              <div className="relative h-[500px] overflow-hidden rounded-lg group cursor-pointer">
                <img
                  src="https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=800&h=800&fit=crop"
                  alt="Matcha preparation methods"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-white text-lg leading-relaxed">
                    Designed to work everywhere: whisked, shaken, iced, latte'd, and café-served.
                  </p>
                </div>
              </div>
            </div>

            {/* Slide 6 */}
            <div className="flex-shrink-0 w-[400px] snap-start">
              <div className="relative h-[500px] overflow-hidden rounded-lg group cursor-pointer">
                <img
                  src="https://images.unsplash.com/photo-1582793988951-9aed5509eb97?w=800&h=800&fit=crop"
                  alt="Pure matcha leaf"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-white text-lg leading-relaxed">
                    Pure leaf. Loud standards.
                  </p>
                </div>
              </div>
            </div>

            {/* Slide 7 */}
            <div className="flex-shrink-0 w-[400px] snap-start">
              <div className="relative h-[500px] overflow-hidden rounded-lg group cursor-pointer">
                <img
                  src="https://images.unsplash.com/photo-1563822249366-707a0051d2f7?w=800&h=800&fit=crop"
                  alt="Nastea Rituals"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-white text-lg leading-relaxed">
                    Nastea Rituals was born.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Carousel Navigation Button */}
          <button
            onClick={() => {
              const carousel = document.getElementById('carousel');
              if (carousel) {
                carousel.scrollBy({ left: 416, behavior: 'smooth' });
              }
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-4 rounded-full transition-colors z-10"
            aria-label="Next slide"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-24 px-3 bg-white">
        <div className="max-w-[760px] mx-auto text-center">
          <div className="text-7xl text-gray-900 leading-none mb-4">"</div>
          <blockquote className="text-xl md:text-[22px] font-medium text-gray-900 leading-[1.6] mb-6">
“We started Nastea Rituals because we were tired of matcha that looked premium but drank mid. So we went back to the source in Japan, obsessed over quality, and built a matcha ritual that’s smooth, vibrant, and consistent enough for real daily life. NR is wellness with a personality - clean caffeine, zero boring, and a little main-character energy in every cup. Welcome to your new green flag.”          </blockquote>
          <p className="text-base text-gray-700">
            Founders, Nastea Rituals
          </p>
        </div>
      </section>

      {/* Section 1: Health, Rooted in Nature - Image Left / Text Right */}
      <section className="py-20 px-3 bg-white">
        <div className="grid grid-cols-2 gap-12 items-center">
          <div className="h-[420px] overflow-hidden rounded-lg">
            <img
              src="/lovable-uploads/cfe9af70-3679-48c2-a090-99c899b9cfef.png"
              alt="Mycelial network pattern"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-5xl font-light text-gray-900 mb-6">
              Wellness, Rooted in Ritual
            </h2>
            <p className="text-lg text-gray-700 leading-[1.6]">
The best habits aren’t forced - they’re repeated. Matcha has been a daily ritual for centuries, and when it’s done right, it’s the simplest upgrade: clean energy, calm focus, zero drama.            </p>
          </div>
        </div>
      </section>

      {/* Section 2: Centuries of Wisdom - Text Left / Image Right */}
      <section className="py-20 px-3 bg-gray-50">
        <div className="grid grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-5xl font-light text-gray-900 mb-6">
              Japanese Craft, Made for Today
            </h2>
            <p className="text-lg text-gray-700 leading-[1.6]">
Matcha comes from a deep tradition of patience and precision - shade-grown leaves, careful harvests, and slow stone-milling. We keep the craft intact, then bring it into modern life with premium standards and a little personality.
            </p>
          </div>
          <div className="h-[420px] overflow-hidden rounded-lg">
            <img
              src="https://images.unsplash.com/photo-1594736797933-d0200ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Mushroom close-up"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Section 3: Ancient Power - Image Left / Text Right */}
      <section className="py-20 px-3 bg-white">
        <div className="grid grid-cols-2 gap-12 items-center">
          <div className="h-[420px] overflow-hidden rounded-lg">
            <img
              src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Matcha preparation"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-5xl font-light text-gray-900 mb-6">
Pure Leaf, Loud Standards
            </h2>
            <p className="text-lg text-gray-700 leading-[1.6]">
We don’t do fillers, flavour tricks, or “green powder” cosplay. Just Japan-grown matcha selected for the things that matter in a cup: smooth taste, vivid colour, and consistency you can trust.
            </p>
          </div>
        </div>
      </section>

      {/* Section 4: Building the Mushroom Movement - Text Left / Image Right */}
      <section className="py-20 px-3 bg-gray-50">
        <div className="grid grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-5xl font-light text-gray-900 mb-6">
              Building the Matcha movement
            </h2>
            <p className="text-lg text-gray-700 leading-[1.6] mb-4">
We’re here to make matcha the go-to daily ritual for India’s modern, style-led generation  through better sourcing, better education, and café partnerships that raise the bar.            </p>
            <p className="text-lg text-gray-700 leading-[1.6]">
NR isn’t a quick fix. It’s choosing a cleaner, smarter way to sip and making “I’m a matcha person” your best personality trait.
            </p>
          </div>
          <div className="h-[380px] overflow-hidden rounded-lg">
            <img
              src="https://images.unsplash.com/photo-1571115764595-644a1f56a55c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="People discussing mushrooms"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* The NASTEA Standard Section */}
      <section className="py-20 px-3 bg-gray-50">
        <div className="grid grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <h2 className="text-4xl font-bold text-black">The NASTEA Standard</h2>

            <div className="space-y-6">
              <div className="border-l-4 border-orange-400 pl-6">
                <h3 className="text-xl font-semibold text-black mb-2">Japan-Grown, Shade-Grown</h3>
                <p className="text-gray-600">We source Kagoshima Japanese matcha that's shade-grown for the signature umami and smoothness for your daily routine.</p>
              </div>

              <div className="border-l-4 border-orange-400 pl-6">
                <h3 className="text-xl font-semibold text-black mb-2">Stone-Milled for Silk-Smooth Sips</h3>
                <p className="text-gray-600">Our leaves are stone-milled into a fine, fluffy powder that blends clean, whisks fast, and drinks like velvet—no grit, no swampy bitterness.</p>
              </div>

              <div className="border-l-4 border-orange-400 pl-6">
                <h3 className="text-xl font-semibold text-black mb-2">Grades That Match Your Mood</h3>
                <p className="text-gray-600">From Ceremonial for your main-character mornings to Premium for daily lattes and café menus, our lineup is built for consistency in taste, texture, and that neon-clean colour everyone notices.</p>
              </div>

              <div className="border-l-4 border-orange-400 pl-6">
                <h3 className="text-xl font-semibold text-black mb-2">Consistency You Can Count On</h3>
                <p className="text-gray-600">Every batch is selected to hit the same flavour-and-colour standard—so your cup (and your café drinks) look iconic, taste smooth, and never surprise you in a bad way.</p>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative h-[500px] overflow-hidden rounded-lg">
            <img
              src="/lovable-uploads/da6fe5b0-6a57-4ada-a9b8-042646881f03.png"
              alt="Hands holding mushroom coffee cup"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      <Footer key={Date.now()} />
    </div>
  );
};

export default OurStory;
