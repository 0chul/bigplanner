import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';
import express from 'express';
import { fireSafetyAdoptionPath, fireSafetyAlternates, fireSafetyChecklistPath, fireSafetyEnglishAfterHoursPath, fireSafetyEnglishFaqPath, fireSafetyEnglishResourcesPath, fireSafetyHandoverAlternates, fireSafetyKoreanAfterHoursPath, fireSafetyKoreanFaqPath, fireSafetyKoreanResourcesPath, fireSafetyKoreanVideoPath, fireSafetyKoreanWorkloadPath, fireSafetyPath, fireSafetyRequestPages, fireSafetyTranslations, fireSafetyVideoAlternates, siteOrigin } from '../src/utils/fireSafetyLocales.js';
import { faqWorksheetName } from './fire-safety-global/faq-authoring.js';
import { writeResourceFeeds } from './fire-safety-global/feeds.js';
import { demoVideo } from './fire-safety-global/video.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, '../dist');
const fireSafetyResourcePaths = [fireSafetyChecklistPath, fireSafetyAdoptionPath, fireSafetyKoreanVideoPath, fireSafetyKoreanAfterHoursPath, fireSafetyKoreanFaqPath, fireSafetyKoreanResourcesPath, fireSafetyKoreanWorkloadPath];
const fireSafetyKoreanLinks = [...fireSafetyResourcePaths, ...fireSafetyTranslations.map(({ path }) => path)];
const fireSafetyStaticPaths = [
  ...fireSafetyKoreanLinks, fireSafetyEnglishAfterHoursPath, fireSafetyEnglishFaqPath, fireSafetyEnglishResourcesPath,
  ...fireSafetyTranslations.flatMap(({ handoverPath, videoPath, workloadPath }) => [handoverPath, videoPath, workloadPath]),
];
const servicePath = '/service/';
const requiredSpaRoutes = new Set(['/', servicePath, fireSafetyPath, ...fireSafetyRequestPages.keys()]);

async function verifyFireSafetyPage(page) {
  await page.waitForSelector('#demo-request form button[type="submit"]');
  await Promise.all(fireSafetyKoreanLinks.map((resourcePath) => page.waitForSelector(`a[href="${resourcePath}"]`)));
  await page.evaluate((alternates, origin) => {
    const canonical = document.head.querySelectorAll('link[rel="canonical"]');
    const ogUrl = document.head.querySelectorAll('meta[property="og:url"]');
    const description = document.head.querySelectorAll('meta[name="description"]');
    const shareImages = document.head.querySelectorAll('meta[property="og:image"]');
    const twitterImage = document.head.querySelector('meta[name="twitter:image"]');
    if (canonical.length !== 1 || ogUrl.length !== 1 || description.length !== 1 || shareImages.length !== 1 ||
        shareImages[0].content !== 'https://bigplanner.co.kr/images/fire-safety-organic-og.jpg' ||
        twitterImage?.content !== shareImages[0].content ||
        ogUrl[0].content !== canonical[0].href || !description[0].content.includes('방재실') ||
        !document.title.includes('방재실')) {
      throw new Error('Invalid fire safety landing page metadata.');
    }
    for (const { code, path } of alternates) {
      if (document.head.querySelector(`link[rel="alternate"][hreflang="${code}"]`)?.href !== origin + path) {
        throw new Error(`Missing fire safety language alternate: ${code}`);
      }
    }
  }, fireSafetyAlternates, siteOrigin);
}

async function verifyDemoRequest(page, { code, requestPath, direction = 'ltr' }) {
  await page.waitForSelector('#demo-request form [name="consent"]');
  const expectedSubmit = code === 'en' ? 'Submit demo request' : JSON.parse(fs.readFileSync(
    new URL(`../src/components/fireSafetyDemoRequestLocales/${code.toLowerCase()}.json`, import.meta.url), 'utf-8'
  )).form.submit;
  await page.evaluate(({ expectedUrl, code, direction, expectedSubmit }) => {
    const robots = document.querySelectorAll('meta[name="robots"]');
    const canonical = document.querySelectorAll('link[rel="canonical"]');
    const submit = document.querySelector('#demo-request form button[type="submit"]');
    if (document.documentElement.lang !== code || document.documentElement.dir !== direction ||
        robots.length !== 1 || !robots[0].content.includes('noindex') ||
        canonical.length !== 1 || canonical[0].href !== expectedUrl || submit?.textContent.trim() !== expectedSubmit) {
      throw new Error(`Invalid demo request page for ${code}.`);
    }
  }, { expectedUrl: siteOrigin + requestPath, code, direction, expectedSubmit });
}

function verifyVideoPage(sitemap, videoPath, code, captionsPath) {
  const html = fs.readFileSync(path.join(distPath, videoPath, 'index.html'), 'utf-8');
  const data = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1] ?? '{}');
  const entry = sitemap.split(`<loc>${siteOrigin}${videoPath}</loc>`)[1]?.split('</url>')[0];
  const captions = fs.readFileSync(path.join(distPath, captionsPath), 'utf-8');
  if (!html.includes(`<link rel="canonical" href="${siteOrigin}${videoPath}">`) ||
      !html.includes(`src="${captionsPath}" srclang="${code}"`) || !captions.startsWith('WEBVTT') ||
      data['@type'] !== 'VideoObject' || data.contentUrl !== siteOrigin + demoVideo.content ||
      data.thumbnailUrl !== siteOrigin + demoVideo.thumbnail || data.caption?.contentUrl !== siteOrigin + captionsPath ||
      data.caption?.inLanguage !== code || !entry?.includes(`<video:content_loc>${data.contentUrl}</video:content_loc>`) ||
      !entry?.includes(`<video:title><![CDATA[${data.name}]]></video:title>`) ||
      !entry?.includes(`<video:description><![CDATA[${data.description}]]></video:description>`) ||
      !fireSafetyVideoAlternates.every(({ code, path }) =>
        html.includes(`<link rel="alternate" hreflang="${code}" href="${siteOrigin}${path}">`))) {
    throw new Error(`Missing video metadata, localized captions, or language links for ${videoPath}`);
  }
  return html;
}

async function verifyServicePage(page) {
  await page.waitForSelector('#service-fire-safety a[href]');
  await page.evaluate((servicePath, fireSafetyPath) => {
    const canonical = document.head.querySelectorAll('link[rel="canonical"]');
    const ogUrl = document.head.querySelectorAll('meta[property="og:url"]');
    const description = document.head.querySelectorAll('meta[name="description"]');
    const demoLink = document.querySelector('#service-fire-safety a');
    const expectedUrl = 'https://bigplanner.co.kr' + servicePath;
    const destination = new URL(demoLink.getAttribute('href'), expectedUrl);
    const pointsToProduct = destination.protocol === 'https:' && (
      (destination.hostname === 'bigplanner.co.kr' && destination.pathname === fireSafetyPath) ||
      (destination.hostname.endsWith('.bigplanner.co.kr') && destination.pathname === '/')
    );
    if (canonical.length !== 1 || canonical[0].href !== expectedUrl || ogUrl.length !== 1 ||
        ogUrl[0].content !== expectedUrl || description.length !== 1 || !description[0].content.includes('방재실') ||
        !document.title.startsWith('서비스 | ') || !pointsToProduct) {
      throw new Error('Invalid services page metadata or fire safety demo link.');
    }
  }, servicePath, fireSafetyPath);
}

async function prerender() {
  console.log('Starting pre-rendering process...');
  // GitHub Pages serves this login-gated deep link, including the proposal preview.
  const pmDirectory = path.join(distPath, 'admin', 'pm-estimates');
  fs.mkdirSync(pmDirectory, { recursive: true });
  fs.copyFileSync(path.join(distPath, 'index.html'), path.join(pmDirectory, 'index.html'));

  // 1. Start a local server to serve the dist folder
  const app = express();
  app.use(express.static(distPath));
  
  // Fallback for SPA routing
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });

  const server = app.listen(0, () => {
    console.log(`Local server started on port ${server.address().port}`);
  });
  const port = server.address().port;

  // 2. Read sitemap to get URLs
  const sitemapPath = path.join(distPath, 'sitemap.xml');
  if (!fs.existsSync(sitemapPath)) {
    console.error('sitemap.xml not found in dist folder. Run build first.');
    server.close();
    process.exit(1);
  }

  const sitemapContent = fs.readFileSync(sitemapPath, 'utf-8');
  const urls = [];
  const regex = /<loc>(.*?)<\/loc>/g;
  let match;
  while ((match = regex.exec(sitemapContent)) !== null) {
    const url = match[1].replace('https://bigplanner.co.kr', '');
    urls.push(url === '' ? '/' : url);
  }

  for (const resourcePath of fireSafetyStaticPaths) {
    const resourceFile = path.join(distPath, resourcePath, 'index.html');
    const canonical = `<link rel="canonical" href="https://bigplanner.co.kr${resourcePath}">`;
    if (!urls.includes(resourcePath) || !fs.existsSync(resourceFile) ||
        !fs.readFileSync(resourceFile, 'utf-8').includes(canonical)) {
      throw new Error(`Missing static fire safety page, canonical, or sitemap entry for ${resourcePath}`);
    }
  }
  for (const resourcePath of [fireSafetyKoreanFaqPath, fireSafetyEnglishFaqPath]) {
    const directory = path.join(distPath, resourcePath);
    const guide = fs.readFileSync(path.join(directory, 'index.html'), 'utf-8');
    if (!fs.existsSync(path.join(directory, faqWorksheetName)) || !guide.includes(`href="${faqWorksheetName}" download`)) {
      throw new Error(`Missing FAQ worksheet or download for ${resourcePath}`);
    }
  }
  const workbookName = 'facilities-shift-handover-log.xlsx';
  for (const { code, path: languagePath, handoverPath, requestPath, videoPath } of fireSafetyTranslations) {
    const languageDirectory = path.join(distPath, languagePath);
    const html = fs.readFileSync(path.join(languageDirectory, 'index.html'), 'utf-8');
    const captions = fs.readFileSync(path.join(languageDirectory, 'demo.vtt'), 'utf-8');
    if (!captions.startsWith('WEBVTT\n') || !html.includes(`href="${requestPath}?`) || !fireSafetyAlternates.every(({ code, path }) =>
      html.includes(`<link rel="alternate" hreflang="${code}" href="${siteOrigin}${path}">`))) {
      throw new Error(`Missing demo request link, captions, or language alternates for ${languagePath}`);
    }
    const handoverDirectory = path.join(distPath, handoverPath);
    const guide = fs.readFileSync(path.join(handoverDirectory, 'index.html'), 'utf-8');
    const guideRequestUrl = `${requestPath}?utm_source=handover_template&amp;utm_medium=referral&amp;utm_campaign=fire_safety_global&amp;utm_content=${code.toLowerCase()}`;
    if (!sitemapContent.includes(`<loc>${siteOrigin}${handoverPath}</loc>`) ||
        !fs.existsSync(path.join(handoverDirectory, workbookName)) ||
        !html.includes(`href="${handoverPath}"`) || !guide.includes(`href="${workbookName}" download`) ||
        !guide.includes(`<link rel="canonical" href="${siteOrigin}${handoverPath}">`) ||
        !guide.includes(`<html lang="${code}"`) || !guide.includes(`href="${languagePath}"`) ||
        !guide.includes(`href="${videoPath}?`) ||
        !guide.includes(`href="${guideRequestUrl}" hreflang="${code}"`) ||
        !fireSafetyHandoverAlternates.every(({ code, path }) =>
          guide.includes(`<link rel="alternate" hreflang="${code}" href="${siteOrigin}${path}">`))) {
      throw new Error(`Missing handover workbook, language links, or sitemap entry for ${handoverPath}`);
    }
    const watchPage = verifyVideoPage(sitemapContent, videoPath, code, `${languagePath}demo.vtt`);
    const watchRequest = `${requestPath}?utm_source=demo_video&amp;utm_medium=referral&amp;utm_campaign=fire_safety_global&amp;utm_content=${code.toLowerCase()}`;
    if (!html.includes(`href="${videoPath}"`) || !watchPage.includes(`href="${watchRequest}"`) ||
        !watchPage.includes(`href="${handoverPath}"`)) {
      throw new Error(`Missing video visitor links or copy for ${videoPath}`);
    }
  }
  verifyVideoPage(sitemapContent, fireSafetyKoreanVideoPath, 'ko', `${fireSafetyKoreanVideoPath}demo.vtt`);
  const koreanChecklist = fs.readFileSync(path.join(distPath, fireSafetyChecklistPath, 'index.html'), 'utf-8');
  for (const { code, path: resourcePath } of fireSafetyHandoverAlternates) {
    const tag = `<link rel="alternate" hreflang="${code}" href="${siteOrigin}${resourcePath}">`;
    if (!koreanChecklist.includes(tag)) throw new Error(`Missing ${code} language link on the Korean handover checklist.`);
  }
  for (const assetName of ['handoff-log.xlsx', 'handoff-demo.mp4', 'handoff-demo-cover.jpg']) {
    if (!fs.existsSync(path.join(distPath, fireSafetyChecklistPath, assetName))) {
      throw new Error(`Missing fire safety handoff asset: ${assetName}`);
    }
  }
  const spaUrls = urls.filter((url) => !fireSafetyStaticPaths.includes(url));
  const targetUrls = process.env.PRERENDER_ALL === 'true' ? spaUrls : spaUrls.slice(0, 25);
  if (!targetUrls.includes(fireSafetyPath)) throw new Error('Missing fire safety landing page in sitemap.');
  if (!targetUrls.includes(servicePath)) throw new Error('Missing services page in sitemap.');
  // Request forms are linked from their localized pages and intentionally absent from the sitemap.
  if (urls.some((url) => fireSafetyRequestPages.has(url))) throw new Error('Demo request forms must stay out of the sitemap.');
  targetUrls.push(...fireSafetyRequestPages.keys());
  console.log(`Prerendering ${targetUrls.length} routes for fast, reliable build...`);

  // 3. Launch Puppeteer
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: process.env.CHROME_PATH || (process.platform === 'win32' && fs.existsSync('C:/Program Files/Google/Chrome/Application/chrome.exe')
      ? 'C:/Program Files/Google/Chrome/Application/chrome.exe' : undefined),
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  // 4. Prerender URLs with concurrency pool
  const CONCURRENCY = 4;
  let cursor = 0;

  async function worker(workerId) {
    while (cursor < targetUrls.length) {
      const index = cursor++;
      const url = targetUrls[index];
      const page = await browser.newPage();
      
      try {
        await page.setBypassServiceWorker(true);
        await page.setRequestInterception(true);
        page.on('request', (req) => {
          const type = req.resourceType();
          if (['image', 'media', 'font'].includes(type) || /google-analytics\.com|googletagmanager\.com/.test(req.url())) {
            req.abort();
          } else {
            req.continue();
          }
        });

        const activePort = server.address()?.port || port;
        await page.goto(`http://localhost:${activePort}${url}`, { 
          waitUntil: 'domcontentloaded', 
          timeout: requiredSpaRoutes.has(url) ? 30000 : 6000
        });
        
        const requestLanguage = fireSafetyRequestPages.get(url);
        if (url === fireSafetyPath) await verifyFireSafetyPage(page);
        else if (requestLanguage) await verifyDemoRequest(page, requestLanguage);
        else if (url === servicePath) await verifyServicePage(page);
        else if (url === '/') await page.waitForSelector('#services-overview a[href="' + fireSafetyPath + '"]');
        else await new Promise(r => setTimeout(r, 100));
        if (url === fireSafetyPath || requestLanguage) {
          // The saved form must not accept input before React attaches the submit handler.
          await page.$eval('#demo-request form fieldset', (fieldset) => { fieldset.disabled = true; });
        }
        const html = await page.content();

        const routePath = url === '/' ? '/index.html' : `${url}/index.html`;
        const filePath = path.join(distPath, routePath);
        const dirPath = path.dirname(filePath);

        if (!fs.existsSync(dirPath)) {
          fs.mkdirSync(dirPath, { recursive: true });
        }

        fs.writeFileSync(filePath, html);
        console.log(`[${index + 1}/${targetUrls.length}] Saved ${routePath}`);
      } catch (error) {
        if (requiredSpaRoutes.has(url)) throw error;
        console.warn(`[${index + 1}/${targetUrls.length}] Skip ${url}: ${error.message}`);
      } finally {
        await page.close().catch(() => {});
      }
    }
  }

  try {
    const workers = Array.from({ length: CONCURRENCY }, (_, i) => worker(i));
    await Promise.all(workers);
    await writeResourceFeeds(browser, distPath);
    fs.copyFileSync(path.join(distPath, 'index.html'), path.join(distPath, '404.html'));
  } finally {
    await browser.close().catch(() => {});
    server.close();
  }
  console.log('Pre-rendering completed successfully!');
  process.exit(0);
}

prerender().catch(err => {
  console.error('Prerendering failed:', err.message);
  process.exit(1);
});
