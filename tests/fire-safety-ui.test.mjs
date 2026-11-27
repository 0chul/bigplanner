import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer';

// Every Supabase request is intercepted. These tests never write production data.
const origin = process.env.FIRE_SAFETY_TEST_URL || 'http://127.0.0.1:4173';
const outputDirectory = path.resolve('coverage/fire-safety');
const apiHost = 'injrbniytgtubemniaps.supabase.co';
const responsiveWidths = [1440, 768, 375, 320];
const pause = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
const results = [];
const typographyEvidence = [];
const pages = [];
const errors = [];
await mkdir(outputDirectory, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH || (process.platform === 'win32' && existsSync('C:/Program Files/Google/Chrome/Application/chrome.exe') ? 'C:/Program Files/Google/Chrome/Application/chrome.exe' : undefined),
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-background-networking'],
});

async function check(name, action) {
  console.log(`CHECK ${name}`);
  try {
    await action();
    results.push({ name, status: 'PASS' });
    console.log(`PASS ${name}`);
  } catch (error) {
    results.push({ name, status: 'FAIL', error: error.message });
    console.error(`FAIL ${name}: ${error.message}`);
  }
}

async function newPage(width = 1440, height = 1000) {
  const page = await browser.newPage();
  pages.push(page);
  await page.setViewport({ width, height, deviceScaleFactor: 1 });
  page.setDefaultTimeout(10000);
  page.on('pageerror', (error) => errors.push(error.message));
  const state = { posts: [], responses: [], unexpectedApiCalls: [] };
  await page.setRequestInterception(true);
  page.on('request', async (request) => {
    if (request.isInterceptResolutionHandled()) return;
    try {
      const url = new URL(request.url());
      if (/google-analytics\.com$|googletagmanager\.com$|analytics\.google\.com$/.test(url.hostname)) {
        await request.abort();
        return;
      }
      if (url.hostname === apiHost) {
        const headers = {
          'access-control-allow-origin': '*',
          'access-control-allow-headers': '*',
          'access-control-allow-methods': 'GET,HEAD,POST,PATCH,DELETE,OPTIONS',
          'access-control-expose-headers': 'content-range',
          'content-type': 'application/json',
        };
        if (request.method() === 'OPTIONS') {
          await request.respond({ status: 204, headers });
          return;
        }
        if (url.pathname.endsWith('/fire_safety_demo_requests') && request.method() === 'POST') {
          const raw = JSON.parse(request.postData() || '{}');
          state.posts.push(Array.isArray(raw) ? raw[0] : raw);
          const response = state.responses.shift() || { status: 201, body: '' };
          if (response.delay) await pause(response.delay);
          await request.respond({ status: response.status, headers, body: typeof response.body === 'string' ? response.body : JSON.stringify(response.body || {}) });
          return;
        }
        // No real API calls are allowed, including incidental auth or image calls.
        state.unexpectedApiCalls.push({ method: request.method(), path: url.pathname });
        await request.respond({ status: 200, headers, body: '[]' });
        return;
      }
      await request.continue();
    } catch (error) {
      if (!request.isInterceptResolutionHandled()) await request.abort().catch(() => {});
      if (!page.isClosed()) errors.push(`Mock request failure: ${error.message}`);
    }
  });
  return { page, state };
}

async function navigate(page) {
  await page.goto(`${origin}/fire-safety-ai`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.fa-form-submit');
  await page.evaluate(() => document.fonts.ready);
}

async function setInput(page, id, value) {
  await page.$eval(`#${id}`, (input) => { input.scrollIntoView({ block: 'center' }); });
  await page.click(`#${id}`, { clickCount: 3 });
  await page.keyboard.press('Backspace');
  if (value) await page.type(`#${id}`, value);
}

async function fillValid(page, overrides = {}) {
  const data = { company: 'QA Example Building', name: 'QA Contact', email: 'qa-demo@example.invalid', role: 'site', ...overrides };
  await setInput(page, 'fa-demo-company', data.company);
  await setInput(page, 'fa-demo-name', data.name);
  await setInput(page, 'fa-demo-email', data.email);
  await page.select('#fa-demo-role', data.role);
  const consent = await page.$eval('#fa-demo-consent', (input) => input.checked);
  if (!consent) await page.click('#fa-demo-consent');
  return data;
}

async function submit(page) {
  await page.$eval('.fa-form-submit', (button) => button.scrollIntoView({ block: 'center' }));
  await page.click('.fa-form-submit');
}

async function waitForPosts(state, count) {
  for (let index = 0; index < 100 && state.posts.length < count; index += 1) await pause(30);
  assert.equal(state.posts.length, count, 'Expected mocked application POST count');
}

async function captureComponent(page, selector, filename) {
  // Isolated component captures omit fixed page chrome; viewport captures retain it.
  const chrome = await page.addStyleTag({ content: '.fa-header,.fa-mobile-cta{visibility:hidden!important}' });
  try {
    await (await page.$(selector)).screenshot({ path: path.join(outputDirectory, filename) });
  } finally {
    await chrome.evaluate((element) => element.remove());
  }
}

async function scrollProductScenario(page, index) {
  const layout = await page.$eval('.fa-product-scroll', (element) => element.dataset.layout);
  const selector = layout === 'sticky'
    ? `#fa-product-chapter-${index}`
    : `.fa-product-scene[data-scenario="${index}"]`;
  await page.$eval(selector, (element) => element.scrollIntoView({ behavior: 'auto', block: 'center' }));
  await page.waitForSelector(`.fa-product-scroll[data-scenario="${index}"]`);
}

try {
  const desktop = await newPage();
  await navigate(desktop.page);

  await check('desktop content, metadata and CTA destinations', async () => {
    const { page } = desktop;
    assert.equal(await page.$$eval('h1', (items) => items.length), 1);
    const heading = await page.$eval('h1', (item) => item.textContent);
    assert.match(heading, /반복 응대는 줄이고,.*현장 업무에.*집중하세요/s);
    assert.match(await page.title(), /방재실 AI 민원 도우미/);
    assert.equal(await page.$eval('html', (item) => item.lang), 'ko');
    assert.equal(await page.$$eval('meta[name="description"]', (items) => items.length), 1);
    assert.match(await page.$eval('meta[name="description"]', (item) => item.content), /방재실/);
    for (const id of ['workflow', 'benefits', 'case-study', 'process', 'demo-request']) assert.ok(await page.$(`#${id}`), id);
    assert.equal(await page.$$eval('a[href="#demo-request"]', (items) => items.length >= 4), true);
    assert.match(await page.$eval('.fa-case-evidence', (item) => item.textContent), /59.*0.*2026.*9.*23.*10.*22/s);
    assert.match(await page.$eval('.fa-product-caption', (item) => item.textContent), /가상 데이터.*실제 알림 미발송/);
  });

  await check('desktop scroll story follows all four stages forwards and backwards for the same incident', async () => {
    const { page } = desktop;
    await page.bringToFront();
    assert.equal(await page.$$eval('.fa-story-chapter', (items) => items.length), 4);
    assert.equal(await page.$$eval('.fa-scroll-story .fa-story-disclosure', (items) => items.length), 1);
    assert.match(await page.$eval('.fa-story-disclosure', (item) => item.textContent), /가상 데이터.*실제 알림 미발송/);
    assert.equal(await page.$eval('.fa-story-sticky', (item) => getComputedStyle(item).position), 'sticky');
    assert.equal(await page.$$eval('.fa-story-panel-mobile', (items) => items.every((item) => getComputedStyle(item).display === 'none')), true);
    for (const index of [0, 1, 2, 3, 2, 1, 0]) {
      await page.$eval(`.fa-story-chapter[data-step="${index}"]`, (chapter) => chapter.scrollIntoView({ behavior: 'auto', block: 'center' }));
      await page.waitForSelector(`.fa-scroll-story[data-step="${index}"] .fa-story-sticky > .fa-story-panel[data-stage="${index}"]`);
      const panel = await page.$eval('.fa-story-sticky > .fa-story-panel', (item) => ({
        label: item.getAttribute('aria-label'),
        casebar: item.querySelector('.fa-story-casebar').textContent,
        artwork: item.querySelector('.fa-story-art').getAttribute('aria-label') ?? item.querySelector('.fa-story-art img')?.alt,
      }));
      assert.match(panel.artwork, [/가상 빌딩/, /매뉴얼.*냉방.*현장 확인/, /관리자.*시설 담당자.*DEMO-012/, /DEMO-012.*교대 일지/][index]);
      assert.match(panel.label, /DEMO-012.*가상 빌딩.*5층 공용 회의실.*냉방이 약해요/);
      assert.match(panel.casebar, /가상 빌딩.*DEMO-012/);
      assert.equal(await page.$eval(`.fa-story-nav button:nth-child(${index + 1})`, (button) => button.getAttribute('aria-current')), 'step');
      assert.equal(await page.$$eval('.fa-story-nav [aria-current="step"]', (items) => items.length), 1);
    }
    assert.equal(desktop.state.posts.length, 0);
  });

  await check('advertised fragments survive lazy rendering and browser back at desktop and mobile sizes', async () => {
    const routes = [
      ['/fire-safety-ai/?utm_source=facebook&utm_medium=organic_social&utm_campaign=fire_safety_launch&utm_content=site_post#demo-request', 'demo-request'],
      ['/fire-safety-ai/?utm_source=handoff_checklist&utm_medium=referral&utm_campaign=fire_safety_launch#product-demo', 'product-demo'],
      ['/service/?tab=management#tenant-assistant-title', 'tenant-assistant-title'],
    ];
    for (const { width, height } of [{ width: 1365, height: 900 }, { width: 390, height: 844 }]) {
      const { page, state } = await newPage(width, height);
      try {
        await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
        const waitForFragment = (id) => page.waitForFunction((targetId) => {
          const target = document.getElementById(targetId);
          const top = target?.getBoundingClientRect().top;
          return location.hash === `#${targetId}` && scrollY > 0 &&
            top !== undefined && top >= -2 && top < innerHeight / 2;
        }, {}, id);

        for (const [route, id] of routes) {
          await page.goto(`${origin}${route}`, { waitUntil: 'domcontentloaded' });
          await page.waitForNetworkIdle();
          await waitForFragment(id);
        }
        await page.goBack({ waitUntil: 'domcontentloaded' });
        await page.waitForNetworkIdle();
        await waitForFragment('product-demo');

        await page.goto(`${origin}/`, { waitUntil: 'domcontentloaded' });
        const homeDemoLink = '#services-overview a[href="/fire-safety-ai/"]';
        await page.waitForSelector(homeDemoLink);
        await page.click(homeDemoLink);
        await page.waitForFunction(() => location.pathname === '/fire-safety-ai/' &&
          !location.hash && scrollY <= 1 && document.querySelector('#demo-request'));
        assert.equal(state.posts.length, 0);
      } finally {
        await page.close();
      }
    }
  });

  await check('mobile scroll story keeps four static panels in natural document order', async () => {
    const mobile = await newPage(375, 900);
    try {
      const { page } = mobile;
      await navigate(page);
      assert.equal(await page.$eval('.fa-story-sticky', (item) => getComputedStyle(item).display), 'none');
      const panels = await page.$$eval('.fa-story-panel-mobile', (items) => items.map((item) => ({
        stage: item.dataset.stage,
        display: getComputedStyle(item).display,
        position: getComputedStyle(item).position,
        top: item.getBoundingClientRect().top,
        label: item.getAttribute('aria-label'),
      })));
      assert.deepEqual(panels.map((panel) => panel.stage), ['0', '1', '2', '3']);
      for (const [index, panel] of panels.entries()) {
        assert.notEqual(panel.display, 'none');
        assert.equal(panel.position, 'static');
        assert.match(panel.label, /DEMO-012.*가상 빌딩.*5층 공용 회의실.*냉방이 약해요/);
        if (index) assert.ok(panel.top > panels[index - 1].top, 'Mobile panels must remain in document order');
      }
      for (let index = 0; index < 4; index += 1) {
        await page.$eval(`.fa-story-chapter[data-step="${index}"]`, (chapter) => chapter.scrollIntoView({ behavior: 'auto', block: 'center' }));
        await page.waitForSelector(`.fa-scroll-story[data-step="${index}"]`);
        assert.deepEqual(await page.$$eval('.fa-story-panel-mobile', (items) => items.map((item) => item.dataset.stage)), ['0', '1', '2', '3']);
      }
      assert.equal(mobile.state.posts.length, 0);
    } finally {
      await mobile.page.close();
      await desktop.page.bringToFront();
    }
  });

  await check('reduced motion preserves story and product navigation without animation', async () => {
    const reduced = await newPage();
    try {
      await reduced.page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
      await navigate(reduced.page);
      await reduced.page.waitForSelector('.fa-scroll-story[data-reduced="true"]');
      assert.equal(await reduced.page.$eval('.fa-story-reduce', (button) => button.disabled), true);
      const animatedStyles = await reduced.page.$$eval('.fa-scroll-story *', (items) => items.map((item) => getComputedStyle(item).animationName).filter((name) => name !== 'none'));
      assert.deepEqual(animatedStyles, []);
      const imageStyles = await reduced.page.$$eval('.fa-story-art img', (items) => items.map((item) => ({
        transform: getComputedStyle(item).transform,
        transition: getComputedStyle(item).transitionDuration,
      })));
      for (const style of imageStyles) {
        assert.equal(style.transform, 'none');
        assert.equal(style.transition, '0s');
      }
      await reduced.page.click('.fa-story-nav button:nth-child(3)');
      await reduced.page.waitForSelector('.fa-scroll-story[data-step="2"] .fa-story-sticky > .fa-story-panel[data-stage="2"]');
      assert.equal(await reduced.page.$eval('.fa-story-nav button:nth-child(3)', (button) => button.getAttribute('aria-current')), 'step');
      await reduced.page.focus('#fa-scenario-0');
      await reduced.page.keyboard.press('End');
      await reduced.page.waitForSelector('.fa-product-scroll[data-scenario="2"]');
      assert.equal(await reduced.page.evaluate(() => document.activeElement.id), 'fa-scenario-2');
      const productMotion = await reduced.page.$$eval('.fa-product-scene-transition, .fa-product-scene, .fa-product-scene *', (items) => items.map((item) => ({
        animation: getComputedStyle(item).animationName,
        transition: getComputedStyle(item).transitionDuration,
      })));
      assert.ok(productMotion.length > 0);
      for (const style of productMotion) {
        assert.equal(style.animation, 'none');
        assert.equal(style.transition, '0s');
      }
      await reduced.page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }]);
      await reduced.page.waitForFunction(() => !document.querySelector('.fa-story-reduce').disabled);
      await reduced.page.click('.fa-story-reduce');
      await reduced.page.waitForSelector('.fa-scroll-story[data-reduced="true"]');
      assert.equal(await reduced.page.$eval('.fa-story-reduce', (button) => button.getAttribute('aria-pressed')), 'true');
      await reduced.page.click('.fa-story-nav button:nth-child(1)');
      await reduced.page.waitForSelector('.fa-scroll-story[data-step="0"]');
    } finally {
      await reduced.page.close();
      await desktop.page.bringToFront();
    }
  });

  await check('desktop product scenes reveal all three inquiries on forward and reverse scrolling', async () => {
    const { page } = desktop;
    await page.setViewport({ width: 1440, height: 1200, deviceScaleFactor: 1 });
    await page.waitForSelector('.fa-product-scroll[data-layout="sticky"]');
    const inquiries = [
      { record: 'DEMO-011', text: /주차/ },
      { record: 'DEMO-012', text: /냉방/ },
      { record: 'DEMO-013', text: /주말/ },
    ];
    for (const index of [0, 1, 2, 1, 0]) {
      await scrollProductScenario(page, index);
      await page.waitForSelector(`.fa-product-scroll[data-layout="sticky"] .fa-product-scene[data-scenario="${index}"]`);
      assert.equal(await page.$$eval('.fa-product-scene', (items) => items.length), 1, 'Desktop must expose only the current scene');
      const scene = `.fa-product-scene[data-scenario="${index}"]`;
      assert.match(await page.$eval(`${scene} .fa-chat-user`, (item) => item.textContent), inquiries[index].text);
      assert.equal(await page.$eval(`${scene} .fa-record-id`, (item) => item.textContent.trim()), inquiries[index].record);
      assert.match(await page.$eval(`${scene} .fa-chat-receipt`, (item) => item.textContent), new RegExp(inquiries[index].record));
      assert.equal(await page.$eval(`#fa-scenario-${index}`, (item) => item.getAttribute('aria-current')), 'step');
      assert.equal(await page.$$eval('.fa-product-tabs [aria-current="step"]', (items) => items.length), 1);
      assert.equal(await page.$$eval('.fa-product-tabs [role="tab"]', (items) => items.length), 0);
    }
    assert.equal(desktop.state.posts.length, 0);
    assert.equal(desktop.state.unexpectedApiCalls.some((request) => !['GET', 'HEAD'].includes(request.method)), false);
  });

  await check('product keyboard navigation preserves each scene assignment without sending notifications', async () => {
    const { page } = desktop;
    await scrollProductScenario(page, 1);
    const requestScene = '.fa-product-scene[data-scenario="1"]';
    assert.equal(await page.$eval(`${requestScene} .fa-record-assignment button`, (item) => item.textContent.trim()), '담당자 지정');
    await page.click(`${requestScene} .fa-record-assignment button`);
    await page.waitForSelector(`${requestScene} .fa-example-notice`);
    assert.equal(await page.$eval(`${requestScene} .fa-example-notice`, (item) => item.textContent.trim()), '담당자 전달');
    await scrollProductScenario(page, 2);
    assert.equal(await page.$eval('.fa-product-scene[data-scenario="2"] .fa-record-assignment button', (item) => item.getAttribute('aria-pressed')), 'false');
    await scrollProductScenario(page, 1);
    assert.equal(await page.$eval(`${requestScene} .fa-record-assignment button`, (item) => item.getAttribute('aria-pressed')), 'true');
    assert.equal(await page.$eval(`${requestScene} .fa-record-assignment button`, (item) => item.textContent.trim()), '담당자 지정됨');
    await page.focus('#fa-scenario-1');
    await page.keyboard.press('End');
    await page.waitForSelector('.fa-product-scroll[data-scenario="2"]');
    assert.equal(await page.evaluate(() => document.activeElement.id), 'fa-scenario-2');
    assert.match(await page.$eval('.fa-product-scene[data-scenario="2"] .fa-chat-bot', (item) => item.textContent), /담당자의 확인/);
    await page.keyboard.press('Home');
    await page.waitForSelector('.fa-product-scroll[data-scenario="0"]');
    assert.equal(await page.evaluate(() => document.activeElement.id), 'fa-scenario-0');
    await page.keyboard.press('ArrowRight');
    await page.waitForSelector('.fa-product-scroll[data-scenario="1"]');
    assert.equal(await page.evaluate(() => document.activeElement.id), 'fa-scenario-1');
    assert.equal(await page.$eval(`${requestScene} .fa-record-assignment button`, (item) => item.getAttribute('aria-pressed')), 'true');
    assert.match(await page.$eval('.fa-product-caption', (item) => item.textContent), /가상 데이터.*실제 알림 미발송/);
    assert.equal(desktop.state.posts.length, 0);
    assert.equal(desktop.state.unexpectedApiCalls.some((request) => !['GET', 'HEAD'].includes(request.method)), false);
    await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1 });
  });

  await check('mobile and short viewports expose all product scenes in document order with keyboard jumps', async () => {
    for (const viewport of [{ width: 375, height: 900 }, { width: 1440, height: 700 }]) {
      const fallback = await newPage(viewport.width, viewport.height);
      try {
        const { page } = fallback;
        await page.bringToFront();
        await navigate(page);
        await page.waitForSelector('.fa-product-scroll[data-layout="natural"]');
        const scenes = await page.$$eval('.fa-product-scene', (items) => items.map((item) => ({
          scenario: item.dataset.scenario,
          display: getComputedStyle(item).display,
          position: getComputedStyle(item).position,
          width: item.getBoundingClientRect().width,
          height: item.getBoundingClientRect().height,
          top: item.getBoundingClientRect().top,
          text: item.textContent,
        })));
        assert.deepEqual(scenes.map((scene) => scene.scenario), ['0', '1', '2']);
        for (const [index, scene] of scenes.entries()) {
          assert.notEqual(scene.display, 'none');
          assert.equal(['absolute', 'fixed', 'sticky'].includes(scene.position), false);
          assert.ok(scene.width > 0 && scene.height > 0);
          assert.match(scene.text, new RegExp(`DEMO-01${index + 1}`));
          if (index) assert.ok(scene.top > scenes[index - 1].top);
        }
        await page.focus('#fa-scenario-0');
        await page.keyboard.press('End');
        await page.waitForSelector('.fa-product-scroll[data-scenario="2"]');
        assert.equal(await page.evaluate(() => document.activeElement.id), 'fa-scenario-2');
        await page.keyboard.press('Home');
        await page.waitForSelector('.fa-product-scroll[data-scenario="0"]');
        assert.equal(await page.evaluate(() => document.activeElement.id), 'fa-scenario-0');
        assert.equal(await page.$$eval('.fa-product-scene', (items) => items.length), 3);
        const assignment = '.fa-product-scene[data-scenario="1"] .fa-record-assignment button';
        await page.click(assignment);
        assert.equal(await page.$eval(assignment, (item) => item.getAttribute('aria-pressed')), 'true');
        assert.equal(await page.$eval('.fa-product-scene[data-scenario="2"] .fa-record-assignment button', (item) => item.getAttribute('aria-pressed')), 'false');
        assert.equal(fallback.state.posts.length, 0);
        assert.equal(fallback.state.unexpectedApiCalls.some((request) => !['GET', 'HEAD'].includes(request.method)), false);
      } finally {
        await fallback.page.close();
      }
    }
    await desktop.page.bringToFront();
  });

  await check('FAQ and privacy disclosures expand and collapse', async () => {
    const { page } = desktop;
    await page.click('.fa-faq-list details:nth-child(2) summary');
    assert.equal(await page.$eval('.fa-faq-list details:nth-child(2)', (item) => item.open), true);
    await page.click('.fa-faq-list details:nth-child(2) summary');
    assert.equal(await page.$eval('.fa-faq-list details:nth-child(2)', (item) => item.open), false);
    await page.click('#demo-privacy summary');
    assert.equal(await page.$eval('#demo-privacy', (item) => item.open), true);
    assert.match(await page.$eval('#demo-privacy', (item) => item.textContent), /최대 90일/);
  });

  await check('form validation blocks empty, whitespace, email and fractional count errors', async () => {
    const { page, state } = desktop;
    await submit(page);
    await page.waitForSelector('#fa-demo-company[aria-invalid="true"]');
    await page.waitForFunction(() => document.activeElement.id === 'fa-demo-company');
    assert.equal(await page.evaluate(() => document.activeElement.id), 'fa-demo-company');
    assert.equal(await page.$$eval('[aria-invalid="true"]', (items) => items.length), 5);
    await fillValid(page, { company: '   ', email: 'broken@address' });
    await setInput(page, 'fa-demo-buildingCount', '1.5');
    await submit(page);
    for (const id of ['company', 'email', 'buildingCount']) {
      assert.equal(await page.$eval(`#fa-demo-${id}`, (item) => item.getAttribute('aria-invalid')), 'true');
    }
    assert.equal(state.posts.length, 0);
  });

  await check('pending submission waits for acknowledgement and suppresses duplicates', async () => {
    const { page, state } = desktop;
    await fillValid(page);
    await setInput(page, 'fa-demo-buildingCount', '');
    state.responses.push({ status: 201, body: '', delay: 700 });
    await submit(page);
    await waitForPosts(state, 1);
    assert.equal(await page.$('.fa-form-success'), null, 'Cannot show success before server acknowledgement');
    assert.equal(await page.$eval('.fa-form-submit', (item) => item.disabled), true);
    await page.$eval('form', (form) => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });
    await page.waitForSelector('.fa-form-success');
    assert.equal(state.posts.length, 1);
    assert.equal(state.posts[0].building_count, null);
    assert.equal(state.posts[0].source_path, '/fire-safety-ai');
    assert.equal(state.posts[0].consent_granted, true);
    assert.equal(await page.evaluate(() => document.activeElement.classList.contains('fa-form-success')), true);
    const events = await page.evaluate(() => (window.dataLayer || []).map((item) => Array.from(item)));
    const eventText = JSON.stringify(events);
    for (const personalValue of ['qa-demo@example.invalid', 'QA Example Building', 'QA Contact']) assert.equal(eventText.includes(personalValue), false);
    assert.match(eventText, /fire_safety_demo_request_success/);
  });

  await check('network failure preserves values, same retry UUID resolves a prior saved request', async () => {
    const { page, state } = await newPage();
    await navigate(page);
    const expected = await fillValid(page);
    state.responses.push({ status: 503, body: { code: 'XX000', message: 'Temporary test failure' } });
    await submit(page);
    await page.waitForSelector('.fa-form-submit-error');
    assert.equal(await page.$eval('#fa-demo-company', (item) => item.value), expected.company);
    assert.equal(await page.$eval('#fa-demo-email', (item) => item.value), expected.email);
    assert.equal(await page.$eval('#fa-demo-consent', (item) => item.checked), true);
    state.responses.push({ status: 409, body: { code: '23505', message: 'duplicate key value violates unique constraint "fire_safety_demo_requests_pkey"' } });
    await submit(page);
    await page.waitForSelector('.fa-form-success');
    assert.equal(state.posts.length, 2);
    assert.equal(state.posts[0].id, state.posts[1].id);
  });

  await check('editing a failed application creates a new request ID and does not hide new errors', async () => {
    const { page, state } = await newPage();
    await navigate(page);
    await fillValid(page);
    state.responses.push({ status: 503, body: { code: 'XX000', message: 'Temporary test failure' } });
    await submit(page);
    await page.waitForSelector('.fa-form-submit-error');
    await setInput(page, 'fa-demo-company', 'QA Edited Company');
    state.responses.push({ status: 409, body: { code: '23505', message: 'duplicate key value violates unique constraint "some_other_constraint"' } });
    await submit(page);
    await page.waitForSelector('.fa-form-submit-error');
    assert.equal(await page.$('.fa-form-success'), null);
    assert.equal(state.posts.length, 2);
    assert.notEqual(state.posts[0].id, state.posts[1].id);
    assert.equal(await page.$eval('#fa-demo-company', (item) => item.value), 'QA Edited Company');
    state.responses.push({ status: 201, body: '' });
    await submit(page);
    await page.waitForSelector('.fa-form-success');
    assert.equal(state.posts[1].id, state.posts[2].id);
  });

  await check('English demo CTA opens an English form with the same consent and retry contract', async () => {
    const { page, state } = await newPage(320, 568);
    await page.goto(`${origin}/fire-safety-ai/en/#contact`, { waitUntil: 'domcontentloaded' });
    const cta = '#contact .links a.button';
    assert.equal(await page.$eval(cta, (link) => link.textContent.trim()), 'Request a demo online');
    assert.equal(await page.$eval('#contact .links a[href^="mailto:"]', (link) => link.textContent.trim()), 'Request a demo by email');

    const [response] = await Promise.all([
      page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
      page.click(cta),
    ]);
    assert.equal(response.status(), 200);
    const requestUrl = new URL(page.url());
    assert.equal(requestUrl.pathname, '/fire-safety-ai/en/request/');
    assert.deepEqual(Object.fromEntries(requestUrl.searchParams), {
      utm_source: 'international',
      utm_medium: 'referral',
      utm_campaign: 'fire_safety_global',
      utm_content: 'en',
    });
    await page.waitForSelector('.fa-form-submit');
    await page.waitForSelector('head meta[name="robots"]');
    assert.equal(await page.$eval('html', (element) => element.lang), 'en');
    assert.deepEqual(await page.$$eval('head meta[name="robots"]', (tags) => tags.map((tag) => tag.content)), ['noindex, follow']);
    assert.equal(await page.$eval('.fa-form-submit', (button) => button.textContent.trim()), 'Submit demo request');
    assert.equal(await page.$eval('.fa-form-heading h2', (heading) => heading.getBoundingClientRect().bottom < innerHeight), true);

    const privacy = '#demo-privacy';
    const consent = '#fa-demo-consent';
    const summary = privacy + ' summary';
    await page.waitForSelector(summary, { visible: true });
    assert.equal(await page.$eval(summary, (element) => element.textContent.trim()), 'How we collect and use your personal information');
    assert.equal(await page.$eval(privacy, (notice, checkbox) =>
      Boolean(notice.compareDocumentPosition(document.querySelector(checkbox)) & Node.DOCUMENT_POSITION_FOLLOWING), consent), true);
    assert.equal(await page.$eval(consent, (input) => input.checked), false);
    await page.click(summary);
    await page.waitForSelector(privacy + '[open] dl', { visible: true });
    assert.match(await page.$eval(privacy, (notice) => notice.innerText), /Up to 90 days from the date we receive your request/);
    assert.equal(await page.$eval(consent, (input) => input.checked), false);

    await submit(page);
    await page.waitForFunction(() => document.activeElement?.id === 'fa-demo-company');
    assert.equal(await page.$eval('#fa-demo-company-error', (error) => error.textContent), 'Enter a company or organization name of 120 characters or fewer.');
    assert.equal(state.posts.length, 0);

    const inputValues = [
      ['fa-demo-company', 'QA Example Building'],
      ['fa-demo-name', 'QA Contact'],
      ['fa-demo-email', 'qa-demo@example.invalid'],
      ['fa-demo-buildingCount', '3'],
      ['fa-demo-interests', 'Review cooling requests and shift handovers.'],
    ];
    for (const [id, value] of inputValues) await setInput(page, id, value);
    assert.equal(await page.$eval('#fa-demo-role option[value="site"]', (option) => option.textContent), 'On-site management or facilities team');
    await page.select('#fa-demo-role', 'site');
    await submit(page);
    await page.waitForFunction(() => document.activeElement?.id === 'fa-demo-consent');
    assert.deepEqual(await page.$$eval('form [aria-invalid="true"]', (fields) => fields.map((field) => field.id)), ['fa-demo-consent']);
    assert.equal(await page.$eval('#fa-demo-consent-error', (error) => error.textContent), 'Please agree to the collection and use of personal information for your demo request.');
    assert.equal(state.posts.length, 0);

    await page.click(consent);
    state.responses.push({ status: 503, body: { code: 'XX000', message: 'Temporary test failure' } });
    await submit(page);
    await waitForPosts(state, 1);
    await page.waitForSelector('.fa-form-submit-error');
    assert.match(await page.$eval('.fa-form-submit-error', (error) => error.textContent), /Your details are still here/);
    assert.equal(await page.$('.fa-form-success'), null);

    for (const [id, value] of inputValues) {
      assert.equal(await page.$eval('#' + id, (input) => input.value), value);
    }
    assert.equal(await page.$eval('#fa-demo-role', (input) => input.value), 'site');
    assert.equal(await page.$eval(consent, (input) => input.checked), true);
    const { id, ...record } = state.posts[0];
    assert.match(id, /^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i);
    assert.deepEqual(record, {
      company_name: 'QA Example Building',
      contact_name: 'QA Contact',
      email: 'qa-demo@example.invalid',
      role: 'site',
      building_count: 3,
      interests: 'Review cooling requests and shift handovers.',
      consent_granted: true,
      consent_version: 'fire-safety-demo-v1-2026-11-17',
      source_path: '/fire-safety-ai',
    });

    state.responses.push({ status: 201, body: '' });
    await submit(page);
    await waitForPosts(state, 2);
    await page.waitForSelector('.fa-form-success');
    assert.deepEqual(state.posts[1], state.posts[0]);
    assert.equal(await page.$eval('.fa-form-success h2', (heading) => heading.textContent), 'We received your demo request.');
    await page.close();
  });

  await check('Arabic demo CTA opens an RTL form with localized consent, validation and retry', async () => {
    const copy = JSON.parse(await readFile(new URL('../src/components/fireSafetyDemoRequestLocales/ar.json', import.meta.url), 'utf8'));
    const { page, state } = await newPage(320, 568);
    try {
      await page.goto(`${origin}/fire-safety-ai/ar/#contact`, { waitUntil: 'domcontentloaded' });
      const [response] = await Promise.all([
        page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
        page.click('#contact .links a.button'),
      ]);
      assert.equal(response.status(), 200);
      const requestUrl = new URL(page.url());
      assert.equal(requestUrl.pathname, '/fire-safety-ai/ar/request/');
      assert.deepEqual(Object.fromEntries(requestUrl.searchParams), {
        utm_source: 'international',
        utm_medium: 'referral',
        utm_campaign: 'fire_safety_global',
        utm_content: 'ar',
      });

      await page.waitForSelector('.fa-form-submit');
      await page.waitForFunction(() => document.documentElement.lang === 'ar' && document.documentElement.dir === 'rtl');
      assert.deepEqual(await page.$$eval('head meta[name="robots"]', (tags) => tags.map((tag) => tag.content)), ['noindex, follow']);
      assert.equal(await page.$eval('.fa-form-submit', (button) => button.textContent.trim()), copy.form.submit);
      assert.deepEqual(await page.$$eval('#fa-demo-role option:not([value=""])', (options) =>
        options.map((option) => [option.value, option.textContent])), Object.entries(copy.form.roles));
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), 320);

      const privacy = '#demo-privacy';
      const consent = '#fa-demo-consent';
      const summary = privacy + ' summary';
      await page.waitForSelector(summary, { visible: true });
      assert.equal(await page.$eval(summary, (element) => element.textContent.trim()), copy.form.privacy.title);
      assert.equal(await page.$eval(privacy, (notice, checkbox) =>
        Boolean(notice.compareDocumentPosition(document.querySelector(checkbox)) & Node.DOCUMENT_POSITION_FOLLOWING), consent), true);
      assert.deepEqual(await page.$eval(consent, (input) => [input.checked, input.required]), [false, true]);
      await page.focus(summary);
      await page.keyboard.press('Enter');
      await page.waitForSelector(privacy + '[open] dl', { visible: true });
      const retention = await page.$eval(privacy + ' dl > div:nth-child(4) dd', (element) => element.textContent);
      assert.equal(retention, copy.form.privacy.rows[3][1]);
      assert.match(retention, /90/);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), 320);

      await submit(page);
      await page.waitForFunction(() => document.activeElement?.id === 'fa-demo-company');
      assert.equal(await page.$eval('#fa-demo-company-error', (error) => error.textContent), copy.errors.company);
      assert.equal(await page.$eval('#fa-demo-consent-error', (error) => error.textContent), copy.errors.consent);
      assert.equal(state.posts.length, 0);

      const values = await fillValid(page, { company: 'QA Arabic Locale Building', email: 'qa-ar@example.invalid' });
      state.responses.push({ status: 503, body: { code: 'XX000', message: 'Temporary test failure' } });
      await submit(page);
      await waitForPosts(state, 1);
      await page.waitForSelector('.fa-form-submit-error p');
      assert.equal(await page.$eval('.fa-form-submit-error p', (error) => error.textContent), copy.form.failedRequest);
      assert.equal(await page.$eval('#fa-demo-email', (input) => input.value), values.email);
      assert.deepEqual(await page.$eval(consent, (input) => [input.checked, input.required]), [true, true]);
      const { id, ...record } = state.posts[0];
      assert.match(id, /^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i);
      assert.deepEqual(record, {
        company_name: values.company,
        contact_name: values.name,
        email: values.email,
        role: 'site',
        building_count: null,
        interests: '',
        consent_granted: true,
        consent_version: 'fire-safety-demo-v1-2026-11-17',
        source_path: '/fire-safety-ai',
      });

      state.responses.push({ status: 201, body: '' });
      await submit(page);
      await waitForPosts(state, 2);
      await page.waitForSelector('.fa-form-success h2');
      assert.deepEqual(state.posts[1], state.posts[0]);
      assert.equal(await page.$eval('.fa-form-success h2', (heading) => heading.textContent), copy.form.successTitle);
    } finally {
      await page.close();
    }
  });

  await check('desktop, tablet and mobile layouts keep important controls within viewport width', async () => {
    const { page } = desktop;
    await page.bringToFront();
    const layoutIssues = [];
    for (const width of responsiveWidths) {
      await page.setViewport({ width, height: 1000, deviceScaleFactor: 1 });
      await page.evaluate(() => window.scrollTo(0, 0));
      await pause(100);
      const geometry = await page.evaluate(() => {
        const selectors = ['.fa-header-inner', '.fa-intro-copy', '.fa-intro-incident', '.fa-scroll-story', '.fa-story-toolbar', '.fa-story-nav', '.fa-story-panel', '.fa-story-chapter-copy', '.fa-workflow-demo', '.fa-product-scroll', '.fa-product-scene', '.fa-product', '.fa-chat-screen', '.fa-admin-screen', '.fa-benefit-panel', '.fa-demo-grid', '.fa-form-panel', 'h1'];
        const outside = selectors.flatMap((selector) => [...document.querySelectorAll(selector)].map((element) => {
          const rect = element.getBoundingClientRect();
          return { selector, x: rect.x, right: rect.right, width: rect.width };
        })).filter((rect) => rect.width > 0 && (rect.x < -1 || rect.right > innerWidth + 1));
        const intersection = (first, second) => {
          if (!first || !second) return null;
          const a = first.getBoundingClientRect();
          const b = second.getBoundingClientRect();
          const width = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
          const height = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
          return width > 1 && height > 1 ? { width, height } : null;
        };
        const collisions = [];
        for (const [first, second] of [['.fa-chat-screen', '.fa-admin-screen'], ['.fa-intro-copy', '.fa-intro-incident'], ['.fa-story-chapters', '.fa-story-sticky']]) {
          const overlap = intersection(document.querySelector(first), document.querySelector(second));
          if (overlap) collisions.push({ pair: `${first} / ${second}`, ...overlap });
        }
        return { viewport: innerWidth, scrollWidth: document.documentElement.scrollWidth, outside, collisions };
      });
      if (geometry.scrollWidth > width + 1 || geometry.outside.length || geometry.collisions.length) layoutIssues.push({ width, ...geometry });
    }
    assert.deepEqual(layoutIssues, [], `Responsive layout issues: ${JSON.stringify(layoutIssues)}`);
  });

  await check('larger typography is applied to body copy, the product demo, form and captions', async () => {
    const { page } = desktop;
    await page.bringToFront();
    if (await page.$('.fa-form-reset')) await page.click('.fa-form-reset');
    await page.waitForSelector('#fa-demo-company');
    const proseSelectors = ['.fa-intro-description', '.fa-story-heading > p:not(.fa-eyebrow)', '.fa-story-chapter-description', '.fa-section-heading > p:not(.fa-eyebrow)', '.fa-benefit-panel li p', '.fa-case-story dd', '.fa-process-list > li > p', '.fa-faq-list details > p', '.fa-demo-intro > p:not(.fa-eyebrow)'];
    const typographyIssues = [];
    for (const width of responsiveWidths) {
      await page.setViewport({ width, height: 1000, deviceScaleFactor: 1 });
      const minimumBody = width <= 760 ? 16 : 18;
      const rules = [
        ...proseSelectors.map((selector) => ({ selector, minimum: minimumBody })),
        { selector: '.fa-chat-user p, .fa-chat-bot p', minimum: width <= 760 ? 15 : 16 },
        { selector: '.fa-form-field label', minimum: 14 },
        { selector: '.fa-form-field input, .fa-form-field select, .fa-form-field textarea', minimum: 16 },
        { selector: '.fa-product-caption, .fa-story-disclosure, .fa-story-panel-note, .fa-story-floor small', minimum: 13 },
      ];
      const evidence = await page.evaluate((checks) => checks.map(({ selector, minimum }) => {
        const elements = [...document.querySelectorAll(selector)];
        const sizes = elements.map((element) => parseFloat(getComputedStyle(element).fontSize));
        return { selector, minimum, count: elements.length, actualMinimum: Math.min(...sizes) };
      }), rules);
      typographyEvidence.push({ viewport: width, checks: evidence });
      for (const item of evidence) {
        if (!item.count || item.actualMinimum < item.minimum) typographyIssues.push({ width, ...item });
      }
    }
    assert.deepEqual(typographyIssues, [], `Typography issues: ${JSON.stringify(typographyIssues)}`);
  });

  await check('mobile menu, sticky CTA and focused form input remain usable', async () => {
    const { page } = desktop;
    await page.bringToFront();
    await page.setViewport({ width: 375, height: 900, deviceScaleFactor: 1 });
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.click('.fa-menu-toggle');
    await page.waitForSelector('#fa-mobile-menu');
    assert.equal(await page.$eval('.fa-menu-toggle', (button) => button.getAttribute('aria-expanded')), 'true');
    await page.keyboard.press('Escape');
    await page.waitForSelector('#fa-mobile-menu', { hidden: true });
    assert.equal(await page.evaluate(() => document.activeElement.classList.contains('fa-menu-toggle')), true);
    assert.equal(await page.$eval('.fa-mobile-cta a', (link) => link.getAttribute('href')), '#demo-request');
    await page.click('.fa-mobile-cta a');
    await page.waitForFunction(() => location.hash === '#demo-request', { polling: 50 });
    if (await page.$('.fa-form-reset')) await page.click('.fa-form-reset');
    await page.waitForSelector('#fa-demo-company');
    await page.$eval('#fa-demo-company', (input) => input.scrollIntoView({ block: 'center' }));
    await page.click('#fa-demo-company');
    const rect = await page.$eval('#fa-demo-company', (input) => {
      const box = input.getBoundingClientRect();
      const cta = document.querySelector('.fa-mobile-cta')?.getBoundingClientRect();
      return { top: box.top, bottom: box.bottom, ctaTop: cta?.top ?? innerHeight };
    });
    assert.ok(rect.top >= 64 && rect.bottom < rect.ctaTop, JSON.stringify(rect));
  });

  await check('screenshots and clean browser error state', async () => {
    const { page } = desktop;
    await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1 });
    await page.evaluate(() => window.scrollTo(0, 0));
    await pause(150);
    await page.screenshot({ path: path.join(outputDirectory, 'desktop.png') });
    await captureComponent(page, '.fa-intro', 'hero.png');
    await page.$eval('.fa-story-chapter[data-step="0"]', (chapter) => chapter.scrollIntoView({ behavior: 'auto', block: 'center' }));
    await page.waitForSelector('.fa-scroll-story[data-step="0"]');
    await captureComponent(page, '.fa-story-sticky > .fa-story-panel', 'story-panel.png');
    await scrollProductScenario(page, 0);
    const productLayout = await page.$eval('.fa-product-scroll', (element) => element.dataset.layout);
    await captureComponent(page, productLayout === 'sticky' ? '.fa-product-scroll-sticky > .fa-product' : '.fa-product-scene[data-scenario="0"]', 'product-demo.png');
    await page.$eval('#demo-request', (section) => section.scrollIntoView({ block: 'start' }));
    await pause(150);
    await page.screenshot({ path: path.join(outputDirectory, 'demo-form.png') });
    await page.setViewport({ width: 375, height: 1000, deviceScaleFactor: 1 });
    await page.evaluate(() => window.scrollTo(0, 0));
    await pause(150);
    await page.screenshot({ path: path.join(outputDirectory, 'mobile.png') });
    await captureComponent(page, '.fa-intro', 'mobile-hero.png');
    await captureComponent(page, '.fa-story-chapter[data-step="0"]', 'mobile-story.png');
    await page.waitForSelector('.fa-product-scroll[data-layout="natural"]');
    await captureComponent(page, '.fa-product-scene[data-scenario="0"]', 'mobile-product-demo.png');
    await page.$eval('.fa-demo-grid > .fa-form-panel', (panel) => panel.scrollIntoView({ block: 'start' }));
    await pause(150);
    await page.screenshot({ path: path.join(outputDirectory, 'mobile-form.png') });
    await page.$eval('.fa-form-submit', (button) => button.scrollIntoView({ block: 'center' }));
    await pause(150);
    await page.screenshot({ path: path.join(outputDirectory, 'mobile-form-end.png') });
    assert.deepEqual(errors, []);
  });

  await check('anonymous visitors see the administrator login before demo records', async () => {
    const { page, state } = await newPage(1440, 1000);
    await page.goto(`${origin}/admin/fire-safety-demos`, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => document.querySelector('h1')?.textContent.includes('관리자 로그인'));
    assert.equal(await page.$('article'), null);
    assert.equal(state.posts.length, 0);
    assert.equal(state.unexpectedApiCalls.some((request) => request.path.endsWith('/fire_safety_demo_requests')), false);
    assert.deepEqual(errors, []);
  });
} finally {
  await browser.close();
}

const failed = results.filter((item) => item.status === 'FAIL');
const report = { passed: results.length - failed.length, failed: failed.length, screenshots: outputDirectory, results, typographyEvidence };
await writeFile(path.join(outputDirectory, 'qa-report.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
if (failed.length) process.exitCode = 1;
