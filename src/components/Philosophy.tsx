import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Philosophy() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-sm font-bold tracking-widest text-gray-600 uppercase mb-4">Our Philosophy</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-6">
              부동산과 공간 가치를 높이는<br />프롭테크 기업
            </h3>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              고객의 부동산과 공간가치를 높이기 위해 BIGPLANNER PARTNERS만의 투자분석과 PM시스템으로 중소형 신축 및 부동산 개발의 불확실함, 불편함, 불안함을 해소합니다.
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
