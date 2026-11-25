import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { loadPmWorkspace } from '../../features/pm-access';
import PmEstimateDownloads from './PmEstimateDownloads';

type WorkspaceStatus = { state: 'loading' | 'error' } | { state: 'ready'; html: string };

function PmWorkspace({ accountId, sample }: { accountId: string; sample: boolean }) {
  const [status, setStatus] = useState<WorkspaceStatus>({ state: 'loading' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    loadPmWorkspace(accountId, sample, controller.signal).then(
      html => { if (!controller.signal.aborted) setStatus({ state: 'ready', html }); },
      () => { if (!controller.signal.aborted) setStatus({ state: 'error' }); },
    );
    return () => controller.abort();
  }, [accountId, sample, attempt]);

  function retry() {
    setStatus({ state: 'loading' });
    setAttempt(previous => previous + 1);
  }

  return (
    <section className="flex h-full min-h-0 flex-col bg-white" aria-label="건축 PM 견적·제안서">
      {!sample && <div className="shrink-0 print:hidden"><PmEstimateDownloads /></div>}
      {status.state === 'loading' && (
        <p role="status" className="m-auto p-6 text-sm text-gray-600">PM 견적 화면을 불러오는 중입니다.</p>
      )}
      {status.state === 'error' && (
        <div className="m-auto p-6 text-center">
          <p role="alert" className="text-gray-700">PM 견적 화면을 열 수 없습니다.</p>
          <button type="button" onClick={retry} className="mt-4 rounded-md bg-gray-900 px-4 py-2 text-sm text-white">
            다시 시도
          </button>
        </div>
      )}
      {status.state === 'ready' && (
        <iframe
          className="block min-h-0 w-full flex-1 border-0"
          title={sample ? '건축 PM 예시 제안서' : '건축 PM 견적 계산기와 제안서 작성'}
          referrerPolicy="no-referrer"
          srcDoc={status.html}
        />
      )}
    </section>
  );
}

export default function AdminPmEstimates() {
  const { user, isAdmin, loading } = useAuth();
  const [searchParams] = useSearchParams();
  if (loading || !isAdmin || !user) return null;

  const sample = searchParams.get('preview') === 'sample';
  return <div key={`${user.id}:${sample}`} className="contents"><PmWorkspace accountId={user.id} sample={sample} /></div>;
}
