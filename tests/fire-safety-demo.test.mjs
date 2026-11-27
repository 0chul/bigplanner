import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createDemoRequestPayload, DEMO_CONSENT_VERSION, EMPTY_DEMO_FORM, validateDemoForm,
} from '../src/utils/fireSafetyDemo.ts';
import { trackFireSafetyEvent } from '../src/utils/fireSafetyAnalytics.ts';

const validApplication = {
  ...EMPTY_DEMO_FORM,
  company: '  예시 관리회사  ',
  name: '  신청 담당자  ',
  email: ' DEMO@EXAMPLE.INVALID ',
  role: 'head-office',
  consent: true,
};

test('requires a real company, contact, email, role and explicit consent', () => {
  assert.deepEqual(Object.keys(validateDemoForm(EMPTY_DEMO_FORM)).sort(), ['company', 'consent', 'email', 'name', 'role']);
  assert.ok(validateDemoForm({ ...validApplication, company: ' \t ' }).company);
  assert.ok(validateDemoForm({ ...validApplication, name: '\n' }).name);
  assert.ok(validateDemoForm({ ...validApplication, email: 'broken@address' }).email);
  for (const email of ['visitor@example.invalid?bcc=copy%40attacker.invalid', 'a@example.invalid#fragment', 'a@-domain.invalid', 'a\0@example.invalid']) {
    assert.ok(validateDemoForm({ ...validApplication, email }).email, email);
  }
  assert.ok(validateDemoForm({ ...validApplication, consent: false }).consent);
  assert.ok(validateDemoForm({ ...validApplication, role: 'constructor' }).role);
  assert.ok(validateDemoForm({ ...validApplication, role: 'admin' }).role);
});

test('accepts optional fields empty and every supported buyer role', () => {
  for (const role of ['head-office', 'site', 'other']) {
    assert.deepEqual(validateDemoForm({ ...validApplication, role }), {});
  }
  assert.equal(createDemoRequestPayload(validApplication, 'test-id').building_count, null);
});

test('rejects fractional, negative, zero, nonnumeric and oversized building counts', () => {
  for (const buildingCount of ['1.5', '-1', '0', '1e3', '100001', 'hello']) {
    assert.ok(validateDemoForm({ ...validApplication, buildingCount }).buildingCount, buildingCount);
  }
  for (const buildingCount of ['1', '100000', ' 3 ']) {
    assert.deepEqual(validateDemoForm({ ...validApplication, buildingCount }), {});
  }
});

test('enforces text limits and rejects control characters', () => {
  for (const [key, value] of [['company', 'x'.repeat(121)], ['name', 'x'.repeat(81)], ['interests', 'x'.repeat(1001)], ['company', 'name\nother'], ['name', 'x\0'], ['interests', 'x\0']]) {
    assert.ok(validateDemoForm({ ...validApplication, [key]: value })[key], key);
  }
  assert.throws(() => createDemoRequestPayload(EMPTY_DEMO_FORM, 'test-id'));
});

test('normalizes applicant fields and never supplies server-controlled columns', () => {
  const payload = createDemoRequestPayload({ ...validApplication, buildingCount: '3', interests: '  냉난방 접수\n주차 안내  ' }, 'stable-request-id');
  assert.deepEqual(payload, {
    id: 'stable-request-id', company_name: '예시 관리회사', contact_name: '신청 담당자',
    email: 'demo@example.invalid', role: 'head-office', building_count: 3,
    interests: '냉난방 접수\n주차 안내', consent_granted: true,
    consent_version: DEMO_CONSENT_VERSION, source_path: '/fire-safety-ai',
  });
  for (const column of ['created_at', 'expires_at', 'status', 'admin_note']) {
    assert.equal(Object.hasOwn(payload, column), false);
  }
});

test('analytics omits personal form fields and failures never break an application', () => {
  const events = [];
  globalThis.window = { gtag: (...args) => events.push(args) };
  trackFireSafetyEvent('demo_request_success', { role: 'site', email: 'private@example.invalid', company: 'private-company' });
  assert.deepEqual(events, [['event', 'fire_safety_demo_request_success', { role: 'site', page_path: '/fire-safety-ai' }]]);
  globalThis.window.location = { pathname: '/fire-safety-ai/en/request/', search: '?email=private@example.invalid' };
  trackFireSafetyEvent('demo_request_success', { role: 'site', email: 'private@example.invalid' });
  assert.deepEqual(events[1], ['event', 'fire_safety_demo_request_success', { role: 'site', page_path: '/fire-safety-ai/en/request' }]);
  globalThis.window = { gtag: () => { throw new Error('Analytics blocked'); } };
  assert.doesNotThrow(() => trackFireSafetyEvent('demo_cta_click', { source: 'hero' }));
  delete globalThis.window;
  assert.doesNotThrow(() => trackFireSafetyEvent('landing_view'));
});
