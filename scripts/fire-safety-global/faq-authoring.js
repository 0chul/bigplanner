import { readFileSync } from 'node:fs';
import {
  facilitiesHandoverPath,
  fireSafetyChecklistPath,
  fireSafetyEnglishDemoPath,
  fireSafetyEnglishFaqPath,
  fireSafetyEnglishFeedPath,
  fireSafetyEnglishPath,
  fireSafetyEnglishVideoPath,
  fireSafetyKoreanFaqPath,
  fireSafetyKoreanFeedPath,
  fireSafetyKoreanVideoPath,
  fireSafetyPath,
  siteOrigin,
} from '../../src/utils/fireSafetyLocales.js';
import { escapeHtml, renderPageShare, shareAssets } from './sharing.js';

const pages = [
  {
    code: 'ko', locale: 'ko_KR', path: fireSafetyKoreanFaqPath, product: fireSafetyPath,
    feed: fireSafetyKoreanFeedPath, video: fireSafetyKoreanVideoPath, handover: fireSafetyChecklistPath,
    request: fireSafetyPath, campaign: 'fire_safety_launch', fragment: '#demo-request',
    rssLabel: '시설관리 자료 RSS', privacy: '개인정보처리방침',
    exampleLabels: ['입주사 질문', '답변 예시', '근거 문서', '담당자 전달 조건'],
  },
  {
    code: 'en', locale: 'en_US', path: fireSafetyEnglishFaqPath, product: fireSafetyEnglishPath,
    feed: fireSafetyEnglishFeedPath, video: fireSafetyEnglishVideoPath, handover: facilitiesHandoverPath,
    request: fireSafetyEnglishDemoPath, campaign: 'fire_safety_global', fragment: '',
    rssLabel: 'Facilities resources RSS', privacy: 'Privacy policy (Korean)',
    exampleLabels: ['Tenant question', 'Example answer', 'Policy source', 'When to hand off'],
  },
];
export const faqWorksheetName = 'building-faq-worksheet.xlsx';

export function renderFaqManualPages(styles) {
  return new Map(pages.map((page, index) => {
    const { code, locale, path, product, feed, video, handover, request, campaign, fragment, rssLabel, privacy, exampleLabels } = page;
    const copy = JSON.parse(readFileSync(new URL(`./faq-authoring/${code}.json`, import.meta.url), 'utf8'));
    const other = pages[1 - index];
    const canonical = siteOrigin + path;
    const requestUrl = `${request}?utm_source=faq_manual_guide&utm_medium=referral&utm_campaign=${campaign}&utm_content=${code}${fragment}`;
    const exampleValues = [copy.example.question, copy.example.answer, copy.example.rule, copy.example.handoff];
    return [`${path}index.html`, `<!doctype html>
<html lang="${code}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(copy.metaTitle)}</title>
  <meta name="description" content="${escapeHtml(copy.description)}">
  <link rel="canonical" href="${canonical}">
  <link rel="alternate" hreflang="ko" href="${siteOrigin + fireSafetyKoreanFaqPath}">
  <link rel="alternate" hreflang="en" href="${siteOrigin + fireSafetyEnglishFaqPath}">
  <link rel="alternate" hreflang="x-default" href="${siteOrigin + fireSafetyEnglishFaqPath}">
  <link rel="alternate" type="application/rss+xml" title="${rssLabel}" href="${siteOrigin + feed}">
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="BigPlanner Partners">
  <meta property="og:locale" content="${locale}">
  <meta property="og:title" content="${escapeHtml(copy.title)}">
  <meta property="og:description" content="${escapeHtml(copy.description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${siteOrigin}/images/fire-safety-organic-og.jpg">
  <meta name="twitter:card" content="summary_large_image">
  ${shareAssets}
  <style>${styles}
    .manual { width: min(52rem, 100% - 2.5rem); margin-inline: auto; }
    html[lang="ko"] .manual { word-break: keep-all; }
    .manual section { padding-block: 1.7rem; border-block-end: 1px solid var(--rule); }
    .manual h2 { margin-block: 0 .7rem; }
    .manual-body { padding-block-end: 2rem; }
    .manual-steps { padding-inline-start: 1.3rem; }
    .manual-steps li { padding-inline-start: .3rem; margin-block-end: .9rem; }
    .manual-steps h3, .manual-steps p { margin: 0; }
    .manual-example { margin-block-end: 0; padding: .65rem 1rem; border-radius: .5rem; background: var(--paper); }
    .manual-example > div { display: grid; grid-template-columns: minmax(0, 10rem) 1fr; gap: .45rem; padding-block: .5rem; }
    .manual-example > div + div { border-block-start: 1px solid var(--rule); }
    .manual-example dt { font-weight: 650; }
    .manual-example dd { margin: 0; }
    .manual-review, .manual-sources { padding-inline-start: 1.35rem; }
    .manual-review li + li { margin-block-start: .45rem; }
    .manual-sources { font-size: .925rem; }
    @media (max-width: 33rem) {
      .manual-example > div { grid-template-columns: 1fr; gap: .12rem; }
      .manual { width: min(52rem, 100% - 2rem); }
      .manual h1 { max-width: 100%; }
    }
  </style>
</head>
<body>
  <header class="site-header">
    <div class="manual header-content">
      <a class="brand" href="${product}" lang="en">BigPlanner <span>Partners</span></a>
      <nav class="languages" aria-label="${escapeHtml(copy.languageLabel)}"><a href="${other.path}" lang="${other.code}" hreflang="${other.code}">${escapeHtml(copy.otherLanguage)}</a></nav>
    </div>
  </header>
  <main>
    <section class="hero" aria-labelledby="page-title">
      <div class="manual section">
        <h1 id="page-title">${escapeHtml(copy.heading)}</h1>
        <p class="intro">${escapeHtml(copy.intro)}</p>
        <div class="links">
          <a class="button" href="${faqWorksheetName}" download>${escapeHtml(copy.download)}</a>
          <a href="${handover}">${escapeHtml(copy.handover)}</a>
        </div>
        ${renderPageShare(code, copy.title, canonical, copy.share.email, copy.share)}
      </div>
    </section>
    <div class="manual manual-body">
      <section aria-labelledby="steps-title">
        <h2 id="steps-title">${escapeHtml(copy.headings.steps)}</h2>
        <ol class="manual-steps">
          ${copy.steps.map(({ title, body }) => `<li><h3>${escapeHtml(title)}</h3><p>${escapeHtml(body)}</p></li>`).join('\n          ')}
        </ol>
      </section>
      <section aria-labelledby="example-title">
        <h2 id="example-title">${escapeHtml(copy.headings.example)}</h2>
        <p>${escapeHtml(copy.example.intro)}</p>
        <dl class="manual-example">
          ${exampleValues.map((entry, i) => `<div><dt>${exampleLabels[i]}</dt><dd>${escapeHtml(entry)}</dd></div>`).join('\n          ')}
        </dl>
      </section>
      <section aria-labelledby="review-title">
        <h2 id="review-title">${escapeHtml(copy.headings.review)}</h2>
        <ul class="manual-review">
          ${copy.review.map((item) => `<li>${escapeHtml(item)}</li>`).join('\n          ')}
        </ul>
        <ul class="manual-sources">
          ${copy.resources.map(({ label, url }) => `<li><a href="${escapeHtml(url)}">${escapeHtml(label)}</a></li>`).join('\n          ')}
        </ul>
        <div class="links">
          <a class="button" href="${escapeHtml(requestUrl)}">${escapeHtml(copy.request)}</a>
          <a href="${video}">${escapeHtml(copy.watch)}</a>
        </div>
      </section>
    </div>
  </main>
  <footer><div class="wrap"><span lang="en">BigPlanner Partners</span><a href="${feed}" type="application/rss+xml">${rssLabel}</a><a href="/privacy/" hreflang="ko">${privacy}</a></div></footer>
</body>
</html>
`];
  }));
}
