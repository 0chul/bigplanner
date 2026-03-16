import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { FolderKanban, MessageSquare } from 'lucide-react';

export default function AdminDashboard() {
  const { isAdmin } = useAuth();

  if (!isAdmin) return null;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">관리자 대시보드</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/admin/projects" className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 group">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <FolderKanban size={24} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">포트폴리오 관리</h2>
          <p className="text-gray-600">웹사이트에 표시될 건축 및 개발 프로젝트 사례를 추가, 수정, 삭제합니다.</p>
        </Link>

        <Link to="/admin/inquiries" className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 group">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <MessageSquare size={24} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">고객 문의 관리</h2>
          <p className="text-gray-600">웹사이트를 통해 접수된 고객 문의 내역을 확인하고 처리 상태를 관리합니다.</p>
        </Link>
      </div>
    </div>
  );
}
