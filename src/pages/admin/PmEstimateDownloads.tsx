import { useEffect, useRef, useState } from 'react';
import { downloadPmAsset } from '../../features/pm-access';

const documents = [
  { path: 'pm-fees.docx', title: 'PM 업무·옵션 금액표', format: 'Word', extension: 'docx' },
  { path: 'pm-package-comparison.docx', title: 'PM 패키지 비교표', format: 'Word', extension: 'docx' },
  { path: 'pm-proposal-sample.pdf', title: '건축주용 PM 제안서 예시', format: 'PDF', extension: 'pdf' },
];

export default function PmEstimateDownloads() {
  const active = useRef<AbortController | null>(null);
  const [pending, setPending] = useState('');
  const [error, setError] = useState('');
  useEffect(() => () => active.current?.abort(), []);

  async function download(doc: typeof documents[number]) {
    if (active.current) return;
    const request = new AbortController();
    active.current = request;
    setError('');
    setPending(doc.path);
    try {
      const blob = await downloadPmAsset(doc.path, request.signal);
      if (request.signal.aborted) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `빅플래너_${doc.title}.${doc.extension}`;
      document.body.append(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      if (!request.signal.aborted) setError(`${doc.title} 파일을 받지 못했습니다. 다시 눌러 주세요.`);
    } finally {
      active.current = null;
      if (!request.signal.aborted) setPending('');
    }
  }

  return (
    <details className="border-b border-gray-200 bg-white px-4 text-sm sm:px-6">
      <summary className="w-fit cursor-pointer py-2.5 font-medium text-gray-700 focus-visible:outline-offset-2">
        제안 자료 다운로드
      </summary>
      <div className="flex flex-wrap gap-2 pb-3">
        {documents.map(doc => (
          <button key={doc.path} type="button" disabled={!!pending} onClick={() => download(doc)}
            className="rounded border border-gray-300 px-3 py-2 text-left hover:bg-gray-50 disabled:opacity-60">
            {doc.title} <span className="text-gray-500">{pending === doc.path ? '받는 중…' : doc.format}</span>
          </button>
        ))}
      </div>
      {error && <p className="pb-3 text-red-700" role="alert">{error}</p>}
    </details>
  );
}
