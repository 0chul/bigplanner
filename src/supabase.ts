import { createClient } from '@supabase/supabase-js';

export const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://injrbniytgtubemniaps.supabase.co';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImluanJibml5dGd0dWJlbW5pYXBzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2MzA3NDcsImV4cCI6MjA4OTIwNjc0N30.h3njZ7cRvJblL_MIZJ5qJRD45zjzsdWpPiV-90tDxmg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    fetch: (url, options) => {
      const newUrl = new URL(url);
      // GET 요청에만 타임스탬프를 붙여서 브라우저/CDN 캐시를 완벽하게 무력화합니다.
      if (!options?.method || options.method.toUpperCase() === 'GET') {
        newUrl.searchParams.set('t', Date.now().toString());
      }
      return fetch(newUrl.toString(), { 
        ...options, 
        cache: 'no-store',
        headers: {
          ...options?.headers,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
    },
  },
});
