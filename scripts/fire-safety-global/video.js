import { readFileSync } from 'node:fs';
import { fireSafetyPath } from '../../src/utils/fireSafetyLocales.js';

export const demoVideo = {
  thumbnail: `${fireSafetyPath}handoff-checklist/handoff-demo-cover.jpg`,
  content: `${fireSafetyPath}handoff-checklist/handoff-demo.mp4`,
  duration: 27,
  uploadDate: '2026-11-27T10:26:31+09:00',
};

export function readLocalizedProduct(code) {
  return JSON.parse(readFileSync(new URL(`./${code.toLowerCase()}.json`, import.meta.url), 'utf8'));
}
