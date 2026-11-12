import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, FileText, Compass, HardHat, Megaphone, 
  Store, Calculator, CheckCircle2, ChevronRight, ChevronLeft, 
  Sparkles, Layers, ShieldCheck, UserCheck 
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function PMTasks() {
  const { language } = useLanguage();
  const [activeTask, setActiveTask] = useState<number>(0);

  const tasks = language === 'ko' ? [
    { 
      step: "01",
      title: "사업기획", 
      icon: Compass,
      tag: "FEASIBILITY",
      desc: "토지검토, 법규검토, 건축검토, 시장분석, 임차기획, 금융기획",
      keyPoints: [
        "지구단위계획 및 용적률/건폐율 극대화 방안 수립",
        "상권 유동인구 기반 타깃 임차인 사전 기획",
        "토지 매입비 대비 예상 사업수익률(IRR) 정밀 검증"
      ],
      deliverable: "사업기획서 및 초기 수지분석표",
      riskMitigation: "부적합 토지 매입 및 인허가 불발 리스크 원천 차단"
    },
    { 
      step: "02",
      title: "사업계획", 
      icon: Calculator,
      tag: "PLANNING",
      desc: "사업일정수립, 건축규모검토, 공사비예측, 대출검토",
      keyPoints: [
        "착공부터 준공, 청산까지 마일스톤별 상세 일정표 확정",
        "최근 공사비 빅데이터 기반 현실적 건축비 산출",
        "PF 및 금융기관 브릿지론 대출 구조 확정"
      ],
      deliverable: "종합 사업계획서 & Cashflow 타임라인",
      riskMitigation: "자금 경색 및 예상치 못한 공사비 증액 사전 방지"
    },
    { 
      step: "03",
      title: "건축설계", 
      icon: Building2,
      tag: "DESIGN",
      desc: "건축사 선정, 기획설계(건축개요, 평/입/단면도,투시도), 실시설계(일정, 공사비, 시공성)",
      keyPoints: [
        "사업성에 최적화된 우량 건축사 지명 경쟁 및 심사",
        "건축주 요구를 100% 반영한 공간 평면 및 외관 투시도",
        "시공 하자를 방지하는 꼼꼼한 실시설계 도서 감수"
      ],
      deliverable: "인허가 도면 및 시공용 실시설계 도서",
      riskMitigation: "시공 중 잦은 설계변경으로 인한 추가 공사비 발생 차단"
    },
    { 
      step: "04",
      title: "건축시공", 
      icon: HardHat,
      tag: "CONSTRUCTION",
      desc: "적산/견적, 시공사 선정(견적비교, 공사비확정, 계약), 공사(대금관리, 사용승인 등)",
      keyPoints: [
        "물량 적산 기반 투명한 비교 견적으로 우량 시공사 낙찰",
        "8대 안전장치 및 에스크로(Escrow) 안전 대금관리 체결",
        "건축비서 App 기반 실시간 현장 공정·품질 밀착 감독"
      ],
      deliverable: "공사감리 일지 & 건축물 사용승인서(준공필증)",
      riskMitigation: "부실시공, 공기지연, 유치권 및 하도급 대금 분쟁 원천 해소"
    },
    { 
      step: "05",
      title: "건물분양", 
      icon: Megaphone,
      tag: "SALES",
      desc: "분양홍보, 분양대행사운영, 모델하우스운영",
      keyPoints: [
        "온·오프라인 옴니채널 마케팅 및 분양 타깃팅",
        "검증된 분양대행사 파트너십을 통한 조기 완판 추진",
        "계약금/중도금/잔금 관리 및 분양자 권익 보호"
      ],
      deliverable: "분양 홍보물 & 호실별 분양계약서",
      riskMitigation: "미분양 장기화에 따른 금융비용 증가 리스크 방어"
    },
    { 
      step: "06",
      title: "임차MD", 
      icon: Store,
      tag: "LEASING",
      desc: "근린생활시설(상가) 임차대행",
      keyPoints: [
        "건물 가치를 높이는 앵커 테넌트(우량 임차인) 유치",
        "공실률 제로화를 위한 맞춤형 층별 MD 구성",
        "임대차 계약 체결 및 입주 인테리어 일정 조율"
      ],
      deliverable: "임대차 계약서 & 테넌트 입주 마스터플랜",
      riskMitigation: "준공 후 공실 리스크 및 임대료 연체 위험 방지"
    },
    { 
      step: "07",
      title: "사업청산", 
      icon: FileText,
      tag: "CLOSING",
      desc: "시행수익확정, 시행법인청산(법무, 세무, 회계)",
      keyPoints: [
        "총수입과 지출 결산을 통한 최종 시행이익 산출",
        "전문 세무사·회계사와 연계한 법인세 및 부가세 신고",
        "시행법인 해산 및 안전한 사업 최종 종료"
      ],
      deliverable: "사업결산 보고서 & 법인 청산 등기필증",
      riskMitigation: "세무조사 위험 및 사후 잔여 법적 분쟁 완전 종결"
    },
  ] : [
    { 
      step: "01",
      title: "Business Planning", 
      icon: Compass,
      tag: "FEASIBILITY",
      desc: "Land review, legal review, architectural review, market analysis, lease planning, financial planning",
      keyPoints: [
        "Zoning plan and FAR/coverage ratio optimization",
        "Target tenant pre-planning based on commercial foot traffic",
        "Rigorous verification of projected IRR vs land acquisition cost"
      ],
      deliverable: "Business Proposal & Initial Feasibility Model",
      riskMitigation: "Preempting unsuitable land purchase and zoning failure"
    },
    { 
      step: "02",
      title: "Business Plan", 
      icon: Calculator,
      tag: "PLANNING",
      desc: "Establish business schedule, review building scale, estimate construction cost, review loan",
      keyPoints: [
        "Detailed milestone timeline from groundbreaking to closing",
        "Realistic cost estimation based on construction big data",
        "Structuring PF and bridge loans with institutional lenders"
      ],
      deliverable: "Master Business Plan & Cashflow Timeline",
      riskMitigation: "Preventing liquidity squeeze and budget escalations"
    },
    { 
      step: "03",
      title: "Architectural Design", 
      icon: Building2,
      tag: "DESIGN",
      desc: "Select architect, schematic design (overview, plan/elevation/section, perspective), construction document",
      keyPoints: [
        "Design competition and rigorous screening of architects",
        "Floor plans and 3D perspectives fulfilling 100% client goals",
        "Detailed constructability audit of construction documents"
      ],
      deliverable: "Permit Drawings & Construction Documents",
      riskMitigation: "Stopping extra costs from frequent mid-construction changes"
    },
    { 
      step: "04",
      title: "Construction", 
      icon: HardHat,
      tag: "CONSTRUCTION",
      desc: "Estimation/quote, select contractor (quote comparison, confirm cost, contract), construction (payment, use approval)",
      keyPoints: [
        "Transparent bidding based on quantity takeoff to select prime builder",
        "8 comprehensive safety devices & Escrow fund management",
        "Real-time site quality supervision via Architecture Secretary App"
      ],
      deliverable: "Site Supervision Log & Certificate of Occupancy",
      riskMitigation: "Eliminating builder default, delays, and lien disputes"
    },
    { 
      step: "05",
      title: "Building Sales", 
      icon: Megaphone,
      tag: "SALES",
      desc: "Sales promotion, operate sales agency, operate model house",
      keyPoints: [
        "Omnichannel digital & offline marketing campaigns",
        "Early sell-out driven by verified sales agency partners",
        "Contract & payment administration protecting buyer interests"
      ],
      deliverable: "Sales Brochures & Unit Purchase Agreements",
      riskMitigation: "Mitigating interest costs from prolonged vacancies"
    },
    { 
      step: "06",
      title: "Lease MD", 
      icon: Store,
      tag: "LEASING",
      desc: "Neighborhood living facility (commercial) lease agency",
      keyPoints: [
        "Attracting anchor tenants that enhance overall asset value",
        "Customized floor-by-floor MD mix to achieve zero vacancy",
        "Lease contract negotiation and tenant move-in coordination"
      ],
      deliverable: "Lease Agreements & Tenant Onboarding Plan",
      riskMitigation: "Eliminating post-completion vacancy and rent default"
    },
    { 
      step: "07",
      title: "Business Liquidation", 
      icon: FileText,
      tag: "CLOSING",
      desc: "Confirm implementation profit, liquidate implementation corporation (legal, tax, accounting)",
      keyPoints: [
        "Final revenue and expense settlement to confirm net profit",
        "Corporate tax and VAT filing with CPA & tax attorneys",
        "Corporate dissolution and orderly closing of the venture"
      ],
      deliverable: "Final Settlement Report & Dissolution Certificate",
      riskMitigation: "Completely closing tax audit risks and residual liabilities"
    },
  ];

  const current = tasks[activeTask];

  return (
    <div className="py-12 md:py-20 bg-gray-50 rounded-3xl my-10 border border-gray-200 shadow-sm overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-bold tracking-widest text-blue-600 uppercase block mb-2">
            INTEGRATED PM LIFECYCLE
          </span>
          <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3">
            {language === 'ko' ? '총괄 PM 7단계 업무 로드맵' : '7-Stage Integrated PM Roadmap'}
          </h3>
          <p className="text-xs md:text-sm text-gray-500 max-w-2xl mx-auto">
            {language === 'ko'
              ? '빅플래너파트너스는 기획부터 최종 청산까지 건축주를 대리하여 모든 단계를 완벽하게 지휘합니다.'
              : 'BIGPLANNER PARTNERS flawlessly orchestrates all stages on behalf of the owner from inception to final closing.'}
          </p>
        </div>

        {/* Horizontal Stepper Timeline (Scroller on Mobile) */}
        <div className="relative mb-8">
          {/* Track Line */}
          <div className="hidden lg:block absolute top-6 left-8 right-8 h-1 bg-gray-200 -z-0 rounded-full">
            <motion.div 
              className="h-full bg-gray-900 rounded-full"
              animate={{ width: `${(activeTask / (tasks.length - 1)) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>

          <div className="grid grid-cols-7 gap-2 relative z-10 overflow-x-auto pb-2 scrollbar-none">
            {tasks.map((task, idx) => {
              const Icon = task.icon;
              const isCurrent = activeTask === idx;
              const isPast = activeTask > idx;

              return (
                <button
                  key={idx}
                  onClick={() => setActiveTask(idx)}
                  className={`flex flex-col items-center text-center p-2 rounded-xl transition-all min-w-[70px] ${
                    isCurrent ? 'scale-105' : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center mb-1.5 transition-all shadow-sm border ${
                    isCurrent 
                      ? 'bg-gray-900 text-white border-gray-900 ring-4 ring-gray-900/10' 
                      : isPast 
                      ? 'bg-gray-800 text-white border-gray-800' 
                      : 'bg-white text-gray-700 border-gray-300'
                  }`}>
                    <Icon size={18} />
                  </div>
                  <span className={`text-xs font-mono font-bold block ${isCurrent ? 'text-blue-600' : 'text-gray-500'}`}>
                    STEP {task.step}
                  </span>
                  <span className={`text-xs sm:text-sm font-bold truncate w-full ${isCurrent ? 'text-gray-900' : 'text-gray-700'}`}>
                    {task.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Detailed Stage Card Motion Graphic Canvas */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-xl p-6 md:p-10 relative overflow-hidden">
          
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-gray-900 text-white flex items-center justify-center font-bold text-sm shadow">
                {current.step}
              </span>
              <div>
                <span className="text-xs font-mono font-bold text-gray-500 uppercase tracking-widest block">
                  STAGE {current.step} · {current.tag}
                </span>
                <h4 className="text-xl md:text-2xl font-black text-gray-900">
                  {current.title}
                </h4>
              </div>
            </div>

            {/* Stepper Navigation buttons */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setActiveTask(Math.max(0, activeTask - 1))}
                disabled={activeTask === 0}
                className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                aria-label="Previous Stage"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setActiveTask(Math.min(tasks.length - 1, activeTask + 1))}
                disabled={activeTask === tasks.length - 1}
                className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                aria-label="Next Stage"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTask}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Task summary */}
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 text-sm md:text-base text-gray-800 font-medium leading-relaxed">
                <span className="text-gray-500 block text-xs uppercase font-mono font-bold mb-1">업무 개요</span>
                {current.desc}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left: Key Execution Points */}
                <div className="space-y-3">
                  <h6 className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles size={16} className="text-gray-900" />
                    <span>{language === 'ko' ? '주요 추진 항목' : 'Key Milestones'}</span>
                  </h6>
                  <div className="space-y-2">
                    {current.keyPoints.map((pt, i) => (
                      <div key={i} className="flex items-start gap-2.5 bg-white p-3.5 rounded-xl border border-gray-200 text-xs sm:text-sm font-semibold text-gray-800 shadow-sm">
                        <CheckCircle2 size={16} className="text-gray-900 mt-0.5 flex-shrink-0" />
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Deliverable & Risk Mitigation */}
                <div className="space-y-4">
                  <div className="bg-emerald-50/80 border border-emerald-200 p-4 rounded-2xl">
                    <div className="flex items-center gap-2 text-emerald-800 text-xs sm:text-sm font-bold mb-1.5">
                      <FileText size={16} />
                      <span>{language === 'ko' ? '핵심 산출물 (Deliverable)' : 'Key Deliverable'}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-emerald-950 font-bold leading-snug">
                      {current.deliverable}
                    </p>
                  </div>

                  <div className="bg-blue-50/80 border border-blue-200 p-4 rounded-2xl">
                    <div className="flex items-center gap-2 text-blue-800 text-xs sm:text-sm font-bold mb-1.5">
                      <ShieldCheck size={16} />
                      <span>{language === 'ko' ? '리스크 차단 효과' : 'Risk Mitigation'}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-blue-950 font-bold leading-snug">
                      {current.riskMitigation}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Role Synergy Bar */}
              <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between text-xs sm:text-sm text-gray-600 gap-2">
                <div className="flex items-center gap-2">
                  <UserCheck size={16} className="text-gray-900" />
                  <span className="font-semibold text-gray-800">
                    {language === 'ko' ? '빅플래너 PM 역할: 건축주 전담 대행 및 전문가 총괄 조율' : 'PM Role: Acting on behalf of owner & coordinating experts'}
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-gray-500">
                  STAGE {activeTask + 1} OF 7 COMPLIANT
                </span>
              </div>
            </motion.div>
          </AnimatePresence>

        </div>

      </div>
    </div>
  );
}
