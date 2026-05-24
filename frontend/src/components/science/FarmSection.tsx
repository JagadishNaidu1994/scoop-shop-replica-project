
import React from 'react';

const FarmSection = () => {
  return (
    <section className="py-20 bg-white w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-bold text-black">Our matcha farms</h2>
            </div>

            <div className="space-y-4">
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

          {/* Right Image */}
          <div className="relative">
            <img
              src="/lovable-uploads/Uji_Farm.webp"
              alt="Tea plantation in Kagoshima mountains"
              className="w-full h-[800px] rounded-lg object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FarmSection;
