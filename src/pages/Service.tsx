import { useSearchParams } from 'react-router-dom';
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
import FAQ from '../components/FAQ';
import PMTasks from '../components/PMTasks';
import ValueChainMotion from '../components/motion/ValueChainMotion';
import FrameMotionDiagram from '../components/motion/FrameMotionDiagram';
import ServiceProcessMotion from '../components/motion/ServiceProcessMotion';
import PMTriadMotion from '../components/motion/PMTriadMotion';
import AppSimulatorMotion from '../components/motion/AppSimulatorMotion';
import ContractStructureMotion from '../components/motion/ContractStructureMotion';
import SafetyDevicesMotion from '../components/motion/SafetyDevicesMotion';
import EscrowFlowMotion from '../components/motion/EscrowFlowMotion';
import { useLanguage } from '../contexts/LanguageContext';
import { fireSafetyLinkFromService } from '../utils/fireSafetyLanding';

const tabs = [
  { id: 'consulting', label: 'BIG Consulting' },
  { id: 'management', label: 'BIG Management' },
  { id: 'credit', label: 'BIG Credit' }
];

export default function Service() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = tabs.find(tab => tab.id === searchParams.get('tab'))?.id ?? 'consulting';
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
              aria-pressed={activeTab === tab.id}
              onClick={() => {
                const next = new URLSearchParams(searchParams);
                if (tab.id === 'consulting') next.delete('tab');
                else next.set('tab', tab.id);
                setSearchParams(next, { replace: true, preventScrollReset: true });
              }}
              className={`flex-1 px-1 py-3 md:px-8 md:py-4 rounded-xl font-bold text-xs sm:text-sm md:text-base transition-all break-keep ${
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
              {/* 01. Value Chain Motion Diagram */}
              <div className="py-6">
                <div className="text-center mb-10 md:mb-16">
                  <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-4">{language === 'ko' ? '밸류 체인' : 'Value Chain'}</h3>
                  <p className="text-gray-600 leading-relaxed max-w-3xl mx-auto text-sm md:text-base font-medium break-keep">
                    {language === 'ko' ? (
                      <>새로운 공간창조(Buildup), 공간경험개선(Insight), 이익확보(Gains)라는 가치창출을<br className="hidden md:block" />부동산 및 공간 생애주기(Life Cycle)에 맞춰 ‘BIG 컨설팅 솔루션’을 통해 제공합니다.</>
                    ) : (
                      "We provide value creation of new space creation (Buildup), space experience improvement (Insight), and profit securing (Gains) through the 'BIG Consulting Solution' tailored to the real estate and space life cycle."
                    )}
                  </p>
                </div>
                
                {/* Interactive Dynamic Value Chain Reactor */}
                <ValueChainMotion />
              </div>

              {/* 02. Frame Motion Diagram */}
              <div className="py-10 md:py-16 bg-white rounded-3xl border border-gray-100 shadow-sm">
                <div className="text-center mb-10 md:mb-14">
                  <span className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-2 block">02. FRAME ARCHITECTURE</span>
                  <h4 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3">{language === 'ko' ? '프레임 (Frame)' : 'Frame'}</h4>
                  <p className="text-gray-600 leading-relaxed max-w-xl mx-auto text-xs md:text-sm px-4">
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
                
                {/* Interactive Dynamic Frame Diagram */}
                <FrameMotionDiagram />
              </div>

              {/* 03. Process Timeline Motion Diagram */}
              <div className="py-6">
                <div className="text-center mb-10 md:mb-14">
                  <span className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-2 block">03. EXECUTION PIPELINE</span>
                  <h4 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3">{language === 'ko' ? '프로세스 (Process)' : 'Process'}</h4>
                  <p className="text-gray-500 text-xs md:text-sm max-w-xl mx-auto">
                    {language === 'ko' 
                      ? '기획 조사부터 최종 실행까지 단계별로 체계화된 로드맵을 제공합니다.'
                      : 'We provide a systematic roadmap from initial research to final execution.'}
                  </p>
                </div>
                
                {/* Interactive Dynamic Process Motion Pipeline */}
                <ServiceProcessMotion />
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
              {/* PM Service Features Dynamic Motion Triad */}
              <div className="py-6">
                <div className="text-center mb-8 md:mb-12">
                  <span className="text-xs font-bold tracking-widest text-blue-600 uppercase mb-2 block">
                    TOTAL CONSTRUCTION SERVICE
                  </span>
                  <h4 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3">{language === 'ko' ? 'PM 서비스 특장점' : 'PM Service Features'}</h4>
                  <p className="text-xs md:text-sm text-gray-500 max-w-2xl mx-auto">
                    {language === 'ko' ? (
                      <>체계적인 분석과 사업 수익성을 확보할 수 있는 Total Construction Service</>
                    ) : (
                      <>Total Construction Service that secures systematic analysis and business profitability</>
                    )}
                  </p>
                </div>
                
                {/* Interactive Dynamic PM Triad Motion Graphic */}
                <PMTriadMotion />
              </div>

              <section aria-labelledby="tenant-assistant-title" className="grid overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm md:grid-cols-[1.15fr_1fr]">
                <div className="self-center p-6 sm:p-10 lg:p-14">
                  <h3 id="tenant-assistant-title" className="text-3xl font-extrabold tracking-tight text-gray-900 md:text-4xl">
                    {language === 'ko' ? '방재실 AI 민원 도우미' : 'AI Assistant for Building Operations'}
                  </h3>
                  <p className="mt-5 break-keep text-lg leading-relaxed text-gray-700">
                    {language === 'ko'
                      ? '주차 등록처럼 자주 묻는 질문은 AI가 건물 매뉴얼에 따라 답합니다. 냉난방 불편처럼 현장 확인이 필요한 민원은 위치와 연락처를 한 장의 접수 카드로 정리합니다.'
                      : 'AI answers common questions about visitor parking and building services using your building’s manual. For issues that need a site visit, such as insufficient cooling, it brings the location and contact details together on one ticket.'}
                  </p>
                  <p className="mt-3 break-keep text-base leading-relaxed text-gray-600">
                    {language === 'ko'
                      ? '관리자가 같은 카드에서 담당자를 지정하고, 다음 근무자는 교대할 때 접수·전달 이력을 확인합니다.'
                      : 'Managers use the same ticket to assign a team member. The next shift can see what was reported and who received it.'}
                  </p>
                  <a href={fireSafetyLinkFromService(searchParams)}
                    className="mt-7 inline-flex min-h-12 items-center rounded-full bg-gray-900 px-6 py-3 text-base font-bold text-white transition-colors hover:bg-gray-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gray-900">
                    {language === 'ko' ? '서비스 소개 및 데모 보기' : 'Explore the service and demo (Korean)'}
                  </a>
                </div>
                <figure className="relative isolate flex min-h-56 items-end overflow-hidden bg-slate-100 p-5 sm:p-8">
                  <img src="/images/fire-safety-building.webp" alt="" width="1672" height="941" loading="lazy" decoding="async"
                    className="absolute inset-0 -z-10 h-full w-full object-cover object-right" />
                  <figcaption className="rounded-2xl border border-gray-200 bg-white px-5 py-4 text-gray-900 shadow-sm">
                    <span className="block text-sm font-medium text-gray-600">{language === 'ko' ? '민원 예시' : 'Sample ticket'}</span>
                    <strong className="mt-1 block text-lg">{language === 'ko' ? '5층 공용 회의실' : 'Shared meeting room, 5th floor'}</strong>
                    <span className="mt-1 block text-base">{language === 'ko' ? '냉방 불편 · 현장 확인 요청' : 'Insufficient cooling · Site check requested'}</span>
                  </figcaption>
                </figure>
              </section>

              {/* 7-Stage Integrated PM Tasks Roadmap */}
              <PMTasks />

              {/* 02. App Solution Interactive Simulator */}
              <AppSimulatorMotion />
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
                <div className="text-center mb-8 md:mb-12">
                  <span className="text-xs font-bold tracking-widest text-emerald-600 uppercase mb-2 block">
                    01. SAFETY CONTRACT ARCHITECTURE
                  </span>
                  <h4 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3">{language === 'ko' ? '안전계약' : 'Safety Contract'}</h4>
                  <p className="text-gray-600 max-w-3xl mx-auto break-keep px-4 text-xs md:text-sm">
                    {language === 'ko' ? (
                      <>빅플래너파트너스는 건축주(시행사)에게 필요한 특약사항을 모두 고려한 표준계약서를 기준으로<br className="hidden md:block" />전자계약방식으로 착공 전 시공사 및 하청업체와 발생가능한 분쟁을 대비합니다.</>
                    ) : (
                      <>BIGPLANNER PARTNERS prepares for possible disputes with construction companies and subcontractors before construction begins through an electronic contract method based on a standard contract that considers all special conditions necessary for the client (developer).</>
                    )}
                  </p>
                </div>

                {/* Interactive Dynamic Contract Structure Comparison Motion Graphic */}
                <ContractStructureMotion />

                {/* 8-Fold Safety Devices Interactive Shield Matrix */}
                <SafetyDevicesMotion />
              </div>

              {/* 02. 대금관리 Section - Dynamic Escrow Motion Graphic */}
              <div className="pt-12 border-t border-gray-100">
                <div className="text-center mb-8 md:mb-12">
                  <h3 className="text-sm font-bold tracking-widest text-gray-400 uppercase mb-3">02. Payment Management</h3>
                  <h4 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-4">{language === 'ko' ? '대금관리 프로세스' : 'Payment Management Process'}</h4>
                  <p className="text-gray-600 max-w-2xl mx-auto break-keep px-4 text-xs md:text-sm">
                    {language === 'ko' ? (
                      <>NICE D&R 노무비닷컴과 업무제휴하여<br className="hidden md:block" />에스크로 방식으로 공사대금을 안전하게 관리합니다.</>
                    ) : (
                      <>We safely manage construction costs in an escrow method<br className="hidden md:block" />through business alliance with NICE D&R Nomubi.com.</>
                    )}
                  </p>
                </div>

                {/* Interactive Dynamic Escrow Pipeline */}
                <EscrowFlowMotion />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      </div>
      
      <FAQ surface="white" />
      <ContactCTA />
      <Footer />
    </div>
  );
}
