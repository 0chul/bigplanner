export const DEMO_CONSENT_VERSION = 'fire-safety-demo-v1-2026-11-17';
export const DEMO_SOURCE_PATH = '/fire-safety-ai';

export const DEMO_ROLES = {
  'head-office': '관리 업체 본사',
  site: '관리소·방재실',
  other: '기타',
} as const;

export type DemoRole = keyof typeof DEMO_ROLES;

export interface DemoFormValues {
  company: string;
  name: string;
  email: string;
  role: string;
  buildingCount: string;
  interests: string;
  consent: boolean;
}

export type DemoFormErrors = Partial<Record<keyof DemoFormValues, string>>;

export const EMPTY_DEMO_FORM: DemoFormValues = {
  company: '',
  name: '',
  email: '',
  role: '',
  buildingCount: '',
  interests: '',
  consent: false,
};

export function validateDemoForm(values: DemoFormValues): DemoFormErrors {
  const errors: DemoFormErrors = {};
  const company = values.company.trim();
  const name = values.name.trim();
  const email = values.email.trim();
  if (!company || company.length > 120 || /[\x00-\x1f]/.test(company)) {
    errors.company = '회사·기관명을 120자 이내로 입력해 주세요.';
  }
  if (!name || name.length > 80 || /[\x00-\x1f]/.test(name)) {
    errors.name = '담당자명을 80자 이내로 입력해 주세요.';
  }
  if (email.length > 254 || /[\x00-\x1f\x7f]/.test(email) ||
    !/^[^\s@]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/i.test(email)) {
    errors.email = '연락받을 이메일 주소를 확인해 주세요.';
  }
  if (!Object.hasOwn(DEMO_ROLES, values.role)) {
    errors.role = '담당 업무를 선택해 주세요.';
  }
  if (values.buildingCount.trim() && (
    !/^\d+$/.test(values.buildingCount.trim()) ||
    Number(values.buildingCount) < 1 || Number(values.buildingCount) > 100000
  )) {
    errors.buildingCount = '관리 건물 수는 1~100,000 사이의 정수로 입력해 주세요.';
  }
  if (values.interests.trim().length > 1000 || values.interests.includes('\0')) {
    errors.interests = '확인하고 싶은 업무는 1,000자 이내로 입력해 주세요.';
  }
  if (!values.consent) errors.consent = '데모 신청을 위한 개인정보 수집·이용에 동의해 주세요.';
  return errors;
}

export function createDemoRequestPayload(values: DemoFormValues, id: string) {
  if (Object.keys(validateDemoForm(values)).length) {
    throw new Error('Invalid demo application');
  }
  return {
    id,
    company_name: values.company.trim(),
    contact_name: values.name.trim(),
    email: values.email.trim().toLowerCase(),
    role: values.role as DemoRole,
    building_count: values.buildingCount.trim() ? Number(values.buildingCount) : null,
    interests: values.interests.trim(),
    consent_granted: true,
    consent_version: DEMO_CONSENT_VERSION,
    source_path: DEMO_SOURCE_PATH,
  };
}

export type DemoRequestPayload = ReturnType<typeof createDemoRequestPayload>;
