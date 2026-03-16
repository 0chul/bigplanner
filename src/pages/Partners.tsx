import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Paperclip, Send } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const categories = [
  { id: 'architecture', label: '건축제휴' },
  { id: 'business', label: '업무제휴' }
];

export default function Partners() {
  const [activeCategory, setActiveCategory] = useState('architecture');
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <Navbar />
      
      {/* Header */}
      <section className="pt-32 pb-16 bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Partners</h1>
            <p className="text-lg text-gray-500">파트너스</p>
          </motion.div>
        </div>
      </section>

      {/* Tabs */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="bg-white rounded-2xl shadow-sm p-2 flex justify-center space-x-4 border border-gray-100">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex-1 px-8 py-4 rounded-xl font-bold text-sm transition-all ${
                activeCategory === cat.id
                  ? 'bg-gray-900 text-white shadow-md'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Form Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white p-8 md:p-12 rounded-3xl border border-gray-100 shadow-sm"
          >
            <div className="mb-10">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {activeCategory === 'architecture' ? '건축제휴 문의' : '업무제휴 문의'}
              </h3>
              <p className="text-gray-500">문의를 남겨주시면 신속하게 답변드리겠습니다.</p>
            </div>

            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">성함 / 회사명</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
                    placeholder="성함 또는 회사명을 입력해주세요"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">연락처</label>
                  <input 
                    type="tel" 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
                    placeholder="연락처를 입력해주세요"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">이메일</label>
                <input 
                  type="email" 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
                  placeholder="이메일 주소를 입력해주세요"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">제목</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
                  placeholder="제목을 입력해주세요"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">내용</label>
                <textarea 
                  rows={6}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all resize-none"
                  placeholder="문의 내용을 상세히 입력해주세요"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">파일첨부</label>
                <div className="relative">
                  <input 
                    type="file" 
                    className="hidden" 
                    id="file-upload"
                  />
                  <label 
                    htmlFor="file-upload"
                    className="flex items-center justify-center w-full px-4 py-4 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors group"
                  >
                    <Paperclip size={20} className="text-gray-400 mr-2 group-hover:text-gray-600" />
                    <span className="text-gray-500 group-hover:text-gray-700">파일을 선택하거나 드래그하여 업로드하세요</span>
                  </label>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <div className="flex items-start mb-6">
                  <button 
                    type="button"
                    onClick={() => setAgreed(!agreed)}
                    className={`mt-1 mr-3 flex-shrink-0 w-5 h-5 rounded border transition-colors flex items-center justify-center ${
                      agreed ? 'bg-gray-900 border-gray-900' : 'bg-white border-gray-300'
                    }`}
                  >
                    {agreed && <CheckCircle2 size={14} className="text-white" />}
                  </button>
                  <div className="text-sm">
                    <p className="text-gray-700 font-medium mb-1">개인정보 수집 및 이용 동의 (필수)</p>
                    <p className="text-gray-500 text-xs leading-relaxed">
                      문의 처리를 위해 성함, 연락처, 이메일 등의 개인정보를 수집합니다. 수집된 정보는 문의 답변 완료 후 관련 법령에 따라 일정 기간 보관 후 파기됩니다.
                    </p>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={!agreed}
                  className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center transition-all ${
                    agreed 
                      ? 'bg-gray-900 text-white hover:bg-gray-800 shadow-lg' 
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Send size={20} className="mr-2" />
                  문의하기
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
