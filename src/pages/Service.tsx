import { useState } from 'react';
import SEO from '../components/SEO';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, Lightbulb, TrendingUp, ShieldCheck, 
  FileSignature, Wallet, Smartphone, CheckCircle2, AlertCircle,
  Users, FileText, CheckSquare, Banknote, Search, X, Menu,
  ArrowRight, Landmark, CreditCard, Briefcase
} from 'lucide-react';
import ContactCTA from '../components/ContactCTA';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PMTasks from '../components/PMTasks';
import { useLanguage } from '../contexts/LanguageContext';

const tabs = [
  { id: 'consulting', label: 'BIG Consulting' },
  { id: 'management', label: 'BIG Management' },
  { id: 'credit', label: 'BIG Credit' }
];

export default function Service() {
  const [activeTab, setActiveTab] = useState('consulting');
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <SEO 
        title={language === 'ko' ? '서비스 | 빅플래너파트너스' : 'Services | BIGPLANNER PARTNERS'}
        description={language === 'ko' ? "빅플래너파트너스의 부동산 컨설팅, PM(프로젝트 관리), 금융 솔루션을 확인하세요. 공간 가치를 극대화하는 전문 서비스를 제공합니다." : "Check out BIGPLANNER PARTNERS' real estate consulting, PM (Project Management), and financial solutions. We provide professional services that maximize space value."}
        url="https://bigplanner.co.kr/service"
        image="https://injrbniytgtubemniaps.supabase.co/storage/v1/object/public/bigplanner/logo.png"
      />
      <Helmet>
        <meta name="keywords" content="빅플래너파트너스, 서비스, 부동산컨설팅, PM, 프로젝트관리, 부동산금융, BIGPLANNER PARTNERS, Services, Real Estate Consulting, PM, Project Management, Real Estate Finance" />
        <link rel="canonical" href="https://bigplanner.co.kr/service" />
        <script type="application/ld+json">
          {`
            [
              {
                "@context": "https://schema.org",
                "@type": "Service",
                "name": "${language === 'ko' ? '빅플래너파트너스 서비스' : 'BIGPLANNER PARTNERS Services'}",
                "provider": {
                  "@type": "Organization",
                  "name": "${language === 'ko' ? '빅플래너파트너스' : 'BIGPLANNER PARTNERS'}"
                },
                "description": "${language === 'ko' ? '부동산 컨설팅, PM(프로젝트 관리), 금융 솔루션을 제공합니다.' : 'We provide real estate consulting, PM, and financial solutions.'}",
                "url": "https://bigplanner.co.kr/service"
              },
              {
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": [
                  {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "${language === 'ko' ? '홈' : 'Home'}",
                    "item": "https://bigplanner.co.kr/"
                  },
                  {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "${language === 'ko' ? '서비스' : 'Services'}",
                    "item": "https://bigplanner.co.kr/service"
                  }
                ]
              }
            ]
          `}
        </script>
      </Helmet>
      <Navbar />
      <div className="pt-24">
      {/* Header */}
      <div className="bg-white py-12 md:py-16 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Service</h1>
          <p className="text-base md:text-lg text-gray-600 break-keep">
            {language === 'ko' ? (
              <>부동산과 공간 가치를 높이는<br className="block sm:hidden" />빅플래너파트너스의 서비스</>
            ) : (
              "BIGPLANNER PARTNERS' services that enhance real estate and space value"
            )}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="bg-white rounded-2xl shadow-sm p-1.5 sm:p-2 flex justify-center space-x-1 sm:space-x-2 md:space-x-4 border border-gray-100">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-1 py-3 md:px-8 md:py-4 rounded-xl font-bold text-[11px] sm:text-sm md:text-base transition-all break-keep ${
                activeTab === tab.id
                  ? 'bg-gray-900 text-white shadow-md'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span className="md:hidden whitespace-pre-line leading-tight block">{tab.label.replace(' ', '\n')}</span>
              <span className="hidden md:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <AnimatePresence mode="wait">
          {activeTab === 'consulting' && (
            <motion.div
              key="consulting"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-16 md:space-y-24"
            >
              {/* 01. Value Chain Diagram */}
              <div className="py-12">
                <div className="text-center mb-12 md:mb-20">
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">{language === 'ko' ? '밸류 체인' : 'Value Chain'}</h3>
                  <p className="text-gray-900 leading-relaxed max-w-3xl mx-auto text-sm md:text-base font-medium break-keep">
                    {language === 'ko' ? (
                      <>새로운 공간창조(Buildup), 공간경험개선(Insight), 이익확보(Gains)라는 가치창출을<br className="hidden md:block" />부동산 및 공간 생애주기(Life Cycle)에 맞춰 ‘BIG 컨설팅 솔루션’을 통해 제공합니다.</>
                    ) : (
                      "We provide value creation of new space creation (Buildup), space experience improvement (Insight), and profit securing (Gains) through the 'BIG Consulting Solution' tailored to the real estate and space life cycle."
                    )}
                  </p>
                </div>
                
                <div className="relative max-w-6xl mx-auto px-4">
                  {/* Horizontal Line Background */}
                  <div className="absolute top-1/2 left-0 w-full h-px bg-gray-200 -translate-y-1/2 hidden md:block"></div>
                  
                  <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-32 relative z-10">
                    {/* Left: Value Chain Circle */}
                    <div className="flex-shrink-0">
                      <div className="w-40 h-40 md:w-64 md:h-64 bg-black rounded-full flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.2)]">
                        <span className="text-white font-bold text-lg md:text-2xl tracking-tight text-center leading-tight">VALUE<br className="md:hidden" /> CHAIN</span>
                      </div>
                    </div>

                    {/* Right: BIG Stack */}
                    <div className="relative flex flex-col items-start w-full max-w-sm md:max-w-none mx-auto md:mx-0">
                      {/* Curved Dashed Line */}
                      <div className="absolute -left-16 top-1/2 -translate-y-1/2 w-24 h-[80%] pointer-events-none hidden md:block">
                        <svg width="100%" height="100%" viewBox="0 0 100 200" fill="none" preserveAspectRatio="none">
                          <path 
                            d="M100 10 C 20 10, 20 190, 100 190" 
                            stroke="#d1d5db" 
                            strokeWidth="1.5" 
                            strokeDasharray="6 6" 
                          />
                        </svg>
                      </div>

                      {/* B - Buildup */}
                      <div className="flex items-center gap-6 md:gap-10 py-2 w-full">
                        <div className="w-24 h-24 md:w-44 md:h-44 rounded-full border border-gray-300 bg-white flex flex-col items-center justify-center shadow-sm z-10 flex-shrink-0">
                          <span className="text-2xl md:text-4xl font-bold text-gray-900 mb-1">B</span>
                          <span className="text-[10px] md:text-sm font-bold text-gray-900">Buildup</span>
                        </div>
                        <div className="text-[11px] md:text-[13px] text-gray-500 space-y-1.5 font-medium">
                          {language === 'ko' ? (
                            <>
                              <p>· 건축투자 컨설팅</p>
                              <p>· 신축개발 컨설팅</p>
                              <p>· 자산운영 컨설팅</p>
                            </>
                          ) : (
                            <>
                              <p>· Architecture Investment Consulting</p>
                              <p>· New Construction Development Consulting</p>
                              <p>· Asset Management Consulting</p>
                            </>
                          )}
                        </div>
                      </div>

                      {/* I - Insight */}
                      <div className="flex items-center gap-6 md:gap-10 -mt-2 md:-mt-6 py-2 w-full">
                        <div className="w-24 h-24 md:w-44 md:h-44 rounded-full border border-gray-300 bg-white flex flex-col items-center justify-center shadow-sm z-10 flex-shrink-0">
                          <span className="text-2xl md:text-4xl font-bold text-gray-900 mb-1">I</span>
                          <span className="text-[10px] md:text-sm font-bold text-gray-900">Insight</span>
                        </div>
                        <div className="text-[11px] md:text-[13px] text-gray-500 space-y-1.5 font-medium">
                          {language === 'ko' ? (
                            <>
                              <p>· 고객경험관리(CEM) 컨설팅</p>
                              <p>· 공간개념정립(Scape Identity) 컨설팅</p>
                              <p>· 서비스디자인(Service Design) 컨설팅</p>
                              <p>· 넛지서비스(NUDGE SERVICE) 컨설팅</p>
                            </>
                          ) : (
                            <>
                              <p>· Customer Experience Management (CEM) Consulting</p>
                              <p>· Scape Identity Consulting</p>
                              <p>· Service Design Consulting</p>
                              <p>· NUDGE SERVICE Consulting</p>
                            </>
                          )}
                        </div>
                      </div>

                      {/* G - Gains */}
                      <div className="flex items-center gap-6 md:gap-10 -mt-2 md:-mt-6 py-2 w-full">
                        <div className="w-24 h-24 md:w-44 md:h-44 rounded-full border border-gray-300 bg-white flex flex-col items-center justify-center shadow-sm z-10 flex-shrink-0">
                          <span className="text-2xl md:text-4xl font-bold text-gray-900 mb-1">G</span>
                          <span className="text-[10px] md:text-sm font-bold text-gray-900">Gains</span>
                        </div>
                        <div className="text-[11px] md:text-[13px] text-gray-500 space-y-1.5 font-medium">
                          {language === 'ko' ? (
                            <>
                              <p>· 매입 자문(개발기획)</p>
                              <p>· 매각 자문(투자유치)</p>
                            </>
                          ) : (
                            <>
                              <p>· Purchase Advisory (Development Planning)</p>
                              <p>· Sale Advisory (Investment Attraction)</p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 02. Frame Diagram */}
              <div className="py-12 md:py-20 bg-white rounded-[3rem]">
                <div className="text-center mb-10 md:mb-16">
                  <h3 className="text-sm font-bold tracking-widest text-gray-400 uppercase mb-3">02. Frame</h3>
                  <h4 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{language === 'ko' ? '프레임 (Frame)' : 'Frame'}</h4>
                  <p className="text-gray-600 leading-relaxed max-w-xl mx-auto text-sm md:text-base px-4">
                    {language === 'ko' ? (
                      <>
                        부동산 및 공간에 관련된 모든 문제에 대한 전문적인 자문 및<br className="hidden md:block" />이해관계에 얽매이지 않는 편견없는 조언을 드립니다.
                      </>
                    ) : (
                      <>
                        We provide professional advice on all issues related to real estate and space and<br className="hidden md:block" />unbiased advice that is not bound by interests.
                      </>
                    )}
                  </p>
                </div>
                
                <div className="relative max-w-5xl mx-auto px-4 py-10 md:py-16">
                  {/* Dashed Ellipse Container */}
                  <div className="border-2 border-dashed border-gray-200 rounded-[2rem] md:rounded-full p-6 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 relative mt-6 md:mt-0">
                    
                    {/* Labels inside dashed container */}
                    <div className="absolute -top-3 md:top-8 left-1/2 -translate-x-1/2 bg-white px-4 text-gray-900 font-bold text-sm whitespace-nowrap">
                      {language === 'ko' ? '컨설팅의뢰' : 'Consulting Request'}
                    </div>
                    <div className="absolute -bottom-3 md:bottom-8 left-1/2 -translate-x-1/2 bg-white px-4 text-gray-900 font-bold text-sm whitespace-nowrap">
                      {language === 'ko' ? '보고서 작성 및 제출' : 'Report Preparation and Submission'}
                    </div>

                    {/* Customer */}
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border border-gray-300 flex items-center justify-center font-bold text-gray-900 shadow-sm bg-white z-10">
                      {language === 'ko' ? '고객' : 'Client'}
                    </div>

                    {/* Central Grid */}
                    <div className="flex-1 flex flex-col gap-4 w-full">
                      {/* Top Row (Dark Circles) */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-2">
                        {(language === 'ko' ? [
                          "부동산 최유효 이용방안 도출",
                          "입지분석 및 사업타당성 검토",
                          "부동산 투자 및 개발에 대한 자문",
                          "부동산 관련 각종 법적사항 및 세무자문"
                        ] : [
                          "Derive optimal real estate usage",
                          "Location analysis & feasibility study",
                          "Advisory on real estate investment & development",
                          "Legal & tax advisory related to real estate"
                        ]).map((text, i) => (
                          <div key={i} className="aspect-square rounded-full bg-gray-800 text-white flex items-center justify-center text-[11px] font-medium text-center p-3 leading-tight shadow-lg">
                            {text}
                          </div>
                        ))}
                      </div>
                      {/* Bottom Row (Blue Circles) */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-2">
                        {[
                          "Customer Experience Management",
                          "Scape(Space) Identity Strategy",
                          "Service Design & Customer Journey Map",
                          "Nudge Service Solution"
                        ].map((text, i) => (
                          <div key={i} className="aspect-square rounded-full bg-blue-700 text-white flex items-center justify-center text-[11px] font-medium text-center p-3 leading-tight shadow-lg">
                            {text}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* BigPlanner */}
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border border-gray-300 flex flex-col items-center justify-center font-bold text-gray-900 shadow-sm bg-white z-10 text-center p-4">
                      {language === 'ko' ? (
                        <>빅플래너<br/>파트너스</>
                      ) : (
                        <>BIGPLANNER<br/>PARTNERS</>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* 03. Process Detailed Chart */}
              <div>
                <div className="text-center mb-10 md:mb-16">
                  <h3 className="text-sm font-bold tracking-widest text-gray-400 uppercase mb-3">03. Process</h3>
                  <h4 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{language === 'ko' ? '프로세스 (Process)' : 'Process'}</h4>
                </div>
                
                <div className="space-y-16 md:space-y-24 max-w-5xl mx-auto">
                  {(language === 'ko' ? [
                    {
                      title: "Buildup",
                      subtitle: "건축투자 / 신축개발 / 자산운영",
                      desc: "건축투자 또는 신축개발에 대한 전문지식과 노하우를 바탕으로 합리적인 컨설팅을 제공하여 기획 단계부터 통합 프로젝트 관리를 통한 부동산 투자사업 수익극대화를 추구합니다.",
                      steps: [
                        { name: "Research", detail: "고객 NEEDS 파악,\n투자규모 설정" },
                        { name: "Analysis", detail: "환경 분석, 사례 검토,\n벤치마킹 분석,\nCASH FLOW 분석" },
                        { name: "Strategy", detail: "사업성 분석, 비용 산출,\n전략 수립,\n자금조달 계획" },
                        { name: "Action", detail: "인허가 관리, 투자사업 관리,\n비용 관리, 계약 관리,\nEXIT전략 수립" }
                      ]
                    },
                    {
                      title: "Insight",
                      subtitle: "고객경험 / 공간가치 / 서비스디자인",
                      desc: "공간을 통해 경험되는 인적, 물리적, 시스템적 요소의 개선방안을 체계적인 컨설팅을 통해 고객의 공간가치를 극대화 할 수 있는 솔루션을 제공합니다.",
                      steps: [
                        { name: "Research", detail: "의뢰 접수, 고객 NEEDS 파악\n이용객 조사,\n(SURVEY, FGI, IDI)" },
                        { name: "Analysis", detail: "SERVICE BLUEPRINT 분석,\nVOC 분석,\nCRITICAL MOT 분석" },
                        { name: "Strategy", detail: "이용객 요구품질 수립,\nSCAPE IDENTITY 수립,\n이용객 여정지도 도출" },
                        { name: "Action", detail: "이용객 요구품질 수립,\nSCAPE IDENTITY 수립,\n이용객 여정지도 도출" }
                      ]
                    },
                    {
                      title: "Gains",
                      subtitle: "매입 / 매각 자문",
                      desc: "고객의 투자성향, 자산의 철저한 분석과 평가, 이용선호 및 가격 등 요구사항을 체계적으로 파악하여 최적화된 부동산 자산 매입, 매각 프로세스를 진행합니다.",
                      steps: [
                        { name: "Research", detail: "의뢰 접수,\nNEEDS 파악,\n매입/매각 조건 청취" },
                        { name: "Analysis", detail: "(매입) 우량 물건 소싱,\n자산 실사,\n(매각) 적정매각가 산출" },
                        { name: "Strategy", detail: "(매입) 매입계획 수립,\n적정매입가 산출,\n(매각) IM & TEASER 작성" },
                        { name: "Action", detail: "조건협의 지원,\n양해각서(MOU)\n계약체결 지원, 사후 관리" }
                      ]
                    }
                  ] : [
                    {
                      title: "Buildup",
                      subtitle: "Architecture Investment / New Development / Asset Management",
                      desc: "We pursue profit maximization of real estate investment projects through integrated project management from the planning stage by providing rational consulting based on expertise and know-how in architecture investment or new development.",
                      steps: [
                        { name: "Research", detail: "Identify Client NEEDS,\nSet Investment Scale" },
                        { name: "Analysis", detail: "Environment Analysis, Case Review,\nBenchmarking Analysis,\nCASH FLOW Analysis" },
                        { name: "Strategy", detail: "Feasibility Analysis, Cost Estimation,\nStrategy Formulation,\nFinancing Plan" },
                        { name: "Action", detail: "Permit Management, Project Management,\nCost Management, Contract Management,\nEXIT Strategy Formulation" }
                      ]
                    },
                    {
                      title: "Insight",
                      subtitle: "Customer Experience / Space Value / Service Design",
                      desc: "We provide solutions that can maximize the customer's space value through systematic consulting on improvement plans for human, physical, and systemic elements experienced through space.",
                      steps: [
                        { name: "Research", detail: "Receive Request, Identify Client NEEDS\nUser Survey,\n(SURVEY, FGI, IDI)" },
                        { name: "Analysis", detail: "SERVICE BLUEPRINT Analysis,\nVOC Analysis,\nCRITICAL MOT Analysis" },
                        { name: "Strategy", detail: "Establish User Quality Requirements,\nEstablish SCAPE IDENTITY,\nDerive User Journey Map" },
                        { name: "Action", detail: "Establish User Quality Requirements,\nEstablish SCAPE IDENTITY,\nDerive User Journey Map" }
                      ]
                    },
                    {
                      title: "Gains",
                      subtitle: "Purchase / Sale Advisory",
                      desc: "We proceed with the optimized real estate asset purchase and sale process by systematically grasping requirements such as the customer's investment propensity, thorough analysis and evaluation of assets, usage preferences, and prices.",
                      steps: [
                        { name: "Research", detail: "Receive Request,\nIdentify NEEDS,\nListen to Purchase/Sale Conditions" },
                        { name: "Analysis", detail: "(Purchase) Source Prime Properties,\nAsset Due Diligence,\n(Sale) Calculate Appropriate Sale Price" },
                        { name: "Strategy", detail: "(Purchase) Establish Purchase Plan,\nCalculate Appropriate Purchase Price,\n(Sale) Prepare IM & TEASER" },
                        { name: "Action", detail: "Support Condition Negotiation,\nMOU\nSupport Contract Signing, Post-Management" }
                      ]
                    }
                  ]).map((process, idx) => (
                    <div key={idx} className="space-y-8">
                      {/* Process Header */}
                      <div className="flex items-end gap-4">
                        <h5 className="text-2xl md:text-3xl font-bold text-gray-900">{process.title}</h5>
                        <p className="text-gray-500 font-medium pb-1">{process.subtitle}</p>
                      </div>
                      
                      {/* Process Diagram */}
                      <div className="relative">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-0">
                          {process.steps.map((step, sIdx) => (
                            <div key={sIdx} className="flex flex-col items-center w-full md:w-1/4">
                              <div className={`w-32 h-32 md:w-40 md:h-40 rounded-full flex flex-col items-center justify-center text-white text-center p-4 shadow-lg z-10 ${
                                sIdx === 0 ? 'bg-gray-900' : 
                                sIdx === 1 ? 'bg-gray-700' : 
                                sIdx === 2 ? 'bg-gray-600' : 'bg-gray-500'
                              }`}>
                                <span className="font-bold text-base md:text-lg mb-1 md:mb-2">{step.name}</span>
                                <span className="text-[10px] whitespace-pre-line opacity-90 leading-tight">{step.detail}</span>
                              </div>
                              {/* Connecting Line (Desktop) */}
                              {sIdx < 3 && (
                                <div className="hidden md:block absolute top-20 left-[12.5%] right-[12.5%] h-px bg-gray-200 -z-0"></div>
                              )}
                              {/* Connecting Line (Mobile) */}
                              {sIdx < 3 && (
                                <div className="md:hidden w-px h-6 bg-gray-200 mt-6"></div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <p className="text-gray-600 leading-relaxed text-sm bg-gray-50 p-6 rounded-2xl border border-gray-100">
                        {process.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'management' && (
            <motion.div
              key="management"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-16 md:space-y-24"
            >
              {/* PM Service Features Diagram */}
              <div className="py-12">
                <div className="text-center mb-12 md:mb-20">
                  <h3 className="text-sm font-bold tracking-widest text-gray-400 uppercase mb-3">BIG Management</h3>
                  <h4 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{language === 'ko' ? 'PM 서비스 특장점' : 'PM Service Features'}</h4>
                  <p className="text-lg text-gray-500">
                    {language === 'ko' ? (
                      <>체계적인 분석과 사업 수익성을 확보할 수 있는<br/>TOTAL CONSTRUCTION SERVICE</>
                    ) : (
                      <>TOTAL CONSTRUCTION SERVICE that secures<br/>systematic analysis and business profitability</>
                    )}
                  </p>
                </div>
                
                <div className="max-w-5xl mx-auto">
                  {/* Main Container */}
                  <div className="border border-gray-200 rounded-[3rem] md:rounded-[5rem] p-8 md:p-20 relative">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                      {/* Expert */}
                      <div className="flex flex-col items-center flex-1">
                        <div className="w-40 h-40 rounded-full border-2 border-dashed border-gray-300 flex flex-col items-center justify-center mb-8 bg-white shadow-sm">
                          <Users size={40} className="text-gray-900 mb-2" />
                          <span className="font-bold text-lg">{language === 'ko' ? '전문가' : 'Expert'}</span>
                        </div>
                        <p className="text-sm text-gray-500 text-center leading-relaxed max-w-[200px]">
                          {language === 'ko' ? (
                            <>빅플래너파트너스는<br/>신축개발사업에 필요한 전체 공정을<br/>건축주 입장에서 업무를 대행합니다.</>
                          ) : (
                            <>BIGPLANNER PARTNERS acts on behalf of the client for the entire process required for new development projects.</>
                          )}
                        </p>
                      </div>

                      <div className="text-4xl font-light text-gray-300">+</div>

                      {/* Partner */}
                      <div className="flex flex-col items-center flex-1">
                        <div className="w-40 h-40 rounded-full border-2 border-dashed border-gray-300 flex flex-col items-center justify-center mb-8 bg-white shadow-sm">
                          <Briefcase size={40} className="text-gray-900 mb-2" />
                          <span className="font-bold text-lg">{language === 'ko' ? '파트너' : 'Partner'}</span>
                        </div>
                        <p className="text-sm text-gray-500 text-center leading-relaxed max-w-[200px]">
                          {language === 'ko' ? (
                            <>설계, 시공, 분양으로 구분되는<br/>서비스가 아닌 기획부터 사업종료시점까지<br/>함께하는 파트너입니다.</>
                          ) : (
                            <>We are a partner who is with you from planning to the end of the project, not a service divided into design, construction, and sales.</>
                          )}
                        </p>
                      </div>

                      <div className="text-4xl font-light text-gray-300">+</div>

                      {/* Transparent */}
                      <div className="flex flex-col items-center flex-1">
                        <div className="w-40 h-40 rounded-full border-2 border-dashed border-gray-300 flex flex-col items-center justify-center mb-8 bg-white shadow-sm">
                          <ShieldCheck size={40} className="text-gray-900 mb-2" />
                          <span className="font-bold text-lg">{language === 'ko' ? '투명한' : 'Transparent'}</span>
                        </div>
                        <p className="text-sm text-gray-500 text-center leading-relaxed max-w-[200px]">
                          {language === 'ko' ? (
                            <>모든 공정에 있어서 기획, 건설,<br/>금융 전문가들의 밀착자문과<br/>투명한 공정관리로 신뢰할 수 있습니다.</>
                          ) : (
                            <>You can trust us with close advice from planning, construction, and financial experts and transparent process management in all processes.</>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <PMTasks />

              {/* 02. App Features Diagram */}
              <div className="bg-white py-16 md:py-24 rounded-[2rem] md:rounded-[4rem] shadow-sm border border-gray-100 overflow-hidden">
                <div className="text-center mb-12 md:mb-20">
                  <h3 className="text-sm font-bold tracking-widest text-gray-400 uppercase mb-3">02. App Solution</h3>
                  <h4 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{language === 'ko' ? '건축비서 APP 특장점' : 'Architecture Secretary APP Features'}</h4>
                  <p className="text-lg text-gray-500 max-w-2xl mx-auto break-keep px-4">
                    {language === 'ko' ? (
                      <>빅플래너파트너스의 시공관리는 ‘건축비서 app’을 통해<br className="hidden md:block" />실시간으로 투명하게 관리하실 수 있습니다.</>
                    ) : (
                      <>BIGPLANNER PARTNERS' construction management can be managed transparently<br className="hidden md:block" />in real-time through the 'Architecture Secretary app'.</>
                    )}
                  </p>
                </div>

                <div className="flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-24 max-w-6xl mx-auto px-4">
                  {/* Left Features */}
                  <div className="flex-1 space-y-12 w-full order-2 lg:order-1">
                    <div className="flex items-start text-right justify-end group">
                      <div className="mr-8">
                        <h5 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-600 transition-colors">{language === 'ko' ? '실시간 현장 모니터링' : 'Real-time Site Monitoring'}</h5>
                        <p className="text-gray-500 text-sm leading-relaxed break-keep">{language === 'ko' ? '언제 어디서나 스마트폰으로 현장 상황을 실시간으로 확인하고 관리할 수 있습니다.' : 'You can check and manage the site situation in real time with your smartphone anytime, anywhere.'}</p>
                      </div>
                      <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-gray-900 group-hover:text-white transition-all shadow-sm">
                        <Smartphone size={28} />
                      </div>
                    </div>
                    <div className="flex items-start text-right justify-end group">
                      <div className="mr-8">
                        <h5 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-600 transition-colors">{language === 'ko' ? '투명한 공정 관리' : 'Transparent Process Management'}</h5>
                        <p className="text-gray-500 text-sm leading-relaxed">{language === 'ko' ? '공정률, 자재 투입 현황, 노무 현황 등 모든 데이터를 투명하게 공개하여 신뢰를 높입니다.' : 'We increase trust by transparently disclosing all data such as process rate, material input status, and labor status.'}</p>
                      </div>
                      <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-gray-900 group-hover:text-white transition-all shadow-sm">
                        <CheckSquare size={28} />
                      </div>
                    </div>
                    <div className="flex items-start text-right justify-end group">
                      <div className="mr-8">
                        <h5 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-600 transition-colors">{language === 'ko' ? '빠른 의사소통 및 피드백' : 'Fast Communication and Feedback'}</h5>
                        <p className="text-gray-500 text-sm leading-relaxed">{language === 'ko' ? '현장 소장 및 담당자와 앱 내에서 즉각적으로 소통하고 신속한 의사결정을 지원합니다.' : 'We support quick decision-making by communicating instantly with the site manager and person in charge within the app.'}</p>
                      </div>
                      <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-gray-900 group-hover:text-white transition-all shadow-sm">
                        <Users size={28} />
                      </div>
                    </div>
                  </div>

                  {/* Center Mockup */}
                  <div className="relative w-72 h-[580px] bg-gray-900 rounded-[3.5rem] border-[10px] border-gray-800 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] flex-shrink-0 overflow-hidden order-1 lg:order-2">
                    {/* Notch */}
                    <div className="absolute top-0 inset-x-0 h-7 bg-gray-800 rounded-b-3xl w-36 mx-auto z-30"></div>
                    
                    {/* App Content */}
                    <div className="absolute inset-0 bg-white flex flex-col z-10">
                      {/* App Header */}
                      <div className="bg-gray-900 p-8 pt-12 text-white">
                        <div className="flex justify-between items-center mb-6">
                          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                            <Menu size={16} />
                          </div>
                          <span className="font-bold text-sm tracking-tighter">BIGPLANNER</span>
                          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                            <X size={16} />
                          </div>
                        </div>
                        <h6 className="text-lg font-bold mb-1">{language === 'ko' ? '현장 리포트' : 'Site Report'}</h6>
                        <p className="text-white/50 text-[10px]">{language === 'ko' ? '2024.03.16 실시간 현황' : '2024.03.16 Real-time Status'}</p>
                      </div>
                      
                      {/* App Body */}
                      <div className="flex-1 p-5 space-y-4 bg-gray-50 overflow-y-auto">
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-[10px] font-bold text-gray-400">{language === 'ko' ? '전체 공정률' : 'Total Process Rate'}</span>
                            <span className="text-xs font-bold text-gray-900">78%</span>
                          </div>
                          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="w-[78%] h-full bg-gray-900"></div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                            <div className="w-6 h-6 bg-gray-50 rounded-lg flex items-center justify-center mb-2">
                              <Users size={12} className="text-gray-400" />
                            </div>
                            <span className="block text-[8px] text-gray-400">{language === 'ko' ? '오늘의 인력' : "Today's Manpower"}</span>
                            <span className="text-xs font-bold">{language === 'ko' ? '12명' : '12 People'}</span>
                          </div>
                          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                            <div className="w-6 h-6 bg-gray-50 rounded-lg flex items-center justify-center mb-2">
                              <AlertCircle size={12} className="text-gray-400" />
                            </div>
                            <span className="block text-[8px] text-gray-400">{language === 'ko' ? '특이사항' : 'Special Notes'}</span>
                            <span className="text-xs font-bold">{language === 'ko' ? '0건' : '0 Cases'}</span>
                          </div>
                        </div>
                        
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                          <span className="block text-[10px] font-bold text-gray-400 mb-3">{language === 'ko' ? '현장 사진' : 'Site Photos'}</span>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="aspect-square bg-gray-100 rounded-lg"></div>
                            <div className="aspect-square bg-gray-100 rounded-lg"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Features (Empty for balance on desktop, or can add more) */}
                  <div className="hidden lg:block flex-1 order-3"></div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'credit' && (
            <motion.div
              key="credit"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-16 md:space-y-24"
            >
              {/* 01. 안전계약 Section */}
              <div>
                <div className="text-center mb-10 md:mb-16">
                  <h3 className="text-sm font-bold tracking-widest text-gray-400 uppercase mb-3">01. Safety Contract</h3>
                  <h4 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{language === 'ko' ? '안전계약' : 'Safety Contract'}</h4>
                  <p className="text-gray-600 max-w-3xl mx-auto break-keep px-4">
                    {language === 'ko' ? (
                      <>빅플래너파트너스는 건축주(시행사)에게 필요한 특약사항을 모두 고려한 표준계약서를 기준으로<br />전자계약방식으로 착공 전 시공사 및 하청업체와 발생가능한 분쟁을 대비합니다.</>
                    ) : (
                      <>BIGPLANNER PARTNERS prepares for possible disputes with construction companies and subcontractors before construction begins<br className="hidden md:block" />through an electronic contract method based on a standard contract that considers all special conditions necessary for the client (developer).</>
                    )}
                  </p>
                </div>

                {/* Comparison Chart */}
                <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-12 md:mb-20">
                  {/* Left: Problem */}
                  <div className="bg-white p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] shadow-sm border border-gray-100 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-bl-[5rem] -mr-8 -mt-8 flex items-center justify-center pt-4 pl-4">
                      <AlertCircle className="text-gray-200" size={48} />
                    </div>
                    <h5 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                      <span className="w-2 h-8 bg-gray-300 mr-4 rounded-full"></span>
                      {language === 'ko' ? '일반적인 시공계약구조' : 'General Construction Contract Structure'}
                    </h5>
                    
                    <div className="space-y-6">
                      {(language === 'ko' ? [
                        "건축주는 시공사(건설사)와 도급계약을 체결함",
                        "도급공사비의 상당부분 공종별 하도급 업체에 지불, 건축주는 하도급 계약 관여 불가",
                        "시공사가 하도급 공사비 지연 및 미지급하는 경우, 유치권 행사, 준공지연 등 문제 발생",
                        "하도급 업체의 공사거부, 공사비 증액요구 등 피해가 건축주에게 발생"
                      ] : [
                        "The client signs a contract with the construction company",
                        "A significant portion of the contract cost is paid to subcontractors by trade, and the client cannot be involved in subcontracting",
                        "If the construction company delays or fails to pay subcontracting costs, problems such as exercise of lien and delay in completion occur",
                        "Damages such as refusal of construction and request for an increase in construction cost by subcontractors occur to the client"
                      ]).map((text, i) => (
                        <div key={i} className="flex gap-4 items-start">
                          <div className="mt-1 text-gray-300"><X size={18} /></div>
                          <p className="text-gray-500 text-sm leading-relaxed break-keep">{text}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right: Solution */}
                  <div className="bg-gray-900 p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] shadow-2xl relative overflow-hidden text-white group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-[5rem] -mr-8 -mt-8 flex items-center justify-center pt-4 pl-4">
                      <ShieldCheck className="text-white/10" size={48} />
                    </div>
                    <h5 className="text-2xl font-bold text-white mb-8 flex items-center">
                      <span className="w-2 h-8 bg-white mr-4 rounded-full"></span>
                      {language === 'ko' ? '빅플래너파트너스 시공계약구조' : 'BIGPLANNER PARTNERS Construction Contract Structure'}
                    </h5>
                    
                    <div className="space-y-6">
                      {(language === 'ko' ? [
                        "빅플래너파트너스와 계약을 기반으로 신축공사에 필요한 모든 계약을 일원화",
                        "하도급 업체에 하도급비용을 직접 지불하는 에스크로(Escrow) 방식으로 투명하게 운영",
                        "1군 시공사들의 책임준공에 준하는 계약체계를 시공사와 하청업체까지 구축",
                        "우량한 적합업체 Pool을 선정하고 해당 Pool 내에서 입찰로 업체 선정",
                        "건설과정에서 발생할 수 있는 유치권에 대한 Risk를 해소할 수 있는 계약체계"
                      ] : [
                        "Unify all contracts necessary for new construction based on the contract with BIGPLANNER PARTNERS",
                        "Operate transparently with an Escrow method that pays subcontracting costs directly to subcontractors",
                        "Establish a contract system equivalent to the responsible completion of tier 1 construction companies up to construction companies and subcontractors",
                        "Select an excellent suitable company pool and select a company through bidding within the pool",
                        "A contract system that can resolve the risk of lien that may occur during the construction process"
                      ]).map((text, i) => (
                        <div key={i} className="flex gap-4 items-start">
                          <div className="mt-1 text-white/40"><CheckCircle2 size={18} /></div>
                          <p className="text-gray-400 text-sm leading-relaxed break-keep">{text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Safety Devices Grid */}
                <div className="bg-white p-8 md:p-16 rounded-[2rem] md:rounded-[4rem] shadow-sm border border-gray-100 max-w-6xl mx-auto">
                  <div className="text-center mb-12">
                    <h4 className="text-2xl font-bold text-gray-900 mb-3">{language === 'ko' ? '빅플래너파트너스 안전장치' : 'BIGPLANNER PARTNERS Safety Devices'}</h4>
                    <p className="text-gray-500">{language === 'ko' ? '모든 계약은 철저한 8대 안전장치를 통해 보호받습니다.' : 'All contracts are protected through 8 thorough safety devices.'}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {(language === 'ko' ? [
                      { title: 'NICE다큐 전자계약', desc: '모든 계약은 안전하게 전자계약으로 체결', icon: <FileSignature /> },
                      { title: '계약이행 보증증권', desc: '계약 미이행 시 보증', icon: <ShieldCheck /> },
                      { title: '선급금 보증증권', desc: '선급금 유용 시 손해보상', icon: <Banknote /> },
                      { title: '하자이행 보증증권', desc: '준공 후 하자보증기간 책임', icon: <CheckSquare /> },
                      { title: '준공보수 예치금', desc: '하자발생 및 처리지연 대비', icon: <Wallet /> },
                      { title: '지체보상금', desc: '준공일자 지연 시 보상', icon: <AlertCircle /> },
                      { title: '유치권 포기각서', desc: '유치권 행사 불가 확약', icon: <FileText /> },
                      { title: '시공대표자 연대보증', desc: '책임의무 강제화', icon: <Users /> }
                    ] : [
                      { title: 'NICE Docu Electronic Contract', desc: 'All contracts are safely signed electronically', icon: <FileSignature /> },
                      { title: 'Contract Performance Guarantee Insurance', desc: 'Guarantee in case of non-performance of contract', icon: <ShieldCheck /> },
                      { title: 'Advance Payment Guarantee Insurance', desc: 'Compensation for damages in case of misappropriation of advance payment', icon: <Banknote /> },
                      { title: 'Defect Performance Guarantee Insurance', desc: 'Responsibility for defect guarantee period after completion', icon: <CheckSquare /> },
                      { title: 'Completion Repair Deposit', desc: 'Preparation for defect occurrence and processing delay', icon: <Wallet /> },
                      { title: 'Delay Compensation', desc: 'Compensation for delay in completion date', icon: <AlertCircle /> },
                      { title: 'Memorandum of Renunciation of Lien', desc: 'Commitment not to exercise lien', icon: <FileText /> },
                      { title: 'Joint Guarantee by Construction Representative', desc: 'Enforcement of responsibility obligation', icon: <Users /> }
                    ]).map((item, i) => (
                      <div key={i} className="bg-gray-50 p-8 rounded-3xl text-center hover:bg-gray-900 hover:text-white transition-all duration-500 group border border-gray-100">
                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 text-gray-400 group-hover:text-white group-hover:bg-white/10 shadow-sm transition-all">
                          {item.icon}
                        </div>
                        <h5 className="font-bold mb-3 text-sm">{item.title}</h5>
                        <p className="text-[10px] text-gray-400 group-hover:text-gray-300 leading-relaxed">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 02. 대금관리 Section */}
              <div className="pt-12 border-t border-gray-100">
                <div className="text-center mb-10 md:mb-16">
                  <h3 className="text-sm font-bold tracking-widest text-gray-400 uppercase mb-3">02. Payment Management</h3>
                  <h4 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{language === 'ko' ? '대금관리 프로세스' : 'Payment Management Process'}</h4>
                  <p className="text-gray-600 max-w-2xl mx-auto break-keep px-4">
                    {language === 'ko' ? (
                      <>NICE D&R 노무비닷컴과 업무제휴하여<br className="hidden md:block" />에스크로 방식으로 공사대금을 안전하게 관리합니다.</>
                    ) : (
                      <>We safely manage construction costs in an escrow method<br className="hidden md:block" />through business alliance with NICE D&R Nomubi.com.</>
                    )}
                  </p>
                </div>

                {/* Flowchart Diagram */}
                <div className="max-w-5xl mx-auto">
                  <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4 relative">
                    {/* Step 1 */}
                    <div className="flex flex-col items-center group">
                      <div className="w-20 h-20 bg-white rounded-3xl shadow-sm border border-gray-100 flex items-center justify-center mb-4 relative z-10 group-hover:bg-gray-900 group-hover:text-white transition-all duration-500">
                        <Landmark size={32} />
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-gray-900 text-white rounded-full text-[10px] font-bold flex items-center justify-center group-hover:bg-white group-hover:text-gray-900 transition-colors">1</div>
                      </div>
                      <div className="text-center">
                        <h6 className="text-sm font-bold text-gray-900 mb-1">{language === 'ko' ? '회원가입 및 계좌개설' : 'Sign Up & Open Account'}</h6>
                        <p className="text-[10px] text-gray-500">
                          {language === 'ko' ? (
                            <>건설사/하도급업체 가입<br/>건축주 전용계좌 개설</>
                          ) : (
                            <>Construction/Subcontractor Sign Up<br/>Open Client Dedicated Account</>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Arrow */}
                    <div className="hidden lg:flex items-center justify-center text-gray-200">
                      <ArrowRight size={20} />
                    </div>

                    {/* Step 2 */}
                    <div className="flex flex-col items-center group">
                      <div className="w-20 h-20 bg-white rounded-3xl shadow-sm border border-gray-100 flex items-center justify-center mb-4 relative z-10 group-hover:bg-gray-900 group-hover:text-white transition-all duration-500">
                        <FileText size={32} />
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-gray-900 text-white rounded-full text-[10px] font-bold flex items-center justify-center group-hover:bg-white group-hover:text-gray-900 transition-colors">2</div>
                      </div>
                      <div className="text-center">
                        <h6 className="text-sm font-bold text-gray-900 mb-1">{language === 'ko' ? '청구내역서 작성' : 'Create Billing Statement'}</h6>
                        <p className="text-[10px] text-gray-500">
                          {language === 'ko' ? (
                            <>노무비닷컴 시스템에<br/>기성 청구내역서 작성</>
                          ) : (
                            <>Create progress billing statement<br/>in Nomubi.com system</>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Arrow */}
                    <div className="hidden lg:flex items-center justify-center text-gray-200">
                      <ArrowRight size={20} />
                    </div>

                    {/* Step 3 */}
                    <div className="flex flex-col items-center group">
                      <div className="w-20 h-20 bg-white rounded-3xl shadow-sm border border-gray-100 flex items-center justify-center mb-4 relative z-10 group-hover:bg-gray-900 group-hover:text-white transition-all duration-500">
                        <CheckCircle2 size={32} />
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-gray-900 text-white rounded-full text-[10px] font-bold flex items-center justify-center group-hover:bg-white group-hover:text-gray-900 transition-colors">3</div>
                      </div>
                      <div className="text-center">
                        <h6 className="text-sm font-bold text-gray-900 mb-1">{language === 'ko' ? '검토 및 승인' : 'Review & Approve'}</h6>
                        <p className="text-[10px] text-gray-500">
                          {language === 'ko' ? (
                            <>건축주 청구내역서 검토 후<br/>승인 또는 반려</>
                          ) : (
                            <>Approve or reject after<br/>reviewing client billing statement</>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Arrow */}
                    <div className="hidden lg:flex items-center justify-center text-gray-200">
                      <ArrowRight size={20} />
                    </div>

                    {/* Step 4 */}
                    <div className="flex flex-col items-center group">
                      <div className="w-20 h-20 bg-white rounded-3xl shadow-sm border border-gray-100 flex items-center justify-center mb-4 relative z-10 group-hover:bg-gray-900 group-hover:text-white transition-all duration-500">
                        <Wallet size={32} />
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-gray-900 text-white rounded-full text-[10px] font-bold flex items-center justify-center group-hover:bg-white group-hover:text-gray-900 transition-colors">4</div>
                      </div>
                      <div className="text-center">
                        <h6 className="text-sm font-bold text-gray-900 mb-1">{language === 'ko' ? '기성대금 지급' : 'Pay Progress Payment'}</h6>
                        <p className="text-[10px] text-gray-500">
                          {language === 'ko' ? (
                            <>승인된 금액을 전용계좌에<br/>기성대금 지급(현금이체)</>
                          ) : (
                            <>Pay progress payment (cash transfer)<br/>of approved amount to dedicated account</>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Arrow */}
                    <div className="hidden lg:flex items-center justify-center text-gray-200">
                      <ArrowRight size={20} />
                    </div>

                    {/* Step 5 */}
                    <div className="flex flex-col items-center group">
                      <div className="w-20 h-20 bg-white rounded-3xl shadow-sm border border-gray-100 flex items-center justify-center mb-4 relative z-10 group-hover:bg-gray-900 group-hover:text-white transition-all duration-500">
                        <CreditCard size={32} />
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-gray-900 text-white rounded-full text-[10px] font-bold flex items-center justify-center group-hover:bg-white group-hover:text-gray-900 transition-colors">5</div>
                      </div>
                      <div className="text-center">
                        <h6 className="text-sm font-bold text-gray-900 mb-1">{language === 'ko' ? '하도급대금 이체실행' : 'Execute Subcontract Payment Transfer'}</h6>
                        <p className="text-[10px] text-gray-500">
                          {language === 'ko' ? (
                            <>입금된 기성대금을<br/>하도급대금으로 이체</>
                          ) : (
                            <>Transfer deposited progress payment<br/>to subcontract payment</>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Arrow */}
                    <div className="hidden lg:flex items-center justify-center text-gray-200">
                      <ArrowRight size={20} />
                    </div>

                    {/* Step 6 */}
                    <div className="flex flex-col items-center group">
                      <div className="w-20 h-20 bg-gray-900 text-white rounded-3xl shadow-xl flex items-center justify-center mb-4 relative z-10">
                        <Smartphone size={32} />
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-white text-gray-900 rounded-full text-[10px] font-bold flex items-center justify-center border border-gray-900">6</div>
                      </div>
                      <div className="text-center">
                        <h6 className="text-sm font-bold text-gray-900 mb-1">{language === 'ko' ? '지급내역 확인' : 'Check Payment Details'}</h6>
                        <p className="text-[10px] text-gray-500">
                          {language === 'ko' ? (
                            <>지급된 내역 실시간 확인<br/><span className="text-gray-900 font-bold">임의해지 및 인출 제한</span></>
                          ) : (
                            <>Real-time check of paid details<br/><span className="text-gray-900 font-bold">Restriction on arbitrary termination and withdrawal</span></>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-16 bg-gray-50 p-8 rounded-3xl border border-gray-200 text-center">
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {language === 'ko' ? (
                        <>
                          모든 대금은 <strong className="text-gray-900">NICE D&R 노무비닷컴</strong>의 에스크로 시스템을 통해 투명하게 관리되며,<br/>
                          시공사의 임의 인출이 불가능하여 하도급 업체와 노무비의 안전한 지급을 보장합니다.
                        </>
                      ) : (
                        <>
                          All payments are transparently managed through the escrow system of <strong className="text-gray-900">NICE D&R Nomubi.com</strong>, and<br/>
                          arbitrary withdrawal by the construction company is impossible, ensuring safe payment of subcontractors and labor costs.
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      </div>
      
      <ContactCTA />
      <Footer />
    </div>
  );
}