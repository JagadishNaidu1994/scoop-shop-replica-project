
import React from 'react';
import AdminImageUpload from './AdminImageUpload';

const FoundersSection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <AdminImageUpload
              src="/lovable-uploads/a61d3c6a-fc59-45fe-9266-350a3c40ae91.png"
              alt="Founders of DIRTEA"
              className="w-full h-96 object-cover rounded-2xl shadow-xl"
              imagePath="founders-image"
            />
          </div>
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-gray-900">Meet the Founders</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Founded by health enthusiasts who discovered the incredible benefits of functional mushrooms, 
              DIRTEA was born from a passion to make ancient wellness accessible to modern life.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Our journey began with a simple mission: to create the highest quality mushroom-infused 
              products that support your daily wellness routine without compromising on taste or effectiveness.
            </p>
            <div className="flex space-x-4">
              <div className="text-center">
                <AdminImageUpload
                  src="/lovable-uploads/26d45a3e-0bd4-4883-89d1-b11b087ead71.png"
                  alt="Co-founder 1"
                  className="w-16 h-16 rounded-full mx-auto mb-2 object-cover"
                  imagePath="founder-1"
                />
                <p className="text-sm font-medium text-gray-900">Sarah Chen</p>
                <p className="text-xs text-gray-600">Co-founder</p>
              </div>
              <div className="text-center">
                <AdminImageUpload
                  src="/lovable-uploads/4d9c0a46-fb6f-49ac-b221-299e60a15fa5.png"
                  alt="Co-founder 2"
                  className="w-16 h-16 rounded-full mx-auto mb-2 object-cover"
                  imagePath="founder-2"
                />
                <p className="text-sm font-medium text-gray-900">Marcus Johnson</p>
                <p className="text-xs text-gray-600">Co-founder</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FoundersSection;
