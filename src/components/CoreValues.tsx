import { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { IsometricValueGraphic } from './motion/LandingMotionGraphics';

const values = {
  ko: [
    {
      num: '01',
      code: 'B',
      title: 'We Buildup!',
      subtitle: '새로운 공간 창조 · Space Creation',
      desc: '토지 입지 분석과 최적 규모 산출을 통해 새로운 공간 창조(Buildup), 공간 경험(Insight), 이익 확보(Gains)의 선순환을 구축합니다.',
    },
    {
      num: '02',
      code: 'I',
      title: 'Insight!',
      subtitle: 'The Construction Intelligence Platform',
      desc: '체계적인 수지 분석과 실시간 공정·품질 관리 PM 플랫폼으로 건축 과정에서 발생하는 시행착오와 비용 누수를 차단합니다.',
    },
    {
      num: '03',
      code: 'G',
      title: 'Gain! Value.',
      subtitle: '맞춤 금융기획 · 자산 수익 극대화',
      desc: '건축주의 개발 목표와 자본 규모에 맞춘 최적의 금융 기획과 매각·임대 전략으로 안정적인 최종 수익을 실현합니다.',
    },
  ],
  en: [
    {
      num: '01',
      code: 'B',
      title: 'We Buildup!',
      subtitle: 'Creation of New Spaces',
      desc: 'Through parcel analysis and optimal massing, we establish a cycle of space creation (Buildup), spatial experience (Insight), and asset gains.',
    },
    {
      num: '02',
      code: 'I',
      title: 'Insight!',
      subtitle: 'The Construction Intelligence Platform',
      desc: 'Eliminate construction uncertainty and cost overruns with systematic feasibility modeling and real-time PM platform oversight.',
    },
    {
      num: '03',
      code: 'G',
      title: 'Gain! Value.',
      subtitle: 'Tailored Financial Structuring',
      desc: 'Realize durable asset returns with capital planning, leasing, and exit strategies tailored to your development scale.',
    },
  ],
};

export default function CoreValues() {
  const { language } = useLanguage();
  const shouldReduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const currentValues = values[language];

  useEffect(() => {
    if (isPaused || shouldReduceMotion) return;
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % currentValues.length);
    }, 4500);
    return () => window.clearInterval(timer);
  }, [isPaused, shouldReduceMotion, currentValues.length]);

  return (
    <section
      id="core-values"
      className="py-16 md:py-24 bg-gray-50 border-t border-gray-200"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 md:mb-14">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-wider text-blue-600 uppercase mb-3">
              Core Values
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight text-balance">
              {language === 'ko'
                ? '공간의 가치를 완성하는 B·I·G 프레임워크'
                : 'The B·I·G Framework Behind Every Space'}
            </h2>
          </div>
          <p className="text-sm sm:text-base text-gray-600 max-w-md">
            {language === 'ko'
              ? '기획부터 시공, 금융, 운영까지 하나의 입체적인 개발 체계로 연결합니다.'
              : 'Connecting planning, construction, finance, and operations into one cohesive architecture.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left: Interactive 3-Layer Isometric Motion Graphic */}
          <div className="lg:col-span-7">
            <IsometricValueGraphic
              activeIndex={activeIndex}
              onSelect={(idx) => {
                setActiveIndex(idx);
                setIsPaused(true);
              }}
              language={language}
            />
          </div>

          {/* Right: Interactive Value Chapters */}
          <div className="lg:col-span-5 space-y-3">
            {currentValues.map((value, idx) => {
              const isActive = activeIndex === idx;
              return (
                <button
                  key={value.num}
                  type="button"
                  onClick={() => {
                    setActiveIndex(idx);
                    setIsPaused(true);
                  }}
                  className={`w-full text-left p-5 sm:p-6 rounded-2xl border transition-all duration-200 relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                    isActive
                      ? 'bg-white border-gray-900 shadow-sm'
                      : 'bg-white/60 border-gray-200 hover:bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-xs font-medium text-gray-500 tabular-nums">
                        <span className="font-mono font-bold text-blue-600">
                          {value.num}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{value.subtitle}</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">{value.title}</h3>
                    </div>

                    <span
                      className={`w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 transition-colors ${
                        isActive ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {value.code}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 leading-relaxed mt-3">
                    {value.desc}
                  </p>

                  {isActive && !shouldReduceMotion && (
                    <motion.div
                      layoutId="core-value-active-indicator"
                      className="mt-4 h-0.5 bg-blue-600 rounded-full"
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    />
                  )}
                </button>
              );
            })}

            <div className="pt-2 flex justify-end">
              <Link
                to="/service"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-gray-900 hover:text-blue-600 transition-colors group"
              >
                <span>
                  {language === 'ko' ? '전체 서비스 프로세스 보기' : 'View Full Process'}
                </span>
                <ArrowRight
                  size={15}
                  className="group-hover:translate-x-1 transition-transform"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
