import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../supabase';
import { Trash2, ChevronDown, ChevronUp, MessageSquare } from 'lucide-react';

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
  status: 'new' | 'in-progress' | 'completed';
  created_at: any;
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
  
  // Memo state
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [memos, setMemos] = useState<Record<string, Memo[]>>({});
  const [newMemo, setNewMemo] = useState('');

  useEffect(() => {
    if (!isAdmin) return;

    const fetchInquiries = async () => {
      const { data, error } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching inquiries:", error);
      } else {
        setInquiries(data as Inquiry[]);
      }
      setFetching(false);
    };

    fetchInquiries();

    // Set up real-time subscription
    const channel = supabase
      .channel('inquiries_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'inquiries' }, () => {
        fetchInquiries();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAdmin]);

  const updateStatus = async (id: string, newStatus: 'new' | 'in-progress' | 'completed') => {
    try {
      const { error } = await supabase
        .from('inquiries')
        .update({ status: newStatus })
        .eq('id', id);
        
      if (error) {
        if (error.code === 'PGRST204' || error.message.includes('status') || error.code === '42703') {
          throw new Error('status 컬럼이 없거나 타입이 일치하지 않습니다. Supabase에서 inquiries 테이블에 status 컬럼(text 타입, 기본값 \'new\')을 확인해주세요.');
        }
        throw error;
      }
    } catch (error: any) {
      console.error("Error updating status:", error);
      alert(error.message || "상태 업데이트에 실패했습니다.");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("정말로 이 문의를 삭제하시겠습니까?")) {
      try {
        const { error } = await supabase
          .from('inquiries')
          .delete()
          .eq('id', id);
          
        if (error) throw error;
      } catch (error) {
        console.error("Error deleting inquiry:", error);
        alert("삭제에 실패했습니다.");
      }
    }
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
      console.error("Error fetching memos:", error);
    }
  };

  const handleAddMemo = async (inquiryId: string) => {
    if (!newMemo.trim()) return;
    
    const { data, error } = await supabase
      .from('inquiry_memos')
      .insert([{ inquiry_id: inquiryId, content: newMemo.trim() }])
      .select();
      
    if (!error && data) {
      setMemos(prev => ({
        ...prev,
        [inquiryId]: [data[0] as Memo, ...(prev[inquiryId] || [])]
      }));
      setNewMemo('');
    } else {
      console.error("Error adding memo:", error);
      alert('메모 추가에 실패했습니다. (테이블이 생성되었는지 확인해주세요)');
    }
  };

  if (loading || fetching) return <div className="p-8">Loading...</div>;
  if (!isAdmin) return <div className="p-8">접근 권한이 없습니다.</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">고객 문의 관리</h1>
      
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10"></th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">날짜</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">이름/회사</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">연락처</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">문의 내용</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {inquiries.map((inquiry) => (
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
                        'bg-green-100 text-green-800'
                      }`}
                    >
                      <option value="new">신규</option>
                      <option value="in-progress">진행중</option>
                      <option value="completed">완료</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 cursor-pointer" onClick={() => toggleExpand(inquiry.id)}>
                    {inquiry.created_at ? new Date(inquiry.created_at).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap cursor-pointer" onClick={() => toggleExpand(inquiry.id)}>
                    <div className="text-sm font-medium text-gray-900">{inquiry.name}</div>
                    <div className="text-sm text-gray-500">{inquiry.company || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap cursor-pointer" onClick={() => toggleExpand(inquiry.id)}>
                    <div className="text-sm text-gray-900">{inquiry.phone || '-'}</div>
                    <div className="text-sm text-gray-500">{inquiry.email}</div>
                  </td>
                  <td className="px-6 py-4 cursor-pointer" onClick={() => toggleExpand(inquiry.id)}>
                    <div className="text-sm text-gray-900 max-w-xs truncate" title={inquiry.message}>
                      {inquiry.message}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleDelete(inquiry.id)} className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-50 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
                
                {/* Expanded Timeline Section */}
                {expandedId === inquiry.id && (
                  <tr>
                    <td colSpan={7} className="px-0 py-0 bg-gray-50 border-b border-gray-200">
                      <div className="p-6 md:pl-24">
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
                          <div className="flex gap-2 mb-6">
                            <input 
                              type="text" 
                              value={newMemo}
                              onChange={e => setNewMemo(e.target.value)}
                              placeholder="새로운 메모를 입력하세요 (예: 고객과 통화 완료, 견적서 발송 등)" 
                              className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2.5 border"
                              onKeyDown={e => e.key === 'Enter' && handleAddMemo(inquiry.id)}
                            />
                            <button 
                              onClick={() => handleAddMemo(inquiry.id)}
                              className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
                            >
                              등록
                            </button>
                          </div>

                          {/* Timeline */}
                          <div className="relative pl-4 border-l-2 border-indigo-100 space-y-6">
                            {memos[inquiry.id]?.map(memo => (
                              <div key={memo.id} className="relative pl-6">
                                <div className="absolute left-[-21px] top-1.5 w-2.5 h-2.5 bg-indigo-500 rounded-full border-2 border-white shadow-sm"></div>
                                <div className="text-xs text-gray-500 mb-1.5 font-medium">
                                  {new Date(memo.created_at).toLocaleString('ko-KR', { 
                                    year: 'numeric', month: 'long', day: 'numeric', 
                                    hour: '2-digit', minute: '2-digit' 
                                  })}
                                </div>
                                <div className="text-sm text-gray-800 bg-white p-3.5 rounded-lg shadow-sm border border-gray-100">
                                  {memo.content}
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
    </div>
  );
}
