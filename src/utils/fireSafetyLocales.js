export const fireSafetyPath = '/fire-safety-ai/';
export const siteOrigin = 'https://bigplanner.co.kr';

export const fireSafetyLanguages = [
  { code: 'ko', label: '한국어', path: fireSafetyPath, locale: 'ko_KR' },
  { code: 'en', label: 'English', path: `${fireSafetyPath}en/`, locale: 'en_US' },
  { code: 'de', label: 'Deutsch', path: `${fireSafetyPath}de/`, locale: 'de_DE' },
  { code: 'fr', label: 'Français', path: `${fireSafetyPath}fr/`, locale: 'fr_FR' },
  { code: 'ja', label: '日本語', path: `${fireSafetyPath}ja/`, locale: 'ja_JP' },
  { code: 'zh-Hant', label: '繁體中文', path: `${fireSafetyPath}zh-hant/`, locale: 'zh_HK' },
  { code: 'ar', label: 'العربية', path: `${fireSafetyPath}ar/`, locale: 'ar_QA', direction: 'rtl' },
];

export const fireSafetyTranslations = fireSafetyLanguages.filter(({ code }) => code !== 'ko');
export const fireSafetyAlternates = [
  ...fireSafetyLanguages,
  { code: 'x-default', path: fireSafetyTranslations[0].path },
];
