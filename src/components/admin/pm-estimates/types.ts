export type PmWizardStep = 0 | 1 | 2;

export type ProjectType = 'new-build' | 'remodeling' | 'interior' | 'advisory';
export type ProjectStage = 'site-review' | 'planning' | 'bidding' | 'construction';
export type BuildingUse = 'commercial' | 'office' | 'residential' | 'mixed' | 'medical-fnb';
export type PmPackageType = 'consulting' | 'management' | 'credit' | 'all-in-one';

export interface PmEstimateFormData {
  // Step 1: 기본 정보
  projectName: string;
  clientName: string;
  companyName: string;
  phone: string;
  email: string;
  projectType: ProjectType;
  currentStage: ProjectStage;

  // Step 2: 공간 상세
  siteAddress: string;
  zoning: string;
  buildingUse: BuildingUse;
  landAreaSqm: string;
  grossFloorAreaSqm: string;
  floorsUnderground: string;
  floorsAboveGround: string;
  pmPackage: PmPackageType;

  // Step 3: 요청 사항
  estimatedBudgetEok: string;
  targetSchedule: string;
  focusAreas: string[];
  includeEscrowReview: boolean;
  detailedNotes: string;
}

export type PmFormErrors = Partial<Record<keyof PmEstimateFormData, string>>;

export interface WizardStepMeta {
  index: PmWizardStep;
  num: string;
  title: string;
  subtitle: string;
}

export const WIZARD_STEPS: WizardStepMeta[] = [
  {
    index: 0,
    num: '01',
    title: '기본 정보',
    subtitle: '건축주 · 프로젝트 개요',
  },
  {
    index: 1,
    num: '02',
    title: '공간 상세',
    subtitle: '대지 · 규모 · PM 패키지',
  },
  {
    index: 2,
    num: '03',
    title: '요청 사항',
    subtitle: '예산 · 검토 항목 · 확인',
  },
];

export const INITIAL_PM_FORM_DATA: PmEstimateFormData = {
  projectName: '',
  clientName: '',
  companyName: '',
  phone: '',
  email: '',
  projectType: 'new-build',
  currentStage: 'site-review',

  siteAddress: '',
  zoning: '제2종일반주거지역',
  buildingUse: 'commercial',
  landAreaSqm: '',
  grossFloorAreaSqm: '',
  floorsUnderground: '1',
  floorsAboveGround: '5',
  pmPackage: 'all-in-one',

  estimatedBudgetEok: '',
  targetSchedule: '',
  focusAreas: ['사업성·수지분석', '설계·인허가 관리'],
  includeEscrowReview: true,
  detailedNotes: '',
};

export const PROJECT_TYPE_LABELS: Record<ProjectType, string> = {
  'new-build': '중소형 신축 개발',
  remodeling: '리모델링 · 밸류애드',
  interior: '하이엔드 인테리어',
  advisory: '매입 · 매각 · 타당성 자문',
};

export const PROJECT_STAGE_LABELS: Record<ProjectStage, string> = {
  'site-review': '부지 매입 · 검토 중',
  planning: '건축 기획 · 설계 단계',
  bidding: '시공사 선정 · 입찰 전',
  construction: '착공 · 시공 진행 중',
};

export const BUILDING_USE_LABELS: Record<BuildingUse, string> = {
  commercial: '근린생활시설',
  office: '사옥 · 오피스',
  residential: '주거 · 다가구',
  mixed: '주상복합 · 복합개발',
  'medical-fnb': '메디컬 · F&B 특화',
};

export const PM_PACKAGE_OPTIONS: {
  id: PmPackageType;
  name: string;
  tag: string;
  desc: string;
}[] = [
  {
    id: 'all-in-one',
    name: '통합 PM 풀패키지',
    tag: '추천',
    desc: '기획·설계·시공 PM·에스크로 안전계약까지 전 과정 통합 대행',
  },
  {
    id: 'consulting',
    name: 'BIG Consulting (기획)',
    tag: '초기 검증',
    desc: '입지 분석, 법규·규모 검토, 현금흐름(Cash Flow) 타당성 분석',
  },
  {
    id: 'management',
    name: 'BIG Management (시공 PM)',
    tag: '현장 관리',
    desc: '시공사 입찰 비교, 건축비서 앱 실시간 공정·품질 감리 및 정산',
  },
  {
    id: 'credit',
    name: 'BIG Credit (안전계약)',
    tag: '리스크 차단',
    desc: '8대 안전장치 계약 및 NICE D&R 노무비닷컴 에스크로 대금 집행',
  },
];

export const FOCUS_AREA_OPTIONS = [
  '사업성·수지분석',
  '설계·인허가 관리',
  '시공사 입찰·원가 검증',
  '8대 안전계약·에스크로',
  '금융조달(PF·브릿지론)',
  '방재실 AI 민원 도우미 연계',
];

export function sqmToPyeong(sqmStr: string): string {
  const num = Number(sqmStr);
  if (!sqmStr.trim() || !Number.isFinite(num) || num <= 0) return '-';
  return `${(num * 0.3025).toFixed(1)}평`;
}

export function validateWizardStep(step: PmWizardStep, data: PmEstimateFormData): PmFormErrors {
  const errors: PmFormErrors = {};

  if (step === 0) {
    if (!data.projectName.trim()) {
      errors.projectName = '프로젝트명을 입력해 주세요.';
    }
    if (!data.clientName.trim()) {
      errors.clientName = '건축주 또는 담당자명을 입력해 주세요.';
    }
    if (!data.phone.trim()) {
      errors.phone = '연락처를 입력해 주세요.';
    } else if (data.phone.replace(/\D/g, '').length < 9) {
      errors.phone = '유효한 전화번호 형식으로 입력해 주세요.';
    }
    if (data.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
      errors.email = '올바른 이메일 주소를 입력해 주세요.';
    }
  }

  if (step === 1) {
    if (!data.siteAddress.trim()) {
      errors.siteAddress = '사업지 주소(지번 또는 도로명)를 입력해 주세요.';
    }
    if (data.landAreaSqm.trim() && (Number(data.landAreaSqm) <= 0 || isNaN(Number(data.landAreaSqm)))) {
      errors.landAreaSqm = '대지면적은 0보다 큰 숫자로 입력해 주세요.';
    }
    if (
      data.grossFloorAreaSqm.trim() &&
      (Number(data.grossFloorAreaSqm) <= 0 || isNaN(Number(data.grossFloorAreaSqm)))
    ) {
      errors.grossFloorAreaSqm = '연면적은 0보다 큰 숫자로 입력해 주세요.';
    }
  }

  if (step === 2) {
    if (
      data.estimatedBudgetEok.trim() &&
      (Number(data.estimatedBudgetEok) <= 0 || isNaN(Number(data.estimatedBudgetEok)))
    ) {
      errors.estimatedBudgetEok = '예상 공사비는 0보다 큰 숫자(억원)로 입력해 주세요.';
    }
    if (data.focusAreas.length === 0 && !data.detailedNotes.trim()) {
      errors.detailedNotes = '검토 요청 항목을 선택하거나 상세 요청 사항을 입력해 주세요.';
    }
  }

  return errors;
}
