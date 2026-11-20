import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../supabase';
import {
  ShieldCheck,
  Search,
  RefreshCw,
  Plus,
  Edit2,
  Trash2,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Mail,
  Building2,
  Copy,
  Check,
  X,
  Download,
  ExternalLink,
  AlertCircle,
  Save,
} from 'lucide-react';
import { getRelativeTime } from '../../utils/dateUtils';
import { useAuth } from '../../contexts/AuthContext';

export type FireSafetyLeadStatus = 'new' | 'contacted' | 'scheduled' | 'completed' | 'lost';
export type FireSafetyRole = 'head-office' | 'site' | 'other' | string;

export interface FireSafetyLead {
  id: string;
  company_name: string;
  contact_name: string;
  email: string;
  role: FireSafetyRole;
  building_count: number | null;
  interests: string | null;
  consent_granted?: boolean;
  consent_version?: string | null;
  source_path?: string | null;
  status?: FireSafetyLeadStatus | string | null;
  admin_memo?: string | null;
  created_at?: string | null;
}

const ROLE_LABELS: Record<string, string> = {
  'head-office': '관리 업체 본사',
  site: '관리소·방재실',
  other: '기타',
};

const STATUS_META: Record<
  FireSafetyLeadStatus,
  { label: string; badgeClass: string }
> = {
  new: { label: '신규', badgeClass: 'bg-blue-50 text-blue-700 border-blue-200' },
  contacted: { label: '연락 완료', badgeClass: 'bg-amber-50 text-amber-700 border-amber-200' },
  scheduled: { label: '시연 확정', badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  completed: { label: '시연 완료', badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  lost: { label: '보류/종료', badgeClass: 'bg-gray-100 text-gray-600 border-gray-200' },
};

const SQL_MIGRATION_SNIPPET = `-- 1) 관리용 컬럼(status, admin_memo, created_at) 추가 (없는 경우)
ALTER TABLE public.fire_safety_demo_requests
  ADD COLUMN IF NOT EXISTS status text DEFAULT 'new',
  ADD COLUMN IF NOT EXISTS admin_memo text,
  ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();

-- 2) 관리자 조회/수정/삭제 RLS 정책 허용
ALTER TABLE public.fire_safety_demo_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage fire_safety_demo_requests" ON public.fire_safety_demo_requests;
CREATE POLICY "Admins can manage fire_safety_demo_requests"
  ON public.fire_safety_demo_requests
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );`;

function normalizeStatus(status?: string | null): FireSafetyLeadStatus {
  if (
    status === 'new' ||
    status === 'contacted' ||
    status === 'scheduled' ||
    status === 'completed' ||
    status === 'lost'
  ) {
    return status;
  }
  return 'new';
}

function getRoleLabel(role?: string | null): string {
  if (!role) return '기타';
  return ROLE_LABELS[role] || role;
}

export default function AdminFireSafetyLeads() {
  const { isAdmin, loading: authLoading } = useAuth();
  const [leads, setLeads] = useState<FireSafetyLead[]>([]);
  const [fetching, setFetching] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters & sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | FireSafetyLeadStatus>('all');
  const [roleFilter, setRoleFilter] = useState<'all' | 'head-office' | 'site' | 'other'>('all');
  const [sortConfig, setSortConfig] = useState<{
    key: 'company_name' | 'contact_name' | 'building_count' | 'status' | 'created_at';
    direction: 'asc' | 'desc';
  }>({ key: 'created_at', direction: 'desc' });

  // Expanded row & inline memo
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [memoDrafts, setMemoDrafts] = useState<Record<string, string>>({});
  const [savingMemoId, setSavingMemoId] = useState<string | null>(null);

  // Feedback & SQL error helper
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showSqlHelper, setShowSqlHelper] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modals
  const [editingLead, setEditingLead] = useState<FireSafetyLead | null>(null);
  const [editForm, setEditForm] = useState<{
    company_name: string;
    contact_name: string;
    email: string;
    role: FireSafetyRole;
    building_count: string;
    interests: string;
    status: FireSafetyLeadStatus;
    admin_memo: string;
  }>({
    company_name: '',
    contact_name: '',
    email: '',
    role: 'site',
    building_count: '',
    interests: '',
    status: 'new',
    admin_memo: '',
  });

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    company_name: '',
    contact_name: '',
    email: '',
    role: 'site' as FireSafetyRole,
    building_count: '',
    interests: '',
    admin_memo: '',
  });
  const [submittingForm, setSubmittingForm] = useState(false);

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel: string;
    danger?: boolean;
    onConfirm: () => Promise<void> | void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    confirmLabel: '확인',
    onConfirm: () => {},
  });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    window.setTimeout(() => {
      setToastMsg((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  const handleDbError = (error: any, context: string) => {
    console.error(`[AdminFireSafetyLeads] ${context}:`, error);
    const code = error?.code || '';
    const msg = error?.message || '알 수 없는 오류가 발생했습니다.';
    if (
      code === '42501' ||
      code === '42703' ||
      code === 'PGRST204' ||
      msg.includes('permission denied') ||
      msg.includes('column')
    ) {
      setShowSqlHelper(true);
    }
    setErrorMsg(`${context}: ${msg}`);
  };

  const fetchLeads = async (silent = false) => {
    if (!silent) setFetching(true);
    else setRefreshing(true);

    let { data, error } = await supabase
      .from('fire_safety_demo_requests')
      .select('*')
      .order('created_at', { ascending: false });

    // Fallback if created_at column does not exist yet
    if (error && (error.code === '42703' || error.message?.includes('created_at'))) {
      const fallback = await supabase.from('fire_safety_demo_requests').select('*');
      data = fallback.data;
      error = fallback.error;
    }

    if (error) {
      handleDbError(error, 'AI 민원 도우미 리드를 불러오는 중 오류가 발생했습니다');
    } else {
      const rows = (data || []) as FireSafetyLead[];
      setLeads(rows);
      setErrorMsg(null);
      setMemoDrafts((prev) => {
        const next = { ...prev };
        rows.forEach((row) => {
          if (next[row.id] === undefined) {
            next[row.id] = row.admin_memo || '';
          }
        });
        return next;
      });
    }

    setFetching(false);
    setRefreshing(false);
  };

  useEffect(() => {
    if (!isAdmin) return;
    fetchLeads();

    const channel = supabase
      .channel('fire_safety_demo_requests_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'fire_safety_demo_requests' },
        () => {
          fetchLeads(true);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAdmin]);

  const stats = useMemo(() => {
    const total = leads.length;
    const newCount = leads.filter((l) => normalizeStatus(l.status) === 'new').length;
    const activeDemoCount = leads.filter((l) => {
      const s = normalizeStatus(l.status);
      return s === 'contacted' || s === 'scheduled';
    }).length;
    const totalBuildings = leads.reduce((acc, l) => acc + (Number(l.building_count) || 0), 0);
    return { total, newCount, activeDemoCount, totalBuildings };
  }, [leads]);

  const filteredLeads = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = leads.filter((lead) => {
      const status = normalizeStatus(lead.status);
      if (statusFilter !== 'all' && status !== statusFilter) return false;
      if (roleFilter !== 'all' && lead.role !== roleFilter) return false;
      if (q) {
        const haystack = [
          lead.company_name,
          lead.contact_name,
          lead.email,
          lead.interests,
          getRoleLabel(lead.role),
          lead.admin_memo,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });

    return [...list].sort((a, b) => {
      const dir = sortConfig.direction === 'asc' ? 1 : -1;
      switch (sortConfig.key) {
        case 'company_name':
          return (a.company_name || '').localeCompare(b.company_name || '') * dir;
        case 'contact_name':
          return (a.contact_name || '').localeCompare(b.contact_name || '') * dir;
        case 'building_count':
          return ((a.building_count ?? -1) - (b.building_count ?? -1)) * dir;
        case 'status':
          return normalizeStatus(a.status).localeCompare(normalizeStatus(b.status)) * dir;
        case 'created_at':
        default: {
          const tA = a.created_at ? new Date(a.created_at).getTime() : 0;
          const tB = b.created_at ? new Date(b.created_at).getTime() : 0;
          return (tA - tB) * dir;
        }
      }
    });
  }, [leads, searchQuery, statusFilter, roleFilter, sortConfig]);

  const handleSort = (
    key: 'company_name' | 'contact_name' | 'building_count' | 'status' | 'created_at'
  ) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc',
    }));
  };

  const handleStatusChange = async (leadId: string, nextStatus: FireSafetyLeadStatus) => {
    const prevLeads = leads;
    setLeads((curr) =>
      curr.map((l) => (l.id === leadId ? { ...l, status: nextStatus } : l))
    );

    const { data, error } = await supabase
      .from('fire_safety_demo_requests')
      .update({ status: nextStatus })
      .eq('id', leadId)
      .select();

    if (error) {
      setLeads(prevLeads);
      handleDbError(error, '상태 변경 실패');
    } else if (!data || data.length === 0) {
      setLeads(prevLeads);
      setShowSqlHelper(true);
      setErrorMsg('수정 권한이 없습니다. Supabase RLS UPDATE 정책을 확인해 주세요.');
    } else {
      showToast(`상태가 '${STATUS_META[nextStatus].label}'(으)로 변경되었습니다.`);
    }
  };

  const handleSaveMemo = async (leadId: string) => {
    const memoText = memoDrafts[leadId] ?? '';
    setSavingMemoId(leadId);
    const { data, error } = await supabase
      .from('fire_safety_demo_requests')
      .update({ admin_memo: memoText })
      .eq('id', leadId)
      .select();

    setSavingMemoId(null);

    if (error) {
      handleDbError(error, '메모 저장 실패');
    } else if (!data || data.length === 0) {
      setShowSqlHelper(true);
      setErrorMsg('메모 저장 권한이 없습니다. Supabase RLS UPDATE 정책을 확인해 주세요.');
    } else {
      setLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, admin_memo: memoText } : l))
      );
      showToast('관리자 메모가 저장되었습니다.');
    }
  };

  const openEditModal = (lead: FireSafetyLead) => {
    setEditingLead(lead);
    setEditForm({
      company_name: lead.company_name || '',
      contact_name: lead.contact_name || '',
      email: lead.email || '',
      role: lead.role || 'site',
      building_count: lead.building_count !== null && lead.building_count !== undefined ? String(lead.building_count) : '',
      interests: lead.interests || '',
      status: normalizeStatus(lead.status),
      admin_memo: lead.admin_memo || '',
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLead) return;
    setSubmittingForm(true);

    const parsedCount = editForm.building_count.trim()
      ? Number(editForm.building_count.trim())
      : null;

    const payload: Record<string, any> = {
      company_name: editForm.company_name.trim(),
      contact_name: editForm.contact_name.trim(),
      email: editForm.email.trim().toLowerCase(),
      role: editForm.role,
      building_count: Number.isFinite(parsedCount) ? parsedCount : null,
      interests: editForm.interests.trim(),
      status: editForm.status,
      admin_memo: editForm.admin_memo.trim(),
    };

    let { data, error } = await supabase
      .from('fire_safety_demo_requests')
      .update(payload)
      .eq('id', editingLead.id)
      .select();

    // If status or admin_memo column doesn't exist yet, retry core fields
    if (error && (error.code === '42703' || error.code === 'PGRST204')) {
      const { status: _s, admin_memo: _m, ...corePayload } = payload;
      const retry = await supabase
        .from('fire_safety_demo_requests')
        .update(corePayload)
        .eq('id', editingLead.id)
        .select();
      if (!retry.error) {
        data = retry.data;
        error = null;
        setShowSqlHelper(true);
      }
    }

    setSubmittingForm(false);

    if (error) {
      handleDbError(error, '리드 수정 실패');
    } else if (!data || data.length === 0) {
      setShowSqlHelper(true);
      setErrorMsg('수정 권한이 없습니다. Supabase RLS UPDATE 정책을 확인해 주세요.');
    } else {
      setEditingLead(null);
      await fetchLeads(true);
      showToast('리드 정보가 수정되었습니다.');
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingForm(true);

    const parsedCount = createForm.building_count.trim()
      ? Number(createForm.building_count.trim())
      : null;

    const id =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = (Math.random() * 16) | 0;
            const v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
          });

    const basePayload: Record<string, any> = {
      id,
      company_name: createForm.company_name.trim(),
      contact_name: createForm.contact_name.trim(),
      email: createForm.email.trim().toLowerCase(),
      role: createForm.role,
      building_count: Number.isFinite(parsedCount) ? parsedCount : null,
      interests: createForm.interests.trim(),
      consent_granted: true,
      consent_version: 'admin-manual-entry',
      source_path: '/admin/fire-safety-leads',
      status: 'new',
      admin_memo: createForm.admin_memo.trim(),
    };

    let { error } = await supabase.from('fire_safety_demo_requests').insert([basePayload]);

    if (error && (error.code === '42703' || error.code === 'PGRST204')) {
      const { status: _s, admin_memo: _m, ...corePayload } = basePayload;
      const retry = await supabase.from('fire_safety_demo_requests').insert([corePayload]);
      error = retry.error;
      if (!error) setShowSqlHelper(true);
    }

    setSubmittingForm(false);

    if (error) {
      handleDbError(error, '리드 등록 실패');
    } else {
      setIsCreateModalOpen(false);
      setCreateForm({
        company_name: '',
        contact_name: '',
        email: '',
        role: 'site',
        building_count: '',
        interests: '',
        admin_memo: '',
      });
      await fetchLeads(true);
      showToast('신규 리드가 등록되었습니다.');
    }
  };

  const requestMoveToInquiries = (lead: FireSafetyLead) => {
    setConfirmModal({
      isOpen: true,
      title: '고객 문의 관리로 이관',
      message: `'${lead.company_name}' (${lead.contact_name}) 건을 고객 문의 관리(inquiries)로 이관하시겠습니까?`,
      confirmLabel: '이관하기',
      onConfirm: async () => {
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        const newInquiryId =
          typeof crypto !== 'undefined' && crypto.randomUUID
            ? crypto.randomUUID()
            : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
                const r = (Math.random() * 16) | 0;
                const v = c === 'x' ? r : (r & 0x3) | 0x8;
                return v.toString(16);
              });

        const messageParts = [
          '[방재실 AI 민원 도우미 데모 신청에서 이관됨]',
          `• 회사·기관명: ${lead.company_name || '-'}`,
          `• 담당자명: ${lead.contact_name || '-'}`,
          `• 담당 업무: ${getRoleLabel(lead.role)}`,
          `• 관리 건물 수: ${lead.building_count ? `${lead.building_count}개동` : '미입력'}`,
          `• 확인하고 싶은 업무:\n${lead.interests?.trim() || '(미입력)'}`,
        ];

        const { error: insertError } = await supabase.from('inquiries').insert([
          {
            id: newInquiryId,
            name: `${lead.contact_name} (${lead.company_name})`,
            email: lead.email || '',
            phone: '',
            address: lead.company_name || '',
            message: messageParts.join('\n'),
            status: 'new',
            created_at: new Date().toISOString(),
          },
        ]);

        if (insertError) {
          handleDbError(insertError, '고객 문의 관리 이관 실패');
          return;
        }

        if (lead.admin_memo?.trim()) {
          await supabase.from('inquiry_memos').insert([
            {
              inquiry_id: newInquiryId,
              content: `[방재실 AI 민원 리드 메모]\n${lead.admin_memo.trim()}`,
              created_at: new Date().toISOString(),
            },
          ]);
        }

        // Update status to completed/contacted if supported
        await supabase
          .from('fire_safety_demo_requests')
          .update({ status: 'completed' })
          .eq('id', lead.id);

        await fetchLeads(true);
        showToast('고객 문의 관리로 이관되었습니다.');
      },
    });
  };

  const requestDeleteLead = (lead: FireSafetyLead) => {
    setConfirmModal({
      isOpen: true,
      title: '리드 삭제',
      message: `'${lead.company_name}' (${lead.contact_name}) 신청 내역을 삭제하시겠습니까? 삭제 후 복구할 수 없습니다.`,
      confirmLabel: '삭제',
      danger: true,
      onConfirm: async () => {
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        const { error, count } = await supabase
          .from('fire_safety_demo_requests')
          .delete({ count: 'exact' })
          .eq('id', lead.id);

        if (error) {
          handleDbError(error, '리드 삭제 실패');
        } else if (count === 0) {
          setShowSqlHelper(true);
          setErrorMsg('삭제 권한이 없거나 이미 삭제된 항목입니다.');
        } else {
          setLeads((prev) => prev.filter((item) => item.id !== lead.id));
          showToast('리드가 삭제되었습니다.');
        }
      },
    });
  };

  const handleCopy = async (text: string, id: string, label = '복사됨') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      showToast(label);
      window.setTimeout(() => {
        setCopiedId((prev) => (prev === id ? null : prev));
      }, 2000);
    } catch {
      setErrorMsg('클립보드 복사에 실패했습니다.');
    }
  };

  const handleExportCsv = () => {
    const headers = [
      '회사·기관명',
      '담당자명',
      '이메일',
      '담당 업무',
      '관리 건물 수',
      '확인하고 싶은 업무',
      '상태',
      '관리자 메모',
      '유입 경로',
      '접수일',
    ];
    const escapeCell = (val: any) => {
      const str = String(val ?? '').replace(/"/g, '""');
      return `"${str}"`;
    };
    const rows = filteredLeads.map((l) => [
      l.company_name,
      l.contact_name,
      l.email,
      getRoleLabel(l.role),
      l.building_count ?? '',
      l.interests ?? '',
      STATUS_META[normalizeStatus(l.status)].label,
      l.admin_memo ?? '',
      l.source_path ?? '/fire-safety-ai',
      l.created_at ? new Date(l.created_at).toLocaleString('ko-KR') : '',
    ]);
    const csvContent =
      '\uFEFF' + [headers.map(escapeCell).join(','), ...rows.map((r) => r.map(escapeCell).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fire-safety-ai-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('CSV 파일이 다운로드되었습니다.');
  };

  if (authLoading) {
    return (
      <div className="p-6 md:p-8 w-full space-y-4">
        <div className="h-8 w-64 bg-gray-200 rounded-lg animate-pulse" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-white border border-gray-200 rounded-xl animate-pulse" />
          ))}
        </div>
        <div className="h-72 bg-white border border-gray-200 rounded-xl animate-pulse" />
      </div>
    );
  }

  if (!isAdmin) {
    return <div className="p-8 text-gray-600">접근 권한이 없습니다.</div>;
  }

  return (
    <div className="p-4 md:p-8 w-full max-w-[1440px] mx-auto">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white text-sm font-medium px-4 py-3 rounded-xl shadow-lg flex items-center gap-2">
          <Check size={16} className="text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
              AI 민원 리드 관리
            </h1>
            {stats.newCount > 0 && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-500 text-white tabular-nums whitespace-nowrap shrink-0">
                신규 {stats.newCount}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1 flex flex-wrap items-center gap-2">
            <span>방재실 AI 민원 도우미 랜딩페이지 데모 시연 신청 내역을 관리합니다.</span>
            <a
              href="https://fire-safety-ai-bigplanner-20261117.esrak167.chatgpt.site/fire-safety-ai/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-gray-700 hover:text-black underline underline-offset-4 font-medium whitespace-nowrap"
            >
              <span>서비스 페이지</span>
              <ExternalLink size={13} />
            </a>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => fetchLeads(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-medium transition-colors whitespace-nowrap shrink-0 disabled:opacity-60"
          >
            <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
            <span>새로고침</span>
          </button>
          <button
            type="button"
            onClick={handleExportCsv}
            disabled={filteredLeads.length === 0}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-medium transition-colors whitespace-nowrap shrink-0 disabled:opacity-50"
          >
            <Download size={15} />
            <span>CSV 내보내기</span>
          </button>
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-xl text-sm font-semibold transition-colors whitespace-nowrap shrink-0"
          >
            <Plus size={16} />
            <span>리드 등록</span>
          </button>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs font-medium text-gray-500">전체 데모 신청</p>
          <p className="text-2xl font-bold text-gray-900 mt-1 tabular-nums">{stats.total}건</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs font-medium text-gray-500">미확인 신규</p>
          <p className="text-2xl font-bold text-blue-600 mt-1 tabular-nums">{stats.newCount}건</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs font-medium text-gray-500">연락·시연 진행</p>
          <p className="text-2xl font-bold text-indigo-600 mt-1 tabular-nums">{stats.activeDemoCount}건</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs font-medium text-gray-500">잠재 관리 건물 합계</p>
          <p className="text-2xl font-bold text-gray-900 mt-1 tabular-nums">
            {stats.totalBuildings.toLocaleString()}개동
          </p>
        </div>
      </div>

      {/* Error & Conditional SQL Helper */}
      {errorMsg && (
        <div className="mb-5 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5 text-sm">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">{errorMsg}</p>
              {showSqlHelper && (
                <button
                  type="button"
                  onClick={() => setShowSqlHelper(true)}
                  className="text-xs underline mt-1 font-semibold"
                >
                  아래 Supabase 설정 가이드를 확인해 주세요
                </button>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setErrorMsg(null)}
            className="text-red-400 hover:text-red-600 shrink-0"
            aria-label="오류 메시지 닫기"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {showSqlHelper && (
        <div className="mb-6 bg-white border border-amber-200 rounded-xl p-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <h2 className="text-sm font-bold text-gray-900">
                Supabase 권한 또는 관리 컬럼 설정 필요
              </h2>
              <p className="text-xs text-gray-600 mt-1">
                <code className="bg-gray-100 px-1.5 py-0.5 rounded">fire_safety_demo_requests</code> 테이블의 관리자 RLS 정책 또는 <code className="bg-gray-100 px-1.5 py-0.5 rounded">status</code> / <code className="bg-gray-100 px-1.5 py-0.5 rounded">admin_memo</code> 컬럼이 없을 경우 아래 SQL을 Supabase SQL Editor에서 실행해 주세요.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => handleCopy(SQL_MIGRATION_SNIPPET, 'sql-snippet', 'SQL이 복사되었습니다.')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg hover:bg-gray-800 whitespace-nowrap"
              >
                {copiedId === 'sql-snippet' ? <Check size={13} /> : <Copy size={13} />}
                <span>SQL 복사</span>
              </button>
              <button
                type="button"
                onClick={() => setShowSqlHelper(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
                aria-label="가이드 닫기"
              >
                <X size={16} />
              </button>
            </div>
          </div>
          <pre className="text-xs bg-gray-950 text-gray-100 p-3.5 rounded-lg overflow-x-auto leading-relaxed">
            {SQL_MIGRATION_SNIPPET}
          </pre>
        </div>
      )}

      {/* Filter & Search Toolbar */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
          {(
            [
              { key: 'all', label: '전체' },
              { key: 'new', label: '신규' },
              { key: 'contacted', label: '연락 완료' },
              { key: 'scheduled', label: '시연 확정' },
              { key: 'completed', label: '시연 완료' },
              { key: 'lost', label: '보류/종료' },
            ] as const
          ).map((tab) => {
            const active = statusFilter === tab.key;
            const count =
              tab.key === 'all'
                ? leads.length
                : leads.filter((l) => normalizeStatus(l.status) === tab.key).length;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setStatusFilter(tab.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 tabular-nums ${
                  active
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab.label} ({count})
              </button>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as any)}
            aria-label="담당 업무 필터"
            className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-gray-400 whitespace-nowrap"
          >
            <option value="all">전체 담당 업무</option>
            <option value="head-office">관리 업체 본사</option>
            <option value="site">관리소·방재실</option>
            <option value="other">기타</option>
          </select>

          <div className="relative flex-1 sm:w-64">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="회사명, 담당자, 이메일 검색..."
              className="w-full pl-9 pr-8 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-gray-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="검색어 지우기"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Table / Cards */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {fetching ? (
          <div className="p-8 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-xl bg-gray-100 text-gray-500 flex items-center justify-center mx-auto mb-3">
              <ShieldCheck size={24} />
            </div>
            {leads.length === 0 ? (
              <>
                <p className="text-base font-semibold text-gray-900">
                  아직 접수된 AI 민원 도우미 리드가 없습니다.
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  방재실 AI 민원 도우미 페이지에서 데모 시연 신청이 들어오면 이곳에 실시간으로 표시됩니다.
                </p>
              </>
            ) : (
              <>
                <p className="text-base font-semibold text-gray-900">
                  검색 및 필터 조건에 맞는 리드가 없습니다.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                    setRoleFilter('all');
                  }}
                  className="mt-3 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
                >
                  필터 초기화
                </button>
              </>
            )}
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left min-w-[920px]">
                <thead className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3.5 w-10"></th>
                    <th
                      className="px-4 py-3.5 cursor-pointer whitespace-nowrap hover:text-gray-900"
                      onClick={() => handleSort('company_name')}
                    >
                      회사·기관명 {sortConfig.key === 'company_name' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                    </th>
                    <th
                      className="px-4 py-3.5 cursor-pointer whitespace-nowrap hover:text-gray-900"
                      onClick={() => handleSort('contact_name')}
                    >
                      담당자 {sortConfig.key === 'contact_name' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                    </th>
                    <th className="px-4 py-3.5 whitespace-nowrap">담당 업무</th>
                    <th
                      className="px-4 py-3.5 cursor-pointer whitespace-nowrap hover:text-gray-900"
                      onClick={() => handleSort('building_count')}
                    >
                      건물 수 {sortConfig.key === 'building_count' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                    </th>
                    <th className="px-4 py-3.5 whitespace-nowrap">이메일</th>
                    <th
                      className="px-4 py-3.5 cursor-pointer whitespace-nowrap hover:text-gray-900"
                      onClick={() => handleSort('status')}
                    >
                      상태 {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                    </th>
                    <th
                      className="px-4 py-3.5 cursor-pointer whitespace-nowrap hover:text-gray-900"
                      onClick={() => handleSort('created_at')}
                    >
                      접수일 {sortConfig.key === 'created_at' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                    </th>
                    <th className="px-4 py-3.5 text-right whitespace-nowrap">작업</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-sm">
                  {filteredLeads.map((lead) => {
                    const status = normalizeStatus(lead.status);
                    const isExpanded = expandedId === lead.id;
                    return (
                      <React.Fragment key={lead.id}>
                        <tr className="hover:bg-gray-50/80 transition-colors">
                          <td
                            className="px-4 py-3.5 cursor-pointer text-gray-400 hover:text-gray-700"
                            onClick={() => setExpandedId(isExpanded ? null : lead.id)}
                          >
                            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                          </td>
                          <td
                            className="px-4 py-3.5 font-semibold text-gray-900 cursor-pointer max-w-[200px] truncate"
                            onClick={() => setExpandedId(isExpanded ? null : lead.id)}
                            title={lead.company_name}
                          >
                            {lead.company_name}
                          </td>
                          <td className="px-4 py-3.5 whitespace-nowrap text-gray-800">
                            {lead.contact_name}
                          </td>
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-700 whitespace-nowrap">
                              {getRoleLabel(lead.role)}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 whitespace-nowrap tabular-nums text-gray-700">
                            {lead.building_count ? `${lead.building_count.toLocaleString()}개동` : '-'}
                          </td>
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <a
                                href={`mailto:${lead.email}`}
                                className="text-gray-700 hover:text-black hover:underline max-w-[190px] truncate"
                              >
                                {lead.email}
                              </a>
                              <button
                                type="button"
                                onClick={() => handleCopy(lead.email, `email-${lead.id}`, '이메일이 복사되었습니다.')}
                                className="text-gray-400 hover:text-gray-700 p-1 rounded"
                                title="이메일 복사"
                              >
                                {copiedId === `email-${lead.id}` ? (
                                  <Check size={13} className="text-emerald-600" />
                                ) : (
                                  <Copy size={13} />
                                )}
                              </button>
                            </div>
                          </td>
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            <select
                              value={status}
                              onChange={(e) =>
                                handleStatusChange(lead.id, e.target.value as FireSafetyLeadStatus)
                              }
                              className={`px-2.5 py-1 rounded-full text-xs font-semibold border outline-none cursor-pointer ${STATUS_META[status].badgeClass}`}
                            >
                              {(Object.keys(STATUS_META) as FireSafetyLeadStatus[]).map((key) => (
                                <option key={key} value={key} className="bg-white text-gray-900">
                                  {STATUS_META[key].label}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="px-4 py-3.5 whitespace-nowrap text-xs text-gray-500 tabular-nums">
                            {lead.created_at ? getRelativeTime(lead.created_at) : '-'}
                          </td>
                          <td className="px-4 py-3.5 whitespace-nowrap text-right">
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => requestMoveToInquiries(lead)}
                                className="inline-flex items-center gap-1 text-xs bg-black text-white px-2.5 py-1.5 rounded-lg hover:bg-gray-800 transition-colors whitespace-nowrap shrink-0"
                                title="고객 문의 관리로 이관"
                              >
                                <ArrowRight size={13} />
                                <span>문의 이관</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => openEditModal(lead)}
                                className="p-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                                title="수정"
                              >
                                <Edit2 size={14} />
                              </button>
                              <button
                                type="button"
                                onClick={() => requestDeleteLead(lead)}
                                className="p-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                                title="삭제"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>

                        {isExpanded && (
                          <tr className="bg-gray-50/70">
                            <td colSpan={9} className="px-6 py-5 border-b border-gray-200">
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pl-6">
                                {/* Left: Application Details */}
                                <div className="space-y-3">
                                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                                    신청 상세 정보
                                  </h4>
                                  <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-2.5 text-sm">
                                    <div className="flex justify-between gap-4">
                                      <span className="text-gray-500 shrink-0">데모 확인 희망 업무</span>
                                      <span className="text-gray-900 font-medium text-right whitespace-pre-wrap">
                                        {lead.interests?.trim() || '별도 작성 내용 없음'}
                                      </span>
                                    </div>
                                    <div className="border-t border-gray-100 pt-2.5 flex justify-between gap-4 text-xs">
                                      <span className="text-gray-500">유입 경로 / 동의 버전</span>
                                      <span className="text-gray-700 font-mono">
                                        {lead.source_path || '/fire-safety-ai'} · {lead.consent_version || '-'}
                                      </span>
                                    </div>
                                    <div className="border-t border-gray-100 pt-2.5 flex justify-between gap-4 text-xs">
                                      <span className="text-gray-500">접수 일시</span>
                                      <span className="text-gray-700 tabular-nums">
                                        {lead.created_at
                                          ? new Date(lead.created_at).toLocaleString('ko-KR')
                                          : '-'}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* Right: Admin Follow-up Memo */}
                                <div className="space-y-3">
                                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                                    상담 및 시연 진행 메모
                                  </h4>
                                  <div className="space-y-2">
                                    <textarea
                                      rows={3}
                                      value={memoDrafts[lead.id] ?? lead.admin_memo ?? ''}
                                      onChange={(e) =>
                                        setMemoDrafts((prev) => ({
                                          ...prev,
                                          [lead.id]: e.target.value,
                                        }))
                                      }
                                      placeholder="시연 일정 조율 결과, 건물 규모, 후속 연락 내역 등을 기록하세요."
                                      className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-gray-400"
                                    />
                                    <div className="flex items-center justify-between gap-2">
                                      <a
                                        href={`mailto:${lead.email}?subject=${encodeURIComponent(
                                          `[빅플래너파트너스] 방재실 AI 민원 도우미 데모 시연 안내 (${lead.company_name})`
                                        )}`}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors whitespace-nowrap"
                                      >
                                        <Mail size={13} />
                                        <span>시연 안내 메일 쓰기</span>
                                      </a>
                                      <button
                                        type="button"
                                        onClick={() => handleSaveMemo(lead.id)}
                                        disabled={savingMemoId === lead.id}
                                        className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold bg-gray-900 text-white hover:bg-black rounded-lg transition-colors whitespace-nowrap disabled:opacity-60"
                                      >
                                        <Save size={13} />
                                        <span>{savingMemoId === lead.id ? '저장 중...' : '메모 저장'}</span>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List */}
            <div className="md:hidden divide-y divide-gray-200">
              {filteredLeads.map((lead) => {
                const status = normalizeStatus(lead.status);
                const isExpanded = expandedId === lead.id;
                return (
                  <div key={lead.id} className="p-4 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <select
                        value={status}
                        onChange={(e) =>
                          handleStatusChange(lead.id, e.target.value as FireSafetyLeadStatus)
                        }
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold border outline-none ${STATUS_META[status].badgeClass}`}
                      >
                        {(Object.keys(STATUS_META) as FireSafetyLeadStatus[]).map((key) => (
                          <option key={key} value={key} className="bg-white text-gray-900">
                            {STATUS_META[key].label}
                          </option>
                        ))}
                      </select>
                      <span className="text-xs text-gray-500 tabular-nums">
                        {lead.created_at ? getRelativeTime(lead.created_at) : '-'}
                      </span>
                    </div>

                    <div
                      className="cursor-pointer"
                      onClick={() => setExpandedId(isExpanded ? null : lead.id)}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="font-bold text-gray-900 flex items-center gap-1.5">
                          <Building2 size={15} className="text-gray-400 shrink-0" />
                          <span>{lead.company_name}</span>
                        </div>
                        {isExpanded ? (
                          <ChevronUp size={18} className="text-gray-400" />
                        ) : (
                          <ChevronDown size={18} className="text-gray-400" />
                        )}
                      </div>
                      <p className="text-sm text-gray-700 mt-1">
                        {lead.contact_name} · {getRoleLabel(lead.role)}
                        {lead.building_count ? ` · ${lead.building_count.toLocaleString()}개동` : ''}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5 truncate">{lead.email}</p>
                    </div>

                    {isExpanded && (
                      <div className="pt-2 border-t border-gray-100 space-y-3 text-sm">
                        <div>
                          <p className="text-xs font-semibold text-gray-500 mb-1">확인 희망 업무</p>
                          <p className="text-gray-800 whitespace-pre-wrap text-xs bg-gray-50 p-3 rounded-lg">
                            {lead.interests?.trim() || '별도 작성 내용 없음'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-500 mb-1">관리자 메모</p>
                          <textarea
                            rows={2}
                            value={memoDrafts[lead.id] ?? lead.admin_memo ?? ''}
                            onChange={(e) =>
                              setMemoDrafts((prev) => ({
                                ...prev,
                                [lead.id]: e.target.value,
                              }))
                            }
                            placeholder="진행 메모 입력..."
                            className="w-full rounded-lg border border-gray-200 p-2.5 text-xs outline-none focus:border-gray-400"
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveMemo(lead.id)}
                            disabled={savingMemoId === lead.id}
                            className="mt-1.5 w-full py-1.5 bg-gray-900 text-white rounded-lg text-xs font-semibold"
                          >
                            {savingMemoId === lead.id ? '저장 중...' : '메모 저장'}
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-end gap-2 pt-1">
                      <a
                        href={`mailto:${lead.email}`}
                        className="p-2 text-gray-700 bg-gray-100 rounded-lg"
                        title="이메일 보내기"
                      >
                        <Mail size={15} />
                      </a>
                      <button
                        type="button"
                        onClick={() => requestMoveToInquiries(lead)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium bg-black text-white rounded-lg"
                      >
                        <ArrowRight size={13} />
                        <span>이관</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => openEditModal(lead)}
                        className="p-2 text-blue-600 bg-blue-50 rounded-lg"
                        title="수정"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => requestDeleteLead(lead)}
                        className="p-2 text-red-600 bg-red-50 rounded-lg"
                        title="삭제"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-bold text-gray-900">AI 민원 리드 직접 등록</h2>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={22} />
              </button>
            </div>
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">회사·기관명 *</label>
                <input
                  type="text"
                  required
                  value={createForm.company_name}
                  onChange={(e) => setCreateForm({ ...createForm, company_name: e.target.value })}
                  placeholder="예: OO빌딩 관리사무소"
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-black"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">담당자명 *</label>
                  <input
                    type="text"
                    required
                    value={createForm.contact_name}
                    onChange={(e) => setCreateForm({ ...createForm, contact_name: e.target.value })}
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">담당 업무</label>
                  <select
                    value={createForm.role}
                    onChange={(e) => setCreateForm({ ...createForm, role: e.target.value })}
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-black"
                  >
                    <option value="head-office">관리 업체 본사</option>
                    <option value="site">관리소·방재실</option>
                    <option value="other">기타</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">이메일 *</label>
                  <input
                    type="email"
                    required
                    value={createForm.email}
                    onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">관리 건물 수</label>
                  <input
                    type="number"
                    min={1}
                    max={100000}
                    value={createForm.building_count}
                    onChange={(e) => setCreateForm({ ...createForm, building_count: e.target.value })}
                    placeholder="예: 3"
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-black"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">확인하고 싶은 업무</label>
                <textarea
                  rows={3}
                  value={createForm.interests}
                  onChange={(e) => setCreateForm({ ...createForm, interests: e.target.value })}
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">관리자 메모</label>
                <textarea
                  rows={2}
                  value={createForm.admin_memo}
                  onChange={(e) => setCreateForm({ ...createForm, admin_memo: e.target.value })}
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-black"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-medium text-sm"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={submittingForm}
                  className="flex-1 px-4 py-2.5 bg-black text-white rounded-xl hover:bg-gray-800 font-semibold text-sm disabled:opacity-60"
                >
                  {submittingForm ? '등록 중...' : '등록'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingLead && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-bold text-gray-900">리드 정보 수정</h2>
              <button
                type="button"
                onClick={() => setEditingLead(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={22} />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">회사·기관명 *</label>
                <input
                  type="text"
                  required
                  value={editForm.company_name}
                  onChange={(e) => setEditForm({ ...editForm, company_name: e.target.value })}
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-black"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">담당자명 *</label>
                  <input
                    type="text"
                    required
                    value={editForm.contact_name}
                    onChange={(e) => setEditForm({ ...editForm, contact_name: e.target.value })}
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">담당 업무</label>
                  <select
                    value={editForm.role}
                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-black"
                  >
                    <option value="head-office">관리 업체 본사</option>
                    <option value="site">관리소·방재실</option>
                    <option value="other">기타</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">이메일 *</label>
                  <input
                    type="email"
                    required
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">관리 건물 수</label>
                  <input
                    type="number"
                    min={1}
                    max={100000}
                    value={editForm.building_count}
                    onChange={(e) => setEditForm({ ...editForm, building_count: e.target.value })}
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-black"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">상태</label>
                <select
                  value={editForm.status}
                  onChange={(e) =>
                    setEditForm({ ...editForm, status: e.target.value as FireSafetyLeadStatus })
                  }
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-black"
                >
                  {(Object.keys(STATUS_META) as FireSafetyLeadStatus[]).map((key) => (
                    <option key={key} value={key}>
                      {STATUS_META[key].label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">확인하고 싶은 업무</label>
                <textarea
                  rows={3}
                  value={editForm.interests}
                  onChange={(e) => setEditForm({ ...editForm, interests: e.target.value })}
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">관리자 메모</label>
                <textarea
                  rows={2}
                  value={editForm.admin_memo}
                  onChange={(e) => setEditForm({ ...editForm, admin_memo: e.target.value })}
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-black"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingLead(null)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-medium text-sm"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={submittingForm}
                  className="flex-1 px-4 py-2.5 bg-black text-white rounded-xl hover:bg-gray-800 font-semibold text-sm disabled:opacity-60"
                >
                  {submittingForm ? '저장 중...' : '저장'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h2 className="text-lg font-bold text-gray-900 mb-2">{confirmModal.title}</h2>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">{confirmModal.message}</p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
                className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-medium text-sm"
              >
                취소
              </button>
              <button
                type="button"
                onClick={confirmModal.onConfirm}
                className={`flex-1 px-4 py-2.5 rounded-xl font-semibold text-sm text-white transition-colors ${
                  confirmModal.danger
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-black hover:bg-gray-800'
                }`}
              >
                {confirmModal.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
