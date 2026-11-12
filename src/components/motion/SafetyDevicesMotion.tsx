import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileSignature, ShieldCheck, Banknote, CheckSquare, 
  Wallet, AlertCircle, FileText, Users, Lock, Sparkles, CheckCircle2 
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export default function SafetyDevicesMotion() {
  const { language } = useLanguage();
  const [activeDevice, setActiveDevice] = useState<number>(0);

  const devices = language === 'ko' ? [
    { 
      num: 1, 
      title: 'NICE다큐 전자계약', 
      desc: '모든 계약은 공인인증 기반 전자계약으로 안전하게 체결', 
      icon: FileSignature,
      protectsAgainst: '계약서 위변조 및 이중계약 원천 방지',
      legalEffect: '법적 공증 효력 및 공인전자서명 기록 보관'
    },
    { 
      num: 2, 
      title: '계약이행 보증증권', 
      desc: '시공사의 계약 불이행 및 중도 타절 시 공사비 보증', 
      icon: ShieldCheck,
      protectsAgainst: '시공사 부도 또는 공사 포기 시 금융 손실 보전',
      legalEffect: '보증보험사 직접 청구로 즉시 대체 시공비 수령'
    },
    { 
      num: 3, 
      title: '선급금 보증증권', 
      desc: '선급금 유용 및 횡령 시 전액 손해보상 담보', 
      icon: Banknote,
      protectsAgainst: '착공 전 지급한 착수금의 부당 전용 방지',
      legalEffect: '미정산 선급금 발생 시 서울보증보험 등에서 100% 환급'
    },
    { 
      num: 4, 
      title: '하자이행 보증증권', 
      desc: '준공 후 법정 하자담보책임기간(최대 10년) 철저 보증', 
      icon: CheckSquare,
      protectsAgainst: '준공 후 누수, 균열 등 발생 시 시공사 폐업 대비',
      legalEffect: '보증보험 청구로 하자보수 비용 전액 무상 처리'
    },
    { 
      num: 5, 
      title: '준공보수 예치금', 
      desc: '잔금 정산 전 하자처리 및 미비사항 대비 현금 예치', 
      icon: Wallet,
      protectsAgainst: '준공 직후 잔여 미비공사 처리 지연 예방',
      legalEffect: '건축주가 예치금으로 직권 보수 후 정산 처리'
    },
    { 
      num: 6, 
      title: '지체보상금 약정', 
      desc: '준공기한 지연 시 1일당 약정 지체상금 공제', 
      icon: AlertCircle,
      protectsAgainst: '공기 지연에 따른 금융이자 및 임대료 손실 보상',
      legalEffect: '도급공사비 잔금에서 일할 계산 공제 집행'
    },
    { 
      num: 7, 
      title: '유치권 포기각서', 
      desc: '시공사 및 모든 하도급 업체의 유치권 포기 확약서 징구', 
      icon: FileText,
      protectsAgainst: '하청업체의 현장 무단 점거 및 재산권 행사 차단',
      legalEffect: '대법원 판례 기준 유효한 법적 권리 포기 확약'
    },
    { 
      num: 8, 
      title: '시공대표자 연대보증', 
      desc: '법인 시공사 대표자 개인의 연대책임 의무 강제화', 
      icon: Users,
      protectsAgainst: '법인 고의 폐업 및 채무 회피 행위 원천 차단',
      legalEffect: '대표이사 개인 자산에 대한 구상권 및 무한책임'
    }
  ] : [
    { 
      num: 1, 
      title: 'NICE Docu E-Contract', 
      desc: 'All contracts safely executed via certified electronic signing', 
      icon: FileSignature,
      protectsAgainst: 'Prevents forgery & duplicate contracting',
      legalEffect: 'Statutory notarial validity & verified audit trail'
    },
    { 
      num: 2, 
      title: 'Performance Guarantee', 
      desc: 'Covers damages if contractor defaults or abandons work', 
      icon: ShieldCheck,
      protectsAgainst: 'Protects from contractor insolvency',
      legalEffect: 'Direct payment from guarantee insurer to fund replacement contractor'
    },
    { 
      num: 3, 
      title: 'Advance Payment Bond', 
      desc: 'Guarantees refund if advance payments are misappropriated', 
      icon: Banknote,
      protectsAgainst: 'Stops diversion of early mobilization funds',
      legalEffect: '100% refund from SGI guarantee insurance'
    },
    { 
      num: 4, 
      title: 'Defect Warranty Bond', 
      desc: 'Secures warranty repairs for statutory period (up to 10 yrs)', 
      icon: CheckSquare,
      protectsAgainst: 'Guarantees post-completion structural & finish repairs',
      legalEffect: 'Insurance claims cover repair bills if builder dissolves'
    },
    { 
      num: 5, 
      title: 'Completion Repair Escrow', 
      desc: 'Cash deposit held prior to final payment for punchlist care', 
      icon: Wallet,
      protectsAgainst: 'Preempts punchlist delays & incomplete touches',
      legalEffect: 'Client uses deposit to execute direct repairs'
    },
    { 
      num: 6, 
      title: 'Liquidated Delay Damages', 
      desc: 'Daily penalty deducted from final payment for delays', 
      icon: AlertCircle,
      protectsAgainst: 'Compensates interest & rental loss due to schedule slips',
      legalEffect: 'Automatic per-day deduction from contract balance'
    },
    { 
      num: 7, 
      title: 'Lien Renunciation Waiver', 
      desc: 'Pre-execution lien waiver covenants signed by builder & subs', 
      icon: FileText,
      protectsAgainst: 'Stops physical site seizure & property encumbrances',
      legalEffect: 'Binding waiver backed by Supreme Court precedents'
    },
    { 
      num: 8, 
      title: 'CEO Joint & Several Guarantee', 
      desc: 'Personal unlimited joint guarantee signed by contractor CEO', 
      icon: Users,
      protectsAgainst: 'Stops corporate bankruptcy evasions',
      legalEffect: 'Personal recourse against corporate representative assets'
    }
  ];

  const current = devices[activeDevice];

  return (
    <div className="bg-white p-6 md:p-12 rounded-3xl md:rounded-[3rem] shadow-sm border border-gray-100 max-w-6xl mx-auto my-8">
      {/* Section Header */}
      <div className="text-center mb-10 md:mb-14">
        <span className="text-xs font-bold tracking-widest text-emerald-600 uppercase mb-2 block">
          8-FOLD ARCHITECTURAL SHIELD
        </span>
        <h4 className="text-2xl md:text-3xl font-black text-gray-900 mb-3">
          {language === 'ko' ? '빅플래너파트너스 8대 안전장치' : 'BIGPLANNER PARTNERS 8 Safety Devices'}
        </h4>
        <p className="text-xs md:text-sm text-gray-500 max-w-2xl mx-auto">
          {language === 'ko'
            ? '모든 계약은 철저한 8대 안전장치로 빈틈없이 보호됩니다. 각 항목을 클릭하여 법적 효력과 차단 리스크를 확인하세요.'
            : 'Every contract is fortified with 8 safety devices. Click each device to inspect legal effects and protected risks.'}
        </p>
      </div>

      {/* 8 Devices Interactive Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-8">
        {devices.map((item, idx) => {
          const Icon = item.icon;
          const isSelected = activeDevice === idx;

          return (
            <motion.button
              key={item.num}
              onClick={() => setActiveDevice(idx)}
              whileHover={{ scale: 1.02 }}
              className={`p-5 rounded-2xl text-left transition-all duration-300 relative border flex flex-col justify-between ${
                isSelected
                  ? 'bg-gray-900 text-white shadow-xl border-gray-900 ring-4 ring-gray-900/10'
                  : 'bg-gray-50 text-gray-800 border-gray-200 hover:border-gray-300 hover:bg-white'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                    isSelected ? 'bg-white text-gray-900 shadow' : 'bg-white text-gray-700 shadow-sm'
                  }`}>
                    <Icon size={20} />
                  </div>
                  <span className={`text-xs font-mono font-bold ${
                    isSelected ? 'text-blue-300' : 'text-gray-500'
                  }`}>
                    0{item.num}
                  </span>
                </div>

                <h5 className="font-extrabold text-sm md:text-base leading-tight mb-1.5">
                  {item.title}
                </h5>
                <p className={`text-xs leading-snug line-clamp-2 ${
                  isSelected ? 'text-gray-200' : 'text-gray-600'
                }`}>
                  {item.desc}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-gray-100/20 flex items-center justify-between">
                <span className={`text-xs font-bold ${
                  isSelected ? 'text-emerald-400' : 'text-gray-500'
                }`}>
                  {isSelected ? 'INSPECTING' : 'SECURED'}
                </span>
                <span className={`w-2 h-2 rounded-full ${
                  isSelected ? 'bg-emerald-400 animate-ping' : 'bg-gray-300'
                }`} />
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Selected Safety Device Detailed Shield Inspector */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeDevice}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.25 }}
          className="bg-gray-50 rounded-2xl p-6 md:p-8 border border-gray-200"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            <div className="md:col-span-7 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-md bg-gray-900 text-white font-mono font-bold text-xs flex items-center justify-center">
                  0{current.num}
                </span>
                <span className="text-xs sm:text-sm font-bold text-blue-600 uppercase tracking-wider">
                  {language === 'ko' ? '안전계약 핵심 장치' : 'Safety Device Specification'}
                </span>
              </div>
              <h5 className="text-xl md:text-2xl font-black text-gray-900">
                {current.title}
              </h5>
              <p className="text-sm md:text-base text-gray-700 font-medium leading-relaxed">
                {current.desc}
              </p>
            </div>

            <div className="md:col-span-5 space-y-3">
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-xs sm:text-sm space-y-1.5">
                <span className="text-xs font-bold text-rose-600 uppercase flex items-center gap-1.5">
                  <ShieldCheck size={14} />
                  차단 리스크
                </span>
                <p className="font-bold text-gray-900">{current.protectsAgainst}</p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-xs sm:text-sm space-y-1.5">
                <span className="text-xs font-bold text-emerald-600 uppercase flex items-center gap-1.5">
                  <Lock size={14} />
                  법적 효력 & 실행력
                </span>
                <p className="font-bold text-gray-900">{current.legalEffect}</p>
              </div>
            </div>

          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
