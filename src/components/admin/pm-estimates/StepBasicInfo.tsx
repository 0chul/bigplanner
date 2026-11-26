import { AlertCircle } from 'lucide-react';
import { formatPhoneNumber } from '../../../utils/phoneUtils';
import {
  PmEstimateFormData,
  PmFormErrors,
  PROJECT_STAGE_LABELS,
  PROJECT_TYPE_LABELS,
  ProjectStage,
  ProjectType,
} from './types';

interface StepBasicInfoProps {
  data: PmEstimateFormData;
  errors: PmFormErrors;
  validationTrigger?: number;
  onChange: <K extends keyof PmEstimateFormData>(field: K, value: PmEstimateFormData[K]) => void;
}

export default function StepBasicInfo({
  data,
  errors,
  validationTrigger = 0,
  onChange,
}: StepBasicInfoProps) {
  const getShakeClass = (hasError: boolean) => {
    if (!hasError || validationTrigger === 0) return '';
    return validationTrigger % 2 === 1 ? 'animate-bp-shake-a' : 'animate-bp-shake-b';
  };

  return (
    <div className="space-y-5">
      <div>
        <p className="font-mono text-[11px] font-semibold text-gray-500">
          01 · 기본 정보
        </p>
        <h2 className="mt-0.5 text-lg font-bold text-gray-900">기본 정보 입력</h2>
        <p className="mt-1 text-xs leading-relaxed text-gray-500">
          제안서 표지 및 견적 기준이 되는 프로젝트명과 건축주(담당자) 기본 정보를 입력해 주세요.
        </p>
      </div>

      <div className="space-y-4">
        <div className={getShakeClass(Boolean(errors.projectName))}>
          <label htmlFor="pm-project-name" className="mb-1.5 block text-xs font-semibold text-gray-800">
            프로젝트명 <span className="text-red-600">*</span>
          </label>
          <input
            id="pm-project-name"
            data-error-field="projectName"
            type="text"
            value={data.projectName}
            onChange={(e) => onChange('projectName', e.target.value)}
            placeholder="예: 서초동 근린생활시설 신축 PM"
            aria-invalid={Boolean(errors.projectName)}
            aria-describedby={errors.projectName ? 'pm-project-name-error' : undefined}
            className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-gray-900 outline-none transition-colors ${
              errors.projectName
                ? 'border-red-400 bg-red-50/40 focus:border-red-600'
                : 'border-gray-200 bg-white focus:border-gray-900'
            }`}
          />
          {errors.projectName && (
            <p
              id="pm-project-name-error"
              role="alert"
              className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-600"
            >
              <AlertCircle size={13} className="shrink-0" aria-hidden="true" />
              <span>{errors.projectName}</span>
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className={getShakeClass(Boolean(errors.clientName))}>
            <label htmlFor="pm-client-name" className="mb-1.5 block text-xs font-semibold text-gray-800">
              건축주 · 담당자명 <span className="text-red-600">*</span>
            </label>
            <input
              id="pm-client-name"
              data-error-field="clientName"
              type="text"
              value={data.clientName}
              onChange={(e) => onChange('clientName', e.target.value)}
              placeholder="예: 김빅플 대표"
              aria-invalid={Boolean(errors.clientName)}
              aria-describedby={errors.clientName ? 'pm-client-name-error' : undefined}
              className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-gray-900 outline-none transition-colors ${
                errors.clientName
                  ? 'border-red-400 bg-red-50/40 focus:border-red-600'
                  : 'border-gray-200 bg-white focus:border-gray-900'
              }`}
            />
            {errors.clientName && (
              <p
                id="pm-client-name-error"
                role="alert"
                className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-600"
              >
                <AlertCircle size={13} className="shrink-0" aria-hidden="true" />
                <span>{errors.clientName}</span>
              </p>
            )}
          </div>

          <div>
            <label htmlFor="pm-company-name" className="mb-1.5 block text-xs font-semibold text-gray-800">
              법인 · 기관명 <span className="font-normal text-gray-400">(선택)</span>
            </label>
            <input
              id="pm-company-name"
              type="text"
              value={data.companyName}
              onChange={(e) => onChange('companyName', e.target.value)}
              placeholder="예: (주)빅플래너홀딩스"
              className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-gray-900"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className={getShakeClass(Boolean(errors.phone))}>
            <label htmlFor="pm-phone" className="mb-1.5 block text-xs font-semibold text-gray-800">
              연락처 <span className="text-red-600">*</span>
            </label>
            <input
              id="pm-phone"
              data-error-field="phone"
              type="tel"
              inputMode="tel"
              value={data.phone}
              onChange={(e) => onChange('phone', formatPhoneNumber(e.target.value))}
              placeholder="010-0000-0000"
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? 'pm-phone-error' : undefined}
              className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-gray-900 tabular-nums outline-none transition-colors ${
                errors.phone
                  ? 'border-red-400 bg-red-50/40 focus:border-red-600'
                  : 'border-gray-200 bg-white focus:border-gray-900'
              }`}
            />
            {errors.phone && (
              <p
                id="pm-phone-error"
                role="alert"
                className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-600"
              >
                <AlertCircle size={13} className="shrink-0" aria-hidden="true" />
                <span>{errors.phone}</span>
              </p>
            )}
          </div>

          <div className={getShakeClass(Boolean(errors.email))}>
            <label htmlFor="pm-email" className="mb-1.5 block text-xs font-semibold text-gray-800">
              이메일 <span className="font-normal text-gray-400">(선택)</span>
            </label>
            <input
              id="pm-email"
              data-error-field="email"
              type="email"
              inputMode="email"
              value={data.email}
              onChange={(e) => onChange('email', e.target.value)}
              placeholder="client@company.co.kr"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'pm-email-error' : undefined}
              className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-gray-900 outline-none transition-colors ${
                errors.email
                  ? 'border-red-400 bg-red-50/40 focus:border-red-600'
                  : 'border-gray-200 bg-white focus:border-gray-900'
              }`}
            />
            {errors.email && (
              <p
                id="pm-email-error"
                role="alert"
                className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-600"
              >
                <AlertCircle size={13} className="shrink-0" aria-hidden="true" />
                <span>{errors.email}</span>
              </p>
            )}
          </div>
        </div>

        <div>
          <span className="mb-1.5 block text-xs font-semibold text-gray-800">사업 유형</span>
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(PROJECT_TYPE_LABELS) as ProjectType[]).map((typeKey) => {
              const selected = data.projectType === typeKey;
              return (
                <button
                  key={typeKey}
                  type="button"
                  onClick={() => onChange('projectType', typeKey)}
                  className={`rounded-xl border px-3 py-2.5 text-left text-xs font-semibold transition-colors ${
                    selected
                      ? 'border-black bg-black text-white'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {PROJECT_TYPE_LABELS[typeKey]}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label htmlFor="pm-stage" className="mb-1.5 block text-xs font-semibold text-gray-800">
            현재 진행 단계
          </label>
          <select
            id="pm-stage"
            value={data.currentStage}
            onChange={(e) => onChange('currentStage', e.target.value as ProjectStage)}
            className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-900"
          >
            {(Object.keys(PROJECT_STAGE_LABELS) as ProjectStage[]).map((stageKey) => (
              <option key={stageKey} value={stageKey}>
                {PROJECT_STAGE_LABELS[stageKey]}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
