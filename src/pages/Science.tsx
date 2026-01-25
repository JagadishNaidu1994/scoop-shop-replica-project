
import React from 'react';
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
  return (
    <div className="min-h-screen bg-white">
      <HeaderNavBar />
      <ScienceHeroBanner />
      <ImageTextSplitSection />
      <WhyNasteaSection />
      <ScienceOfficerSection />
      <IngredientsPreviewSection />
      <DictionaryCarousel />
      <FarmSection />
      <ScienceStepsGrid />
      <Footer />
    </div>
  );
};

export default Science;
