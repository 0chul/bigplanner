import { Helmet } from 'react-helmet-async';
import { ArrowLeft } from 'lucide-react';
import FireSafetyDemoRequestForm from '../components/FireSafetyDemoRequestForm';
import { fireSafetyEnglishDemoPath, fireSafetyPath, fireSafetyTranslations, siteOrigin } from '../utils/fireSafetyLocales.js';
import { internationalDemoRequestCopy } from './fireSafetyInternationalRequestCopy';
import './fire-safety-ai.css';
import './fire-safety-international-demo.css';

export default function FireSafetyInternationalDemo({ language }: { language: (typeof fireSafetyTranslations)[number] }) {
  const { code, path, requestPath, videoPath, direction = 'ltr' } = language;
  const copy = internationalDemoRequestCopy[code];
  return (
    <div className="fire-ai fa-international-demo" lang={code} dir={direction}>
      <Helmet>
        <html lang={code} dir={direction} />
        <title>{copy.page.title}</title>
        <meta name="description" content={copy.page.description} />
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href={siteOrigin + requestPath} />
      </Helmet>
      <header className="fa-request-header">
        <div>
          <a className="fa-request-company" href={path} lang="en" dir="ltr">BigPlanner Partners</a>
          <div className="fa-request-languages">
            {code !== 'en' && <a href={fireSafetyEnglishDemoPath} lang="en" hrefLang="en">English</a>}
            <a href={`${fireSafetyPath}#demo-request`} lang="ko" hrefLang="ko">한국어 신청</a>
          </div>
        </div>
      </header>
      <main className="fa-international-request" id="demo-request">
        <div className="fa-request-intro">
          <a className="fa-request-back" href={videoPath}><ArrowLeft size={16} aria-hidden="true" />{copy.page.back}</a>
          <h1>{copy.page.heading}</h1>
          <p>{copy.page.intro}</p>
        </div>
        <div className="fa-form-panel">
          <FireSafetyDemoRequestForm locale={code} translation={copy} />
        </div>
      </main>
    </div>
  );
}
