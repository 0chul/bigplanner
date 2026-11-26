import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  RefreshCw,
  AlertCircle,
  Calculator,
  FileCheck2,
  ChevronLeft,
  ChevronRight,
  Printer,
  CheckCircle2,
  RotateCcw,
  Save,
  Copy,
  Check,
  Bookmark,
  X,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { loadPmWorkspace } from '../../features/pm-access';
import { supabase } from '../../supabase';
import PmEstimateDownloads from './PmEstimateDownloads';
import PmStepperHeader from '../../components/admin/pm-estimates/PmStepperHeader';
import StepBasicInfo from '../../components/admin/pm-estimates/StepBasicInfo';
import StepSpaceDetails from '../../components/admin/pm-estimates/StepSpaceDetails';
import StepRequests from '../../components/admin/pm-estimates/StepRequests';
import {
  BUILDING_USE_LABELS,
  INITIAL_PM_FORM_DATA,
  PM_PACKAGE_OPTIONS,
  PROJECT_STAGE_LABELS,
  PROJECT_TYPE_LABELS,
  PmEstimateFormData,
  PmFormErrors,
  PmWizardStep,
  WIZARD_STEPS,
  sqmToPyeong,
  validateWizardStep,
} from '../../components/admin/pm-estimates/types';

type WorkspaceStatus = { state: 'loading' | 'error' } | { state: 'ready'; html: string };

const DRAFT_TTL_DAYS = 30;
const DRAFT_TTL_MS = DRAFT_TTL_DAYS * 24 * 60 * 60 * 1000;

interface PmWizardDraftSnapshot {
  formData: PmEstimateFormData;
  currentStep: PmWizardStep;
  completedSteps: Record<number, boolean>;
  savedAt: string | null;
  hasRestorableContent: boolean;
  wasExpired: boolean;
}

function getDraftStorageKey(accountId: string) {
  return `bp_pm_wizard_draft_${accountId}`;
}

function hasUserEnteredFields(data: PmEstimateFormData): boolean {
  return Boolean(
    data.projectName.trim() ||
      data.clientName.trim() ||
      data.companyName.trim() ||
      data.phone.trim() ||
      data.email.trim() ||
      data.siteAddress.trim() ||
      data.landAreaSqm.trim() ||
      data.grossFloorAreaSqm.trim() ||
      data.estimatedBudgetEok.trim() ||
      data.targetSchedule.trim() ||
      data.detailedNotes.trim(),
  );
}

function normalizeStep(step: unknown): PmWizardStep {
  if (step === 0 || step === 1 || step === 2) return step;
  return 0;
}

function isStoredDraftExpired(parsed: unknown, nowMs = Date.now()): boolean {
  if (!parsed || typeof parsed !== 'object') return false;
  const record = parsed as Record<string, unknown>;

  if (typeof record.savedAt === 'string') {
    const savedMs = Date.parse(record.savedAt);
    if (Number.isFinite(savedMs)) {
      return nowMs - savedMs >= DRAFT_TTL_MS;
    }
  }

  if (typeof record.updatedAt === 'number' && Number.isFinite(record.updatedAt)) {
    return nowMs - record.updatedAt >= DRAFT_TTL_MS;
  }

  if (typeof record.expiresAt === 'string') {
    const expiresMs = Date.parse(record.expiresAt);
    if (Number.isFinite(expiresMs)) {
      return nowMs >= expiresMs;
    }
  }

  return false;
}

function loadSavedDraft(accountId: string): PmWizardDraftSnapshot {
  const emptySnapshot: PmWizardDraftSnapshot = {
    formData: INITIAL_PM_FORM_DATA,
    currentStep: 0,
    completedSteps: {},
    savedAt: null,
    hasRestorableContent: false,
    wasExpired: false,
  };

  try {
    const storageKey = getDraftStorageKey(accountId);
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return emptySnapshot;

    const parsed = JSON.parse(raw) as
      | Partial<PmWizardDraftSnapshot>
      | Partial<PmEstimateFormData>;

    if (isStoredDraftExpired(parsed)) {
      window.localStorage.removeItem(storageKey);
      return {
        ...emptySnapshot,
        wasExpired: true,
      };
    }

    const rawForm =
      parsed && typeof parsed === 'object' && 'formData' in parsed && parsed.formData
        ? parsed.formData
        : (parsed as Partial<PmEstimateFormData>);

    const mergedFormData: PmEstimateFormData = {
      ...INITIAL_PM_FORM_DATA,
      ...rawForm,
      focusAreas: Array.isArray(rawForm?.focusAreas)
        ? rawForm.focusAreas
        : INITIAL_PM_FORM_DATA.focusAreas,
    };

    const currentStep =
      parsed && typeof parsed === 'object' && 'currentStep' in parsed
        ? normalizeStep(parsed.currentStep)
        : 0;

    const completedSteps =
      parsed &&
      typeof parsed === 'object' &&
      'completedSteps' in parsed &&
      parsed.completedSteps &&
      typeof parsed.completedSteps === 'object'
        ? parsed.completedSteps
        : {};

    const savedAt =
      parsed && typeof parsed === 'object' && 'savedAt' in parsed && typeof parsed.savedAt === 'string'
        ? parsed.savedAt
        : null;

    const hasContent =
      hasUserEnteredFields(mergedFormData) ||
      currentStep > 0 ||
      Object.values(completedSteps).some(Boolean);

    return {
      formData: mergedFormData,
      currentStep,
      completedSteps,
      savedAt,
      hasRestorableContent: hasContent,
      wasExpired: false,
    };
  } catch {
    return emptySnapshot;
  }
}

function formatSavedTime(isoString: string | null): string {
  if (!isoString) return '';
  try {
    return new Date(isoString).toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  } catch {
    return '';
  }
}

function formatWizardSummary(data: PmEstimateFormData): string {
  const packageLabel =
    PM_PACKAGE_OPTIONS.find((pkg) => pkg.id === data.pmPackage)?.name || data.pmPackage;
  return [
    '[BIGPLANNER PM 견적 사전 위저드 입력]',
    `• 프로젝트명: ${data.projectName || '-'}`,
    `• 건축주·담당자: ${data.clientName || '-'}${data.companyName ? ` (${data.companyName})` : ''}`,
    `• 연락처/이메일: ${data.phone || '-'} / ${data.email || '-'}`,
    `• 사업 유형/단계: ${PROJECT_TYPE_LABELS[data.projectType]} / ${PROJECT_STAGE_LABELS[data.currentStage]}`,
    `• 사업지 주소: ${data.siteAddress || '-'} (${data.zoning})`,
    `• 주용도/층수: ${BUILDING_USE_LABELS[data.buildingUse]} / 지상 ${data.floorsAboveGround || '-'}층 · 지하 ${data.floorsUnderground || '-'}층`,
    `• 대지/연면적: ${data.landAreaSqm ? `${data.landAreaSqm}㎡ (${sqmToPyeong(data.landAreaSqm)})` : '-'} / ${data.grossFloorAreaSqm ? `${data.grossFloorAreaSqm}㎡ (${sqmToPyeong(data.grossFloorAreaSqm)})` : '-'}`,
    `• 희망 PM 패키지: ${packageLabel}`,
    `• 예상 공사비/일정: ${data.estimatedBudgetEok ? `${data.estimatedBudgetEok}억원` : '-'} / ${data.targetSchedule || '-'}`,
    `• 중점 검토 항목: ${data.focusAreas.length > 0 ? data.focusAreas.join(', ') : '-'}`,
    `• 에스크로·8대 안전계약 포함: ${data.includeEscrowReview ? '포함' : '미포함'}`,
    `• 상세 요청 사항:\n${data.detailedNotes.trim() || '(없음)'}`,
  ].join('\n');
}

function createUuid(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function PmWorkspace({ accountId, sample }: { accountId: string; sample: boolean }) {
  const [status, setStatus] = useState<WorkspaceStatus>({ state: 'loading' });
  const [attempt, setAttempt] = useState(0);

  // Hydrate full wizard draft snapshot once on mount
  const [initialSnapshot] = useState<PmWizardDraftSnapshot>(() => loadSavedDraft(accountId));
  const [currentStep, setCurrentStep] = useState<PmWizardStep>(initialSnapshot.currentStep);
  const [formData, setFormData] = useState<PmEstimateFormData>(initialSnapshot.formData);
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>(
    initialSnapshot.completedSteps,
  );
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(initialSnapshot.savedAt);
  const [showRestoredBanner, setShowRestoredBanner] = useState<boolean>(
    initialSnapshot.hasRestorableContent,
  );
  const [showExpiredBanner, setShowExpiredBanner] = useState<boolean>(
    initialSnapshot.wasExpired,
  );
  const [draftJustSaved, setDraftJustSaved] = useState(false);
  const [toast, setToast] = useState<{ title: string; subtitle?: string } | null>(null);

  const [errors, setErrors] = useState<PmFormErrors>({});
  const [validationTrigger, setValidationTrigger] = useState(0);
  const [isWizardCompleted, setIsWizardCompleted] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [savingInquiry, setSavingInquiry] = useState(false);
  const [saveNotice, setSaveNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null,
  );

  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const stepBodyRef = useRef<HTMLDivElement | null>(null);
  const draftTimerRef = useRef<number | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    loadPmWorkspace(accountId, sample, controller.signal).then(
      (html) => {
        if (!controller.signal.aborted) setStatus({ state: 'ready', html });
      },
      () => {
        if (!controller.signal.aborted) setStatus({ state: 'error' });
      },
    );
    return () => controller.abort();
  }, [accountId, sample, attempt]);

  // Clean up transient timers on unmount
  useEffect(() => {
    return () => {
      if (draftTimerRef.current !== null) {
        window.clearTimeout(draftTimerRef.current);
      }
      if (toastTimerRef.current !== null) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  // Auto-persist wizard progress to localStorage (only when non-empty; respects 30-day TTL)
  useEffect(() => {
    const hasDraftData =
      hasUserEnteredFields(formData) ||
      currentStep > 0 ||
      Object.values(completedSteps).some(Boolean) ||
      lastSavedAt !== null;

    if (!hasDraftData) return;

    try {
      const nowMs = Date.now();
      const baseMs = lastSavedAt && Number.isFinite(Date.parse(lastSavedAt))
        ? Date.parse(lastSavedAt)
        : nowMs;
      const payload = {
        formData,
        currentStep,
        completedSteps,
        savedAt: lastSavedAt,
        updatedAt: nowMs,
        expiresAt: new Date(baseMs + DRAFT_TTL_MS).toISOString(),
      };
      window.localStorage.setItem(getDraftStorageKey(accountId), JSON.stringify(payload));
    } catch {
      // Ignore storage quota errors cleanly
    }
  }, [accountId, formData, currentStep, completedSteps, lastSavedAt]);

  // Keep private iframe synchronized with current step and form payload
  useEffect(() => {
    if (status.state !== 'ready' || sample) return;
    iframeRef.current?.contentWindow?.postMessage(
      {
        type: 'bp-pm-set-step',
        stepIndex: currentStep,
        focusMode: false,
      },
      '*',
    );
    iframeRef.current?.contentWindow?.postMessage(
      {
        type: 'bp-pm-form-sync',
        payload: formData,
      },
      '*',
    );
  }, [currentStep, formData, status.state, sample]);

  function retry() {
    setStatus({ state: 'loading' });
    setAttempt((previous) => previous + 1);
  }

  function handleFieldChange<K extends keyof PmEstimateFormData>(
    field: K,
    value: PmEstimateFormData[K],
  ) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
    if (saveNotice) setSaveNotice(null);
  }

  function scrollStepBodyTop() {
    stepBodyRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function triggerValidationFeedback(stepErrors: PmFormErrors) {
    setErrors(stepErrors);
    setValidationTrigger((prev) => prev + 1);
    const firstField = Object.keys(stepErrors)[0];
    if (!firstField) return;
    window.requestAnimationFrame(() => {
      const target = stepBodyRef.current?.querySelector<HTMLElement>(
        `[data-error-field="${firstField}"]`,
      );
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        target.focus({ preventScroll: true });
      }
    });
  }

  function handleStepSelect(targetStep: PmWizardStep) {
    if (targetStep === currentStep) return;

    // Jumping backwards is always permitted without blocking validation
    if (targetStep < currentStep) {
      setErrors({});
      setCurrentStep(targetStep);
      scrollStepBodyTop();
      return;
    }

    // Jumping forwards validates every step up to targetStep - 1 sequentially
    const nextCompleted = { ...completedSteps };
    for (let step = currentStep; step < targetStep; step += 1) {
      const typedStep = step as PmWizardStep;
      const stepErrors = validateWizardStep(typedStep, formData);
      if (Object.keys(stepErrors).length > 0) {
        setCurrentStep(typedStep);
        triggerValidationFeedback(stepErrors);
        return;
      }
      nextCompleted[typedStep] = true;
    }

    setCompletedSteps(nextCompleted);
    setErrors({});
    setCurrentStep(targetStep);
    scrollStepBodyTop();
  }

  function handlePrevStep() {
    if (currentStep === 0) return;
    setErrors({});
    setCurrentStep((prev) => (prev - 1) as PmWizardStep);
    scrollStepBodyTop();
  }

  function handleNextStep() {
    const stepErrors = validateWizardStep(currentStep, formData);
    if (Object.keys(stepErrors).length > 0) {
      triggerValidationFeedback(stepErrors);
      return;
    }

    setCompletedSteps((prev) => ({ ...prev, [currentStep]: true }));
    setErrors({});

    if (currentStep < 2) {
      setCurrentStep((prev) => (prev + 1) as PmWizardStep);
      scrollStepBodyTop();
    } else {
      handleCompleteWizard();
    }
  }

  function handleCompleteWizard() {
    // Validate all steps before finalizing
    for (const stepMeta of WIZARD_STEPS) {
      const stepErrors = validateWizardStep(stepMeta.index, formData);
      if (Object.keys(stepErrors).length > 0) {
        setCurrentStep(stepMeta.index);
        triggerValidationFeedback(stepErrors);
        return;
      }
    }

    setCompletedSteps({ 0: true, 1: true, 2: true });
    setErrors({});
    setIsWizardCompleted(true);

    if (status.state === 'ready' && !sample) {
      iframeRef.current?.contentWindow?.postMessage(
        {
          type: 'bp-pm-form-sync',
          payload: formData,
          completed: true,
        },
        '*',
      );
    }
  }

  function showToast(title: string, subtitle?: string) {
    setToast({ title, subtitle });
    if (toastTimerRef.current !== null) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => {
      setToast(null);
    }, 3200);
  }

  function handleSaveDraft() {
    const nowMs = Date.now();
    const nowIso = new Date(nowMs).toISOString();
    try {
      const payload = {
        formData,
        currentStep,
        completedSteps,
        savedAt: nowIso,
        updatedAt: nowMs,
        expiresAt: new Date(nowMs + DRAFT_TTL_MS).toISOString(),
      };
      window.localStorage.setItem(getDraftStorageKey(accountId), JSON.stringify(payload));
      setLastSavedAt(nowIso);
      setDraftJustSaved(true);
      setShowRestoredBanner(false);
      setShowExpiredBanner(false);
      if (draftTimerRef.current !== null) {
        window.clearTimeout(draftTimerRef.current);
      }
      draftTimerRef.current = window.setTimeout(() => {
        setDraftJustSaved(false);
      }, 2500);

      const savedTime = formatSavedTime(nowIso);
      showToast(
        '임시 저장이 완료되었습니다.',
        `STEP ${WIZARD_STEPS[currentStep].num} (${WIZARD_STEPS[currentStep].title})${
          savedTime ? ` · ${savedTime} 저장 (${DRAFT_TTL_DAYS}일 보관)` : ''
        }`,
      );
    } catch {
      setSaveNotice({
        type: 'error',
        text: '브라우저 저장 공간 제한으로 임시 저장에 실패했습니다.',
      });
    }
  }

  function handleResetWizard() {
    setFormData(INITIAL_PM_FORM_DATA);
    setCompletedSteps({});
    setErrors({});
    setValidationTrigger(0);
    setCurrentStep(0);
    setIsWizardCompleted(false);
    setConfirmReset(false);
    setSaveNotice(null);
    setLastSavedAt(null);
    setShowRestoredBanner(false);
    setShowExpiredBanner(false);
    setDraftJustSaved(false);
    try {
      window.localStorage.removeItem(getDraftStorageKey(accountId));
    } catch {
      // Ignore storage removal errors
    }
    scrollStepBodyTop();
  }

  async function handleCopySummary() {
    try {
      await navigator.clipboard.writeText(formatWizardSummary(formData));
      setCopiedSummary(true);
      window.setTimeout(() => setCopiedSummary(false), 2000);
    } catch {
      setSaveNotice({
        type: 'error',
        text: '클립보드 복사를 사용할 수 없습니다. 입력 내용을 직접 확인해 주세요.',
      });
    }
  }

  async function handleSaveToInquiries() {
    for (const stepMeta of WIZARD_STEPS) {
      const stepErrors = validateWizardStep(stepMeta.index, formData);
      if (Object.keys(stepErrors).length > 0) {
        setCurrentStep(stepMeta.index);
        triggerValidationFeedback(stepErrors);
        return;
      }
    }

    setSavingInquiry(true);
    setSaveNotice(null);
    try {
      const { error } = await supabase.from('inquiries').insert([
        {
          id: createUuid(),
          name: `${formData.clientName.trim()}${
            formData.companyName.trim() ? ` (${formData.companyName.trim()})` : ''
          }`,
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          address: formData.siteAddress.trim(),
          message: formatWizardSummary(formData),
          status: 'new',
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) {
        setSaveNotice({
          type: 'error',
          text: error.message || '고객 문의 등록에 실패했습니다.',
        });
        return;
      }

      setCompletedSteps({ 0: true, 1: true, 2: true });
      setIsWizardCompleted(true);
      setSaveNotice({
        type: 'success',
        text: '작성된 견적 요청이 고객 문의 관리에 등록되었습니다.',
      });
    } catch {
      setSaveNotice({
        type: 'error',
        text: '저장 중 네트워크 오류가 발생했습니다.',
      });
    } finally {
      setSavingInquiry(false);
    }
  }

  function handlePrint() {
    try {
      iframeRef.current?.contentWindow?.focus();
      iframeRef.current?.contentWindow?.print();
    } catch {
      window.print();
    }
  }

  const currentStepMeta = WIZARD_STEPS[currentStep];

  return (
    <section
      className="flex h-full min-h-0 flex-col bg-gray-50"
      aria-label="건축 PM 견적·제안서"
    >
      {/* Admin-Aligned Workspace Header */}
      <header className="shrink-0 border-b border-gray-200 bg-white px-4 py-3.5 sm:px-6 print:hidden">
        <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
          <div className="min-w-0">
            <h1 className="whitespace-nowrap text-lg font-bold tracking-tight text-gray-900 sm:text-xl">
              건축 PM 견적 · 제안서
            </h1>
            <p className="mt-0.5 truncate text-xs text-gray-500">
              {sample
                ? '건축주용 예시 제안서 미리보기 화면입니다.'
                : `STEP ${currentStepMeta.num} (${currentStepMeta.title}) · ${currentStepMeta.subtitle}`}
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-2">
            {/* Calculator vs Sample Preview Switcher */}
            <div
              role="group"
              aria-label="작업 모드 선택"
              className="inline-flex items-center gap-1 rounded-xl border border-gray-200 bg-gray-100 p-1"
            >
              <Link
                to="/admin/pm-estimates"
                className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                  !sample
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Calculator size={13} aria-hidden="true" />
                <span>견적 계산기</span>
              </Link>
              <Link
                to="/admin/pm-estimates?preview=sample"
                className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                  sample
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <FileCheck2 size={13} aria-hidden="true" />
                <span>예시 제안서</span>
              </Link>
            </div>

            {!sample && status.state === 'ready' && (
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900"
              >
                <Printer size={14} aria-hidden="true" />
                <span className="hidden sm:inline">제안서 인쇄</span>
              </button>
            )}

            <button
              type="button"
              onClick={retry}
              disabled={status.state === 'loading'}
              aria-label="견적 화면 새로고침"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900 disabled:opacity-50"
            >
              <RefreshCw
                size={15}
                className={status.state === 'loading' ? 'animate-spin' : ''}
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
      </header>

      {/* Downloads Bar (Preserved in calculator mode) */}
      {!sample && (
        <div className="shrink-0 print:hidden">
          <PmEstimateDownloads />
        </div>
      )}

      {/* Main Split Workspace: Left 3-Step Form Wizard + Right Private Calculator/Proposal Iframe */}
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden lg:flex-row lg:overflow-hidden print:overflow-visible">
        {/* Stepper Wizard Panel (Calculator Mode Only) */}
        {!sample && (
          <aside
            aria-label="PM 견적 단계별 입력 위저드"
            className="flex w-full shrink-0 flex-col border-b border-gray-200 bg-white lg:min-h-0 lg:w-[460px] lg:border-b-0 lg:border-r xl:w-[500px] print:hidden"
          >
            {/* Stepper Progress Bar & Step Tabs */}
            <div className="shrink-0 border-b border-gray-100 px-4 py-3.5 sm:px-5">
              <PmStepperHeader
                currentStep={currentStep}
                completedSteps={completedSteps}
                isCompleted={isWizardCompleted}
                onStepSelect={handleStepSelect}
              />
            </div>

            {/* Active Step Form Body */}
            <div
              ref={stepBodyRef}
              className="px-4 py-4 sm:px-5 lg:min-h-0 lg:flex-1 lg:overflow-y-auto"
            >
              {showExpiredBanner && (
                <div
                  role="status"
                  className="mb-4 flex items-start justify-between gap-2.5 rounded-xl border border-amber-200 bg-amber-50/80 px-3.5 py-2.5 text-xs"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-900">
                      만료된 임시 저장 데이터가 자동 삭제되었습니다
                    </p>
                    <p className="mt-0.5 text-[11px] text-gray-600 tabular-nums">
                      임시 저장 후 {DRAFT_TTL_DAYS}일이 경과하여 보안 및 최신 견적 기준 유지를 위해 초기화되었습니다.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowExpiredBanner(false)}
                    aria-label="만료 안내 닫기"
                    className="shrink-0 rounded-lg p-1 text-gray-500 transition-colors hover:bg-amber-100 hover:text-gray-800"
                  >
                    <X size={14} aria-hidden="true" />
                  </button>
                </div>
              )}

              {showRestoredBanner && (
                <div
                  role="status"
                  className="mb-4 flex items-start justify-between gap-2.5 rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-xs"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-900">
                      임시 저장된 작성 내용을 불러왔습니다
                    </p>
                    <p className="mt-0.5 text-[11px] text-gray-600 tabular-nums">
                      STEP {WIZARD_STEPS[currentStep].num} ({WIZARD_STEPS[currentStep].title})부터 이어서 작성할 수 있습니다
                      {lastSavedAt ? ` · 저장 시각 ${formatSavedTime(lastSavedAt)}` : ''}.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowRestoredBanner(false)}
                    aria-label="임시 저장 안내 닫기"
                    className="shrink-0 rounded-lg p-1 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-900"
                  >
                    <X size={14} aria-hidden="true" />
                  </button>
                </div>
              )}

              {Object.keys(errors).length > 0 && (
                <div
                  role="alert"
                  className={`mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50/80 px-3.5 py-2.5 text-xs font-semibold text-red-700 ${
                    validationTrigger > 0
                      ? validationTrigger % 2 === 1
                        ? 'animate-bp-shake-a'
                        : 'animate-bp-shake-b'
                      : ''
                  }`}
                >
                  <AlertCircle size={15} className="shrink-0 text-red-600" aria-hidden="true" />
                  <span className="tabular-nums">
                    필수 입력 또는 형식을 확인해 주세요 ({Object.keys(errors).length}건)
                  </span>
                </div>
              )}

              {currentStep === 0 && (
                <StepBasicInfo
                  data={formData}
                  errors={errors}
                  validationTrigger={validationTrigger}
                  onChange={handleFieldChange}
                />
              )}

              {currentStep === 1 && (
                <StepSpaceDetails
                  data={formData}
                  errors={errors}
                  validationTrigger={validationTrigger}
                  onChange={handleFieldChange}
                />
              )}

              {currentStep === 2 && (
                <StepRequests
                  data={formData}
                  errors={errors}
                  validationTrigger={validationTrigger}
                  onChange={handleFieldChange}
                  onJumpToStep={(step) => {
                    setErrors({});
                    setCurrentStep(step);
                    scrollStepBodyTop();
                  }}
                />
              )}

              {/* Completion Summary & Quick Export/Save Banner */}
              {isWizardCompleted && currentStep === 2 && (
                <div className="mt-5 rounded-2xl border border-gray-200 bg-gray-50 p-4">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2
                      size={18}
                      className="mt-0.5 shrink-0 text-emerald-600"
                      aria-hidden="true"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-gray-900">
                        3단계 견적 요청 정보 작성이 완료되었습니다
                      </p>
                      <p className="mt-0.5 text-[11px] leading-relaxed text-gray-600">
                        우측 PM 견적 계산기와 연동하거나 고객 문의 관리로 저장하여 제안서를 확정하세요.
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={handleCopySummary}
                          className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900"
                        >
                          {copiedSummary ? (
                            <Check size={13} className="text-emerald-600" aria-hidden="true" />
                          ) : (
                            <Copy size={13} aria-hidden="true" />
                          )}
                          <span>{copiedSummary ? '복사됨' : '요약 복사'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleSaveToInquiries}
                          disabled={savingInquiry}
                          className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg bg-black px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
                        >
                          <Save size={13} aria-hidden="true" />
                          <span>{savingInquiry ? '저장 중...' : '고객 문의로 저장'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {saveNotice && (
                <p
                  role="status"
                  className={`mt-3 rounded-xl border px-3.5 py-2.5 text-xs font-medium ${
                    saveNotice.type === 'success'
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                      : 'border-red-200 bg-red-50 text-red-700'
                  }`}
                >
                  {saveNotice.text}
                </p>
              )}
            </div>

            {/* Wizard Navigation Footer */}
            <footer className="shrink-0 border-t border-gray-200 bg-gray-50/80 px-4 py-3 sm:px-5">
              {confirmReset ? (
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-gray-700">
                    입력 중인 내용을 초기화할까요?
                  </span>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setConfirmReset(false)}
                      className="rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 whitespace-nowrap"
                    >
                      취소
                    </button>
                    <button
                      type="button"
                      onClick={handleResetWizard}
                      className="rounded-lg bg-red-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-red-700 whitespace-nowrap"
                    >
                      초기화 확인
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex shrink-0 items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setConfirmReset(true)}
                        className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-lg px-2 py-1.5 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-200/60 hover:text-gray-800"
                      >
                        <RotateCcw size={13} aria-hidden="true" />
                        <span>초기화</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleSaveDraft}
                        className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                          draftJustSaved
                            ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                            : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                      >
                        {draftJustSaved ? (
                          <Check size={13} aria-hidden="true" />
                        ) : (
                          <Bookmark size={13} aria-hidden="true" />
                        )}
                        <span>{draftJustSaved ? '임시 저장됨' : '임시 저장'}</span>
                      </button>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        type="button"
                        onClick={handlePrevStep}
                        disabled={currentStep === 0}
                        className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-40"
                      >
                        <ChevronLeft size={14} aria-hidden="true" />
                        <span>이전</span>
                      </button>

                      {currentStep < 2 ? (
                        <button
                          type="button"
                          onClick={handleNextStep}
                          className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-lg bg-black px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-gray-800"
                        >
                          <span>다음 단계</span>
                          <ChevronRight size={14} aria-hidden="true" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handleCompleteWizard}
                          className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg bg-black px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-gray-800"
                        >
                          <Check size={14} aria-hidden="true" />
                          <span>작성 완료</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {lastSavedAt && (
                    <p className="text-[11px] text-gray-500 tabular-nums">
                      로컬 저장소 임시 저장 완료 · {formatSavedTime(lastSavedAt)} ({DRAFT_TTL_DAYS}일 보관 후 자동 삭제)
                    </p>
                  )}
                </div>
              )}
            </footer>
          </aside>
        )}

        {/* Right Framed Workspace Canvas */}
        <div className="flex min-h-[420px] min-w-0 flex-1 flex-col bg-gray-50 p-0 sm:p-4 lg:min-h-0 print:p-0">
          <div className="flex min-h-[420px] flex-1 flex-col overflow-hidden bg-white sm:rounded-2xl sm:border sm:border-gray-200 lg:min-h-0 print:rounded-none print:border-0">
            {status.state === 'loading' && (
              <div className="m-auto w-full max-w-md space-y-4 p-8 text-center">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-black text-white">
                  <Calculator size={20} aria-hidden="true" />
                </div>
                <div className="space-y-2">
                  <p role="status" className="text-sm font-semibold text-gray-900">
                    PM 견적 화면을 불러오는 중입니다.
                  </p>
                  <p className="text-xs text-gray-500">
                    보안 저장소에서 최신 워크스페이스 구성을 가져오고 있습니다.
                  </p>
                </div>
                <div className="space-y-2 pt-2">
                  <div className="mx-auto h-2.5 w-3/4 animate-pulse rounded-full bg-gray-100" />
                  <div className="mx-auto h-2.5 w-1/2 animate-pulse rounded-full bg-gray-100" />
                </div>
              </div>
            )}

            {status.state === 'error' && (
              <div className="m-auto w-full max-w-md p-8 text-center">
                <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-2xl border border-red-100 bg-red-50 text-red-600">
                  <AlertCircle size={20} aria-hidden="true" />
                </div>
                <p role="alert" className="text-base font-bold text-gray-900">
                  PM 견적 화면을 열 수 없습니다.
                </p>
                <button
                  type="button"
                  onClick={retry}
                  className="mt-4 inline-flex items-center justify-center whitespace-nowrap rounded-xl bg-black px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-800"
                >
                  다시 시도
                </button>
                <p className="mt-3 text-xs text-gray-500">
                  네트워크 상태 또는 관리자 권한을 확인한 뒤 다시 시도해 주세요.
                </p>
              </div>
            )}

            {status.state === 'ready' && (
              <iframe
                ref={iframeRef}
                onLoad={() => {
                  if (!sample) {
                    iframeRef.current?.contentWindow?.postMessage(
                      {
                        type: 'bp-pm-set-step',
                        stepIndex: currentStep,
                        focusMode: false,
                      },
                      '*',
                    );
                    iframeRef.current?.contentWindow?.postMessage(
                      {
                        type: 'bp-pm-form-sync',
                        payload: formData,
                      },
                      '*',
                    );
                  }
                }}
                className="block min-h-[420px] w-full flex-1 border-0 bg-white lg:min-h-0"
                title={sample ? '건축 PM 예시 제안서' : '건축 PM 견적 계산기와 제안서 작성'}
                referrerPolicy="no-referrer"
                srcDoc={status.html}
              />
            )}
          </div>
        </div>
      </div>

      {/* Draft Saved Toast Notification */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-4 left-4 z-50 flex items-start justify-between gap-3 rounded-xl border border-gray-800 bg-gray-950 px-4 py-3 text-white shadow-lg sm:left-auto sm:right-6 sm:max-w-sm print:hidden"
        >
          <div className="flex min-w-0 items-start gap-2.5">
            <CheckCircle2
              size={18}
              className="mt-0.5 shrink-0 text-emerald-400"
              aria-hidden="true"
            />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white sm:text-sm">
                {toast.title}
              </p>
              {toast.subtitle && (
                <p className="mt-0.5 truncate text-[11px] text-gray-300 tabular-nums">
                  {toast.subtitle}
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setToast(null)}
            aria-label="임시 저장 알림 닫기"
            className="shrink-0 rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
          >
            <X size={14} aria-hidden="true" />
          </button>
        </div>
      )}
    </section>
  );
}

export default function AdminPmEstimates() {
  const { user, isAdmin, loading } = useAuth();
  const [searchParams] = useSearchParams();
  if (loading || !isAdmin || !user) return null;

  const sample = searchParams.get('preview') === 'sample';
  return (
    <div key={`${user.id}:${sample}`} className="contents">
      <PmWorkspace accountId={user.id} sample={sample} />
    </div>
  );
}
