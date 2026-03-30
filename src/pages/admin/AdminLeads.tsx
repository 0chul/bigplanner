import { useState, useEffect } from 'react';
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
  }, []);

  async function fetchLeads() {
    console.log("Fetching ALL leads from:", supabaseUrl);
    
    const { data, error } = await supabase
      .from('leads')
      .select('*');
    
    if (error) {
      console.error('Error fetching leads:', error);
      setErrorMsg('리드 목록을 불러오는 중 오류가 발생했습니다.');
    } else {
      console.log('DB에서 가져온 전체 데이터:', data);
      setLeads(data || []);
      setErrorMsg(null);
    }
  }

  async function debugLead(id: string) {
    const { data, error } = await supabase.from('leads').select('*').eq('id', id);
    console.log(`Debug Lead ${id}:`, { data, error });
    if (data && data.length === 0) {
      // Try fetching without eq to see all IDs
      const { data: allData } = await supabase.from('leads').select('id').limit(5);
      console.log('Sample IDs in DB:', allData);
      alert(`DB에서 해당 ID(${id})를 찾을 수 없습니다. 콘솔을 확인해주세요.`);
    } else {
      alert(`DB에 해당 ID가 존재합니다. 콘솔을 확인해주세요.`);
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
            company: '', // inquiries 테이블 구조에 맞춰 추가
            message: `[META 리드 이동] 소스: ${lead.source || '알 수 없음'}`,
            status: 'new',
            created_at: new Date().toISOString()
          }]);

        if (insertError) {
          console.error('Error moving lead:', insertError);
          setErrorMsg(`이동 실패 (inquiries 추가): ${insertError.message || '알 수 없는 오류'}`);
          return;
        }

        // 2. leads 테이블에서 상태 업데이트
        const { data: updateData, error: updateError } = await supabase
          .from('leads')
          .update({ status: 'moved' })
          .eq('id', lead.id)
          .select();

        if (updateError) {
          console.error('Error updating lead status:', updateError);
          setErrorMsg(`이동 실패 (leads 업데이트): ${updateError.message || '알 수 없는 오류'}`);
        } else if (!updateData || updateData.length === 0) {
          setErrorMsg('이동은 완료되었으나 leads 테이블 상태 업데이트 권한이 없습니다. UPDATE RLS 정책을 확인해주세요.');
        } else {
          fetchLeads();
        }
      }
    });
  }

  function deleteLead(id: string) {
    console.log('deleteLead called with id:', id);
    setConfirmModal({
      isOpen: true,
      title: '리드 삭제',
      message: '정말로 이 리드를 삭제하시겠습니까? 삭제된 데이터는 복구할 수 없습니다.',
      onConfirm: async () => {
        console.log('onConfirm called for deleteLead with id:', id);
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
        
        const { error, count } = await supabase
          .from('leads')
          .delete({ count: 'exact' })
          .eq('id', id);

        if (error) {
          console.error('Error deleting lead (Detailed):', JSON.stringify(error, null, 2));
          setErrorMsg(`삭제 실패: ${error.message || '알 수 없는 오류'} (코드: ${error.code}, 힌트: ${error.hint})`);
        } else if (count === 0) {
          console.warn('Delete operation returned 0 count. RLS might be blocking it or ID not found.');
          // DB에 이미 없는 경우일 확률이 높으므로 UI에서 제거해줍니다.
          setLeads(prevLeads => prevLeads.filter(lead => lead.id !== id));
          alert('해당 데이터가 이미 DB에서 삭제되어 화면에서 정리했습니다.');
        } else {
          console.log(`Lead deleted successfully. Count: ${count}`);
          // 즉각적인 UI 업데이트를 위해 로컬 상태에서 직접 제거
          setLeads(prevLeads => prevLeads.filter(lead => lead.id !== id));
          // 서버 데이터 동기화를 위해 fetchLeads 호출 (백그라운드)
          fetchLeads();
        }
      }
    });
    console.log('setConfirmModal called');
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

  async function addTestData() {
    const { error } = await supabase.from('leads').insert([{
      name: '연동 테스트 ' + new Date().toLocaleTimeString(),
      email: 'test@example.com',
      phone: '010-1234-5678',
      source: 'System Test',
      status: 'new'
    }]);

    if (error) {
      alert('테스트 데이터 추가 실패 (RLS 권한 문제일 수 있습니다):\n' + error.message);
    } else {
      alert('테스트 데이터가 성공적으로 추가되었습니다!\n지금 바로 Supabase 대시보드의 leads 테이블을 확인해보세요. 이 데이터가 보이지 않는다면 다른 DB를 보고 계신 것입니다.');
      fetchLeads();
    }
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">META 리드 관리</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={addTestData}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors"
          >
            + 연동 테스트 데이터 추가
          </button>
          <button
            onClick={() => fetchLeads()}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-medium transition-colors"
          >
            데이터 새로고침
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
                    <button 
                      onClick={() => debugLead(lead.id)}
                      className="flex items-center gap-1 text-xs bg-gray-50 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                      title="디버그"
                    >
                      디버그
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
