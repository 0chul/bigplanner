import { Helmet } from 'react-helmet-async';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Philosophy from '../components/Philosophy';
import CoreValues from '../components/CoreValues';
import Projects from '../components/Projects';
import ContactCTA from '../components/ContactCTA';
import Footer from '../components/Footer';
import { useLanguage } from '../contexts/LanguageContext';

export default function Home() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <Helmet>
        <title>{language === 'ko' ? '홈 | 빅플래너파트너스' : 'Home | BIGPLANNER PARTNERS'}</title>
        <meta name="description" content={language === 'ko' ? "부동산과 공간 가치를 높이는 프롭테크 기업, 빅플래너파트너스입니다." : "BIGPLANNER PARTNERS, a proptech company that enhances real estate and space value."} />
        <meta name="keywords" content={language === 'ko' ? "빅플래너파트너스, 프롭테크, 부동산, 공간 가치" : "BIGPLANNER PARTNERS, Proptech, Real Estate, Space Value"} />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ais-dev-nhshxvw3fmlb4tdm2md6nw-12693135445.asia-northeast1.run.app/" />
        <meta property="og:title" content={language === 'ko' ? '홈 | 빅플래너파트너스' : 'Home | BIGPLANNER PARTNERS'} />
        <meta property="og:description" content={language === 'ko' ? "부동산과 공간 가치를 높이는 프롭테크 기업, 빅플래너파트너스입니다." : "BIGPLANNER PARTNERS, a proptech company that enhances real estate and space value."} />
        <meta property="og:image" content="https://injrbniytgtubemniaps.supabase.co/storage/v1/object/public/bigplanner/logo.png" />

        <script type="application/ld+json">
          {`
            [
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "${language === 'ko' ? '빅플래너파트너스' : 'BIGPLANNER PARTNERS'}",
                "url": "https://ais-dev-nhshxvw3fmlb4tdm2md6nw-12693135445.asia-northeast1.run.app",
                "logo": "https://injrbniytgtubemniaps.supabase.co/storage/v1/object/public/bigplanner/logo.png",
                "description": "${language === 'ko' ? '부동산과 공간 가치를 높이는 프롭테크 기업, 빅플래너파트너스입니다.' : 'BIGPLANNER PARTNERS, a proptech company that enhances real estate and space value.'}"
              },
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": "${language === 'ko' ? '빅플래너파트너스' : 'BIGPLANNER PARTNERS'}",
                "url": "https://ais-dev-nhshxvw3fmlb4tdm2md6nw-12693135445.asia-northeast1.run.app"
              }
            ]
          `}
        </script>
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
