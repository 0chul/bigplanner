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
              className="h-8 md:h-10 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity"
              referrerPolicy="no-referrer"
              loading="lazy"
            />
          </div>
          
          {/* Links */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            <a 
              href={language === 'ko' ? '/privacy/' : '/privacy/en/'}
              hrefLang={language}
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-white transition-colors font-bold text-white"
            >
              {language === 'ko' ? '개인정보처리방침' : 'Privacy Policy'}
            </a>
            <a
              href={language === 'ko' ? '/privacy/notice-2026-11-24/#ko' : '/privacy/notice-2026-11-24/#en'}
              className="font-medium text-white underline underline-offset-4 hover:text-gray-200"
            >
              {language === 'ko' ? '개인정보처리방침 변경 공지' : 'Privacy policy change notice'}
            </a>
            <a
              href="https://blog.naver.com/bigplannerpartners"
              hrefLang="ko"
              className="font-medium text-white underline underline-offset-4 hover:text-gray-200"
            >
              {language === 'ko' ? '네이버 공식 블로그' : 'Official Naver Blog (Korean)'}
            </a>
          </div>

          {/* Info */}
          <div className="text-sm text-gray-300 space-y-2">
            <p>{language === 'ko' ? '서울특별시 용산구 회나무로 13가길 16 어반메시남산 C동102호' : '102, Building C, Urban Mesh Namsan, 16, Hoenamu-ro 13ga-gil, Yongsan-gu, Seoul'}</p>
            <p>{language === 'ko' ? '전화/팩스: 02-790-0799 | 이메일: bigplanner0799@gmail.com' : 'Tel/Fax: +82-2-790-0799 | Email: bigplanner0799@gmail.com'}</p>
            <p>{language === 'ko' ? '개인정보보호책임자: 박준호 | 사업자등록번호: 265-87-02571' : 'Privacy Officer: Junho Park | Business Registration No: 265-87-02571'}</p>
          </div>

          {/* Copyright */}
          <div className="text-sm text-gray-400">
            © 2026 BIGPLANNERPARTNERS. ALL RIGHTS RESERVED.
          </div>
        </div>
      </div>
    </footer>
  );
}
