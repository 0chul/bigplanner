import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Briefcase, ShieldCheck, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export default function PMTriadMotion() {
  const { language } = useLanguage();
  const [activeNode, setActiveNode] = useState<number>(0);

  const triad = language === 'ko' ? [
    {
      id: 0,
      title: "전문가",
      titleEn: "Expert",
      subtitle: "건축주 입장의 전공정 전담 대행",
      icon: Users,
      desc: "빅플래너파트너스는 신축개발사업에 필요한 기획, 설계, 시공, 감리, 금융 등 전체 공정을 건축주의 관점에서 전문적으로 대행합니다.",
      metrics: "전문가 네트워크 100% 밀착 지원",
      tag: "FULL DELEGATION",
      deliverables: [
        "건축주 전담 수석 PM 배치 및 1:1 밀착 의사결정 보좌",
        "토지 매입부터 인허가·시공사 입찰·준공까지 원스톱 대행",
        "불필요한 시행착오 및 추가 공사비 원천 차단"
      ]
    },
    {
      id: 1,
      title: "파트너",
      titleEn: "Partner",
      subtitle: "처음부터 사업종료까지 함께하는 동반자",
      icon: Briefcase,
      desc: "설계, 시공, 분양으로 단절되는 외주 용역이 아닌, 사업 기획 초기부터 최종 법인 청산 및 수익 실현까지 건축주와 운명을 함께합니다.",
      metrics: "사업 생애주기 All-Time 동행",
      tag: "END-TO-END",
      deliverables: [
        "기획·설계·시공·분양의 유기적 일원화 관리",
        "건축주의 이익을 최우선으로 두는 독립적 의사결정",
        "준공 후 임대 운영 및 가치 극대화 자문 지속"
      ]
    },
    {
      id: 2,
      title: "투명한",
      titleEn: "Transparent",
      subtitle: "모든 데이터와 공정의 100% 투명한 공개",
      icon: ShieldCheck,
      desc: "모든 공정에서 기획, 건설, 금융 전문가들의 정밀한 자문과 '건축비서 App'을 통한 실시간 데이터 공개로 절대적인 신뢰를 구축합니다.",
      metrics: "데이터·대금 투명성 100%",
      tag: "TOTAL TRUST",
      deliverables: [
        "실시간 현장 감리 일지 및 자재 투입 명세 디지털 공개",
        "NICE D&R 에스크로 시스템 연동 대금 집행 투명화",
        "공정률 및 인력 투입 현황 실시간 모니터링"
      ]
    }
  ] : [
    {
      id: 0,
      title: "Expert",
      titleEn: "Expert",
      subtitle: "Acting for the owner throughout entire lifecycle",
      icon: Users,
      desc: "BIGPLANNER PARTNERS expertly acts on behalf of the client for the entire process required for new development from planning, design, and construction to finance.",
      metrics: "100% Dedicated Expert Oversight",
      tag: "FULL DELEGATION",
      deliverables: [
        "Dedicated Chief PM assignment & 1:1 advisory",
        "End-to-end agency from land acquisition to completion",
        "Zero trial-and-error & prevention of extra costs"
      ]
    },
    {
      id: 1,
      title: "Partner",
      titleEn: "Partner",
      subtitle: "True partner with you from start to finish",
      icon: Briefcase,
      desc: "We are an authentic partner who journeys with the client from initial planning through final liquidation and returns, unlike fragmented single-scope services.",
      metrics: "All-Time Lifecycle Partnership",
      tag: "END-TO-END",
      deliverables: [
        "Seamless integration of planning, design, build & sales",
        "Independent decisions prioritizing client interest",
        "Ongoing leasing & asset enhancement post-completion"
      ]
    },
    {
      id: 2,
      title: "Transparent",
      titleEn: "Transparent",
      subtitle: "100% Transparent disclosure of all site data",
      icon: ShieldCheck,
      desc: "We build absolute trust through transparent process management and real-time site data via the 'Architecture Secretary App'.",
      metrics: "100% Transparent Financials",
      tag: "TOTAL TRUST",
      deliverables: [
        "Digital site supervision logs & material tracking",
        "NICE D&R Escrow integration ensuring secure payments",
        "Real-time process rate and labor monitoring"
      ]
    }
  ];

  const current = triad[activeNode];

  return (
    <div className="max-w-5xl mx-auto py-6">
      {/* Dynamic Triad Schematic Container */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-xl p-6 md:p-12 relative overflow-hidden">
        {/* Subtle background tech grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-40 pointer-events-none" />

        {/* Top synergy formula */}
        <div className="text-center mb-10 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-100 text-gray-800 text-xs font-bold mb-3 border border-gray-200">
            <Sparkles size={13} className="text-blue-600" />
            <span>TOTAL CONSTRUCTION SERVICE SYNERGY</span>
          </div>
          <h4 className="text-xl md:text-2xl font-black text-gray-900">
            {language === 'ko' ? '전문가 + 파트너 + 투명함 = 성공적인 사업완수' : 'Expert + Partner + Transparent = Guaranteed Success'}
          </h4>
        </div>

        {/* 3 Node Interactive Triad Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 relative z-10 mb-8">
          {triad.map((item, idx) => {
            const Icon = item.icon;
            const isSelected = activeNode === idx;

            return (
              <motion.button
                key={item.id}
                onClick={() => setActiveNode(idx)}
                whileHover={{ scale: 1.02 }}
                className={`p-6 rounded-2xl text-left transition-all duration-300 relative border flex flex-col justify-between ${
                  isSelected
                    ? 'bg-gray-900 text-white shadow-2xl border-gray-900 ring-4 ring-gray-900/10'
                    : 'bg-white text-gray-700 border-gray-200 shadow-sm hover:border-gray-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                      isSelected ? 'bg-white text-gray-900 shadow-md' : 'bg-gray-100 text-gray-800'
                    }`}>
                      <Icon size={24} />
                    </div>
                    <span className={`text-xs font-mono font-bold tracking-wider px-2.5 py-1 rounded-full ${
                      isSelected ? 'bg-blue-500 text-white shadow-sm' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {item.tag}
                    </span>
                  </div>

                  <h5 className="font-black text-xl mb-1">
                    {item.title}
                  </h5>
                  <p className={`text-xs sm:text-sm font-semibold leading-snug ${
                    isSelected ? 'text-gray-200' : 'text-gray-600'
                  }`}>
                    {item.subtitle}
                  </p>
                </div>

                <div className={`mt-6 pt-3 border-t text-xs sm:text-sm font-bold flex items-center justify-between ${
                  isSelected ? 'border-white/15 text-emerald-300' : 'border-gray-100 text-gray-600'
                }`}>
                  <span>{item.metrics}</span>
                  <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-emerald-400 animate-ping' : 'bg-gray-300'}`} />
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Selected Triad Detail Reveal */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeNode}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-50 rounded-2xl p-6 md:p-8 border border-gray-200 relative z-10"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-7 space-y-3">
                <span className="text-xs font-mono font-bold text-blue-600 uppercase tracking-widest block">
                  CORE ADVANTAGE · {current.tag}
                </span>
                <h5 className="text-xl md:text-2xl font-black text-gray-900">
                  {current.title} - {current.subtitle}
                </h5>
                <p className="text-sm md:text-base text-gray-700 leading-relaxed font-medium">
                  {current.desc}
                </p>
              </div>

              <div className="md:col-span-5 space-y-2">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
                  {language === 'ko' ? '빅플래너 보장 항목' : 'Guaranteed Deliverables'}
                </span>
                {current.deliverables.map((del, i) => (
                  <div key={i} className="flex items-start gap-2.5 bg-white p-3.5 rounded-xl border border-gray-200 text-xs sm:text-sm font-bold text-gray-800 shadow-sm">
                    <CheckCircle2 size={16} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span>{del}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
