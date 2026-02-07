import React from 'react';
import HeaderNavBar from '@/components/HeaderNavBar';
import Footer from '@/components/Footer';

const OurStory = () => {
  return (
    <div className="min-h-screen bg-white">
      <HeaderNavBar />
      
      {/* Hero Banner Section - THE DIET LAZY ACT */}
      <section className="relative h-[60vh] md:h-[70vh] bg-black overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            alt="Tea ceremony background"
            className="w-full h-full object-cover opacity-50"
          />
        </div>
        <div className="relative z-10 flex items-center justify-center h-full px-4">
          <div className="text-center text-white max-w-6xl">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-wider mb-4">
              THE DIET LAZY ACT
            </h1>
            <p className="text-sm md:text-base tracking-widest uppercase">
              Reviving a centuries-old approach to wellness through mindful rituals
            </p>
          </div>
        </div>
      </section>

      {/* Introduction Section with 3 Images */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-lg md:text-xl text-gray-800 max-w-4xl mx-auto leading-relaxed">
              Reviving a centuries-old approach to wellness, where ancient wisdom meets modern living. 
              Through the power of matcha and mindful rituals, we're bringing balance back into daily life.
            </p>
          </div>
          
          {/* Three Images Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative h-64 md:h-80 overflow-hidden rounded-lg">
              <img
                src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Matcha preparation"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="relative h-64 md:h-80 overflow-hidden rounded-lg">
              <img
                src="https://images.unsplash.com/photo-1544787219-7f47181a629a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Tea ceremony"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="relative h-64 md:h-80 overflow-hidden rounded-lg">
              <img
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Nature landscape"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section 1: Healthy Food in Nature - Image Left | Text Right */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-96 overflow-hidden rounded-lg">
              <img
                src="https://images.unsplash.com/photo-1571115764595-644a1f56a55c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Healthy food in nature"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-light text-black">
                Healthy Food in Nature
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Nature provides us with everything we need for optimal wellness. From shade-grown matcha leaves 
                to carefully selected botanicals, each ingredient is chosen for its natural potency and purity. 
                We believe in harnessing the power of whole foods to support your body's innate ability to thrive.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Scholar of Wisdom - Text Left | Image Right */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-light text-black">
                Scholar of Wisdom
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Drawing from centuries of traditional Japanese tea ceremony practices, we honor the scholars 
                and masters who perfected the art of matcha cultivation. Their wisdom guides our sourcing 
                decisions, ensuring every batch meets the highest standards of quality and authenticity.
              </p>
            </div>
            <div className="relative h-96 overflow-hidden rounded-lg">
              <img
                src="https://images.unsplash.com/photo-1594736797933-d0200ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Scholar of wisdom"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Ancient Power - Image Left | Text Right */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-96 overflow-hidden rounded-lg">
              <img
                src="/lovable-uploads/cfe9af70-3679-48c2-a090-99c899b9cfef.png"
                alt="Ancient power"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-light text-black">
                Ancient Power
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                The ancient wisdom of functional botanicals has been passed down through generations. 
                These time-tested ingredients have supported human health and vitality for millennia, 
                offering natural compounds that work in harmony with our bodies to promote balance and resilience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Studying the Mushroom - Text Left | Image Right */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-light text-black">
                Studying the Mushroom
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Modern science continues to validate what traditional medicine has known for centuries. 
                Through rigorous research and quality testing, we ensure that every ingredient delivers 
                measurable benefits. Our commitment to transparency means you know exactly what you're 
                consuming and why it matters.
              </p>
            </div>
            <div className="relative h-96 overflow-hidden rounded-lg">
              <img
                src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Studying the mushroom"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Commitment to Integrity Section */}
      <section className="py-20 px-4 bg-teal-600 text-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-light mb-8">
            Commitment to Integrity
          </h2>
          <p className="text-lg md:text-xl leading-relaxed max-w-3xl mx-auto mb-8">
            At NASTEA, integrity isn't just a value—it's our foundation. From sourcing to packaging, 
            every decision is made with transparency, sustainability, and your wellbeing in mind.
          </p>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="space-y-3">
              <div className="text-3xl font-bold">100%</div>
              <p className="text-sm uppercase tracking-wide">Organic Ingredients</p>
            </div>
            <div className="space-y-3">
              <div className="text-3xl font-bold">Third-Party</div>
              <p className="text-sm uppercase tracking-wide">Lab Tested</p>
            </div>
            <div className="space-y-3">
              <div className="text-3xl font-bold">Sustainable</div>
              <p className="text-sm uppercase tracking-wide">Sourcing Practices</p>
            </div>
          </div>
        </div>
      </section>

      {/* Fuel Your Mind & Body Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-light text-black text-center mb-16">
            Fuel Your Mind & Body
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Card 1 */}
            <div className="group cursor-pointer">
              <div className="relative h-64 overflow-hidden rounded-lg mb-4">
                <img
                  src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                  alt="Clarity Focus"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <h3 className="text-xl font-semibold text-black mb-2">Clarity Focus</h3>
              <p className="text-gray-600 text-sm">
                Enhanced cognitive function and mental clarity for peak performance throughout your day.
              </p>
            </div>

            {/* Card 2 */}
            <div className="group cursor-pointer">
              <div className="relative h-64 overflow-hidden rounded-lg mb-4">
                <img
                  src="https://images.unsplash.com/photo-1571115764595-644a1f56a55c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                  alt="Balance Adaptogen"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <h3 className="text-xl font-semibold text-black mb-2">Balance Adaptogen</h3>
              <p className="text-gray-600 text-sm">
                Natural stress support and hormonal balance to help you navigate life's challenges.
              </p>
            </div>

            {/* Card 3 */}
            <div className="group cursor-pointer">
              <div className="relative h-64 overflow-hidden rounded-lg mb-4">
                <img
                  src="https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                  alt="Immunity Support"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <h3 className="text-xl font-semibold text-black mb-2">Immunity Support</h3>
              <p className="text-gray-600 text-sm">
                Strengthen your body's natural defenses with time-tested immune-boosting ingredients.
              </p>
            </div>

            {/* Card 4 */}
            <div className="group cursor-pointer">
              <div className="relative h-64 overflow-hidden rounded-lg mb-4">
                <img
                  src="https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400&h=400&fit=crop"
                  alt="Energy Vitality"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <h3 className="text-xl font-semibold text-black mb-2">Energy Vitality</h3>
              <p className="text-gray-600 text-sm">
                Sustained, clean energy without the crash. Power through your day naturally.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer key={Date.now()} />
    </div>
  );
};

export default OurStory;
