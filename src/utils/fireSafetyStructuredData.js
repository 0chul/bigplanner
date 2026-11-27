import { fireSafetyPath, siteOrigin } from './fireSafetyLocales.js';

export function fireSafetyProductStructuredData({ code, url, title, description, videoPath, handoverPath, workloadPath }) {
  const productUrl = siteOrigin + fireSafetyPath;
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${url}#page`,
    url,
    name: title,
    description,
    inLanguage: code,
    significantLink: [videoPath, handoverPath, workloadPath].map(resource => siteOrigin + resource),
    mainEntity: {
      '@type': 'Service',
      '@id': `${productUrl}#tenant-service-desk`,
      name: '방재실 AI 민원 도우미',
      alternateName: 'BigPlanner Partners Facilities AI',
      url: productUrl,
      serviceType: 'AI tenant service desk setup and facilities operations support',
      sameAs: 'https://saaskr.com/saas/bigplanner-co-kr',
      provider: {
        '@type': 'Organization',
        '@id': `${siteOrigin}/#organization`,
        name: '빅플래너파트너스',
        alternateName: 'BIGPLANNER PARTNERS',
        url: `${siteOrigin}/`,
      },
    },
  };
  return JSON.stringify(data).replaceAll('<', '\\u003c');
}
