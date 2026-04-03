import { useAuth } from '../../contexts/AuthContext';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, MessageSquare, UserPlus, LogOut, Menu, X } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';

export default function AdminLayout() {
  const { user, isAdmin, login, logout, loading } = useAuth();
  const location = useLocation();
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Request notification permission on mount
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if (!isAdmin) return;
    const fetchData = async () => {
      const { data: inqData } = await supabase.from('inquiries').select('id, status');
      const { data: leadData } = await supabase.from('leads').select('id, status');
      
      // Check for new inquiries
      const newInquiries = inqData?.filter(i => i.status === 'new') || [];
      const prevNewInquiries = inquiries.filter(i => i.status === 'new');
      
      if (newInquiries.length > prevNewInquiries.length) {
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('새로운 문의가 접수되었습니다!', {
            body: '관리자 페이지에서 확인해주세요.',
          });
        } else {
          alert('새로운 문의가 접수되었습니다!');
        }
      }

      setInquiries(inqData || []);
      setLeads(leadData || []);
    };
    fetchData();
    const channel = supabase.channel('admin_nav').on('postgres_changes', { event: '*', schema: 'public' }, fetchData).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [isAdmin, inquiries]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
          <h1 className="text-2xl font-bold mb-6">관리자 로그인</h1>
          <p className="text-gray-600 mb-8">빅플래너파트너스 관리자 시스템입니다. 허가된 계정으로 로그인해주세요.</p>
          <button 
            onClick={login}
            className="w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors"
          >
            Google 계정으로 로그인
          </button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
          <h1 className="text-2xl font-bold mb-6 text-red-600">접근 권한 없음</h1>
          <p className="text-gray-600 mb-8">해당 계정({user.email})은 관리자 권한이 없습니다.</p>
          <button 
            onClick={logout}
            className="w-full border border-gray-300 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors"
          >
            로그아웃
          </button>
        </div>
      </div>
    );
  }

  const navItems = [
    { path: '/admin', label: '대시보드', icon: <LayoutDashboard size={20} /> },
    { path: '/admin/projects', label: '프로젝트 관리', icon: <FolderKanban size={20} /> },
    { path: '/admin/inquiries', label: '고객 문의 관리', icon: <MessageSquare size={20} />, count: inquiries.filter(i => i.status === 'new').length },
    { path: '/admin/leads', label: 'META 리드 관리', icon: <UserPlus size={20} />, count: leads.filter(l => l.status === 'new').length },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-black text-white p-4 flex justify-between items-center sticky top-0 z-20">
        <Link to="/" className="text-xl font-bold tracking-tighter">
          BIGPLANNER<span className="text-gray-500">.</span> ADMIN
        </Link>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:sticky top-0 left-0 h-full md:h-screen z-40
        w-64 bg-black text-white flex flex-col transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 hidden md:block">
          <Link to="/" className="text-xl font-bold tracking-tighter">
            BIGPLANNER<span className="text-gray-500">.</span> ADMIN
          </Link>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl transition-colors ${
                  isActive ? 'bg-white/10 text-white font-bold' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  {item.label}
                </div>
                {item.count > 0 && (
                  <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {item.count}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-gray-700 overflow-hidden">
              {user.photoURL && <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.displayName}</p>
              <p className="text-xs text-gray-400 truncate">{user.email}</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
          >
            <LogOut size={20} />
            로그아웃
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto w-full">
        <Outlet />
      </main>
    </div>
  );
}
