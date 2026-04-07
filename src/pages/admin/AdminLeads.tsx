import React, { useState, useEffect } from 'react';
import { supabase, supabaseUrl } from '../../supabase';
import { UserPlus, X, Edit2, Trash2, ArrowRight, Send, Check, ChevronDown, ChevronUp, MessageSquare } from 'lucide-react';
import { formatPhoneNumber } from '../../utils/phoneUtils';
import SMSModal from '../../components/SMSModal';
import { getRelativeTime } from '../../utils/dateUtils';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  status: string;
  created_at: string;
  sms_status?: 'success' | 'failure';
  sms_error?: string;
}

interface Memo {
  id: string;
  lead_id: string;
  content: string;
  created_at: string;
}

export default function AdminLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [selectedSMS, setSelectedSMS] = useState<{ id: string; name: string; phone: string } | null>(null);
  const [editForm, setEditForm] = useState<Partial<Lead>>({});
  const [showLost, setShowLost] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Lead | null; direction: 'asc' | 'desc' }>({ key: 'created_at', direction: 'desc' });
  
  // Memo state
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [memos, setMemos] = useState<Record<string, Memo[]>>({});
  const [newMemo, setNewMemo] = useState('');
  const [editingMemoId, setEditingMemoId] = useState<string | null>(null);
  const [editingMemoContent, setEditingMemoContent] = useState('');

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
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'leads' }, () => {
        fetchLeads();
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'leads' }, () => {
        fetchLeads();
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'leads' }, () => {
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
      .select('id:id::text, name, email, phone, source, status, created_at, sms_status, sms_error')
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

  const toggleExpand = (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
      fetchMemos(id);
    }
  };

  const fetchMemos = async (leadId: string) => {
    const { data, error } = await supabase
      .from('lead_memos')
      .select('*')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false });
      
    if (!error && data) {
      setMemos(prev => ({ ...prev, [leadId]: data as Memo[] }));
    } else if (error) {
      console.error("Error fetching memos:", error);
    }
  };

  const handleAddMemo = async (leadId: string, content?: string) => {
    const memoContent = content || newMemo.trim();
    if (!memoContent) return;
    
    const { data, error } = await supabase
      .from('lead_memos')
      .insert([{ lead_id: leadId, content: memoContent }])
      .select();
      
    if (!error && data) {
      setMemos(prev => ({
        ...prev,
        [leadId]: [data[0] as Memo, ...(prev[leadId] || [])]
      }));
      if (!content) setNewMemo('');
    } else {
      console.error("Error adding memo:", error);
      alert('메모 추가에 실패했습니다.');
    }
  };

  const startEditingMemo = (memo: Memo) => {
    setEditingMemoId(memo.id);
    setEditingMemoContent(memo.content);
  };

  const cancelEditingMemo = () => {
    setEditingMemoId(null);
    setEditingMemoContent('');
  };

  const handleUpdateMemo = async (leadId: string, memoId: string) => {
    if (!editingMemoContent.trim()) return;
    
    const { error } = await supabase
      .from('lead_memos')
      .update({ content: editingMemoContent.trim() })
      .eq('id', memoId);
      
    if (!error) {
      setMemos(prev => ({
        ...prev,
        [leadId]: prev[leadId].map(m => m.id === memoId ? { ...m, content: editingMemoContent.trim() } : m)
      }));
      setEditingMemoId(null);
      setEditingMemoContent('');
    } else {
      console.error("Error updating memo:", error);
      alert('메모 수정에 실패했습니다.');
    }
  };

  const handleDeleteMemo = async (leadId: string, memoId: string) => {
    if (!window.confirm("이 메모를 정말 삭제하시겠습니까?")) return;
    
    const { error } = await supabase
      .from('lead_memos')
      .delete()
      .eq('id', memoId);
      
    if (!error) {
      setMemos(prev => ({
        ...prev,
        [leadId]: prev[leadId].filter(m => m.id !== memoId)
      }));
    } else {
      console.error("Error deleting memo:", error);
      alert('메모 삭제에 실패했습니다.');
    }
  };

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
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">
          META 리드 관리
          {newLeadsCount > 0 && (
            <span className="ml-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-red-500 text-white">
              신규 {newLeadsCount}
            </span>
          )}
        </h1>
        <div className="flex flex-wrap items-center gap-2 md:gap-4 w-full md:w-auto">
          <button
            onClick={() => fetchLeads()}
            className="px-3 py-2 md:px-4 md:py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs md:text-sm font-medium transition-colors"
          >
            데이터 새로고침
          </button>
          <button
            onClick={() => setShowLost(!showLost)}
            className={`px-3 py-2 md:px-4 md:py-2 rounded-xl text-xs md:text-sm font-medium transition-colors ${
              showLost ? 'bg-gray-800 text-white hover:bg-gray-900' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {showLost ? '실패 항목 숨기기' : '실패 항목 보기'}
          </button>
          <div className="text-[10px] md:text-xs text-gray-400 w-full md:w-auto mt-2 md:mt-0">
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
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-bold text-gray-900 w-10 whitespace-nowrap"></th>
                <th className="px-6 py-4 font-bold text-gray-900 cursor-pointer whitespace-nowrap" onClick={() => handleSort('name')}>이름 {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '▲' : '▼')}</th>
                <th className="px-6 py-4 font-bold text-gray-900 cursor-pointer whitespace-nowrap" onClick={() => handleSort('email')}>이메일 {sortConfig.key === 'email' && (sortConfig.direction === 'asc' ? '▲' : '▼')}</th>
                <th className="px-6 py-4 font-bold text-gray-900 cursor-pointer whitespace-nowrap" onClick={() => handleSort('phone')}>전화번호 {sortConfig.key === 'phone' && (sortConfig.direction === 'asc' ? '▲' : '▼')}</th>
                <th className="px-6 py-4 font-bold text-gray-900 cursor-pointer whitespace-nowrap" onClick={() => handleSort('source')}>소스 {sortConfig.key === 'source' && (sortConfig.direction === 'asc' ? '▲' : '▼')}</th>
                <th className="px-6 py-4 font-bold text-gray-900 cursor-pointer whitespace-nowrap" onClick={() => handleSort('status')}>상태 {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? '▲' : '▼')}</th>
                <th className="px-6 py-4 font-bold text-gray-900 cursor-pointer whitespace-nowrap" onClick={() => handleSort('created_at')}>접수일 {sortConfig.key === 'created_at' && (sortConfig.direction === 'asc' ? '▲' : '▼')}</th>
                <th className="px-6 py-4 font-bold text-gray-900 whitespace-nowrap">작업</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                    접수된 문의가 없습니다.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <React.Fragment key={lead.id}>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap cursor-pointer" onClick={() => toggleExpand(lead.id)}>
                        {expandedId === lead.id ? (
                          <ChevronUp size={20} className="text-gray-400" />
                        ) : (
                          <ChevronDown size={20} className="text-gray-400" />
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{lead.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{lead.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-2">
                          {formatPhoneNumber(lead.phone)}
                          {lead.sms_status === 'success' ? (
                            <Check size={14} className="text-green-500" />
                          ) : lead.sms_status === 'failure' ? (
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={(e) => { e.stopPropagation(); alert(lead.sms_error); }}
                                className="text-red-500 hover:text-red-700"
                                title={`실패 사유: ${lead.sms_error}`}
                              >
                                <X size={14} />
                              </button>
                              <button 
                                onClick={(e) => { e.stopPropagation(); setSelectedSMS({ id: lead.id, name: lead.name, phone: lead.phone }); }}
                                className="text-gray-400 hover:text-blue-500"
                                title="문자 다시 보내기"
                              >
                                <Send size={14} />
                              </button>
                            </div>
                          ) : (
                            <button 
                              onClick={() => setSelectedSMS({ id: lead.id, name: lead.name, phone: lead.phone })}
                              className="text-gray-400 hover:text-black"
                              title="문자 보내기"
                            >
                              <Send size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{lead.source}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{new Date(lead.created_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => moveToInquiries(lead)}
                            className="flex items-center gap-1 text-xs bg-black text-white px-3 rounded-lg hover:bg-gray-800 transition-colors"
                            title="문의로 이동"
                          >
                            <ArrowRight className="w-3 h-3" />
                            <span className="hidden sm:inline">이동</span>
                          </button>
                          <button 
                            onClick={() => openEditModal(lead)}
                            className="flex items-center gap-1 text-xs bg-blue-50 text-blue-600 px-3 rounded-lg hover:bg-blue-100 transition-colors font-medium"
                            title="수정"
                          >
                            <Edit2 className="w-3 h-3" />
                            <span className="hidden sm:inline">수정</span>
                          </button>
                          <button 
                            onClick={() => deleteLead(lead.id)}
                            className="flex items-center gap-1 text-xs bg-red-50 text-red-600 px-3 rounded-lg hover:bg-red-100 transition-colors font-medium"
                            title="삭제"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span className="hidden sm:inline">삭제</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expandedId === lead.id && (
                      <tr>
                        <td colSpan={8} className="px-0 py-0 bg-gray-50 border-b border-gray-200">
                          <div className="p-6 pl-24">
                            <div className="mb-4">
                              <h4 className="text-sm font-semibold text-gray-900 mb-4">진행 타임라인</h4>
                              <div className="flex flex-col gap-2 mb-6">
                                <div className="flex gap-2">
                                  {['부재중', '나중에 연락'].map(text => (
                                    <button
                                      key={text}
                                      onClick={() => handleAddMemo(lead.id, text)}
                                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-medium transition-colors"
                                    >
                                      {text}
                                    </button>
                                  ))}
                                </div>
                                <div className="flex gap-2">
                                  <input 
                                    type="text" 
                                    value={newMemo}
                                    onChange={e => setNewMemo(e.target.value)}
                                    placeholder="새로운 메모를 입력하세요" 
                                    className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2.5 border"
                                    onKeyDown={e => e.key === 'Enter' && handleAddMemo(lead.id)}
                                  />
                                  <button 
                                    onClick={() => handleAddMemo(lead.id)}
                                    className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm whitespace-nowrap"
                                  >
                                    등록
                                  </button>
                                </div>
                              </div>
                              <div className="relative pl-4 border-l-2 border-indigo-100 space-y-6">
                                {memos[lead.id]?.map(memo => (
                                  <div key={memo.id} className="relative pl-6">
                                    <div className="absolute left-[-21px] top-1.5 w-2.5 h-2.5 bg-indigo-500 rounded-full border-2 border-white shadow-sm"></div>
                                    <div className="flex items-center justify-between mb-1.5">
                                      <div className="text-xs text-gray-500 font-medium">
                                        {getRelativeTime(memo.created_at)}
                                      </div>
                                      <div className="flex items-center gap-1">
                                        {editingMemoId === memo.id ? (
                                          <>
                                            <button onClick={() => handleUpdateMemo(lead.id, memo.id)} className="text-green-600 hover:text-green-700 p-1 rounded-md hover:bg-green-50 transition-colors" title="저장">
                                              <Check size={14} />
                                            </button>
                                            <button onClick={cancelEditingMemo} className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100 transition-colors" title="취소">
                                              <X size={14} />
                                            </button>
                                          </>
                                        ) : (
                                          <>
                                            <button onClick={() => startEditingMemo(memo)} className="text-gray-400 hover:text-indigo-600 p-1 rounded-md hover:bg-indigo-50 transition-colors" title="수정">
                                              <Edit2 size={14} />
                                            </button>
                                            <button onClick={() => handleDeleteMemo(lead.id, memo.id)} className="text-gray-400 hover:text-red-600 p-1 rounded-md hover:bg-red-50 transition-colors" title="삭제">
                                              <Trash2 size={14} />
                                            </button>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                    <div className="text-sm text-gray-800 bg-white p-3.5 rounded-lg shadow-sm border border-gray-100">
                                      {editingMemoId === memo.id ? (
                                        <textarea
                                          value={editingMemoContent}
                                          onChange={(e) => setEditingMemoContent(e.target.value)}
                                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border min-h-[80px]"
                                          autoFocus
                                        />
                                      ) : (
                                        <div className="whitespace-pre-wrap">{memo.content}</div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                                {(!memos[lead.id] || memos[lead.id].length === 0) && (
                                  <div className="text-sm text-gray-500 italic pl-2 py-2">
                                    아직 등록된 메모가 없습니다.
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-gray-100">
          {filteredLeads.length === 0 ? (
            <div className="p-6 text-center text-gray-500">접수된 문의가 없습니다.</div>
          ) : (
            filteredLeads.map((lead) => (
              <div key={lead.id} className="p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                    lead.status === 'new' ? 'bg-blue-100 text-blue-700' :
                    lead.status === 'contacted' ? 'bg-yellow-100 text-yellow-700' :
                    lead.status === 'lost' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {lead.status === 'new' ? '신규' : lead.status === 'contacted' ? '부재중' : '실패'}
                  </span>
                  <span className="text-xs text-gray-500">{new Date(lead.created_at).toLocaleDateString()}</span>
                </div>
                <div className="font-bold text-gray-900">{lead.name}</div>
                <div className="text-sm text-gray-600 flex items-center gap-2">
                  {formatPhoneNumber(lead.phone)}
                  {lead.sms_status === 'success' ? (
                    <Check size={14} className="text-green-500" />
                  ) : lead.sms_status === 'failure' ? (
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={(e) => { e.stopPropagation(); alert(lead.sms_error); }}
                        className="text-red-500"
                      >
                        <X size={14} />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setSelectedSMS({ id: lead.id, name: lead.name, phone: lead.phone }); }}
                        className="text-blue-500"
                      >
                        <Send size={14} />
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={(e) => { e.stopPropagation(); setSelectedSMS({ id: lead.id, name: lead.name, phone: lead.phone }); }}
                      className="text-gray-400"
                    >
                      <Send size={14} />
                    </button>
                  )}
                  {lead.email && <span className="text-gray-300 mx-1">|</span>}
                  {lead.email && <span className="truncate">{lead.email}</span>}
                </div>
                <div className="text-sm text-gray-500">소스: {lead.source}</div>
                <div className="flex justify-end gap-2">
                  <button onClick={() => moveToInquiries(lead)} className="p-2 text-black bg-gray-100 rounded-lg"><ArrowRight size={16}/></button>
                  <button onClick={() => openEditModal(lead)} className="p-2 text-blue-600 bg-blue-50 rounded-lg"><Edit2 size={16}/></button>
                  <button onClick={() => deleteLead(lead.id)} className="p-2 text-red-600 bg-red-50 rounded-lg"><Trash2 size={16}/></button>
                </div>
              </div>
            ))
          )}
        </div>
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
      {selectedSMS && (
        <SMSModal 
          name={selectedSMS.name} 
          phone={selectedSMS.phone} 
          onClose={async (success, errorMessage) => {
            const newStatus = success ? 'success' : 'failure';
            
            // 1. Supabase 업데이트
            const { error } = await supabase
              .from('leads')
              .update({ 
                sms_status: newStatus,
                sms_error: errorMessage || null
              })
              .eq('id', selectedSMS.id);

            if (error) {
              console.error('Error updating SMS status:', error);
              setErrorMsg('SMS 상태 저장 실패');
            } else {
              // 2. 로컬 상태 업데이트
              setLeads(prev => prev.map(lead => 
                lead.id === selectedSMS.id 
                  ? { ...lead, sms_status: newStatus, sms_error: errorMessage || undefined } 
                  : lead
              ));
            }
            setSelectedSMS(null);
          }} 
        />
      )}
    </div>
  );
}
