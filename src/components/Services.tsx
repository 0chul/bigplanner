import { motion, useReducedMotion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { fireSafetyPath } from '../utils/fireSafetyLanding';
import {
  ConsultingCurveGraphic,
  ManagementTimelineGraphic,
  EscrowShieldGraphic,
  AiTriageFlowGraphic,
} from './motion/LandingMotionGraphics';

export default function Services() {
  const { language } = useLanguage();
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="services-overview"
      className="py-16 md:py-24 bg-white border-t border-gray-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 md:mb-14">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-wider text-blue-600 uppercase mb-3">
              Prop-Tech Solutions
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight text-balance">
              {language === 'ko'
                ? '기획부터 안전정산, AI 빌딩 운영까지'
                : 'From Feasibility to Escrow & AI Building Ops'}
            </h2>
          </div>
          <Link
            to="/service"
            className="inline-flex items-center gap-2 text-sm font-bold text-gray-900 hover:text-blue-600 transition-colors group whitespace-nowrap shrink-0"
          >
            <span>{language === 'ko' ? '전체 서비스 자세히 보기' : 'Explore All Services'}</span>
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
              aria-hidden="true"
            />
          </Link>
        </div>

        {/* Asymmetric 12-Column Architectural Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 01. BIG Consulting (Wide 7 cols) */}
          <motion.article
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 flex flex-col justify-between gap-6 hover:border-gray-300 transition-colors"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-medium text-gray-500 tabular-nums">
                <span className="font-mono font-bold text-blue-600">01</span>
                <span aria-hidden="true">·</span>
                <span>{language === 'ko' ? '투자 및 개발 전략 기획' : 'Investment & Strategy'}</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">BIG Consulting</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-xl">
                {language === 'ko'
                  ? '지번별 법규·상권 정밀 분석과 현금흐름 시뮬레이션을 바탕으로 최적의 건축 규모와 금융 조달(PF·브릿지론) 전략을 수립합니다.'
                  : 'Deriving optimal building massing, zoning compliance, and PF/bridge financing plans through precise parcel and cash-flow modeling.'}
              </p>
            </div>

            <ConsultingCurveGraphic />

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-gray-500">
                {language === 'ko' ? '입지분석 · 수지분석 · 매입매각' : 'Site · Cashflow · Exit'}
              </span>
              <Link
                to="/service?tab=consulting"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-gray-900 hover:text-blue-600 transition-colors whitespace-nowrap"
              >
                <span>{language === 'ko' ? '자세히 보기' : 'Details'}</span>
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>
          </motion.article>

          {/* 02. BIG Management (5 cols) */}
          <motion.article
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 flex flex-col justify-between gap-6 hover:border-gray-300 transition-colors"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-medium text-gray-500 tabular-nums">
                <span className="font-mono font-bold text-blue-600">02</span>
                <span aria-hidden="true">·</span>
                <span>{language === 'ko' ? '통합 PM & 디지털 감리' : 'Integrated PM'}</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">BIG Management</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                {language === 'ko'
                  ? '설계사·시공사 선정부터 건축비서 앱 기반의 실시간 공정·품질 감리까지 건축주 편에서 전 과정을 대행합니다.'
                  : 'End-to-end development management with real-time construction progress and quality tracking via our Architecture Secretary app.'}
              </p>
            </div>

            <ManagementTimelineGraphic language={language} />

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-gray-500">
                {language === 'ko' ? '공정관리 · 원가통제 · 건축비서' : 'Schedule · Cost · App'}
              </span>
              <Link
                to="/service?tab=management"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-gray-900 hover:text-blue-600 transition-colors whitespace-nowrap"
              >
                <span>{language === 'ko' ? '자세히 보기' : 'Details'}</span>
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>
          </motion.article>

          {/* 03. BIG Credit (5 cols) */}
          <motion.article
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 flex flex-col justify-between gap-6 hover:border-gray-300 transition-colors"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-medium text-gray-500 tabular-nums">
                <span className="font-mono font-bold text-blue-600">03</span>
                <span aria-hidden="true">·</span>
                <span>{language === 'ko' ? '8대 안전계약 & 에스크로' : 'Safety & Escrow'}</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">BIG Credit</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                {language === 'ko'
                  ? 'NICE D&R 노무비닷컴 에스크로 계좌와 유치권 포기각서 등 8대 안전장치로 공사비 유용과 부도 리스크를 차단합니다.'
                  : 'Prevent fund diversion and lien disputes with NICE D&R escrow accounts and 8 contractual safeguards.'}
              </p>
            </div>

            <EscrowShieldGraphic language={language} />

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-gray-500">
                {language === 'ko' ? '에스크로 정산 · 책임준공 담보' : 'Escrow · Surety Protection'}
              </span>
              <Link
                to="/service?tab=credit"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-gray-900 hover:text-blue-600 transition-colors whitespace-nowrap"
              >
                <span>{language === 'ko' ? '자세히 보기' : 'Details'}</span>
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>
          </motion.article>

          {/* 04. 방재실 AI 민원 도우미 (Wide 7 cols) */}
          <motion.article
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 bg-gray-950 text-white border border-gray-800 rounded-2xl p-6 sm:p-8 flex flex-col justify-between gap-6"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-medium text-gray-400 tabular-nums">
                <span className="font-mono font-bold text-blue-400">04</span>
                <span aria-hidden="true">·</span>
                <span>{language === 'ko' ? 'AI 빌딩 운영 솔루션' : 'AI Building Operations'}</span>
              </div>
              <h3 className="text-2xl font-bold text-white">
                {language === 'ko' ? '방재실 AI 민원 도우미' : 'AI Operations & Tenant Assistant'}
              </h3>
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-xl">
                {language === 'ko'
                  ? '주차 등록 등 자주 받는 문의는 건물 매뉴얼을 바탕으로 안내합니다. 현장 확인이 필요한 민원은 위치와 내용을 접수 카드로 정리해 담당자가 확인할 수 있게 돕습니다.'
                  : 'Answers common building inquiries using your facility manual and prepares tickets for staff to review when an issue needs an on-site check.'}
              </p>
            </div>

            <AiTriageFlowGraphic language={language} />

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-gray-400">
                {language === 'ko' ? '자동 응대 · 이력 기록 · 데모 시연 신청' : 'Auto Guide · History · Demo'}
              </span>
              <Link
                to={fireSafetyPath}
                className="inline-flex items-center gap-1.5 text-sm font-bold text-white hover:text-blue-300 transition-colors whitespace-nowrap"
              >
                <span>{language === 'ko' ? '방재실 AI 데모 보기' : 'View the building AI demo'}</span>
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>
          </motion.article>
        </div>
      </div>
    </section>
  );
}
