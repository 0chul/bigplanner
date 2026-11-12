import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Briefcase, Building2, Smartphone, ShieldCheck, UserCheck, ChevronRight, Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function OrganizationChart() {
  const { language } = useLanguage();
  const [activeBu, setActiveBu] = useState<number | null>(null);

  const teams = {
    ko: [
      { 
        name: "사업운영 BU", 
        desc: "부동산 투자 및 프로젝트 총괄",
        icon: Briefcase,
        sub: ["부동산금융팀", "PM사업 1팀", "PM사업 2팀"],
        focus: "사업타당성 분석 / PF 및 금융기획 / 총괄 PM 관리"
      },
      { 
        name: "건축기획 BU", 
        desc: "공간기획 및 설계 디자인 총괄",
        icon: Building2,
        sub: ["디자인팀", "설계 1팀", "설계 2팀"],
        focus: "상권 맞춤형 공간기획 / 인허가 검토 / 실시설계 감리"
      },
      { 
        name: "앱 개발운영 BU", 
        desc: "스마트 건축비서 솔루션 연구개발",
        icon: Smartphone,
        sub: ["앱 개발팀", "앱 운영팀"],
        focus: "건축비서 App 개발 / 실시간 공정 데이터 파이프라인 / 고객 모니터링"
      },
      { 
        name: "CoBIZ BU", 
        desc: "부동산 중개 및 시공 현장 대행",
        icon: Users,
        sub: ["부동산중개팀", "건축시공팀", "행정대행팀"],
        focus: "우량 시공사 네트워크 / 현장 시공감리 대행 / 인허가 행정 원스톱"
      },
      { 
        name: "경영지원", 
        desc: "재무·법무·홍보 전략 지원",
        icon: ShieldCheck,
        sub: ["인사총무팀", "회계세무팀", "홍보마케팅팀"],
        focus: "에스크로 자금관리 / 8대 안전계약 법무 / 브랜딩 및 분양 홍보"
      },
    ],
    en: [
      { 
        name: "Business Operation BU", 
        desc: "Real Estate Investment & Project Management",
        icon: Briefcase,
        sub: ["Real Estate Finance Team", "PM Business Team 1", "PM Business Team 2"],
        focus: "Feasibility Analysis / PF & Finance / Total PM Coordination"
      },
      { 
        name: "Architecture Planning BU", 
        desc: "Space Planning & Design Leadership",
        icon: Building2,
        sub: ["Design Team", "Design Team 1", "Design Team 2"],
        focus: "Targeted Space Planning / Zoning & Permits / Execution Review"
      },
      { 
        name: "App Dev & Ops BU", 
        desc: "Smart Construction Secretary R&D",
        icon: Smartphone,
        sub: ["App Dev Team", "App Ops Team"],
        focus: "Architecture Secretary App / Real-time Site Pipelines / Client Hub"
      },
      { 
        name: "CoBIZ BU", 
        desc: "Real Estate Brokerage & Field Agency",
        icon: Users,
        sub: ["Real Estate Brokerage Team", "Construction Team", "Admin Agency Team"],
        focus: "Prime Contractor Network / On-site Agency / One-stop Admin"
      },
      { 
        name: "Management Support", 
        desc: "Finance, Legal, & PR Strategic Support",
        icon: ShieldCheck,
        sub: ["HR & General Affairs Team", "Accounting & Tax Team", "PR & Marketing Team"],
        focus: "Escrow Fund Oversight / 8 Safety Contracts / Branding & PR"
      },
    ]
  };

  const currentTeams = teams[language as keyof typeof teams] || teams.ko;

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 via-white to-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-xs font-bold tracking-widest text-gray-500 uppercase block mb-2">
            ORGANIZATIONAL STRUCTURE
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            {language === 'ko' ? '조직도' : 'Organization Chart'}
          </h2>
          <p className="text-sm md:text-base text-gray-600 max-w-xl mx-auto">
            {language === 'ko'
              ? '전문성과 신속한 의사결정을 바탕으로 유기적으로 연결된 빅플래너파트너스의 조직 체계입니다.'
              : 'The organizational system of BIGPLANNER PARTNERS organically connected on expertise and swift decision making.'}
          </p>
        </div>

        {/* Dynamic Interactive Organization Tree */}
        <div className="relative max-w-6xl mx-auto">
          
          {/* CEO Node */}
          <div className="flex flex-col items-center justify-center relative z-20 mb-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              className="relative w-44 h-44 rounded-full bg-gradient-to-b from-gray-950 via-gray-900 to-gray-800 text-white flex flex-col items-center justify-center shadow-2xl border-4 border-white cursor-pointer group"
            >
              {/* Outer decorative orbit */}
              <motion.div 
                className="absolute inset-[-6px] rounded-full border-2 border-dashed border-gray-400/40 pointer-events-none"
                animate={{ rotate: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              />
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-1 text-blue-400">
                <UserCheck size={22} />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-blue-400">LEADERSHIP</span>
              <span className="text-xl md:text-2xl font-black tracking-tight mt-0.5">{language === 'ko' ? '대표이사' : 'CEO'}</span>
              <span className="text-xs text-gray-300 font-medium mt-1">Chief Executive Officer</span>
            </motion.div>
          </div>

          {/* SVG Animated Circuit Distribution Tree */}
          <div className="relative hidden lg:block h-20 -my-4 z-10 pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 1000 80" fill="none">
              <defs>
                <linearGradient id="treePulse" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#111827" stopOpacity="0.3" />
                  <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#111827" stopOpacity="0.3" />
                </linearGradient>
              </defs>

              {/* Main Vertical trunk from CEO */}
              <line x1="500" y1="0" x2="500" y2="40" stroke="#cbd5e1" strokeWidth="2" />
              
              {/* Horizontal Distribution Beam */}
              <line x1="100" y1="40" x2="900" y2="40" stroke="#cbd5e1" strokeWidth="2" />
              
              {/* 5 Downward Drops to each BU card */}
              {[100, 300, 500, 700, 900].map((x, i) => (
                <g key={i}>
                  <line 
                    x1={x} y1="40" x2={x} y2="80" 
                    stroke={activeBu === i ? "#111827" : "#cbd5e1"} 
                    strokeWidth={activeBu === i ? "3" : "2"} 
                  />
                  <circle 
                    cx={x} cy="40" r="4" 
                    fill={activeBu === i ? "#3b82f6" : "#94a3b8"} 
                  />
                </g>
              ))}

              {/* Pulse particle along trunk */}
              <motion.circle
                r="3"
                fill="#3b82f6"
                animate={{
                  cy: [0, 40],
                  cx: 500,
                  opacity: [0, 1, 0]
                }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              />
            </svg>
          </div>

          {/* Teams Grid (5 Business Units) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 relative z-20">
            {currentTeams.map((team, idx) => {
              const Icon = team.icon;
              const isSelected = activeBu === idx;

              return (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  onMouseEnter={() => setActiveBu(idx)}
                  onMouseLeave={() => setActiveBu(null)}
                  onClick={() => setActiveBu(isSelected ? null : idx)}
                  animate={{
                    y: isSelected ? -6 : 0,
                  }}
                  className={`flex flex-col rounded-2xl bg-white border transition-all duration-300 overflow-hidden cursor-pointer ${
                    isSelected 
                      ? 'border-gray-900 shadow-xl ring-2 ring-gray-900/10' 
                      : 'border-gray-200 shadow-sm hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  {/* Card Header */}
                  <div className={`p-4 transition-colors flex items-center justify-between ${
                    isSelected ? 'bg-gray-900 text-white' : 'bg-gray-800 text-white'
                  }`}>
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                        <Icon size={18} className="text-gray-200" />
                      </div>
                      <span className="font-bold text-base tracking-tight">{team.name}</span>
                    </div>
                    <span className="text-xs text-gray-300 font-mono font-bold">0{idx + 1}</span>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-xs text-gray-600 font-medium mb-3 leading-relaxed">
                        {team.desc}
                      </p>
                      
                      {/* Sub-teams list */}
                      <div className="space-y-1.5">
                        {team.sub.map((sub, sIdx) => (
                          <div 
                            key={sIdx} 
                            className={`text-xs sm:text-sm py-1.5 px-3 rounded-lg font-medium transition-colors flex items-center justify-between ${
                              isSelected ? 'bg-blue-50 text-blue-950 font-semibold' : 'bg-gray-50 text-gray-700'
                            }`}
                          >
                            <span>{sub}</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Focus Area Footer */}
                    <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500 leading-tight">
                      <span className="font-bold text-gray-700 block mb-0.5">핵심 역량</span>
                      <span>{team.focus}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
