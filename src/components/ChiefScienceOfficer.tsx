
import React from 'react';

const ChiefScienceOfficer = () => {
  return (
    <section className="py-20 bg-gray-50 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-black leading-tight">
              Meet Our Chief Science Officer
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Dr. Sarah Chen leads our research team with over 15 years of experience in functional medicine and nutritional science. Her expertise ensures that every DIRTEA product is backed by rigorous scientific research.
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-black rounded-full"></div>
                <span className="text-gray-700">PhD in Nutritional Science from Harvard</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-black rounded-full"></div>
                <span className="text-gray-700">15+ years in functional medicine research</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-black rounded-full"></div>
                <span className="text-gray-700">Published researcher in peer-reviewed journals</span>
              </div>
            </div>
            <button className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors">
              Learn More About Our Science
            </button>
          </div>
          
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&h=600&fit=crop&crop=face"
              alt="Dr. Sarah Chen - Chief Science Officer"
              className="rounded-2xl shadow-2xl w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChiefScienceOfficer;
