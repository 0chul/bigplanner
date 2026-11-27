import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import {
  facilitiesHandoverPath,
  fireSafetyAdoptionPath,
  fireSafetyChecklistPath,
  fireSafetyEnglishAdoptionPath,
  fireSafetyEnglishAfterHoursPath,
  fireSafetyEnglishFaqPath,
  fireSafetyEnglishFeedPath,
  fireSafetyEnglishPath,
  fireSafetyEnglishVideoPath,
  fireSafetyKoreanFeedPath,
  fireSafetyKoreanAfterHoursPath,
  fireSafetyKoreanFaqPath,
  fireSafetyKoreanVideoPath,
  fireSafetyLanguages,
  fireSafetyPath,
  siteOrigin,
} from '../../src/utils/fireSafetyLocales.js';
import { escapeHtml } from './sharing.js';
import { pilotKits } from './pilot-kits.js';
import { readLocalizedProduct } from './video.js';
import { readWorkloadCopy } from './workload-calculator.js';

const feeds = [
  {
    language: 'ko',
    title: '빅플래너파트너스 시설관리 자료',
    description: '시설관리 FAQ 작성·연장 운전 양식, 교대 인계 체크리스트, 도입 가이드와 방재실 AI 민원 도우미 데모입니다.',
    path: fireSafetyKoreanFeedPath,
    home: fireSafetyPath,
    videoPath: fireSafetyKoreanVideoPath,
    watchLabel: '공식 페이지에서 데모 영상 보기',
    resources: [fireSafetyKoreanFaqPath, fireSafetyKoreanAfterHoursPath, fireSafetyKoreanVideoPath, fireSafetyChecklistPath, fireSafetyAdoptionPath],
  },
  {
    language: 'en',
    title: 'Facilities resources from BigPlanner Partners',
    description: 'Facilities resources including a pilot checklist, building FAQ worksheet, after-hours HVAC request form, handover workbook and tenant service desk demo.',
    path: fireSafetyEnglishFeedPath,
    home: fireSafetyEnglishPath,
    videoPath: fireSafetyEnglishVideoPath,
    watchLabel: 'Watch the demo on the product site',
    resources: [fireSafetyEnglishAdoptionPath, fireSafetyEnglishFaqPath, fireSafetyEnglishAfterHoursPath, fireSafetyEnglishVideoPath, facilitiesHandoverPath],
  },
];

async function localizedFeed({ code, path: home, feedPath, videoPath, handoverPath, resourcesPath, adoptionPath }) {
  const { h1, description, demoAction } = JSON.parse(await readFile(
    new URL(`./handover/${code.toLowerCase()}.json`, import.meta.url), 'utf8',
  ));
  const { demoNote } = readLocalizedProduct(code);
  if (!feedPath || ![h1, description, demoAction, demoNote].every((value) => typeof value === 'string' && value.trim())) {
    throw new Error(`Missing localized feed path or text for ${code}`);
  }
  return {
    language: code,
    title: `${h1} | BigPlanner Partners`,
    description: `${description} ${demoNote}`,
    path: feedPath,
    home,
    videoPath,
    watchLabel: demoAction,
    resources: [adoptionPath, resourcesPath, videoPath, handoverPath],
  };
}

function extractArticle({ html, url, language, watchLabel }, origin) {
  const document = new DOMParser().parseFromString(html, 'text/html');
  const title = document.title.trim();
  const canonicals = document.head.querySelectorAll('link[rel="canonical"]');
  const mains = document.body.querySelectorAll('main');
  if (!title || canonicals.length !== 1 || canonicals[0].getAttribute('href') !== url ||
      mains.length !== 1 || document.documentElement.lang !== language) {
    throw new Error(`Missing or invalid feed source title, canonical, language, or main: ${url}`);
  }

  const main = mains[0];
  for (const video of main.querySelectorAll('video')) {
    if (watchLabel) {
      const paragraph = document.createElement('p');
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.textContent = watchLabel;
      paragraph.append(anchor);
      video.replaceWith(paragraph);
    } else {
      video.remove();
    }
  }

  const discard = 'script, style, template, noscript, iframe, object, embed, svg, math, audio, source, track, ' +
    'header, footer, nav.languages, [aria-labelledby="library-languages"], .library-lead-image, ' +
    '.share, form, button, input, select, textarea, [hidden], [aria-hidden="true"]';
  for (const element of main.querySelectorAll(discard)) element.remove();

  function siteUrl(value) {
    if (!value?.trim()) return null;
    try {
      const absolute = new URL(value, url);
      if (absolute.protocol === 'https:' && absolute.origin === origin && !absolute.username && !absolute.password) {
        return absolute.href;
      }
    } catch {
      // An invalid URL cannot be represented as a working feed link.
    }
    return null;
  }

  const tags = new Set(('a article aside b bdi blockquote br caption code dd details div dl dt em figcaption figure ' +
    'h1 h2 h3 h4 h5 h6 hr i img li nav ol p pre s section small span strong sub summary sup table td th thead tbody ' +
    'tfoot time tr u ul').split(' '));
  for (const element of main.querySelectorAll('*')) {
    const tag = element.localName;
    if (!tags.has(tag)) {
      element.replaceWith(...element.childNodes);
      continue;
    }

    for (const { name } of Array.from(element.attributes)) {
      const metadata = name === 'lang' || name === 'dir';
      const anchor = tag === 'a' && ['href', 'download', 'hreflang'].includes(name);
      const image = tag === 'img' && ['src', 'alt'].includes(name);
      const table = (tag === 'td' || tag === 'th') && ['colspan', 'rowspan', 'scope'].includes(name);
      if (!metadata && !anchor && !image && !table) element.removeAttribute(name);
    }

    if (tag === 'a') {
      const href = element.getAttribute('href');
      const absolute = siteUrl(href);
      if (absolute) element.setAttribute('href', absolute);
      else if (href?.trim().toLowerCase().startsWith('mailto:')) element.remove();
      else element.replaceWith(...element.childNodes);
    } else if (tag === 'img') {
      const absolute = siteUrl(element.getAttribute('src'));
      if (absolute) element.setAttribute('src', absolute);
      else element.replaceWith(document.createTextNode(element.alt));
    }
  }

  if (!main.querySelector('h1')?.textContent.trim() || !main.textContent.trim()) {
    throw new Error(`Feed source has no readable article: ${url}`);
  }
  const body = main.innerHTML.trim();
  return {
    title,
    url,
    body: document.documentElement.dir === 'rtl' ? `<div lang="${language}" dir="rtl">${body}</div>` : body,
  };
}

function escapeXml(text) {
  return text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;').replaceAll("'", '&apos;');
}

function renderFeed(feed, articles) {
  const entries = articles.map(({ title, url, body }) => `    <item>
      <title>${escapeXml(title)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <description><![CDATA[${body.replaceAll(']]>', ']]]]><![CDATA[>')}]]></description>
    </item>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(feed.title)}</title>
    <link>${escapeXml(siteOrigin + feed.home)}</link>
    <description>${escapeXml(feed.description)}</description>
    <language>${feed.language}</language>
    <atom:link href="${escapeXml(siteOrigin + feed.path)}" rel="self" type="application/rss+xml" />
${entries}
  </channel>
</rss>
`;
}

export async function writeResourceFeeds(browser, distPath) {
  const languages = fireSafetyLanguages.filter(({ code }) => code !== 'ko' && code !== 'en');
  const workloadLanguages = new Map(fireSafetyLanguages.map(language => [language.code, language]));
  const localized = await Promise.all(languages.map(localizedFeed));
  const page = await browser.newPage();
  try {
    await page.setOfflineMode(true);
    for (const feed of [...feeds, ...localized]) {
      const articles = await Promise.all(feed.resources.map(async (resourcePath) => {
        const html = await readFile(path.join(distPath, resourcePath, 'index.html'), 'utf8');
        const watchLabel = resourcePath === feed.videoPath ? feed.watchLabel : null;
        return page.evaluate(extractArticle, {
          html, url: siteOrigin + resourcePath, language: feed.language, watchLabel,
        }, siteOrigin);
      }));

      const { workloadPath, direction = 'ltr' } = workloadLanguages.get(feed.language);
      const copy = readWorkloadCopy(feed.language);
      const url = siteOrigin + workloadPath;
      const calculator = {
        title: copy.pageTitle,
        url,
        body: `<div lang="${feed.language}" dir="${direction}"><p>${escapeHtml(copy.description)}</p><p><a href="${url}">${escapeHtml(copy.open)}</a></p></div>`,
      };
      const items = [calculator, ...articles];
      const kit = pilotKits[feed.language];
      if (kit) {
        items.unshift({
          title: kit.title,
          url: `${siteOrigin}${kit.libraryPath}#pilot-kit`,
          body: `<p>${escapeHtml(kit.description)}</p><p><a href="${siteOrigin + kit.path}">${escapeHtml(kit.download)}</a></p>`,
        });
      }
      const xml = renderFeed(feed, items);
      const valid = await page.evaluate((content, count) => {
        const document = new DOMParser().parseFromString(content, 'application/xml');
        return document.documentElement.localName === 'rss' && !document.querySelector('parsererror') &&
          document.querySelectorAll('rss > channel > item').length === count;
      }, xml, items.length);
      if (!valid) throw new Error(`Invalid resource feed XML: ${feed.path}`);
      await writeFile(path.join(distPath, feed.path), xml, 'utf8');
    }
  } finally {
    await page.close();
  }
}
