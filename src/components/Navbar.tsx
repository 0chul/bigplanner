import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion } from 'motion/react';
import { Link, NavLink } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { fireSafetyLandingUrl } from '../utils/fireSafetyLanding';
import { fireSafetyEnglishPath } from '../utils/fireSafetyLocales.js';

const desktopLinkStyle = 'whitespace-nowrap text-sm font-medium text-white transition-colors hover:text-gray-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white aria-[current=page]:underline aria-[current=page]:underline-offset-4';
const mobileLinkStyle = 'block rounded px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 aria-[current=page]:underline aria-[current=page]:underline-offset-4';

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
    { name: language === 'ko' ? '회사소개' : 'About', href: '/about' },
    { name: language === 'ko' ? '서비스' : 'Service', href: '/service' },
    {
      name: language === 'ko' ? '방재실 AI' : 'Facilities AI',
      href: language === 'ko' ? fireSafetyLandingUrl : fireSafetyEnglishPath,
      openDocument: language === 'en' || !fireSafetyLandingUrl.startsWith('/'),
    },
    { name: language === 'ko' ? '프로젝트' : 'Projects', href: '/projects' },
    { name: language === 'ko' ? '파트너스' : 'Partners', href: '/partners' },
    { name: language === 'ko' ? '오시는길' : 'Contact', href: '/contact' },
  ];

  function renderNavLinks(className: string, onClick?: () => void) {
    return navLinks.map(({ name, href, openDocument }) => openDocument
      ? <a key={href} href={href} className={className} onClick={onClick}>{name}</a>
      : <NavLink key={href} to={href} className={className} onClick={onClick}>{name}</NavLink>);
  }

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-black shadow-md py-4`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 lg:gap-8">
          <div className="flex-shrink-0">
            <Link to="/" onClick={() => window.scrollTo(0, 0)} className="flex items-center">
              <img 
                src="https://injrbniytgtubemniaps.supabase.co/storage/v1/object/public/bigplanner/logo.png" 
                alt="BIGPLANNER PARTNERS" 
                className="max-h-10 md:max-h-12 w-auto"
                referrerPolicy="no-referrer"
              />
            </Link>
          </div>
          
          <div className="hidden min-w-0 flex-wrap items-center justify-end gap-x-4 gap-y-1 md:flex lg:gap-x-8">
            {renderNavLinks(desktopLinkStyle)}
            <div className="flex shrink-0 space-x-2 text-sm font-medium text-white">
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
            <button type="button" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white" aria-label={language === 'ko' ? '주 메뉴' : 'Main menu'} aria-expanded={isMobileMenuOpen}>
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
            {renderNavLinks(mobileLinkStyle, () => setIsMobileMenuOpen(false))}
            <div className="px-3 py-4 border-t border-gray-100 flex space-x-4 text-sm font-medium text-gray-900">
              <button 
                onClick={() => { setLanguage('ko'); setIsMobileMenuOpen(false); }} 
                className={`transition-opacity ${language === 'ko' ? 'opacity-100 font-bold' : 'opacity-50'}`}
              >
                KOR
              </button>
              <span className="text-gray-300">|</span>
              <button 
                onClick={() => { setLanguage('en'); setIsMobileMenuOpen(false); }} 
                className={`transition-opacity ${language === 'en' ? 'opacity-100 font-bold' : 'opacity-50'}`}
              >
                ENG
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
}
