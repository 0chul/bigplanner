import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SEO from '../../components/SEO';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../../supabase';
import { MessageSquare, Clock, MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import { getRelativeTime } from '../../utils/dateUtils';
import { formatPhoneNumber } from '../../utils/phoneUtils';

interface ProjectData {
  id: string;
  name: string;
  addresses: string[];
}

interface Inquiry {
  id: string;
  name: string;
  message: string;
  phone: string;
  address: string;
  created_at: string;
  projects_data?: ProjectData[];
}

interface Memo {
  id: string;
  content: string;
  created_at: string;
}

export default function SharedInquiry() {
  const { token } = useParams<{ token: string }>();
  const [inquiry, setInquiry] = useState<Inquiry | null>(null);
  const [memos, setMemos] = useState<Memo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedProjects, setExpandedProjects] = useState<Record<string, boolean>>({});

  const toggleProject = (projectId: string) => {
    setExpandedProjects(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }));
  };

  useEffect(() => {
    const fetchSharedData = async () => {
      if (!token) return;

      // 1. 문의 정보 가져오기
      const { data: inqData, error: inqError } = await supabase
        .from('inquiries')
        .select('id, name, message, phone, address, created_at, projects_data')
        .eq('share_token', token)
        .single();

      if (inqError || !inqData) {
        setError('유효하지 않거나 만료된 공유 링크입니다.');
        setLoading(false);
        return;
      }

      setInquiry(inqData);

      // 2. 메모 가져오기
      const { data: memoData } = await supabase
        .from('inquiry_memos')
        .select('id, content, created_at')
        .eq('inquiry_id', inqData.id)
        .order('created_at', { ascending: false });

      setMemos(memoData || []);
      setLoading(false);
    };

    fetchSharedData();
  }, [token]);

  if (loading) return <div className="p-8 text-center">불러오는 중...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
  if (!inquiry) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <SEO 
        title={`문의 내용 공유 | ${inquiry.name}`}
        description={inquiry.message.substring(0, 100) + '...'}
        url={window.location.href}
      />
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold mb-6">문의 내용 공유</h1>
        
        <div className="mb-8 p-6 bg-gray-50 rounded-xl">
          <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
            <p><span className="font-semibold text-gray-800">고객명:</span> {inquiry.name}</p>
            <p><span className="font-semibold text-gray-800">연락처:</span> {formatPhoneNumber(inquiry.phone)}</p>
            <p className="col-span-2"><span className="font-semibold text-gray-800">주소:</span> {inquiry.address || '-'}</p>
            <p className="col-span-2"><span className="font-semibold text-gray-800">신청날짜:</span> {getRelativeTime(inquiry.created_at)}</p>
          </div>
          <p className="text-gray-800 whitespace-pre-wrap">{inquiry.message}</p>
        </div>

        {inquiry.projects_data && inquiry.projects_data.length > 0 && (
          <div className="mb-8 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin size={16} className="text-indigo-500" />
              프로젝트 및 필지(주소) 정보
            </h4>
            <div className="space-y-4">
              {inquiry.projects_data.map(project => {
                const isExpanded = expandedProjects[project.id];
                return (
                  <div key={project.id} className="border border-gray-200 rounded-lg bg-gray-50/50 overflow-hidden">
                    <button
                      onClick={() => toggleProject(project.id)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-100/50 transition-colors"
                    >
                      <div className="font-bold text-gray-900">
                        {project.name}
                        <span className="text-xs font-normal text-gray-500 ml-2">({project.addresses.length}개 주소)</span>
                      </div>
                      {isExpanded ? <ChevronUp size={18} className="text-gray-500" /> : <ChevronDown size={18} className="text-gray-500" />}
                    </button>
                    {isExpanded && (
                      <div className="p-4 pt-0 space-y-4">
                        <div className="space-y-2 pl-4 border-l-2 border-indigo-100 ml-4">
                          {project.addresses.map((address, idx) => (
                            <div key={idx} className="text-sm text-gray-700 bg-white p-2 rounded-md shadow-sm border border-gray-100">
                              {address || <span className="text-gray-400 italic">주소 미입력</span>}
                            </div>
                          ))}
                          {project.addresses.length === 0 && (
                            <div className="text-xs text-gray-400 italic py-1">등록된 주소가 없습니다.</div>
                          )}
                        </div>
                        
                        {project.memo && (
                          <div className="ml-4 mt-2 p-3 bg-yellow-50/80 rounded-md border border-yellow-100/50">
                            <p className="text-xs font-semibold text-yellow-800 mb-1">프로젝트 메모</p>
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">{project.memo}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <MessageSquare size={20} /> 진행 타임라인
        </h2>
        <div className="space-y-4">
          {memos.map(memo => (
            <div key={memo.id} className="p-4 border border-gray-100 rounded-lg">
              <p className="text-sm text-gray-800 mb-2">{memo.content}</p>
              <p className="text-xs text-gray-400 flex items-center gap-1">
                <Clock size={12} /> {getRelativeTime(memo.created_at)}
              </p>
            </div>
          ))}
          {memos.length === 0 && <p className="text-sm text-gray-500">등록된 메모가 없습니다.</p>}
        </div>
      </div>
    </div>
  );
}
