import React from 'react';
import AdminImageUpload from '@/components/AdminImageUpload';

const WholesaleTeam = () => {
  return (
    <section className="py-16 bg-amber-50" id="expert-team">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Expert Team</h2>
          <p className="text-gray-700 text-lg">Behind-the-beans professionals dedicated to your success</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <p className="text-gray-700 text-lg leading-relaxed">
              Our experienced team of coffee professionals is dedicated to helping your business succeed. From sourcing to service, we're here to support you every step of the way.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="text-center">
                <AdminImageUpload
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
                  alt="Sarah Johnson - Head of Wholesale"
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover shadow-lg"
                  imagePath="wholesale-team-sarah"
                />
                <h4 className="font-bold text-gray-900 text-lg">Sarah Johnson</h4>
                <p className="text-amber-600 font-medium">Head of Wholesale</p>
                <p className="text-gray-600 text-sm mt-2">15+ years in coffee industry</p>
              </div>
              <div className="text-center">
                <AdminImageUpload
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
                  alt="Mike Chen - Training Manager"
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover shadow-lg"
                  imagePath="wholesale-team-mike"
                />
                <h4 className="font-bold text-gray-900 text-lg">Mike Chen</h4>
                <p className="text-amber-600 font-medium">Training Manager</p>
                <p className="text-gray-600 text-sm mt-2">Certified barista trainer</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <AdminImageUpload
              src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=600&h=500&fit=crop"
              alt="Coffee roasting facility"
              className="rounded-2xl shadow-2xl w-full"
              imagePath="wholesale-team-facility"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default WholesaleTeam;