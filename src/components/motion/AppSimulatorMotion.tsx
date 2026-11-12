import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Smartphone, CheckSquare, Users, MessageSquare, 
  Camera, AlertCircle, CheckCircle2, Menu, X, ArrowRight, 
  Activity, ShieldCheck, Sparkles 
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export default function AppSimulatorMotion() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'monitoring' | 'progress' | 'chat'>('monitoring');

  const features = [
    {
      id: 'monitoring',
      icon: Smartphone,
      titleKo: "실시간 현장 모니터링",
      titleEn: "Real-time Site Monitoring",
      descKo: "언제 어디서나 스마트폰으로 현장 상황과 시공 사진, 일일 감리 일지를 실시간으로 확인하고 관리할 수 있습니다.",
      descEn: "Check and manage site status, photos, and daily logs anytime, anywhere with your smartphone.",
      tag: "LIVE MONITORING"
    },
    {
      id: 'progress',
      icon: CheckSquare,
      titleKo: "투명한 공정 관리",
      titleEn: "Transparent Process Management",
      descKo: "공정률, 자재 투입 현황, 노무 인력 등 모든 핵심 시공 데이터를 투명하게 100% 공개하여 신뢰를 높입니다.",
      descEn: "100% transparent disclosure of process rate, materials, and labor data to maximize trust.",
      tag: "DIGITAL PROCESS"
    },
    {
      id: 'chat',
      icon: Users,
      titleKo: "빠른 의사소통 및 피드백",
      titleEn: "Fast Communication & Feedback",
      descKo: "현장 소장 및 전담 PM과 앱 내 전용 채널에서 즉각 소통하고, 시공 승인 및 설계 피드백을 지체 없이 처리합니다.",
      descEn: "Communicate directly with site managers and PMs for instant approvals and design feedback.",
      tag: "INSTANT FEEDBACK"
    }
  ];

  return (
    <div className="bg-white py-12 md:py-20 rounded-3xl md:rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
      {/* Section Header */}
      <div className="text-center mb-12 md:mb-16">
        <span className="text-xs font-bold tracking-widest text-blue-600 uppercase mb-2 block">
          SMART PROPTECH APP SOLUTION
        </span>
        <h4 className="text-2xl md:text-3xl font-black text-gray-900 mb-3">
          {language === 'ko' ? '건축비서 APP 특장점' : 'Architecture Secretary APP Features'}
        </h4>
        <p className="text-xs md:text-sm text-gray-500 max-w-2xl mx-auto break-keep px-4">
          {language === 'ko' ? (
            <>빅플래너파트너스의 시공관리는 ‘건축비서 app’을 통해<br className="hidden md:block" />실시간으로 투명하게 관리하실 수 있습니다. 직접 탭을 클릭하여 앱 화면을 체험해 보세요.</>
          ) : (
            <>BIGPLANNER PARTNERS' construction management can be transparently managed in real-time<br className="hidden md:block" />through the 'Architecture Secretary app'. Click tabs to interact with the live phone screen.</>
          )}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-16 max-w-6xl mx-auto px-4">
        
        {/* Left: Interactive Feature Selectors */}
        <div className="flex-1 space-y-4 w-full">
          {features.map((feat) => {
            const Icon = feat.icon;
            const isSelected = activeTab === feat.id;

            return (
              <motion.button
                key={feat.id}
                onClick={() => setActiveTab(feat.id as any)}
                whileHover={{ scale: 1.01 }}
                className={`w-full p-6 rounded-2xl text-left transition-all duration-300 border flex items-start gap-4 ${
                  isSelected
                    ? 'bg-gray-900 text-white shadow-xl border-gray-900 ring-4 ring-gray-900/10'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                  isSelected ? 'bg-white text-gray-900 shadow-md' : 'bg-gray-100 text-gray-800'
                }`}>
                  <Icon size={24} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-mono font-bold tracking-wider uppercase ${
                      isSelected ? 'text-blue-300' : 'text-gray-500'
                    }`}>
                      {feat.tag}
                    </span>
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      isSelected ? 'bg-emerald-400 animate-ping' : 'bg-gray-300'
                    }`} />
                  </div>

                  <h5 className="text-base md:text-lg font-bold mb-1 leading-snug">
                    {language === 'ko' ? feat.titleKo : feat.titleEn}
                  </h5>

                  <p className={`text-xs sm:text-sm leading-relaxed font-medium ${
                    isSelected ? 'text-gray-200' : 'text-gray-600'
                  }`}>
                    {language === 'ko' ? feat.descKo : feat.descEn}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Right: Live Interactive Smartphone Simulator */}
        <div className="relative w-84 sm:w-[350px] h-[650px] bg-gray-950 rounded-[3.5rem] border-[10px] border-gray-900 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)] flex-shrink-0 overflow-hidden">
          {/* Dynamic Island / Notch */}
          <div className="absolute top-0 inset-x-0 h-6 bg-gray-900 rounded-b-2xl w-32 mx-auto z-30 flex items-center justify-center">
            <div className="w-12 h-2.5 bg-black rounded-full flex items-center justify-end px-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          </div>
          
          {/* Phone Screen Container */}
          <div className="absolute inset-0 bg-white flex flex-col z-10 pt-6">
            
            {/* App Top Bar */}
            <div className="bg-gray-900 p-5 pt-4 text-white">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs tracking-widest font-mono font-bold text-blue-400">BIGPLANNER APP</span>
                <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full font-mono flex items-center gap-1.5 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  LIVE ON-SITE
                </span>
              </div>
              <h6 className="text-base font-bold">방배동 복합주택 신축공사</h6>
              <p className="text-white/70 text-xs mt-1">현장대리인: 김철수 소장 · PM: 최정우</p>

              {/* In-app Simulator Navigation Tabs */}
              <div className="flex items-center gap-1.5 mt-3.5 bg-white/10 p-1.5 rounded-xl text-xs font-bold">
                <button
                  onClick={() => setActiveTab('monitoring')}
                  className={`flex-1 py-1.5 rounded-lg transition-colors ${
                    activeTab === 'monitoring' ? 'bg-white text-gray-900 shadow' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  현장사진
                </button>
                <button
                  onClick={() => setActiveTab('progress')}
                  className={`flex-1 py-1.5 rounded-lg transition-colors ${
                    activeTab === 'progress' ? 'bg-white text-gray-900 shadow' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  공정률
                </button>
                <button
                  onClick={() => setActiveTab('chat')}
                  className={`flex-1 py-1.5 rounded-lg transition-colors ${
                    activeTab === 'chat' ? 'bg-white text-gray-900 shadow' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  채팅피드백
                </button>
              </div>
            </div>

            {/* App Screen Content with Dynamic Transitions */}
            <div className="flex-1 p-4 bg-gray-50 overflow-y-auto">
              <AnimatePresence mode="wait">
                
                {/* 1. Monitoring View */}
                {activeTab === 'monitoring' && (
                  <motion.div
                    key="monitoring"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-3.5"
                  >
                    <div className="bg-white p-3.5 rounded-2xl shadow-sm border border-gray-100">
                      <div className="flex justify-between items-center mb-2.5">
                        <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                          <Camera size={14} className="text-blue-600" />
                          실시간 현장 감리 포토 (14:30)
                        </span>
                        <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-mono font-bold">
                          지상 3층 골조
                        </span>
                      </div>
                      <div className="relative aspect-video bg-gray-900 rounded-xl overflow-hidden shadow-inner flex items-center justify-center">
                        <img 
                          src="https://images.unsplash.com/photo-1541888946425-d0fbb1861563?q=80&w=800&auto=format&fit=crop" 
                          alt="Live Construction Site" 
                          className="w-full h-full object-cover opacity-90"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm text-white px-2.5 py-1 rounded text-xs font-mono flex items-center gap-1.5 font-bold">
                          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                          CAM-01 골조타설 진행중
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 space-y-2">
                      <span className="text-xs font-bold text-gray-500 block uppercase">일일 감리 요약</span>
                      <div className="text-xs sm:text-sm text-gray-800 space-y-1.5 font-medium">
                        <p className="flex items-center gap-2">
                          <CheckCircle2 size={15} className="text-emerald-500 flex-shrink-0" />
                          철근 배근 간격 실측 검사 합격
                        </p>
                        <p className="flex items-center gap-2">
                          <CheckCircle2 size={15} className="text-emerald-500 flex-shrink-0" />
                          콘크리트 슬럼프 및 염화물 시험 통과
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 2. Process View */}
                {activeTab === 'progress' && (
                  <motion.div
                    key="progress"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-3.5"
                  >
                    {/* Overall Progress Gauge */}
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-gray-500">전체 공정률</span>
                        <span className="text-base font-black text-gray-900">78.4% (정상)</span>
                      </div>
                      <div className="w-full h-3.5 bg-gray-100 rounded-full overflow-hidden p-0.5">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-gray-900 to-blue-600 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: "78.4%" }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-2 font-medium">
                        <span>계획 대비 +1.2% 조기 진행</span>
                        <span>준공예정: 2024.11</span>
                      </div>
                    </div>

                    {/* Stats 2-grid */}
                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="bg-white p-3.5 rounded-2xl shadow-sm border border-gray-100">
                        <span className="text-xs text-gray-500 block font-medium">오늘 투입 인력</span>
                        <span className="text-lg font-black text-gray-900">14명</span>
                        <span className="text-xs text-emerald-600 font-bold block mt-0.5">철근 8 · 형틀 6</span>
                      </div>
                      <div className="bg-white p-3.5 rounded-2xl shadow-sm border border-gray-100">
                        <span className="text-xs text-gray-500 block font-medium">안전/하자 특이사항</span>
                        <span className="text-lg font-black text-emerald-600">0건</span>
                        <span className="text-xs text-gray-500 block mt-0.5 font-medium">무재해 182일차</span>
                      </div>
                    </div>

                    {/* Milestone Item List */}
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 space-y-2.5">
                      <span className="text-xs font-bold text-gray-500 block uppercase">공종별 진척률</span>
                      <div className="space-y-2 text-xs font-medium">
                        <div className="flex justify-between">
                          <span className="text-gray-700">토공사 및 기초</span>
                          <span className="font-bold text-emerald-600">100% 완료</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700">골조 구조체 공사</span>
                          <span className="font-bold text-blue-600">85% 진행</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700">외벽 마감 및 창호</span>
                          <span className="font-bold text-gray-500">착수 예정</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 3. Instant Chat / Feedback View */}
                {activeTab === 'chat' && (
                  <motion.div
                    key="chat"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-3"
                  >
                    {/* Site Manager Message */}
                    <div className="bg-white p-3.5 rounded-2xl shadow-sm border border-gray-100 text-xs leading-relaxed">
                      <div className="flex items-center justify-between text-gray-500 mb-1">
                        <span className="font-bold text-gray-900">김철수 현장소장</span>
                        <span className="font-mono">14:32</span>
                      </div>
                      <p className="text-gray-800">3층 슬래브 레미콘 타설 검사 완료했습니다. 승인 부탁드립니다.</p>
                    </div>

                    {/* PM Verification Message */}
                    <div className="bg-blue-50 p-3.5 rounded-2xl border border-blue-100 text-xs leading-relaxed">
                      <div className="flex items-center justify-between text-blue-800 mb-1">
                        <span className="font-bold">빅플래너 PM 최정우</span>
                        <span className="font-mono">14:35</span>
                      </div>
                      <p className="text-blue-950 font-medium">현장 강도 시험치 기준 충족 확인 완료. 건축주 승인 후 대금 지출 결재 진행하겠습니다.</p>
                    </div>

                    {/* Client Approval Action Card */}
                    <div className="bg-gray-900 text-white p-3.5 rounded-2xl shadow-md text-xs space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-blue-300">건축주 실시간 승인 요청</span>
                        <span className="bg-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded text-xs font-bold">대기중</span>
                      </div>
                      <p className="text-gray-200">골조공사 3회차 기성 검수 승인</p>
                      <button className="w-full py-2 rounded-lg bg-emerald-500 text-white font-bold text-center hover:bg-emerald-600 transition-colors shadow">
                        전자서명 즉시 승인
                      </button>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>

            {/* App Bottom Bar */}
            <div className="bg-white p-3.5 border-t border-gray-100 flex items-center justify-around text-gray-500 text-xs font-semibold">
              <span className="text-gray-900 font-bold">홈</span>
              <span>현장CCTV</span>
              <span>기성청구</span>
              <span>설정</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
