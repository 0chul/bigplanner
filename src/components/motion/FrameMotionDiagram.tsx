import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, UserCheck, ShieldCheck, Sparkles, Building2, Compass, Layers, FileText, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export default function FrameMotionDiagram() {
  const { language } = useLanguage();
  const [filter, setFilter] = useState<'all' | 'realEstate' | 'cx'>('all');
  const [selectedNode, setSelectedNode] = useState<number | null>(null);

  const realEstateNodes = language === 'ko' ? [
    { id: 0, text: "부동산 최유효 이용방안 도출", tag: "UTILIZATION", desc: "해당 토지와 상권에서 가장 높은 가치를 창출할 수 있는 최적 용도 및 규모 설계" },
    { id: 1, text: "입지분석 및 사업타당성 검토", tag: "FEASIBILITY", desc: "주변 시세, 유동인구, 분양성, 임대수요 정량 분석 및 수지분석표 작성" },
    { id: 2, text: "부동산 투자 및 개발 자문", tag: "INVESTMENT", desc: "금융 조달(PF/대출), 사업구조화, 세무 및 개발 프로세스 전반의 전문가 자문" },
    { id: 3, text: "법적사항 및 세무자문", tag: "LEGAL & TAX", desc: "건축법, 지구단위계획, 인허가 규제 전수 검토 및 취득/보유/양도세 절세 플랜" }
  ] : [
    { id: 0, text: "Derive Optimal Real Estate Usage", tag: "UTILIZATION", desc: "Designing optimal use and scale that creates the highest value in target site" },
    { id: 1, text: "Location Analysis & Feasibility", tag: "FEASIBILITY", desc: "Quantitative analysis of market rent, foot traffic, absorption & cashflow" },
    { id: 2, text: "Real Estate Investment Advisory", tag: "INVESTMENT", desc: "Financing structuring (PF/loans), equity design & full project advisory" },
    { id: 3, text: "Legal & Tax Advisory", tag: "LEGAL & TAX", desc: "100% review of zoning, building codes, permits & tax mitigation plan" }
  ];

  const cxNodes = language === 'ko' ? [
    { id: 4, text: "Customer Experience (CEM)", tag: "EXPERIENCE", desc: "이용자 관점의 총체적 공간 경험 설계로 재방문율과 충성도 극대화" },
    { id: 5, text: "Scape Identity Strategy", tag: "IDENTITY", desc: "차별화된 공간 정체성과 건축적 브랜딩으로 자산 인지도 프리미엄 창출" },
    { id: 6, text: "Service Design & Journey Map", tag: "JOURNEY", desc: "진입부터 퇴장까지 공간 이용자의 동선과 서비스 터치포인트 최적화" },
    { id: 7, text: "Nudge Service Solution", tag: "NUDGE", desc: "자연스러운 행동 유도로 체류시간을 늘리고 상가 매출을 진작시키는 공간 심리 솔루션" }
  ] : [
    { id: 4, text: "Customer Experience (CEM)", tag: "EXPERIENCE", desc: "Holistic space experience design maximizing return visits and client loyalty" },
    { id: 5, text: "Scape Identity Strategy", tag: "IDENTITY", desc: "Establishing differentiated spatial identity and architectural branding" },
    { id: 6, text: "Service Design & Journey Map", tag: "JOURNEY", desc: "Optimizing circulation paths and operational touchpoints from entry to exit" },
    { id: 7, text: "Nudge Service Solution", tag: "NUDGE", desc: "Behavioral nudges extending dwell time and elevating commercial sales" }
  ];

  const allNodes = [...realEstateNodes, ...cxNodes];

  return (
    <div className="relative max-w-6xl mx-auto py-8">
      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            {language === 'ko' ? '8대 전문 분석 매트릭스' : '8 Specialized Analytical Matrices'}
          </span>
        </div>

        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filter === 'all' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            {language === 'ko' ? '전체 보기 (8개)' : 'All (8)'}
          </button>
          <button
            onClick={() => setFilter('realEstate')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filter === 'realEstate' ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            {language === 'ko' ? '투자·개발 자문' : 'Investment & Feasibility'}
          </button>
          <button
            onClick={() => setFilter('cx')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filter === 'cx' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            {language === 'ko' ? '공간가치 & CEM' : 'Space Value & CEM'}
          </button>
        </div>
      </div>

      {/* Main Interactive Framework Loop */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-xl p-6 md:p-12 relative overflow-hidden">
        {/* Background circuit grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px] opacity-40 pointer-events-none" />

        {/* Top Request Beam */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent flex-1" />
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold bg-blue-50 text-blue-700 border border-blue-200 shadow-sm">
            <Sparkles size={14} />
            {language === 'ko' ? 'STEP 1: 고객의 컨설팅 의뢰' : 'STEP 1: Client Consulting Request'}
            <ArrowRight size={14} />
          </span>
          <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent flex-1" />
        </div>

        {/* Core Layout: Client <---> 8 Matrices <---> BigPlanner */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
          
          {/* Left: Client Node */}
          <div className="lg:col-span-3 flex flex-col items-center justify-center">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="w-40 h-40 md:w-48 md:h-48 rounded-full bg-gradient-to-br from-white to-gray-50 border-4 border-gray-200 shadow-xl flex flex-col items-center justify-center text-center p-4 relative group"
            >
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-2 text-gray-800 group-hover:bg-gray-900 group-hover:text-white transition-colors">
                <UserCheck size={24} />
              </div>
              <span className="text-xs uppercase tracking-widest text-gray-500 font-bold">CLIENT</span>
              <span className="font-extrabold text-lg md:text-xl text-gray-900">
                {language === 'ko' ? '고객 (건축주)' : 'Client (Owner)'}
              </span>
              <span className="text-xs text-gray-600 mt-1 font-medium">
                {language === 'ko' ? '부동산 가치 극대화 의뢰' : 'Request Value Growth'}
              </span>
            </motion.div>
          </div>

          {/* Center: 8 Specialized Matrices Grid */}
          <div className="lg:col-span-6 space-y-4">
            
            {/* Top Row: Real Estate Feasibility & Legal */}
            {(filter === 'all' || filter === 'realEstate') && (
              <div>
                <span className="text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wider block mb-2 px-1">
                  {language === 'ko' ? '1. 부동산 투자 및 타당성 분석' : '1. Feasibility & Legal Analysis'}
                </span>
                <div className="grid grid-cols-2 gap-2.5">
                  {realEstateNodes.map((node) => {
                    const isSelected = selectedNode === node.id;
                    return (
                      <motion.button
                        key={node.id}
                        onClick={() => setSelectedNode(isSelected ? null : node.id)}
                        whileHover={{ scale: 1.02 }}
                        className={`p-3.5 rounded-2xl text-left transition-all border text-xs sm:text-sm ${
                          isSelected 
                            ? 'bg-gray-900 text-white border-gray-900 shadow-lg ring-2 ring-gray-900/10' 
                            : 'bg-gray-900 text-gray-100 hover:bg-gray-800 border-gray-800 shadow'
                        }`}
                      >
                        <span className="text-xs font-mono text-gray-300 block mb-1 uppercase tracking-wider font-semibold">
                          {node.tag}
                        </span>
                        <span className="font-bold block leading-snug">
                          {node.text}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Bottom Row: Customer Experience & Service Design */}
            {(filter === 'all' || filter === 'cx') && (
              <div>
                <span className="text-xs sm:text-sm font-bold text-blue-600 uppercase tracking-wider block mb-2 px-1">
                  {language === 'ko' ? '2. 공간가치 창출 및 고객경험(CEM)' : '2. Space Value & CEM Design'}
                </span>
                <div className="grid grid-cols-2 gap-2.5">
                  {cxNodes.map((node) => {
                    const isSelected = selectedNode === node.id;
                    return (
                      <motion.button
                        key={node.id}
                        onClick={() => setSelectedNode(isSelected ? null : node.id)}
                        whileHover={{ scale: 1.02 }}
                        className={`p-3.5 rounded-2xl text-left transition-all border text-xs sm:text-sm ${
                          isSelected 
                            ? 'bg-blue-600 text-white border-blue-600 shadow-lg ring-2 ring-blue-500/20' 
                            : 'bg-blue-700 text-white hover:bg-blue-600 border-blue-600 shadow'
                        }`}
                      >
                        <span className="text-xs font-mono text-blue-100 block mb-1 uppercase tracking-wider font-semibold">
                          {node.tag}
                        </span>
                        <span className="font-bold block leading-snug">
                          {node.text}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right: BigPlanner Partners Node */}
          <div className="lg:col-span-3 flex flex-col items-center justify-center">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="w-40 h-40 md:w-48 md:h-48 rounded-full bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 border-4 border-white shadow-2xl flex flex-col items-center justify-center text-center p-4 text-white relative group"
            >
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-2 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                <ShieldCheck size={24} />
              </div>
              <span className="text-xs uppercase tracking-widest text-blue-400 font-bold">PROPTECH PM</span>
              <span className="font-extrabold text-lg md:text-xl tracking-tight leading-tight">
                {language === 'ko' ? '빅플래너파트너스' : 'BIGPLANNER'}
              </span>
              <span className="text-xs text-gray-300 mt-1 font-medium">
                {language === 'ko' ? '통합 솔루션 제공' : 'Integrated Advisory'}
              </span>
            </motion.div>
          </div>

        </div>

        {/* Selected Node Details Box */}
        <AnimatePresence>
          {selectedNode !== null && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              className="bg-gray-50 border border-gray-200 rounded-2xl p-5 relative z-10"
            >
              {(() => {
                const node = allNodes.find(n => n.id === selectedNode);
                if (!node) return null;
                return (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-gray-900 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle2 size={16} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold bg-gray-200 text-gray-800 px-2.5 py-0.5 rounded">
                            {node.tag}
                          </span>
                          <h6 className="font-bold text-gray-900 text-base">{node.text}</h6>
                        </div>
                        <p className="text-sm text-gray-700 mt-1 leading-relaxed">{node.desc}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedNode(null)}
                      className="text-xs text-gray-500 hover:text-gray-900 font-bold px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200"
                    >
                      {language === 'ko' ? '닫기' : 'Close'}
                    </button>
                  </div>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Delivery Beam */}
        <div className="flex items-center justify-center gap-2 mt-8">
          <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent flex-1" />
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-sm">
            <FileText size={14} />
            {language === 'ko' ? 'STEP 2: 정밀 검토 보고서 작성 및 최적 솔루션 제출' : 'STEP 2: Feasibility Report & Actionable Solution Delivery'}
            <ArrowRight size={14} />
          </span>
          <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent flex-1" />
        </div>

      </div>
    </div>
  );
}
