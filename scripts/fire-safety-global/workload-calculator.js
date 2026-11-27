import { readFileSync } from 'node:fs';
import {
  fireSafetyEnglishFaqPath,
  fireSafetyKoreanFaqPath,
  fireSafetyLanguages,
  fireSafetyWorkloadAlternates,
  siteOrigin,
} from '../../src/utils/fireSafetyLocales.js';
import { escapeHtml, renderPageShare, shareAssets } from './sharing.js';

const faqPaths = { ko: fireSafetyKoreanFaqPath, en: fireSafetyEnglishFaqPath };

const inputs = [
  { name: 'requests', max: 100000, mode: 'numeric', value: 20 },
  { name: 'minutes', max: 1440, mode: 'decimal', value: 2 },
  { name: 'days', max: 31, mode: 'numeric', value: 22 },
  { name: 'eligible', max: 100, mode: 'numeric', value: 60 },
];

const examples = [
  { name: 'baseline', value: 14.7, unit: 'hours' },
  { name: 'review', value: 8.8, unit: 'hours' },
  { name: 'requests', value: 264, unit: 'cases' },
];

export function readWorkloadCopy(code) {
  return JSON.parse(readFileSync(new URL(`./workload-calculator/${code}.json`, import.meta.url), 'utf8'));
}

export function renderWorkloadCalculatorPages(styles) {
  const alternates = fireSafetyWorkloadAlternates.map(({ code, path }) =>
    `  <link rel="alternate" hreflang="${code}" href="${siteOrigin + path}">`).join('\n');
  return new Map(fireSafetyLanguages.map((language) => {
    const { code, label, locale, direction = 'ltr', path: product, workloadPath, videoPath, feedPath, handoverPath } = language;
    const copy = readWorkloadCopy(code);
    const canonical = siteOrigin + workloadPath;
    const title = escapeHtml(`${copy.pageTitle} | BigPlanner Partners`);
    const description = escapeHtml(copy.description);
    const numberLocale = locale.replace('_', '-');
    const numberFormat = new Intl.NumberFormat(numberLocale);
    const request = code === 'ko' ? product : `${product}request/`;
    const campaign = code === 'ko' ? 'fire_safety_launch' : 'fire_safety_global';
    const fragment = code === 'ko' ? '#demo-request' : '';
    const requestUrl = `${request}?utm_source=workload_calculator&utm_medium=referral&utm_campaign=${campaign}&utm_content=${code.toLowerCase()}${fragment}`;
    const navigation = fireSafetyLanguages.map(({ code: itemCode, label: itemLabel, workloadPath: itemPath }) =>
      `<a href="${itemPath}" hreflang="${itemCode}" lang="${itemCode}" dir="auto"${itemCode === code ? ' aria-current="page"' : ''}>${escapeHtml(itemLabel)}</a>`).join('\n            ');
    const fields = inputs.map(({ name, max, mode, value }) => `
              <label>
                <span>${escapeHtml(copy.fields[name])}</span>
                <input type="text" inputmode="${mode}" name="${name}" data-workload-max="${max}" value="${numberFormat.format(value)}" autocomplete="off" dir="auto" required aria-describedby="${name}-range">
                <small id="${name}-range"><bdi>${numberFormat.format(0)}–${numberFormat.format(max)}</bdi></small>
              </label>`).join('');
    const results = examples.map(({ name, value, unit }) => `
              <div>
                <dt>${escapeHtml(copy.result[name])}</dt>
                <dd><strong><bdi data-workload-result="${name}">${numberFormat.format(value)}</bdi></strong> ${escapeHtml(copy.result[unit])}</dd>
              </div>`).join('');
    const guidePath = faqPaths[code] ?? handoverPath;
    return [`${workloadPath}index.html`, `<!doctype html>
<html lang="${code}" dir="${direction}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <link rel="canonical" href="${canonical}">
${alternates}
  <link rel="alternate" type="application/rss+xml" title="${escapeHtml(copy.rssLabel)}" href="${siteOrigin + feedPath}">
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
    .site-header .calculator-wrap { position: relative; }
    .calculator-language summary { min-height: 2.75rem; align-content: center; padding-inline: .5rem; color: var(--green); cursor: pointer; }
    .calculator-language nav { position: absolute; z-index: 1; inset-block-start: calc(100% - .35rem); inset-inline-end: 0; width: min(22rem, 80vw); padding: .6rem; border: 1px solid var(--rule); border-radius: .5rem; background: #fff; box-shadow: 0 8px 24px #17302a15; }
    .calculator-language nav a { display: inline-flex; align-items: center; min-height: 2.75rem; }
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
    .calculator-fields input[aria-invalid="true"] { border-color: #a32727; }
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
      <details class="calculator-language">
        <summary aria-label="${escapeHtml(`${copy.languageLabel} · ${label}`)}"><bdi lang="${code}">${escapeHtml(label)}</bdi></summary>
        <nav class="languages" aria-label="${escapeHtml(copy.languageLabel)}">
            ${navigation}
        </nav>
      </details>
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
        <form class="calculator-panel" data-workload-form data-number-locale="${numberLocale}" novalidate>
          <fieldset data-workload-fields disabled>
            <legend>${escapeHtml(copy.inputsHeading)}</legend>
            <div class="calculator-fields">${fields}
            </div>
            <button class="calculator-reset" type="button" data-workload-reset>${escapeHtml(copy.reset)}</button>
          </fieldset>
          <p class="calculator-invalid" data-workload-invalid role="status" hidden>${escapeHtml(copy.invalid)}</p>
          <noscript><p>${escapeHtml(copy.enableScripts)}</p></noscript>
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
          <a href="${guidePath}">${escapeHtml(copy.readGuide)}</a>
          <a href="${videoPath}">${escapeHtml(copy.watch)}</a>
        </div>
        ${renderPageShare(code, copy.pageTitle, canonical, copy.share.email, copy.share)}
      </section>
    </div>
  </main>
  <footer><div class="calculator-wrap header-content"><span lang="en">BigPlanner Partners</span><a href="${feedPath}" type="application/rss+xml">${escapeHtml(copy.rssLabel)}</a><a href="/privacy/" hreflang="ko">${escapeHtml(copy.privacy)}</a></div></footer>
</body>
</html>
`];
  }));
}
