import { fireSafetyPath, siteOrigin } from './fireSafetyLocales.js';

// The Pages build sets this label once the branded landing site is available.
const subdomain = import.meta.env.VITE_FIRE_SAFETY_SUBDOMAIN?.trim().toLowerCase() ?? '';
const validLabel = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/;

export { fireSafetyPath };
export const fireSafetyHost = validLabel.test(subdomain) ? `${subdomain}.bigplanner.co.kr` : undefined;
export const fireSafetyLandingUrl = fireSafetyHost ? `https://${fireSafetyHost}/` : fireSafetyPath;
export const fireSafetyCanonicalUrl = new URL(fireSafetyLandingUrl, siteOrigin).href;

export function fireSafetyLinkFromService(search: URLSearchParams) {
  const campaign = new URLSearchParams();
  for (const [key, value] of search) {
    if (key.startsWith('utm_') || key === 'fbclid' || key === 'NaPm') campaign.append(key, value);
  }
  return campaign.size ? `${fireSafetyLandingUrl}?${campaign}` : fireSafetyLandingUrl;
}
