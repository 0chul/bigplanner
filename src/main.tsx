import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {HelmetProvider} from 'react-helmet-async';
import App from './App.tsx';
import { fireSafetyHost, fireSafetyPath } from './utils/fireSafetyLanding';
import { fireSafetyRequestPages } from './utils/fireSafetyLocales.js';
import './index.css';

const { hostname, pathname } = window.location;
const pathWithTrailingSlash = pathname.endsWith('/') ? pathname : pathname + '/';
const isDemoRequest = fireSafetyRequestPages.has(pathWithTrailingSlash);
if (pathWithTrailingSlash === fireSafetyPath || pathWithTrailingSlash === '/service/' ||
    isDemoRequest ||
    (hostname === fireSafetyHost && pathname === '/')) {
  // React 19 recreates these route tags after loading a fallback or pre-rendered page.
  document.head.querySelectorAll('title, link[rel="canonical"], meta[name="description"], meta[name="keywords"], meta[property^="og:"], meta[name^="twitter:"]')
    .forEach(tag => tag.remove());
}
if (isDemoRequest) {
  document.head.querySelectorAll('meta[name="robots"]').forEach(tag => tag.remove());
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>,
);
