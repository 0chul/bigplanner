import { fireSafetyEnglishVideoPath, fireSafetyPath } from '../../src/utils/fireSafetyLocales.js';

export const fireSafetyKoreanVideoPath = `${fireSafetyPath}demo-video/`;
export const fireSafetyVideoAlternates = [
  { code: 'ko', path: fireSafetyKoreanVideoPath },
  { code: 'en', path: fireSafetyEnglishVideoPath },
];

export const demoVideo = {
  thumbnail: `${fireSafetyPath}handoff-checklist/handoff-demo-cover.jpg`,
  content: `${fireSafetyPath}handoff-checklist/handoff-demo.mp4`,
  duration: 27,
  uploadDate: '2026-11-27T10:26:31+09:00',
};

export const englishDemoVideo = {
  ...demoVideo,
  title: 'AI tenant request and shift handover demo',
  description: 'Watch a 27-second facilities demo with English captions. Follow a simulated tenant cooling request from intake and staff assignment through shift handover.',
};
