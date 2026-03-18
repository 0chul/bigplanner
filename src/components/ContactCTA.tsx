import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

export default function ContactCTA() {
  const { language } = useLanguage();

  return (
    <section className="py-24 bg-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M0 40L40 0H20L0 20M40 40V20L20 40" stroke="currentColor" strokeWidth="2" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        </svg>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-[47px] font-bold text-white mb-6">
            {language === 'ko' ? '저희에게 궁금하신 부분이 있으신가요?' : 'Do you have any questions for us?'}
          </h2>
          <p className="text-xl text-gray-300 mb-10">
            {language === 'ko' ? (
              <>궁금하신 점은 언제든 빅플래너파트너스에 문의주세요.<br className="hidden md:block" />신속하고 친절하게 답변해 드리겠습니다.</>
            ) : (
              <>Please feel free to contact BIGPLANNER PARTNERS with any questions.<br className="hidden md:block" />We will answer you promptly and kindly.</>
            )}
          </p>
          <Link to="/contact" className="inline-block bg-white text-gray-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-50 hover:scale-105 transition-all shadow-lg hover:shadow-xl">
            {language === 'ko' ? '문의하기' : 'Contact Us'}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
