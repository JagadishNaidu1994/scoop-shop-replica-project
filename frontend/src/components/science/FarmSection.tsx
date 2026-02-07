
import React from 'react';

const FarmSection = () => {
  return (
    <section className="py-20 w-full">
      <div className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
          {/* Left Image */}
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=800&h=600&fit=crop"
              alt="Tea plantation in Kagoshima mountains"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right Content */}
          <div className="bg-white flex items-center">
            <div className="px-8 lg:px-16 py-12 space-y-6">
              <h2 className="text-4xl font-bold text-black leading-tight">
                Our matcha farms
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Our story starts in the mountains of Kagoshima, Japan—where the air is cooler, the pace is slower, and matcha is treated like the main character.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                This is single-origin matcha, grown under shade to coax out that signature smoothness and umami, then hand-picked with the kind of care you can taste.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Once the leaves are ready, they're gently dried, then stone-ground into the fine, vivid green powder that makes your cup look vibrant and feel ridiculously premium. It's a craft with a long history, delivered with a little more personality (because you deserve a ritual, not a lecture).
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FarmSection;
