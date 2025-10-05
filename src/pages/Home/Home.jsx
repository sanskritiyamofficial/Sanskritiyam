import React from 'react';
import HeroSection from './HeroSection';
import TempleSection from './TempleSection';
// import ChadhawaSection from './ChadhawaSection';
import ProcessSection from './ProcessSection';
import TrustedSection from './TrustedSection';
import WhatsAppSection from './WhatsAppSection';
import TestimonialsSection from './TestimonialsSection';
import { temples, chadhawas } from './Data/TempleData';

const Home = () => {
  return (
    <div className='pt-16 md:pt-20 px-4 sm:px-6 lg:px-8'>
      <HeroSection />
      <TempleSection title="Sacred Temples" data={temples} />
      <TempleSection title="Chadhawa" data={chadhawas} /> {/* ChdhawaSection */}
      <ProcessSection />
      <TrustedSection />
      <WhatsAppSection />
      <TestimonialsSection />
    </div>
  );
};

export default Home;
