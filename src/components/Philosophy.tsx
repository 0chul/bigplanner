import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { LifecycleMassingGraphic } from './motion/LandingMotionGraphics';
import philosophyFacadeImg from '../assets/images/philosophy_building_facade_1795156655087.jpg';

export default function Philosophy() {
  const { language } = useLanguage();
  const shouldReduceMotion = useReducedMotion();

  const milestones =
    language === 'ko'
      ? [
          {
            num: '01',
            title: '불확실함 해소',
            desc: '지번별 사업타당성 분석 및 현금흐름 시뮬레이션으로 리스크를 사전에 검증합니다.',
          },
          {
            num: '02',
            title: '불편함 해소',
            desc: '설계·인허가·시공사 선정·현장 감리를 전담 PM이 단일 창구로 통합 관리합니다.',
          },
          {
            num: '03',
            title: '불안함 해소',
            desc: '8대 안전계약과 에스크로 기반 기성 정산으로 책임준공과 수익성을 지킵니다.',
          },
        ]
      : [
          {
            num: '01',
            title: 'Eliminate Uncertainty',
            desc: 'Pre-validate risks through parcel feasibility studies and cash-flow simulations.',
          },
          {
            num: '02',
            title: 'Remove Friction',
            desc: 'A dedicated PM unifies design, permits, bidding, and on-site supervision.',
          },
          {
            num: '03',
            title: 'Secure Peace of Mind',
            desc: 'Protect completion and asset returns with 8 safety covenants and escrow settlement.',
          },
        ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
          {/* Left Column: Narrative + 3-Step Value Resolution */}
          <motion.div
            initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 flex flex-col justify-between space-y-8"
          >
            <div>
              <p className="text-xs font-semibold tracking-wider text-blue-600 uppercase mb-3">
                Our Philosophy
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight tracking-tight text-balance mb-5">
                {language === 'ko' ? (
                  <>
                    부동산과 공간 가치를 높이는
                    <br />
                    프롭테크 기업
                  </>
                ) : (
                  <>
                    A PropTech Company Enhancing
                    <br />
                    Real Estate &amp; Space Value
                  </>
                )}
              </h2>
              <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                {language === 'ko'
                  ? '고객의 부동산과 공간가치를 높이기 위해 BIGPLANNER PARTNERS만의 투자분석과 PM 시스템으로 중소형 신축 및 부동산 개발의 불확실함, 불편함, 불안함을 해소합니다.'
                  : "To enhance our clients' real estate and space value, BIGPLANNER PARTNERS eliminates the uncertainty, inconvenience, and anxiety of small-to-medium new construction and real estate development through our investment analysis and PM system."}
              </p>
            </div>

            {/* 3-Step Clean Hairline List */}
            <div className="divide-y divide-gray-200 border-y border-gray-200">
              {milestones.map((item, idx) => (
                <motion.div
                  key={item.num}
                  initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.45, delay: idx * 0.08 }}
                  className="py-4 flex items-start gap-4"
                >
                  <span className="font-mono text-xs font-bold text-blue-600 tabular-nums pt-1 shrink-0">
                    {item.num}
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">{item.title}</h3>
                    <p className="text-sm text-gray-600 mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-sm font-bold text-gray-900 hover:text-blue-600 transition-colors group whitespace-nowrap"
              >
                <span>{language === 'ko' ? '회사소개 자세히 보기' : 'MORE ABOUT US'}</span>
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </motion.div>

          {/* Right Column: Architectural Photography + Live Value Growth Motion Graphic */}
          <motion.div
            initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 flex flex-col gap-4"
          >
            <div className="relative flex-1 min-h-[280px] lg:min-h-[340px] rounded-2xl overflow-hidden border border-gray-200 bg-gray-100">
              <img
                src={philosophyFacadeImg}
                alt={
                  language === 'ko'
                    ? '빅플래너파트너스 현대적 중소형 건축물 파사드'
                    : 'Contemporary mid-rise architectural building facade'
                }
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
              <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black/80 via-black/35 to-transparent text-white flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-medium text-gray-300">
                    {language === 'ko' ? '누적 개발 및 PM 경험' : 'Industry Track Record'}
                  </p>
                  <p className="text-2xl font-bold tabular-nums">10+ Years</p>
                </div>
                <span className="text-xs text-gray-200 font-medium">
                  {language === 'ko' ? '중소형 신축 · 리모델링 전문' : 'Mid-Size Architecture & PM'}
                </span>
              </div>
            </div>

            {/* Animated Value Curve & Massing Graphic */}
            <LifecycleMassingGraphic language={language} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
