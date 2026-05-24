import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const howToSteps = [
  {
    thumbnail: '/lovable-uploads/matcha-whisk.png',
    image: '/lovable-uploads/matcha-whisk.png',
    title: 'Add 2g of NASTEA powder to a cup',
  },
  {
    thumbnail: '/lovable-uploads/matcha-whisk.png',
    image: '/lovable-uploads/matcha-whisk.png',
    title: 'Pour hot water and stir well',
  },
  {
    thumbnail: '/lovable-uploads/matcha-whisk.png',
    image: '/lovable-uploads/matcha-whisk.png',
    title: 'Whisk until fully dissolved',
  },
  {
    thumbnail: '/lovable-uploads/matcha-whisk.png',
    image: '/lovable-uploads/matcha-whisk.png',
    title: 'Enjoy your perfect NASTEA drink',
  },
];

const HowToSection: React.FC = () => {
  const [selected, setSelected] = useState(0);

  const prev = () => setSelected((s) => (s - 1 + howToSteps.length) % howToSteps.length);
  const next = () => setSelected((s) => (s + 1) % howToSteps.length);

  return (
    <section className="py-20 bg-white w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left side */}
        <div className="flex flex-col h-[700px] rounded-lg" style={{ backgroundColor: '#F5F5F0' }}>
          {/* 4 Thumbnails row */}
          <div className="hidden flex gap-3 p-6 pb-0">
            {howToSteps.map((step, i) => (
              <button
                key={i}
                onClick={() => setSelected(i)}
                className={`w-[calc(25%-9px)] aspect-square overflow-hidden transition-all duration-200 ${
                  selected === i
                    ? 'ring-2 ring-offset-2'
                    : 'opacity-70 hover:opacity-100'
                }`}
                style={{
                  ringColor: '#0D1B2A',
                }}
              >
                <img
                  src={step.thumbnail}
                  alt={`Step ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>

          {/* Text content pinned to bottom */}
          <div className="flex-1 flex flex-col justify-end p-6 pt-0">
            <div className="mt-auto">
              <p
                className="text-sm font-semibold tracking-wide mb-3"
                style={{ color: '#0D1B2A' }}
              >
                How to NASTEA
              </p>
              <h3
                className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight mb-6"
                style={{ color: '#0D1B2A' }}
              >
                {howToSteps[selected].title}
              </h3>
              {/* Navigation - moved to text side */}
              <div className="flex items-center gap-3">
                <button
                  onClick={prev}
                  className="w-9 h-9 flex items-center justify-center rounded-full text-white transition-colors hover:opacity-80"
                  style={{ backgroundColor: '#0D1B2A' }}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm font-medium" style={{ color: '#0D1B2A' }}>
                  {selected + 1}/{howToSteps.length}
                </span>
                <button
                  onClick={next}
                  className="w-9 h-9 flex items-center justify-center rounded-full text-white transition-colors hover:opacity-80"
                  style={{ backgroundColor: '#0D1B2A' }}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - large image */}
        <div className="relative h-[700px]" style={{ backgroundColor: '#F5F5F0' }}>
          <img
            src={howToSteps[selected].image}
            alt={howToSteps[selected].title}
            className="w-full h-full rounded-lg transition-all duration-300 object-cover mx-0 px-0"
          />
        </div>
        </div>
      </div>
    </section>
  );
};

export default HowToSection;
