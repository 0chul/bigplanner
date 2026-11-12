import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, ShieldCheck, ArrowRight, CheckCircle2, TrendingUp, Sparkles, RefreshCw } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export default function ValuesFlowDiagram() {
  const { language } = useLanguage();
  const [selectedRisk, setSelectedRisk] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);

  const riskData = [
    {
      id: 0,
      riskNumber: "BIG RISK 01",
      riskTitleKo: "불확실함",
      riskTitleEn: "Uncertainty",
      riskSubKo: "사업타당성 및 예산 불안",
      riskSubEn: "Feasibility & Budget Anxiety",
      riskDescKo: "인허가 리스크, 예상치 못한 추가 공사비, 사업 수지 불일치 등으로 인한 막대한 재정 손실 위험",
      riskDescEn: "Risk of huge financial loss due to permit risks, unexpected extra costs, and feasibility discrepancies",
      
      solutionTitleKo: "철저한 기획 & 사업계획",
      solutionTitleEn: "Thorough Planning & Feasibility",
      solutionDescKo: "철저한 기획과 계획을 통해\n안정적으로 사업을 추진",
      solutionDescEn: "Stable project execution through\nthorough planning and design",
      solutionDetailsKo: [
        "사전 법규/인허가 100% 전수 검토",
        "빅데이터 기반 현실적 건축비·수익률 시뮬레이션",
        "단계별 리스크 조기 차단 및 Exit 전략 수립"
      ],
      solutionDetailsEn: [
        "100% pre-review of zoning & building permits",
        "Big data-based realistic construction cost & ROI simulation",
        "Early risk mitigation and Exit strategy formulation"
      ],
      color: "from-amber-500/20 to-orange-500/20",
      accent: "#f59e0b",
    },
    {
      id: 1,
      riskNumber: "BIG RISK 02",
      riskTitleKo: "불편함",
      riskTitleEn: "Inconvenience",
      riskSubKo: "복잡다단한 시공현장 관리",
      riskSubEn: "Complex Site Management",
      riskDescKo: "설계사·시공사·감리자 간의 책임 회피, 공정 지연, 수많은 현장 민원과 복잡한 행정 업무 부담",
      riskDescEn: "Burden of shifting responsibilities among architects/contractors, delays, civil complaints, and admin tasks",

      solutionTitleKo: "체계적인 시공관리 대행",
      solutionTitleEn: "Systematic Construction Agency",
      solutionDescKo: "공사과정의 다양한 시공관리 업무를\n체계적으로 대행",
      solutionDescEn: "Systematically acting as an agent for\nvarious construction management tasks",
      solutionDetailsKo: [
        "건축주 전담 PM 전문가의 현장 밀착 감독",
        "시공공정 및 품질 체크리스트 실시간 디지털화",
        "시공사-하도급 간 분쟁 원천 방지 및 일정 준수"
      ],
      solutionDetailsEn: [
        "Dedicated PM expert on-site close inspection",
        "Real-time digitalization of construction quality checklists",
        "Prevention of disputes and strict schedule adherence"
      ],
      color: "from-blue-500/20 to-cyan-500/20",
      accent: "#3b82f6",
    },
    {
      id: 2,
      riskNumber: "BIG RISK 03",
      riskTitleKo: "불안함",
      riskTitleEn: "Anxiety",
      riskSubKo: "공사 중단 및 대금 분쟁",
      riskSubEn: "Work Stoppage & Payment Disputes",
      riskDescKo: "부실 시공사 도산, 유치권 행사, 하도급 임금 체불 등 건축주의 재산을 위협하는 치명적 분쟁",
      riskDescEn: "Fatal disputes threatening client assets such as contractor bankruptcy, liens, and unpaid wages",

      solutionTitleKo: "TOTAL SERVICE 안심 보장",
      solutionTitleEn: "TOTAL SERVICE Guarantee",
      solutionDescKo: "성공적인 사업완수를 위한\nTOTAL SERVICE를 제공",
      solutionDescEn: "Providing TOTAL SERVICE for\nsuccessful project completion",
      solutionDetailsKo: [
        "에스크로(Escrow) 안전 대금관리로 공사비 유용 차단",
        "유치권 포기각서 & 8대 안전계약 장치 완비",
        "책임준공 준하는 준공 시까지 전방위 권익 보호"
      ],
      solutionDetailsEn: [
        "Escrow payment management preventing fund misappropriation",
        "Lien renunciation & 8 comprehensive safety contract devices",
        "End-to-end client interest protection until completion"
      ],
      color: "from-emerald-500/20 to-teal-500/20",
      accent: "#10b981",
    },
  ];

  // Auto-play tab progression
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setSelectedRisk((prev) => (prev + 1) % 3);
    }, 4500);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const current = riskData[selectedRisk];

  return (
    <div className="max-w-5xl mx-auto py-6">
      {/* Risk Selectors / Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            {language === 'ko' ? '리스크 해결 단계' : 'Risk Resolution Stages'}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping" />
        </div>

        {/* Auto play toggle */}
        <button
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-900 bg-white border border-gray-200 px-3 py-1.5 rounded-full shadow-sm transition-colors"
        >
          <RefreshCw size={12} className={isAutoPlaying ? "animate-spin" : ""} />
          <span>{isAutoPlaying ? (language === 'ko' ? '자동 재생 중' : 'Auto Playing') : (language === 'ko' ? '정지됨' : 'Paused')}</span>
        </button>
      </div>

      {/* 3 Step Indicator Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-8">
        {riskData.map((item, idx) => {
          const isCurrent = selectedRisk === idx;
          return (
            <button
              key={item.id}
              onClick={() => {
                setSelectedRisk(idx);
                setIsAutoPlaying(false);
              }}
              className={`p-4 md:p-5 rounded-2xl text-left transition-all duration-300 relative border ${
                isCurrent 
                  ? 'bg-gray-900 text-white shadow-xl border-gray-900 ring-2 ring-gray-900/10' 
                  : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200 shadow-sm'
              }`}
            >
              {/* Active Progress Bar inside button */}
              {isCurrent && isAutoPlaying && (
                <motion.div
                  className="absolute bottom-0 left-0 h-1 bg-blue-500 rounded-b-2xl"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 4.5, ease: 'linear' }}
                />
              )}

              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-bold tracking-wider uppercase ${isCurrent ? 'text-blue-400' : 'text-gray-500'}`}>
                  {item.riskNumber}
                </span>
                <span className={`w-2.5 h-2.5 rounded-full ${isCurrent ? 'bg-emerald-400' : 'bg-gray-300'}`} />
              </div>
              <h5 className="font-extrabold text-lg md:text-xl leading-tight">
                {language === 'ko' ? item.riskTitleKo : item.riskTitleEn}
              </h5>
              <p className={`text-sm mt-1 font-medium truncate ${isCurrent ? 'text-gray-200' : 'text-gray-600'}`}>
                {language === 'ko' ? item.riskSubKo : item.riskSubEn}
              </p>
            </button>
          );
        })}
      </div>

      {/* Interactive Dynamic Transformation Canvas */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden p-6 md:p-10 relative">
        {/* Decorative Grid Lines */}
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
              
              {/* Left Column: The Problem (Risk) */}
              <div className="lg:col-span-5 bg-rose-50/80 border border-rose-200 rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 w-28 h-28 bg-rose-200/40 rounded-full blur-2xl" />
                
                <div className="flex items-center gap-2 text-rose-700 text-xs md:text-sm font-bold tracking-wider uppercase mb-3">
                  <AlertTriangle size={17} />
                  <span>{current.riskNumber} : {language === 'ko' ? '건축주의 페인포인트' : 'Client Pain Point'}</span>
                </div>

                <h4 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">
                  {language === 'ko' ? current.riskTitleKo : current.riskTitleEn}
                </h4>
                
                <p className="text-sm md:text-base text-gray-800 leading-relaxed font-medium mb-4">
                  {language === 'ko' ? current.riskDescKo : current.riskDescEn}
                </p>

                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-100 text-rose-900 text-xs md:text-sm font-bold">
                  <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
                  <span>{language === 'ko' ? '방치 시 사업 손실 및 분쟁 직결' : 'Direct cause of loss & disputes'}</span>
                </div>
              </div>

              {/* Center Column: Animated Transformation Conduit */}
              <div className="lg:col-span-2 flex flex-col items-center justify-center py-2 lg:py-0">
                <div className="hidden lg:flex flex-col items-center gap-2">
                  <motion.div 
                    animate={{ x: [0, 8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    className="w-12 h-12 rounded-full bg-gray-900 text-white flex items-center justify-center shadow-lg"
                  >
                    <ArrowRight size={22} />
                  </motion.div>
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-wider text-center mt-1">
                    BIGPLANNER<br/>SOLUTION
                  </span>
                </div>

                {/* Mobile vertical indicator */}
                <div className="flex lg:hidden items-center justify-center py-1">
                  <div className="w-9 h-9 rounded-full bg-gray-900 text-white flex items-center justify-center shadow">
                    <ArrowRight size={18} className="rotate-90" />
                  </div>
                </div>
              </div>

              {/* Right Column: The BigPlanner Resolution */}
              <div className="lg:col-span-5 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-white rounded-2xl p-6 md:p-7 shadow-xl relative overflow-hidden border border-gray-800">
                <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl" />

                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center gap-1.5 text-xs md:text-sm font-bold text-emerald-400 uppercase tracking-wider">
                    <ShieldCheck size={18} />
                    <span>BIGPLANNER SOLUTION</span>
                  </span>
                  <span className="text-xs bg-white/15 px-2.5 py-1 rounded-full text-emerald-300 font-bold">
                    100% RESOLVED
                  </span>
                </div>

                <h4 className="text-xl md:text-2xl font-bold text-white mb-2">
                  {language === 'ko' ? current.solutionTitleKo : current.solutionTitleEn}
                </h4>

                <p className="text-sm text-blue-100 font-semibold mb-4 whitespace-pre-line leading-relaxed">
                  {language === 'ko' ? current.solutionDescKo : current.solutionDescEn}
                </p>

                <div className="space-y-2.5 pt-3 border-t border-white/15">
                  {(language === 'ko' ? current.solutionDetailsKo : current.solutionDetailsEn).map((d, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs md:text-sm text-gray-100 font-medium">
                      <CheckCircle2 size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span>{d}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Converged Ultimate Outcome: Mutual Growth */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-8 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white p-6 md:p-8 rounded-3xl shadow-xl border border-gray-800 text-center relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-blue-600/5 pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-xs md:text-sm font-bold text-blue-300 mb-3 border border-white/10">
            <TrendingUp size={15} />
            <span>{language === 'ko' ? '3대 리스크 해소의 궁극적 목표' : 'Ultimate Goal of Resolving 3 Big Risks'}</span>
          </div>

          <h4 className="text-xl md:text-2xl font-black text-white mb-3">
            {language === 'ko' ? '상호간의 동반성장 추구 (Mutual Growth)' : 'Pursuing Mutual Growth'}
          </h4>

          <p className="text-sm md:text-base text-gray-200 leading-relaxed font-normal">
            {language === 'ko'
              ? "빅플래너파트너스는 고객을 단순한 사업의 대상이 아닌 파트너십을 통하여 상호간의 동반성장을 추구합니다. 불확실성 없는 부동산 개발로 고객의 성공이 곧 우리의 성공이 됩니다."
              : "BIGPLANNER PARTNERS pursues mutual growth through genuine partnership, not just treating clients as business targets. Through risk-free real estate development, client success is our success."}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
