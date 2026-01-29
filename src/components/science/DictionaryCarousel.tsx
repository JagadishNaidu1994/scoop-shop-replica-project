
import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DictionaryCarousel = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const dictionaryTerms = [
    {
      name: "Caffeine",
      image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop",
      description: "Known as the 'Get-Up-and-Go Molecule,' caffeine has powered early mornings and late-night ideas for generations. In matcha, it shows up with a cleaner, steadier vibe—perfect for workouts, deep work, or your 'don't talk to me yet' commute.",
      tag: "Energy"
    },
    {
      name: "L-theanine",
      image: "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400&h=400&fit=crop",
      description: "Known as the 'Calm Focus Amino,' L-theanine is tea's not-so-secret weapon, long loved in Japanese tea culture for its smooth, settling feel. Paired with caffeine, it's the reason matcha energy can feel more composed than chaotic.",
      tag: "Focus"
    },
    {
      name: "Catechins",
      image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=400&fit=crop",
      description: "Known as matcha's 'Bitter-Sweet Polyphenols,' catechins are the plant compounds that give that crisp, slightly astringent edge—aka the taste cue that your matcha is the real deal. They're part of why matcha has been respected for centuries as more than just a pretty green drink.",
      tag: "Antioxidant"
    },
    {
      name: "EGCG",
      image: "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=400&h=400&fit=crop",
      description: "The concentration of the antioxidant EGCG (epigallocatechin gallate) in matcha is at least 137 times greater than in standard China Green Tips tea.",
      tag: "Superpower"
    },
    {
      name: "Matcha's ORAC",
      image: "https://images.unsplash.com/photo-1499639923778-42df574d09d7?w=400&h=400&fit=crop",
      description: "Oxygen Radical Absorbance Capacity rating is approximately 1,384 units per gram, dwarfing 'superfoods' like blueberries and goji berries.",
      tag: "Superfood"
    },
    {
      name: "Chlorophylls",
      image: "https://images.unsplash.com/photo-1536012893481-0c44dcbd1fc7?w=400&h=400&fit=crop",
      description: "Known as the 'Green Glow Pigments,' chlorophylls are what give great matcha that vivid, vibrant colour. Shade-growing helps the leaf build more of them—so the brighter the green, the louder the flex (quietly).",
      tag: "Vibrant"
    },
    {
      name: "Ichibancha",
      image: "https://images.unsplash.com/photo-1545047919-17d72cd007c7?w=400&h=400&fit=crop",
      description: "The word Ichibancha literally translates to 'First Tea.' In Japan, it refers to the very first harvest of the year, typically occurring between late April and mid-May. After a long winter of dormancy, the tea bushes 'wake up' and send all their stored energy into the first new buds of spring.",
      tag: "First Harvest"
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
    <section className="py-20 bg-gray-50 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-4xl font-bold text-black">NASTEA Dictionary</h2>
          <div className="flex gap-2">
            <button
              onClick={() => scroll('left')}
              className="p-3 rounded-full bg-white hover:bg-gray-100 shadow-md transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-6 h-6 text-black" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-3 rounded-full bg-white hover:bg-gray-100 shadow-md transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-6 h-6 text-black" />
            </button>
          </div>
        </div>

        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {dictionaryTerms.map((term, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-[320px] bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow snap-start"
            >
              <img
                src={term.image}
                alt={term.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <div className="space-y-3">
                <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                  {term.tag}
                </span>
                <h3 className="text-xl font-bold text-black">{term.name}</h3>
                <p className="text-gray-600 text-sm">{term.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DictionaryCarousel;
