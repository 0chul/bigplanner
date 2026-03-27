import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

export default function Philosophy() {
  const { language } = useLanguage();

  return (
    <section className="py-12 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-sm font-bold tracking-widest text-gray-600 uppercase mb-4">Our Philosophy</h2>
            <h3 className="text-2xl md:text-4xl font-bold text-gray-900 leading-tight mb-4 md:mb-6">
              {language === 'ko' ? (
                <>부동산과 공간 가치를 높이는<br />프롭테크 기업</>
              ) : (
                <>A Proptech Company Enhancing<br />Real Estate & Space Value</>
              )}
            </h3>
            <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-6 md:mb-8">
              {language === 'ko' ? 
                "고객의 부동산과 공간가치를 높이기 위해 BIGPLANNER PARTNERS만의 투자분석과 PM시스템으로 중소형 신축 및 부동산 개발의 불확실함, 불편함, 불안함을 해소합니다." :
                "To enhance our clients' real estate and space value, BIGPLANNER PARTNERS eliminates the uncertainty, inconvenience, and anxiety of small-to-medium new construction and real estate development through our unique investment analysis and PM system."
              }
            </p>
            <Link to="/about" className="inline-flex items-center text-sm font-bold text-gray-900 hover:text-gray-600 transition-colors group">
              MORE ABOUT US
              <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
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
                className="object-cover rounded-2xl shadow-2xl"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
            </div>
            <div className="absolute -bottom-8 -left-8 bg-gray-900 text-white p-8 rounded-2xl shadow-xl hidden md:block">
              <p className="text-4xl font-bold mb-2">10+</p>
              <p className="text-sm font-medium opacity-80">Years of Experience</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
