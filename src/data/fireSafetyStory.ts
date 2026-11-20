export const FIRE_SAFETY_INCIDENT = {
  id: 'DEMO-012',
  building: '가상 빌딩',
  floor: '5F',
  location: '가상 빌딩 · 5층 공용 회의실',
  message: '5층 공용 회의실 냉방이 약해요.',
  contact: '010-****-0000',
  image: '/images/fire-safety-building.webp',
} as const;

export const FIRE_SAFETY_STORY_STEPS = [
  {
    id: 'fa-story-step-1',
    label: '문의 접수',
    role: 'AI 접수 정리',
    eyebrow: 'AI가 필요한 접수 정보를 모읍니다',
    title: ['필요한 정보를,', '먼저 정리합니다.'],
    description: 'AI가 문의 위치·내용·회신 연락처를 접수 카드로 정리합니다. 관리자는 필요한 정보를 한곳에서 확인합니다.',
    takeaway: '위치와 연락처를 다시 묻는 수고',
  },
  {
    id: 'fa-story-step-2',
    label: '매뉴얼 안내',
    role: 'AI 매뉴얼 안내',
    eyebrow: 'AI가 건물 매뉴얼을 바탕으로 안내합니다',
    title: ['우리 건물의 기준으로,', '안내합니다.'],
    description: 'AI가 매뉴얼에 근거한 안내를 제시합니다. 현장 확인이 필요한 냉방 불편은 담당자 확인으로 이어갑니다.',
    takeaway: '같은 이용 안내를 반복하는 수고',
  },
  {
    id: 'fa-story-step-3',
    label: '담당자 전달',
    role: '관리자 확인·지정',
    eyebrow: '관리자가 접수를 확인하고 담당자를 지정합니다',
    title: ['같은 내용을,', '다시 옮기지 않습니다.'],
    description: '관리자가 접수 내용을 확인하고 담당자를 지정합니다. 위치와 문의 내용이 담긴 같은 접수 카드로 전달합니다.',
    takeaway: '문의 내용을 옮겨 적어 전달하는 수고',
  },
  {
    id: 'fa-story-step-4',
    label: '기록 확인',
    role: '같은 접수번호의 이력',
    eyebrow: '다음 담당자도 같은 접수 이력을 확인합니다',
    title: ['교대 후에도,', '맥락을 이어갑니다.'],
    description: '접수·안내·지정·전달 이력을 같은 접수번호 아래 남깁니다. 다음 담당자는 문의의 맥락을 이어서 확인합니다.',
    takeaway: '교대 후 흩어진 이력을 찾는 수고',
  },
] as const;
