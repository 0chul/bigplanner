import {
  fireSafetyEnglishPilotKitPath,
  fireSafetyEnglishResourcesPath,
  fireSafetyKoreanPilotKitPath,
  fireSafetyKoreanResourcesPath,
} from '../../src/utils/fireSafetyLocales.js';

export const pilotKits = {
  ko: {
    path: fireSafetyKoreanPilotKitPath,
    libraryPath: fireSafetyKoreanResourcesPath,
    title: '시설관리 AI 도입 검토 자료 묶음',
    description: '시작 안내, 교대 인계대장, FAQ 작성표, 냉난방 연장 운전 신청서, 한 장 소개서를 한 파일로 받으세요.',
    download: '한국어 자료 받기 (ZIP)',
  },
  en: {
    path: fireSafetyEnglishPilotKitPath,
    libraryPath: fireSafetyEnglishResourcesPath,
    title: 'Facilities AI pilot starter kit',
    description: 'Get the quick-start guide, shift handover workbook, building FAQ worksheet, after-hours HVAC request form and one-page overview in one file.',
    download: 'Get the English kit (ZIP)',
  },
};
