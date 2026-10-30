import express, { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const app = express();
const PORT = 3000;
const DB_FILE = path.resolve(process.cwd(), 'data', 'store_db.json');

// Ensure data directory exists
if (!fs.existsSync(path.dirname(DB_FILE))) {
  fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
}

// Master password configuration (LOUIE51212HD)
const STUDIO_MASTER_CODE = process.env.STUDIO_PASSWORD || 'LOUIE51212HD';
const MASTER_CODE_HASH = crypto.createHash('sha256').update(STUDIO_MASTER_CODE).digest('hex');

// In-memory token store for sessions (2 hours TTL)
const activeSessions = new Map<string, { createdAt: number }>();
// Brute-force rate limiting: ip -> { attempts: number, lockUntil: number }
const loginAttempts = new Map<string, { attempts: number; lockUntil: number }>();
// Feedback rate limiting: ip -> timestamps[]
const feedbackRateLimit = new Map<string, number[]>();

interface StoreDB {
  products: any[];
  config: {
    whatsappNumber: string;
    careMessagePt: string;
    careMessageEn: string;
    instagramUrl: string;
    instagramActive: boolean;
    tiktokUrl: string;
    tiktokActive: boolean;
    youtubeUrl: string;
    youtubeActive: boolean;
    currency: string;
    city: string;
    country: string;
  };
  feedback: any[];
}

function getDefaultDB(): StoreDB {
  return {
    products: [
      {
        id: 'draft_skate_01',
        name: 'STICKERS Skateboard',
        slug: 'stickers-skateboard',
        description: 'Deck de skate STICKERS® fabricado em maple canadiano de 7 camadas, concavidade média para street e skatepark.',
        category: 'skateboards',
        collection: 'new-drops',
        price: 0,
        images: [],
        colors: [{ name: 'Raw Maple / Black', hex: '#222222' }],
        sizes: ['8.0"', '8.25"'],
        stockByVariant: { '8.0"': 0, '8.25"': 0 },
        isPublished: false, // DRAFT as requested
        isFeatured: false,
        fabricFit: 'Madeira Canadiana 7-ply, concave médio, lixa não incluída.',
        deckDimensions: '8.0" x 31.75"',
        deckMaterial: '7-ply Canadian Hard Rock Maple',
        deckType: 'Street & Park Deck',
        brand: 'STICKERS®',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    config: {
      whatsappNumber: (process.env.VITE_WHATSAPP_NUMBER || '').replace(/\D/g, ''),
      careMessagePt: 'Olá STICKERS! Gostaria de confirmar a disponibilidade e saber como proceder com o pagamento por M-Pesa ou e-Mola.',
      careMessageEn: 'Hello STICKERS! I would like to verify item availability and proceed with payment via M-Pesa or e-Mola.',
      instagramUrl: 'https://www.instagram.com/lamar_rr67/',
      instagramActive: true,
      tiktokUrl: '',
      tiktokActive: false,
      youtubeUrl: '',
      youtubeActive: false,
      currency: 'MT',
      city: 'Maputo',
      country: 'Moçambique',
    },
    feedback: [],
  };
}

function readDB(): StoreDB {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading store database, using default:', err);
  }
  const defaultDb = getDefaultDB();
  writeDB(defaultDb);
  return defaultDb;
}

function writeDB(db: StoreDB): void {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing store database:', err);
  }
}

// Middleware
app.use(express.json({ limit: '15mb' }));

// Auth Verification Helper
function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Não autorizado. Sessão necessária.' });
    return;
  }
  const token = authHeader.split(' ')[1];
  const session = activeSessions.get(token);
  if (!session) {
    res.status(401).json({ error: 'Sessão inválida ou expirada.' });
    return;
  }
  // Check 2 hours expiration
  if (Date.now() - session.createdAt > 2 * 60 * 60 * 1000) {
    activeSessions.delete(token);
    res.status(401).json({ error: 'Sessão expirada. Autentique-se novamente.' });
    return;
  }
  next();
}

// ==================== AUTH API ====================
app.post('/api/studio/auth', (req: Request, res: Response) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();

  const attemptRecord = loginAttempts.get(ip) || { attempts: 0, lockUntil: 0 };
  if (attemptRecord.lockUntil > now) {
    const remainingSeconds = Math.ceil((attemptRecord.lockUntil - now) / 1000);
    res.status(429).json({
      error: `Demasiadas tentativas incorretas. Aguarde ${remainingSeconds} segundos antes de tentar novamente.`,
    });
    return;
  }

  const { password } = req.body;
  if (!password || typeof password !== 'string') {
    res.status(400).json({ error: 'Palavra-passe é obrigatória.' });
    return;
  }

  const inputHash = crypto.createHash('sha256').update(password.trim()).digest('hex');
  if (crypto.timingSafeEqual(Buffer.from(inputHash), Buffer.from(MASTER_CODE_HASH))) {
    loginAttempts.delete(ip);
    const token = crypto.randomBytes(32).toString('hex');
    activeSessions.set(token, { createdAt: now });
    res.json({
      success: true,
      token,
      expiresAt: now + 2 * 60 * 60 * 1000,
    });
    return;
  }

  // Failed attempt
  attemptRecord.attempts += 1;
  if (attemptRecord.attempts >= 5) {
    attemptRecord.lockUntil = now + 15 * 60 * 1000; // 15 mins lock
    attemptRecord.attempts = 0;
  }
  loginAttempts.set(ip, attemptRecord);

  res.status(401).json({ error: 'Palavra-passe incorreta.' });
});

app.get('/api/studio/verify', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.json({ authenticated: false });
    return;
  }
  const token = authHeader.split(' ')[1];
  const session = activeSessions.get(token);
  if (!session || Date.now() - session.createdAt > 2 * 60 * 60 * 1000) {
    if (session) activeSessions.delete(token);
    res.json({ authenticated: false });
    return;
  }
  res.json({ authenticated: true });
});

app.post('/api/studio/logout', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    activeSessions.delete(token);
  }
  res.json({ success: true });
});

// ==================== STORE DATA API ====================

// Public products (published only) OR all products if authenticated
app.get('/api/products', (req: Request, res: Response) => {
  const db = readDB();
  const authHeader = req.headers.authorization;
  const isOwner = authHeader && authHeader.startsWith('Bearer ') && activeSessions.has(authHeader.split(' ')[1]);

  if (isOwner && req.query.all === 'true') {
    res.json(db.products);
    return;
  }

  // Public: strictly published products only!
  const publishedOnly = db.products.filter((p) => p.isPublished === true);
  res.json(publishedOnly);
});

// Protected: Add product
app.post('/api/products', requireAuth, (req: Request, res: Response) => {
  const db = readDB();
  const productData = req.body;
  if (!productData.name) {
    res.status(400).json({ error: 'Nome do produto é obrigatório.' });
    return;
  }

  const newProduct = {
    ...productData,
    id: `prod_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    slug: productData.slug || productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.products.unshift(newProduct);
  writeDB(db);
  res.status(201).json(newProduct);
});

// Protected: Update product
app.put('/api/products/:id', requireAuth, (req: Request, res: Response) => {
  const db = readDB();
  const { id } = req.params;
  const index = db.products.findIndex((p) => p.id === id);
  if (index === -1) {
    res.status(404).json({ error: 'Produto não encontrado.' });
    return;
  }

  db.products[index] = {
    ...db.products[index],
    ...req.body,
    updatedAt: new Date().toISOString(),
  };

  writeDB(db);
  res.json(db.products[index]);
});

// Protected: Delete product
app.delete('/api/products/:id', requireAuth, (req: Request, res: Response) => {
  const db = readDB();
  const { id } = req.params;
  db.products = db.products.filter((p) => p.id !== id);
  writeDB(db);
  res.json({ success: true });
});

// Public: Get Store Config (social links, whatsapp, etc.)
app.get('/api/config', (req: Request, res: Response) => {
  const db = readDB();
  res.json(db.config);
});

// Protected: Update Store Config
app.put('/api/config', requireAuth, (req: Request, res: Response) => {
  const db = readDB();
  db.config = {
    ...db.config,
    ...req.body,
  };
  writeDB(db);
  res.json(db.config);
});

// Public: Submit Customer Feedback (with spam protection)
app.post('/api/feedback', (req: Request, res: Response) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();

  // Spam rate limit: max 5 per hour
  const timestamps = feedbackRateLimit.get(ip) || [];
  const validTimestamps = timestamps.filter((t) => now - t < 60 * 60 * 1000);
  if (validTimestamps.length >= 5) {
    res.status(429).json({ error: 'Limite de envio atingido. Aguarde antes de enviar nova mensagem.' });
    return;
  }

  const { name, email, category, message, honeypot } = req.body;

  // Bot honeypot check
  if (honeypot) {
    res.json({ success: true }); // Silently drop spam
    return;
  }

  if (!message || message.trim().length < 5) {
    res.status(400).json({ error: 'A mensagem de feedback é obrigatória e deve ter pelo menos 5 caracteres.' });
    return;
  }

  const db = readDB();
  const newFeedback = {
    id: `fb_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    name: (name || '').trim().slice(0, 100),
    email: (email || '').trim().slice(0, 120),
    category: (category || 'Sugestão').trim(),
    message: message.trim().slice(0, 1500),
    status: 'unread',
    createdAt: new Date().toISOString(),
  };

  db.feedback.unshift(newFeedback);
  writeDB(db);

  validTimestamps.push(now);
  feedbackRateLimit.set(ip, validTimestamps);

  res.status(201).json({ success: true, feedback: newFeedback });
});

// Protected: Get All Feedback
app.get('/api/feedback', requireAuth, (req: Request, res: Response) => {
  const db = readDB();
  res.json(db.feedback);
});

// Protected: Update Feedback Status (read, unread, archived)
app.put('/api/feedback/:id', requireAuth, (req: Request, res: Response) => {
  const db = readDB();
  const { id } = req.params;
  const index = db.feedback.findIndex((f) => f.id === id);
  if (index === -1) {
    res.status(404).json({ error: 'Mensagem não encontrada.' });
    return;
  }
  db.feedback[index] = {
    ...db.feedback[index],
    ...req.body,
  };
  writeDB(db);
  res.json(db.feedback[index]);
});

// Protected: Delete Feedback
app.delete('/api/feedback/:id', requireAuth, (req: Request, res: Response) => {
  const db = readDB();
  const { id } = req.params;
  db.feedback = db.feedback.filter((f) => f.id !== id);
  writeDB(db);
  res.json({ success: true });
});

// ==================== VITE DEVELOPMENT SERVER ====================
async function startServer() {
  const vite = await createViteServer({
    server: {
      middlewareMode: true,
      hmr: process.env.DISABLE_HMR !== 'true',
    },
    appType: 'spa',
  });

  app.use(vite.middlewares);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`STICKERS® Official Store & Studio Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
