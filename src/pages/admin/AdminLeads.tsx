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
    // 1단계에서 복사한 CSV URL을 여기에 넣으세요
    const CSV_URL = 'Yhttps://docs.google.com/spreadsheets/d/1_W9XKypSmqZt-FKxbMXehGiEpPzwwxXs7slO6B9uiU4/edit?usp=sharing';
    
    try {
      const response = await fetch(CSV_URL);
      const data = await response.text();
      
      // CSV 파싱 (간단한 구현)
      const rows = data.split('\n').slice(1); // 헤더 제외
      const parsedLeads = rows.map((row, index) => {
        const [timestamp, name, email, phone] = row.split(',');
        return {
          id: index.toString(),
          name,
          email,
          phone,
          source: 'Google Sheet',
          status: 'new',
          created_at: timestamp
        };
      });
      setLeads(parsedLeads);
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">리드 관리</h1>
      
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
