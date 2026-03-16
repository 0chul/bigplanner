import { motion } from 'motion/react';
import { Target, Shield, Briefcase, CheckCircle2, Building2, Lightbulb, TrendingUp, ArrowRight, ArrowDown } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ContactCTA from '../components/ContactCTA';
import OrganizationChart from '../components/OrganizationChart';

export default function About() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop" 
            alt="Architecture Background" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-sm font-bold tracking-widest text-gray-400 uppercase mb-4">About Us</h1>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              부동산과 공간 가치를 높이는<br />프롭테크 기업
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl leading-relaxed">
              고객의 부동산과 공간가치를 높이기 위해 BIGPLANNER PARTNERS만의 투자분석과 PM시스템으로 중소형 신축 및 부동산 개발의 불확실함, 불편함, 불안함을 해소합니다.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-sm font-bold tracking-widest text-gray-500 uppercase mb-4">Philosophy</h2>
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-6">
                부동산과 공간가치 창출을 위해<br />고객의 PAIN POINT를 해결합니다.
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                고객의 부동산과 공간가치를 높이기 위해 BIGPLANNER PARTNERS만의 투자분석과 PM시스템으로 중소형 신축 및 부동산 개발의 불확실함, 불편함, 불안함을 해소합니다.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-w-4 aspect-h-5 sm:aspect-w-16 sm:aspect-h-9 lg:aspect-w-4 lg:aspect-h-5">
                <img 
                  src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1931&auto=format&fit=crop" 
                  alt="Architecture" 
                  className="object-cover rounded-2xl shadow-2xl grayscale"
                  referrerPolicy="no-referrer"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-sm font-bold tracking-widest text-gray-500 uppercase mb-4">Vision</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900">우리의 비전과 가치</h3>
          </div>

          <div className="space-y-32">
            
            {/* 01. Our Mission - Diagram */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex flex-col items-center mb-12">
                <div className="w-16 h-16 bg-gray-900 text-white rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                  <Target size={32} />
                </div>
                <h4 className="text-3xl font-bold text-gray-900 mb-4">01. Our Mission</h4>
                <p className="text-xl font-medium text-gray-600 text-center max-w-2xl">
                  빅플래너파트너스는 부동산과 공간 가치를 높이는 프롭테크 기업입니다.
                </p>
              </div>

              {/* Mission Diagram */}
              <div className="relative max-w-4xl mx-auto">
                {/* Central Node */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 hidden md:flex flex-col items-center justify-center w-48 h-48 bg-gray-900 text-white rounded-full shadow-2xl border-8 border-gray-50">
                  <span className="font-bold text-xl tracking-wider">BIGPLANNER</span>
                  <span className="text-sm text-gray-300">PARTNERS</span>
                </div>

                {/* Connecting Lines */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 hidden md:block z-0"></div>
                <div className="absolute top-0 left-1/2 w-1 h-full bg-gray-200 -translate-x-1/2 hidden md:block z-0"></div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-32 relative z-10">
                  <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 flex flex-col items-center text-center transform md:-translate-y-8 hover:-translate-y-10 transition-transform">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-900"><TrendingUp size={24} /></div>
                    <p className="font-bold text-gray-900">중소형 부동산의 투자수익 극대화<br/>사업개발 및 안정적인 사업운영 지원</p>
                  </div>
                  <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 flex flex-col items-center text-center transform md:-translate-y-8 hover:-translate-y-10 transition-transform">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-900"><Building2 size={24} /></div>
                    <p className="font-bold text-gray-900">최적의 사업수지를 확보할 수 있는<br/>공간기획 제안</p>
                  </div>
                  <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 flex flex-col items-center text-center transform md:translate-y-8 hover:translate-y-6 transition-transform">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-900"><Target size={24} /></div>
                    <p className="font-bold text-gray-900">각 분야 전문가들의 네트워크를<br/>기반으로 사업 완수</p>
                  </div>
                  <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 flex flex-col items-center text-center transform md:translate-y-8 hover:translate-y-6 transition-transform">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-900"><Lightbulb size={24} /></div>
                    <p className="font-bold text-gray-900">고객의 선택이 최고의 결과를<br/>만들 수 있는 솔루션 제공</p>
                  </div>
                </div>
              </div>
              <div className="mt-16 max-w-3xl mx-auto text-center">
                <p className="text-gray-600 leading-relaxed bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  부동산과 공간의 개발 및 운영에 있어서 신뢰할 수 있는 업무파트너를 만나는 것은 중요합니다. 고객의 Needs에 부합하는 부동산 및 공간 가치창출 서비스를 제공하여 자산가치 극대화를 추구합니다. 고객이 보유 또는 사용하고 있는 모든 유형의 토지, 건축물과 공간에 대해 기획, 건축, 금융 전문가들이 최적의 의사결정을 지원합니다. 빅플래너파트너스를 통해 고객은 업무효율성과 사업수익성을 향상시킬 수 있습니다.
                </p>
              </div>
            </motion.div>

            {/* 02. Our Values - Diagram */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex flex-col items-center mb-12">
                <div className="w-16 h-16 bg-gray-900 text-white rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                  <Shield size={32} />
                </div>
                <h4 className="text-3xl font-bold text-gray-900 mb-4">02. Our Values</h4>
                <p className="text-xl font-medium text-gray-600 text-center max-w-2xl">
                  빅플래너파트너스는 신축 및 부동산 개발의 BIG Risk 세 가지를 해소합니다.
                </p>
              </div>

              {/* Risk Resolution Diagram */}
              <div className="max-w-5xl mx-auto">
                <div className="flex flex-col md:flex-row gap-6 items-stretch justify-center">
                  
                  {/* Risk 1 */}
                  <div className="flex-1 flex flex-col items-center group">
                    <div className="w-full bg-gray-100 p-6 rounded-t-2xl border-b-4 border-gray-300 text-center transition-colors group-hover:bg-gray-200">
                      <h5 className="font-bold text-gray-500 mb-1">BIG RISK 1</h5>
                      <h6 className="text-2xl font-black text-gray-900">불확실함</h6>
                    </div>
                    <div className="py-4 text-gray-400">
                      <ArrowDown size={24} className="md:hidden" />
                      <ArrowDown size={24} className="hidden md:block" />
                    </div>
                    <div className="w-full bg-white p-6 rounded-b-2xl shadow-md border border-gray-100 text-center flex-1 flex items-center justify-center group-hover:shadow-lg transition-shadow">
                      <p className="text-gray-700 font-medium">철저한 기획과 계획을 통해<br/>안정적으로 사업을 추진</p>
                    </div>
                  </div>

                  {/* Risk 2 */}
                  <div className="flex-1 flex flex-col items-center group">
                    <div className="w-full bg-gray-100 p-6 rounded-t-2xl border-b-4 border-gray-300 text-center transition-colors group-hover:bg-gray-200">
                      <h5 className="font-bold text-gray-500 mb-1">BIG RISK 2</h5>
                      <h6 className="text-2xl font-black text-gray-900">불편함</h6>
                    </div>
                    <div className="py-4 text-gray-400">
                      <ArrowDown size={24} className="md:hidden" />
                      <ArrowDown size={24} className="hidden md:block" />
                    </div>
                    <div className="w-full bg-white p-6 rounded-b-2xl shadow-md border border-gray-100 text-center flex-1 flex items-center justify-center group-hover:shadow-lg transition-shadow">
                      <p className="text-gray-700 font-medium">공사과정의 다양한 시공관리 업무를<br/>체계적으로 대행</p>
                    </div>
                  </div>

                  {/* Risk 3 */}
                  <div className="flex-1 flex flex-col items-center group">
                    <div className="w-full bg-gray-100 p-6 rounded-t-2xl border-b-4 border-gray-300 text-center transition-colors group-hover:bg-gray-200">
                      <h5 className="font-bold text-gray-500 mb-1">BIG RISK 3</h5>
                      <h6 className="text-2xl font-black text-gray-900">불안함</h6>
                    </div>
                    <div className="py-4 text-gray-400">
                      <ArrowDown size={24} className="md:hidden" />
                      <ArrowDown size={24} className="hidden md:block" />
                    </div>
                    <div className="w-full bg-white p-6 rounded-b-2xl shadow-md border border-gray-100 text-center flex-1 flex items-center justify-center group-hover:shadow-lg transition-shadow">
                      <p className="text-gray-700 font-medium">성공적인 사업완수를 위한<br/>TOTAL SERVICE를 제공</p>
                    </div>
                  </div>

                </div>
                
                <div className="mt-12 text-center">
                  <div className="inline-block bg-gray-900 text-white px-8 py-4 rounded-full shadow-xl font-bold text-lg">
                    상호간의 동반성장 추구
                  </div>
                  <p className="mt-6 text-gray-600 max-w-2xl mx-auto">
                    빅플래너파트너스는 고객을 단순한 사업의 대상이 아닌 파트너십을 통하여 상호간의 동반성장을 추구합니다.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* 03. Our Service - Diagram */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex flex-col items-center mb-12">
                <div className="w-16 h-16 bg-gray-900 text-white rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                  <Briefcase size={32} />
                </div>
                <h4 className="text-3xl font-bold text-gray-900 mb-4">03. Our Service</h4>
                <p className="text-xl font-medium text-gray-600 text-center max-w-2xl">
                  빅플래너파트너스는 고객의 BIG PLAN을 체계적으로 수행하여 완수합니다.
                </p>
              </div>

              {/* 3 Pillars Architecture Diagram */}
              <div className="max-w-5xl mx-auto pt-8">
                {/* Roof */}
                <div className="bg-gray-900 text-white p-6 rounded-t-3xl text-center shadow-lg relative z-10 mx-4 md:mx-0">
                  <h5 className="text-2xl font-bold tracking-widest">BIG PLAN</h5>
                  <p className="text-gray-300 text-sm mt-1">고객의 성공적인 부동산 개발 및 운영</p>
                </div>
                
                {/* Pillars */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 px-8 md:px-4 -mt-2 relative z-0">
                  {/* Pillar 1 */}
                  <div className="bg-white border-x-4 border-b-4 border-gray-200 rounded-b-2xl p-6 shadow-sm flex flex-col h-full">
                    <div className="text-center mb-6 pb-4 border-b-2 border-gray-100">
                      <h6 className="text-xl font-black text-gray-900">BIG Consulting</h6>
                    </div>
                    <ul className="space-y-4 flex-1">
                      <li className="flex items-start">
                        <CheckCircle2 className="text-gray-400 mt-1 mr-2 flex-shrink-0" size={16} />
                        <span className="text-gray-600 text-sm">안정성과 고수익을 목표로 다양한 기업과 연계한 고객 권익 극대화</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="text-gray-400 mt-1 mr-2 flex-shrink-0" size={16} />
                        <span className="text-gray-600 text-sm">고객에게 필요한 자금에 맞춰진 체계적인 금융기획</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="text-gray-400 mt-1 mr-2 flex-shrink-0" size={16} />
                        <span className="text-gray-600 text-sm">분양과 임차를 빠르고 정확하게 연결해 주는 입체적인 마케팅</span>
                      </li>
                    </ul>
                  </div>

                  {/* Pillar 2 */}
                  <div className="bg-white border-x-4 border-b-4 border-gray-200 rounded-b-2xl p-6 shadow-sm flex flex-col h-full">
                    <div className="text-center mb-6 pb-4 border-b-2 border-gray-100">
                      <h6 className="text-xl font-black text-gray-900">BIG Management</h6>
                    </div>
                    <ul className="space-y-4 flex-1">
                      <li className="flex items-start">
                        <CheckCircle2 className="text-gray-400 mt-1 mr-2 flex-shrink-0" size={16} />
                        <span className="text-gray-600 text-sm">완벽한 기획을 바탕으로 디자인부터 시공까지 효율적이고 효과적인 개발운영</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="text-gray-400 mt-1 mr-2 flex-shrink-0" size={16} />
                        <span className="text-gray-600 text-sm">체계적이고 꼼꼼한 시공관리용 '건축비서APP' 기반으로 건축주의 권익 보호</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="text-gray-400 mt-1 mr-2 flex-shrink-0" size={16} />
                        <span className="text-gray-600 text-sm">PM 서비스 특장점: 체계적인 분석과 사업 수익성을 확보할 수 있는 Total Construction Service</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="text-gray-400 mt-1 mr-2 flex-shrink-0" size={16} />
                        <span className="text-gray-600 text-sm">건축비서 APP 특장점: 빅플래너파트너스의 시공관리는 ‘건축비서 app’을 통해 편하게 관리 가능</span>
                      </li>
                    </ul>
                  </div>

                  {/* Pillar 3 */}
                  <div className="bg-white border-x-4 border-b-4 border-gray-200 rounded-b-2xl p-6 shadow-sm flex flex-col h-full">
                    <div className="text-center mb-6 pb-4 border-b-2 border-gray-100">
                      <h6 className="text-xl font-black text-gray-900">BIG Credit</h6>
                    </div>
                    <ul className="space-y-4 flex-1">
                      <li className="flex items-start">
                        <CheckCircle2 className="text-gray-400 mt-1 mr-2 flex-shrink-0" size={16} />
                        <span className="text-gray-600 text-sm">우량 시공사 및 하도급 업체 Pool을 기반으로 최적의 시공업체 선정</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="text-gray-400 mt-1 mr-2 flex-shrink-0" size={16} />
                        <span className="text-gray-600 text-sm">시공과정에서 발생 가능한 Risk를 사전에 예방할 수 있는 안전장치 체결</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="text-gray-400 mt-1 mr-2 flex-shrink-0" size={16} />
                        <span className="text-gray-600 text-sm">에스크로 방식을 통한 투명한 대금결제 운영</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                {/* Foundation */}
                <div className="mt-4 bg-gray-100 p-4 rounded-xl text-center mx-4 md:mx-0 border-t-4 border-gray-300">
                  <p className="text-gray-500 font-bold tracking-widest">BIGPLANNER PARTNERS FOUNDATION</p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      <OrganizationChart />
      
      <ContactCTA />
      <Footer />
    </div>
  );
}
