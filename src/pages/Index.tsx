
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WellnessBanner from '@/components/WellnessBanner';
import ProductShowcase from '@/components/ProductShowcase';
import SuperNaturalSection from '@/components/SuperNaturalSection';
import BrandLogoSection from '@/components/BrandLogoSection';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <WellnessBanner />
        <ProductShowcase />
        <SuperNaturalSection />
        <BrandLogoSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
