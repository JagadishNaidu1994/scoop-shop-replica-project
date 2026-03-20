import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const howToSteps = [
  {
    thumbnail: '/lovable-uploads/8edc40eb-3dfa-45fb-8cac-fc1a12ec6a3c.png',
    image: '/lovable-uploads/8edc40eb-3dfa-45fb-8cac-fc1a12ec6a3c.png',
    title: 'Add 2g of NASTEA powder to a cup',
  },
  {
    thumbnail: '/lovable-uploads/65581248-fb35-4b2f-8b55-04877e634119.png',
    image: '/lovable-uploads/65581248-fb35-4b2f-8b55-04877e634119.png',
    title: 'Pour hot water and stir well',
  },
  {
    thumbnail: '/lovable-uploads/e3cb3dde-3127-4252-8b46-ab17c78f4ad8.png',
    image: '/lovable-uploads/e3cb3dde-3127-4252-8b46-ab17c78f4ad8.png',
    title: 'Whisk until fully dissolved',
  },
  {
    thumbnail: '/lovable-uploads/45a06faf-330b-4d76-a34b-4c50248900a2.png',
    image: '/lovable-uploads/45a06faf-330b-4d76-a34b-4c50248900a2.png',
    title: 'Enjoy your perfect NASTEA drink',
  },
];

const HowToSection: React.FC = () => {
  const [selected, setSelected] = useState(0);

  const prev = () => setSelected((s) => (s - 1 + howToSteps.length) % howToSteps.length);
  const next = () => setSelected((s) => (s + 1) % howToSteps.length);

  return (
    <section className="w-full py-16">
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-0">
        {/* Left side */}
        <div className="flex flex-col" style={{ backgroundColor: '#F5F5F0' }}>
          {/* 4 Thumbnails row */}
          <div className="flex gap-3 p-6 pb-0">
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
                className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight"
                style={{ color: '#0D1B2A' }}
              >
                {howToSteps[selected].title}
              </h3>
            </div>
          </div>
        </div>

        {/* Right side - large image */}
        <div className="relative" style={{ backgroundColor: '#F5F5F0' }}>
          <img
            src={howToSteps[selected].image}
            alt={howToSteps[selected].title}
            className="w-full h-full object-cover transition-all duration-300"
            style={{ minHeight: '300px' }}
          />
          {/* Navigation */}
          <div className="absolute bottom-6 right-6 flex items-center gap-3">
            <button
              onClick={prev}
              className="w-8 h-8 flex items-center justify-center rounded-full border transition-colors hover:bg-white/80"
              style={{ borderColor: '#0D1B2A', color: '#0D1B2A' }}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-medium" style={{ color: '#0D1B2A' }}>
              {selected + 1}/{howToSteps.length}
            </span>
            <button
              onClick={next}
              className="w-8 h-8 flex items-center justify-center rounded-full border transition-colors hover:bg-white/80"
              style={{ borderColor: '#0D1B2A', color: '#0D1B2A' }}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowToSection;
