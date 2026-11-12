import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, CheckCircle2, ChevronRight, Layers, Compass, TrendingUp, Building } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export default function ValueChainMotion() {
  const { language } = useLanguage();
  const [activeStage, setActiveStage] = useState<number>(0);

  const stages = [
    {
      id: 0,
      letter: "B",
      name: "Buildup",
      subKo: "새로운 공간 창조",
      subEn: "New Space Creation",
      tagKo: "SPACE BUILDUP",
      tagEn: "SPACE BUILDUP",
      icon: Building,
      summaryKo: "토지와 건축물의 최유효 이용계획을 도출하여 자산가치를 처음부터 극대화합니다.",
      summaryEn: "Maximizing asset value from scratch by deriving optimal land & building usage plans.",
      color: "from-blue-600 to-indigo-700",
      accent: "#3b82f6",
      itemsKo: [
        { title: "건축투자 컨설팅", desc: "사업지 입지 분석, 인허가 가능성 전수 검토 및 투자 구조화" },
        { title: "신축개발 컨설팅", desc: "최적 규모 및 용도 도출, 총공사비 및 현금흐름(Cash Flow) 시뮬레이션" },
        { title: "자산운영 컨설팅", desc: "준공 후 임대수익률 및 공실률 최소화를 위한 운영 마스터플랜" },
      ],
      itemsEn: [
        { title: "Architecture Investment Consulting", desc: "Location analysis, 100% permit feasibility & investment structuring" },
        { title: "New Development Consulting", desc: "Optimal scale/use derivation, total cost & Cash Flow simulation" },
        { title: "Asset Management Consulting", desc: "Post-completion masterplan to minimize vacancies & maximize yields" },
      ],
    },
    {
      id: 1,
      letter: "I",
      name: "Insight",
      subKo: "공간경험 개선 및 가치정립",
      subEn: "Space Experience & Identity",
      tagKo: "EXPERIENCE INSIGHT",
      tagEn: "EXPERIENCE INSIGHT",
      icon: Compass,
      summaryKo: "단순한 물리적 건물을 넘어 이용자가 머물고 싶어 하는 매력적인 경험을 디자인합니다.",
      summaryEn: "Designing engaging customer experiences beyond physical buildings that users desire.",
      color: "from-gray-900 to-gray-800",
      accent: "#111827",
      itemsKo: [
        { title: "고객경험관리(CEM) 컨설팅", desc: "방문객 여정지도(Customer Journey Map) 및 핵심 터치포인트 분석" },
        { title: "공간개념정립(Scape Identity) 컨설팅", desc: "건물만의 차별화된 스토리텔링과 브랜드 아이덴티티 확립" },
        { title: "서비스디자인(Service Design) 컨설팅", desc: "공간 내 동선 효율화와 운영 서비스 청사진(Service Blueprint) 최적화" },
        { title: "넛지서비스(NUDGE SERVICE) 컨설팅", desc: "행동경제학 기반 방문객 체류시간 및 소비 전환 유도 설계" },
      ],
      itemsEn: [
        { title: "Customer Experience Management (CEM)", desc: "Customer Journey Map & Critical MOT touchpoint optimization" },
        { title: "Scape Identity Consulting", desc: "Distinct storytelling and spatial brand identity formulation" },
        { title: "Service Design Consulting", desc: "Circulation efficiency & operational Service Blueprint engineering" },
        { title: "NUDGE SERVICE Consulting", desc: "Behavioral economics design extending dwell time & commercial conversion" },
      ],
    },
    {
      id: 2,
      letter: "G",
      name: "Gains",
      subKo: "확실한 수익 실현",
      subEn: "Definite Return Realization",
      tagKo: "CAPITAL GAINS",
      tagEn: "CAPITAL GAINS",
      icon: TrendingUp,
      summaryKo: "최적 시점의 매입·매각 자문과 투자 유치를 통해 최종적인 투자 수익을 회수합니다.",
      summaryEn: "Recouping peak investment returns through timed acquisition/disposition and capital attraction.",
      color: "from-emerald-600 to-teal-700",
      accent: "#10b981",
      itemsKo: [
        { title: "매입 자문 (개발기획)", desc: "저평가 우량 부동산 소싱, 정밀 실사(Due Diligence) 및 사업계획 수립" },
        { title: "매각 자문 (투자유치)", desc: "적정 가치 평가, 티저(Teaser) 및 IM 작성, 우량 원매자 매칭 및 Exit 지원" },
      ],
      itemsEn: [
        { title: "Purchase Advisory (Development)", desc: "Prime property sourcing, Due Diligence & comprehensive business modeling" },
        { title: "Sale Advisory (Exit Attraction)", desc: "Valuation, IM & Teaser preparation, buyer matching & smooth closing" },
      ],
    },
  ];

  const current = stages[activeStage];

  return (
    <div className="relative max-w-6xl mx-auto py-8">
      {/* Dynamic Interaction Hint */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping" />
          <span className="text-xs sm:text-sm font-bold text-gray-600 uppercase tracking-wider">
            {language === 'ko' ? 'B · I · G 생애주기 솔루션' : 'B · I · G Life Cycle Solutions'}
          </span>
        </div>
        <span className="text-xs sm:text-sm text-gray-600 font-semibold hidden sm:inline">
          {language === 'ko' ? '각 단계를 클릭하여 상세 컨설팅 범위를 확인하세요' : 'Click each phase to explore consulting scope'}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Column: Interactive Value Reactor Hub */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center">
            
            {/* Pulsing Concentric SVG Rings */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 300 300">
              <defs>
                <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#111827" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.8" />
                </linearGradient>
              </defs>
              <circle cx="150" cy="150" r="140" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4 4" />
              <motion.circle 
                cx="150" cy="150" r="120" 
                stroke="url(#ringGrad)" 
                strokeWidth="1.5" 
                strokeDasharray="8 8"
                animate={{ rotate: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: "150px 150px" }}
              />
            </svg>

            {/* Central Master Reactor (Value Chain Core) */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="w-44 h-44 sm:w-48 sm:h-48 rounded-full bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-white flex flex-col items-center justify-center text-center p-4 shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-4 border-white z-10 cursor-pointer"
            >
              <span className="text-xs tracking-widest text-blue-400 font-bold uppercase mb-1">PROPTECH</span>
              <span className="font-extrabold text-2xl sm:text-3xl tracking-tight leading-none">
                VALUE<br />CHAIN
              </span>
              <span className="text-xs text-gray-300 mt-2 font-mono font-medium">B · I · G SOLUTION</span>
            </motion.div>

            {/* Orbiting Satellite Node: B */}
            <motion.button
              onClick={() => setActiveStage(0)}
              animate={{
                scale: activeStage === 0 ? 1.15 : 1,
              }}
              whileHover={{ scale: 1.2 }}
              className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-16 h-16 rounded-full flex flex-col items-center justify-center font-bold text-sm shadow-lg transition-colors border-2 ${
                activeStage === 0 
                  ? 'bg-blue-600 text-white border-white ring-4 ring-blue-500/20' 
                  : 'bg-white text-gray-900 border-gray-200 hover:border-gray-400'
              }`}
            >
              <span className="text-lg font-black leading-none">B</span>
              <span className="text-[11px] font-bold mt-0.5">Buildup</span>
            </motion.button>

            {/* Orbiting Satellite Node: I */}
            <motion.button
              onClick={() => setActiveStage(1)}
              animate={{
                scale: activeStage === 1 ? 1.15 : 1,
              }}
              whileHover={{ scale: 1.2 }}
              className={`absolute bottom-4 right-1 w-16 h-16 rounded-full flex flex-col items-center justify-center font-bold text-sm shadow-lg transition-colors border-2 ${
                activeStage === 1 
                  ? 'bg-gray-900 text-white border-white ring-4 ring-gray-900/20' 
                  : 'bg-white text-gray-900 border-gray-200 hover:border-gray-400'
              }`}
            >
              <span className="text-lg font-black leading-none">I</span>
              <span className="text-[11px] font-bold mt-0.5">Insight</span>
            </motion.button>

            {/* Orbiting Satellite Node: G */}
            <motion.button
              onClick={() => setActiveStage(2)}
              animate={{
                scale: activeStage === 2 ? 1.15 : 1,
              }}
              whileHover={{ scale: 1.2 }}
              className={`absolute bottom-4 left-1 w-16 h-16 rounded-full flex flex-col items-center justify-center font-bold text-sm shadow-lg transition-colors border-2 ${
                activeStage === 2 
                  ? 'bg-emerald-600 text-white border-white ring-4 ring-emerald-500/20' 
                  : 'bg-white text-gray-900 border-gray-200 hover:border-gray-400'
              }`}
            >
              <span className="text-lg font-black leading-none">G</span>
              <span className="text-[11px] font-bold mt-0.5">Gains</span>
            </motion.button>
          </div>

          {/* Quick Stage Switcher Pills */}
          <div className="flex items-center gap-2 mt-6">
            {stages.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setActiveStage(idx)}
                className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all ${
                  activeStage === idx 
                    ? 'bg-gray-900 text-white shadow-sm' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {s.letter} · {s.name}
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Detailed Animated Value Stack */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white rounded-3xl p-6 md:p-8 border border-gray-200 shadow-xl relative overflow-hidden"
            >
              {/* Top Decorative Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gray-900 text-white flex items-center justify-center font-black text-2xl shadow-md">
                    {current.letter}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-blue-600 tracking-wider uppercase block mb-1">
                      {language === 'ko' ? current.tagKo : current.tagEn}
                    </span>
                    <h4 className="text-2xl font-black text-gray-900 leading-tight">
                      {current.name} <span className="text-sm font-semibold text-gray-500">({language === 'ko' ? current.subKo : current.subEn})</span>
                    </h4>
                  </div>
                </div>
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              <p className="text-sm md:text-base text-gray-700 mb-6 font-medium leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-200">
                {language === 'ko' ? current.summaryKo : current.summaryEn}
              </p>

              {/* Items List */}
              <div className="space-y-3">
                {(language === 'ko' ? current.itemsKo : current.itemsEn).map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm hover:border-blue-300 hover:shadow-md transition-all group flex items-start gap-3.5"
                  >
                    <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors mt-0.5">
                      <CheckCircle2 size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </h5>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1 leading-relaxed font-medium">
                        {item.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Bottom Synergy Footer */}
              <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between text-xs sm:text-sm text-gray-600 font-medium">
                <span>{language === 'ko' ? '다음 단계 연계' : 'Next Phase Flow'}</span>
                <span className="font-bold text-gray-900 inline-flex items-center gap-1">
                  {current.id === 0 ? "Insight (공간경험)" : current.id === 1 ? "Gains (수익회수)" : "Buildup (재투자)"}
                  <ChevronRight size={16} />
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
