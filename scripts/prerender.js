import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';
import express from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, '../dist');
const fireSafetyPath = '/fire-safety-ai/';
const fireSafetyChecklistPath = '/fire-safety-ai/handoff-checklist/';
const fireSafetyAdoptionPath = '/fire-safety-ai/adoption-guide/';
const staticGuidePaths = [fireSafetyChecklistPath, fireSafetyAdoptionPath];
const servicePath = '/service/';

async function verifyFireSafetyPage(page) {
  await page.waitForSelector('#demo-request form button[type="submit"]');
  await Promise.all(staticGuidePaths.map((guidePath) => page.waitForSelector(`a[href="${guidePath}"]`)));
  await page.evaluate(() => {
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
  });
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

  for (const guidePath of staticGuidePaths) {
    const guideFile = path.join(distPath, guidePath, 'index.html');
    const canonical = `<link rel="canonical" href="https://bigplanner.co.kr${guidePath}">`;
    if (!urls.includes(guidePath) || !fs.existsSync(guideFile) ||
        !fs.readFileSync(guideFile, 'utf-8').includes(canonical)) {
      throw new Error(`Missing static guide, canonical, or sitemap entry for ${guidePath}`);
    }
  }
  const checklistWorkbook = path.join(distPath, fireSafetyChecklistPath, 'handoff-log.xlsx');
  if (!fs.existsSync(checklistWorkbook)) {
    throw new Error('The fire safety checklist workbook is missing.');
  }
  const spaUrls = urls.filter((url) => !staticGuidePaths.includes(url));
  const targetUrls = process.env.PRERENDER_ALL === 'true' ? spaUrls : spaUrls.slice(0, 25);
  if (!targetUrls.includes(fireSafetyPath)) throw new Error('Missing fire safety landing page in sitemap.');
  if (!targetUrls.includes(servicePath)) throw new Error('Missing services page in sitemap.');
  console.log(`Prerendering ${targetUrls.length} of ${urls.length} URLs for fast, reliable build...`);

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
          timeout: url === fireSafetyPath || url === servicePath ? 30000 : 6000
        });
        
        if (url === fireSafetyPath) await verifyFireSafetyPage(page);
        else if (url === servicePath) await verifyServicePage(page);
        else if (url === '/') await page.waitForSelector('#services-overview a[href="' + fireSafetyPath + '"]');
        else await new Promise(r => setTimeout(r, 100));
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
        if (url === fireSafetyPath || url === servicePath || url === '/') throw error;
        console.warn(`[${index + 1}/${targetUrls.length}] Skip ${url}: ${error.message}`);
      } finally {
        await page.close().catch(() => {});
      }
    }
  }

  try {
    const workers = Array.from({ length: CONCURRENCY }, (_, i) => worker(i));
    await Promise.all(workers);
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
