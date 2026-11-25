import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';
import { createServer } from 'vite';

const root = fileURLToPath(new URL('../../', import.meta.url));
const mockClient = readFileSync(new URL('./pm-admin-supabase.mjs', import.meta.url), 'utf8');
const storagePrefix = '/__pm-browser-test/storage/';

export const pmRoute = '/admin/pm-estimates';
export const menuLink = `nav a[href="${pmRoute}"]`;

// Each run owns a loopback-only server, a fresh browser profile and all fixture objects.
export async function startPmAdminBrowser(workspaceHtml) {
  const requests = [];
  const errors = [];
  const fixture = {
    name: 'pm-admin-browser-fixture',
    enforce: 'pre',
    transform(_source, id) {
      if (id.replaceAll('\\', '/').endsWith('/src/supabase.ts')) return { code: mockClient, map: null };
    },
    configureServer(server) {
      server.middlewares.use(storagePrefix, (req, res) => {
        const cookies = req.headers.cookie || '';
        const name = decodeURIComponent(new URL(req.url, 'http://localhost').pathname.slice(1));
        requests.push(name);
        res.setHeader('Cache-Control', 'no-store');
        if (!/(?:^|; )pm-test-user=owner-[ab](?:;|$)/.test(cookies) || !name.startsWith('pm-estimates-private/')) {
          res.writeHead(403).end();
        } else if (cookies.includes('pm-test-storage=unavailable')) {
          res.writeHead(503).end();
        } else if (name === 'pm-estimates-private/workspace.html') {
          res.setHeader('Content-Type', 'text/html;charset=utf-8');
          res.end(workspaceHtml);
        } else {
          res.setHeader('Content-Type', 'application/octet-stream');
          res.end('test document');
        }
      });
    },
  };

  const server = await createServer({
    root, plugins: [fixture], logLevel: 'error', mode: 'test',
    server: { host: '127.0.0.1', port: 0, hmr: false, watch: null },
  });
  let browser;
  try {
    await server.listen();
    const origin = `http://127.0.0.1:${server.httpServer.address().port}`;
    const windowsChrome = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
    browser = await puppeteer.launch({
      executablePath: process.env.CHROME_PATH || (existsSync(windowsChrome) ? windowsChrome : undefined),
      args: ['--no-sandbox', '--disable-background-networking', '--disable-gpu',
        '--host-resolver-rules=MAP * ~NOTFOUND, EXCLUDE localhost, EXCLUDE 127.0.0.1'],
    });
    const page = await browser.newPage();
    page.on('pageerror', error => errors.push(error.message));
    await page.setViewport({ width: 1440, height: 1000 });
    const cookie = (name, value) => browser.defaultBrowserContext().setCookie({ url: origin, name, value });
    return {
      browser, page, origin, requests, errors, cookie,
      as: identity => cookie('pm-test-user', identity),
      go: path => page.goto(origin + path, { waitUntil: 'domcontentloaded' }),
      close: async () => { try { await browser.close(); } finally { await server.close(); } },
    };
  } catch (error) {
    try { await browser?.close(); } finally { await server.close(); }
    throw error;
  }
}

export async function workspaceFrame(page, selector) {
  const iframe = await page.waitForSelector('iframe[title]');
  const frame = await iframe.contentFrame();
  await frame.waitForSelector(selector);
  return frame;
}
