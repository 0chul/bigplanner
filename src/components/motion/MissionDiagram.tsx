import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TrendingUp, Building2, Target, Lightbulb, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export default function MissionDiagram() {
  const { language } = useLanguage();
  const [activeNode, setActiveNode] = useState<number | null>(null);

  const missions = [
    {
      id: 0,
      icon: TrendingUp,
      titleKo: "수익 극대화",
      titleEn: "Profit Maximization",
      descKo: "중소형 부동산의 투자수익 극대화\n사업개발 및 안정적인 사업운영 지원",
      descEn: "Maximizing investment returns for small/medium real estate\nSupporting business development and stable operations",
      detailKo: "시장 데이터 기반의 정밀한 사업수지 분석과 리스크 통제를 통해 고객의 실질 투자수익률을 극대화합니다.",
      detailEn: "We maximize real returns through data-driven feasibility analysis and proactive risk control.",
      tagKo: "FINANCE & RETURN",
      tagEn: "FINANCE & RETURN",
      pos: "top-left",
      angle: -135,
    },
    {
      id: 1,
      icon: Building2,
      titleKo: "공간기획 제안",
      titleEn: "Space Planning",
      descKo: "최적의 사업수지를 확보할 수 있는\n공간기획 제안",
      descEn: "Proposing space planning that secures\noptimal business feasibility",
      detailKo: "단순 설계를 넘어 상권 분석과 임차 수요에 최적화된 맞춤형 공간 MD 및 평면 구성을 제안합니다.",
      detailEn: "Custom space MD and layout configurations optimized for commercial demand and tenant requirements.",
      tagKo: "SPACE & ARCHITECTURE",
      tagEn: "SPACE & ARCHITECTURE",
      pos: "top-right",
      angle: -45,
    },
    {
      id: 2,
      icon: Target,
      titleKo: "전문가 네트워크",
      titleEn: "Expert Network",
      descKo: "각 분야 전문가들의 네트워크를\n기반으로 사업 완수",
      descEn: "Completing projects based on\na network of experts in each field",
      detailKo: "건축사, 구조기술사, 시공사, 세무/회계사, 금융기관으로 구성된 1등급 협력 네트워크가 원스톱으로 지원합니다.",
      detailEn: "Grade-1 partner network comprising architects, structural engineers, builders, tax advisors, and banks.",
      tagKo: "COLLABORATION",
      tagEn: "COLLABORATION",
      pos: "bottom-left",
      angle: 135,
    },
    {
      id: 3,
      icon: Lightbulb,
      titleKo: "최적 솔루션",
      titleEn: "Best Solution",
      descKo: "고객의 선택이 최고의 결과를\n만들 수 있는 솔루션 제공",
      descEn: "Providing solutions where clients' choices\ncreate the best results",
      detailKo: "건축주의 복잡한 의사결정 순간마다 명확한 데이터와 비교 지표를 제공하여 실패 없는 결정을 돕습니다.",
      detailEn: "Providing actionable data and benchmarks at critical decision junctures for flawless execution.",
      tagKo: "INTELLIGENT PM",
      tagEn: "INTELLIGENT PM",
      pos: "bottom-right",
      angle: 45,
    },
  ];

  return (
    <div className="relative max-w-5xl mx-auto py-8">
      {/* Interactive Helper Hint */}
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
          <Sparkles size={13} className="text-gray-900" />
          {language === 'ko' ? '각 미션 노드를 클릭하거나 마우스를 올려보세요' : 'Click or hover each mission node to view details'}
        </span>
      </div>

      {/* Desktop / Tablet Orbital Motion Graphics */}
      <div className="relative hidden md:block min-h-[580px]">
        {/* Background Radial Glow & Grid */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[520px] h-[520px] rounded-full bg-gradient-to-tr from-gray-100/80 via-blue-50/30 to-gray-50/50 blur-3xl -z-10" />
        </div>

        {/* Dynamic SVG Connection Rings and Pulsing Rays */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none -z-0" viewBox="0 0 800 580" fill="none">
          <defs>
            <linearGradient id="orbitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#111827" stopOpacity="0.25" />
              <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#111827" stopOpacity="0.25" />
            </linearGradient>
            <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1e293b" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#1e293b" stopOpacity="0" />
            </radialGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Concentric Orbital Rings */}
          <circle cx="400" cy="290" r="160" stroke="#e5e7eb" strokeWidth="1.5" strokeDasharray="6 6" />
          <motion.circle 
            cx="400" 
            cy="290" 
            r="230" 
            stroke="url(#orbitGrad)" 
            strokeWidth="1.5"
            strokeDasharray="8 8"
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "400px 290px" }}
          />
          <circle cx="400" cy="290" r="280" stroke="#f3f4f6" strokeWidth="1" />

          {/* Diagonal Laser Rays from Center to Nodes */}
          {/* Top-Left: (400,290) -> (190, 110) */}
          <motion.line 
            x1="400" y1="290" x2="210" y2="120"
            stroke={activeNode === 0 ? "#111827" : "#e2e8f0"}
            strokeWidth={activeNode === 0 ? "2.5" : "1.5"}
            strokeDasharray={activeNode === 0 ? "none" : "4 4"}
            transition={{ duration: 0.3 }}
          />
          {/* Top-Right: (400,290) -> (600, 110) */}
          <motion.line 
            x1="400" y1="290" x2="590" y2="120"
            stroke={activeNode === 1 ? "#111827" : "#e2e8f0"}
            strokeWidth={activeNode === 1 ? "2.5" : "1.5"}
            strokeDasharray={activeNode === 1 ? "none" : "4 4"}
            transition={{ duration: 0.3 }}
          />
          {/* Bottom-Left: (400,290) -> (210, 460) */}
          <motion.line 
            x1="400" y1="290" x2="210" y2="460"
            stroke={activeNode === 2 ? "#111827" : "#e2e8f0"}
            strokeWidth={activeNode === 2 ? "2.5" : "1.5"}
            strokeDasharray={activeNode === 2 ? "none" : "4 4"}
            transition={{ duration: 0.3 }}
          />
          {/* Bottom-Right: (400,290) -> (590, 460) */}
          <motion.line 
            x1="400" y1="290" x2="590" y2="460"
            stroke={activeNode === 3 ? "#111827" : "#e2e8f0"}
            strokeWidth={activeNode === 3 ? "2.5" : "1.5"}
            strokeDasharray={activeNode === 3 ? "none" : "4 4"}
            transition={{ duration: 0.3 }}
          />

          {/* Traveling energy pulses on active or idle lines */}
          <motion.circle
            r="4"
            fill="#111827"
            filter="url(#glow)"
            animate={{
              cx: activeNode === 0 ? [400, 210] : activeNode === 1 ? [400, 590] : activeNode === 2 ? [400, 210] : [400, 590],
              cy: activeNode === 0 ? [290, 120] : activeNode === 1 ? [290, 120] : activeNode === 2 ? [290, 460] : [290, 460],
              opacity: [0, 1, 0]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </svg>

        {/* Central Core Hub */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="relative w-52 h-52 rounded-full bg-gradient-to-b from-gray-950 via-gray-900 to-gray-800 text-white flex flex-col items-center justify-center p-6 text-center shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] border-4 border-white cursor-pointer group"
          >
            {/* Spinning decorative ring */}
            <motion.div 
              className="absolute inset-[-8px] rounded-full border-2 border-dashed border-gray-400/40"
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            />
            {/* Pulsing breathing aura */}
            <motion.div 
              className="absolute inset-0 rounded-full bg-blue-500/10 blur-xl pointer-events-none"
              animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="relative z-10 flex flex-col items-center">
              <span className="text-xs uppercase tracking-wider text-blue-400 font-bold mb-1">PROPTECH HUB</span>
              <span className="font-extrabold text-2xl tracking-tight text-white group-hover:text-blue-300 transition-colors">
                BIGPLANNER
              </span>
              <span className="text-sm font-semibold tracking-wider text-gray-200 mt-0.5">
                PARTNERS
              </span>
              <div className="mt-3 pt-2.5 border-t border-white/20 w-full flex items-center justify-center gap-2 text-xs text-gray-200 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>{language === 'ko' ? '가치창출 시스템' : 'Value Core'}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* 4 Satellite Mission Nodes */}
        {/* Top-Left */}
        <div className="absolute top-4 left-4 lg:left-8 z-10 w-[300px]">
          <SatelliteCard 
            mission={missions[0]} 
            isActive={activeNode === 0} 
            onHover={() => setActiveNode(0)} 
            onLeave={() => setActiveNode(null)} 
            language={language}
          />
        </div>

        {/* Top-Right */}
        <div className="absolute top-4 right-4 lg:right-8 z-10 w-[300px]">
          <SatelliteCard 
            mission={missions[1]} 
            isActive={activeNode === 1} 
            onHover={() => setActiveNode(1)} 
            onLeave={() => setActiveNode(null)} 
            language={language}
          />
        </div>

        {/* Bottom-Left */}
        <div className="absolute bottom-4 left-4 lg:left-8 z-10 w-[300px]">
          <SatelliteCard 
            mission={missions[2]} 
            isActive={activeNode === 2} 
            onHover={() => setActiveNode(2)} 
            onLeave={() => setActiveNode(null)} 
            language={language}
          />
        </div>

        {/* Bottom-Right */}
        <div className="absolute bottom-4 right-4 lg:right-8 z-10 w-[300px]">
          <SatelliteCard 
            mission={missions[3]} 
            isActive={activeNode === 3} 
            onHover={() => setActiveNode(3)} 
            onLeave={() => setActiveNode(null)} 
            language={language}
          />
        </div>
      </div>

      {/* Mobile Flow View (Connected dynamic track) */}
      <div className="md:hidden space-y-4">
        {/* Mobile Center Hub Banner */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-5 rounded-2xl shadow-lg border border-gray-700 text-center relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-blue-500/10 rounded-full blur-xl" />
          <span className="text-xs tracking-wider text-blue-400 font-bold uppercase block mb-1">PROPTECH CORE</span>
          <h5 className="text-xl font-bold">BIGPLANNER PARTNERS</h5>
          <p className="text-sm text-gray-200 mt-1">부동산과 공간 가치를 높이는 프롭테크 기업</p>
        </div>

        {/* Step-by-step connected rail */}
        <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-4 before:bottom-4 before:w-0.5 before:bg-gradient-to-b before:from-gray-900 before:via-blue-500 before:to-gray-300">
          {missions.map((m, idx) => {
            const Icon = m.icon;
            const isSelected = activeNode === idx;
            return (
              <motion.div
                key={m.id}
                onClick={() => setActiveNode(isSelected ? null : idx)}
                className={`relative bg-white p-5 rounded-2xl border transition-all duration-300 shadow-sm ${
                  isSelected ? 'border-gray-900 ring-2 ring-gray-900/10 shadow-md' : 'border-gray-200'
                }`}
              >
                {/* Rail Dot */}
                <span className={`absolute -left-[23px] top-6 w-3 h-3 rounded-full border-2 border-white transition-colors ${
                  isSelected ? 'bg-gray-900 ring-4 ring-gray-900/20' : 'bg-gray-400'
                }`} />

                <div className="flex items-start gap-3.5">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                    isSelected ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'
                  }`}>
                    <Icon size={22} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-bold text-blue-600 tracking-wider uppercase block">
                      {language === 'ko' ? m.tagKo : m.tagEn}
                    </span>
                    <h6 className="text-base font-bold text-gray-900 mt-0.5">
                      {language === 'ko' ? m.titleKo : m.titleEn}
                    </h6>
                    <p className="text-sm text-gray-700 mt-1 whitespace-pre-line leading-relaxed font-medium">
                      {language === 'ko' ? m.descKo : m.descEn}
                    </p>
                  </div>
                </div>

                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3.5 pt-3.5 border-t border-gray-100 text-sm text-gray-800 bg-gray-50 p-3.5 rounded-xl"
                    >
                      <div className="flex items-start gap-2 font-medium">
                        <CheckCircle2 size={16} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                        <span>{language === 'ko' ? m.detailKo : m.detailEn}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function SatelliteCard({ 
  mission, 
  isActive, 
  onHover, 
  onLeave, 
  language 
}: { 
  mission: any; 
  isActive: boolean; 
  onHover: () => void; 
  onLeave: () => void; 
  language: string;
}) {
  const Icon = mission.icon;
  return (
    <motion.div
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onHover}
      animate={{
        y: isActive ? -6 : 0,
        scale: isActive ? 1.03 : 1,
      }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 relative bg-white border ${
        isActive 
          ? 'shadow-2xl border-gray-900 ring-2 ring-gray-900/10' 
          : 'shadow-md border-gray-200 hover:border-gray-400 hover:shadow-lg'
      }`}
    >
      {/* Top Tag & Indicator */}
      <div className="flex items-center justify-between mb-3">
        <span className={`text-xs font-bold tracking-wider px-2.5 py-1 rounded-full uppercase transition-colors ${
          isActive ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700'
        }`}>
          {language === 'ko' ? mission.tagKo : mission.tagEn}
        </span>
        <div className={`w-2.5 h-2.5 rounded-full transition-colors ${
          isActive ? 'bg-emerald-500 animate-pulse' : 'bg-gray-300'
        }`} />
      </div>

      {/* Icon + Title */}
      <div className="flex items-center gap-3 mb-2.5">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
          isActive ? 'bg-gray-900 text-white shadow-md' : 'bg-gray-100 text-gray-900'
        }`}>
          <Icon size={24} />
        </div>
        <div>
          <h5 className="font-bold text-gray-900 text-lg leading-tight">
            {language === 'ko' ? mission.titleKo : mission.titleEn}
          </h5>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed font-medium mt-2">
        {language === 'ko' ? mission.descKo : mission.descEn}
      </p>

      {/* Dynamic Detail Reveal */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 14 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.2 }}
            className="pt-3.5 border-t border-gray-100 text-xs md:text-sm text-gray-800 leading-relaxed bg-gray-50 p-3 rounded-xl font-medium"
          >
            <div className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-emerald-600 mt-0.5 flex-shrink-0" />
              <span>{language === 'ko' ? mission.detailKo : mission.detailEn}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
