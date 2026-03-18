import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: '프로젝트', href: '/projects' },
    { name: '서비스', href: '/service' },
    { name: '회사소개', href: '/about' },
    { name: '파트너스', href: '/partners' },
    { name: '오시는길', href: '/contact' },
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
              <a href="#" className="hover:text-gray-300">KOR</a>
              <span>|</span>
              <a href="#" className="hover:text-gray-300 opacity-50">ENG</a>
            </div>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-900">
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
              <Link key={link.name} to={link.href} className="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50">
                {link.name}
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </nav>
  );
}
