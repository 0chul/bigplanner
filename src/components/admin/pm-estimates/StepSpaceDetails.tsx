import {
  BUILDING_USE_LABELS,
  BuildingUse,
  PM_PACKAGE_OPTIONS,
  PmEstimateFormData,
  PmFormErrors,
  sqmToPyeong,
} from './types';

interface StepSpaceDetailsProps {
  data: PmEstimateFormData;
  errors: PmFormErrors;
  onChange: <K extends keyof PmEstimateFormData>(field: K, value: PmEstimateFormData[K]) => void;
}

const ZONING_PRESETS = [
  '제1종일반주거지역',
  '제2종일반주거지역',
  '제3종일반주거지역',
  '준주거지역',
  '일반상업지역',
  '근린상업지역',
  '준공업지역',
];

export default function StepSpaceDetails({ data, errors, onChange }: StepSpaceDetailsProps) {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-blue-600">
          Step 02 · Space Details
        </p>
        <h2 className="mt-1 text-lg font-bold text-gray-900">공간 상세 및 PM 패키지</h2>
        <p className="mt-1 text-xs leading-relaxed text-gray-500">
          대상지 위치, 면적·층수 규모와 프로젝트 성격에 맞는 PM 패키지를 선택해 주세요.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="pm-site-address" className="mb-1.5 block text-xs font-semibold text-gray-800">
            사업지 주소 (지번 · 도로명) <span className="text-red-600">*</span>
          </label>
          <input
            id="pm-site-address"
            type="text"
            value={data.siteAddress}
            onChange={(e) => onChange('siteAddress', e.target.value)}
            placeholder="예: 서울시 서초구 서초동 000-00"
            aria-invalid={Boolean(errors.siteAddress)}
            className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-gray-900 outline-none transition-colors ${
              errors.siteAddress
                ? 'border-red-400 bg-red-50/40 focus:border-red-600'
                : 'border-gray-200 bg-white focus:border-blue-600'
            }`}
          />
          {errors.siteAddress && (
            <p className="mt-1 text-xs font-medium text-red-600">{errors.siteAddress}</p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="pm-zoning" className="mb-1.5 block text-xs font-semibold text-gray-800">
              용도지역
            </label>
            <select
              id="pm-zoning"
              value={data.zoning}
              onChange={(e) => onChange('zoning', e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-600"
            >
              {ZONING_PRESETS.map((z) => (
                <option key={z} value={z}>
                  {z}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="pm-building-use" className="mb-1.5 block text-xs font-semibold text-gray-800">
              주용도
            </label>
            <select
              id="pm-building-use"
              value={data.buildingUse}
              onChange={(e) => onChange('buildingUse', e.target.value as BuildingUse)}
              className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-600"
            >
              {(Object.keys(BUILDING_USE_LABELS) as BuildingUse[]).map((useKey) => (
                <option key={useKey} value={useKey}>
                  {BUILDING_USE_LABELS[useKey]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label htmlFor="pm-land-area" className="text-xs font-semibold text-gray-800">
                대지면적 (㎡)
              </label>
              <span className="font-mono text-[11px] text-blue-600 tabular-nums">
                {sqmToPyeong(data.landAreaSqm)}
              </span>
            </div>
            <input
              id="pm-land-area"
              type="number"
              min="0"
              step="0.1"
              inputMode="decimal"
              value={data.landAreaSqm}
              onChange={(e) => onChange('landAreaSqm', e.target.value)}
              placeholder="예: 330"
              aria-invalid={Boolean(errors.landAreaSqm)}
              className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-gray-900 tabular-nums outline-none transition-colors ${
                errors.landAreaSqm
                  ? 'border-red-400 bg-red-50/40 focus:border-red-600'
                  : 'border-gray-200 bg-white focus:border-blue-600'
              }`}
            />
            {errors.landAreaSqm && (
              <p className="mt-1 text-xs font-medium text-red-600">{errors.landAreaSqm}</p>
            )}
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label htmlFor="pm-gfa" className="text-xs font-semibold text-gray-800">
                예상 연면적 (㎡)
              </label>
              <span className="font-mono text-[11px] text-blue-600 tabular-nums">
                {sqmToPyeong(data.grossFloorAreaSqm)}
              </span>
            </div>
            <input
              id="pm-gfa"
              type="number"
              min="0"
              step="0.1"
              inputMode="decimal"
              value={data.grossFloorAreaSqm}
              onChange={(e) => onChange('grossFloorAreaSqm', e.target.value)}
              placeholder="예: 990"
              aria-invalid={Boolean(errors.grossFloorAreaSqm)}
              className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-gray-900 tabular-nums outline-none transition-colors ${
                errors.grossFloorAreaSqm
                  ? 'border-red-400 bg-red-50/40 focus:border-red-600'
                  : 'border-gray-200 bg-white focus:border-blue-600'
              }`}
            />
            {errors.grossFloorAreaSqm && (
              <p className="mt-1 text-xs font-medium text-red-600">{errors.grossFloorAreaSqm}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="pm-floors-b" className="mb-1.5 block text-xs font-semibold text-gray-800">
              지하 층수
            </label>
            <input
              id="pm-floors-b"
              type="number"
              min="0"
              max="20"
              value={data.floorsUnderground}
              onChange={(e) => onChange('floorsUnderground', e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 tabular-nums outline-none focus:border-blue-600"
            />
          </div>
          <div>
            <label htmlFor="pm-floors-f" className="mb-1.5 block text-xs font-semibold text-gray-800">
              지상 층수
            </label>
            <input
              id="pm-floors-f"
              type="number"
              min="1"
              max="100"
              value={data.floorsAboveGround}
              onChange={(e) => onChange('floorsAboveGround', e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 tabular-nums outline-none focus:border-blue-600"
            />
          </div>
        </div>

        <div>
          <span className="mb-2 block text-xs font-semibold text-gray-800">희망 PM 패키지</span>
          <div className="space-y-2">
            {PM_PACKAGE_OPTIONS.map((pkg) => {
              const selected = data.pmPackage === pkg.id;
              return (
                <button
                  key={pkg.id}
                  type="button"
                  onClick={() => onChange('pmPackage', pkg.id)}
                  className={`w-full rounded-xl border p-3 text-left transition-colors ${
                    selected
                      ? 'border-gray-950 bg-gray-950 text-white'
                      : 'border-gray-200 bg-white text-gray-800 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold sm:text-sm">{pkg.name}</span>
                    <span
                      className={`text-[11px] font-semibold ${
                        selected ? 'text-blue-300' : 'text-blue-600'
                      }`}
                    >
                      {pkg.tag}
                    </span>
                  </div>
                  <p
                    className={`mt-1 text-xs leading-relaxed ${
                      selected ? 'text-gray-300' : 'text-gray-500'
                    }`}
                  >
                    {pkg.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
