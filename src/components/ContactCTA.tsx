import { motion, useReducedMotion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { CtaHorizonMotion } from './motion/LandingMotionGraphics';

export default function ContactCTA() {
  const { language } = useLanguage();
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="py-20 md:py-28 bg-gray-950 relative overflow-hidden">
      <CtaHorizonMotion />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-xs font-semibold tracking-wider text-blue-400 uppercase mb-4">
            Start Your Project
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-5 leading-tight text-balance">
            {language === 'ko'
              ? '저희에게 궁금하신 부분이 있으신가요?'
              : 'Do you have any questions for us?'}
          </h2>
          <p className="text-base md:text-xl text-gray-300 mb-9 max-w-2xl mx-auto leading-relaxed">
            {language === 'ko' ? (
              <>
                대상지 검토부터 개발 기획, PM 감리, AI 빌딩 운영까지
                <br className="hidden md:block" />
                빅플래너파트너스 전담 PM이 신속하게 안내해 드립니다.
              </>
            ) : (
              <>
                From parcel feasibility to architectural PM and AI building operations,
                <br className="hidden md:block" />
                our dedicated PM team will respond promptly.
              </>
            )}
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-white text-gray-950 px-7 py-4 rounded-xl font-bold text-base sm:text-lg hover:bg-gray-100 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            <span>{language === 'ko' ? '문의하기' : 'Contact Us'}</span>
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
