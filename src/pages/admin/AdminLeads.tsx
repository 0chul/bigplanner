import React, { useState, useEffect } from 'react';
import { supabase, supabaseUrl } from '../../supabase';
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
  const [showLost, setShowLost] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Lead | null; direction: 'asc' | 'desc' }>({ key: 'created_at', direction: 'desc' });
  
  const newLeadsCount = leads.filter(lead => lead.status === 'new').length;
  // Custom Modal States
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({ isOpen: false, title: '', message: '', onConfirm: () => {} });
  
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchLeads();

    // 실시간 구독 추가
    const channel = supabase
      .channel('leads_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, () => {
        console.log("Leads changed, re-fetching...");
        fetchLeads();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchLeads() {
    console.log("Fetching leads...");
    
    const { data, error } = await supabase
      .from('leads')
      .select('id:id::text, name, email, phone, source, status, created_at')
      .order('created_at', { ascending: false });
    
    if (error) {
      // 에러 상세 내용을 콘솔에 출력
      console.error('Error fetching leads (Detailed):', JSON.stringify(error, null, 2));
      setErrorMsg(`리드 목록을 불러오는 중 오류가 발생했습니다: ${error.message}`);
    } else {
      console.log('DB에서 가져온 전체 데이터:', data);
      setLeads(data || []);
      setErrorMsg(null);
    }
  }

  function moveToInquiries(lead: Lead) {
    setConfirmModal({
      isOpen: true,
      title: '문의로 이동',
      message: '이 리드를 고객 문의 관리로 이동하시겠습니까?',
      onConfirm: async () => {
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
        
        // 1. inquiries 테이블에 추가
        const { error: insertError } = await supabase
          .from('inquiries')
          .insert([{
            name: lead.name || '이름 없음',
            email: lead.email || '',
            phone: lead.phone || '',
            address: '',
            message: `[리드 이동] 소스: ${lead.source || '알 수 없음'}`,
            status: 'new',
            created_at: new Date().toISOString()
          }]);

        if (insertError) {
          console.error('Error moving lead:', insertError);
          setErrorMsg(`이동 실패 (inquiries 추가): ${insertError.message || '알 수 없는 오류'}`);
          return;
        }

        // 2. leads 테이블에서 삭제
        const { error: deleteError } = await supabase
          .from('leads')
          .delete()
          .eq('id', lead.id);

        if (deleteError) {
          console.error('Error deleting lead after move:', deleteError);
          setErrorMsg(`이동 실패 (leads 삭제): ${deleteError.message || '알 수 없는 오류'}`);
        } else {
          fetchLeads();
        }
      }
    });
  }

  function deleteLead(id: string) {
    console.log('deleteLead called with id:', id, 'Type:', typeof id);
    setConfirmModal({
      isOpen: true,
      title: '리드 삭제',
      message: '정말로 이 리드를 삭제하시겠습니까?',
      onConfirm: async () => {
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
        
        // 삭제 전 데이터 확인
        const { data: checkData } = await supabase.from('leads').select('id:id::text').eq('id', id);
        console.log('삭제 전 DB에서 찾은 데이터:', checkData);
        
        const { error, count } = await supabase
          .from('leads')
          .delete({ count: 'exact' })
          .eq('id', id);

        if (error) {
          console.error('Error deleting lead:', error);
          setErrorMsg(`삭제 실패: ${error.message}`);
        } else if (count === 0) {
          console.warn('Delete operation returned 0 count. ID:', id);
          alert('해당 ID를 찾을 수 없습니다. 콘솔의 "삭제 전 DB에서 찾은 데이터"를 확인해주세요.');
        } else {
          console.log(`Lead deleted successfully.`);
          setLeads(prevLeads => prevLeads.filter(lead => lead.id !== id));
          fetchLeads();
        }
      }
    });
  }

  function openEditModal(lead: Lead) {
    setEditingLead(lead);
    setEditForm(lead);
  }

  async function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingLead) return;

    const { data, error } = await supabase
      .from('leads')
      .update({
        name: editForm.name,
        email: editForm.email,
        phone: editForm.phone,
        source: editForm.source,
        status: editForm.status,
      })
      .eq('id', editingLead.id)
      .select();

    if (error) {
      console.error('Error updating lead:', error);
      setErrorMsg(`수정 실패: ${error.message || '알 수 없는 오류'}`);
    } else if (!data || data.length === 0) {
      setErrorMsg('수정 권한이 없습니다. Supabase에서 leads 테이블의 UPDATE RLS 정책을 확인해주세요.');
    } else {
      setEditingLead(null);
      fetchLeads();
    }
  }

  async function handleStatusChange(leadId: string, newStatus: string) {
    // UI 즉각 업데이트 (Optimistic Update)
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
    
    const { error } = await supabase
      .from('leads')
      .update({ status: newStatus })
      .eq('id', leadId);

    if (error) {
      console.error('Error updating status:', error);
      setErrorMsg(`상태 변경 실패: ${error.message}`);
      fetchLeads(); // 에러 시 원래 데이터로 복구
    }
  }

  const handleSort = (key: keyof Lead) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  const sortedLeads = [...leads].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aVal = a[sortConfig.key] || '';
    const bVal = b[sortConfig.key] || '';
    if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredLeads = showLost ? sortedLeads : sortedLeads.filter(lead => lead.status !== 'lost');

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          META 리드 관리
          {newLeadsCount > 0 && (
            <span className="ml-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-red-500 text-white">
              신규 {newLeadsCount}
            </span>
          )}
        </h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => fetchLeads()}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-medium transition-colors"
          >
            데이터 새로고침
          </button>
          <button
            onClick={() => setShowLost(!showLost)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              showLost ? 'bg-gray-800 text-white hover:bg-gray-900' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {showLost ? '실패 항목 숨기기' : '실패 항목 보기'}
          </button>
          <div className="text-xs text-gray-400">
            Connected DB: {supabaseUrl}
          </div>
        </div>
      </div>
      
      {errorMsg && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl flex items-center justify-between">
          <p>{errorMsg}</p>
          <button onClick={() => setErrorMsg(null)} className="text-red-400 hover:text-red-600">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 font-bold text-gray-900 cursor-pointer" onClick={() => handleSort('name')}>이름 {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '▲' : '▼')}</th>
              <th className="px-6 py-4 font-bold text-gray-900 cursor-pointer" onClick={() => handleSort('email')}>이메일 {sortConfig.key === 'email' && (sortConfig.direction === 'asc' ? '▲' : '▼')}</th>
              <th className="px-6 py-4 font-bold text-gray-900 cursor-pointer" onClick={() => handleSort('phone')}>전화번호 {sortConfig.key === 'phone' && (sortConfig.direction === 'asc' ? '▲' : '▼')}</th>
              <th className="px-6 py-4 font-bold text-gray-900 cursor-pointer" onClick={() => handleSort('source')}>소스 {sortConfig.key === 'source' && (sortConfig.direction === 'asc' ? '▲' : '▼')}</th>
              <th className="px-6 py-4 font-bold text-gray-900 cursor-pointer" onClick={() => handleSort('status')}>상태 {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? '▲' : '▼')}</th>
              <th className="px-6 py-4 font-bold text-gray-900 cursor-pointer" onClick={() => handleSort('created_at')}>접수일 {sortConfig.key === 'created_at' && (sortConfig.direction === 'asc' ? '▲' : '▼')}</th>
              <th className="px-6 py-4 font-bold text-gray-900">작업</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredLeads.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                  접수된 문의가 없습니다.
                </td>
              </tr>
            ) : (
              filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{lead.name}</td>
                  <td className="px-6 py-4">{lead.email}</td>
                  <td className="px-6 py-4">{lead.phone}</td>
                  <td className="px-6 py-4">{lead.source}</td>
                  <td className="px-6 py-4">
                    <select
                      value={lead.status}
                      onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                      className={`px-2 py-1 rounded-full text-xs font-bold outline-none cursor-pointer ${
                        lead.status === 'new' ? 'bg-blue-100 text-blue-700' :
                        lead.status === 'contacted' ? 'bg-yellow-100 text-yellow-700' :
                        lead.status === 'lost' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}
                    >
                      <option value="new" className="bg-white text-gray-900">신규</option>
                      <option value="contacted" className="bg-white text-gray-900">부재중</option>
                      <option value="lost" className="bg-white text-gray-900">실패</option>
                    </select>
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
              ))
            )}
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
                  <option value="new">신규</option>
                  <option value="contacted">부재중</option>
                  <option value="lost">실패</option>
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

      {/* 확인 모달 */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl text-center">
            <h2 className="text-xl font-bold mb-2">{confirmModal.title}</h2>
            <p className="text-gray-600 mb-6">{confirmModal.message}</p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors"
              >
                취소
              </button>
              <button
                onClick={confirmModal.onConfirm}
                className="flex-1 px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800 font-medium transition-colors"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
