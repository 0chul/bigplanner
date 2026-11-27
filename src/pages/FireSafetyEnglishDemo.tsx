import { Helmet } from 'react-helmet-async';
import { ArrowLeft } from 'lucide-react';
import FireSafetyDemoRequestForm from '../components/FireSafetyDemoRequestForm';
import { fireSafetyEnglishDemoPath, fireSafetyEnglishPath, fireSafetyPath, siteOrigin } from '../utils/fireSafetyLocales.js';
import './fire-safety-ai.css';
import './fire-safety-english-demo.css';

export default function FireSafetyEnglishDemo() {
  return (
    <div className="fire-ai fa-english-demo">
      <Helmet>
        <html lang="en" />
        <title>Request a facilities AI demo | BigPlanner Partners</title>
        <meta name="description" content="Request an online demonstration of BigPlanner Partners’ AI tenant service desk for commercial facilities teams." />
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href={siteOrigin + fireSafetyEnglishDemoPath} />
      </Helmet>
      <header className="fa-en-header">
        <div>
          <a className="fa-en-company" href={fireSafetyEnglishPath}>BigPlanner Partners</a>
          <a href={`${fireSafetyPath}#demo-request`} lang="ko" hrefLang="ko">한국어 신청</a>
        </div>
      </header>
      <main className="fa-en-request" id="demo-request">
        <div className="fa-en-intro">
          <a className="fa-en-back" href={`${fireSafetyEnglishPath}#demo`}><ArrowLeft size={16} aria-hidden="true" />Back to the product demo</a>
          <h1>See the AI helpdesk in action</h1>
          <p>See how tenant requests move across shifts and discuss your building’s workflow. The public walkthrough shows Korean screens with English captions.</p>
        </div>
        <div className="fa-form-panel">
          <FireSafetyDemoRequestForm locale="en" />
        </div>
      </main>
    </div>
  );
}
