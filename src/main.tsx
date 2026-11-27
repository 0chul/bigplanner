import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {HelmetProvider} from 'react-helmet-async';
import App from './App.tsx';
import { fireSafetyHost, fireSafetyPath } from './utils/fireSafetyLanding';
import './index.css';

const { hostname, pathname } = window.location;
const pathWithTrailingSlash = pathname.endsWith('/') ? pathname : pathname + '/';
if (pathWithTrailingSlash === fireSafetyPath || pathWithTrailingSlash === '/service/' ||
    (hostname === fireSafetyHost && pathname === '/')) {
  // React 19 recreates these route tags after loading a fallback or pre-rendered page.
  document.head.querySelectorAll('title, link[rel="canonical"], meta[name="description"], meta[name="keywords"], meta[property^="og:"], meta[name^="twitter:"]')
    .forEach(tag => tag.remove());
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>,
);
