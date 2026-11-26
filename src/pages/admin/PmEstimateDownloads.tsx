import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Download, FileText } from 'lucide-react';
import { downloadPmAsset } from '../../features/pm-access';

const documents = [
  { path: 'pm-fees.docx', title: 'PM 업무·옵션 금액표', format: 'Word (.docx)', extension: 'docx' },
  { path: 'pm-package-comparison.docx', title: 'PM 패키지 비교표', format: 'Word (.docx)', extension: 'docx' },
  { path: 'pm-proposal-sample.pdf', title: '건축주용 PM 제안서 예시', format: 'PDF (.pdf)', extension: 'pdf' },
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
    <details className="group border-b border-gray-200 bg-gray-50/90 px-4 text-sm sm:px-6">
      <summary className="flex w-fit cursor-pointer list-none items-center gap-2 py-2.5 font-semibold text-gray-800 hover:text-black focus-visible:outline-offset-2 select-none">
        <FileText size={15} className="text-gray-700 shrink-0" aria-hidden="true" />
        <span>제안 자료 다운로드</span>
        <span className="hidden sm:inline text-xs font-normal text-gray-500">
          · Word 2종 · PDF 1종
        </span>
        <ChevronDown
          size={15}
          className="text-gray-500 transition-transform duration-200 group-open:rotate-180 shrink-0"
          aria-hidden="true"
        />
      </summary>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pb-3.5 pt-0.5">
        {documents.map((doc) => {
          const isPending = pending === doc.path;
          return (
            <button
              key={doc.path}
              type="button"
              disabled={!!pending}
              onClick={() => download(doc)}
              className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-left transition-colors hover:border-gray-400 hover:bg-gray-50 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900"
            >
              <div className="min-w-0">
                <p className="font-semibold text-gray-900 truncate">{doc.title}</p>
                <p className="text-xs text-gray-500 mt-0.5 tabular-nums">
                  {isPending ? '받는 중…' : doc.format}
                </p>
              </div>
              <span
                aria-hidden="true"
                className="w-8 h-8 rounded-lg bg-gray-100 text-gray-700 flex items-center justify-center shrink-0"
              >
                <Download size={15} className={isPending ? 'animate-bounce text-black' : ''} />
              </span>
            </button>
          );
        })}
      </div>
      {error && (
        <p className="pb-3 text-xs sm:text-sm font-medium text-red-700" role="alert">
          {error}
        </p>
      )}
    </details>
  );
}
