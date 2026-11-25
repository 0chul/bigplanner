import { Check, Edit3 } from 'lucide-react';
import {
  BUILDING_USE_LABELS,
  FOCUS_AREA_OPTIONS,
  PM_PACKAGE_OPTIONS,
  PROJECT_STAGE_LABELS,
  PROJECT_TYPE_LABELS,
  PmEstimateFormData,
  PmFormErrors,
  PmWizardStep,
  sqmToPyeong,
} from './types';

interface StepRequestsProps {
  data: PmEstimateFormData;
  errors: PmFormErrors;
  onChange: <K extends keyof PmEstimateFormData>(field: K, value: PmEstimateFormData[K]) => void;
  onJumpToStep: (step: PmWizardStep) => void;
}

export default function StepRequests({
  data,
  errors,
  onChange,
  onJumpToStep,
}: StepRequestsProps) {
  const toggleFocusArea = (area: string) => {
    const exists = data.focusAreas.includes(area);
    const next = exists
      ? data.focusAreas.filter((item) => item !== area)
      : [...data.focusAreas, area];
    onChange('focusAreas', next);
  };

  const selectedPackageName =
    PM_PACKAGE_OPTIONS.find((pkg) => pkg.id === data.pmPackage)?.name || data.pmPackage;

  return (
    <div className="space-y-5">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-blue-600">
          Step 03 · Requirements &amp; Review
        </p>
        <h2 className="mt-1 text-lg font-bold text-gray-900">요청 사항 및 최종 확인</h2>
        <p className="mt-1 text-xs leading-relaxed text-gray-500">
          예상 사업 예산, 희망 일정, 중점 요청 항목을 지정하고 입력 내용을 최종 검토합니다.
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="pm-budget" className="mb-1.5 block text-xs font-semibold text-gray-800">
              예상 총공사비 (억원)
            </label>
            <input
              id="pm-budget"
              type="number"
              min="0"
              step="0.5"
              inputMode="decimal"
              value={data.estimatedBudgetEok}
              onChange={(e) => onChange('estimatedBudgetEok', e.target.value)}
              placeholder="예: 35"
              aria-invalid={Boolean(errors.estimatedBudgetEok)}
              className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-gray-900 tabular-nums outline-none transition-colors ${
                errors.estimatedBudgetEok
                  ? 'border-red-400 bg-red-50/40 focus:border-red-600'
                  : 'border-gray-200 bg-white focus:border-blue-600'
              }`}
            />
            {errors.estimatedBudgetEok && (
              <p className="mt-1 text-xs font-medium text-red-600">{errors.estimatedBudgetEok}</p>
            )}
          </div>

          <div>
            <label htmlFor="pm-schedule" className="mb-1.5 block text-xs font-semibold text-gray-800">
              희망 착공 · 준공 일정
            </label>
            <input
              id="pm-schedule"
              type="text"
              value={data.targetSchedule}
              onChange={(e) => onChange('targetSchedule', e.target.value)}
              placeholder="예: 2027년 상반기 착공 목표"
              className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-blue-600"
            />
          </div>
        </div>

        <div>
          <span className="mb-2 block text-xs font-semibold text-gray-800">
            중점 검토 · 요청 항목 (복수 선택)
          </span>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {FOCUS_AREA_OPTIONS.map((area) => {
              const checked = data.focusAreas.includes(area);
              return (
                <button
                  key={area}
                  type="button"
                  onClick={() => toggleFocusArea(area)}
                  aria-pressed={checked}
                  className={`flex items-center gap-2.5 rounded-xl border px-3 py-2 text-left text-xs font-medium transition-colors ${
                    checked
                      ? 'border-blue-600 bg-blue-50/70 text-gray-900'
                      : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                      checked
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : 'border-gray-300 bg-white'
                    }`}
                  >
                    {checked && <Check size={11} aria-hidden="true" />}
                  </span>
                  <span className="truncate">{area}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-3">
          <div className="pr-3">
            <p className="text-xs font-semibold text-gray-900">
              NICE D&amp;R 에스크로 및 8대 안전계약 제안 포함
            </p>
            <p className="mt-0.5 text-[11px] text-gray-500">
              공사비 유용 방지 및 기성 정산 안전장치 안내 항목을 제안서에 포함합니다.
            </p>
          </div>
          <input
            id="pm-escrow-review"
            type="checkbox"
            checked={data.includeEscrowReview}
            onChange={(e) => onChange('includeEscrowReview', e.target.checked)}
            aria-label="에스크로 및 8대 안전계약 제안 포함"
            className="h-4 w-4 shrink-0 accent-blue-600 cursor-pointer"
          />
        </div>

        <div>
          <label htmlFor="pm-notes" className="mb-1.5 block text-xs font-semibold text-gray-800">
            상세 요청 사항 및 특이사항
          </label>
          <textarea
            id="pm-notes"
            rows={3}
            value={data.detailedNotes}
            onChange={(e) => onChange('detailedNotes', e.target.value)}
            placeholder="임대 전략, 인허가 이슈, 금융 조달 조건, 건축주 특별 요청 등을 자유롭게 입력하세요."
            aria-invalid={Boolean(errors.detailedNotes)}
            className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-gray-900 outline-none transition-colors ${
              errors.detailedNotes
                ? 'border-red-400 bg-red-50/40 focus:border-red-600'
                : 'border-gray-200 bg-white focus:border-blue-600'
            }`}
          />
          {errors.detailedNotes && (
            <p className="mt-1 text-xs font-medium text-red-600">{errors.detailedNotes}</p>
          )}
        </div>

        {/* Live Review Summary Block */}
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-gray-200 pb-2">
            <span className="text-xs font-bold text-gray-900">입력 요약 확인</span>
            <span className="text-[11px] font-medium text-gray-500">수정 시 단계 클릭</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-gray-900">
                  {data.projectName || '프로젝트명 미입력'}
                </p>
                <p className="text-gray-600 mt-0.5">
                  {data.clientName || '-'}
                  {data.companyName ? ` (${data.companyName})` : ''} · {data.phone || '-'}
                </p>
                <p className="text-gray-500 mt-0.5">
                  {PROJECT_TYPE_LABELS[data.projectType]} · {PROJECT_STAGE_LABELS[data.currentStage]}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onJumpToStep(0)}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800 shrink-0"
              >
                <Edit3 size={11} aria-hidden="true" />
                <span>수정</span>
              </button>
            </div>

            <div className="border-t border-gray-200 pt-2 flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-gray-900">
                  {data.siteAddress || '사업지 주소 미입력'}
                </p>
                <p className="text-gray-600 mt-0.5 tabular-nums">
                  {data.zoning} · {BUILDING_USE_LABELS[data.buildingUse]} · 지{data.floorsAboveGround || '-'}층/지하{data.floorsUnderground || '-'}층
                </p>
                <p className="text-gray-500 mt-0.5 tabular-nums">
                  대지 {data.landAreaSqm ? `${data.landAreaSqm}㎡ (${sqmToPyeong(data.landAreaSqm)})` : '-'} · 연면적{' '}
                  {data.grossFloorAreaSqm
                    ? `${data.grossFloorAreaSqm}㎡ (${sqmToPyeong(data.grossFloorAreaSqm)})`
                    : '-'}
                </p>
                <p className="text-blue-700 font-semibold mt-0.5">{selectedPackageName}</p>
              </div>
              <button
                type="button"
                onClick={() => onJumpToStep(1)}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800 shrink-0"
              >
                <Edit3 size={11} aria-hidden="true" />
                <span>수정</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
