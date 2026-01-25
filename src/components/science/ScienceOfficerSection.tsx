
import React from 'react';

const ScienceOfficerSection = () => {
  return (
    <section className="py-20 bg-gray-50 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <h2 className="text-4xl font-bold text-black">Meet our Chief Science Officer</h2>
            
            <blockquote className="text-xl text-gray-700 leading-relaxed italic">
              "We source the highest quality ingredients, where nature and performance collide. 
              I have brought the same principles I've devoted to human health to DIRTEA, 
              with an uncompromising commitment to quality and transparency."
            </blockquote>
            
            <div className="space-y-2">
              <p className="text-lg font-semibold text-black">Dr. Tara Swart</p>
              <p className="text-gray-600">Chief Science Officer</p>
              <p className="text-sm text-gray-500">
                Neuroscientist, Medical Doctor, Executive Coach
              </p>
            </div>

            <button className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors">
              Meet our Chief Science Officer
            </button>
          </div>

          {/* Right Image */}
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1594824609522-e670dcf61e6c?w=600&h=600&fit=crop" 
              alt="Dr. Tara Swart"
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScienceOfficerSection;
