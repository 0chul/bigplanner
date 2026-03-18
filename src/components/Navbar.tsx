import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { language, setLanguage } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: language === 'ko' ? '프로젝트' : 'Projects', href: '/projects' },
    { name: language === 'ko' ? '서비스' : 'Service', href: '/service' },
    { name: language === 'ko' ? '회사소개' : 'About', href: '/about' },
    { name: language === 'ko' ? '파트너스' : 'Partners', href: '/partners' },
    { name: language === 'ko' ? '오시는길' : 'Contact', href: '/contact' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 bg-black shadow-md py-4`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex-shrink-0">
            <Link to="/" onClick={() => window.scrollTo(0, 0)} className="flex items-center">
              <img 
                src="https://injrbniytgtubemniaps.supabase.co/storage/v1/object/public/bigplanner/logo.png" 
                alt="BIGPLANNER PARTNERS" 
                className="object-contain"
                referrerPolicy="no-referrer"
              />
            </Link>
          </div>
          
          <div className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <Link key={link.name} to={link.href} className="text-sm font-medium text-white hover:text-gray-300 transition-colors">
                {link.name}
              </Link>
            ))}
            <div className="flex space-x-2 text-sm font-medium text-white">
              <button 
                onClick={() => setLanguage('ko')} 
                className={`hover:text-gray-300 transition-opacity ${language === 'ko' ? 'opacity-100' : 'opacity-50'}`}
              >
                KOR
              </button>
              <span>|</span>
              <button 
                onClick={() => setLanguage('en')} 
                className={`hover:text-gray-300 transition-opacity ${language === 'en' ? 'opacity-100' : 'opacity-50'}`}
              >
                ENG
              </button>
            </div>
          </div>

          <div className="md:hidden flex items-center gap-4">
            <div className="flex space-x-2 text-sm font-medium text-white">
              <button 
                onClick={() => setLanguage('ko')} 
                className={`hover:text-gray-300 transition-opacity ${language === 'ko' ? 'opacity-100' : 'opacity-50'}`}
              >
                KOR
              </button>
              <span>|</span>
              <button 
                onClick={() => setLanguage('en')} 
                className={`hover:text-gray-300 transition-opacity ${language === 'en' ? 'opacity-100' : 'opacity-50'}`}
              >
                ENG
              </button>
            </div>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white">
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-white absolute top-full left-0 w-full shadow-lg"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.href} 
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </nav>
  );
}
