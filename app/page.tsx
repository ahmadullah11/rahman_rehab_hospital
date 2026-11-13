import Hero from '@/components/Hero';
import Stats from '@/components/Stats';
import About from '@/components/About';
import Programs from '@/components/Programs';
import Journey from '@/components/Journey';
import GallerySection from '@/components/GallerySection';
import Branches from '@/components/Branches';
import Team from '@/components/Team';
import Stories from '@/components/Stories';
import Faq from '@/components/Faq';
import Contact from '@/components/Contact';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <About />
      <Programs />
      <Journey />
      <GallerySection />
      <Branches />
      <Team />
      <Stories />
      <Faq />
      <Contact />
    </>
  );
}
