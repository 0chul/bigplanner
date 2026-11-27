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
export const fireSafetyEnglishAdoptionPath = `${fireSafetyEnglishPath}adoption-guide/`;
export const fireSafetyKoreanAfterHoursPath = `${fireSafetyPath}after-hours-hvac-request/`;
export const fireSafetyEnglishAfterHoursPath = `${fireSafetyEnglishPath}after-hours-hvac-request/`;
export const fireSafetyKoreanOverviewPdf = `${fireSafetyPath}facilities-ai-overview.pdf`;
export const fireSafetyEnglishOverviewPdf = `${fireSafetyEnglishPath}facilities-ai-overview.pdf`;
export const fireSafetyKoreanPilotKitPath = `${fireSafetyPath}facilities-pilot-kit-ko.zip`;
export const fireSafetyEnglishPilotKitPath = `${fireSafetyEnglishPath}facilities-pilot-kit-en.zip`;
export const fireSafetyKoreanFaqPath = `${fireSafetyPath}faq-manual/`;
export const fireSafetyEnglishFaqPath = `${fireSafetyEnglishPath}faq-manual/`;
export const fireSafetyKoreanResourcesPath = `${fireSafetyPath}resources/`;
export const fireSafetyEnglishResourcesPath = `${fireSafetyEnglishPath}resources/`;
export const fireSafetyKoreanWorkloadPath = `${fireSafetyPath}workload-calculator/`;
export const fireSafetyEnglishWorkloadPath = `${fireSafetyEnglishPath}workload-calculator/`;
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
  { code: 'fi', label: 'Suomi', path: `${fireSafetyPath}fi/`, locale: 'fi_FI' },
  { code: 'it', label: 'Italiano', path: `${fireSafetyPath}it/`, locale: 'it_IT' },
  { code: 'he', label: 'עברית', path: `${fireSafetyPath}he/`, locale: 'he_IL', direction: 'rtl' },
  { code: 'es', label: 'Español', path: `${fireSafetyPath}es/`, locale: 'es_ES' },
  { code: 'is', label: 'Íslenska', path: `${fireSafetyPath}is/`, locale: 'is_IS' },
].map((language) => ({
  ...language,
  handoverPath: language.code === 'ko' ? fireSafetyChecklistPath : `${language.path}shift-handover/`,
  videoPath: `${language.path}demo-video/`,
  feedPath: `${language.path}rss.xml`,
  resourcesPath: `${language.path}resources/`,
  workloadPath: `${language.path}workload-calculator/`,
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
export const fireSafetyWorkloadAlternates = [
  ...fireSafetyLanguages.map(({ code, workloadPath }) => ({ code, path: workloadPath })),
  { code: 'x-default', path: fireSafetyEnglishWorkloadPath },
];
export const fireSafetyResourcesAlternates = [
  ...fireSafetyLanguages.map(({ code, resourcesPath }) => ({ code, path: resourcesPath })),
  { code: 'x-default', path: fireSafetyEnglishResourcesPath },
];
