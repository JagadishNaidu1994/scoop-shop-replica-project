
import React from 'react';
import HeaderNavBar from '@/components/HeaderNavBar';
import Footer from '@/components/Footer';
import WholesaleHero from '@/components/wholesale/WholesaleHero';
import WholesaleIntro from '@/components/wholesale/WholesaleIntro';
import WholesaleCoffeeExcellence from '@/components/wholesale/WholesaleCoffeeExcellence';
import WholesaleServices from '@/components/wholesale/WholesaleServices';
import WholesaleTeam from '@/components/wholesale/WholesaleTeam';
import WholesaleContact from '@/components/wholesale/WholesaleContact';

const Wholesale = () => {
  return (
    <div className="min-h-screen bg-white">
      <HeaderNavBar />
      <WholesaleHero />
      <WholesaleIntro />
      <WholesaleCoffeeExcellence />
      <WholesaleServices />
      <WholesaleTeam />
      <WholesaleContact />
      <Footer />
    </div>
  );
};

export default Wholesale;
