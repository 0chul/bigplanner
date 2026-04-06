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

  const server = app.listen(3001, () => {
    console.log('Local server started on port 3001');
  });

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

  console.log(`Found ${urls.length} URLs to prerender.`);

  // 3. Launch Puppeteer
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  // 4. Prerender each URL
  for (const url of urls) {
    console.log(`Prerendering ${url}...`);
    const page = await browser.newPage();
    
    // Intercept network requests to block unnecessary resources (optional, for speed)
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      if (['image', 'stylesheet', 'font'].includes(req.resourceType())) {
        req.continue(); // We might need stylesheets for correct rendering if we wait for layout, but for SEO HTML is enough. Let's just continue all to be safe.
      } else {
        req.continue();
      }
    });

    try {
      await page.goto(`http://localhost:3001${url}`, { waitUntil: 'networkidle0', timeout: 30000 });
      
      // Wait for React to mount (e.g., wait for a specific element or just a small delay)
      await page.waitForSelector('#root > div', { timeout: 10000 }).catch(() => {});
      
      // Get the HTML
      const html = await page.content();

      // Determine file path
      const routePath = url === '/' ? '/index.html' : `${url}/index.html`;
      const filePath = path.join(distPath, routePath);
      const dirPath = path.dirname(filePath);

      // Create directory if it doesn't exist
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }

      // Write HTML file
      fs.writeFileSync(filePath, html);
      console.log(`Saved ${routePath}`);
    } catch (error) {
      console.error(`Error prerendering ${url}:`, error);
    } finally {
      await page.close();
    }
  }

  // 5. Cleanup
  await browser.close();
  server.close();
  console.log('Pre-rendering completed successfully!');
}

prerender().catch(err => {
  console.error('Prerendering failed:', err);
  process.exit(1);
});
