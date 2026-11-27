import { readFileSync } from 'node:fs';
import { facilitiesHandoverPath, fireSafetyAlternates, fireSafetyEnglishDemoPath, fireSafetyEnglishPath, fireSafetyEnglishVideoPath, fireSafetyLanguages, fireSafetyPath, fireSafetyTranslations, siteOrigin } from '../../src/utils/fireSafetyLocales.js';
import { demoVideo, englishDemoVideo, fireSafetyKoreanVideoPath, fireSafetyVideoAlternates } from './video.js';

const pagePaths = new Set([...fireSafetyTranslations.map(({ path }) => path), facilitiesHandoverPath, fireSafetyEnglishVideoPath]);
const artworkPath = '/images/fire-safety-building.webp';
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
  const caseCounts = [59, 0];
  if (content.caseLabels.length !== caseCounts.length) throw new Error(`Missing case evidence labels for ${code}`);
  const caseStats = caseCounts.map((count, index) =>
    `<div><dt>${escapeHtml(content.caseLabels[index])}</dt><dd>${count}</dd></div>`).join('\n          ');
  const requestUrl = `${fireSafetyEnglishDemoPath}?utm_source=international&amp;utm_medium=referral&amp;utm_campaign=fire_safety_global&amp;utm_content=${code.toLowerCase()}`;
  const mailUrl = `mailto:${demoEmail}?subject=${encodeURIComponent(content.subject)}`;
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
            <a href="${code === 'en' ? fireSafetyEnglishVideoPath : '#demo'}">${escapeHtml(content.demoTitle)}</a>
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
          ${code === 'en' ? `<a class="resource-link" href="${fireSafetyEnglishVideoPath}">Open the captioned video</a>` : ''}
        </div>
        <video controls playsinline preload="none" width="1080" height="1920" aria-labelledby="demo-title" aria-describedby="demo-note" src="${demoVideo.content}" poster="${demoVideo.thumbnail}">
          <track kind="captions" src="${path}demo.vtt" srclang="${code}" label="${label}" default>
          <a href="${demoVideo.content}">${escapeHtml(content.videoFallback)}</a>
        </video>
      </div>
    </section>
    <section class="wrap section case-study" id="case-study" aria-labelledby="case-title">
      <div>
        <h2 id="case-title">${escapeHtml(content.caseTitle)}</h2>
        <p class="case-summary">${escapeHtml(content.caseSummary)}</p>
        <a class="resource-link" href="${fireSafetyPath}#case-study" hreflang="ko">${escapeHtml(content.caseLink)}</a>
      </div>
      <div class="case-evidence">
        <dl class="case-stats">
          ${caseStats}
        </dl>
        <p class="case-scope">${escapeHtml(content.caseScope)}</p>
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
        <div class="quote-details">
          <h3>${escapeHtml(content.quoteTitle)}</h3>
          <p>${escapeHtml(content.quoteText)}</p>
        </div>
        <div class="links">
          ${code === 'en'
    ? `<a class="button" href="${requestUrl}">${escapeHtml(content.formAction)}</a>
          <a href="${mailUrl}">${escapeHtml(content.contactAction)}</a>`
    : `<a class="button" href="${mailUrl}">${escapeHtml(content.contactAction)}</a>
          <a href="${requestUrl}" hreflang="en">${escapeHtml(content.formAction)}</a>`}
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

function renderEnglishVideo(content) {
  const videoUrl = siteOrigin + fireSafetyEnglishVideoPath;
  const { title, description, thumbnail, content: media, uploadDate, duration } = englishDemoVideo;
  const data = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'VideoObject', name: title, description,
    thumbnailUrl: siteOrigin + thumbnail, contentUrl: siteOrigin + media,
    uploadDate, duration: `PT${duration}S`, inLanguage: 'ko',
  });
  const timeline = content.subtitles.map((line, index) => {
    const seconds = Number(cueTimes[index].slice(6));
    const time = `0:${String(Math.floor(seconds)).padStart(2, '0')}`;
    return `<li><time datetime="PT${seconds}S">${time}</time><span>${escapeHtml(line)}</span></li>`;
  }).join('\n          ');
  const alternates = fireSafetyVideoAlternates.map(({ code, path }) =>
    `  <link rel="alternate" hreflang="${code}" href="${siteOrigin}${path}">`).join('\n');

  return `<!doctype html>
<html lang="en" dir="ltr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)} | BigPlanner Partners</title>
  <meta name="description" content="${escapeHtml(description)}">
  <link rel="canonical" href="${videoUrl}">
${alternates}
  <meta property="og:type" content="video.other">
  <meta property="og:site_name" content="BigPlanner Partners">
  <meta property="og:locale" content="en_US">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${videoUrl}">
  <meta property="og:image" content="${siteOrigin}${thumbnail}">
  <meta name="twitter:card" content="summary">
  <script type="application/ld+json">${data}</script>
  <style>
${styles}
    .watch { max-width: 53rem; padding-block: clamp(1.4rem, 4vw, 2.8rem); }
    .watch h1 { font-size: clamp(1.8rem, 4.5vw, 3rem); }
    .watch .intro { margin-block: .5rem 1.1rem; }
    .watch-stage { display: grid; grid-template-columns: minmax(12rem, 17rem) minmax(0, 1fr); gap: clamp(1.2rem, 4vw, 3rem); align-items: start; }
    .watch-stage video { max-width: 17rem; }
    .watch-details { padding: 1rem 1.15rem; background: var(--paper); border: 1px solid var(--rule); border-radius: .6rem; }
    .watch-details h2 { font-size: 1.25rem; }
    .watch-timeline { margin-block: .55rem 0; padding: 0; list-style: none; }
    .watch-timeline li { display: grid; grid-template-columns: 2.8rem minmax(0, 1fr); gap: .4rem; padding-block: .5rem; }
    .watch-timeline li + li { border-block-start: 1px solid var(--rule); }
    .watch-timeline time { font-variant-numeric: tabular-nums; font-weight: 700; color: var(--green); }
    @media (max-width: 41rem) { .watch-stage { grid-template-columns: minmax(0, 1fr); } .watch-stage video { max-width: min(100%, 14.5rem); } }
    @media (max-width: 23rem) {
      .watch-header .header-content { gap: .35rem .65rem; padding-block: .6rem; }
      .watch-header .brand { font-size: 1rem; }
      .watch-header a[hreflang] { font-size: .85rem; }
      .watch { padding-block: .9rem 1.7rem; }
      .watch h1 { font-size: 1.6rem; }
      .watch .intro { font-size: .9rem; margin-block: .45rem .65rem; }
      .watch-stage video { max-width: min(100%, 12rem); }
    }
  </style>
</head>
<body>
  <header class="site-header watch-header"><div class="wrap header-content">
    <a class="brand" href="${fireSafetyEnglishPath}">BigPlanner <span>Partners</span></a>
    <a href="${fireSafetyKoreanVideoPath}" lang="ko" hreflang="ko">한국어 영상 안내</a>
  </div></header>
  <main class="wrap watch">
    <h1 id="video-title">${escapeHtml(title)}</h1>
    <p class="intro" id="video-description">A 27-second simulated cooling request with Korean on-screen text and English captions.</p>
    <div class="watch-stage">
      <video controls playsinline preload="metadata" width="1080" height="1920" aria-labelledby="video-title" aria-describedby="video-description" src="${media}" poster="${thumbnail}">
        <track kind="captions" src="${fireSafetyEnglishPath}demo.vtt" srclang="en" label="English" default>
        <a href="${media}">Open the demo video file</a>
      </video>
      <div>
        <section class="watch-details" aria-labelledby="transcript-title">
          <h2 id="transcript-title">What happens in the demo</h2>
          <ol class="watch-timeline">
          ${timeline}
          </ol>
        </section>
        <div class="links">
          <a class="button" href="${fireSafetyEnglishDemoPath}?utm_source=demo_video&amp;utm_medium=referral&amp;utm_campaign=fire_safety_global&amp;utm_content=en">Request an online demo</a>
          <a href="${facilitiesHandoverPath}">Get the free Excel handover log</a>
        </div>
      </div>
    </div>
  </main>
  <footer><div class="wrap"><span>BigPlanner Partners</span><a href="/privacy/" hreflang="ko">Privacy policy (Korean)</a></div></footer>
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
    if (language.code === 'en') files.set(`${fireSafetyEnglishVideoPath}index.html`, renderEnglishVideo(content));
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
