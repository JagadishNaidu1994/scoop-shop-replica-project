
import React from 'react';
import AdminImageUpload from './AdminImageUpload';

const DirteaStandard = () => {
  return (
    <section className="py-20 bg-gray-50 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <h2 className="text-4xl font-bold text-black">The NASTEA Standard</h2>
            
            <div className="space-y-6">
              <div className="border-l-4 border-orange-400 pl-6">
                <h3 className="text-xl font-semibold text-black mb-2">Third-party tested</h3>
                <p className="text-gray-600">Every batch is independently tested for purity, potency, and safety.</p>
              </div>
              
              <div className="border-l-4 border-orange-400 pl-6">
                <h3 className="text-xl font-semibold text-black mb-2">Organic certified</h3>
                <p className="text-gray-600">Sourced from certified organic farms with sustainable practices.</p>
              </div>
              
              <div className="border-l-4 border-orange-400 pl-6">
                <h3 className="text-xl font-semibold text-black mb-2">Extract ratios</h3>
                <p className="text-gray-600">High-potency extracts with standardized active compounds.</p>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <AdminImageUpload
              src="/lovable-uploads/da6fe5b0-6a57-4ada-a9b8-042646881f03.png"
              alt="Hands holding mushroom coffee cup"
              className="w-full h-auto rounded-lg"
              imagePath="nastea-standard-hands"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DirteaStandard;
