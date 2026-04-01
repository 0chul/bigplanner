import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import axios from 'axios';
import dotenv from 'dotenv';
import { URLSearchParams } from 'url';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes
  app.post('/api/send-sms', async (req, res) => {
    const { receiver, msg, name } = req.body;
    const { ALIGO_API_KEY, ALIGO_USER_ID, ALIGO_SENDER } = process.env;

    if (!ALIGO_API_KEY || !ALIGO_USER_ID || !ALIGO_SENDER) {
      return res.status(500).json({ error: 'SMS configuration missing' });
    }

    try {
      const params = new URLSearchParams();
      params.append('key', ALIGO_API_KEY);
      params.append('userid', ALIGO_USER_ID);
      params.append('sender', ALIGO_SENDER);
      params.append('receiver', receiver);
      params.append('msg', msg);
      params.append('destination', `${receiver}|${name}`);
      params.append('msg_type', 'SMS'); // Default to SMS

      const response = await axios.post('https://apis.aligo.in/send/', params);
      res.json(response.data);
    } catch (error: any) {
      console.error('SMS sending error:', error.response?.data || error.message);
      res.status(500).json({ 
        error: 'Failed to send SMS', 
        details: error.response?.data || error.message 
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
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

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
