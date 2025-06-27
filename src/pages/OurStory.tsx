
import React from 'react';
import Header from '../components/Header';

const OurStory = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Banner Section */}
      <section className="relative h-screen bg-black overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            alt="Tea ceremony background"
            className="w-full h-full object-cover opacity-60"
          />
        </div>
        <div className="relative z-10 flex items-center justify-center h-full px-4">
          <div className="text-center text-white max-w-4xl">
            <h1 className="text-6xl md:text-8xl font-light mb-8 tracking-wider">
              OUR STORY
            </h1>
            <p className="text-xl md:text-2xl font-light max-w-3xl mx-auto leading-relaxed">
              From ancient wisdom to modern wellness - discover how DIRTEA is revolutionizing 
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
                We believe that tea is not just about eating, but the power of nature's most 
                intelligent superfood. Functional mushrooms have been used for healing and 
                wellness for centuries, worldwide. Our mission is to make these powerful 
                adaptogens accessible to everyone, no matter where you are or how modern life 
                affects you, creating effective daily rituals that help you think clearer, 
                feel stronger, and live better, every day.
              </p>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Two people having tea"
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* DIRTEA Story Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative order-2 lg:order-1">
              <img 
                src="https://images.unsplash.com/photo-1544787219-7f47181a629a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Tea ceremony"
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
            </div>
            <div className="space-y-6 order-1 lg:order-2">
              <h2 className="text-4xl lg:text-5xl font-light text-black">
                The DIRTEA story
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Our founder Simon was struggling with chronic fatigue and brain fog. After years 
                of trying different solutions, he discovered the power of functional mushrooms 
                through a friend's recommendation. The transformation was remarkable - clearer 
                thinking, sustained energy, and better sleep.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Inspired by this life-changing experience, Simon founded DIRTEA to share these 
                incredible adaptogens with the world, making them accessible and enjoyable for everyone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-20 px-4 bg-black text-white">
        <div className="max-w-5xl mx-auto text-center">
          <blockquote className="text-3xl lg:text-4xl font-light leading-relaxed italic mb-8">
            "I discovered the adaptogenic power of functional mushrooms experientially. 
            However, you've got nothing like potential energy, whether that's focus, 
            balance, or long-term resilience. DIRTEA delivers nature's most intelligent 
            superfood in their easiest form."
          </blockquote>
          <div className="text-xl text-gray-300">
            - Simon, Founder
          </div>
        </div>
      </section>

      {/* Health Rooted in Nature */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl lg:text-5xl font-light text-black">
                Health, Rooted in Nature
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Our functional mushroom blends are carefully crafted using the finest organic 
                ingredients. Each blend is designed to support specific wellness goals, from 
                cognitive function to immune support and stress management.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                We source our mushrooms from trusted growers who share our commitment to quality 
                and sustainability, ensuring every cup delivers maximum potency and purity.
              </p>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1518495973542-4542c06a5843?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Natural mushroom pattern"
                className="w-full h-96 object-cover rounded-lg shadow-lg"
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
              <img 
                src="https://images.unsplash.com/photo-1594736797933-d0200ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Ancient wisdom"
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
            </div>
            <div className="space-y-6 order-1 lg:order-2">
              <h2 className="text-4xl lg:text-5xl font-light text-black">
                Centuries of Wisdom, Designed for Today
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Traditional Chinese Medicine and Ayurvedic practices have utilized functional 
                mushrooms for thousands of years. We honor this ancient wisdom while applying 
                modern science to create products that fit seamlessly into contemporary lifestyles.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Our research-backed formulations ensure optimal bioavailability and efficacy, 
                making these time-tested remedies accessible for modern wellness routines.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Showcase */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-light text-black text-center mb-16">
            Fuel Your Mind & Body
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <img 
                src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                alt="Clarity Focus"
                className="w-full h-80 object-cover rounded-lg mb-6 group-hover:scale-105 transition-transform duration-300"
              />
              <h3 className="text-2xl font-light text-black mb-2">Clarity Focus</h3>
              <p className="text-gray-600">Enhanced cognitive function and mental clarity</p>
            </div>
            <div className="text-center group">
              <img 
                src="https://images.unsplash.com/photo-1571115764595-644a1f56a55c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                alt="Balance Adaptogen"
                className="w-full h-80 object-cover rounded-lg mb-6 group-hover:scale-105 transition-transform duration-300"
              />
              <h3 className="text-2xl font-light text-black mb-2">Balance Adaptogen</h3>
              <p className="text-gray-600">Stress support and hormonal balance</p>
            </div>
            <div className="text-center group">
              <img 
                src="https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                alt="Immunity Support"
                className="w-full h-80 object-cover rounded-lg mb-6 group-hover:scale-105 transition-transform duration-300"
              />
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
                Quality isn't just a promise - it's our foundation. Every batch is third-party 
                tested for purity, potency, and safety. We work exclusively with certified 
                organic suppliers and maintain the highest manufacturing standards.
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
              <img 
                src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Quality manufacturing"
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
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
          <h2 className="text-6xl lg:text-8xl font-light mb-8 text-black">DIRTEA</h2>
          <div className="flex justify-center space-x-2 mb-12">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-3 h-3 bg-black rounded-full"></div>
            ))}
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
