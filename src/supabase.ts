import { createClient } from '@supabase/supabase-js';

export const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://injrbniytgtubemniaps.supabase.co';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImluanJibml5dGd0dWJlbW5pYXBzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2MzA3NDcsImV4cCI6MjA4OTIwNjc0N30.h3njZ7cRvJblL_MIZJ5qJRD45zjzsdWpPiV-90tDxmg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    fetch: (url, options) => {
      // Supabase 클라이언트가 헤더를 처리할 수 있도록 options를 그대로 전달하되
      // 필요한 캐시 방지 헤더만 추가합니다.
      const headers = new Headers(options?.headers);
      headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      headers.set('Pragma', 'no-cache');
      headers.set('Expires', '0');

      return fetch(url, { 
        ...options, 
        cache: 'no-store',
        headers
      });
    },
  },
});
