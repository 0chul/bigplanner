import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowRight, Check, CheckCircle2, LoaderCircle, Mail } from 'lucide-react';
import { supabase } from '../supabase';
import { trackFireSafetyEvent } from '../utils/fireSafetyAnalytics';
import {
  createDemoRequestPayload, DEMO_ROLES, EMPTY_DEMO_FORM, validateDemoForm,
  type DemoFormErrors, type DemoFormValues,
} from '../utils/fireSafetyDemo';
import './fire-safety-demo-form.css';

export default function FireSafetyDemoRequestForm() {
  const [values, setValues] = useState<DemoFormValues>({ ...EMPTY_DEMO_FORM });
  const [errors, setErrors] = useState<DemoFormErrors>({});
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [complete, setComplete] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const busyRef = useRef(false);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const attemptRef = useRef<{ fingerprint: string; id: string } | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => () => controllerRef.current?.abort(), []);
  useEffect(() => { if (complete) successRef.current?.focus(); }, [complete]);

  function update<K extends keyof DemoFormValues>(key: K, value: DemoFormValues[K]) {
    setValues(current => ({ ...current, [key]: value }));
    setErrors(current => ({ ...current, [key]: undefined }));
    setSubmitError('');
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busyRef.current) return;
    const nextErrors = validateDemoForm(values);
    setErrors(nextErrors);
    setSubmitError('');
    if (Object.keys(nextErrors).length) {
      requestAnimationFrame(() => {
        formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
      });
      return;
    }
    if (honeypotRef.current?.value) {
      setSubmitError('신청을 전송하지 못했습니다. 입력 내용을 확인한 뒤 다시 시도해 주세요.');
      return;
    }

    busyRef.current = true;
    setSubmitting(true);
    const controller = new AbortController();
    controllerRef.current = controller;
    const timeout = window.setTimeout(() => controller.abort(), 25000);
    try {
      // Retrying an unchanged application reuses its ID, including a lost response.
      const normalized = createDemoRequestPayload(values, '');
      const fingerprint = JSON.stringify(normalized);
      if (attemptRef.current?.fingerprint !== fingerprint) {
        attemptRef.current = { fingerprint, id: crypto.randomUUID() };
      }
      const payload = { ...normalized, id: attemptRef.current.id };
      const { error } = await supabase
        .from('fire_safety_demo_requests')
        .insert(payload)
        .abortSignal(controller.signal);

      // Only this client's same immutable UUID/application can produce this conflict.
      const alreadySaved = error?.code === '23505' &&
        error.message.includes('fire_safety_demo_requests_pkey');
      if (error && !alreadySaved) throw error;

      setComplete(true);
      setValues({ ...EMPTY_DEMO_FORM });
      attemptRef.current = null;
      trackFireSafetyEvent('demo_request_success', { role: payload.role });
    } catch {
      setSubmitError('신청을 전송하지 못했습니다. 입력 내용은 유지되어 있습니다. 잠시 후 다시 시도해 주세요. 계속 어려우시면 아래 이메일로 문의해 주세요.');
      trackFireSafetyEvent('demo_request_error');
    } finally {
      window.clearTimeout(timeout);
      controllerRef.current = null;
      busyRef.current = false;
      setSubmitting(false);
    }
  }

  function fieldError(key: keyof DemoFormValues) {
    return errors[key] ? <p className="fa-form-error" id={`fa-demo-${key}-error`}>{errors[key]}</p> : null;
  }

  const fieldAttributes = (key: keyof DemoFormValues) => ({
    id: `fa-demo-${key}`,
    'aria-invalid': errors[key] ? true : undefined,
    'aria-describedby': errors[key] ? `fa-demo-${key}-error` : undefined,
  });

  return (
    <div className="fa-request-form">
      {complete ? (
        <div className="fa-form-success" ref={successRef} tabIndex={-1} role="status">
          <span className="fa-form-success-icon"><CheckCircle2 size={32} aria-hidden="true" /></span>
          <p className="fa-form-eyebrow">신청 완료</p>
          <h3>데모 신청이 접수되었습니다.</h3>
          <p>입력하신 이메일로 일정 조율을 안내드리겠습니다.</p>
          <a href="mailto:bigplanner0799@gmail.com"><Mail size={16} aria-hidden="true" />문의 bigplanner0799@gmail.com</a>
          <button className="fa-form-reset" type="button" onClick={() => {
            setComplete(false);
            requestAnimationFrame(() => formRef.current?.querySelector<HTMLInputElement>('input')?.focus());
          }}>다른 신청 작성</button>
        </div>
      ) : (
        <>
          <div className="fa-form-heading"><h3>데모 시연 신청</h3><span><span aria-hidden="true">*</span> 필수 입력</span></div>
          <p className="fa-form-intro">신청해 주시면 이메일로 온라인 시연 일정을 조율합니다.</p>
          <form ref={formRef} onSubmit={submit} noValidate aria-busy={submitting}>
            <fieldset disabled={submitting} className="fa-form-fields">
              <legend className="fa-form-sr-only">데모 신청 정보</legend>
              <div className="fa-form-field">
                <label htmlFor="fa-demo-company">회사·기관명 <span>*</span></label>
                <input {...fieldAttributes('company')} name="company" autoComplete="organization" required maxLength={120}
                  placeholder="회사 또는 관리 건물명을 입력해 주세요" value={values.company} onChange={e => update('company', e.target.value)} />
                {fieldError('company')}
              </div>
              <div className="fa-form-row">
                <div className="fa-form-field">
                  <label htmlFor="fa-demo-name">담당자명 <span>*</span></label>
                  <input {...fieldAttributes('name')} name="name" autoComplete="name" required maxLength={80}
                    placeholder="성함" value={values.name} onChange={e => update('name', e.target.value)} />
                  {fieldError('name')}
                </div>
                <div className="fa-form-field">
                  <label htmlFor="fa-demo-role">담당 업무 <span>*</span></label>
                  <select {...fieldAttributes('role')} name="role" required value={values.role} onChange={e => update('role', e.target.value)}>
                    <option value="">선택해 주세요</option>
                    {Object.entries(DEMO_ROLES).map(([value, label]) => <option value={value} key={value}>{label}</option>)}
                  </select>
                  {fieldError('role')}
                </div>
              </div>
              <div className="fa-form-field">
                <label htmlFor="fa-demo-email">이메일 <span>*</span></label>
                <input {...fieldAttributes('email')} name="email" type="email" autoComplete="email" inputMode="email" required maxLength={254}
                  placeholder="demo@company.co.kr" value={values.email} onChange={e => update('email', e.target.value)} />
                {fieldError('email')}
              </div>
              <div className="fa-form-field">
                <label htmlFor="fa-demo-buildingCount">관리 건물 수 <small>선택</small></label>
                <input {...fieldAttributes('buildingCount')} name="buildingCount" type="number" inputMode="numeric" min={1} max={100000} step={1}
                  placeholder="예: 3" value={values.buildingCount} onChange={e => update('buildingCount', e.target.value)} />
                {fieldError('buildingCount')}
              </div>
              <div className="fa-form-field">
                <label htmlFor="fa-demo-interests">데모에서 확인하고 싶은 업무 <small>선택</small></label>
                <textarea {...fieldAttributes('interests')} name="interests" rows={3} maxLength={1000}
                  placeholder="예: 냉난방 민원 접수, 주차 안내, 교대 시 접수 이력 확인" value={values.interests} onChange={e => update('interests', e.target.value)} />
                <p className="fa-form-hint">실제 민원인의 연락처 등 개인정보나 내부 자료는 입력하지 마세요.</p>
                {fieldError('interests')}
              </div>
              <div className="fa-form-honeypot" aria-hidden="true">
                <label htmlFor="fa-demo-website">웹사이트</label>
                <input ref={honeypotRef} id="fa-demo-website" name="website" tabIndex={-1} autoComplete="off" />
              </div>
              <div className="fa-form-consent">
                <label htmlFor="fa-demo-consent" className="fa-form-check">
                  <input {...fieldAttributes('consent')} name="consent" type="checkbox" required checked={values.consent} onChange={e => update('consent', e.target.checked)} />
                  <span>데모 신청을 위한 개인정보 수집·이용에 동의합니다. <strong>(필수)</strong></span>
                </label>
                {fieldError('consent')}
              </div>
              <button type="submit" className="fa-form-submit" disabled={submitting}>
                {submitting ? <><LoaderCircle className="fa-form-spinner" size={18} aria-hidden="true" />접수 중입니다</> : <>데모 시연 신청<ArrowRight size={18} aria-hidden="true" /></>}
              </button>
              <p className="fa-form-after"><Check size={14} aria-hidden="true" />매뉴얼 파일이나 실제 민원 자료 없이 신청할 수 있습니다.</p>
            </fieldset>
            {Object.values(errors).some(Boolean) && <p className="fa-form-error-summary" role="alert">입력 내용을 확인해 주세요. 표시된 항목을 수정한 뒤 다시 신청할 수 있습니다.</p>}
            {submitError && <div className="fa-form-submit-error" role="alert"><p>{submitError}</p><a href="mailto:bigplanner0799@gmail.com">bigplanner0799@gmail.com</a></div>}
          </form>
        </>
      )}
      <details className="fa-form-privacy" id="demo-privacy">
        <summary>개인정보 수집·이용 안내</summary>
        <dl>
          <div><dt>수집·이용 주체</dt><dd>빅플래너파트너스</dd></div>
          <div><dt>이용 목적</dt><dd>데모 신청 접수, 도입 상담 및 온라인 시연 일정 조율</dd></div>
          <div><dt>수집 항목</dt><dd>회사·기관명, 담당자명, 이메일, 담당 업무. 관리 건물 수와 관심 업무는 입력한 경우에만 수집합니다.</dd></div>
          <div><dt>보유 기간</dt><dd>접수일로부터 최대 90일. 삭제를 원하시면 아래 이메일로 요청할 수 있습니다.</dd></div>
          <div><dt>동의 거부</dt><dd>동의를 거부할 수 있으며, 이 경우 온라인 데모 신청이 제한됩니다.</dd></div>
          <div><dt>문의·삭제 요청</dt><dd><a href="mailto:bigplanner0799@gmail.com">bigplanner0799@gmail.com</a></dd></div>
        </dl>
      </details>
    </div>
  );
}
