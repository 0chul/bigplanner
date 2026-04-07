import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../supabase';
import { Trash2, ChevronDown, ChevronUp, MessageSquare, X } from 'lucide-react';
import { getRelativeTime } from '../../utils/dateUtils';

interface Partnership {
  id: string;
  name: string;
  email: string;
  phone: string;
  company_name: string;
  message: string;
  type: 'architectural' | 'business';
  status: 'new' | 'in-progress' | 'completed';
  created_at: string;
}

export default function AdminPartnerships() {
  const { isAdmin, loading } = useAuth();
  const [partnerships, setPartnerships] = useState<Partnership[]>([]);
  const [fetching, setFetching] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAdmin) return;

    const fetchPartnerships = async () => {
      setErrorMsg(null);
      const { data, error } = await supabase
        .from('partnerships')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching partnerships:", error);
        setErrorMsg(`데이터를 불러오는 중 오류가 발생했습니다: ${error.message}`);
      } else {
        setPartnerships(data as Partnership[]);
      }
      setFetching(false);
    };

    fetchPartnerships();
  }, [isAdmin]);

  const updateStatus = async (id: string, newStatus: 'new' | 'in-progress' | 'completed') => {
    const { error } = await supabase
      .from('partnerships')
      .update({ status: newStatus })
      .eq('id', id);
      
    if (error) {
      alert('상태 업데이트 실패: ' + error.message);
    } else {
      setPartnerships(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("정말로 삭제하시겠습니까?")) {
      const { error } = await supabase.from('partnerships').delete().eq('id', id);
      if (error) {
        alert('삭제 실패: ' + error.message);
      } else {
        setPartnerships(prev => prev.filter(p => p.id !== id));
      }
    }
  };

  if (loading || fetching) return <div className="p-8">Loading...</div>;
  if (!isAdmin) return <div className="p-8">접근 권한이 없습니다.</div>;

  return (
    <div className="p-4 md:p-8 w-full">
      <h1 className="text-2xl md:text-3xl font-bold mb-8">건축/업무 제휴 관리</h1>
      
      {errorMsg && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl">
          {errorMsg}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left font-bold text-gray-900">유형</th>
              <th className="px-6 py-4 text-left font-bold text-gray-900">상태</th>
              <th className="px-6 py-4 text-left font-bold text-gray-900">이름/회사</th>
              <th className="px-6 py-4 text-left font-bold text-gray-900">날짜</th>
              <th className="px-6 py-4 text-right font-bold text-gray-900">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {partnerships.map((p) => (
              <React.Fragment key={p.id}>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {p.type === 'architectural' ? '건축 제휴' : '업무 제휴'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={p.status}
                      onChange={(e) => updateStatus(p.id, e.target.value as any)}
                      className="text-sm rounded-full px-3 py-1 font-semibold border-0 bg-gray-100"
                    >
                      <option value="new">신규</option>
                      <option value="in-progress">진행중</option>
                      <option value="completed">완료</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{p.name}</div>
                    <div className="text-sm text-gray-500">{p.company_name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getRelativeTime(p.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button onClick={() => setExpandedId(expandedId === p.id ? null : p.id)} className="mr-2 text-gray-400 hover:text-gray-600">
                      {expandedId === p.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                    <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:text-red-900">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
                {expandedId === p.id && (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 bg-gray-50">
                      <div className="text-sm text-gray-700 space-y-2">
                        <p><strong>이메일:</strong> {p.email}</p>
                        <p><strong>연락처:</strong> {p.phone}</p>
                        <p><strong>문의 내용:</strong></p>
                        <p className="whitespace-pre-wrap">{p.message}</p>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
