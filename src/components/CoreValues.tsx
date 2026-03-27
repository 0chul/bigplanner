import { motion } from 'motion/react';
import { Building2, Lightbulb, TrendingUp } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const values = {
  ko: [
    {
      icon: <Building2 size={32} />,
      title: "We Buildup!",
      subtitle: "새로운 공간창조",
      desc: "새로운 공간창조(Buildup), 공간경험(Insight), 이익확보(Gains)라는 가치를 창출합니다."
    },
    {
      icon: <Lightbulb size={32} />,
      title: "Insight!",
      subtitle: "The Construction intelligence platform",
      desc: "체계적인 분석과 사업 수익성을 확보할 수 있는 신축개발관리 PM서비스를 제공합니다."
    },
    {
      icon: <TrendingUp size={32} />,
      title: "Gain! Value.",
      subtitle: "Everything you'd like to ask us",
      desc: "건축주의 개발계획, 자본규모에 따른 최적의 금융기획을 제안합니다."
    }
  ],
  en: [
    {
      icon: <Building2 size={32} />,
      title: "We Buildup!",
      subtitle: "Creation of New Spaces",
      desc: "We create value through new space creation (Buildup), spatial experience (Insight), and securing profits (Gains)."
    },
    {
      icon: <Lightbulb size={32} />,
      title: "Insight!",
      subtitle: "The Construction intelligence platform",
      desc: "We provide new construction development management PM services that ensure systematic analysis and business profitability."
    },
    {
      icon: <TrendingUp size={32} />,
      title: "Gain! Value.",
      subtitle: "Everything you'd like to ask us",
      desc: "We propose optimal financial planning according to the client's development plan and capital scale."
    }
  ]
};

export default function CoreValues() {
  const { language } = useLanguage();
  const currentValues = values[language];

  return (
    <section className="py-12 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">Core Values</h2>
          <p className="text-base md:text-lg text-gray-600">
            {language === 'ko' ? '빅플래너파트너스가 추구하는 핵심 가치입니다.' : 'The core values pursued by BIGPLANNER PARTNERS.'}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {currentValues.map((value, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.2 }}
              className="bg-white p-6 md:p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
            >
              <div className="w-16 h-16 bg-gray-100 text-gray-900 rounded-xl flex items-center justify-center mb-6">
                {value.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
              <h4 className="text-sm font-medium text-gray-600 mb-4">{value.subtitle}</h4>
              <p className="text-gray-600 leading-relaxed">
                {value.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
