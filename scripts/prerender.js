import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';
import express from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, '../dist');

async function prerender() {
  console.log('Starting pre-rendering process...');

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

  const targetUrls = process.env.PRERENDER_ALL === 'true' ? urls : urls.slice(0, 25);
  console.log(`Prerendering ${targetUrls.length} of ${urls.length} URLs for fast, reliable build...`);

  // 3. Launch Puppeteer
  const browser = await puppeteer.launch({
    headless: 'new',
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
        await page.setRequestInterception(true);
        page.on('request', (req) => {
          const type = req.resourceType();
          if (['image', 'media', 'font'].includes(type)) {
            req.abort();
          } else {
            req.continue();
          }
        });

        const activePort = server.address()?.port || port;
        await page.goto(`http://localhost:${activePort}${url}`, { 
          waitUntil: 'domcontentloaded', 
          timeout: 6000 
        });
        
        await new Promise(r => setTimeout(r, 100));
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
        console.warn(`[${index + 1}/${targetUrls.length}] Skip ${url}: ${error.message}`);
      } finally {
        await page.close().catch(() => {});
      }
    }
  }

  const workers = Array.from({ length: CONCURRENCY }, (_, i) => worker(i));
  await Promise.all(workers);

  // 5. Cleanup
  await browser.close().catch(() => {});
  server.close();
  console.log('Pre-rendering completed successfully!');
  process.exit(0);
}

prerender().catch(err => {
  console.warn('Prerendering completed with warning (static SPA fallback preserved):', err.message);
  process.exit(0);
});
