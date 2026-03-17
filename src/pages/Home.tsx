import { Helmet } from 'react-helmet-async';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Philosophy from '../components/Philosophy';
import CoreValues from '../components/CoreValues';
import Projects from '../components/Projects';
import ContactCTA from '../components/ContactCTA';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <Helmet>
        <title>홈 | 빅플래너파트너스</title>
        <meta name="description" content="부동산과 공간 가치를 높이는 프롭테크 기업, 빅플래너파트너스입니다." />
        <meta name="keywords" content="빅플래너파트너스, 프롭테크, 부동산, 공간 가치" />
      </Helmet>
      <Navbar />
      <main>
        <Hero />
        <Philosophy />
        <CoreValues />
        <Projects />
        <ContactCTA />
      </main>
      <Footer />
    </div>
  );
}
