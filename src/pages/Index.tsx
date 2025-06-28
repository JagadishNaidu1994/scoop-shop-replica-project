
import React from 'react';
import HeaderNavBar from '@/components/HeaderNavBar';
import HeroSection from '@/components/HeroSection';
import SubHeroBanner from '@/components/SubHeroBanner';
import ProductShowcaseGrid from '@/components/ProductShowcaseGrid';
import ResultsStats from '@/components/ResultsStats';
import DirteaStandard from '@/components/DirteaStandard';
import PressFeatures from '@/components/PressFeatures';
import TestimonialsCarousel from '@/components/TestimonialsCarousel';
import JournalSection from '@/components/JournalSection';
import FoundersSection from '@/components/FoundersSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen w-full">
      <HeaderNavBar />
      <main className="w-full">
        <HeroSection />
        <SubHeroBanner />
        <ProductShowcaseGrid />
        <ResultsStats />
        <DirteaStandard />
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
