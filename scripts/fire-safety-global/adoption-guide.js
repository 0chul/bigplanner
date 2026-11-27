import { readFileSync } from 'node:fs';
import {
  fireSafetyAdoptionAlternates,
  fireSafetyEnglishFaqPath,
  fireSafetyLanguages,
  fireSafetyTranslations,
  siteOrigin,
} from '../../src/utils/fireSafetyLocales.js';
import { escapeHtml, renderPageShare, shareAssets } from './sharing.js';

const styles = readFileSync(new URL('./adoption-guide/pilot.css', import.meta.url), 'utf8');
const policyReference = 'https://www.gov.uk/government/publications/facilities-management-standards-for-govs-004-property/facilities-management-standard-001-management-and-services#access-to-fm-services';
const alternates = fireSafetyAdoptionAlternates.map(({ code, path }) =>
  `  <link rel="alternate" hreflang="${code}" href="${siteOrigin + path}">`).join('\n');

export function readAdoptionCopy(code) {
  return JSON.parse(readFileSync(new URL(`./adoption-guide/${code}.json`, import.meta.url), 'utf8'));
}

function renderAdoptionGuide(language, copy) {
  const { code, locale, path, adoptionPath, videoPath, requestPath, feedPath, handoverPath, workloadPath, resourcesPath } = language;
  const canonical = siteOrigin + adoptionPath;
  const title = escapeHtml(copy.title);
  const description = escapeHtml(copy.description);
  const shareDescription = escapeHtml(copy.shareDescription ?? copy.description);
  const request = escapeHtml(`${requestPath}?utm_source=adoption_guide&utm_medium=referral&utm_campaign=fire_safety_global&utm_content=${code}`);
  const resources = [handoverPath, fireSafetyEnglishFaqPath, workloadPath, resourcesPath];
  if (copy.scope.length !== 6 || copy.example.length !== 3 || copy.metrics.length !== 2 || copy.materials.length !== resources.length) {
    throw new Error(`Invalid facilities pilot checklist structure for ${code}`);
  }
  const languages = fireSafetyLanguages.filter((item) => item.adoptionPath && item.code !== code)
    .map((item) => `<a href="${item.adoptionPath}" lang="${item.code}" hreflang="${item.code}">${escapeHtml(item.label)}</a>`).join('\n      ');
  const checks = copy.scope.map(({ heading, text }) => `<article class="check">
            <h3><label><input type="checkbox">${escapeHtml(heading)}</label></h3>
            <p>${escapeHtml(text)}</p>
          </article>`).join('\n          ');
  const example = copy.example.map(({ label, value }) =>
    `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`).join('\n          ');
  const metrics = copy.metrics.map(({ title, text }) =>
    `<li><strong>${escapeHtml(title)}</strong> ${escapeHtml(text)}</li>`).join('\n          ');
  const materialLinks = resources.map((url, index) =>
    `<li><a href="${url}"${url === fireSafetyEnglishFaqPath && code !== 'en' ? ' hreflang="en"' : ''}>${escapeHtml(copy.materials[index])}</a></li>`).join('\n          ');

  return `<!doctype html>
<html lang="${code}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title} | BigPlanner Partners</title>
  <meta name="description" content="${description}">
  <link rel="canonical" href="${canonical}">
${alternates}
  <link rel="alternate" type="application/rss+xml" title="${escapeHtml(copy.rss)}" href="${siteOrigin + feedPath}">
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="BigPlanner Partners">
  <meta property="og:locale" content="${locale}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${shareDescription}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${siteOrigin}/images/fire-safety-organic-og.jpg">
  <meta name="twitter:card" content="summary_large_image">
  ${shareAssets}
  <style>${styles}</style>
</head>
<body>
  <header><div class="wrap">
    <a href="${path}" class="brand" lang="en">BigPlanner Partners</a>
    <nav class="guide-languages">${languages}</nav>
  </div></header>
  <main>
    <section class="hero" aria-labelledby="guide-title"><div class="wrap">
      <h1 id="guide-title">${escapeHtml(copy.heading)}</h1>
      <p>${escapeHtml(copy.intro)}</p>
      <div class="actions">
        <a class="button" href="#checklist">${escapeHtml(copy.open)}</a>
        <button class="print" id="print-checklist" type="button" hidden>${escapeHtml(copy.print)}</button>
      </div>
      ${renderPageShare(code, copy.title, canonical, copy.share.email, copy.share)}
    </div></section>
    <div class="wrap">
      <section class="section" id="checklist" aria-labelledby="scope-heading">
        <h2 id="scope-heading">${escapeHtml(copy.scopeHeading)}</h2>
        <div class="checks">
          ${checks}
        </div>
        <p class="note">${escapeHtml(copy.safety)}</p>
      </section>
      <section class="section" aria-labelledby="example-heading">
        <h2 id="example-heading">${escapeHtml(copy.exampleHeading)}</h2>
        <dl class="example">
          ${example}
        </dl>
        <p><a href="${videoPath}">${escapeHtml(copy.watch)}</a></p>
        <p>${escapeHtml(copy.interfaceNote)}</p>
      </section>
      <section class="section" aria-labelledby="measure-heading">
        <h2 id="measure-heading">${escapeHtml(copy.pilotHeading)}</h2>
        <p>${escapeHtml(copy.baseline)}</p>
        <ul class="measures">
          ${metrics}
        </ul>
        <p>${escapeHtml(copy.review)}</p>
        <p class="reference">${escapeHtml(copy.referenceIntro)} <a href="${policyReference}" hreflang="en">${escapeHtml(copy.referenceLabel)}</a></p>
      </section>
      <section class="section" aria-labelledby="pricing-heading">
        <h2 id="pricing-heading">${escapeHtml(copy.pricingHeading)}</h2>
        <p>${escapeHtml(copy.pricing)}</p>
        <div class="actions">
          <a class="button" href="${request}">${escapeHtml(copy.demoLabel)}</a>
        </div>
      </section>
      <section class="section" aria-labelledby="materials-heading">
        <h2 id="materials-heading">${escapeHtml(copy.resourcesHeading)}</h2>
        <ul class="materials">
          ${materialLinks}
        </ul>
      </section>
    </div>
  </main>
  <footer><div class="wrap">
    <span lang="en">BigPlanner Partners</span>
    <a href="${feedPath}" type="application/rss+xml">${escapeHtml(copy.rss)}</a>
    <a href="/privacy/" hreflang="ko">${escapeHtml(copy.privacy)}</a>
  </div></footer>
  <script>
    const printChecklist = document.getElementById('print-checklist');
    printChecklist.addEventListener('click', () => window.print());
    printChecklist.hidden = false;
  </script>
</body>
</html>
`;
}

export function renderAdoptionPages() {
  return new Map(fireSafetyTranslations.filter(({ adoptionPath }) => adoptionPath)
    .map((language) => [`${language.adoptionPath}index.html`, renderAdoptionGuide(language, readAdoptionCopy(language.code))]));
}
