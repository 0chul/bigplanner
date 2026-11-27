import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const previousPath = useRef<string | null>(null);

  useEffect(() => {
    const pathChanged = previousPath.current !== pathname;
    previousPath.current = pathname;
    if (!hash) {
      if (pathChanged) window.scrollTo(0, 0);
      return;
    }

    const fragment = hash.slice(1);
    let id = fragment;
    try {
      id = decodeURIComponent(fragment);
    } catch {
      // A malformed URL can still point to a literal element ID.
    }

    let observer: MutationObserver | undefined;
    function scrollToFragment() {
      const target = document.getElementById(id);
      if (!target) return false;
      target.scrollIntoView({ behavior: 'instant', block: 'start' });
      return true;
    }

    const frame = window.requestAnimationFrame(() => {
      if (scrollToFragment()) return;
      // A lazy route may still be showing its loading indicator.
      observer = new MutationObserver(() => {
        if (scrollToFragment()) observer?.disconnect();
      });
      observer.observe(document.getElementById('root') ?? document.body, { childList: true, subtree: true });
    });

    return () => {
      window.cancelAnimationFrame(frame);
      observer?.disconnect();
    };
  }, [pathname, hash]);

  return null;
}
