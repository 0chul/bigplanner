import { fireSafetyEnglishDemoPath } from './fireSafetyLocales.js';

type FireSafetyEvent =
  | 'landing_view'
  | 'demo_cta_click'
  | 'demo_scenario_view'
  | 'demo_request_success'
  | 'demo_request_error';

/** Only categorical product events belong in analytics, never form contents. */
export function trackFireSafetyEvent(
  name: FireSafetyEvent,
  properties: Record<string, string> = {},
) {
  if (typeof window === 'undefined') return;
  const analytics = (window as Window & {
    gtag?: (...args: unknown[]) => void;
  }).gtag;
  if (!analytics) return;

  const allowedKeys = ['source', 'scenario', 'role'];
  const safeProperties = Object.fromEntries(
    Object.entries(properties).filter(([key]) => allowedKeys.includes(key)),
  );
  const englishRequest = fireSafetyEnglishDemoPath.slice(0, -1);
  const currentPath = window.location?.pathname.replace(/\/$/, '');
  try {
    analytics('event', `fire_safety_${name}`, {
      ...safeProperties,
      page_path: currentPath === englishRequest ? englishRequest : '/fire-safety-ai',
    });
  } catch {
    // Analytics availability must never affect navigation or an application.
  }
}
