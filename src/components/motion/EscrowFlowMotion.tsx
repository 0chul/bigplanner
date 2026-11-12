import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Landmark, FileText, CheckCircle2, Wallet, CreditCard, 
  Smartphone, ShieldCheck, Lock, ArrowRight, Sparkles, RefreshCw 
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export default function EscrowFlowMotion() {
  const { language } = useLanguage();
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);

  const steps = language === 'ko' ? [
    {
      num: 1,
      title: "회원가입 및 계좌개설",
      icon: Landmark,
      subtitle: "건설사/하도급업체 가입 및 건축주 전용계좌 개설",
      detail: "건축주, 시공사, 하도급업체가 시스템에 정식 등록되고, 자금 유용이 불가능한 '건축주 전용 에스크로 신탁계좌'를 개설합니다.",
      party: "건축주 & 금융기관 & 시공사",
      safetyBadge: "신탁 전용계좌 개설"
    },
    {
      num: 2,
      title: "기성 청구내역서 작성",
      icon: FileText,
      subtitle: "노무비닷컴 시스템에 기성 청구내역서 작성",
      detail: "시공사는 실제 공정률과 투입된 노무비, 자재비 명세를 증빙 서류와 함께 전자 시스템에 투명하게 청구 등록합니다.",
      party: "시공사 및 하청업체",
      safetyBadge: "전자 증빙 100% 검증"
    },
    {
      num: 3,
      title: "검토 및 감리 승인",
      icon: CheckCircle2,
      subtitle: "빅플래너 PM & 건축주 청구내역서 검토 후 승인/반려",
      detail: "빅플래너파트너스 현장 감리단이 실측 공정률과 청구 금액의 일치 여부를 대조 검토 후 승인 또는 반려 처리합니다.",
      party: "빅플래너 PM & 건축주",
      safetyBadge: "과다청구 원천 차단"
    },
    {
      num: 4,
      title: "기성대금 입금",
      icon: Wallet,
      subtitle: "승인된 금액을 전용계좌에 기성대금 지급 (현금이체)",
      detail: "건축주는 감리 승인이 완료된 정당한 공사 기성금액만을 에스크로 전용계좌로 입금합니다.",
      party: "건축주",
      safetyBadge: "에스크로 예치 보호"
    },
    {
      num: 5,
      title: "하도급대금 직불 이체",
      icon: CreditCard,
      subtitle: "입금된 기성대금을 하도급대금 및 노무비로 직접 이체",
      detail: "시공사를 거치지 않고 실제 일한 하도급 업체와 근로자 계좌로 시스템을 통해 직접 분할 이체 실행됩니다.",
      party: "에스크로 시스템 자동 실행",
      safetyBadge: "임금 체불 원천 봉쇄"
    },
    {
      num: 6,
      title: "지급내역 실시간 확인",
      icon: Smartphone,
      subtitle: "실시간 확인 · 시공사 임의해지 및 인출 제한",
      detail: "모든 입출금 내역은 스마트폰 앱으로 실시간 공유되며, 시공사의 임의 인출이나 압류가 법적으로 엄격히 제한됩니다.",
      party: "전 참여자 투명 확인",
      safetyBadge: "유치권/압류 리스크 제로"
    }
  ] : [
    {
      num: 1,
      title: "Sign Up & Open Account",
      icon: Landmark,
      subtitle: "Register builder/subcontractors & open dedicated escrow account",
      detail: "Client, general contractor, and subcontractors register in the system and open a protected escrow account where funds cannot be diverted.",
      party: "Client & Financial Institution",
      safetyBadge: "Dedicated Escrow Account"
    },
    {
      num: 2,
      title: "Submit Progress Billing",
      icon: FileText,
      subtitle: "Submit progress billing with itemized receipts via system",
      detail: "General contractor logs progress billing detailing labor, materials, and equipment backed by electronic verification.",
      party: "Contractor & Subcontractors",
      safetyBadge: "100% Electronic Receipts"
    },
    {
      num: 3,
      title: "Review & Approval",
      icon: CheckCircle2,
      subtitle: "BigPlanner PM & Client review and approve/reject statement",
      detail: "BigPlanner PM on-site supervisors audit the actual site progress against billing claims prior to client authorization.",
      party: "BigPlanner PM & Client",
      safetyBadge: "Prevents Overbilling"
    },
    {
      num: 4,
      title: "Deposit Progress Payment",
      icon: Wallet,
      subtitle: "Transfer approved progress payment to dedicated account",
      detail: "Client safely deposits only the verified, approved progress amount into the dedicated escrow holding account.",
      party: "Client",
      safetyBadge: "Escrow Deposit Shield"
    },
    {
      num: 5,
      title: "Direct Subcontract Transfer",
      icon: CreditCard,
      subtitle: "Direct electronic transfer to subcontractors & workers",
      detail: "Funds are directly disbursed from escrow to actual subcontractors and workers, bypassing general contractor diversion.",
      party: "Automated Escrow System",
      safetyBadge: "Zero Wage Arrears"
    },
    {
      num: 6,
      title: "Real-time Verification",
      icon: Smartphone,
      subtitle: "Real-time verification · Arbitrary withdrawal strictly prohibited",
      detail: "All transactions are logged in real time on mobile apps, with legal safeguards preventing contractor withdrawal or liens.",
      party: "All Stakeholders",
      safetyBadge: "Zero Lien & Seizure Risk"
    }
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, steps.length]);

  const current = steps[activeStep];

  return (
    <div className="max-w-6xl mx-auto py-8">
      {/* Control Strip */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            {language === 'ko' ? 'NICE D&R 노무비닷컴 에스크로 파이프라인' : 'NICE D&R Nomubi.com Escrow Pipeline'}
          </span>
        </div>

        <button
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-900 bg-white border border-gray-200 px-3 py-1.5 rounded-full shadow-sm transition-colors"
        >
          <RefreshCw size={12} className={isAutoPlaying ? "animate-spin" : ""} />
          <span>{isAutoPlaying ? (language === 'ko' ? '자동 재생 중' : 'Auto Playing') : (language === 'ko' ? '정지됨' : 'Paused')}</span>
        </button>
      </div>

      {/* 6 Step Pipeline Graphic Rail */}
      <div className="relative mb-8">
        {/* Connecting SVG Flow Line */}
        <div className="hidden lg:block absolute top-10 left-12 right-12 h-1 bg-gray-200 -z-0 rounded-full">
          <motion.div 
            className="h-full bg-gradient-to-r from-gray-900 via-blue-600 to-emerald-500 rounded-full"
            animate={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>

        {/* 6 Step Checkpoint Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 relative z-10">
          {steps.map((st, idx) => {
            const Icon = st.icon;
            const isSelected = activeStep === idx;
            const isPast = activeStep > idx;

            return (
              <motion.button
                key={st.num}
                onClick={() => {
                  setActiveStep(idx);
                  setIsAutoPlaying(false);
                }}
                whileHover={{ scale: 1.03 }}
                className={`p-3.5 rounded-2xl text-center transition-all duration-300 relative border flex flex-col items-center justify-between min-h-[140px] ${
                  isSelected
                    ? 'bg-gray-900 text-white shadow-xl border-gray-900 ring-2 ring-gray-900/10'
                    : isPast
                    ? 'bg-white text-gray-900 border-gray-300 shadow-sm'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                }`}
              >
                {/* Step badge */}
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-2 transition-colors ${
                  isSelected ? 'bg-white text-gray-900 shadow' : 'bg-gray-100 text-gray-700'
                }`}>
                  <Icon size={20} />
                </div>

                <div className="w-full">
                  <span className={`text-xs font-mono font-bold block mb-0.5 ${
                    isSelected ? 'text-blue-300' : 'text-gray-500'
                  }`}>
                    STEP 0{st.num}
                  </span>
                  <h6 className="font-extrabold text-xs sm:text-sm leading-tight line-clamp-2">
                    {st.title}
                  </h6>
                </div>

                <div className="mt-2 w-full pt-1.5 border-t border-gray-100/30 flex justify-center">
                  <span className={`text-xs font-mono font-bold ${
                    isSelected ? 'text-emerald-400' : 'text-gray-400'
                  }`}>
                    {isSelected ? 'ACTIVE' : `0${st.num}`}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Detail Inspector Card */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-xl p-6 md:p-8 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center"
          >
            {/* Left: Highlight Summary */}
            <div className="md:col-span-8 space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-gray-900 text-white font-mono font-bold text-xs flex items-center justify-center">
                  0{current.num}
                </span>
                <span className="text-xs sm:text-sm font-bold text-blue-600 uppercase tracking-wider">
                  {language === 'ko' ? '에스크로 단계별 안전통제' : 'Escrow Stage Safety Control'}
                </span>
              </div>

              <h4 className="text-xl md:text-2xl font-black text-gray-900 leading-tight">
                {current.title}
              </h4>

              <p className="text-sm md:text-base text-gray-700 leading-relaxed font-medium bg-gray-50 p-4 rounded-xl border border-gray-200">
                {current.detail}
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs sm:text-sm font-semibold text-gray-600">
                  {language === 'ko' ? '참여 주체:' : 'Involved Parties:'}
                </span>
                <span className="text-xs sm:text-sm font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded-md">
                  {current.party}
                </span>
              </div>
            </div>

            {/* Right: Security & Risk Shield Status */}
            <div className="md:col-span-4 bg-gradient-to-br from-gray-950 to-gray-800 text-white p-6 rounded-2xl shadow-lg border border-gray-800 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <ShieldCheck size={22} className="text-emerald-400" />
                  <span className="text-xs bg-white/10 text-emerald-300 px-2.5 py-1 rounded-full font-mono font-bold">
                    ESCROW LOCKED
                  </span>
                </div>
                <span className="text-xs text-gray-300 font-mono uppercase block">핵심 안전장치</span>
                <h5 className="text-base sm:text-lg font-bold text-white mt-1">
                  {current.safetyBadge}
                </h5>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 text-xs sm:text-sm text-gray-200 leading-relaxed">
                <div className="flex items-start gap-2">
                  <Lock size={14} className="text-amber-400 mt-0.5 flex-shrink-0" />
                  <span>
                    {language === 'ko'
                      ? "시공사의 임의 인출이 원천 차단되며, 하도급 업체에만 지정 지급됩니다."
                      : "General contractor cannot arbitrarily withdraw funds; direct distribution only."}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Escrow System Guarantee Notice */}
      <div className="mt-6 bg-gray-50 p-6 rounded-2xl border border-gray-200 text-center">
        <p className="text-xs md:text-sm text-gray-600 leading-relaxed font-medium">
          {language === 'ko' ? (
            <>
              모든 대금은 <strong className="text-gray-900 font-bold">NICE D&R 노무비닷컴</strong>의 에스크로 시스템을 통해 투명하게 관리되며,<br className="hidden sm:inline" />
              시공사의 임의 인출이 불가능하여 하도급 업체와 노무비의 안전한 지급을 100% 보장합니다.
            </>
          ) : (
            <>
              All payments are transparently managed through the escrow system of <strong className="text-gray-900 font-bold">NICE D&R Nomubi.com</strong>, and<br className="hidden sm:inline" />
              arbitrary withdrawal by the builder is strictly prevented, ensuring 100% safe payment of subcontractors and labor costs.
            </>
          )}
        </p>
      </div>
    </div>
  );
}
