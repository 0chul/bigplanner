import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, BarChart3, Target, Rocket, CheckCircle2, ChevronRight, Layers, Sparkles } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export default function ServiceProcessMotion() {
  const { language } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<number>(0);
  const [activeStep, setActiveStep] = useState<number>(0);

  const processData = language === 'ko' ? [
    {
      title: "Buildup",
      subtitle: "건축투자 / 신축개발 / 자산운영",
      desc: "건축투자 또는 신축개발에 대한 전문지식과 노하우를 바탕으로 합리적인 컨설팅을 제공하여 기획 단계부터 통합 프로젝트 관리를 통한 부동산 투자사업 수익극대화를 추구합니다.",
      steps: [
        {
          num: "01",
          name: "Research",
          koreanName: "기초 조사 및 요구 파악",
          icon: Search,
          detail: "고객 NEEDS 파악\n투자 규모 및 예산 범위 설정\n현장 실사 및 기본 필지 검토",
          deliverables: ["사업 의뢰서 및 투자 가이드라인", "현장 입지 기초 조사서"]
        },
        {
          num: "02",
          name: "Analysis",
          koreanName: "정밀 분석 및 시뮬레이션",
          icon: BarChart3,
          detail: "환경 분석 및 인허가 법규 검토\n벤치마킹 사례 분석\nCASH FLOW 및 수지 분석",
          deliverables: ["개발환경 및 규제 검토 보고서", "현금흐름(CASH FLOW) 시뮬레이션"]
        },
        {
          num: "03",
          name: "Strategy",
          koreanName: "사업전략 및 기획 수립",
          icon: Target,
          detail: "최유효 사업성 분석\n총공사비 산출 및 예산 통제\n금융 조달(PF/대출) 계획",
          deliverables: ["최종 사업기획서(Master Plan)", "자금조달 및 Exit 전략서"]
        },
        {
          num: "04",
          name: "Action",
          koreanName: "실행 및 통합 PM 관리",
          icon: Rocket,
          detail: "인허가 관리 및 설계사/시공사 선정\n공사비 및 계약 관리\n성공적인 EXIT 전략 완수",
          deliverables: ["공정 및 안전 관리 시스템", "준공 및 정산 완료 보고서"]
        }
      ]
    },
    {
      title: "Insight",
      subtitle: "고객경험 / 공간가치 / 서비스디자인",
      desc: "공간을 통해 경험되는 인적, 물리적, 시스템적 요소의 개선방안을 체계적인 컨설팅을 통해 고객의 공간가치를 극대화 할 수 있는 솔루션을 제공합니다.",
      steps: [
        {
          num: "01",
          name: "Research",
          koreanName: "공간 이용객 조사",
          icon: Search,
          detail: "의뢰 접수 및 고객 NEEDS 파악\n이용객 서베이(SURVEY)\nFGI & 심층 인터뷰(IDI)",
          deliverables: ["공간 사용자 니즈 조사서", "페르소나 정의서"]
        },
        {
          num: "02",
          name: "Analysis",
          koreanName: "서비스 청사진 분석",
          icon: BarChart3,
          detail: "SERVICE BLUEPRINT 분석\n고객의 소리(VOC) 데이터 분석\n결정적 순간(CRITICAL MOT) 도출",
          deliverables: ["서비스 청사진(Blueprint)", "MOT(접점) 평가 매트릭스"]
        },
        {
          num: "03",
          name: "Strategy",
          koreanName: "공간 아이덴티티 정립",
          icon: Target,
          detail: "이용객 요구품질 수립\nSCAPE IDENTITY 정립\n이용객 여정지도(Journey Map) 도출",
          deliverables: ["스케이프 아이덴티티 가이드", "고객 여정지도(Journey Map)"]
        },
        {
          num: "04",
          name: "Action",
          koreanName: "공간 및 서비스 솔루션 적용",
          icon: Rocket,
          detail: "넛지(NUDGE) 서비스 적용\n공간 인테리어 및 동선 최적화\n서비스 피드백 루프 구축",
          deliverables: ["공간 서비스 디자인 가이드북", "운영 만족도 평가 시스템"]
        }
      ]
    },
    {
      title: "Gains",
      subtitle: "매입 / 매각 자문",
      desc: "고객의 투자성향, 자산의 철저한 분석과 평가, 이용선호 및 가격 등 요구사항을 체계적으로 파악하여 최적화된 부동산 자산 매입, 매각 프로세스를 진행합니다.",
      steps: [
        {
          num: "01",
          name: "Research",
          koreanName: "투자조건 청취 및 소싱",
          icon: Search,
          detail: "의뢰 접수 및 투자성향 분석\n매입/매각 희망 조건 청취\n타깃 시장 동향 조사",
          deliverables: ["투자 의향서(LOI)", "타깃 시장 브리프"]
        },
        {
          num: "02",
          name: "Analysis",
          koreanName: "자산 실사 및 가치평가",
          icon: BarChart3,
          detail: "우량 물건 소싱 및 실사(Due Diligence)\n적정 매각/매입가 산출\n권리관계 및 리스크 분석",
          deliverables: ["물건 실사 보고서(DD Report)", "적정 가치 평가서"]
        },
        {
          num: "03",
          name: "Strategy",
          koreanName: "매입·매각 플랜 수립",
          icon: Target,
          detail: "매입 계획 및 자금구조 수립\n투자설명서(IM & TEASER) 작성\n유력 매수/매도자 타깃팅",
          deliverables: ["투자 설명서(IM)", "Teaser 및 매수자 롱리스트"]
        },
        {
          num: "04",
          name: "Action",
          koreanName: "협상 및 계약 체결",
          icon: Rocket,
          detail: "조건 협의 및 양해각서(MOU)\n본계약 체결 및 잔금 정산 지원\n사후 자산관리 연계",
          deliverables: ["MOU 및 본계약서", "소유권 이전 및 잔금 완료 확인서"]
        }
      ]
    }
  ] : [
    {
      title: "Buildup",
      subtitle: "Architecture Investment / New Development / Asset Management",
      desc: "We pursue profit maximization of real estate investment projects through integrated project management from planning by providing rational consulting based on expertise in architecture and development.",
      steps: [
        {
          num: "01",
          name: "Research",
          koreanName: "Initial Research & Needs",
          icon: Search,
          detail: "Identify Client NEEDS\nSet Investment Scale & Budget\nOn-site Due Diligence",
          deliverables: ["Project Inquiry & Investment Guidelines", "Site Survey Report"]
        },
        {
          num: "02",
          name: "Analysis",
          koreanName: "Rigorous Feasibility & Simulation",
          icon: BarChart3,
          detail: "Regulatory & Zoning Review\nBenchmarking Case Studies\nCASH FLOW & Financial Modeling",
          deliverables: ["Regulatory Feasibility Report", "Cashflow Simulation"]
        },
        {
          num: "03",
          name: "Strategy",
          koreanName: "Business Strategy & Structuring",
          icon: Target,
          detail: "Optimal Space & Use Modeling\nConstruction Cost Estimation\nFinancing (PF/Mortgage) Plan",
          deliverables: ["Master Project Plan", "Exit & Capital Strategy"]
        },
        {
          num: "04",
          name: "Action",
          koreanName: "Execution & Integrated PM",
          icon: Rocket,
          detail: "Permit & Contractor Selection\nCost & Contract Management\nSuccessful Exit Execution",
          deliverables: ["Quality & Schedule PM System", "Completion & Settlement Report"]
        }
      ]
    },
    {
      title: "Insight",
      subtitle: "Customer Experience / Space Value / Service Design",
      desc: "We provide solutions that maximize client space value through systematic consulting on improvement plans for human, physical, and systemic factors experienced through spaces.",
      steps: [
        {
          num: "01",
          name: "Research",
          koreanName: "Space User Research",
          icon: Search,
          detail: "Identify Client & Space User Needs\nUser Surveys\nFGI & In-depth Interviews (IDI)",
          deliverables: ["User Needs Analysis", "Target Persona Brief"]
        },
        {
          num: "02",
          name: "Analysis",
          koreanName: "Service Blueprint Analysis",
          icon: BarChart3,
          detail: "SERVICE BLUEPRINT Analysis\nVOC Data Processing\nCritical MOT Identification",
          deliverables: ["Service Blueprint", "Touchpoint (MOT) Evaluation"]
        },
        {
          num: "03",
          name: "Strategy",
          koreanName: "Space Identity Formulation",
          icon: Target,
          detail: "User Quality Requirements\nEstablish SCAPE IDENTITY\nCustomer Journey Map Formulation",
          deliverables: ["Scape Identity Guidelines", "Customer Journey Map"]
        },
        {
          num: "04",
          name: "Action",
          koreanName: "Space & Service Deployment",
          icon: Rocket,
          detail: "NUDGE Service Integration\nCirculation & Layout Optimization\nCustomer Feedback Loop Setup",
          deliverables: ["Service Design Handbook", "Customer Satisfaction Metrics"]
        }
      ]
    },
    {
      title: "Gains",
      subtitle: "Purchase / Sale Advisory",
      desc: "We proceed with an optimized real estate asset purchase and sale process by systematically grasping requirements such as investment profile, asset analysis, usage preferences, and pricing.",
      steps: [
        {
          num: "01",
          name: "Research",
          koreanName: "Inquiry & Criteria Sourcing",
          icon: Search,
          detail: "Inquiry & Profile Assessment\nPurchase/Sale Criteria Intake\nMarket Trends Research",
          deliverables: ["Letter of Intent (LOI)", "Target Market Brief"]
        },
        {
          num: "02",
          name: "Analysis",
          koreanName: "Due Diligence & Valuation",
          icon: BarChart3,
          detail: "Property Sourcing & Due Diligence\nFair Valuation Assessment\nLegal & Encumbrance Review",
          deliverables: ["DD Report", "Valuation Analysis"]
        },
        {
          num: "03",
          name: "Strategy",
          koreanName: "Acquisition/Disposition Structuring",
          icon: Target,
          detail: "Acquisition & Debt Planning\nIM & Teaser Preparation\nInvestor / Buyer Targeting",
          deliverables: ["Information Memorandum (IM)", "Teaser & Longlist"]
        },
        {
          num: "04",
          name: "Action",
          koreanName: "Negotiation & Closing",
          icon: Rocket,
          detail: "Condition Negotiation & MOU\nContract Signing & Settlement Support\nPost-Transaction Asset Care",
          deliverables: ["MOU & Final Contract", "Closing & Transfer Confirmation"]
        }
      ]
    }
  ];

  const currentProcess = processData[activeCategory];
  const selectedStepData = currentProcess.steps[activeStep];

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      
      {/* Category Pills (Buildup / Insight / Gains) */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {processData.map((p, idx) => (
          <button
            key={idx}
            onClick={() => {
              setActiveCategory(idx);
              setActiveStep(0);
            }}
            className={`px-6 py-3 rounded-2xl font-bold text-sm md:text-base transition-all duration-300 flex items-center gap-2.5 ${
              activeCategory === idx
                ? 'bg-gray-900 text-white shadow-xl scale-105'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span>{p.title}</span>
            <span className="text-xs opacity-60 font-normal hidden sm:inline">({p.subtitle.split('/')[0]})</span>
          </button>
        ))}
      </div>

      {/* Main Process Pipeline Graphic Canvas */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-xl p-6 md:p-10 relative overflow-hidden">
        {/* Background ambient pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

        {/* Process Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-6 border-b border-gray-100 relative z-10">
          <div>
            <span className="text-xs font-bold text-blue-600 tracking-wider uppercase block mb-1">
              PROCESS PIPELINE · {currentProcess.title}
            </span>
            <h4 className="text-2xl md:text-3xl font-black text-gray-900">
              {currentProcess.title} <span className="text-sm font-semibold text-gray-400">({currentProcess.subtitle})</span>
            </h4>
          </div>
          <p className="text-xs text-gray-500 max-w-md font-medium leading-relaxed">
            {currentProcess.desc}
          </p>
        </div>

        {/* 4-Step Animated Pipeline Rail */}
        <div className="relative mb-10 z-10">
          {/* Desktop Connecting Liquid Stream */}
          <div className="hidden lg:block absolute top-1/2 left-[10%] right-[10%] h-1.5 bg-gray-200 -translate-y-1/2 z-0 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-gray-900 via-blue-600 to-emerald-500 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${((activeStep + 1) / 4) * 100}%` }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>

          {/* 4 Steps Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
            {currentProcess.steps.map((step, idx) => {
              const Icon = step.icon;
              const isSelected = activeStep === idx;
              const isPassed = activeStep > idx;

              return (
                <motion.div
                  key={idx}
                  onClick={() => setActiveStep(idx)}
                  whileHover={{ scale: 1.03 }}
                  className={`p-5 rounded-2xl cursor-pointer transition-all duration-300 relative border flex flex-col justify-between ${
                    isSelected
                      ? 'bg-gray-900 text-white shadow-2xl border-gray-900 ring-4 ring-gray-900/10'
                      : isPassed
                      ? 'bg-gray-50 text-gray-800 border-gray-300 shadow-sm'
                      : 'bg-white text-gray-700 border-gray-200 shadow-sm hover:border-gray-300'
                  }`}
                >
                  <div>
                    {/* Step badge */}
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-xs font-mono font-bold tracking-wider px-2.5 py-1 rounded-full ${
                        isSelected ? 'bg-blue-500 text-white shadow-sm' : 'bg-gray-100 text-gray-700'
                      }`}>
                        STEP {step.num}
                      </span>
                      <div className={`w-2.5 h-2.5 rounded-full transition-colors ${
                        isSelected ? 'bg-emerald-400 animate-ping' : isPassed ? 'bg-gray-900' : 'bg-gray-300'
                      }`} />
                    </div>

                    {/* Step Icon + Name */}
                    <div className="flex items-center gap-2.5 mb-2">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                        isSelected ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-800'
                      }`}>
                        <Icon size={18} />
                      </div>
                      <h5 className="font-extrabold text-base leading-tight">
                        {step.name}
                      </h5>
                    </div>

                    <p className={`text-xs sm:text-sm font-semibold mt-1 ${
                      isSelected ? 'text-gray-200' : 'text-gray-600'
                    }`}>
                      {step.koreanName}
                    </p>
                  </div>

                  {/* Micro indicator */}
                  <div className={`mt-4 pt-3 border-t text-xs flex items-center justify-between font-mono font-bold ${
                    isSelected ? 'border-white/15 text-blue-300' : 'border-gray-100 text-gray-500'
                  }`}>
                    <span>{isSelected ? 'ACTIVE VIEW' : 'CLICK TO VIEW'}</span>
                    <ChevronRight size={14} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Selected Step Detailed Deliverables Reveal */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-50 rounded-2xl p-6 md:p-8 border border-gray-200 relative z-10"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              
              {/* Left: Core Activities */}
              <div>
                <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">
                  <Sparkles size={16} className="text-gray-900" />
                  <span>{language === 'ko' ? '단계별 주요 업무' : 'Core Activities'}</span>
                </div>
                <h6 className="text-xl font-black text-gray-900 mb-3">
                  STEP {selectedStepData.num}. {selectedStepData.name} ({selectedStepData.koreanName})
                </h6>
                <div className="bg-white p-5 rounded-2xl border border-gray-200 text-sm text-gray-800 leading-relaxed font-medium whitespace-pre-line shadow-sm">
                  {selectedStepData.detail}
                </div>
              </div>

              {/* Right: Key Deliverables */}
              <div>
                <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-blue-600 uppercase tracking-wider mb-2">
                  <CheckCircle2 size={16} />
                  <span>{language === 'ko' ? '제공 결과물 (Deliverables)' : 'Key Deliverables'}</span>
                </div>
                <h6 className="text-xl font-black text-gray-900 mb-3">
                  {language === 'ko' ? '실행 및 제출 문서' : 'Output Documents'}
                </h6>
                <div className="space-y-2.5">
                  {selectedStepData.deliverables.map((d, i) => (
                    <div key={i} className="flex items-center gap-3 bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm text-xs sm:text-sm font-bold text-gray-800">
                      <div className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 size={15} />
                      </div>
                      <span>{d}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </motion.div>
        </AnimatePresence>

      </div>
    </div>
  );
}
