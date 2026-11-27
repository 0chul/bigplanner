import { DEMO_ROLES, type DemoFormValues, type DemoRole } from '../utils/fireSafetyDemo';

const englishRoles = {
  'head-office': 'Property management head office',
  site: 'On-site management or facilities team',
  other: 'Other',
} satisfies Record<DemoRole, string>;

export const englishDemoFieldErrors = {
  company: 'Enter a company or organization name of 120 characters or fewer.',
  name: 'Enter a contact name of 80 characters or fewer.',
  email: 'Check that the email address is valid.',
  role: 'Select your role.',
  buildingCount: 'Enter a whole number from 1 to 100,000.',
  interests: 'Enter no more than 1,000 characters about what you would like to see.',
  consent: 'Please agree to the collection and use of personal information for your demo request.',
} satisfies Record<keyof DemoFormValues, string>;

export const demoRequestCopy = {
  ko: {
    heading: '데모 시연 신청',
    required: '필수 입력',
    introduction: '신청해 주시면 이메일로 온라인 시연 일정을 조율합니다.',
    legend: '데모 신청 정보',
    company: '회사·기관명',
    companyPlaceholder: '회사 또는 관리 건물명을 입력해 주세요',
    name: '담당자명',
    namePlaceholder: '성함',
    role: '담당 업무',
    rolePlaceholder: '선택해 주세요',
    roles: DEMO_ROLES,
    email: '이메일',
    emailPlaceholder: 'demo@company.co.kr',
    buildingCount: '관리 건물 수',
    buildingCountPlaceholder: '예: 3',
    interests: '데모에서 확인하고 싶은 업무',
    interestsPlaceholder: '예: 냉난방 민원 접수, 주차 안내, 교대 시 접수 이력 확인',
    interestsHint: '실제 민원인의 연락처 등 개인정보나 내부 자료는 입력하지 마세요.',
    optional: '선택',
    website: '웹사이트',
    consent: '데모 신청을 위한 개인정보 수집·이용에 동의합니다.',
    consentRequired: '(필수)',
    submit: '데모 시연 신청',
    submitting: '접수 중입니다',
    afterSubmit: '매뉴얼 파일이나 실제 민원 자료 없이 신청할 수 있습니다.',
    validationSummary: '입력 내용을 확인해 주세요. 표시된 항목을 수정한 뒤 다시 신청할 수 있습니다.',
    invalidRequest: '신청을 전송하지 못했습니다. 입력 내용을 확인한 뒤 다시 시도해 주세요.',
    failedRequest: '신청을 전송하지 못했습니다. 입력 내용은 유지되어 있습니다. 잠시 후 다시 시도해 주세요. 계속 어려우시면 아래 이메일로 문의해 주세요.',
    successLabel: '신청 완료',
    successTitle: '데모 신청이 접수되었습니다.',
    successText: '입력하신 이메일로 일정 조율을 안내드리겠습니다.',
    emailLabel: '문의',
    reset: '다른 신청 작성',
    privacy: {
      title: '개인정보 수집·이용 안내',
      rows: [
        ['수집·이용 주체', '빅플래너파트너스'],
        ['이용 목적', '데모 신청 접수, 도입 상담 및 온라인 시연 일정 조율'],
        ['수집 항목', '회사·기관명, 담당자명, 이메일, 담당 업무. 관리 건물 수와 관심 업무는 입력한 경우에만 수집합니다.'],
        ['보유 기간', '접수일로부터 최대 90일. 삭제를 원하시면 아래 이메일로 요청할 수 있습니다.'],
        ['동의 거부', '동의를 거부할 수 있으며, 이 경우 온라인 데모 신청이 제한됩니다.'],
      ],
      contact: '문의·삭제 요청',
    },
  },
  en: {
    heading: 'Request an online demo',
    required: 'Required fields',
    introduction: 'After you submit your request, we will email you to arrange an online demo.',
    legend: 'Demo request details',
    company: 'Company or organization',
    companyPlaceholder: 'Company or building name',
    name: 'Contact name',
    namePlaceholder: 'Your name',
    role: 'Role',
    rolePlaceholder: 'Select your role',
    roles: englishRoles,
    email: 'Email address',
    emailPlaceholder: 'you@example.com',
    buildingCount: 'Number of buildings managed',
    buildingCountPlaceholder: 'e.g., 3',
    interests: 'What would you like to see in the demo?',
    interestsPlaceholder: 'e.g., logging air conditioning issues, visitor parking guidance, or shift handovers',
    interestsHint: 'Please leave out personal information, such as actual tenant contact details, and internal materials.',
    optional: 'Optional',
    website: 'Website',
    consent: 'I agree to the collection and use of my personal information to process my demo request.',
    consentRequired: '(Required)',
    submit: 'Submit demo request',
    submitting: 'Submitting your request',
    afterSubmit: 'You can request a demo without providing manuals or actual tenant request records.',
    validationSummary: 'Review the highlighted fields and try again.',
    invalidRequest: 'We could not send your request. Check your details and try again.',
    failedRequest: 'We could not send your request. Your details are still here. Please try again shortly or email us at the address below.',
    successLabel: 'Request received',
    successTitle: 'We received your demo request.',
    successText: 'We will email you at the address you provided to arrange the demo.',
    emailLabel: 'Contact',
    reset: 'Start another request',
    privacy: {
      title: 'How we collect and use your personal information',
      rows: [
        ['Who collects and uses your information', 'BigPlanner Partners'],
        ['Why we use it', 'To process demo requests, discuss deployment, and arrange online demos.'],
        ['What we collect', 'Company or organization name, contact name, email address, and role. We collect the number of buildings you manage and the workflows you are interested in only if you provide them.'],
        ['How long we keep it', 'Up to 90 days from the date we receive your request. You can request deletion at the email address below.'],
        ['Your choice', 'You may decline consent. Consent is required to submit an online demo request.'],
      ],
      contact: 'Questions and deletion requests',
    },
  },
} as const;

type FormTextFields = keyof Omit<typeof demoRequestCopy.en, 'roles' | 'privacy'>;
export type DemoRequestFormTranslation = {
  form: Record<FormTextFields, string> & {
    roles: Readonly<Record<DemoRole, string>>;
    privacy: {
      title: string;
      rows: readonly (readonly string[])[];
      contact: string;
    };
  };
  errors: Record<keyof DemoFormValues, string>;
};
