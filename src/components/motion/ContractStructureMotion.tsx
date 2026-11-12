import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AlertTriangle, ShieldCheck, X, CheckCircle2, 
  ArrowRight, Landmark, HardHat, Users, Lock, Sparkles 
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export default function ContractStructureMotion() {
  const { language } = useLanguage();
  const [activeMode, setActiveMode] = useState<'comparison' | 'traditional' | 'bigplanner'>('comparison');

  const traditionalRisks = language === 'ko' ? [
    { title: "하도급 계약 관여 불가", desc: "건축주는 시공사와만 계약하므로 하청 업체의 부실이나 단가 조작에 관여 불가능" },
    { title: "공사비 유용 및 지연 지급", desc: "지급한 공사비가 타 현장으로 전용되거나 하도급 지급이 지연되는 사고 빈발" },
    { title: "유치권 행사 및 공사 중단", desc: "하청업체 미지급 발생 시 현장 점거, 유치권 행사로 건축주 재산권 압류 위기" },
    { title: "하자 보수 책임 회피", desc: "준공 후 시공사 또는 하청업체 폐업 시 하자보수를 전적으로 건축주가 부담" }
  ] : [
    { title: "No Subcontract Control", desc: "Client only signs with general builder; cannot oversee subcontract quality or pricing" },
    { title: "Fund Misappropriation", desc: "Paid funds frequently diverted to other projects, causing subcontractor payment delays" },
    { title: "Lien Seizure & Stoppage", desc: "Unpaid subs seize site and exercise liens, freezing client property rights" },
    { title: "Defect Responsibility Shift", desc: "If builder dissolves post-completion, client absorbs all defect repair liabilities" }
  ];

  const bigplannerSolutions = language === 'ko' ? [
    { title: "신축 계약 일원화", desc: "빅플래너파트너스와의 통합 계약을 바탕으로 설계·시공·감리 모든 계약을 일원화 통제" },
    { title: "에스크로(Escrow) 직불제", desc: "공사대금이 시공사를 거치지 않고 하도급 업체 및 노무자 계좌로 직접 투명하게 분할 이체" },
    { title: "1군급 책임준공 체계", desc: "1군 대형 건설사 수준의 책임준공 확약 및 엄격한 우량 시공업체 Pool 경쟁입찰 선정" },
    { title: "유치권 포기 및 연대보증 완비", desc: "하도급 전원 유치권 포기각서 징구 및 시공대표자 개인 연대보증으로 리스크 원천 봉쇄" }
  ] : [
    { title: "Unified Contract Agency", desc: "Consolidates design, construction, and permits under BigPlanner's unified supervision" },
    { title: "Direct Escrow Settlement", desc: "Payments bypass contractor diversion and disburse directly to subs & workers via escrow" },
    { title: "Tier-1 Reliable Completion", desc: "Tier-1 enterprise level completion guarantees & vetted contractor pool bidding" },
    { title: "Lien Waiver & Joint Guarantee", desc: "Pre-execution lien waivers from all subs & personal guarantees from builder reps" }
  ];

  return (
    <div className="max-w-6xl mx-auto py-6">
      {/* Mode Switcher Buttons */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            {language === 'ko' ? '시공계약 구조 대조 모션' : 'Contract Structure Comparison'}
          </span>
        </div>

        <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveMode('comparison')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeMode === 'comparison' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            {language === 'ko' ? '전체 비교' : 'Side-by-Side'}
          </button>
          <button
            onClick={() => setActiveMode('traditional')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeMode === 'traditional' ? 'bg-rose-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            {language === 'ko' ? '일반 계약 구조 (위험)' : 'Traditional'}
          </button>
          <button
            onClick={() => setActiveMode('bigplanner')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeMode === 'bigplanner' ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            {language === 'ko' ? '빅플래너 구조 (안전)' : 'BigPlanner Escrow'}
          </button>
        </div>
      </div>

      {/* Main Comparison Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        
        {/* Left: Traditional Contract (The Big Risk) */}
        {(activeMode === 'comparison' || activeMode === 'traditional') && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className={`bg-white p-7 md:p-10 rounded-3xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
              activeMode === 'traditional' ? 'lg:col-span-2 max-w-4xl mx-auto border-rose-400 ring-4 ring-rose-500/10 shadow-xl' : 'border-rose-200/80 shadow-md'
            }`}
          >
            {/* Top Risk Badge */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold bg-rose-50 text-rose-700 border border-rose-200">
                  <AlertTriangle size={15} />
                  <span>{language === 'ko' ? '고위험 단절 구조' : 'HIGH RISK FRAGMENTED'}</span>
                </span>
                <span className="text-xs sm:text-sm text-rose-600 font-mono font-bold">UNPROTECTED</span>
              </div>

              <h4 className="text-xl md:text-2xl font-black text-gray-900 mb-2">
                {language === 'ko' ? '일반적인 시공계약구조' : 'General Construction Contract Structure'}
              </h4>
              <p className="text-xs sm:text-sm text-gray-600 mb-6 font-medium leading-relaxed">
                {language === 'ko'
                  ? '건축주는 시공사만 통제 가능하여, 하도급 임금 체불이나 유치권 발생 시 속수무책 피해'
                  : 'Client only has recourse against general builder; helpless against lien claims & subcontractor defaults'}
              </p>

              {/* Traditional Flowchart Stream */}
              <div className="bg-rose-50/70 p-4 rounded-2xl border border-rose-200 mb-6 space-y-2 text-xs sm:text-sm font-semibold">
                <div className="flex items-center justify-between text-gray-800">
                  <span className="flex items-center gap-1.5"><Users size={16} /> 건축주(Client)</span>
                  <ArrowRight size={16} className="text-rose-400" />
                  <span className="flex items-center gap-1.5"><HardHat size={16} /> 시공사(건설사)</span>
                  <ArrowRight size={16} className="text-rose-400" />
                  <span className="text-rose-700 font-bold">하도급업체 (단절)</span>
                </div>
                <div className="text-xs text-rose-700 pt-1 font-semibold">
                  ⚠ 시공사의 공사비 전용 시 하도급 미지급 및 공사 중단 직결
                </div>
              </div>

              {/* Problem Bullets */}
              <div className="space-y-3">
                {traditionalRisks.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 text-xs sm:text-sm text-gray-700">
                    <div className="w-6 h-6 rounded-md bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <X size={15} />
                    </div>
                    <div>
                      <span className="font-bold text-gray-900 block leading-tight text-sm sm:text-base">{item.title}</span>
                      <span className="text-gray-600 leading-relaxed text-xs sm:text-sm mt-0.5 block">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-rose-100 text-xs sm:text-sm text-rose-800 font-bold text-center">
              {language === 'ko' ? '결과: 준공 지연, 공사비 분쟁, 법적 소송 위험 노출' : 'Result: Construction stoppage, extra costs & legal disputes'}
            </div>
          </motion.div>
        )}

        {/* Right: BigPlanner Safe Contract (The Solution) */}
        {(activeMode === 'comparison' || activeMode === 'bigplanner') && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className={`bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-white p-7 md:p-10 rounded-3xl shadow-2xl relative overflow-hidden flex flex-col justify-between border border-gray-800 ${
              activeMode === 'bigplanner' ? 'lg:col-span-2 max-w-4xl mx-auto ring-4 ring-blue-500/20' : ''
            }`}
          >
            {/* Background Glow */}
            <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Top Solution Badge */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <ShieldCheck size={15} />
                  <span>{language === 'ko' ? '에스크로 통합 안전망' : 'ESCROW UNIFIED PROTECTION'}</span>
                </span>
                <span className="text-xs sm:text-sm text-emerald-400 font-mono font-bold">100% SECURE</span>
              </div>

              <h4 className="text-xl md:text-2xl font-black text-white mb-2">
                {language === 'ko' ? '빅플래너파트너스 시공계약구조' : 'BIGPLANNER PARTNERS Construction Contract Structure'}
              </h4>
              <p className="text-xs sm:text-sm text-gray-300 mb-6 font-medium leading-relaxed">
                {language === 'ko'
                  ? '빅플래너의 총괄 PM 안전계약과 노무비닷컴 에스크로 직불 체계로 분쟁 가능성을 원천 차단'
                  : 'Consolidated PM contract with Nomubi.com escrow direct payment completely prevents disputes'}
              </p>

              {/* BigPlanner Flowchart Stream */}
              <div className="bg-white/10 p-4 rounded-2xl border border-white/15 mb-6 space-y-2 text-xs sm:text-sm font-semibold text-white">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><Users size={16} /> 건축주</span>
                  <ArrowRight size={16} className="text-blue-400" />
                  <span className="flex items-center gap-1.5 text-blue-300 font-bold">빅플래너 일원화</span>
                  <ArrowRight size={16} className="text-emerald-400" />
                  <span className="flex items-center gap-1.5 text-emerald-300"><Lock size={14} /> 에스크로 직불</span>
                </div>
                <div className="text-xs text-emerald-300 pt-1 font-semibold">
                  ✓ 시공사 임의 인출 불가 · 하도급 및 노무비 100% 안전 직불 보장
                </div>
              </div>

              {/* Solution Bullets */}
              <div className="space-y-3">
                {bigplannerSolutions.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 text-xs sm:text-sm text-gray-200">
                    <div className="w-6 h-6 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 size={15} />
                    </div>
                    <div>
                      <span className="font-bold text-white block leading-tight text-sm sm:text-base">{item.title}</span>
                      <span className="text-gray-300 leading-relaxed text-xs sm:text-sm mt-0.5 block">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 text-xs sm:text-sm text-emerald-400 font-bold text-center">
              {language === 'ko' ? '결과: 공기 준수, 시공품질 극대화, 1군급 책임준공 안전성 보장' : 'Result: Strict schedule adherence, maximized quality & reliable completion'}
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}
