import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { MapPin, Phone, Mail, Clock, Train, Bus } from 'lucide-react';
import { supabase } from '../supabase';
import { useLanguage } from '../contexts/LanguageContext';

export default function Contact() {
  const { language } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    let formattedValue = '';
    
    if (value.length < 4) {
      formattedValue = value;
    } else if (value.length < 7 && value.startsWith('02')) {
      formattedValue = `${value.slice(0, 2)}-${value.slice(2)}`;
    } else if (value.length < 8) {
      formattedValue = `${value.slice(0, 3)}-${value.slice(3)}`;
    } else if (value.length < 10 && value.startsWith('02')) {
      formattedValue = `${value.slice(0, 2)}-${value.slice(2, 5)}-${value.slice(5)}`;
    } else if (value.length < 11 && value.startsWith('02')) {
      formattedValue = `${value.slice(0, 2)}-${value.slice(2, 6)}-${value.slice(6)}`;
    } else if (value.length < 11) {
      formattedValue = `${value.slice(0, 3)}-${value.slice(3, 6)}-${value.slice(6)}`;
    } else if (value.length < 12) {
      formattedValue = `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(7, 11)}`;
    } else {
      formattedValue = `${value.slice(0, 4)}-${value.slice(4, 8)}-${value.slice(8, 12)}`;
    }
    
    setFormData({...formData, phone: formattedValue});
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const phoneRegex = /^(0[0-9]{1,3})-?[0-9]{3,4}-?[0-9]{4}$/;
    if (!phoneRegex.test(formData.phone)) {
      alert(language === 'ko' ? "올바른 전화번호 형식을 입력해주세요. (예: 010-1234-5678)" : "Please enter a valid phone number format. (e.g. 010-1234-5678)");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.from('inquiries').insert([{
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        message: formData.message
      }]);

      if (error) throw error;
      
      setSubmitSuccess(true);
      setFormData({ name: '', email: '', phone: '', company: '', message: '' });
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      console.error("Error submitting inquiry:", error);
      alert("문의 접수 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <Helmet>
        <title>{language === 'ko' ? '오시는 길 & 문의 | 빅플래너파트너스' : 'Contact Us | BIGPLANNER PARTNERS'}</title>
        <meta name="description" content={language === 'ko' ? "빅플래너파트너스의 위치와 문의처를 확인하세요. 프롭테크 기업 빅플래너파트너스에 궁금한 점이 있다면 언제든 문의주세요." : "Check the location and contact information of BIGPLANNER PARTNERS. If you have any questions about the proptech company BIGPLANNER PARTNERS, please feel free to contact us."} />
        <meta name="keywords" content="빅플래너파트너스, 오시는길, 문의, 프롭테크, 부동산개발, BIGPLANNER PARTNERS, Contact Us, Inquiry, Proptech, Real Estate Development" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://bigplanner.co.kr/contact" />
        <meta property="og:title" content={language === 'ko' ? '오시는 길 & 문의 | 빅플래너파트너스' : 'Contact Us | BIGPLANNER PARTNERS'} />
        <meta property="og:description" content={language === 'ko' ? "빅플래너파트너스의 위치와 문의처를 확인하세요. 프롭테크 기업 빅플래너파트너스에 궁금한 점이 있다면 언제든 문의주세요." : "Check the location and contact information of BIGPLANNER PARTNERS. If you have any questions about the proptech company BIGPLANNER PARTNERS, please feel free to contact us."} />
        <meta property="og:image" content="https://injrbniytgtubemniaps.supabase.co/storage/v1/object/public/bigplanner/logo.png" />

        <script type="application/ld+json">
          {`
            [
              {
                "@context": "https://schema.org",
                "@type": "ContactPage",
                "name": "${language === 'ko' ? '오시는 길 & 문의 | 빅플래너파트너스' : 'Contact Us | BIGPLANNER PARTNERS'}",
                "description": "${language === 'ko' ? '빅플래너파트너스의 위치와 문의처를 확인하세요.' : 'Check the location and contact information of BIGPLANNER PARTNERS.'}",
                "url": "https://bigplanner.co.kr/contact"
              },
              {
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": [
                  {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "${language === 'ko' ? '홈' : 'Home'}",
                    "item": "https://bigplanner.co.kr/"
                  },
                  {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "${language === 'ko' ? '오시는 길 & 문의' : 'Contact Us'}",
                    "item": "https://bigplanner.co.kr/contact"
                  }
                ]
              }
            ]
          `}
        </script>
      </Helmet>
      <Navbar />
      
      {/* Hero Section */}
      <div className="pt-32 pb-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">오시는 길 & 문의</h1>
            <p className="text-xl text-gray-600">
              빅플래너파트너스와 함께 새로운 가치를 만들어갈 준비가 되셨나요?
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Contact Info & Map */}
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Contact Information</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Office</h3>
                    <p className="text-gray-600">서울특별시 용산구 회나무로 13가길 16 어반메시남산 C동102호</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Phone</h3>
                    <p className="text-gray-600">02-790-0799</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Email</h3>
                    <p className="text-gray-600">bigplanner0799@gmail.com</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Business Hours</h3>
                    <p className="text-gray-600">Mon - Fri: 09:00 - 18:00<br/>Sat - Sun: Closed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Location</h2>
              <div className="w-full h-[400px] bg-gray-200 rounded-2xl overflow-hidden">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d197.72587742125762!2d126.99047294866499!3d37.54059453332746!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357ca24e8d851f85%3A0x6e761d7fc7cd897f!2z7ISc7Jq47Yq567OE7IucIOyaqeyCsOq1rCDtmozrgpjrrLTroZwxM-qwgOq4uCAxNg!5e0!3m2!1sko!2skr!4v1678085365896!5m2!1sko!2skr" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
              
              {/* Public Transport Info */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-2xl">
                  <div className="flex items-center gap-3 mb-4">
                    <Train className="text-blue-600" size={24} />
                    <h3 className="text-lg font-bold text-gray-900">지하철 이용시</h3>
                  </div>
                  <ul className="space-y-2 text-gray-600">
                    <li>• 6호선 녹사평역(용산구청) 2번 출구</li>
                    <li>• 도보 13분 거리(약 778m)</li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-2xl">
                  <div className="flex items-center gap-3 mb-4">
                    <Bus className="text-green-600" size={24} />
                    <h3 className="text-lg font-bold text-gray-900">버스 이용시</h3>
                  </div>
                  <ul className="space-y-2 text-gray-600">
                    <li>• 143번, 401번, 406번</li>
                    <li>• 이태원동남산대림아파트 하차</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-lg border border-gray-100 h-fit">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">프로젝트 문의하기</h2>
            
            {submitSuccess ? (
              <div className="bg-green-50 text-green-800 p-6 rounded-2xl text-center">
                <h3 className="text-xl font-bold mb-2">문의가 성공적으로 접수되었습니다.</h3>
                <p>빠른 시일 내에 답변 드리겠습니다. 감사합니다.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">이름 *</label>
                    <input 
                      type="text" 
                      id="name" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent transition-shadow"
                      placeholder="홍길동"
                    />
                  </div>
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">회사명</label>
                    <input 
                      type="text" 
                      id="company" 
                      value={formData.company}
                      onChange={(e) => setFormData({...formData, company: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent transition-shadow"
                      placeholder="(주)빅플래너"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">연락처 *</label>
                    <input 
                      type="tel" 
                      id="phone" 
                      required
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent transition-shadow"
                      placeholder="010-0000-0000"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">이메일</label>
                    <input 
                      type="email" 
                      id="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent transition-shadow"
                      placeholder="example@email.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">문의 내용</label>
                  <textarea 
                    id="message" 
                    rows={6} 
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent transition-shadow resize-none"
                    placeholder="프로젝트의 목적, 예산, 일정 등 상세한 내용을 적어주시면 더 정확한 상담이 가능합니다."
                  ></textarea>
                </div>
                
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400"
                >
                  {isSubmitting ? '접수 중...' : '문의 접수하기'}
                </button>
              </form>
            )}
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
