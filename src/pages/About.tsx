import { useEffect } from 'react';
import SEO from '../components/SEO';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { Target, Shield, Briefcase, CheckCircle2, Building2, Lightbulb, TrendingUp, ArrowRight, ArrowDown } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ContactCTA from '../components/ContactCTA';
import OrganizationChart from '../components/OrganizationChart';
import MissionDiagram from '../components/motion/MissionDiagram';
import ValuesFlowDiagram from '../components/motion/ValuesFlowDiagram';
import ThreePillarsDiagram from '../components/motion/ThreePillarsDiagram';
import { useLanguage } from '../contexts/LanguageContext';

export default function About() {
  const { language } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <SEO 
        title={language === 'ko' ? '회사소개 | 빅플래너파트너스' : 'About Us | BIGPLANNER PARTNERS'}
        description={language === 'ko' ? "부동산과 공간 가치를 높이는 프롭테크 기업, 빅플래너파트너스의 철학과 비전을 소개합니다." : "Introducing the philosophy and vision of BIGPLANNER PARTNERS, a proptech company that enhances real estate and space value."}
        url="https://bigplanner.co.kr/about"
        image="https://injrbniytgtubemniaps.supabase.co/storage/v1/object/public/bigplanner/logo.png"
      />
      <Helmet>
        <meta name="keywords" content="빅플래너파트너스, 회사소개, 프롭테크, 부동산개발, 공간가치, BIGPLANNER PARTNERS, About Us, Proptech, Real Estate Development, Space Value" />
        <link rel="canonical" href="https://bigplanner.co.kr/about" />
        <script type="application/ld+json">
          {`
            [
              {
                "@context": "https://schema.org",
                "@type": "AboutPage",
                "name": "${language === 'ko' ? '회사소개 | 빅플래너파트너스' : 'About Us | BIGPLANNER PARTNERS'}",
                "description": "${language === 'ko' ? '부동산과 공간 가치를 높이는 프롭테크 기업, 빅플래너파트너스의 철학과 비전을 소개합니다.' : 'Introducing the philosophy and vision of BIGPLANNER PARTNERS, a proptech company that enhances real estate and space value.'}",
                "url": "https://bigplanner.co.kr/about"
              },
              {
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": [
                  {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "${language === 'ko' ? '홈' : 'Home'}",
                    "item": "https://bigplanner.co.kr/"
                  },
                  {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "${language === 'ko' ? '회사소개' : 'About Us'}",
                    "item": "https://bigplanner.co.kr/about"
                  }
                ]
              }
            ]
          `}
        </script>
      </Helmet>
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop" 
            alt="Architecture Background" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-sm font-bold tracking-widest text-gray-400 uppercase mb-4">About Us</h1>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              {language === 'ko' ? (
                <>부동산과 공간 가치를 높이는<br />프롭테크 기업</>
              ) : (
                <>A Proptech Company Enhancing<br />Real Estate and Space Value</>
              )}
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl leading-relaxed">
              {language === 'ko' 
                ? "고객의 부동산과 공간가치를 높이기 위해 BIGPLANNER PARTNERS만의 투자분석과 PM시스템으로 중소형 신축 및 부동산 개발의 불확실함, 불편함, 불안함을 해소합니다."
                : "To enhance the value of our clients' real estate and space, BIGPLANNER PARTNERS resolves the uncertainty, inconvenience, and anxiety of small and medium-sized new construction and real estate development with our unique investment analysis and PM system."}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-sm font-bold tracking-widest text-gray-500 uppercase mb-4">Philosophy</h2>
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-6">
                {language === 'ko' ? (
                  <>부동산과 공간가치 창출을 위해<br />고객의 PAIN POINT를 해결합니다.</>
                ) : (
                  <>We solve clients' PAIN POINTS<br />to create real estate and space value.</>
                )}
              </h3>
              <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-8">
                {language === 'ko'
                  ? "고객의 부동산과 공간가치를 높이기 위해 BIGPLANNER PARTNERS만의 투자분석과 PM시스템으로 중소형 신축 및 부동산 개발의 불확실함, 불편함, 불안함을 해소합니다."
                  : "To enhance the value of our clients' real estate and space, BIGPLANNER PARTNERS resolves the uncertainty, inconvenience, and anxiety of small and medium-sized new construction and real estate development with our unique investment analysis and PM system."}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-w-4 aspect-h-5 sm:aspect-w-16 sm:aspect-h-9 lg:aspect-w-4 lg:aspect-h-5">
                <img 
                  src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1931&auto=format&fit=crop" 
                  alt="Architecture" 
                  className="object-cover rounded-2xl shadow-2xl grayscale"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-sm font-bold tracking-widest text-gray-500 uppercase mb-4">Vision</h2>
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">{language === 'ko' ? '우리의 비전과 가치' : 'Our Vision and Values'}</h3>
          </div>

          <div className="space-y-24 md:space-y-36">
            
            {/* 01. Our Mission - Dynamic Motion Graphic */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex flex-col items-center mb-8">
                <div className="w-16 h-16 bg-gray-900 text-white rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                  <Target size={32} />
                </div>
                <h4 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">01. Our Mission</h4>
                <p className="text-lg md:text-xl font-medium text-gray-600 text-center max-w-2xl">
                  {language === 'ko'
                    ? "빅플래너파트너스는 부동산과 공간 가치를 높이는 프롭테크 기업입니다."
                    : "BIGPLANNER PARTNERS is a proptech company that enhances real estate and space value."}
                </p>
              </div>

              {/* Dynamic Orbital Mission Motion Graphic */}
              <MissionDiagram />

              <div className="mt-12 md:mt-16 max-w-3xl mx-auto text-center">
                <p className="text-gray-600 leading-relaxed bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-sm md:text-base">
                  {language === 'ko'
                    ? "부동산과 공간의 개발 및 운영에 있어서 신뢰할 수 있는 업무파트너를 만나는 것은 중요합니다. 고객의 Needs에 부합하는 부동산 및 공간 가치창출 서비스를 제공하여 자산가치 극대화를 추구합니다. 고객이 보유 또는 사용하고 있는 모든 유형의 토지, 건축물과 공간에 대해 기획, 건축, 금융 전문가들이 최적의 의사결정을 지원합니다. 빅플래너파트너스를 통해 고객은 업무효율성과 사업수익성을 향상시킬 수 있습니다."
                    : "Meeting a reliable business partner is important in the development and operation of real estate and space. We pursue the maximization of asset value by providing real estate and space value creation services that meet clients' needs. Planning, architecture, and finance experts support optimal decision-making for all types of land, buildings, and spaces owned or used by clients. Through BIGPLANNER PARTNERS, clients can improve work efficiency and business profitability."}
                </p>
              </div>
            </motion.div>

            {/* 02. Our Values - Dynamic Risk-to-Solution Motion Graphic */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex flex-col items-center mb-8">
                <div className="w-16 h-16 bg-gray-900 text-white rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                  <Shield size={32} />
                </div>
                <h4 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">02. Our Values</h4>
                <p className="text-lg md:text-xl font-medium text-gray-600 text-center max-w-2xl">
                  {language === 'ko'
                    ? "빅플래너파트너스는 신축 및 부동산 개발의 BIG Risk 세 가지를 해소합니다."
                    : "BIGPLANNER PARTNERS resolves the three BIG Risks of new construction and real estate development."}
                </p>
              </div>

              {/* Interactive Values Flow Motion Graphic */}
              <ValuesFlowDiagram />
            </motion.div>

            {/* 03. Our Service - Dynamic 3 Pillars Architecture Motion Graphic */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex flex-col items-center mb-8">
                <div className="w-16 h-16 bg-gray-900 text-white rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                  <Briefcase size={32} />
                </div>
                <h4 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">03. Our Service</h4>
                <p className="text-lg md:text-xl font-medium text-gray-600 text-center max-w-2xl">
                  {language === 'ko'
                    ? "빅플래너파트너스는 고객의 BIG PLAN을 체계적으로 수행하여 완수합니다."
                    : "BIGPLANNER PARTNERS systematically executes and completes clients' BIG PLANs."}
                </p>
              </div>

              {/* Interactive Architectural 3 Pillars Motion Graphic */}
              <ThreePillarsDiagram />
            </motion.div>

          </div>
        </div>
      </section>

      <OrganizationChart />
      
      <ContactCTA />
      <Footer />
    </div>
  );
}
