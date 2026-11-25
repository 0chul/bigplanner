import assert from 'node:assert/strict';
import { mkdtemp, readFile, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { setTimeout as wait } from 'node:timers/promises';
import { menuLink, pmRoute, startPmAdminBrowser, workspaceFrame } from './fixtures/pm-admin-browser.mjs';

const fixtureHtml = `<!doctype html><html lang="ko" data-pm-account="__PM_ACCOUNT_ID__" data-pm-mode="__PM_PREVIEW_MODE__">
  <head><meta name="viewport" content="width=device-width, initial-scale=1"></head>
  <body><p id="fixture">Browser test document</p></body></html>`;
const sample = pmRoute + '?preview=sample';

test('the admin shell gates and loads the private workspace on desktop and mobile', async t => {
  const app = await startPmAdminBrowser(fixtureHtml);
  t.after(app.close);
  const { page } = app;

  for (const [identity, message] of [['guest', '관리자 로그인'], ['member', '접근 권한 없음']]) {
    await app.as(identity);
    for (const route of [pmRoute, sample]) {
      await app.go(route);
      await page.waitForFunction(text => document.querySelector('h1')?.textContent === text, {}, message);
      assert.equal(await page.$('iframe'), null);
      assert.equal(await page.$(menuLink), null);
      assert.deepEqual(app.requests, []);
    }
  }

  await app.as('owner-a');
  await app.go('/admin');
  await page.waitForSelector(menuLink, { visible: true });
  await page.click(menuLink);
  const frame = await workspaceFrame(page, '#fixture');
  assert.equal(await page.$eval(menuLink, el => el.getAttribute('aria-current')), 'page');
  assert.deepEqual(await frame.evaluate(() => ({ ...document.documentElement.dataset })), {
    pmAccount: 'owner-a', pmMode: 'estimate',
  });
  const workspace = 'pm-estimates-private/workspace.html';
  assert.ok(app.requests.includes(workspace));
  assert.ok(app.requests.every(key => key === workspace), 'document downloads should be on demand');

  const directory = await mkdtemp(join(tmpdir(), 'pm-ui-downloads-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const cdp = await page.createCDPSession();
  await cdp.send('Browser.setDownloadBehavior', { behavior: 'allow', downloadPath: directory });
  await page.locator('summary').filter(el => el.textContent.includes('제안 자료 다운로드')).click();
  const buttons = await page.$$('details[open] button');
  assert.equal(buttons.length, 3);
  for (const [index, button] of buttons.entries()) {
    await button.click();
    const deadline = Date.now() + 5000;
    while ((await readdir(directory)).filter(file => !file.endsWith('.crdownload')).length < index + 1) {
      assert.ok(Date.now() < deadline, 'timed out downloading document ' + (index + 1));
      await wait(50);
    }
  }
  const documents = ['pm-fees.docx', 'pm-package-comparison.docx', 'pm-proposal-sample.pdf'];
  for (const name of documents) assert.ok(app.requests.includes('pm-estimates-private/' + name));
  for (const file of await readdir(directory)) assert.equal(await readFile(join(directory, file), 'utf8'), 'test document');
  await cdp.detach();

  await app.as('owner-b');
  // GitHub Pages uses the SPA 404 recovery query on a cold deep link.
  await app.go('/?p=' + pmRoute + '&q=preview=sample');
  const preview = await workspaceFrame(page, '#fixture');
  assert.equal(page.url(), app.origin + sample);
  assert.deepEqual(await preview.evaluate(() => ({ ...document.documentElement.dataset })), {
    pmAccount: 'owner-b', pmMode: 'sample',
  });

  await app.cookie('pm-test-storage', 'unavailable');
  await app.go(pmRoute);
  await page.waitForFunction(() => document.body.textContent.includes('PM 견적 화면을 열 수 없습니다.'));
  assert.equal(await page.$('iframe'), null);
  await app.cookie('pm-test-storage', 'ready');
  const retry = '[role="alert"] + button';
  assert.equal(await page.$eval(retry, button => button.textContent.trim()), '다시 시도');
  await page.click(retry);
  await workspaceFrame(page, '#fixture');

  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await app.go('/admin');
  const openMenu = 'button[aria-label="관리자 메뉴 열기"]';
  await page.waitForSelector(openMenu, { visible: true });
  await page.click(openMenu);
  await page.locator(menuLink).click();
  await workspaceFrame(page, '#fixture');
  assert.equal(await page.$eval(openMenu, button => button.getAttribute('aria-expanded')), 'false');
  const fits = await page.$eval('iframe', iframe => {
    const box = iframe.getBoundingClientRect();
    return box.width > 300 && box.height > 350 && box.left >= 0 && box.right <= window.innerWidth
      && document.documentElement.scrollWidth <= window.innerWidth;
  });
  assert.ok(fits, 'the mobile workspace should fill the available width and remain visible');
  assert.deepEqual(app.errors, []);
});
