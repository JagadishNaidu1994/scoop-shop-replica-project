
import React from 'react';
import Header from '../components/Header';

const OurStory = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-5xl lg:text-6xl font-bold text-black leading-tight">
                Our mission
              </h1>
              <p className="text-lg text-gray-700 leading-relaxed max-w-lg">
                We believe that tea is not just about eating, but the power of nature's most intelligent superfood. 
                Functional mushrooms have been used for healing and wellness for centuries, worldwide. 
                Our mission is to make these powerful adaptogens accessible to everyone, no matter 
                where you are talking or how modern life, creating effective daily rituals that help you think 
                clearer, feel stronger, and live better, every day. So you can have more meaningful 
                conversations and deeper connections with the people you love.
              </p>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Two people having tea"
                className="w-full h-96 object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* The DIRTEA Story Section */}
      <section className="bg-gray-900 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1544787219-7f47181a629a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Tea ceremony"
                className="w-full h-96 object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 rounded-lg"></div>
            </div>
            <div className="space-y-6">
              <h2 className="text-4xl font-bold">The DIRTEA story</h2>
              <p className="text-gray-300 leading-relaxed">
                Our founder Simon was struggling with chronic fatigue and brain fog. After years of trying 
                different solutions, he discovered the power of functional mushrooms through a friend's 
                recommendation. The transformation was remarkable - clearer thinking, sustained energy, 
                and better sleep.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Inspired by this life-changing experience, Simon founded DIRTEA to share these incredible 
                adaptogens with the world, making them accessible and enjoyable for everyone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <blockquote className="text-2xl lg:text-3xl font-light text-gray-800 italic leading-relaxed">
            "I discovered the adaptogenic power of functional mushrooms experientially. I experienced this really 
            dry, chalky & earthy, powdery way to consume something. However, you've got nothing like 
            a potential energy, whether that's focus, balance, or long-term resilience. DIRTEA 
            delivers nature's most intelligent superfood in their easiest form."
          </blockquote>
          <div className="mt-8 text-lg text-gray-600">
            - Simon, Founder
          </div>
        </div>
      </section>

      {/* Health, Rooted in Nature Section */}
      <section className="bg-gray-50 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-black">Health, Rooted in Nature</h2>
              <p className="text-gray-700 leading-relaxed">
                Our functional mushroom blends are carefully crafted using the finest organic ingredients. 
                Each blend is designed to support specific wellness goals, from cognitive function to 
                immune support and stress management.
              </p>
              <p className="text-gray-700 leading-relaxed">
                We source our mushrooms from trusted growers who share our commitment to quality 
                and sustainability, ensuring every cup delivers maximum potency and purity.
              </p>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1518495973542-4542c06a5843?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Natural mushroom pattern"
                className="w-full h-96 object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Centuries of Wisdom Section */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1594736797933-d0200ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Ancient wisdom"
                className="w-full h-96 object-cover rounded-lg"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-black">Centuries of Wisdom, Designed for Today</h2>
              <p className="text-gray-700 leading-relaxed">
                Traditional Chinese Medicine and Ayurvedic practices have utilized functional mushrooms 
                for thousands of years. We honor this ancient wisdom while applying modern science 
                to create products that fit seamlessly into contemporary lifestyles.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Our research-backed formulations ensure optimal bioavailability and efficacy, 
                making these time-tested remedies accessible for modern wellness routines.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Ancient Power, Modern Innovation Section */}
      <section className="bg-gray-50 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-black">Ancient Power, Modern Innovation</h2>
              <p className="text-gray-700 leading-relaxed">
                We combine traditional knowledge with cutting-edge extraction methods to preserve 
                the full spectrum of beneficial compounds in our mushroom blends. Our proprietary 
                processing techniques ensure maximum potency while maintaining the natural integrity 
                of each ingredient.
              </p>
              <p className="text-gray-700 leading-relaxed">
                From lab to cup, every step of our process is carefully monitored to deliver 
                consistent, high-quality products that support your wellness journey.
              </p>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1571115764595-644a1f56a55c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Modern tea preparation"
                className="w-full h-96 object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Building the mushroom movement Section */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1556909114-4f980e5c7062?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Community building"
                className="w-full h-96 object-cover rounded-lg"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-black">Building the mushroom movement</h2>
              <p className="text-gray-700 leading-relaxed">
                We're not just selling products - we're building a community of wellness enthusiasts 
                who understand the transformative power of functional mushrooms. Through education, 
                research, and shared experiences, we're helping people discover natural ways to 
                optimize their health and wellbeing.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Join thousands of others who have made functional mushrooms part of their daily 
                routine and experience the difference for yourself.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section 2 */}
      <section className="bg-gray-900 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <blockquote className="text-2xl lg:text-3xl font-light leading-relaxed italic">
            "Our functional mushroom blends are adaptable to four morning, focus, and resilience - 
            based on compounds, from each strain balance immunity, creativity, and physical stamina as 
            just the beginning. We're here to support your wellness journey with every meaningful sip."
          </blockquote>
          <div className="mt-8 text-lg text-gray-300">
            To their most thoughtful form
          </div>
        </div>
      </section>

      {/* Commitment to quality Section */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-black">Commitment to quality & manufacturing</h2>
              <p className="text-gray-700 leading-relaxed">
                Quality isn't just a promise - it's our foundation. Every batch is third-party tested 
                for purity, potency, and safety. We work exclusively with certified organic suppliers 
                and maintain the highest manufacturing standards.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Our facility follows Good Manufacturing Practices (GMP) and is regularly audited 
                to ensure consistent quality and safety in every product we create.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>• Third-party tested for purity and potency</li>
                <li>• Certified organic ingredients</li>
                <li>• GMP certified manufacturing</li>
                <li>• Sustainable sourcing practices</li>
              </ul>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Quality hands"
                className="w-full h-96 object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Fuel Your Mind & Body Section */}
      <section className="bg-gray-50 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-black text-center mb-12">Fuel Your Mind & Body</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg overflow-hidden shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                alt="Clarity Focus"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-black mb-2">Clarity Focus</h3>
                <p className="text-gray-600">Enhanced cognitive function and mental clarity</p>
              </div>
            </div>
            <div className="bg-white rounded-lg overflow-hidden shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1571115764595-644a1f56a55c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                alt="Balance Adaptogen"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-black mb-2">Balance Adaptogen</h3>
                <p className="text-gray-600">Stress support and hormonal balance</p>
              </div>
            </div>
            <div className="bg-white rounded-lg overflow-hidden shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                alt="Immunity Support"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-black mb-2">Immunity Support</h3>
                <p className="text-gray-600">Natural immune system enhancement</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-gray-900 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-6xl font-bold mb-8">DIRTEA</h2>
          <div className="flex justify-center space-x-2 mb-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-3 h-3 bg-white rounded-full"></div>
            ))}
          </div>
          <p className="text-xl text-gray-300 mb-8">
            Shop on the future
          </p>
          <div className="grid md:grid-cols-4 gap-8 text-sm text-gray-400">
            <div>
              <h4 className="font-semibold mb-2">Products</h4>
              <ul className="space-y-1">
                <li>Clarity Focus</li>
                <li>Balance Adaptogen</li>
                <li>Immunity Support</li>
                <li>All Products</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Company</h4>
              <ul className="space-y-1">
                <li>About Us</li>
                <li>Our Story</li>
                <li>Contact</li>
                <li>Careers</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Support</h4>
              <ul className="space-y-1">
                <li>FAQ</li>
                <li>Shipping</li>
                <li>Returns</li>
                <li>Support</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Follow</h4>
              <ul className="space-y-1">
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
