
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
                It takes science to be DIRTEA. Pure. Potent. Proven.
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                We're on a mission to make the world's most potent functional mushroom supplements. 
                Every step of our process is backed by rigorous scientific research and testing. 
                From sourcing the finest organic mushrooms to our proprietary extraction methods, 
                we ensure maximum bioavailability and efficacy in every product.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Our commitment to transparency means every batch is third-party tested, 
                fully traceable, and clinically studied. Because when it comes to your health, 
                nothing less than the best will do.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImageTextSplitSection;
