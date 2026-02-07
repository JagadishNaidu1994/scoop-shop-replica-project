
import React from 'react';
import AdminImageUpload from './AdminImageUpload';

const NasteaStandard = () => {
  return (
    <section className="py-20 bg-gray-50 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <h2 className="text-4xl font-bold text-black">The NASTEA Standard</h2>

            <div className="space-y-6">
              <div className="border-l-4 border-orange-400 pl-6">
                <h3 className="text-xl font-semibold text-black mb-2">Japan-Grown, Shade-Grown</h3>
                <p className="text-gray-600">We source Kagoshima Japanese matcha that's shade-grown for the signature umami and smoothness for your daily routine.</p>
              </div>

              <div className="border-l-4 border-orange-400 pl-6">
                <h3 className="text-xl font-semibold text-black mb-2">Stone-Milled for Silk-Smooth Sips</h3>
                <p className="text-gray-600">Our leaves are stone-milled into a fine, fluffy powder that blends clean, whisks fast, and drinks like velvet—no grit, no swampy bitterness.</p>
              </div>

              <div className="border-l-4 border-orange-400 pl-6">
                <h3 className="text-xl font-semibold text-black mb-2">Grades That Match Your Mood</h3>
                <p className="text-gray-600">From Ceremonial for your main-character mornings to Premium for daily lattes and café menus, our lineup is built for consistency in taste, texture, and that neon-clean colour everyone notices.</p>
              </div>

              <div className="border-l-4 border-orange-400 pl-6">
                <h3 className="text-xl font-semibold text-black mb-2">Consistency You Can Count On</h3>
                <p className="text-gray-600">Every batch is selected to hit the same flavour-and-colour standard—so your cup (and your café drinks) look iconic, taste smooth, and never surprise you in a bad way.</p>
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

export default NasteaStandard;
