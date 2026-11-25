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
  onChange: <K extends keyof PmEstimateFormData>(field: K, value: PmEstimateFormData[K]) => void;
}

export default function StepBasicInfo({ data, errors, onChange }: StepBasicInfoProps) {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-blue-600">
          Step 01 · Basic Information
        </p>
        <h2 className="mt-1 text-lg font-bold text-gray-900">기본 정보 입력</h2>
        <p className="mt-1 text-xs leading-relaxed text-gray-500">
          제안서 표지 및 견적 기준이 되는 프로젝트명과 건축주(담당자) 기본 정보를 입력해 주세요.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="pm-project-name" className="mb-1.5 block text-xs font-semibold text-gray-800">
            프로젝트명 <span className="text-red-600">*</span>
          </label>
          <input
            id="pm-project-name"
            type="text"
            value={data.projectName}
            onChange={(e) => onChange('projectName', e.target.value)}
            placeholder="예: 서초동 근린생활시설 신축 PM"
            aria-invalid={Boolean(errors.projectName)}
            className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-gray-900 outline-none transition-colors ${
              errors.projectName
                ? 'border-red-400 bg-red-50/40 focus:border-red-600'
                : 'border-gray-200 bg-white focus:border-blue-600'
            }`}
          />
          {errors.projectName && (
            <p className="mt-1 text-xs font-medium text-red-600">{errors.projectName}</p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="pm-client-name" className="mb-1.5 block text-xs font-semibold text-gray-800">
              건축주 · 담당자명 <span className="text-red-600">*</span>
            </label>
            <input
              id="pm-client-name"
              type="text"
              value={data.clientName}
              onChange={(e) => onChange('clientName', e.target.value)}
              placeholder="예: 김빅플 대표"
              aria-invalid={Boolean(errors.clientName)}
              className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-gray-900 outline-none transition-colors ${
                errors.clientName
                  ? 'border-red-400 bg-red-50/40 focus:border-red-600'
                  : 'border-gray-200 bg-white focus:border-blue-600'
              }`}
            />
            {errors.clientName && (
              <p className="mt-1 text-xs font-medium text-red-600">{errors.clientName}</p>
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
              className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-blue-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="pm-phone" className="mb-1.5 block text-xs font-semibold text-gray-800">
              연락처 <span className="text-red-600">*</span>
            </label>
            <input
              id="pm-phone"
              type="tel"
              inputMode="tel"
              value={data.phone}
              onChange={(e) => onChange('phone', formatPhoneNumber(e.target.value))}
              placeholder="010-0000-0000"
              aria-invalid={Boolean(errors.phone)}
              className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-gray-900 tabular-nums outline-none transition-colors ${
                errors.phone
                  ? 'border-red-400 bg-red-50/40 focus:border-red-600'
                  : 'border-gray-200 bg-white focus:border-blue-600'
              }`}
            />
            {errors.phone && (
              <p className="mt-1 text-xs font-medium text-red-600">{errors.phone}</p>
            )}
          </div>

          <div>
            <label htmlFor="pm-email" className="mb-1.5 block text-xs font-semibold text-gray-800">
              이메일 <span className="font-normal text-gray-400">(선택)</span>
            </label>
            <input
              id="pm-email"
              type="email"
              inputMode="email"
              value={data.email}
              onChange={(e) => onChange('email', e.target.value)}
              placeholder="client@company.co.kr"
              aria-invalid={Boolean(errors.email)}
              className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-gray-900 outline-none transition-colors ${
                errors.email
                  ? 'border-red-400 bg-red-50/40 focus:border-red-600'
                  : 'border-gray-200 bg-white focus:border-blue-600'
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-xs font-medium text-red-600">{errors.email}</p>
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
                      ? 'border-gray-950 bg-gray-950 text-white'
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
            className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-600"
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
