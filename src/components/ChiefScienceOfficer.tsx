
import React from 'react';

const ChiefScienceOfficer = () => {
  return (
    <section className="py-20 bg-gray-900 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-white">Our Chief Science Officer</h2>
            
            <blockquote className="text-xl text-white leading-relaxed">
              "We source the highest quality ingredients, where nature and performance collide. I have brought the same principles I've devoted to human health to DIRTEA, with an uncompromising commitment to quality and transparency."
            </blockquote>
            
            <div className="text-white">
              <p className="font-semibold">Dr. Sarah Johnson</p>
              <p className="text-gray-300">Chief Science Officer</p>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1594824609522-e670dcf61e6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
              alt="Chief Science Officer"
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChiefScienceOfficer;
