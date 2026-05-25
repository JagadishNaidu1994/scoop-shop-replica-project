import React from 'react';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import HeaderNavBar from '@/components/HeaderNavBar';
import Footer from '@/components/Footer';
import ScienceHeroBanner from '@/components/science/ScienceHeroBanner';
import ImageTextSplitSection from '@/components/science/ImageTextSplitSection';
import WhyNasteaSection from '@/components/science/WhyNasteaSection';
import ScienceOfficerSection from '@/components/science/ScienceOfficerSection';
import IngredientsPreviewSection from '@/components/science/IngredientsPreviewSection';
import DictionaryCarousel from '@/components/science/DictionaryCarousel';
import FarmSection from '@/components/science/FarmSection';
import ScienceStepsGrid from '@/components/science/ScienceStepsGrid';

const Science = () => {
  useScrollToTop();
  return (
    <div className="min-h-screen bg-white">
      <HeaderNavBar />
      <ScienceHeroBanner />
      <ImageTextSplitSection />
      <WhyNasteaSection />
      <IngredientsPreviewSection />
      <DictionaryCarousel />
      <FarmSection />
      <ScienceStepsGrid />

      {/* Shop our range button */}
      <div className="flex justify-center my-12">
        <a href="/shop">
          <button style={{ backgroundColor: 'rgba(101, 36, 131, 1)' }} className="text-white px-8 py-3 rounded-full text-lg font-semibold hover:opacity-90 transition-opacity">
            Shop our range
          </button>
        </a>
      </div>

      <Footer />
    </div>
  );
};

export default Science;
