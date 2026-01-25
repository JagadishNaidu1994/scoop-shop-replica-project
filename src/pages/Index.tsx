import React from 'react';
import HeaderNavBar from '@/components/HeaderNavBar';
import HeroSection from '@/components/HeroSection';
import SubHeroBanner from '@/components/SubHeroBanner';
import ProductShowcaseGrid from '@/components/ProductShowcaseGrid';
import ResultsStats from '@/components/ResultsStats';
import NasteaStandard from '@/components/NasteaStandard';
// import PressFeatures from '@/components/PressFeatures';
import TestimonialsCarousel from '@/components/TestimonialsCarousel';
import JournalSection from '@/components/JournalSection';
import FoundersSection from '@/components/FoundersSection';
import Footer from '@/components/Footer';
import EmailSignupPopup from '@/components/EmailSignupPopup';
import AdminEditableText from '@/components/admin/AdminEditableText';
import AdminEditableImage from '@/components/admin/AdminEditableImage';
import { useEmailPopup } from '@/hooks/useEmailPopup';
const Index = () => {
  const {
    showPopup,
    closePopup
  } = useEmailPopup();
  return <div className="min-h-screen w-full">
      <HeaderNavBar />
      <main className="w-full">
        {/* Example of editable content - you can add these to any section */}
        <div className="bg-gray-50 text-center flex flex-col items-center py-0">
          <AdminEditableText pageId="homepage" contentKey="welcome-title" defaultValue="Welcome to NASTEA" element="h2" className="text-3xl font-bold text-black mb-4" />
          <AdminEditableText pageId="homepage" contentKey="welcome-description" defaultValue="Discover the power of functional mushrooms and adaptogens" element="p" className="text-lg text-gray-600 max-w-2xl mx-auto" multiline />
        </div>
        
        <HeroSection />
        <SubHeroBanner />
        <ProductShowcaseGrid />
        <ResultsStats />
        <NasteaStandard />
        {/* <PressFeatures /> */}
        <TestimonialsCarousel />
        <JournalSection />
        <FoundersSection />
      </main>
      <Footer />
      
      {showPopup && <EmailSignupPopup onClose={() => closePopup(true)} />}
    </div>;
};
export default Index;