import React, { useState } from 'react';
import { X, Send } from 'lucide-react';

interface SMSModalProps {
  name: string;
  phone: string;
  onClose: () => void;
}

export default function SMSModal({ name, phone, onClose }: SMSModalProps) {
  const [message, setMessage] = useState(`안녕하세요 ${name}님, 빅플래너파트너스입니다.`);
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    setSending(true);
    try {
      const response = await fetch('/api/send-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiver: phone.replace(/-/g, ''), msg: message, name }),
      });
      const data = await response.json();
      if (data.result_code === '1') {
        alert('문자가 성공적으로 전송되었습니다.');
        onClose();
      } else {
        alert(`전송 실패: ${data.message || '알 수 없는 오류'}`);
      }
    } catch (error) {
      console.error('SMS error:', error);
      alert('문자 전송 중 오류가 발생했습니다.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">문자 보내기</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        <p className="text-sm text-gray-600 mb-4">수신: {name} ({phone})</p>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-3 border border-gray-200 rounded-xl mb-4 h-32 focus:ring-2 focus:ring-black outline-none"
        />
        <button
          onClick={handleSend}
          disabled={sending}
          className="w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
        >
          {sending ? '전송 중...' : <><Send size={18} /> 전송하기</>}
        </button>
      </div>
    </div>
  );
}
