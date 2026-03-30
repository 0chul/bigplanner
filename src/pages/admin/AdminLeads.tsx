import { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { UserPlus, X, Edit2, Trash2, ArrowRight } from 'lucide-react';

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
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [editForm, setEditForm] = useState<Partial<Lead>>({});

  useEffect(() => {
    fetchLeads();

    // Supabase 실시간 데이터 구독 (새 리드가 들어오면 자동 새로고침)
    const subscription = supabase
      .channel('leads_channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'leads' },
        () => {
          fetchLeads();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
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

    // 2. leads 테이블에서 상태 업데이트
    const { error: updateError } = await supabase
      .from('leads')
      .update({ status: 'moved' })
      .eq('id', lead.id);

    if (updateError) {
      console.error('Error updating lead status:', updateError);
      alert('이동은 완료되었으나 상태 업데이트에 실패했습니다.');
    } else {
      alert('문의 관리로 이동되었습니다.');
      fetchLeads();
    }
  }

  async function deleteLead(id: string) {
    if (!confirm('정말로 이 리드를 삭제하시겠습니까? 삭제된 데이터는 복구할 수 없습니다.')) return;

    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting lead:', error);
      alert('삭제 중 오류가 발생했습니다.');
    } else {
      fetchLeads();
    }
  }

  function openEditModal(lead: Lead) {
    setEditingLead(lead);
    setEditForm(lead);
  }

  async function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingLead) return;

    const { error } = await supabase
      .from('leads')
      .update({
        name: editForm.name,
        email: editForm.email,
        phone: editForm.phone,
        source: editForm.source,
        status: editForm.status,
      })
      .eq('id', editingLead.id);

    if (error) {
      console.error('Error updating lead:', error);
      alert('수정 중 오류가 발생했습니다.');
    } else {
      setEditingLead(null);
      fetchLeads();
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
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => moveToInquiries(lead)}
                      className="flex items-center gap-1 text-xs bg-black text-white px-3 py-1.5 rounded-lg hover:bg-gray-800 transition-colors"
                      title="문의로 이동"
                    >
                      <ArrowRight className="w-3 h-3" />
                      이동
                    </button>
                    <button 
                      onClick={() => openEditModal(lead)}
                      className="flex items-center gap-1 text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors font-medium"
                      title="수정"
                    >
                      <Edit2 className="w-3 h-3" />
                      수정
                    </button>
                    <button 
                      onClick={() => deleteLead(lead.id)}
                      className="flex items-center gap-1 text-xs bg-red-50 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors font-medium"
                      title="삭제"
                    >
                      <Trash2 className="w-3 h-3" />
                      삭제
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 수정 모달 */}
      {editingLead && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">리드 수정</h2>
              <button onClick={() => setEditingLead(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
                <input
                  type="text"
                  value={editForm.name || ''}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
                <input
                  type="email"
                  value={editForm.email || ''}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">전화번호</label>
                <input
                  type="text"
                  value={editForm.phone || ''}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">소스</label>
                <input
                  type="text"
                  value={editForm.source || ''}
                  onChange={(e) => setEditForm({ ...editForm, source: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">상태</label>
                <select
                  value={editForm.status || 'new'}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                >
                  <option value="new">new</option>
                  <option value="contacted">contacted</option>
                  <option value="qualified">qualified</option>
                  <option value="moved">moved</option>
                </select>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingLead(null)}
                  className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800 font-medium transition-colors"
                >
                  저장
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
