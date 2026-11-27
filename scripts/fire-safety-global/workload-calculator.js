import { readFileSync } from 'node:fs';
import {
  fireSafetyEnglishDemoPath,
  fireSafetyEnglishFaqPath,
  fireSafetyEnglishFeedPath,
  fireSafetyEnglishPath,
  fireSafetyEnglishVideoPath,
  fireSafetyEnglishWorkloadPath,
  fireSafetyKoreanFaqPath,
  fireSafetyKoreanFeedPath,
  fireSafetyKoreanVideoPath,
  fireSafetyKoreanWorkloadPath,
  fireSafetyPath,
  siteOrigin,
} from '../../src/utils/fireSafetyLocales.js';
import { escapeHtml, renderPageShare, shareAssets } from './sharing.js';

const pages = [
  {
    code: 'ko', locale: 'ko_KR', path: fireSafetyKoreanWorkloadPath, product: fireSafetyPath,
    faq: fireSafetyKoreanFaqPath, video: fireSafetyKoreanVideoPath, feed: fireSafetyKoreanFeedPath,
    request: fireSafetyPath, campaign: 'fire_safety_launch', fragment: '#demo-request',
    rssLabel: '시설관리 자료 RSS', privacy: '개인정보처리방침',
    enableScripts: '값을 바꿔 계산하려면 자바스크립트를 켜 주세요.',
  },
  {
    code: 'en', locale: 'en_US', path: fireSafetyEnglishWorkloadPath, product: fireSafetyEnglishPath,
    faq: fireSafetyEnglishFaqPath, video: fireSafetyEnglishVideoPath, feed: fireSafetyEnglishFeedPath,
    request: fireSafetyEnglishDemoPath, campaign: 'fire_safety_global', fragment: '',
    rssLabel: 'Facilities resources RSS', privacy: 'Privacy policy (Korean)',
    enableScripts: 'Enable JavaScript to calculate with your own figures.',
  },
];

const inputs = [
  { name: 'requests', max: 100000, step: 1, value: 20 },
  { name: 'minutes', max: 1440, step: 0.1, value: 2 },
  { name: 'days', max: 31, step: 1, value: 22 },
  { name: 'eligible', max: 100, step: 1, value: 60 },
];

const examples = [
  { name: 'baseline', value: 14.7, unit: 'hours' },
  { name: 'review', value: 8.8, unit: 'hours' },
  { name: 'requests', value: 264, unit: 'cases' },
];

export function renderWorkloadCalculatorPages(styles) {
  return new Map(pages.map((page, index) => {
    const { code, locale, path, product, faq, video, feed, request, campaign, fragment, rssLabel, privacy, enableScripts } = page;
    const copy = JSON.parse(readFileSync(new URL(`./workload-calculator/${code}.json`, import.meta.url), 'utf8'));
    const other = pages[1 - index];
    const canonical = siteOrigin + path;
    const title = escapeHtml(`${copy.pageTitle} | BigPlanner Partners`);
    const description = escapeHtml(copy.description);
    const numberFormat = new Intl.NumberFormat(code);
    const requestUrl = `${request}?utm_source=workload_calculator&utm_medium=referral&utm_campaign=${campaign}&utm_content=${code}${fragment}`;
    const fields = inputs.map(({ name, max, step, value }) => `
              <label>
                <span>${escapeHtml(copy.fields[name])}</span>
                <input type="number" inputmode="${step === 1 ? 'numeric' : 'decimal'}" name="${name}" min="0" max="${max}" step="${step}" value="${value}" required aria-describedby="${name}-range">
                <small id="${name}-range">0–${numberFormat.format(max)}</small>
              </label>`).join('');
    const results = examples.map(({ name, value, unit }) => `
              <div>
                <dt>${escapeHtml(copy.result[name])}</dt>
                <dd><strong data-workload-result="${name}">${numberFormat.format(value)}</strong> ${escapeHtml(copy.result[unit])}</dd>
              </div>`).join('');
    return [`${path}index.html`, `<!doctype html>
<html lang="${code}" dir="ltr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <link rel="canonical" href="${canonical}">
  <link rel="alternate" hreflang="ko" href="${siteOrigin + fireSafetyKoreanWorkloadPath}">
  <link rel="alternate" hreflang="en" href="${siteOrigin + fireSafetyEnglishWorkloadPath}">
  <link rel="alternate" hreflang="x-default" href="${siteOrigin + fireSafetyEnglishWorkloadPath}">
  <link rel="alternate" type="application/rss+xml" title="${rssLabel}" href="${siteOrigin + feed}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="BigPlanner Partners">
  <meta property="og:locale" content="${locale}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${siteOrigin}/images/fire-safety-organic-og.jpg">
  <meta name="twitter:card" content="summary_large_image">
  ${shareAssets}
  <script defer src="/fire-safety-ai/workload-calculator.js"></script>
  <style>${styles}
    .calculator-wrap { width: min(64rem, 100% - 2rem); margin-inline: auto; }
    html[lang="ko"] .calculator-wrap { word-break: keep-all; }
    .calculator-head { padding-block: clamp(1.9rem, 4vw, 3.6rem) 1.8rem; }
    .calculator-head h1 { max-width: 25ch; font-size: clamp(2rem, 4.8vw, 3.65rem); }
    .calculator-head .intro { max-width: 65ch; margin-block-end: 0; }
    .calculator-body { padding-block: 1.4rem 2.5rem; }
    .calculator-grid { display: grid; grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr); gap: 1.2rem; align-items: start; }
    .calculator-panel { min-width: 0; border: 1px solid var(--rule); border-radius: .75rem; padding: clamp(1rem, 2.6vw, 1.65rem); }
    .calculator-panel fieldset { padding: 0; margin: 0; border: 0; min-width: 0; }
    .calculator-panel legend, .calculator-panel h2 { margin: 0; padding: 0; font-size: 1.26rem; font-weight: 750; line-height: 1.3; }
    .calculator-fields { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .9rem 1rem; margin-block: 1.05rem; }
    .calculator-fields label { display: grid; grid-template-rows: 1fr auto auto; gap: .25rem; align-items: end; font-weight: 650; line-height: 1.4; }
    .calculator-fields small { font-size: .81rem; font-weight: 450; color: var(--muted); }
    .calculator-fields input { width: 100%; min-height: 2.8rem; border: 1px solid #839b90; border-radius: .38rem; padding: .45rem .62rem; color: var(--ink); background: #fff; font: inherit; font-variant-numeric: tabular-nums; }
    .calculator-fields input:focus-visible, .calculator-reset:focus-visible { outline: 3px solid #367e71; outline-offset: 2px; }
    .calculator-fields input:invalid { border-color: #a32727; }
    .calculator-fields input:disabled { background: var(--paper); }
    .calculator-reset { min-height: 2.75rem; border: 1px solid #839b90; border-radius: .38rem; padding: .35rem .75rem; background: #fff; color: var(--green); font: inherit; font-weight: 650; cursor: pointer; }
    .calculator-reset:hover { background: var(--paper); }
    .calculator-reset:disabled { color: var(--muted); cursor: default; }
    .calculator-invalid { color: #8e2626; margin-block: .65rem 0; }
    .calculator-results { background: var(--paper); }
    .calculator-results dl { margin: .7rem 0 .8rem; }
    .calculator-results dl > div { display: flex; flex-wrap: wrap; align-items: baseline; justify-content: space-between; gap: .05rem .75rem; padding: .5rem 0; border-block-end: 1px solid var(--rule); }
    .calculator-results dt { font-size: .95rem; }
    .calculator-results dd { color: var(--green); margin: 0; }
    .calculator-results strong { font-size: 1.55rem; line-height: 1.15; font-variant-numeric: tabular-nums; }
    .calculator-share-label { display: block; font-size: .85rem; color: var(--muted); }
    .calculator-results progress { display: block; width: 100%; margin-block-start: .25rem; accent-color: var(--green); }
    .calculator-example { color: var(--muted); font-size: .93rem; margin: .85rem 0 1.5rem; }
    .calculator-method { border-block-start: 1px solid var(--rule); padding-block-start: 1.5rem; }
    .calculator-method h2 { font-size: clamp(1.25rem, 2.6vw, 1.75rem); }
    .calculator-method ol { margin-block: .65rem; padding-inline-start: 1.4rem; max-width: 72ch; }
    .calculator-method li + li { margin-block-start: .42rem; }
    footer { border-block-start: 1px solid var(--rule); }
    @media (max-width: 46rem) {
      .calculator-grid { grid-template-columns: 1fr; gap: .9rem; }
    }
    @media (max-width: 25rem) {
      .calculator-fields { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <header class="site-header">
    <div class="calculator-wrap header-content">
      <a class="brand" href="${product}" lang="en">BigPlanner <span>Partners</span></a>
      <nav class="languages" aria-label="${escapeHtml(copy.languageLabel)}"><a href="${other.path}" lang="${other.code}" hreflang="${other.code}">${escapeHtml(copy.otherLanguage)}</a></nav>
    </div>
  </header>
  <main>
    <section class="hero" aria-labelledby="calculator-title">
      <div class="calculator-wrap calculator-head">
        <h1 id="calculator-title">${escapeHtml(copy.heading)}</h1>
        <p class="intro">${escapeHtml(copy.intro)}</p>
      </div>
    </section>
    <div class="calculator-wrap calculator-body">
      <div class="calculator-grid">
        <form class="calculator-panel" data-workload-form novalidate>
          <fieldset data-workload-fields disabled>
            <legend>${escapeHtml(copy.inputsHeading)}</legend>
            <div class="calculator-fields">${fields}
            </div>
            <button class="calculator-reset" type="button" data-workload-reset>${escapeHtml(copy.reset)}</button>
          </fieldset>
          <p class="calculator-invalid" data-workload-invalid role="status" hidden>${escapeHtml(copy.invalid)}</p>
          <noscript><p>${enableScripts}</p></noscript>
        </form>
        <section class="calculator-panel calculator-results" aria-labelledby="results-title">
          <h2 id="results-title">${escapeHtml(copy.resultsHeading)}</h2>
          <div aria-live="polite" aria-atomic="true">
            <dl>${results}
            </dl>
          </div>
          <span class="calculator-share-label" id="review-share">${escapeHtml(copy.result.share)}</span>
          <progress data-workload-share aria-labelledby="review-share" value="60" max="100"></progress>
        </section>
      </div>
      <p class="calculator-example">${escapeHtml(copy.example)}</p>
      <section class="calculator-method" aria-labelledby="method-title">
        <h2 id="method-title">${escapeHtml(copy.methodHeading)}</h2>
        <ol>
          ${copy.method.map(item => `<li>${escapeHtml(item)}</li>`).join('\n          ')}
        </ol>
        <div class="links">
          <a class="button" href="${escapeHtml(requestUrl)}">${escapeHtml(copy.request)}</a>
          <a href="${faq}">${escapeHtml(copy.readGuide)}</a>
          <a href="${video}">${escapeHtml(copy.watch)}</a>
        </div>
        ${renderPageShare(code, copy.pageTitle, canonical, copy.share.email, copy.share)}
      </section>
    </div>
  </main>
  <footer><div class="calculator-wrap header-content"><span lang="en">BigPlanner Partners</span><a href="${feed}" type="application/rss+xml">${rssLabel}</a><a href="/privacy/" hreflang="ko">${privacy}</a></div></footer>
</body>
</html>
`];
  }));
}
