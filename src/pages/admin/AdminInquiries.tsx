import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase, supabaseUrl } from '../../supabase';
import { Trash2, ChevronDown, ChevronUp, MessageSquare, Edit2, Check, X, Share2, Send } from 'lucide-react';
import { getRelativeTime } from '../../utils/dateUtils';
import { formatPhoneNumber } from '../../utils/phoneUtils';
import SMSModal from '../../components/SMSModal';

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  message: string;
  status: 'new' | 'in-progress' | 'completed' | 'failed';
  sms_status?: 'success' | 'failure';
  sms_error?: string;
  created_at: any;
  share_token?: string;
}

interface Memo {
  id: string;
  inquiry_id: string;
  content: string;
  created_at: string;
}

export default function AdminInquiries() {
  const { isAdmin, loading } = useAuth();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [fetching, setFetching] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Memo state
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedSMS, setSelectedSMS] = useState<{ id: string; name: string; phone: string } | null>(null);
  const [memos, setMemos] = useState<Record<string, Memo[]>>({});
  const [newMemo, setNewMemo] = useState('');
  const [editingMemoId, setEditingMemoId] = useState<string | null>(null);
  const [editingMemoContent, setEditingMemoContent] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newInquiry, setNewInquiry] = useState({ name: '', email: '', phone: '', address: '', message: '' });
  const [showFailedInquiries, setShowFailedInquiries] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Inquiry | null; direction: 'asc' | 'desc' }>({ key: 'created_at', direction: 'desc' });
  
  const newInquiriesCount = inquiries.filter(inq => inq.status === 'new').length;
  // Edit Modal States
  const [editingInquiry, setEditingInquiry] = useState<Inquiry | null>(null);
  const [editForm, setEditForm] = useState<Partial<Inquiry>>({});

  useEffect(() => {
    if (!isAdmin) return;

    const fetchInquiries = async () => {
      console.log("🔍 [DEBUG] Fetching inquiries...");
      setErrorMsg(null);
      
      const response = await supabase
        .from('inquiries')
        .select('*');
      
      if (response.error) {
        console.error("❌ [DEBUG] Error fetching inquiries:", response.error);
        setErrorMsg(`데이터를 불러오는 중 오류가 발생했습니다: ${response.error.message}`);
      } else {
        setInquiries(response.data as Inquiry[]);
      }
      setFetching(false);
    };

    fetchInquiries();

    // 실시간 구독 추가
    const channel = supabase
      .channel('inquiries_changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'inquiries' }, (payload) => {
        console.log("New inquiry detected, attempting auto-SMS:", payload.new);
        handleAutoSMS(payload.new as Inquiry);
        fetchInquiries();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'inquiries' }, () => {
        fetchInquiries();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAdmin]);

  async function handleAutoSMS(inquiry: Inquiry) {
    if (!inquiry.phone) return;
    
    const message = `안녕하세요 ${inquiry.name}님, 건축 상담 문의 남겨주셔서 연락드렸습니다.
www.bigplanner.co.kr`;

    try {
      const { data, error } = await supabase.functions.invoke('send-sms', {
        body: { receiver: inquiry.phone.replace(/-/g, ''), msg: message, name: inquiry.name },
      });
      
      let sms_status: 'success' | 'failure' = 'failure';
      let sms_error: string | undefined = undefined;

      if (error) {
        sms_error = error.message || 'Supabase Function 호출 실패';
      } else if (data?.error) {
        sms_error = data.error;
      } else if (data?.statusCode === '2000' || data?.messageId) {
        sms_status = 'success';
      } else {
        sms_error = data?.errorMessage || data?.error || '알 수 없는 오류';
      }

      await supabase
        .from('inquiries')
        .update({ sms_status, sms_error })
        .eq('id', inquiry.id);

    } catch (error: any) {
      console.error('Auto SMS error:', error);
      await supabase
        .from('inquiries')
        .update({ sms_status: 'failure', sms_error: error.message || '오류 발생' })
        .eq('id', inquiry.id);
    }
  }

  const updateStatus = async (id: string, newStatus: 'new' | 'in-progress' | 'completed' | 'failed') => {
    try {
      const { data, error } = await supabase
        .from('inquiries')
        .update({ status: newStatus })
        .eq('id', id)
        .select();
        
      if (error) {
        if (error.code === 'PGRST204' || error.message.includes('status') || error.code === '42703') {
          throw new Error('status 컬럼이 없거나 타입이 일치하지 않습니다. Supabase에서 inquiries 테이블에 status 컬럼(text 타입, 기본값 \'new\')을 확인해주세요.');
        }
        throw error;
      }
      
      if (!data || data.length === 0) {
        throw new Error("업데이트 권한이 없습니다. Supabase에서 inquiries 테이블의 UPDATE RLS 정책을 추가해주세요.");
      }
      
      // 상태 업데이트 성공 시 로컬 상태도 즉시 반영
      setInquiries(prev => prev.map(inq => inq.id === id ? { ...inq, status: newStatus } : inq));
    } catch (error: any) {
      console.error("Error updating status:", error);
      alert(error.message || "상태 업데이트에 실패했습니다.");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("정말로 이 문의를 삭제하시겠습니까?")) {
      try {
        console.log("Deleting inquiry with id:", id);
        
        // 삭제 전 데이터 확인
        const { data: checkData } = await supabase.from('inquiries').select('id').eq('id', id);
        console.log('삭제 전 DB에서 찾은 데이터:', checkData);

        const { error, count } = await supabase
          .from('inquiries')
          .delete({ count: 'exact' })
          .eq('id', id);
          
        if (error) throw error;
        
        if (count === 0) {
          console.warn('Delete operation returned 0 count. ID:', id);
          alert('해당 데이터가 DB에 존재하지 않거나 삭제 권한이 없습니다. (이미 삭제된 유령 데이터일 수 있습니다)');
        } else {
          console.log("Delete successful. Count:", count);
        }
        
        // 로컬 상태에서 즉시 제거하여 UI 동기화
        setInquiries(prev => prev.filter(inq => inq.id !== id));
        
      } catch (error: any) {
        console.error("Error deleting inquiry:", error);
        alert(error.message || "삭제에 실패했습니다.");
      }
    }
  };

  const handleShare = async (inquiry: Inquiry) => {
    let token = inquiry.share_token;
    if (!token) {
      token = crypto.randomUUID();
      const { error } = await supabase
        .from('inquiries')
        .update({ share_token: token })
        .eq('id', inquiry.id);
      
      if (error) {
        alert('공유 링크 생성 실패: ' + error.message);
        return;
      }
      setInquiries(prev => prev.map(inq => inq.id === inquiry.id ? { ...inq, share_token: token } : inq));
    }
    
    const shareUrl = `${window.location.origin}/share/inquiry/${token}`;
    navigator.clipboard.writeText(shareUrl);
    alert('공유 링크가 복사되었습니다: ' + shareUrl);
  };

  const toggleExpand = (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
      fetchMemos(id);
    }
  };

  const fetchMemos = async (inquiryId: string) => {
    const { data, error } = await supabase
      .from('inquiry_memos')
      .select('*')
      .eq('inquiry_id', inquiryId)
      .order('created_at', { ascending: false });
      
    if (!error && data) {
      setMemos(prev => ({ ...prev, [inquiryId]: data as Memo[] }));
    } else if (error) {
      if (error.code === 'PGRST205') {
        console.warn("inquiry_memos 테이블이 존재하지 않습니다. Supabase SQL Editor에서 테이블을 생성해주세요.");
      } else {
        console.error("Error fetching memos:", error);
      }
    }
  };

  const handleAddMemo = async (inquiryId: string, content?: string) => {
    const memoContent = content || newMemo.trim();
    if (!memoContent) return;
    
    const { data, error } = await supabase
      .from('inquiry_memos')
      .insert([{ inquiry_id: inquiryId, content: memoContent }])
      .select();
      
    if (!error && data) {
      setMemos(prev => ({
        ...prev,
        [inquiryId]: [data[0] as Memo, ...(prev[inquiryId] || [])]
      }));
      if (!content) setNewMemo('');
    } else {
      console.error("Error adding memo:", error);
      alert('메모 추가에 실패했습니다. (테이블이 생성되었는지 확인해주세요)');
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

  const handleUpdateMemo = async (inquiryId: string, memoId: string) => {
    if (!editingMemoContent.trim()) return;
    
    const { error } = await supabase
      .from('inquiry_memos')
      .update({ content: editingMemoContent.trim() })
      .eq('id', memoId);
      
    if (!error) {
      setMemos(prev => ({
        ...prev,
        [inquiryId]: prev[inquiryId].map(m => m.id === memoId ? { ...m, content: editingMemoContent.trim() } : m)
      }));
      setEditingMemoId(null);
      setEditingMemoContent('');
    } else {
      console.error("Error updating memo:", error);
      alert('메모 수정에 실패했습니다.');
    }
  };

  const handleDeleteMemo = async (inquiryId: string, memoId: string) => {
    if (!window.confirm("이 메모를 정말 삭제하시겠습니까?")) return;
    
    const { error } = await supabase
      .from('inquiry_memos')
      .delete()
      .eq('id', memoId);
      
    if (!error) {
      setMemos(prev => ({
        ...prev,
        [inquiryId]: prev[inquiryId].filter(m => m.id !== memoId)
      }));
    } else {
      console.error("Error deleting memo:", error);
      alert('메모 삭제에 실패했습니다.');
    }
  };

  const handleAddInquiry = async () => {
    const { data, error } = await supabase.from('inquiries').insert([{
      ...newInquiry,
      status: 'new'
    }]).select();

    if (error) {
      alert('문의 추가 실패: ' + error.message);
    } else {
      setInquiries([data[0] as Inquiry, ...inquiries]);
      setIsCreateModalOpen(false);
      setNewInquiry({ name: '', email: '', phone: '', address: '', message: '' });
    }
  };

  const openEditModal = (inquiry: Inquiry) => {
    setEditingInquiry(inquiry);
    setEditForm(inquiry);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingInquiry) return;

    const { error } = await supabase
      .from('inquiries')
      .update({
        name: editForm.name,
        email: editForm.email,
        phone: editForm.phone,
        address: editForm.address,
        message: editForm.message,
        status: editForm.status,
      })
      .eq('id', editingInquiry.id);

    if (error) {
      console.error('Error updating inquiry:', error);
      setErrorMsg(`수정 실패: ${error.message}`);
    } else {
      setInquiries(prev => prev.map(inq => inq.id === editingInquiry.id ? { ...inq, ...editForm } as Inquiry : inq));
      setEditingInquiry(null);
      setEditForm({});
    }
  };

  if (loading || fetching) return <div className="p-8">Loading...</div>;
  if (!isAdmin) return <div className="p-8">접근 권한이 없습니다.</div>;

  const handleSort = (key: keyof Inquiry) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  const sortedInquiries = [...inquiries].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aVal = a[sortConfig.key] || '';
    const bVal = b[sortConfig.key] || '';
    if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 md:p-8 rounded-2xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">문의 직접 작성</h2>
            <input type="text" placeholder="이름" value={newInquiry.name} onChange={e => setNewInquiry({...newInquiry, name: e.target.value})} className="w-full mb-2 p-2 border rounded" />
            <input type="email" placeholder="이메일" value={newInquiry.email} onChange={e => setNewInquiry({...newInquiry, email: e.target.value})} className="w-full mb-2 p-2 border rounded" />
            <input type="tel" placeholder="연락처" value={newInquiry.phone} onChange={e => setNewInquiry({...newInquiry, phone: e.target.value})} className="w-full mb-2 p-2 border rounded" />
            <input type="text" placeholder="주소" value={newInquiry.address} onChange={e => setNewInquiry({...newInquiry, address: e.target.value})} className="w-full mb-2 p-2 border rounded" />
            <textarea placeholder="문의 내용" value={newInquiry.message} onChange={e => setNewInquiry({...newInquiry, message: e.target.value})} className="w-full mb-4 p-2 border rounded" />
            <div className="flex justify-end gap-2">
              <button onClick={() => setIsCreateModalOpen(false)} className="px-4 py-2 text-gray-600">취소</button>
              <button onClick={handleAddInquiry} className="px-4 py-2 bg-indigo-600 text-white rounded-lg">작성 완료</button>
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">
          고객 문의 관리
          {newInquiriesCount > 0 && (
            <span className="ml-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-red-500 text-white">
              신규 {newInquiriesCount}
            </span>
          )}
        </h1>
        <div className="flex flex-wrap items-center gap-2 md:gap-4 w-full md:w-auto">
          <button
            onClick={() => setShowFailedInquiries(!showFailedInquiries)}
            className={`px-3 py-2 md:px-4 md:py-2 rounded-xl text-xs md:text-sm font-medium transition-colors ${
              showFailedInquiries ? 'bg-gray-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            {showFailedInquiries ? '실패 항목 숨기기' : '실패 항목 보기'}
          </button>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-3 py-2 md:px-4 md:py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs md:text-sm font-medium transition-colors"
          >
            + 문의 직접 작성
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
          <table className="min-w-[800px] divide-y divide-gray-200">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-bold text-gray-900 w-10 whitespace-nowrap"></th>
                <th className="px-6 py-4 font-bold text-gray-900 cursor-pointer whitespace-nowrap" onClick={() => handleSort('status')}>상태 {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? '▲' : '▼')}</th>
                <th className="px-6 py-4 font-bold text-gray-900 cursor-pointer whitespace-nowrap" onClick={() => handleSort('created_at')}>날짜 {sortConfig.key === 'created_at' && (sortConfig.direction === 'asc' ? '▲' : '▼')}</th>
                <th className="px-6 py-4 font-bold text-gray-900 cursor-pointer whitespace-nowrap" onClick={() => handleSort('name')}>이름/주소 {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '▲' : '▼')}</th>
                <th className="px-6 py-4 font-bold text-gray-900 cursor-pointer whitespace-nowrap" onClick={() => handleSort('phone')}>연락처 {sortConfig.key === 'phone' && (sortConfig.direction === 'asc' ? '▲' : '▼')}</th>
                <th className="px-6 py-4 font-bold text-gray-900 cursor-pointer whitespace-nowrap" onClick={() => handleSort('message')}>문의 내용 {sortConfig.key === 'message' && (sortConfig.direction === 'asc' ? '▲' : '▼')}</th>
                <th className="px-6 py-4 font-bold text-gray-900 text-right whitespace-nowrap">관리</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedInquiries
                .filter(inq => showFailedInquiries || inq.status !== 'failed')
                .map((inquiry) => (
                <React.Fragment key={inquiry.id}>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap cursor-pointer" onClick={() => toggleExpand(inquiry.id)}>
                      {expandedId === inquiry.id ? (
                        <ChevronUp size={20} className="text-gray-400" />
                      ) : (
                        <ChevronDown size={20} className="text-gray-400" />
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={inquiry.status}
                        onChange={(e) => updateStatus(inquiry.id, e.target.value as any)}
                        className={`text-sm rounded-full px-3 py-1 font-semibold border-0 ${
                          inquiry.status === 'new' ? 'bg-red-100 text-red-800' :
                          inquiry.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                          inquiry.status === 'completed' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <option value="new">신규</option>
                        <option value="in-progress">진행중</option>
                        <option value="completed">완료</option>
                        <option value="failed">실패</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 cursor-pointer" onClick={() => toggleExpand(inquiry.id)}>
                      {inquiry.created_at ? getRelativeTime(inquiry.created_at) : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap cursor-pointer" onClick={() => toggleExpand(inquiry.id)}>
                      <div className="text-sm font-medium text-gray-900">{inquiry.name}</div>
                      <div className="text-sm text-gray-500">{inquiry.address || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap cursor-pointer" onClick={() => toggleExpand(inquiry.id)}>
                      <div className="flex items-center gap-2">
                        <div className="text-sm text-gray-900">{formatPhoneNumber(inquiry.phone)}</div>
                        {inquiry.sms_status === 'success' ? (
                          <Check size={14} className="text-green-500" />
                        ) : inquiry.sms_status === 'failure' ? (
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={(e) => { e.stopPropagation(); alert(inquiry.sms_error); }}
                              className="text-red-500 hover:text-red-700"
                              title={`실패 사유: ${inquiry.sms_error}`}
                            >
                              <X size={14} />
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); setSelectedSMS({ id: inquiry.id, name: inquiry.name, phone: inquiry.phone }); }}
                              className="text-gray-400 hover:text-blue-500"
                              title="문자 다시 보내기"
                            >
                              <Send size={14} />
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={(e) => { e.stopPropagation(); setSelectedSMS({ id: inquiry.id, name: inquiry.name, phone: inquiry.phone }); }}
                            className="text-gray-400 hover:text-black"
                            title="문자 보내기"
                          >
                            <Send size={14} />
                          </button>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">{inquiry.email}</div>
                    </td>
                    <td className="px-6 py-4 cursor-pointer" onClick={() => toggleExpand(inquiry.id)}>
                      <div className="text-sm text-gray-900 max-w-xs truncate" title={inquiry.message}>
                        {inquiry.message}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => openEditModal(inquiry)} className="text-indigo-600 hover:text-indigo-900 p-2 rounded-full hover:bg-indigo-50 transition-colors mr-2" title="수정">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => handleShare(inquiry)} className="text-green-600 hover:text-green-900 p-2 rounded-full hover:bg-green-50 transition-colors mr-2" title="공유">
                        <Share2 size={18} />
                      </button>
                      <button onClick={() => handleDelete(inquiry.id)} className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-50 transition-colors" title="삭제">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                
                {/* Expanded Timeline Section */}
                {expandedId === inquiry.id && (
                  <tr>
                    <td colSpan={7} className="px-0 py-0 bg-gray-50 border-b border-gray-200">
                      <div className="p-6 pl-24">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
                          <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                            <MessageSquare size={16} className="text-indigo-500" />
                            상세 문의 내용
                          </h4>
                          <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                            {inquiry.message}
                          </p>
                        </div>

                        <div className="mb-4">
                          <h4 className="text-sm font-semibold text-gray-900 mb-4">진행 타임라인</h4>
                          
                          {/* Add Memo Input */}
                          <div className="flex flex-col gap-2 mb-6">
                            <div className="flex gap-2">
                              {['부재중', '나중에 연락'].map(text => (
                                <button
                                  key={text}
                                  onClick={() => handleAddMemo(inquiry.id, text)}
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
                                onKeyDown={e => e.key === 'Enter' && handleAddMemo(inquiry.id)}
                              />
                              <button 
                                onClick={() => handleAddMemo(inquiry.id)}
                                className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm whitespace-nowrap"
                              >
                                등록
                              </button>
                            </div>
                          </div>

                          {/* Timeline */}
                          <div className="relative pl-4 border-l-2 border-indigo-100 space-y-6">
                            {memos[inquiry.id]?.map(memo => (
                              <div key={memo.id} className="relative pl-6">
                                <div className="absolute left-[-21px] top-1.5 w-2.5 h-2.5 bg-indigo-500 rounded-full border-2 border-white shadow-sm"></div>
                                <div className="flex items-center justify-between mb-1.5">
                                  <div className="text-xs text-gray-500 font-medium">
                                    {getRelativeTime(memo.created_at)}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    {editingMemoId === memo.id ? (
                                      <>
                                        <button onClick={() => handleUpdateMemo(inquiry.id, memo.id)} className="text-green-600 hover:text-green-700 p-1 rounded-md hover:bg-green-50 transition-colors" title="저장">
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
                                        <button onClick={() => handleDeleteMemo(inquiry.id, memo.id)} className="text-gray-400 hover:text-red-600 p-1 rounded-md hover:bg-red-50 transition-colors" title="삭제">
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
                            
                            {(!memos[inquiry.id] || memos[inquiry.id].length === 0) && (
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
            ))}
            {inquiries.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                  접수된 문의가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-gray-100">
          {sortedInquiries
            .filter(inq => showFailedInquiries || inq.status !== 'failed')
            .map((inquiry) => (
              <div key={inquiry.id} className="p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                    inquiry.status === 'new' ? 'bg-red-100 text-red-800' :
                    inquiry.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                    inquiry.status === 'completed' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {inquiry.status === 'new' ? '신규' : inquiry.status === 'in-progress' ? '진행중' : inquiry.status === 'completed' ? '완료' : '실패'}
                  </span>
                  <span className="text-xs text-gray-500">{inquiry.created_at ? getRelativeTime(inquiry.created_at) : 'N/A'}</span>
                </div>
                <div className="font-bold text-gray-900">{inquiry.name}</div>
                <div className="text-sm text-gray-600 flex items-center gap-2">
                  {formatPhoneNumber(inquiry.phone)} / {inquiry.email}
                  {inquiry.sms_status === 'success' && <Check size={14} className="text-green-500" />}
                </div>
                <div className="text-sm text-gray-700 bg-gray-50 p-2 rounded-lg">{inquiry.message}</div>
                <div className="flex justify-end gap-2">
                  <button onClick={() => openEditModal(inquiry)} className="p-2 text-indigo-600 bg-indigo-50 rounded-lg"><Edit2 size={16}/></button>
                  <button onClick={() => handleDelete(inquiry.id)} className="p-2 text-red-600 bg-red-50 rounded-lg"><Trash2 size={16}/></button>
                </div>
              </div>
            ))}
        </div>
      </div>
      {/* Edit Modal */}
      {editingInquiry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">문의 수정</h2>
              <button onClick={() => setEditingInquiry(null)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <input type="text" placeholder="이름" value={editForm.name || ''} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full p-2 border rounded" required />
              <input type="email" placeholder="이메일" value={editForm.email || ''} onChange={e => setEditForm({...editForm, email: e.target.value})} className="w-full p-2 border rounded" />
              <input type="tel" placeholder="연락처" value={editForm.phone || ''} onChange={e => setEditForm({...editForm, phone: e.target.value})} className="w-full p-2 border rounded" />
              <input type="text" placeholder="주소" value={editForm.address || ''} onChange={e => setEditForm({...editForm, address: e.target.value})} className="w-full p-2 border rounded" />
              <textarea placeholder="문의 내용" value={editForm.message || ''} onChange={e => setEditForm({...editForm, message: e.target.value})} className="w-full p-2 border rounded" rows={4} />
              <select value={editForm.status || 'new'} onChange={e => setEditForm({...editForm, status: e.target.value as any})} className="w-full p-2 border rounded">
                <option value="new">신규</option>
                <option value="in-progress">진행중</option>
                <option value="completed">완료</option>
                <option value="failed">실패</option>
              </select>
              <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={() => setEditingInquiry(null)} className="px-4 py-2 text-gray-600">취소</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg">저장</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {selectedSMS && (
        <SMSModal 
          name={selectedSMS.name} 
          phone={selectedSMS.phone} 
          onClose={async (success, errorMessage) => {
            if (success) {
              const { error } = await supabase
                .from('inquiries')
                .update({ sms_status: 'success', sms_error: null })
                .eq('id', selectedSMS.id);
              if (error) console.error('Error updating sms status:', error);
              else {
                setInquiries(prev => prev.map(inq => inq.id === selectedSMS.id ? { ...inq, sms_status: 'success', sms_error: null } : inq));
              }
            } else {
              const { error } = await supabase
                .from('inquiries')
                .update({ sms_status: 'failure', sms_error: errorMessage })
                .eq('id', selectedSMS.id);
              if (error) console.error('Error updating sms status:', error);
              else {
                setInquiries(prev => prev.map(inq => inq.id === selectedSMS.id ? { ...inq, sms_status: 'failure', sms_error: errorMessage } : inq));
              }
            }
            setSelectedSMS(null);
          }} 
        />
      )}
    </div>
  );
}
