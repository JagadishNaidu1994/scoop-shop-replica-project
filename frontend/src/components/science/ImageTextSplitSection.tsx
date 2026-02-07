
import React from 'react';

const ImageTextSplitSection = () => {
  return (
    <section className="py-20 w-full">
      <div className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
          {/* Left Image */}
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&h=600&fit=crop" 
              alt="Forest canopy"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right Content */}
          <div className="bg-white flex items-center">
            <div className="px-8 lg:px-16 py-12 space-y-6">
              <h2 className="text-4xl font-bold text-black leading-tight">
                It takes obsession to be Nastea: Pure, Premium, No Boring.
              </h2>
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
