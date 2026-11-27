import { readFileSync } from 'node:fs';
import { fireSafetyLanguages, siteOrigin } from '../../src/utils/fireSafetyLocales.js';
import { escapeHtml, renderPageShare, shareAssets } from './sharing.js';
import { readWorkloadCopy } from './workload-calculator.js';

const downloadName = 'maintenance-request-form.txt';
export const maintenanceRequestLanguages = fireSafetyLanguages.map(language => ({
  ...language,
  maintenancePath: `${language.path}maintenance-request-form/`,
}));

const styles = `
.intake-page { width: min(54rem, 100% - 2rem); margin-inline: auto; }
.intake-page:lang(ko) { word-break: keep-all; }
.intake-page h1 { font-size: clamp(1.95rem, 5vw, 3.35rem); max-width: 27ch; }
.intake-page h2 { font-size: clamp(1.4rem, 3.5vw, 2rem); }
.intake-page section { padding-block: clamp(1.25rem, 4vw, 2.4rem); }
.intake-page section + section { border-block-start: 1px solid var(--rule); }
.intake-page section > p { max-width: 66ch; margin-block-start: .55rem; }
.intake-notice { padding: .7rem .9rem; border-inline-start: 3px solid var(--green); background: var(--paper); }
.intake-fields { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .7rem; margin-block: 1.05rem 0; }
.intake-fields > div { padding: .65rem .8rem; border: 1px solid var(--rule); border-radius: .35rem; break-inside: avoid; }
.intake-fields dt { font-weight: 650; line-height: 1.35; }
.intake-fields dd { margin: .35rem 0 0; }
.intake-blank dd { min-height: 1.55rem; border-block-end: 1px solid var(--rule); }
.intake-print { font: inherit; color: var(--green); background: white; border: 1px solid var(--rule); border-radius: .4rem; padding: .65rem .95rem; cursor: pointer; }
.intake-print:focus-visible { outline: 3px solid #367e71; outline-offset: 4px; }
@media screen and (max-width: 38rem) {
  .intake-fields { grid-template-columns: minmax(0, 1fr); }
}
@page { margin: 13mm; }
@media print {
  .site-header, .intake-intro, .intake-example, .intake-next, .intake-actions, footer { display: none; }
  .intake-page { width: 100%; font-size: 11pt; }
  .intake-page .intake-form { padding: 0; border: 0; }
  .intake-fields { gap: 4mm; }
  .intake-blank dd { min-height: 16mm; }
}
`;

function readCopy(code) {
  const copy = JSON.parse(readFileSync(new URL(`./maintenance-intake/${code.toLowerCase()}.json`, import.meta.url), 'utf8'));
  if (!Array.isArray(copy.fields) || copy.fields.length !== 8 ||
      copy.fields.some(field => !Array.isArray(field) || field.length !== 2 || field.some(value => typeof value !== 'string' || !value.trim()))) {
    throw new Error(`Invalid maintenance request fields for ${code}`);
  }
  return copy;
}

export function maintenanceRequestResource(code) {
  const language = maintenanceRequestLanguages.find(item => item.code === code);
  if (!language) return null;
  const copy = readCopy(code);
  return {
    url: language.maintenancePath,
    title: copy.title,
    detail: copy.description,
    download: { url: language.maintenancePath + downloadName, label: copy.download },
  };
}

function renderPage(language, copy, baseStyles) {
  const { code, label, locale, direction = 'ltr', path, maintenancePath, resourcesPath, handoverPath, adoptionPath, videoPath, feedPath } = language;
  const canonical = siteOrigin + maintenancePath;
  const { share, request } = readWorkloadCopy(code);
  const requestPath = code === 'ko' ? path : `${path}request/`;
  const campaign = code === 'ko' ? 'fire_safety_launch' : 'fire_safety_global';
  const fragment = code === 'ko' ? '#demo-request' : '';
  const demoRequestUrl = `${requestPath}?utm_source=maintenance_request_form&utm_medium=referral&utm_campaign=${campaign}&utm_content=${code.toLowerCase()}${fragment}`;
  const english = maintenanceRequestLanguages.find(item => item.code === 'en').maintenancePath;
  const linkTags = [...maintenanceRequestLanguages, { code: 'x-default', maintenancePath: english }]
    .map(item => `  <link rel="alternate" hreflang="${item.code}" href="${siteOrigin + item.maintenancePath}">`).join('\n');
  const navigation = maintenanceRequestLanguages.map(item =>
    `<a href="${item.maintenancePath}" lang="${item.code}" hreflang="${item.code}" dir="auto"${item.code === code ? ' aria-current="page"' : ''}>${escapeHtml(item.label)}</a>`).join('\n        ');
  const renderFields = blank => copy.fields.map(([field, value]) =>
    `<div><dt>${escapeHtml(field)}</dt><dd${blank ? ' aria-hidden="true"' : ''}>${blank ? '' : escapeHtml(value)}</dd></div>`).join('\n        ');
  const title = escapeHtml(copy.title);
  const description = escapeHtml(copy.description);
  return `<!doctype html>
<html lang="${code}" dir="${direction}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title} | BigPlanner Partners</title>
  <meta name="description" content="${description}">
  <link rel="canonical" href="${canonical}">
${linkTags}
  <link rel="alternate" type="application/rss+xml" title="RSS (${escapeHtml(label)})" href="${siteOrigin + feedPath}">
  <meta property="og:type" content="article">
  <meta property="og:locale" content="${locale}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${siteOrigin}/images/fire-safety-organic-og.jpg">
  <meta name="twitter:card" content="summary_large_image">
  ${shareAssets}
  <style>${baseStyles}${styles}</style>
</head>
<body>
  <header class="site-header">
    <div class="wrap header-content">
      <a class="brand" href="${resourcesPath}" lang="en" dir="ltr">BigPlanner <span>Partners</span></a>
      <nav class="languages" aria-label="${escapeHtml(copy.languageLabel)}">
        ${navigation}
      </nav>
    </div>
  </header>
  <main class="intake-page">
    <section class="intake-intro" aria-labelledby="page-title">
      <h1 id="page-title">${title}</h1>
      <p>${description}</p>
    </section>
    <section class="intake-form" id="blank-form" aria-labelledby="fields-title">
      <h2 id="fields-title">${escapeHtml(copy.fieldsTitle)}</h2>
      <p>${escapeHtml(copy.intro)}</p>
      <p class="intake-notice">${escapeHtml(copy.emergency)}</p>
      <div class="intake-actions">
        <div class="links">
          <a class="button" href="${maintenancePath + downloadName}" download>${escapeHtml(copy.download)}</a>
          <button type="button" class="intake-print" hidden>${escapeHtml(copy.print)}</button>
        </div>
        ${renderPageShare(code, copy.title, canonical, share.email, share)}
      </div>
      <dl class="intake-fields intake-blank">
        ${renderFields(true)}
      </dl>
    </section>
    <section class="intake-example" aria-labelledby="example-title">
      <h2 id="example-title">${escapeHtml(copy.exampleTitle)}</h2>
      <p>${escapeHtml(copy.exampleNote)}</p>
      <dl class="intake-fields">
        ${renderFields(false)}
      </dl>
    </section>
    <section class="intake-next" aria-labelledby="next-title">
      <h2 id="next-title">${escapeHtml(copy.nextTitle)}</h2>
      <p>${escapeHtml(copy.nextText)}</p>
      <div class="links">
        <a href="${handoverPath}">${escapeHtml(copy.handover)}</a>
        <a href="${adoptionPath}">${escapeHtml(copy.pilot)}</a>
        <a href="${videoPath}">${escapeHtml(copy.demo)}</a>
        <a href="${escapeHtml(demoRequestUrl)}">${escapeHtml(request)}</a>
      </div>
    </section>
  </main>
  <footer><div class="wrap">
    <span lang="en" dir="ltr">BigPlanner Partners</span><a href="${resourcesPath}">${escapeHtml(copy.library)}</a>
  </div></footer>
  <script>
    const button = document.querySelector('.intake-print');
    button.addEventListener('click', () => window.print());
    button.hidden = false;
  </script>
</body>
</html>
`;
}

export function renderMaintenanceRequestPages(baseStyles) {
  return maintenanceRequestLanguages.flatMap(language => {
    const copy = readCopy(language.code);
    const plain = [copy.title, copy.intro, copy.emergency,
      ...copy.fields.map(([field]) => `${field}\n_______________________________________________`),
    ].join('\n\n');
    return [
      [`${language.maintenancePath}index.html`, renderPage(language, copy, baseStyles)],
      [language.maintenancePath + downloadName, `${plain}\n`],
    ];
  });
}
