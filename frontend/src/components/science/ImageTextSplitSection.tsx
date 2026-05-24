
import React from 'react';

const ImageTextSplitSection = () => {
  return (
    <section className="py-20 bg-white w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Image */}
          <div className="relative">
            <img
              src="/lovable-uploads/NDN00776-Edit.jpg"
              alt="Forest canopy"
              className="w-full h-[800px] rounded-lg object-cover"
            />
          </div>

          {/* Right Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-bold text-black">
                It takes obsession to be Nastea: Pure, Premium, No Boring.
              </h2>
            </div>
            <div className="space-y-4">
              <p className="text-lg text-gray-600 leading-relaxed">
                From origin selection to milling and grading, we dial in matcha that looks iconic and tastes clean -no swampy bitterness, no dull colour, no surprises. Because your daily ritual shouldn’t depend on luck. It should hit the same every time.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Japan-grown matcha, crafted with traditional methods and chosen for modern rituals - smooth, balanced, and umami rich. Every scoop is made to perform whether you whisk it straight, pour it over ice, or put it on a café menu.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImageTextSplitSection;
