import express from 'express';
import http from 'http';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import { propTechFaqs } from './src/data/faqData';

dotenv.config();

async function startServer() {
  const app = express();
  const httpServer = http.createServer(app);
  const PORT = 3000;

  app.use(express.json());

  // API routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend is running' });
  });

  app.get('/api/faqs', (req, res) => {
    try {
      const category = typeof req.query.category === 'string' ? req.query.category : 'all';
      const query = typeof req.query.q === 'string' ? req.query.q.trim().toLowerCase() : '';

      let items = [...propTechFaqs].sort((a, b) => a.displayOrder - b.displayOrder);

      if (category && category !== 'all') {
        items = items.filter((item) => item.category === category);
      }

      if (query) {
        items = items.filter(
          (item) =>
            item.questionKo.toLowerCase().includes(query) ||
            item.answerKo.toLowerCase().includes(query) ||
            item.keyTakeawayKo.toLowerCase().includes(query) ||
            item.questionEn.toLowerCase().includes(query) ||
            item.answerEn.toLowerCase().includes(query) ||
            item.keyTakeawayEn.toLowerCase().includes(query)
        );
      }

      res.setHeader('Cache-Control', 'no-cache');
      res.json({
        items,
        total: items.length,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error serving FAQs:', error);
      res.status(500).json({ error: 'Failed to load FAQs' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR === 'true' ? false : { server: httpServer },
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
