import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import next from 'next';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const port = 3000;

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Simple In-Memory Store (In a real app, use a database)
const db = {
  briefings: [] as any[],
  portfolio: [
    { id: '1', title: 'Landing Page Advocacia', link: '#', thumb: 'https://picsum.photos/seed/law/400/300' },
    { id: '2', title: 'E-commerce Fitness', link: '#', thumb: 'https://picsum.photos/seed/gym/400/300' },
    { id: '3', title: 'Site Institucional Engenharia', link: '#', thumb: 'https://picsum.photos/seed/tech/400/300' },
  ],
  settings: {
    affiliateLink: 'https://www.hostgator.com.br/afiliados',
  },
  messages: [] as any[],
};

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

app.prepare().then(() => {
  const server = express();
  const httpServer = createServer(server);
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
    },
  });

  server.use(cors());
  server.use(express.json());
  server.use('/uploads', express.static(uploadsDir));

  // --- API ROUTES ---

  // Auth
  server.post('/api/admin/login', (req, res) => {
    const { email, password } = req.body;
    if (email === 'guisdevsp@gmail.com' && password === 'gus@dev2026') {
      const token = jwt.sign({ email }, 'super-secret-key-for-gus-dev-2026', { expiresIn: '7d' });
      return res.json({ success: true, token });
    }
    res.status(401).json({ success: false, message: 'Credenciais inválidas' });
  });

  // Briefing Submission
  server.post('/api/briefing', upload.any(), (req, res) => {
    const files = req.files as Express.Multer.File[];
    const data = JSON.parse(req.body.data);
    
    const fileData = files.map(f => ({
      fieldname: f.fieldname,
      filename: f.filename,
      originalname: f.originalname,
      url: `/uploads/${f.filename}`
    }));

    const newBriefing = {
      id: Date.now().toString(),
      ...data,
      files: fileData,
      status: 'a pagar',
      createdAt: new Date().toISOString(),
    };

    db.briefings.push(newBriefing);
    res.json({ success: true, id: newBriefing.id });
  });

  // Admin Data
  server.get('/api/admin/data', (req, res) => {
    // In a real app, verify JWT here
    res.json({
      briefings: db.briefings,
      portfolio: db.portfolio,
      settings: db.settings,
    });
  });

  server.patch('/api/admin/briefing/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const briefing = db.briefings.find(b => b.id === id);
    if (briefing) {
      briefing.status = status;
      return res.json({ success: true });
    }
    res.status(404).json({ success: false });
  });

  server.post('/api/admin/portfolio', (req, res) => {
    const item = { id: Date.now().toString(), ...req.body };
    db.portfolio.push(item);
    res.json({ success: true, item });
  });

  server.delete('/api/admin/portfolio/:id', (req, res) => {
    db.portfolio = db.portfolio.filter(p => p.id !== req.params.id);
    res.json({ success: true });
  });

  server.post('/api/admin/settings', (req, res) => {
    db.settings = { ...db.settings, ...req.body };
    res.json({ success: true });
  });

  // --- SOCKET.IO ---
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join_chat', (userId) => {
      socket.join(userId);
    });

    socket.on('send_message', (data) => {
      // data: { sender: 'user' | 'admin', userId: string, text: string }
      const msg = { ...data, timestamp: new Date().toISOString() };
      db.messages.push(msg);
      io.to(data.userId).emit('receive_message', msg);
      if (data.sender === 'user') {
        io.emit('admin_notification', msg); // Notify admin of new message
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });

  // Next.js handler
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  httpServer.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
