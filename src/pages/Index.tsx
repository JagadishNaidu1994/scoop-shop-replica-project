
import React from 'react';
import HeaderNavBar from '@/components/HeaderNavBar';
import HeroSection from '@/components/HeroSection';
import SubHeroBanner from '@/components/SubHeroBanner';
import ProductShowcaseGrid from '@/components/ProductShowcaseGrid';
import ShopByBenefit from '@/components/ShopByBenefit';
import ResultsStats from '@/components/ResultsStats';
import DirteaStandard from '@/components/DirteaStandard';
import ChiefScienceOfficer from '@/components/ChiefScienceOfficer';
import PressFeatures from '@/components/PressFeatures';
import TestimonialsCarousel from '@/components/TestimonialsCarousel';
import JournalSection from '@/components/JournalSection';
import FoundersSection from '@/components/FoundersSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeaderNavBar />
      <main>
        <HeroSection />
        <SubHeroBanner />
        <ProductShowcaseGrid />
        <ShopByBenefit />
        <ResultsStats />
        <DirteaStandard />
        <ChiefScienceOfficer />
        <PressFeatures />
        <TestimonialsCarousel />
        <JournalSection />
        <FoundersSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
