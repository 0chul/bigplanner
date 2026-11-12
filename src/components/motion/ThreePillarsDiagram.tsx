import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Shield, Smartphone, Landmark, Sparkles, Building, Layers, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export default function ThreePillarsDiagram() {
  const { language } = useLanguage();
  const [activePillar, setActivePillar] = useState<number | null>(null);

  const pillars = [
    {
      id: 0,
      titleKo: "BIG Consulting",
      titleEn: "BIG Consulting",
      tagKo: "투자 및 전략 기획",
      tagEn: "Investment & Strategy",
      summaryKo: "안정성과 고수익을 목표로 고객 권익을 극대화하는 종합 자문",
      summaryEn: "Comprehensive advisory maximizing client interests aiming for stability and high returns",
      icon: Building,
      accent: "#3b82f6",
      itemsKo: [
        "안정성과 고수익을 목표로 다양한 기업과 연계한 고객 권익 극대화",
        "고객에게 필요한 자금에 맞춰진 체계적인 금융기획 (PF, 브릿지론, 담보대출)",
        "분양과 임차를 빠르고 정확하게 연결해 주는 입체적인 상권/공간 마케팅",
        "매입·매각 자문 및 최유효 부지 개발 솔루션 도출"
      ],
      itemsEn: [
        "Maximizing client rights and interests in connection with various companies aiming for stability and high returns",
        "Systematic financial planning tailored to client funds (PF, Bridge loan, Mortgage)",
        "Three-dimensional marketing quickly and accurately connecting sales and leases",
        "Advisory on purchase/sale and optimal site development solutions"
      ],
      metricsKo: "기획 적중률 99%",
      metricsEn: "99% Planning Accuracy"
    },
    {
      id: 1,
      titleKo: "BIG Management",
      titleEn: "BIG Management",
      tagKo: "통합 PM & 디지털 시공관리",
      tagEn: "Integrated PM & Construction",
      summaryKo: "완벽한 기획부터 시공까지 전과정을 건축주 관점에서 완벽 대행",
      summaryEn: "Acting on behalf of the owner throughout the entire journey from design to build",
      icon: Smartphone,
      accent: "#10b981",
      itemsKo: [
        "완벽한 기획을 바탕으로 디자인부터 시공까지 효율적이고 효과적인 개발운영",
        "체계적이고 꼼꼼한 시공관리용 '건축비서 APP' 기반으로 건축주의 권익 보호",
        "PM 서비스 특장점: 체계적인 분석과 사업 수익성을 확보할 수 있는 Total Construction Service",
        "실시간 현장 감리/공정률/자재 투입 내역 투명 공개 및 분쟁 원천 차단"
      ],
      itemsEn: [
        "Efficient and effective development operation from design to construction based on perfect planning",
        "Protecting the rights and interests of the client based on the 'Architecture Secretary APP'",
        "PM Service Advantages: Total Construction Service that secures systematic analysis and business profitability",
        "Transparent real-time site monitoring, process rate, and material input data"
      ],
      metricsKo: "시공오차 Zero화",
      metricsEn: "Zero Construction Error"
    },
    {
      id: 2,
      titleKo: "BIG Credit",
      titleEn: "BIG Credit",
      tagKo: "8대 안전계약 & 에스크로",
      tagEn: "Safety Contract & Escrow",
      summaryKo: "공사비 유용 방지 및 유치권 위험을 원천 차단하는 신용 안전망",
      summaryEn: "Credit safety net completely preventing fund misappropriation and lien risks",
      icon: Shield,
      accent: "#8b5cf6",
      itemsKo: [
        "우량 시공사 및 하도급 업체 Pool을 기반으로 최적의 경쟁입찰 시공업체 선정",
        "시공과정에서 발생 가능한 Risk를 사전에 예방할 수 있는 8대 안전장치 체결",
        "NICE D&R 노무비닷컴 에스크로(Escrow) 방식을 통한 투명한 대금결제 운영",
        "유치권 포기각서 및 시공대표자 연대보증으로 책임준공 담보"
      ],
      itemsEn: [
        "Selecting the optimal construction company based on a pool of excellent builders and subcontractors",
        "Signing 8 comprehensive safety contract devices to prevent construction risks in advance",
        "Transparent payment operation through NICE D&R Nomubi.com escrow method",
        "Lien waiver and joint guarantee by builder representatives ensuring reliable completion"
      ],
      metricsKo: "대금 사고 0건",
      metricsEn: "Zero Payment Loss"
    }
  ];

  return (
    <div className="max-w-5xl mx-auto pt-6">
      {/* Structural Roof (BIG PLAN) */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950 text-white p-7 md:p-9 rounded-t-3xl text-center shadow-2xl relative z-20 border-b border-gray-800"
      >
        <div className="absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
          <span className="text-xs tracking-widest text-blue-300 font-bold uppercase">
            ARCHITECTURAL VALUE STRUCTURE
          </span>
        </div>

        <h5 className="text-2xl md:text-3xl font-extrabold tracking-widest mt-2 text-white">
          BIG PLAN
        </h5>
        
        <p className="text-gray-300 text-xs md:text-sm mt-1 font-medium">
          {language === 'ko' 
            ? '고객의 성공적인 부동산 개발 및 운영을 지탱하는 3대 핵심 기둥' 
            : 'Three Core Pillars Supporting Successful Real Estate Development & Operation'}
        </p>

        {/* Dynamic Beam Connectors underneath roof */}
        <div className="absolute -bottom-3 inset-x-8 hidden md:flex justify-around pointer-events-none">
          <div className="w-6 h-3 bg-gray-800 rounded-b-md border-x border-b border-gray-600 shadow" />
          <div className="w-6 h-3 bg-gray-800 rounded-b-md border-x border-b border-gray-600 shadow" />
          <div className="w-6 h-3 bg-gray-800 rounded-b-md border-x border-b border-gray-600 shadow" />
        </div>
      </motion.div>

      {/* 3 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 pt-4 relative z-10 px-2 md:px-0">
        {pillars.map((pillar, idx) => {
          const Icon = pillar.icon;
          const isHovered = activePillar === idx;

          return (
            <motion.div
              key={pillar.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15, duration: 0.5 }}
              onMouseEnter={() => setActivePillar(idx)}
              onMouseLeave={() => setActivePillar(null)}
              animate={{
                y: isHovered ? -8 : 0,
              }}
              className={`bg-white rounded-2xl md:rounded-b-3xl p-6 md:p-8 flex flex-col justify-between transition-all duration-300 border relative ${
                isHovered
                  ? 'border-gray-900 shadow-2xl ring-2 ring-gray-900/10'
                  : 'border-gray-200 shadow-md hover:border-gray-300'
              }`}
            >
              {/* Top Accent Line */}
              <div 
                className={`h-1.5 rounded-full mb-6 transition-all duration-300 ${
                  isHovered ? 'bg-gray-900' : 'bg-gray-200'
                }`}
              />

              <div>
                {/* Pillar Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                    isHovered ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'
                  }`}>
                    <Icon size={24} />
                  </div>
                  <span className="text-xs font-bold tracking-wider px-3 py-1 rounded-full bg-gray-100 text-gray-800 border border-gray-200">
                    {language === 'ko' ? pillar.metricsKo : pillar.metricsEn}
                  </span>
                </div>

                <span className="text-xs font-bold tracking-wider text-blue-600 uppercase block mb-1">
                  PILLAR 0{idx + 1} · {language === 'ko' ? pillar.tagKo : pillar.tagEn}
                </span>

                <h6 className="text-xl md:text-2xl font-black text-gray-900 mb-2">
                  {pillar.titleKo}
                </h6>

                <p className="text-sm text-gray-600 font-medium leading-relaxed mb-6">
                  {language === 'ko' ? pillar.summaryKo : pillar.summaryEn}
                </p>

                {/* Pillar Items */}
                <ul className="space-y-3.5 mb-6">
                  {(language === 'ko' ? pillar.itemsKo : pillar.itemsEn).map((item, i) => (
                    <li key={i} className="flex items-start text-sm text-gray-800 leading-relaxed font-medium">
                      <CheckCircle2 
                        className={`mt-0.5 mr-2.5 flex-shrink-0 transition-colors ${
                          isHovered ? 'text-blue-600' : 'text-gray-400'
                        }`} 
                        size={17} 
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bottom Pillar Footing Indicator */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600 font-semibold">
                <span>{language === 'ko' ? '지탱 영역' : 'Support Scope'}</span>
                <span className="font-extrabold text-gray-900 text-xs md:text-sm">
                  {idx === 0 ? '기획·금융·수지' : idx === 1 ? '시공·감리·품질' : '신용·안전·대금'}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Structural Bedrock Foundation */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mt-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 p-5 rounded-2xl text-center border-t-4 border-gray-400 shadow-inner flex flex-col md:flex-row items-center justify-between px-6 md:px-10 gap-3"
      >
        <div className="flex items-center gap-2">
          <Layers size={18} className="text-gray-600" />
          <span className="text-xs md:text-sm font-black text-gray-800 tracking-wider">
            BIGPLANNER PARTNERS FOUNDATION
          </span>
        </div>
        <p className="text-xs md:text-sm text-gray-700 font-medium">
          {language === 'ko'
            ? '건축주의 자산과 개발사업을 흔들림 없이 지탱하는 탄탄한 제도적·기술적 기반'
            : 'Firm institutional and technical foundation securely supporting clients’ assets and development projects'}
        </p>
      </motion.div>
    </div>
  );
}
