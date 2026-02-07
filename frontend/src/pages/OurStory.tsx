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
          The NASTEA story
        </h2>
        <p className="text-lg text-white text-center mb-8 max-w-3xl mx-auto">
          We discovered the power of matcha and experienced a transformation in our energy, focus, and resilience.
        </p>
        <div className="grid grid-cols-3 gap-6">
          <div className="h-[260px] overflow-hidden rounded-lg">
            <img
              src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Founder"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="h-[260px] overflow-hidden rounded-lg">
            <img
              src="https://images.unsplash.com/photo-1544787219-7f47181a629a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Tea preparation"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="h-[260px] overflow-hidden rounded-lg">
            <img
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Nature landscape"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-24 px-3 bg-white">
        <div className="max-w-[760px] mx-auto text-center">
          <div className="text-7xl text-gray-900 leading-none mb-4">"</div>
          <blockquote className="text-xl md:text-[22px] font-medium text-gray-900 leading-[1.6] mb-6">
            Double-extracted for maximum absorption, our blends seamlessly integrate into daily life, offering a clean, effortless way to support well-being. Whether you're looking for sustained energy, sharper focus, inner balance, or long-term resilience, DIRTEA delivers nature's most intelligent superfoods in their purest form
          </blockquote>
          <p className="text-base text-gray-700">
            Andrew Salter, Co-Founder
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
              Health, Rooted in Nature
            </h2>
            <p className="text-lg text-gray-700 leading-[1.6]">
              The best answers to health have always been written in nature's design, an intelligence that has evolved over millions of years. Beneath every step, lies a vast mycelial network, an ancient system that connects and sustains life.
            </p>
          </div>
        </div>
      </section>

      {/* Section 2: Centuries of Wisdom - Text Left / Image Right */}
      <section className="py-20 px-3 bg-gray-50">
        <div className="grid grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-5xl font-light text-gray-900 mb-6">
              Centuries of Wisdom, Designed for Today
            </h2>
            <p className="text-lg text-gray-700 leading-[1.6]">
              Mushrooms have been trusted for centuries to fuel endurance, sharpen the mind, and strengthen the body. Now, modern science is catching up, revealing their ability to support energy, cognition, and resilience.
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
              Ancient Power, Modern Innovation
            </h2>
            <p className="text-lg text-gray-700 leading-[1.6]">
              At DIRTEA we harness this ancient wisdom through modern innovation, making nature's most powerful superfoods accessible, effective, and seamlessly integrated into modern life.
            </p>
          </div>
        </div>
      </section>

      {/* Section 4: Building the Mushroom Movement - Text Left / Image Right */}
      <section className="py-20 px-3 bg-gray-50">
        <div className="grid grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-5xl font-light text-gray-900 mb-6">
              Building the mushroom movement
            </h2>
            <p className="text-lg text-gray-700 leading-[1.6] mb-4">
              Through education, innovation, and pure formulations, we're making functional mushrooms effortless to integrate into daily life - redefining what it means to fuel your body and mind. We've traveled the world sourcing the highest-quality mushrooms, perfecting extractions, and creating blends trusted by thousands.
            </p>
            <p className="text-lg text-gray-700 leading-[1.6]">
              By shifting to DIRTEA, you're choosing a cleaner, smarter approach - one rooted in nature, not short-term fixes. The future of well-being starts here.
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

      {/* Commitment to Quality Section - Text Left / Image Right */}
      <section className="py-20 px-3 bg-gray-100">
        <div className="grid grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-5xl font-light text-gray-900 mb-6">
              Commitment to quality & manufacturing
            </h2>
            <p className="text-lg text-gray-700 leading-[1.6] mb-8">
              Purity and efficacy come first. We go beyond industry standards, ensuring that every DIRTEA blend is tested, extracted, and formulated for maximum benefit.
            </p>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  100% fruiting body extracts
                </h3>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Dual-extraction
                </h3>
                <p className="text-base text-gray-600">
                  Dual-extracted for better absorption – optimised to over 40% Beta Glucans.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Sourced from the best
                </h3>
                <p className="text-base text-gray-600">
                  Sourced from the best regions worldwide – only the highest-quality mushrooms.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Tested for purity & efficacy
                </h3>
                <p className="text-base text-gray-600">
                  Tested for purity & efficacy – no heavy metals, no contaminants.
                </p>
              </div>
            </div>
          </div>
          <div className="h-[420px] overflow-hidden rounded-lg">
            <img
              src="https://images.unsplash.com/photo-1582793988951-9aed5509eb97?w=800&h=800&fit=crop"
              alt="Hands holding mushroom latte"
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
