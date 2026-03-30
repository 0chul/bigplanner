import { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { UserPlus } from 'lucide-react';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  status: string;
  created_at: string;
}

export default function AdminLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    fetchLeads();
  }, []);

  async function fetchLeads() {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .neq('status', 'moved') // 'moved' 상태인 리드는 제외
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching leads:', error);
    } else {
      setLeads(data || []);
    }
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">META 리드 관리</h1>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 font-bold text-gray-900">이름</th>
              <th className="px-6 py-4 font-bold text-gray-900">이메일</th>
              <th className="px-6 py-4 font-bold text-gray-900">전화번호</th>
              <th className="px-6 py-4 font-bold text-gray-900">소스</th>
              <th className="px-6 py-4 font-bold text-gray-900">상태</th>
              <th className="px-6 py-4 font-bold text-gray-900">접수일</th>
              <th className="px-6 py-4 font-bold text-gray-900">작업</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">{lead.name}</td>
                <td className="px-6 py-4">{lead.email}</td>
                <td className="px-6 py-4">{lead.phone}</td>
                <td className="px-6 py-4">{lead.source}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    lead.status === 'new' ? 'bg-blue-100 text-blue-700' :
                    lead.status === 'contacted' ? 'bg-yellow-100 text-yellow-700' :
                    lead.status === 'qualified' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {lead.status}
                  </span>
                </td>
                <td className="px-6 py-4">{new Date(lead.created_at).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <button 
                    onClick={() => moveToInquiries(lead)}
                    className="text-xs bg-black text-white px-3 py-1 rounded-lg hover:bg-gray-800"
                  >
                    문의로 이동
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

async function moveToInquiries(lead: Lead) {
  if (!confirm('이 리드를 고객 문의 관리로 이동하시겠습니까?')) return;

  // 1. inquiries 테이블에 추가
  const { error: insertError } = await supabase
    .from('inquiries')
    .insert([{
      name: lead.name,
      email: lead.email || '',
      phone: lead.phone,
      company: '', // inquiries 테이블 구조에 맞춰 추가
      message: `[META 리드 이동] 소스: ${lead.source}`
    }]);

  if (insertError) {
    console.error('Error moving lead:', insertError);
    alert('이동 중 오류가 발생했습니다.');
    return;
  }

  // 2. leads 테이블에서 상태 업데이트 (또는 삭제)
  const { error: updateError } = await supabase
    .from('leads')
    .update({ status: 'moved' })
    .eq('id', lead.id);

  if (updateError) {
    console.error('Error updating lead status:', updateError);
    alert('이동은 완료되었으나 상태 업데이트에 실패했습니다.');
  } else {
    alert('문의 관리로 이동되었습니다.');
    // 리스트 새로고침
    window.location.reload();
  }
}
