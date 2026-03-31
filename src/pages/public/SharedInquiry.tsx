import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../supabase';
import { MessageSquare, Clock } from 'lucide-react';

interface Inquiry {
  id: string;
  name: string;
  message: string;
  created_at: string;
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

  useEffect(() => {
    const fetchSharedData = async () => {
      if (!token) return;

      // 1. 문의 정보 가져오기
      const { data: inqData, error: inqError } = await supabase
        .from('inquiries')
        .select('id, name, message, created_at')
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
      <meta name="robots" content="noindex, nofollow" />
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold mb-6">문의 내용 공유</h1>
        
        <div className="mb-8 p-6 bg-gray-50 rounded-xl">
          <p className="text-sm text-gray-500 mb-2">작성자: {inquiry.name}</p>
          <p className="text-gray-800 whitespace-pre-wrap">{inquiry.message}</p>
        </div>

        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <MessageSquare size={20} /> 진행 타임라인
        </h2>
        <div className="space-y-4">
          {memos.map(memo => (
            <div key={memo.id} className="p-4 border border-gray-100 rounded-lg">
              <p className="text-sm text-gray-800 mb-2">{memo.content}</p>
              <p className="text-xs text-gray-400 flex items-center gap-1">
                <Clock size={12} /> {new Date(memo.created_at).toLocaleString()}
              </p>
            </div>
          ))}
          {memos.length === 0 && <p className="text-sm text-gray-500">등록된 메모가 없습니다.</p>}
        </div>
      </div>
    </div>
  );
}
