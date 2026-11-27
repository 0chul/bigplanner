import {
  facilitiesHandoverPath,
  fireSafetyAdoptionPath,
  fireSafetyChecklistPath,
  fireSafetyEnglishAfterHoursPath,
  fireSafetyEnglishFaqPath,
  fireSafetyEnglishFeedPath,
  fireSafetyEnglishOverviewPdf,
  fireSafetyEnglishPath,
  fireSafetyEnglishResourcesPath,
  fireSafetyEnglishVideoPath,
  fireSafetyKoreanAfterHoursPath,
  fireSafetyKoreanFaqPath,
  fireSafetyKoreanFeedPath,
  fireSafetyKoreanOverviewPdf,
  fireSafetyKoreanResourcesPath,
  fireSafetyKoreanVideoPath,
  fireSafetyLanguages,
  fireSafetyPath,
  fireSafetyTranslations,
  siteOrigin,
} from '../../src/utils/fireSafetyLocales.js';
import { faqWorksheetName } from './faq-authoring.js';
import { escapeHtml, renderPageShare, shareAssets } from './sharing.js';

const artworkPath = '/images/fire-safety-building.webp';
const rssType = 'application/rss+xml';
const libraryAlternates = [
  ['ko', fireSafetyKoreanResourcesPath],
  ['en', fireSafetyEnglishResourcesPath],
  ['x-default', fireSafetyEnglishResourcesPath],
];

const libraries = [
  {
    code: 'ko', locale: 'ko_KR', path: fireSafetyKoreanResourcesPath, product: fireSafetyPath,
    otherCode: 'en', otherLabel: 'English', otherPath: fireSafetyEnglishResourcesPath,
    feed: fireSafetyKoreanFeedPath, brand: '빅플래너파트너스',
    title: '시설관리 운영 자료',
    intro: '입주사 민원 접수, FAQ 매뉴얼 작성, 교대 인계에 쓰는 무료 양식과 시연 자료입니다.',
    cardsHeading: '체크리스트와 시연 자료',
    languagesHeading: '언어별 제품과 자료',
    languageLinks: ['제품 소개', '시연 영상', '교대 인계', '시연 신청'],
    privacy: '개인정보 처리방침',
    emailShare: '이메일로 공유',
    shareCopy: {
      summary: '링크 공유', address: '페이지 주소', native: '앱으로 공유', copy: '링크 복사',
      copied: '링크를 복사했습니다.', manual: '위 주소를 선택해 복사해 주세요.',
    },
    resources: [
      { url: fireSafetyChecklistPath, title: '교대 인계 체크리스트', detail: '접수 위치, 담당자와 다음 확인 시점을 같은 기록에 남깁니다.',
        download: { url: `${fireSafetyChecklistPath}handoff-log.xlsx`, label: '교대 인계대장 엑셀 다운로드' } },
      { url: fireSafetyKoreanFaqPath, title: 'FAQ 매뉴얼 작성 양식', detail: '반복 문의의 답변 근거와 적용 범위를 정리하고 현장 책임자 승인을 기록합니다.',
        download: { url: fireSafetyKoreanFaqPath + faqWorksheetName, label: 'FAQ 작성용 엑셀 다운로드' } },
      { url: fireSafetyKoreanAfterHoursPath, title: '야간·휴일 냉난방 연장 운전 신청서', detail: '요청 구역과 사용 시간, 확인이 필요한 조건을 정리합니다.' },
      { url: fireSafetyKoreanVideoPath, title: '27초 냉방 민원 시연', detail: '가상 냉방 민원의 접수부터 담당자 배정과 교대 인계까지 확인합니다.' },
      { url: fireSafetyKoreanOverviewPdf, title: '방재실 AI 소개서 (PDF)', detail: '업무 흐름과 내부 실증 범위를 담은 한 장의 자료를 동료와 공유하세요.' },
      { url: fireSafetyAdoptionPath, title: '시설관리 도입 체크리스트', detail: '현재 운영 방식과 승인 역할, 연동 범위 및 시범 적용 항목을 점검합니다.' },
    ],
  },
  {
    code: 'en', locale: 'en_US', path: fireSafetyEnglishResourcesPath, product: fireSafetyEnglishPath,
    otherCode: 'ko', otherLabel: '한국어', otherPath: fireSafetyKoreanResourcesPath,
    feed: fireSafetyEnglishFeedPath, brand: 'BigPlanner Partners',
    title: 'Facilities operations resources',
    intro: 'Free templates and a short demo for managing tenant requests, writing building FAQs and handing over work between shifts.',
    cardsHeading: 'Templates and demos',
    languagesHeading: 'Product and resources by language',
    languageLinks: ['Product', 'Demo video', 'Handover guide', 'Request a demo'],
    privacy: 'Privacy policy (Korean)',
    emailShare: 'Share by email',
    resources: [
      { url: facilitiesHandoverPath, title: 'Shift handover checklist', detail: 'Pass open requests to the next shift with the exact location, responsible person and next check.',
        download: { url: `${facilitiesHandoverPath}facilities-shift-handover-log.xlsx`, label: 'Download the handover Excel log' } },
      { url: fireSafetyEnglishFaqPath, title: 'Building FAQ worksheet', detail: 'Draft routine answers, cite the governing building manual and record on-site approval.',
        download: { url: fireSafetyEnglishFaqPath + faqWorksheetName, label: 'Download the FAQ Excel worksheet' } },
      { url: fireSafetyEnglishAfterHoursPath, title: 'After-hours HVAC request form', detail: 'Record the area, operating hours requested and details for facilities staff to check.' },
      { url: fireSafetyEnglishVideoPath, title: '27-second cooling request demo', detail: 'Follow a simulated cooling issue across intake, assignment and handover. Korean interface with English captions.' },
      { url: fireSafetyEnglishOverviewPdf, title: 'Facilities AI overview (PDF)', detail: 'Forward a one-page summary of the workflow and the internal pilot sample.' },
      { url: fireSafetyAdoptionPath, title: 'Facilities adoption checklist (Korean)', language: 'ko', detail: 'Review operating procedures, approval roles, integrations and pilot scope.' },
    ],
  },
];

const libraryStyles = `
.library-lead { background: var(--paper); border-block-end: 1px solid var(--rule); }
.library-lead-inner { display: grid; grid-template-columns: minmax(0, 1.15fr) minmax(0, .9fr); align-items: center; gap: clamp(1.4rem, 5vw, 4rem); padding-block: clamp(1.8rem, 5vw, 3.5rem); }
.library-lead h1 { max-width: 20ch; font-size: clamp(2.05rem, 5vw, 3.65rem); }
.library-lead .intro { color: var(--muted); margin-block: .9rem; }
.library-lead-image { display: block; width: 100%; height: auto; border-radius: .6rem; }
.library-section { padding-block: clamp(1.75rem, 4vw, 3.25rem); }
:lang(ko):is(.library-lead, .library-section) { word-break: keep-all; }
.library-section + .library-section { border-block-start: 1px solid var(--rule); }
.library-grid, .library-languages { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1rem; padding: 0; margin: 1.05rem 0 0; list-style: none; }
.library-card { height: 100%; padding: clamp(.95rem, 2.2vw, 1.45rem); border: 1px solid var(--rule); border-block-start: 2px solid var(--green); border-radius: .45rem; }
.library-card h3 { font-size: 1.13rem; }
.library-card p { margin-block: .48rem 0; color: var(--muted); }
.library-card a[download] { display: inline-flex; align-items: center; min-height: 2.75rem; margin-block-start: .15rem; font-size: .94rem; }
.library-languages { gap: 0 1.3rem; }
.library-language { padding-block: .75rem .5rem; border-block-start: 1px solid var(--rule); }
.library-language h3 { font-size: 1.08rem; }
.library-language-links { display: flex; flex-wrap: wrap; gap: 0 .65rem; }
.library-language-links a { display: inline-flex; align-items: center; min-height: 2.75rem; font-size: .9rem; }
.library-footer { border-block-start: 1px solid var(--rule); }
.library-footer nav { display: flex; flex-wrap: wrap; gap: .6rem 1.1rem; }
@media (max-width: 57rem) {
  .library-grid, .library-languages { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 38rem) {
  .library-lead-inner, .library-grid, .library-languages { grid-template-columns: minmax(0, 1fr); }
  .library-lead-image { display: none; }
}
`;

function renderResource({ url, title, detail, download, language }) {
  return `<li><article class="library-card">
          <h3><a href="${escapeHtml(url)}"${language ? ` hreflang="${language}"` : ''}>${escapeHtml(title)}</a></h3>
          <p>${escapeHtml(detail)}</p>
          ${download ? `<a href="${escapeHtml(download.url)}" download>${escapeHtml(download.label)}</a>` : ''}
        </article></li>`;
}

function renderLanguage(language, labels, requests) {
  const { code, label, path, videoPath, handoverPath, feedPath } = language;
  const requestPath = code === 'ko' ? `${path}#demo-request` : requests.get(code);
  if (!requestPath) throw new Error(`Missing resource library request route for ${code}`);
  const links = [path, videoPath, handoverPath, requestPath].map((url, index) => {
    const text = labels[index];
    return `<a href="${escapeHtml(url)}" hreflang="${code}" aria-label="${escapeHtml(`${text} (${label})`)}">${escapeHtml(text)}</a>`;
  }).join('\n            ');
  return `<li class="library-language">
          <h3><bdi lang="${code}">${escapeHtml(label)}</bdi></h3>
          <div class="library-language-links">
            ${links}
            <a href="${escapeHtml(feedPath)}" type="${rssType}" hreflang="${code}" aria-label="${escapeHtml(`RSS (${label})`)}">RSS</a>
          </div>
        </li>`;
}

function renderLibrary(copy, styles, requests) {
  const canonical = siteOrigin + copy.path;
  const title = escapeHtml(copy.title);
  const description = escapeHtml(copy.intro);
  const brand = escapeHtml(copy.brand);
  const alternates = libraryAlternates.map(([code, route]) =>
    `  <link rel="alternate" hreflang="${code}" href="${siteOrigin}${route}">`).join('\n');
  const cards = copy.resources.map(renderResource).join('\n        ');
  const languages = fireSafetyLanguages.map((language) => renderLanguage(language, copy.languageLinks, requests)).join('\n        ');

  return `<!doctype html>
<html lang="${copy.code}" dir="ltr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title} | ${brand}</title>
  <meta name="description" content="${description}">
  <link rel="canonical" href="${canonical}">
${alternates}
  <link rel="alternate" type="${rssType}" title="${title} RSS" href="${siteOrigin}${copy.feed}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="BigPlanner Partners">
  <meta property="og:locale" content="${copy.locale}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${siteOrigin}${artworkPath}">
  <meta name="twitter:card" content="summary_large_image">
  ${shareAssets}
  <style>${styles}${libraryStyles}</style>
</head>
<body>
  <header class="site-header">
    <div class="wrap header-content">
      <a class="brand" href="${copy.product}">${brand}</a>
      <a href="${copy.otherPath}" lang="${copy.otherCode}" hreflang="${copy.otherCode}">${copy.otherLabel}</a>
    </div>
  </header>
  <main>
    <section class="library-lead" aria-labelledby="resources-title">
      <div class="wrap library-lead-inner">
        <div>
          <h1 id="resources-title">${title}</h1>
          <p class="intro">${description}</p>
          ${renderPageShare(copy.code, copy.title, canonical, copy.emailShare, copy.shareCopy)}
        </div>
        <img class="library-lead-image" src="${artworkPath}" width="1672" height="941" alt="">
      </div>
    </section>
    <section class="wrap library-section" aria-labelledby="library-files">
      <h2 id="library-files">${escapeHtml(copy.cardsHeading)}</h2>
      <ul class="library-grid" role="list">
        ${cards}
      </ul>
    </section>
    <section class="wrap library-section" aria-labelledby="library-languages">
      <h2 id="library-languages">${escapeHtml(copy.languagesHeading)}</h2>
      <ul class="library-languages" role="list">
        ${languages}
      </ul>
    </section>
  </main>
  <footer class="library-footer">
    <div class="wrap">
      <span>${brand}</span>
      <nav>
        <a href="${fireSafetyKoreanFeedPath}" type="${rssType}" lang="ko" hreflang="ko">한국어 RSS</a>
        <a href="${fireSafetyEnglishFeedPath}" type="${rssType}" lang="en" hreflang="en">English RSS</a>
        <a href="/privacy/" hreflang="ko">${escapeHtml(copy.privacy)}</a>
      </nav>
    </div>
  </footer>
</body>
</html>
`;
}

export function renderFacilityResourcePages(styles) {
  const requests = new Map(fireSafetyTranslations.map(({ code, requestPath }) => [code, requestPath]));
  return new Map(libraries.map((copy) => [`${copy.path}index.html`, renderLibrary(copy, styles, requests)]));
}
