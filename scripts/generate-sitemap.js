import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { fireSafetyEnglishAfterHoursPath, fireSafetyEnglishFaqPath, fireSafetyEnglishResourcesPath, fireSafetyKoreanAfterHoursPath, fireSafetyKoreanFaqPath, fireSafetyKoreanResourcesPath, fireSafetyKoreanVideoPath, fireSafetyLanguages, fireSafetyTranslations } from '../src/utils/fireSafetyLocales.js';
import { demoVideo, readLocalizedProduct } from './fire-safety-global/video.js';

const supabaseUrl = 'https://injrbniytgtubemniaps.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImluanJibml5dGd0dWJlbW5pYXBzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2MzA3NDcsImV4cCI6MjA4OTIwNjc0N30.h3njZ7cRvJblL_MIZJ5qJRD45zjzsdWpPiV-90tDxmg';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const generateSlug = (text) => {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-ㄱ-ㅎㅏ-ㅣ가-힣]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

async function generateSitemap() {
  try {
    const { data: projects, error } = await supabase
      .from('projects')
      .select('id, title, created_at');

    if (error) throw error;

    const baseUrl = 'https://bigplanner.co.kr';
    
    // Core routes
    const routes = [
      { path: '/', priority: 1.0, changefreq: 'weekly' },
      { path: '/about', priority: 0.8, changefreq: 'monthly' },
      { path: '/service/', priority: 0.8, changefreq: 'monthly' },
      { path: '/fire-safety-ai/', priority: 0.9, changefreq: 'monthly' },
      ...fireSafetyTranslations.map(({ path }) => ({ path, priority: 0.8, changefreq: 'monthly' })),
      ...fireSafetyLanguages.map(({ handoverPath }) => ({ path: handoverPath, priority: 0.8, changefreq: 'monthly' })),
      { path: '/fire-safety-ai/adoption-guide/', priority: 0.8, changefreq: 'monthly' },
      { path: fireSafetyKoreanAfterHoursPath, priority: 0.8, changefreq: 'monthly' },
      { path: fireSafetyEnglishAfterHoursPath, priority: 0.8, changefreq: 'monthly' },
      { path: fireSafetyKoreanFaqPath, priority: 0.8, changefreq: 'monthly' },
      { path: fireSafetyEnglishFaqPath, priority: 0.8, changefreq: 'monthly' },
      { path: fireSafetyKoreanResourcesPath, priority: 0.8, changefreq: 'monthly' },
      { path: fireSafetyEnglishResourcesPath, priority: 0.8, changefreq: 'monthly' },
      ...fireSafetyLanguages.map(({ workloadPath }) => ({ path: workloadPath, priority: 0.8, changefreq: 'monthly' })),
      {
        path: fireSafetyKoreanVideoPath,
        priority: 0.8,
        changefreq: 'monthly',
        video: {
          ...demoVideo,
          title: '방재실 AI 민원 도우미 27초 데모',
          description: '입주사 냉방 민원을 접수하고 담당자를 지정한 뒤 다음 근무자가 기록을 확인하는 가상 사례를 27초 영상으로 보여줍니다.',
        },
      },
      ...fireSafetyTranslations.map(({ code, videoPath }) => {
        const { title, description } = readLocalizedProduct(code).watch;
        return { path: videoPath, priority: 0.8, changefreq: 'monthly', video: { ...demoVideo, title, description } };
      }),
      { path: '/projects', priority: 0.9, changefreq: 'daily' },
      { path: '/partners', priority: 0.7, changefreq: 'monthly' },
      { path: '/contact', priority: 0.8, changefreq: 'monthly' },
    ];

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    sitemap += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">\n`;

    // Add core routes
    for (const route of routes) {
      sitemap += `  <url>\n`;
      sitemap += `    <loc>${baseUrl}${route.path}</loc>\n`;
      sitemap += `    <changefreq>${route.changefreq}</changefreq>\n`;
      sitemap += `    <priority>${route.priority}</priority>\n`;
      if (route.video) {
        const { title, description, thumbnail, content, duration, uploadDate } = route.video;
        sitemap += `    <video:video>\n`;
        sitemap += `      <video:thumbnail_loc>${baseUrl}${thumbnail}</video:thumbnail_loc>\n`;
        sitemap += `      <video:title><![CDATA[${title}]]></video:title>\n`;
        sitemap += `      <video:description><![CDATA[${description}]]></video:description>\n`;
        sitemap += `      <video:content_loc>${baseUrl}${content}</video:content_loc>\n`;
        sitemap += `      <video:duration>${duration}</video:duration>\n`;
        sitemap += `      <video:publication_date>${uploadDate}</video:publication_date>\n`;
        sitemap += `    </video:video>\n`;
      }
      sitemap += `  </url>\n`;
    }

    // Add project routes
    if (projects) {
      for (const project of projects) {
        const slug = generateSlug(project.title);
        const date = project.created_at ? project.created_at.split('T')[0] : new Date().toISOString().split('T')[0];
        
        sitemap += `  <url>\n`;
        sitemap += `    <loc>${baseUrl}/projects/${slug}</loc>\n`;
        sitemap += `    <lastmod>${date}</lastmod>\n`;
        sitemap += `    <changefreq>monthly</changefreq>\n`;
        sitemap += `    <priority>0.8</priority>\n`;
        sitemap += `  </url>\n`;
      }
    }

    sitemap += `</urlset>`;

    const publicDir = path.join(process.cwd(), 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir);
    }

    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
    console.log('Sitemap generated successfully!');
  } catch (error) {
    console.error('Error generating sitemap:', error);
  }
}

generateSitemap();
