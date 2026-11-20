import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Check, ClipboardList, LoaderCircle, Mail, RefreshCw, Save, ShieldCheck, Trash2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../supabase';

type DemoStatus = 'new' | 'contacted' | 'demo-scheduled' | 'completed';
type DemoRole = 'head-office' | 'site' | 'other';

interface DemoRequest {
  id: string;
  company_name: string;
  contact_name: string;
  email: string;
  role: DemoRole;
  building_count: number | null;
  interests: string;
  consent_granted: boolean;
  consent_version: string;
  source_path: string;
  created_at: string;
  expires_at: string;
  status: DemoStatus;
  admin_note: string;
}

const statuses: { value: DemoStatus; label: string; classes: string }[] = [
  { value: 'new', label: '신규 신청', classes: 'bg-blue-50 text-blue-800' },
  { value: 'contacted', label: '일정 조율 중', classes: 'bg-amber-50 text-amber-800' },
  { value: 'demo-scheduled', label: '데모 일정 확정', classes: 'bg-violet-50 text-violet-800' },
  { value: 'completed', label: '데모 진행 완료', classes: 'bg-emerald-50 text-emerald-800' },
];

const roleLabels: Record<DemoRole, string> = {
  'head-office': '관리 업체 본사',
  site: '관리소·방재실',
  other: '기타',
};
const PAGE_SIZE = 50;
const emptyCounts: Record<DemoStatus, number> = { new: 0, contacted: 0, 'demo-scheduled': 0, completed: 0 };

const dateFormatter = new Intl.DateTimeFormat('ko-KR', {
  timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit',
  hour: '2-digit', minute: '2-digit', hour12: false,
});

export default function AdminFireSafetyDemos() {
  const { user, loading: authLoading } = useAuth();
  const [requests, setRequests] = useState<DemoRequest[]>([]);
  const [access, setAccess] = useState<'checking' | 'allowed' | 'denied'>('checking');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [filter, setFilter] = useState<DemoStatus | 'all'>('all');
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [filteredCount, setFilteredCount] = useState(0);
  const [counts, setCounts] = useState<Record<DemoStatus, number>>(emptyCounts);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [busyId, setBusyId] = useState<string | null>(null);
  const loadSequence = useRef(0);

  const loadRequests = useCallback(async () => {
    if (!user) {
      setAccess('denied');
      setLoading(false);
      setRequests([]);
      return;
    }
    const sequence = ++loadSequence.current;
    setLoading(true);
    setError('');
    try {
      // profiles.role controls the old admin shell; only this immutable allowlist
      // and database RLS authorize access to the new applicant records.
      const membership = await supabase.from('fire_safety_demo_admins')
        .select('user_id').eq('user_id', user.id).maybeSingle();
      if (sequence !== loadSequence.current) return;
      if (membership.error) throw membership.error;
      if (!membership.data) {
        setAccess('denied');
        setRequests([]);
        setNotes({});
        return;
      }
      setAccess('allowed');
      let recordsQuery = supabase.from('fire_safety_demo_requests')
        .select('id,company_name,contact_name,email,role,building_count,interests,consent_granted,consent_version,source_path,created_at,expires_at,status,admin_note', { count: 'exact' })
        .order('created_at', { ascending: false }).order('id', { ascending: false })
        .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);
      if (filter !== 'all') recordsQuery = recordsQuery.eq('status', filter);
      const [response, ...countResponses] = await Promise.all([
        recordsQuery,
        ...statuses.map(({ value }) => supabase.from('fire_safety_demo_requests')
          .select('id', { head: true, count: 'exact' }).eq('status', value)),
      ]);
      if (sequence !== loadSequence.current) return;
      if (response.error) throw response.error;
      if (countResponses.some((result) => result.error)) throw new Error('Unable to count demo statuses');
      const nextCounts = Object.fromEntries(statuses.map(({ value }, index) => [value, countResponses[index].count ?? 0])) as Record<DemoStatus, number>;
      const records = response.data as DemoRequest[];
      setRequests(records);
      setCounts(nextCounts);
      setTotalCount(Object.values(nextCounts).reduce((sum, value) => sum + value, 0));
      setFilteredCount(response.count ?? 0);
      setNotes(Object.fromEntries(records.map((record) => [record.id, record.admin_note])));
    } catch {
      if (sequence === loadSequence.current) {
        setError('데모 신청을 불러오지 못했습니다. 연결 상태와 조회 권한을 확인한 뒤 다시 시도해 주세요.');
      }
    } finally {
      if (sequence === loadSequence.current) setLoading(false);
    }
  }, [user?.id, page, filter]);

  useEffect(() => {
    if (authLoading) return;
    loadRequests();
    return () => { loadSequence.current += 1; };
  }, [authLoading, loadRequests]);

  const filteredRequests = useMemo(() => filter === 'all' ? requests : requests.filter((record) => record.status === filter), [requests, filter]);
  const chooseFilter = (next: DemoStatus | 'all') => { setFilter(next); setPage(0); };

  const updateRequest = async (record: DemoRequest, changes: Partial<Pick<DemoRequest, 'status' | 'admin_note'>>) => {
    if (busyId || loading) return;
    setBusyId(record.id);
    setError('');
    setNotice('');
    try {
      const response = await supabase.from('fire_safety_demo_requests')
        .update(changes).eq('id', record.id).select('id,status,admin_note').single();
      if (response.error || !response.data) throw response.error ?? new Error('No authorized row updated');
      setRequests((current) => current.map((item) => item.id === record.id ? { ...item, ...response.data } : item));
      if (changes.status && changes.status !== record.status) {
        setCounts((current) => ({ ...current, [record.status]: current[record.status] - 1, [changes.status!]: current[changes.status!] + 1 }));
        if (filter !== 'all') setFilteredCount((current) => current - 1);
        if (filter !== 'all' && page > 0 && filteredRequests.length === 1) setPage((current) => current - 1);
      }
      if (changes.admin_note !== undefined) {
        setNotes((current) => ({ ...current, [record.id]: response.data.admin_note }));
      }
      setNotice(changes.status ? '신청 상태를 저장했습니다.' : '관리자 메모를 저장했습니다.');
    } catch {
      setError('변경 내용을 저장하지 못했습니다. 입력한 메모는 유지됩니다. 다시 시도해 주세요.');
    } finally {
      setBusyId(null);
    }
  };

  const deleteRequest = async (record: DemoRequest) => {
    if (busyId || loading || !window.confirm('이 데모 신청과 개인정보를 영구 삭제할까요? 삭제 후 복구할 수 없습니다.')) return;
    setBusyId(record.id);
    setError('');
    setNotice('');
    try {
      const response = await supabase.from('fire_safety_demo_requests')
        .delete({ count: 'exact' }).eq('id', record.id);
      if (response.error || response.count !== 1) throw response.error ?? new Error('No authorized row deleted');
      setRequests((current) => current.filter((item) => item.id !== record.id));
      setTotalCount((current) => current - 1);
      setFilteredCount((current) => current - 1);
      setCounts((current) => ({ ...current, [record.status]: current[record.status] - 1 }));
      if (page > 0 && filteredRequests.length === 1) setPage((current) => current - 1);
      setNotes((current) => {
        const next = { ...current };
        delete next[record.id];
        return next;
      });
      setNotice('데모 신청과 개인정보를 삭제했습니다.');
    } catch {
      setError('신청을 삭제하지 못했습니다. 조회 권한을 확인하고 다시 시도해 주세요.');
    } finally {
      setBusyId(null);
    }
  };

  if (authLoading || (access === 'checking' && loading)) {
    return <div className="p-8 flex items-center gap-3 text-slate-600" role="status"><LoaderCircle size={20} className="animate-spin" />데모 신청 조회 권한을 확인하고 있습니다.</div>;
  }

  if (access === 'denied') {
    return (
      <section className="p-6 md:p-10 max-w-2xl">
        <ShieldCheck className="text-slate-400 mb-4" size={32} aria-hidden="true" />
        <h1 className="text-2xl font-bold text-slate-900 mb-3">데모 신청 조회 권한이 필요합니다</h1>
        <p className="text-slate-600 leading-relaxed">개인정보 보호를 위해 별도로 등록된 데모 신청 담당자만 조회할 수 있습니다. 프로젝트 관리자에게 담당자 등록을 요청해 주세요.</p>
        <button type="button" onClick={loadRequests} className="mt-6 rounded-lg border border-slate-300 px-4 py-2 font-medium">권한 다시 확인</button>
      </section>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-7">
        <div>
          <p className="text-sm font-semibold text-blue-700 mb-2">방재실 AI 민원 도우미</p>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">데모 신청 관리</h1>
          <p className="mt-3 text-sm text-slate-600">신청 확인 후 이메일로 일정을 조율하고 진행 상태를 기록해 주세요.</p>
        </div>
        <button type="button" onClick={loadRequests} disabled={loading || !!busyId} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold disabled:opacity-50">
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} aria-hidden="true" />새로고침
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {statuses.map((status) => (
          <button type="button" key={status.value} onClick={() => chooseFilter(filter === status.value ? 'all' : status.value)} aria-pressed={filter === status.value} disabled={loading || !!busyId} className={`text-left rounded-xl border p-4 transition-colors disabled:opacity-60 ${filter === status.value ? 'border-blue-600 ring-1 ring-blue-600' : 'border-slate-200'} bg-white`}>
            <span className="block text-sm text-slate-600">{status.label}</span>
            <span className="block text-2xl font-bold text-slate-900 mt-2">{counts[status.value]}<span className="ml-1 text-sm font-medium text-slate-500">건</span></span>
          </button>
        ))}
      </div>

      <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
        <p className="text-sm text-slate-600">전체 {totalCount}건 · 필터 결과 {filteredCount}건 · 현재 {filteredRequests.length}건 표시</p>
        <label className="flex gap-2 items-center text-sm text-slate-600">상태 필터
          <select value={filter} onChange={(event) => chooseFilter(event.target.value as DemoStatus | 'all')} disabled={loading || !!busyId} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900">
            <option value="all">전체 상태</option>
            {statuses.map((status) => <option value={status.value} key={status.value}>{status.label}</option>)}
          </select>
        </label>
      </div>

      {error && <div role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}<button type="button" onClick={loadRequests} className="block mt-2 font-bold underline">다시 불러오기</button></div>}
      {notice && <p role="status" className="mb-5 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800 flex items-center gap-2"><Check size={17} aria-hidden="true" />{notice}</p>}

      {!loading && !error && filteredRequests.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
          <ClipboardList size={32} className="mx-auto mb-4 text-slate-400" aria-hidden="true" />
          <h2 className="font-bold text-slate-800">{totalCount ? '이 페이지에 표시할 신청이 없습니다.' : '아직 데모 신청이 없습니다.'}</h2>
          <p className="text-sm text-slate-500 mt-2">랜딩 페이지에서 접수된 신청이 여기에 표시됩니다.</p>
        </div>
      )}

      <div className="space-y-5" aria-busy={loading}>
        {filteredRequests.map((record) => {
          const status = statuses.find((item) => item.value === record.status) ?? statuses[0];
          const noteChanged = (notes[record.id] ?? '') !== record.admin_note;
          return (
            <article key={record.id} className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
              <div className="p-5 md:p-6 border-b border-slate-100 flex flex-wrap justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2"><span className={`text-xs font-bold rounded-full px-2.5 py-1 ${status.classes}`}>{status.label}</span><span className="text-xs text-slate-500">{roleLabels[record.role]}</span></div>
                  <h2 className="text-lg font-bold text-slate-900 break-words">{record.company_name}</h2>
                  <p className="text-sm text-slate-600 mt-1">{record.contact_name} · 관리 건물 {record.building_count == null ? '미입력' : `${record.building_count.toLocaleString('ko-KR')}개`}</p>
                  <a href={`mailto:${encodeURIComponent(record.email)}`} className="inline-flex items-center gap-2 text-sm text-blue-700 underline underline-offset-4 mt-3 break-all"><Mail size={15} className="shrink-0" aria-hidden="true" />{record.email}</a>
                </div>
                <div className="flex flex-col items-start sm:items-end gap-3">
                  <time dateTime={record.created_at} className="text-xs text-slate-500">{dateFormatter.format(new Date(record.created_at))} 접수</time>
                  <label className="text-xs text-slate-600 flex items-center gap-2">진행 상태
                    <select value={record.status} disabled={!!busyId || loading} onChange={(event) => updateRequest(record, { status: event.target.value as DemoStatus })} className="border border-slate-300 rounded-lg bg-white text-sm text-slate-900 px-3 py-2 disabled:opacity-50">
                      {statuses.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                    </select>
                  </label>
                </div>
              </div>
              <div className="p-5 md:p-6 grid lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 mb-2">데모에서 확인하고 싶은 업무</h3>
                  <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap break-words">{record.interests || '별도로 입력한 내용이 없습니다.'}</p>
                  <details className="mt-5 text-xs text-slate-500">
                    <summary className="cursor-pointer font-medium">동의 및 보관 정보</summary>
                    <dl className="mt-3 space-y-2 break-all">
                      <div><dt className="inline font-semibold">동의 버전: </dt><dd className="inline">{record.consent_version}</dd></div>
                      <div><dt className="inline font-semibold">보관 만료 기준: </dt><dd className="inline">{dateFormatter.format(new Date(record.expires_at))}</dd></div>
                      <div><dt className="inline font-semibold">접수 경로: </dt><dd className="inline">{record.source_path}</dd></div>
                      <div><dt className="inline font-semibold">접수 번호: </dt><dd className="inline">{record.id}</dd></div>
                    </dl>
                  </details>
                </div>
                <div>
                  <label htmlFor={`demo-note-${record.id}`} className="block text-sm font-bold text-slate-800 mb-2">관리자 메모</label>
                  <textarea id={`demo-note-${record.id}`} rows={3} maxLength={2000} value={notes[record.id] ?? ''} disabled={busyId === record.id || loading} onChange={(event) => setNotes((current) => ({ ...current, [record.id]: event.target.value }))} placeholder="연락 및 데모 진행 내용을 기록해 주세요." className="block w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:opacity-60" />
                  <div className="flex justify-between flex-wrap gap-3 mt-3">
                    <button type="button" disabled={!!busyId || loading} onClick={() => deleteRequest(record)} className="inline-flex items-center gap-1.5 text-sm font-medium text-red-700 disabled:opacity-50"><Trash2 size={15} aria-hidden="true" />신청 영구 삭제</button>
                    <button type="button" disabled={!noteChanged || !!busyId || loading} onClick={() => updateRequest(record, { admin_note: notes[record.id] ?? '' })} className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white disabled:opacity-40"><Save size={15} aria-hidden="true" />메모 저장</button>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
      {filteredCount > PAGE_SIZE && (
        <nav aria-label="데모 신청 목록 페이지" className="mt-6 flex items-center justify-center gap-4 text-sm">
          <button type="button" disabled={page === 0 || loading || !!busyId} onClick={() => setPage((current) => current - 1)} className="rounded-lg border border-slate-300 bg-white px-4 py-2 disabled:opacity-40">이전</button>
          <span className="text-slate-600">{page + 1} / {Math.max(1, Math.ceil(filteredCount / PAGE_SIZE))}</span>
          <button type="button" disabled={(page + 1) * PAGE_SIZE >= filteredCount || loading || !!busyId} onClick={() => setPage((current) => current + 1)} className="rounded-lg border border-slate-300 bg-white px-4 py-2 disabled:opacity-40">다음</button>
        </nav>
      )}
      <p className="mt-6 text-xs text-slate-500 leading-relaxed">신청은 최대 90일 이내 자동 삭제됩니다. 일정 조율은 이메일로 직접 진행하며, 이 화면의 상태 변경만으로 이메일이 발송되지는 않습니다.</p>
    </div>
  );
}
