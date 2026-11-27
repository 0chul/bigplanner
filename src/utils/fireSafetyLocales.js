export const fireSafetyPath = '/fire-safety-ai/';
export const fireSafetyEnglishPath = `${fireSafetyPath}en/`;
export const fireSafetyKoreanFeedPath = `${fireSafetyPath}rss.xml`;
export const fireSafetyEnglishFeedPath = `${fireSafetyEnglishPath}rss.xml`;
export const fireSafetyEnglishDemoPath = `${fireSafetyEnglishPath}request/`;
export const fireSafetyKoreanVideoPath = `${fireSafetyPath}demo-video/`;
export const fireSafetyEnglishVideoPath = `${fireSafetyEnglishPath}demo-video/`;
export const facilitiesHandoverPath = `${fireSafetyEnglishPath}shift-handover/`;
export const fireSafetyChecklistPath = `${fireSafetyPath}handoff-checklist/`;
export const fireSafetyAdoptionPath = `${fireSafetyPath}adoption-guide/`;
export const siteOrigin = 'https://bigplanner.co.kr';

export const fireSafetyLanguages = [
  { code: 'ko', label: '한국어', path: fireSafetyPath, locale: 'ko_KR' },
  { code: 'en', label: 'English', path: fireSafetyEnglishPath, locale: 'en_US' },
  { code: 'de', label: 'Deutsch', path: `${fireSafetyPath}de/`, locale: 'de_DE' },
  { code: 'fr', label: 'Français', path: `${fireSafetyPath}fr/`, locale: 'fr_FR' },
  { code: 'ja', label: '日本語', path: `${fireSafetyPath}ja/`, locale: 'ja_JP' },
  { code: 'zh-Hant', label: '繁體中文', path: `${fireSafetyPath}zh-hant/`, locale: 'zh_HK' },
  { code: 'ar', label: 'العربية', path: `${fireSafetyPath}ar/`, locale: 'ar_QA', direction: 'rtl' },
  { code: 'nb', label: 'Norsk bokmål', path: `${fireSafetyPath}nb/`, locale: 'nb_NO' },
  { code: 'da', label: 'Dansk', path: `${fireSafetyPath}da/`, locale: 'da_DK' },
  { code: 'nl', label: 'Nederlands', path: `${fireSafetyPath}nl/`, locale: 'nl_NL' },
  { code: 'sv', label: 'Svenska', path: `${fireSafetyPath}sv/`, locale: 'sv_SE' },
].map((language) => ({
  ...language,
  handoverPath: language.code === 'ko' ? fireSafetyChecklistPath : `${language.path}shift-handover/`,
  videoPath: `${language.path}demo-video/`,
}));

export const fireSafetyTranslations = fireSafetyLanguages
  .filter(({ code }) => code !== 'ko')
  .map((language) => ({ ...language, requestPath: `${language.path}request/` }));
export const fireSafetyRequestPages = new Map(fireSafetyTranslations.map((language) => [language.requestPath, language]));
export const fireSafetyAlternates = [
  ...fireSafetyLanguages,
  { code: 'x-default', path: fireSafetyEnglishPath },
];
export const fireSafetyHandoverAlternates = [
  ...fireSafetyLanguages.map(({ code, handoverPath }) => ({ code, path: handoverPath })),
  { code: 'x-default', path: facilitiesHandoverPath },
];
export const fireSafetyVideoAlternates = [
  ...fireSafetyLanguages.map(({ code, videoPath }) => ({ code, path: videoPath })),
  { code: 'x-default', path: fireSafetyEnglishVideoPath },
];
