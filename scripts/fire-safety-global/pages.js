import { readFileSync } from 'node:fs';
import { facilitiesHandoverPath, fireSafetyAlternates, fireSafetyLanguages, fireSafetyPath, fireSafetyTranslations, siteOrigin } from '../../src/utils/fireSafetyLocales.js';

const pagePaths = new Set([...fireSafetyTranslations.map(({ path }) => path), facilitiesHandoverPath]);
const artworkPath = '/images/fire-safety-building.webp';
const demoBase = `${fireSafetyPath}handoff-checklist/`;
const demoFile = `${demoBase}handoff-demo.mp4`;
const styles = readFileSync(new URL('./landing.css', import.meta.url), 'utf8');
const cueTimes = ['00:00:00.000', '00:00:04.400', '00:00:09.800', '00:00:15.300', '00:00:21.400', '00:00:27.000'];
const demoEmail = 'bigplanner0799@gmail.com';

function escapeHtml(value) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
}

function renderLanding(language, content) {
  const { code, label, path, locale, direction = 'ltr' } = language;
  const url = `${siteOrigin}${path}`;
  const title = escapeHtml(`${content.title} | BigPlanner Partners`);
  const description = escapeHtml(content.description);
  const alternates = fireSafetyAlternates.map(({ code, path }) =>
    `  <link rel="alternate" hreflang="${code}" href="${siteOrigin}${path}">`).join('\n');
  const navigation = fireSafetyLanguages.map(({ code: itemCode, label: itemLabel, path: itemPath }) =>
    `<a href="${itemPath}" lang="${itemCode}" hreflang="${itemCode}" dir="auto"${itemCode === code ? ' aria-current="page"' : ''}>${itemLabel}</a>`).join('\n        ');
  const steps = content.steps.map(([title, text]) =>
    `<li><h3>${escapeHtml(title)}</h3><p>${escapeHtml(text)}</p></li>`).join('\n        ');
  const scenes = content.subtitles.slice(0, 4).map((text) => `<li>${escapeHtml(text)}</li>`).join('\n          ');
  const faq = content.faq.map(([question, answer]) =>
    `<details><summary>${escapeHtml(question)}</summary><p>${escapeHtml(answer)}</p></details>`).join('\n        ');
  return `<!doctype html>
<html lang="${code}" dir="${direction}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <link rel="canonical" href="${url}">
${alternates}
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="BigPlanner Partners">
  <meta property="og:locale" content="${locale}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${siteOrigin}${artworkPath}">
  <meta name="twitter:card" content="summary_large_image">
  <style>${styles}</style>
</head>
<body>
  <header class="site-header">
    <div class="wrap header-content">
      <a class="brand" href="/" lang="en">BigPlanner <span>Partners</span></a>
      <nav class="languages" aria-label="${escapeHtml(content.navLabel)}">
        ${navigation}
      </nav>
    </div>
  </header>
  <main>
    <section class="hero" aria-labelledby="page-title">
      <div class="wrap hero-content">
        <div class="hero-copy">
          <h1 id="page-title">${escapeHtml(content.heading)}</h1>
          <p class="intro">${escapeHtml(content.intro)}</p>
          <p class="audience">${escapeHtml(content.audience)}</p>
          <div class="links">
            <a class="button" href="#contact">${escapeHtml(content.contactTitle)}</a>
            <a href="#demo">${escapeHtml(content.demoTitle)}</a>
          </div>
        </div>
        <img class="building" src="${artworkPath}" width="1672" height="941" alt="" fetchpriority="high">
      </div>
    </section>
    <section class="wrap section" aria-labelledby="workflow-title">
      <h2 id="workflow-title">${escapeHtml(content.workflowTitle)}</h2>
      <ul class="steps">
        ${steps}
      </ul>
      ${code === 'en' ? `<a class="resource-link" href="${facilitiesHandoverPath}">Get the free facilities shift handover template</a>` : ''}
    </section>
    <section class="demo-band" id="demo" aria-labelledby="demo-title">
      <div class="wrap section demo-section">
        <div>
          <h2 id="demo-title">${escapeHtml(content.demoTitle)}</h2>
          <p class="demo-note" id="demo-note">${escapeHtml(content.demoNote)}</p>
          <ol class="scenes">
          ${scenes}
          </ol>
        </div>
        <video controls playsinline preload="none" width="1080" height="1920" aria-labelledby="demo-title" aria-describedby="demo-note" src="${demoFile}" poster="${demoBase}handoff-demo-cover.jpg">
          <track kind="captions" src="${path}demo.vtt" srclang="${code}" label="${label}" default>
          <a href="${demoFile}">${escapeHtml(content.videoFallback)}</a>
        </video>
      </div>
    </section>
    <section class="wrap section faq" aria-labelledby="faq-title">
      <h2 id="faq-title">${escapeHtml(content.faqTitle)}</h2>
      <div>
        ${faq}
      </div>
    </section>
    <section class="contact-band" id="contact" aria-labelledby="contact-title">
      <div class="wrap section">
        <h2 id="contact-title">${escapeHtml(content.contactTitle)}</h2>
        <p>${escapeHtml(content.contactText)}</p>
        <div class="links">
          <a class="button" href="mailto:${demoEmail}?subject=${encodeURIComponent(content.subject)}">${escapeHtml(content.contactAction)}</a>
          <a href="${fireSafetyPath}?utm_source=international&amp;utm_medium=referral&amp;utm_campaign=fire_safety_global&amp;utm_content=${code.toLowerCase()}#demo-request" hreflang="ko">${escapeHtml(content.formAction)}</a>
        </div>
        <p class="email" dir="ltr">${demoEmail}</p>
      </div>
    </section>
  </main>
  <footer><div class="wrap"><span lang="en">BigPlanner Partners</span><a href="/privacy/" hreflang="ko">${escapeHtml(content.privacy)}</a></div></footer>
</body>
</html>
`;
}

function renderCaptions(subtitles) {
  if (subtitles.length !== cueTimes.length - 1) throw new Error('Incorrect number of demo captions');
  return `WEBVTT\n\n${subtitles.map((line, index) => `${cueTimes[index]} --> ${cueTimes[index + 1]}\n${line}`).join('\n\n')}\n`;
}

export function fireSafetyGlobalPages() {
  const files = new Map();
  for (const language of fireSafetyTranslations) {
    const content = JSON.parse(readFileSync(new URL(`./${language.code.toLowerCase()}.json`, import.meta.url), 'utf8'));
    files.set(`${language.path}index.html`, renderLanding(language, content));
    files.set(`${language.path}demo.vtt`, renderCaptions(content.subtitles));
  }
  const handover = readFileSync(new URL('./shift-handover.html', import.meta.url), 'utf8');
  files.set(`${facilitiesHandoverPath}index.html`, handover.replace('/* SHARED LANDING STYLES */', styles));
  return {
    name: 'fire-safety-global-pages',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const { pathname, search } = new URL(req.url ?? '/', siteOrigin);
        if (pagePaths.has(`${pathname}/`)) {
          res.writeHead(302, { Location: `${pathname}/${search}` });
          return res.end();
        }
        const filePath = pathname.endsWith('/') ? `${pathname}index.html` : pathname;
        const body = files.get(filePath);
        if (!body) return next();
        res.setHeader('Content-Type', filePath.endsWith('.vtt') ? 'text/vtt; charset=utf-8' : 'text/html; charset=utf-8');
        res.end(body);
      });
    },
    generateBundle() {
      for (const [filePath, source] of files) {
        this.emitFile({ type: 'asset', fileName: filePath.slice(1), source });
      }
    },
  };
}
