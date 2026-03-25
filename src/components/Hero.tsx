import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const slides = {
  ko: [
    {
      title: "부동산 투자 수익과\n안정성을 극대화 하는 회사입니다.",
      subtitle: "We've got a different solution of property",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
    },
    {
      title: "중소형 건축을 전문으로\n개발하는 회사입니다.",
      subtitle: "Always by your side always on your side",
      image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2070&auto=format&fit=crop"
    },
    {
      title: "쉽고, 편하게, 확실하게\n고객 BIG PLAN을 함께 이룹니다.",
      subtitle: "Invest smarter Earn more Stress less",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop"
    }
  ],
  en: [
    {
      title: "Maximizing Real Estate\nInvestment Returns and Stability.",
      subtitle: "We've got a different solution of property",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
    },
    {
      title: "Specializing in Small to Medium\nScale Architecture Development.",
      subtitle: "Always by your side always on your side",
      image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2070&auto=format&fit=crop"
    },
    {
      title: "Achieving Your BIG PLAN\nEasily, Comfortably, and Surely.",
      subtitle: "Invest smarter Earn more Stress less",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop"
    }
  ]
};

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const { language } = useLanguage();
  const currentSlides = slides[language];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % currentSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [currentSlides.length]);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % currentSlides.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + currentSlides.length) % currentSlides.length);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gray-900">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-black/40 z-10" />
          <img 
            src={currentSlides[current].image} 
            alt="Hero background" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-20 h-full flex items-center justify-center text-center px-4">
        <div className="max-w-4xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h1 className="text-[66px] font-bold text-white whitespace-pre-line leading-tight mb-6">
                {currentSlides[current].title}
              </h1>
              <p className="text-base md:text-lg text-gray-200 font-light tracking-wide">
                {currentSlides[current].subtitle}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="absolute bottom-10 left-0 right-0 z-30 flex justify-center space-x-4">
        <button onClick={prevSlide} className="p-2 rounded-full border border-white/30 text-white hover:bg-white/20 transition-colors" aria-label="Previous slide">
          <ChevronLeft size={24} />
        </button>
        <div className="flex items-center space-x-2">
          {currentSlides.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-1 transition-all duration-300 ${idx === current ? 'w-8 bg-white' : 'w-4 bg-white/50'}`}
            />
          ))}
        </div>
        <button onClick={nextSlide} className="p-2 rounded-full border border-white/30 text-white hover:bg-white/20 transition-colors" aria-label="Next slide">
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
}
