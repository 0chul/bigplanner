import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { HeroBlueprintOverlay } from './motion/LandingMotionGraphics';
import heroTowerImg from '../assets/images/hero_commercial_tower_1795156654561.jpg';
import heroStudioImg from '../assets/images/hero_architectural_studio_1795156655513.jpg';
import heroLobbyImg from '../assets/images/hero_modern_lobby_1795156655027.jpg';

const SLIDE_DURATION_MS = 6000;

const slides = {
  ko: [
    {
      kicker: '프롭테크 개발 · 투자분석',
      title: '부동산 투자 수익과\n안정성을 극대화하는 파트너',
      subtitle: "We've got a different solution of property",
      image: heroTowerImg,
      alt: '서울 도심 중소형 상업용 건축물 야경 외관',
    },
    {
      kicker: '중소형 건축 PM · 시공관리',
      title: '중소형 건축을 전문으로\n기획하고 개발하는 회사',
      subtitle: 'Always by your side, always on your side',
      image: heroStudioImg,
      alt: '건축 모형과 설계 도면이 놓인 프롭테크 개발 스튜디오',
    },
    {
      kicker: '안전계약 · AI 운영 자동화',
      title: '쉽고, 편하게, 확실하게\n고객의 BIG PLAN을 이룹니다',
      subtitle: 'Invest smarter · Earn more · Stress less',
      image: heroLobbyImg,
      alt: '트래버틴 석재와 따뜻한 조명이 어우러진 모던 빌딩 로비',
    },
  ],
  en: [
    {
      kicker: 'PropTech Development · Feasibility',
      title: 'Maximizing Real Estate\nReturns and Stability',
      subtitle: "We've got a different solution of property",
      image: heroTowerImg,
      alt: 'Modern mid-rise commercial building exterior at dusk',
    },
    {
      kicker: 'Architectural PM · Construction Oversight',
      title: 'Specializing in Small-to-Medium\nArchitecture Development',
      subtitle: 'Always by your side, always on your side',
      image: heroStudioImg,
      alt: 'Architectural massing models and plans inside development studio',
    },
    {
      kicker: 'Escrow Safety · AI Operations',
      title: 'Achieving Your BIG PLAN\nClearly and Reliably',
      subtitle: 'Invest smarter · Earn more · Stress less',
      image: heroLobbyImg,
      alt: 'Contemporary boutique building lobby interior',
    },
  ],
};

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const { language } = useLanguage();
  const shouldReduceMotion = useReducedMotion();
  const currentSlides = slides[language];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % currentSlides.length);
    }, SLIDE_DURATION_MS);
    return () => clearInterval(timer);
  }, [currentSlides.length]);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % currentSlides.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + currentSlides.length) % currentSlides.length);

  const activeSlide = currentSlides[current];

  return (
    <section
      aria-label={language === 'ko' ? '메인 히어로' : 'Main Hero'}
      className="relative min-h-[640px] h-[92vh] max-h-[960px] w-full overflow-hidden bg-gray-950"
    >
      {/* Background Architectural Photography */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-slate-900"
        >
          <img
            src={activeSlide.image}
            alt={activeSlide.alt}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/35" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/35" />
        </motion.div>
      </AnimatePresence>

      {/* Architectural CAD Wireframe Motion Graphic Overlay */}
      <HeroBlueprintOverlay slideIndex={current} />

      {/* Main Content */}
      <div className="relative z-20 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center pt-16">
        <div className="max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${language}-${current}`}
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -14 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="text-xs sm:text-sm font-semibold tracking-wider text-blue-300 uppercase mb-4">
                {activeSlide.kicker}
              </p>

              <h1 className="text-[clamp(2.25rem,4.4vw,4rem)] font-bold text-white whitespace-pre-line leading-[1.15] tracking-tight text-balance mb-5">
                {activeSlide.title}
              </h1>

              <p className="text-base md:text-lg text-gray-200 font-normal tracking-normal mb-8 max-w-xl leading-relaxed">
                {activeSlide.subtitle}
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-gray-950 font-bold text-sm sm:text-base hover:bg-gray-100 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                >
                  <span>{language === 'ko' ? '프로젝트 상담 신청' : 'Schedule Consultation'}</span>
                  <ArrowRight size={17} aria-hidden="true" />
                </Link>

                <a
                  href="#services-overview"
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl border border-white/30 text-white font-semibold text-sm sm:text-base hover:bg-white/10 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <span>{language === 'ko' ? '프롭테크 솔루션 보기' : 'Explore Solutions'}</span>
                </a>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Slide Controller & Animated Progress Bar */}
      <div className="absolute bottom-8 left-0 right-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-6">
          <div className="flex items-center gap-4 flex-1 max-w-md">
            <span className="font-mono text-xs font-semibold text-white/90 tabular-nums shrink-0">
              0{current + 1} / 0{currentSlides.length}
            </span>
            <div className="flex items-center gap-2 flex-1">
              {currentSlides.map((slide, idx) => {
                const isActive = idx === current;
                return (
                  <button
                    key={slide.kicker}
                    type="button"
                    onClick={() => setCurrent(idx)}
                    aria-label={`Slide ${idx + 1}`}
                    className="relative flex-1 h-1.5 bg-white/25 rounded-full overflow-hidden cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    {isActive && (
                      <motion.div
                        key={`progress-${current}`}
                        className="absolute inset-0 bg-white origin-left"
                        initial={{ scaleX: shouldReduceMotion ? 1 : 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: SLIDE_DURATION_MS / 1000, ease: 'linear' }}
                      />
                    )}
                    {idx < current && <div className="absolute inset-0 bg-white/75" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={prevSlide}
              className="w-10 h-10 rounded-xl border border-white/30 text-white flex items-center justify-center hover:bg-white/15 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label={language === 'ko' ? '이전 슬라이드' : 'Previous slide'}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={nextSlide}
              className="w-10 h-10 rounded-xl border border-white/30 text-white flex items-center justify-center hover:bg-white/15 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label={language === 'ko' ? '다음 슬라이드' : 'Next slide'}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
