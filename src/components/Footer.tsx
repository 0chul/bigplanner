import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

export default function Footer() {
  const { language } = useLanguage();

  return (
    <footer className="bg-black text-gray-400 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col space-y-8">
          {/* Logo */}
          <div className="flex items-center">
            <img 
              src="https://injrbniytgtubemniaps.supabase.co/storage/v1/object/public/bigplanner/logo.png" 
              alt="BIGPLANNER PARTNERS" 
              className="object-contain opacity-90 hover:opacity-100 transition-opacity"
              referrerPolicy="no-referrer"
            />
          </div>
          
          {/* Links */}
          <div className="flex items-center space-x-6 text-sm">
            <a 
              href="https://www.bigplanner.co.kr/content/content.php?cont=privacy" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-white transition-colors font-bold text-white"
            >
              {language === 'ko' ? '개인정보처리방침' : 'Privacy Policy'}
            </a>
          </div>

          {/* Info */}
          <div className="text-xs text-gray-500 space-y-1">
            <p>{language === 'ko' ? '서울특별시 용산구 회나무로 13가길 16 어반메시남산 C동102호' : '102, Building C, Urban Mesh Namsan, 16, Hoenamu-ro 13ga-gil, Yongsan-gu, Seoul'}</p>
            <p>{language === 'ko' ? '전화/팩스: 02-790-0799 | 이메일: bigplanner0799@gmail.com' : 'Tel/Fax: +82-2-790-0799 | Email: bigplanner0799@gmail.com'}</p>
            <p>{language === 'ko' ? '개인정보보호책임자: 박준호 | 사업자등록번호: 265-87-02571' : 'Privacy Officer: Junho Park | Business Registration No: 265-87-02571'}</p>
          </div>

          {/* Copyright */}
          <div className="text-xs text-gray-600">
            © 2026 BIGPLANNERPARTNERS. ALL RIGHTS RESERVED.
          </div>
        </div>
      </div>
    </footer>
  );
}
