import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { ArrowRight, Building2, Search, Target } from 'lucide-react';

export default function Services() {
  const { language } = useLanguage();

  const services = [
    {
      icon: <Building2 className="w-8 h-8 text-indigo-600" />,
      title: language === 'ko' ? '부동산 개발' : 'Real Estate Development',
      description: language === 'ko' 
        ? '최적의 입지 분석을 통해 부동산의 가치를 극대화하는 개발 솔루션을 제공합니다.'
        : 'Providing development solutions that maximize real estate value through optimal site analysis.',
    },
    {
      icon: <Search className="w-8 h-8 text-indigo-600" />,
      title: language === 'ko' ? '입지 분석' : 'Site Analysis',
      description: language === 'ko'
        ? '데이터 기반의 정밀한 입지 분석으로 성공적인 프로젝트의 기반을 마련합니다.'
        : 'Laying the foundation for successful projects with data-driven precise site analysis.',
    },
    {
      icon: <Target className="w-8 h-8 text-indigo-600" />,
      title: language === 'ko' ? '컨설팅' : 'Consulting',
      description: language === 'ko'
        ? '부동산 프로젝트의 기획부터 실행까지 전문적인 컨설팅을 지원합니다.'
        : 'Supporting professional consulting from planning to execution of real estate projects.',
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {language === 'ko' ? '서비스' : 'Services'}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {language === 'ko' 
              ? '빅플래너파트너스가 제공하는 전문적인 부동산 솔루션을 확인해보세요.'
              : 'Discover the professional real estate solutions provided by BIGPLANNER PARTNERS.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="mb-6">{service.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{service.title}</h3>
              <p className="text-gray-600 mb-6">{service.description}</p>
              <Link 
                to="/service" 
                className="inline-flex items-center text-indigo-600 font-medium hover:text-indigo-700 transition-colors"
              >
                {language === 'ko' ? '더보기' : 'Read More'} <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
