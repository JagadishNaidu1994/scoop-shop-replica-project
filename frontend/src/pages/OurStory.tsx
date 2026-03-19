import React from 'react';
import HeaderNavBar from '@/components/HeaderNavBar';
import Footer from '@/components/Footer';
import NasteaStandard from '@/components/NasteaStandard';

type StorySection = {
  title: string;
  body: string[];
  image: string;
  alt: string;
  reverse?: boolean;
};

const storySections: StorySection[] = [
  {
    title: "Wellness, Rooted in Ritual",
    body: [
      "The best habits aren't forced, they're repeated. Matcha has been a daily ritual for centuries, and when it's done right, it's the simplest upgrade: clean energy, calm focus, zero drama."
    ],
    image: "/lovable-uploads/cfe9af70-3679-48c2-a090-99c899b9cfef.png",
    alt: "Patterned matcha swirl"
  },
  {
    title: "Japanese Craft, Made for Today",
    body: [
      "Matcha comes from a deep tradition of patience and precision: shade-grown leaves, careful harvests, and slow stone-milling. We keep the craft intact, then bring it into modern life with premium standards and a little personality."
    ],
    image: "/lovable-uploads/Uji_Farm.webp",
    alt: "Tea farms in Japan",
    reverse: true
  },
  {
    title: "Pure Leaf, Loud Standards",
    body: [
      "We don't do fillers, flavour tricks, or green powder cosplay. Just Japan-grown matcha selected for the things that matter in a cup: smooth taste, vivid colour, and consistency you can trust."
    ],
    image: "/lovable-uploads/Untitled_design-9.png",
    alt: "Matcha preparation setup"
  },
  {
    title: "Building the Matcha movement",
    body: [
      "We're here to make matcha the go-to daily ritual for India's modern, style-led generation through better sourcing, better education, and cafe partnerships that raise the bar.",
      "NR isn't a quick fix. It's choosing a cleaner, smarter way to sip and making 'I'm a matcha person' your best personality trait."
    ],
    image: "/lovable-uploads/NDN00797-Edit.jpg",
    alt: "Matcha movement visual",
    reverse: true
  }
];

const OurStory = () => {
  return (
    <div className="min-h-screen bg-white">
      <HeaderNavBar />
      
      {/* Hero Section */}
      <section className="relative w-full h-[400px] sm:h-[500px] lg:h-[640px] overflow-hidden">
        <img
          src="/lovable-uploads/NDN00991-Edit.jpg"
          alt="Tea ceremony"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black opacity-[0.45]"></div>
        <div className="absolute left-4 sm:left-8 lg:left-16 bottom-8 sm:bottom-12 lg:bottom-[72px] max-w-[90%] sm:max-w-[520px] text-left">
          <h1 className="text-white text-3xl sm:text-4xl lg:text-5xl font-light mb-3 leading-[1.15]">
            Our mission
          </h1>
          <p className="text-white text-base sm:text-lg leading-[1.6]">
            To deliver premium, organic matcha that energises, empowers, and elevates the everyday lives of a new generation. Through bold flavors, cheeky vibes, we're here to make a ritual that's as fun as it is healthy.
          </p>
        </div>
      </section>

      {/* Introduction Text Section */}
      <section className="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 bg-white">
        <div className="text-center">
          <p className="text-base sm:text-lg lg:text-xl text-gray-800 leading-[1.6] max-w-[1100px] mx-auto">
            We're not here to "fix" you. We're here to upgrade your ritual. Matcha has been a daily staple for generations — steady energy, intentional pace, proper craft. We take that heritage, source it properly from Japan, and bring it into your world: busy mornings, big ambitions, and aesthetic iced lattes. Less crash. More control. Still a vibe.
          </p>
        </div>
      </section>

      {/* The DIRTEA Story Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-gray-900">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-white text-center mb-6 sm:mb-8">
          The DIRTEA story
        </h2>
        <p className="text-base sm:text-lg text-white text-center mb-6 sm:mb-8 max-w-3xl mx-auto">
          In 2016, we discovered the power of functional mushrooms and experienced a transformation in our energy, focus, and resilience.
        </p>
        
        {/* Carousel Container */}
        <div className="relative max-w-7xl mx-auto">
          <div className="flex gap-4 sm:gap-6 overflow-x-auto scroll-smooth scrollbar-hide snap-x snap-mandatory px-1" id="carousel">
            {[
              { src: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", alt: "Matcha ritual", text: "Three friends, one plan: upgrade your caffeine ritual without the crashy chaos." },
              { src: "https://images.unsplash.com/photo-1544787219-7f47181a629a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", alt: "Japan matcha heritage", text: "Inspired by Japan's matcha heritage - delivered with NR personality." },
              { src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", alt: "Kagoshima landscape", text: "We went to the source (Kagoshima) to understand what separates real matcha from green imposters." },
              { src: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", alt: "Matcha leaves", text: "We chose single-origin, shade-grown, stone-milled matcha because quality is… kind of the point." },
              { src: "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=800&h=800&fit=crop", alt: "Matcha preparation methods", text: "Designed to work everywhere: whisked, shaken, iced, latte'd, and café-served." },
              { src: "https://images.unsplash.com/photo-1582793988951-9aed5509eb97?w=800&h=800&fit=crop", alt: "Pure matcha leaf", text: "Pure leaf. Loud standards." },
              { src: "https://images.unsplash.com/photo-1563822249366-707a0051d2f7?w=800&h=800&fit=crop", alt: "Nastea Rituals", text: "Nastea Rituals was born." },
            ].map((slide, i) => (
              <div key={i} className="flex-shrink-0 w-[280px] sm:w-[340px] lg:w-[400px] snap-start">
                <div className="relative h-[380px] sm:h-[440px] lg:h-[500px] overflow-hidden rounded-lg group cursor-pointer">
                  <img
                    src={slide.src}
                    alt={slide.alt}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                    <p className="text-white text-base sm:text-lg leading-relaxed">
                      {slide.text}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Carousel Navigation Button */}
          <button
            onClick={() => {
              const carousel = document.getElementById('carousel');
              if (carousel) {
                carousel.scrollBy({ left: 320, behavior: 'smooth' });
              }
            }}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 sm:p-4 rounded-full transition-colors z-10"
            aria-label="Next slide"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 bg-white">
        <div className="max-w-[760px] mx-auto text-center">
          <div className="text-5xl sm:text-6xl lg:text-7xl text-gray-900 leading-none mb-4">"</div>
          <blockquote className="text-base sm:text-lg lg:text-[22px] font-medium text-gray-900 leading-[1.6] mb-6">
            "We started Nastea Rituals because we were tired of matcha that looked premium but drank mid. So we went back to the source in Japan, obsessed over quality, and built a matcha ritual that's smooth, vibrant, and consistent enough for real daily life. NR is wellness with a personality - clean caffeine, zero boring, and a little main-character energy in every cup. Welcome to your new green flag."
          </blockquote>
          <p className="text-sm sm:text-base text-gray-700">
            Founders, Nastea Rituals
          </p>
        </div>
      </section>

      {/* Story Process Sections */}
      <section className="bg-white py-12 sm:py-16 lg:py-20">
        <div className="w-full px-0">
          <div className="space-y-6 sm:space-y-8 md:space-y-10">
            {storySections.map((section) => {
              const imageOrder = section.reverse ? 'order-2' : 'order-1';
              const textOrder = section.reverse ? 'order-1' : 'order-2';

              return (
                <article key={section.title} className="grid grid-cols-2 items-stretch gap-0">
                  <div className={imageOrder}>
                    <img
                      src={section.image}
                      alt={section.alt}
                      className="h-full min-h-[240px] w-full object-cover sm:min-h-[320px] md:min-h-[420px] lg:min-h-[520px]"
                    />
                  </div>

                  <div className={`flex items-center ${textOrder}`}>
                    <div className="w-full px-4 py-6 sm:px-8 sm:py-8 md:px-10 md:py-10 lg:px-12">
                    <h2 className="text-sm font-semibold leading-snug text-black sm:text-xl md:text-[2rem] md:leading-tight">
                      {section.title}
                    </h2>
                    <div className="mt-3 space-y-2 text-[10px] leading-[1.5] text-black/80 sm:mt-4 sm:text-sm sm:leading-7 md:text-xl md:leading-10">
                      {section.body.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <NasteaStandard />

      <Footer key={Date.now()} />
    </div>
  );
};

export default OurStory;
