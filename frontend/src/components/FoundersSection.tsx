import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import AdminImageUpload from './AdminImageUpload';

const FoundersSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-white w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          {/* Left - Image */}
          <div className="relative">
            <AdminImageUpload
              src="/lovable-uploads/da6fe5b0-6a57-4ada-a9b8-042646881f03.png"
              alt="Founders with matcha"
              className="w-full h-auto rounded-lg"
              imagePath="founders-section"
            />
          </div>

          {/* Right - Content */}
          <div className="space-y-8 bg-gray-50 p-8 lg:p-12 rounded-lg">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold text-black mb-6 leading-tight">
                Founded by three friends who refused to settle for mid.
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                We tried the green powders, we tried the "ceremonial" that wasn't, and we tried pretending it didn't matter. It did. So we built NR around one rule: if it's not smooth, vibrant, and consistent, it's not coming home with us.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-black">Mission</h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                To deliver premium, organic matcha that energises, empowers, and elevates the everyday lives of a new generation. Through bold flavors, cheeky vibes, we're here to make wellness a ritual that's as fun as it is healthy.
              </p>
            </div>

            <Button
              onClick={() => navigate('/our-story')}
              className="bg-black text-white hover:bg-gray-800 font-bold text-base px-8 py-6 rounded-full transition-all duration-300"
            >
              OUR STORY
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FoundersSection;