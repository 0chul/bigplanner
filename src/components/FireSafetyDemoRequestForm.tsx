import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowRight, Check, CheckCircle2, LoaderCircle, Mail } from 'lucide-react';
import { supabase } from '../supabase';
import { trackFireSafetyEvent } from '../utils/fireSafetyAnalytics';
import {
  createDemoRequestPayload, EMPTY_DEMO_FORM, validateDemoForm,
  type DemoFormErrors, type DemoFormValues,
} from '../utils/fireSafetyDemo';
import { demoRequestCopy, type DemoRequestFormTranslation } from './fireSafetyDemoRequestCopy';
import './fire-safety-demo-form.css';

export default function FireSafetyDemoRequestForm({
  locale = 'ko', translation,
}: { locale?: string; translation?: DemoRequestFormTranslation } = {}) {
  const copy = translation?.form ?? demoRequestCopy.ko;
  const Heading = translation ? 'h2' : 'h3';
  const [values, setValues] = useState<DemoFormValues>({ ...EMPTY_DEMO_FORM });
  const [errors, setErrors] = useState<DemoFormErrors>({});
  const [submitError, setSubmitError] = useState<'invalidRequest' | 'failedRequest' | ''>('');
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
      setSubmitError('invalidRequest');
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
      setSubmitError('failedRequest');
      trackFireSafetyEvent('demo_request_error');
    } finally {
      window.clearTimeout(timeout);
      controllerRef.current = null;
      busyRef.current = false;
      setSubmitting(false);
    }
  }

  function fieldError(key: keyof DemoFormValues) {
    const error = errors[key];
    return error ? <p className="fa-form-error" id={`fa-demo-${key}-error`}>{translation?.errors[key] ?? error}</p> : null;
  }

  const fieldAttributes = (key: keyof DemoFormValues) => ({
    id: `fa-demo-${key}`,
    'aria-invalid': errors[key] ? true : undefined,
    'aria-describedby': errors[key] ? `fa-demo-${key}-error` : undefined,
  });

  const privacyNotice = (
    <details className="fa-form-privacy" id="demo-privacy">
      <summary>{copy.privacy.title}</summary>
      <dl>
        {copy.privacy.rows.map(([term, description]) => (
          <div key={term}><dt>{term}</dt><dd>{description}</dd></div>
        ))}
        <div><dt>{copy.privacy.contact}</dt><dd><a href="mailto:bigplanner0799@gmail.com">bigplanner0799@gmail.com</a></dd></div>
      </dl>
    </details>
  );

  return (
    <div className="fa-request-form" lang={locale}>
      {complete ? (
        <div className="fa-form-success" ref={successRef} tabIndex={-1} role="status">
          <span className="fa-form-success-icon"><CheckCircle2 size={32} aria-hidden="true" /></span>
          <p className="fa-form-eyebrow">{copy.successLabel}</p>
          <Heading>{copy.successTitle}</Heading>
          <p>{copy.successText}</p>
          <a href="mailto:bigplanner0799@gmail.com"><Mail size={16} aria-hidden="true" /><span>{copy.emailLabel} <bdi>bigplanner0799@gmail.com</bdi></span></a>
          <button className="fa-form-reset" type="button" onClick={() => {
            setComplete(false);
            requestAnimationFrame(() => formRef.current?.querySelector<HTMLInputElement>('input')?.focus());
          }}>{copy.reset}</button>
        </div>
      ) : (
        <>
          <div className="fa-form-heading"><Heading>{copy.heading}</Heading><span><span aria-hidden="true">*</span> {copy.required}</span></div>
          <p className="fa-form-intro">{copy.introduction}</p>
          <form ref={formRef} method="post" onSubmit={submit} noValidate aria-busy={submitting}>
            <fieldset disabled={submitting} className="fa-form-fields">
              <legend className="fa-form-sr-only">{copy.legend}</legend>
              <div className="fa-form-field">
                <label htmlFor="fa-demo-company">{copy.company} <span>*</span></label>
                <input {...fieldAttributes('company')} name="company" autoComplete="organization" required maxLength={120}
                  placeholder={copy.companyPlaceholder} value={values.company} onChange={e => update('company', e.target.value)} />
                {fieldError('company')}
              </div>
              <div className="fa-form-row">
                <div className="fa-form-field">
                  <label htmlFor="fa-demo-name">{copy.name} <span>*</span></label>
                  <input {...fieldAttributes('name')} name="name" autoComplete="name" required maxLength={80}
                    placeholder={copy.namePlaceholder} value={values.name} onChange={e => update('name', e.target.value)} />
                  {fieldError('name')}
                </div>
                <div className="fa-form-field">
                  <label htmlFor="fa-demo-role">{copy.role} <span>*</span></label>
                  <select {...fieldAttributes('role')} name="role" required value={values.role} onChange={e => update('role', e.target.value)}>
                    <option value="">{copy.rolePlaceholder}</option>
                    {Object.entries(copy.roles).map(([value, label]) => <option value={value} key={value}>{label}</option>)}
                  </select>
                  {fieldError('role')}
                </div>
              </div>
              <div className="fa-form-field">
                <label htmlFor="fa-demo-email">{copy.email} <span>*</span></label>
                <input {...fieldAttributes('email')} name="email" type="email" dir="ltr" autoComplete="email" inputMode="email" required maxLength={254}
                  placeholder={copy.emailPlaceholder} value={values.email} onChange={e => update('email', e.target.value)} />
                {fieldError('email')}
              </div>
              <div className="fa-form-field">
                <label htmlFor="fa-demo-buildingCount">{copy.buildingCount} <small>{copy.optional}</small></label>
                <input {...fieldAttributes('buildingCount')} name="buildingCount" type="number" inputMode="numeric" min={1} max={100000} step={1}
                  placeholder={copy.buildingCountPlaceholder} value={values.buildingCount} onChange={e => update('buildingCount', e.target.value)} />
                {fieldError('buildingCount')}
              </div>
              <div className="fa-form-field">
                <label htmlFor="fa-demo-interests">{copy.interests} <small>{copy.optional}</small></label>
                <textarea {...fieldAttributes('interests')} name="interests" rows={3} maxLength={1000}
                  placeholder={copy.interestsPlaceholder} value={values.interests} onChange={e => update('interests', e.target.value)} />
                <p className="fa-form-hint">{copy.interestsHint}</p>
                {fieldError('interests')}
              </div>
              <div className="fa-form-honeypot" aria-hidden="true">
                <label htmlFor="fa-demo-website">{copy.website}</label>
                <input ref={honeypotRef} id="fa-demo-website" name="website" tabIndex={-1} autoComplete="off" />
              </div>
              {translation && privacyNotice}
              <div className="fa-form-consent">
                <label htmlFor="fa-demo-consent" className="fa-form-check">
                  <input {...fieldAttributes('consent')} name="consent" type="checkbox" required checked={values.consent} onChange={e => update('consent', e.target.checked)} />
                  <span>{copy.consent} <strong>{copy.consentRequired}</strong></span>
                </label>
                {fieldError('consent')}
              </div>
              <button type="submit" className="fa-form-submit" disabled={submitting}>
                {submitting ? <><LoaderCircle className="fa-form-spinner" size={18} aria-hidden="true" />{copy.submitting}</> : <>{copy.submit}<ArrowRight size={18} aria-hidden="true" /></>}
              </button>
              <p className="fa-form-after"><Check size={14} aria-hidden="true" />{copy.afterSubmit}</p>
            </fieldset>
            {Object.values(errors).some(Boolean) && <p className="fa-form-error-summary" role="alert">{copy.validationSummary}</p>}
            {submitError && <div className="fa-form-submit-error" role="alert"><p>{copy[submitError]}</p><a href="mailto:bigplanner0799@gmail.com">bigplanner0799@gmail.com</a></div>}
          </form>
        </>
      )}
      {(!translation || complete) && privacyNotice}
    </div>
  );
}
