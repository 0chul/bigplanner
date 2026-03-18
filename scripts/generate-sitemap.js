import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

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
      .select('id, title, updated_at');

    if (error) throw error;

    const baseUrl = 'https://bigplanner.co.kr';
    
    // Core routes
    const routes = [
      { path: '/', priority: 1.0, changefreq: 'weekly' },
      { path: '/about', priority: 0.8, changefreq: 'monthly' },
      { path: '/service', priority: 0.8, changefreq: 'monthly' },
      { path: '/projects', priority: 0.9, changefreq: 'daily' },
      { path: '/partners', priority: 0.7, changefreq: 'monthly' },
      { path: '/contact', priority: 0.8, changefreq: 'monthly' },
    ];

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    sitemap += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Add core routes
    for (const route of routes) {
      sitemap += `  <url>\n`;
      sitemap += `    <loc>${baseUrl}/#${route.path}</loc>\n`;
      sitemap += `    <changefreq>${route.changefreq}</changefreq>\n`;
      sitemap += `    <priority>${route.priority}</priority>\n`;
      sitemap += `  </url>\n`;
    }

    // Add project routes
    if (projects) {
      for (const project of projects) {
        const slug = generateSlug(project.title);
        const date = project.updated_at ? project.updated_at.split('T')[0] : new Date().toISOString().split('T')[0];
        
        sitemap += `  <url>\n`;
        sitemap += `    <loc>${baseUrl}/#/projects/${project.id}/${slug}</loc>\n`;
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
