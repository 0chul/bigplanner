import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { FolderKanban, MessageSquare, UserPlus, ShieldCheck, Calculator } from 'lucide-react';

export default function AdminDashboard() {
  const { isAdmin } = useAuth();

  if (!isAdmin) return null;

  return (
    <div className="p-4 md:p-8 w-full">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">관리자 대시보드</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        <Link to="/admin/projects" className="bg-white p-6 md:p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 group">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform">
            <FolderKanban size={24} className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">포트폴리오 관리</h2>
          <p className="text-sm md:text-base text-gray-600">웹사이트에 표시될 건축 및 개발 프로젝트 사례를 추가, 수정, 삭제합니다.</p>
        </Link>

        <Link to="/admin/inquiries" className="bg-white p-6 md:p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 group">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform">
            <MessageSquare size={24} className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">고객 문의 관리</h2>
          <p className="text-sm md:text-base text-gray-600">웹사이트를 통해 접수된 고객 문의 내역을 확인하고 처리 상태를 관리합니다.</p>
        </Link>
        <Link to="/admin/leads" className="bg-white p-6 md:p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 group">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform">
            <UserPlus size={24} className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">META 리드 관리</h2>
          <p className="text-sm md:text-base text-gray-600">META 광고를 통해 접수된 리드 내역을 확인하고 관리합니다.</p>
        </Link>

        <Link to="/admin/fire-safety-leads" className="bg-white p-6 md:p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 group">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform">
            <ShieldCheck size={24} className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">AI 민원 리드 관리</h2>
          <p className="text-sm md:text-base text-gray-600">방재실 AI 민원 도우미 데모 시연 신청 리드를 확인하고 시연 일정을 관리합니다.</p>
        </Link>

        <Link to="/admin/pm-estimates" className="bg-white p-6 md:p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 group">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-900 text-blue-400 rounded-xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform">
            <Calculator size={24} className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">건축 PM 견적·제안서</h2>
          <p className="text-sm md:text-base text-gray-600">건축주 맞춤형 PM 견적 계산기, 예시 제안서 미리보기 및 제안 자료를 관리합니다.</p>
        </Link>
      </div>
    </div>
  );
}
