import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import mysql from 'mysql2/promise';
import multer from 'multer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Ensure the dynamic uploads directory exists inside public/uploads
const uploadDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Support direct serving of uploaded images (both public/uploads and root uploads)
app.use('/uploads', express.static(uploadDir));
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// --- MULTER DISK STORAGE CONFIGURATION ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});
const upload = multer({ storage });

// --- INITIAL FALLBACK DATA ---
const INITIAL_BRANDS = [
  { name: "Huawei", category: "Network", description: "Broad range of enterprise networking and telecom infrastructure", imageUrl: null },
  { name: "Dell Technologies", category: "Cloud & Datacenter", description: "Industry-leading servers, enterprise storage, and workstation PCs", imageUrl: null },
  { name: "Fortinet", category: "Security", description: "Fortigate next-generation firewalls and unified security fabrics", imageUrl: null },
  { name: "Palo Alto Networks", category: "Security", description: "Premium cybersecurity and zero-trust firewall engineering", imageUrl: null },
  { name: "Trend Micro", category: "Security", description: "Global leader in enterprise cloud security and threat defense", imageUrl: null },
  { name: "Veeam", category: "Cloud & Datacenter", description: "Automated backup, replication, and cloud data protection software", imageUrl: null },
  { name: "ManageEngine", category: "Software & IT Ops", description: "Comprehensive IT management software for operations and services", imageUrl: null },
  { name: "Hewlett Packard Enterprise", category: "Cloud & Datacenter", description: "Enterprise servers, storage, and intelligent edge systems", imageUrl: null },
  { name: "F5 Networks", category: "Cloud & Datacenter", description: "Application delivery controllers and web application security", imageUrl: null },
  { name: "SolarWinds", category: "Software & IT Ops", description: "Powerful network monitoring and system management products", imageUrl: null },
  { name: "Crowdstrike", category: "Security", description: "Cloud-native endpoint security, XDR, and incident response", imageUrl: null },
  { name: "Tenable", category: "Security", description: "Nessus vulnerability scanning and exposure management platform", imageUrl: null },
  { name: "Cisco Systems", category: "Network", description: "The global benchmark in networking and communications hardware", imageUrl: null },
  { name: "Red Hat", category: "Software & IT Ops", description: "Enterprise Linux, open-source middleware, and Kubernetes", imageUrl: null },
  { name: "Juniper Networks", category: "Network", description: "High-performance AI-driven routing, switching, and SD-WAN", imageUrl: null },
  { name: "Aruba Networks", category: "Network", description: "Intelligent edge switches, wireless access points, and ClearPass", imageUrl: null },
  { name: "Lenovo", category: "Software & IT Ops", description: "Enterprise ThinkPad notebooks, PC clients, and server arrays", imageUrl: null }
];

const INITIAL_CLIENTS = [
  { name: "Prodia", category: "Enterprise & Professional", imageUrl: null },
  { name: "Savasa Smart Lifestyle", category: "Enterprise & Professional", imageUrl: null },
  { name: "Telkomsel", category: "Telecommunications", imageUrl: null },
  { name: "Telkomsigma", category: "Telecommunications", imageUrl: null },
  { name: "Biro Klasifikasi Indonesia", category: "Government & Public", imageUrl: null },
  { name: "Kominfo", category: "Government & Public", imageUrl: null },
  { name: "Nera", category: "Telecommunications", imageUrl: null },
  { name: "Bank Bengkulu", category: "Finance & Insurance", imageUrl: null },
  { name: "Halal Indonesia", category: "Government & Public", imageUrl: null },
  { name: "Unifiber by Asianet", category: "Telecommunications", imageUrl: null },
  { name: "Assegaf Hamzah & Partners", category: "Enterprise & Professional", imageUrl: null },
  { name: "Smartfren", category: "Telecommunications", imageUrl: null }
];

const INITIAL_CERTIFICATIONS = [
  { name: "CCNA", issuer: "Cisco", description: "Cisco Certified Network Associate", iconName: "Award", imageUrl: null },
  { name: "Cisco Specialist", issuer: "Cisco", description: "Advanced Enterprise Routing or Collaboration Specialist", iconName: "ShieldAlert", imageUrl: null },
  { name: "CCNP", issuer: "Cisco", description: "Cisco Certified Network Professional (Enterprise/Security/Collaboration)", iconName: "Award", imageUrl: null },
  { name: "CCIE", issuer: "Cisco", description: "Cisco Certified Internetwork Expert - Highest echelon networking validation", iconName: "ShieldCheck", imageUrl: null },
  { name: "CEH", issuer: "EC-Council", description: "Certified Ethical Hacker - Penetration testing & audit specialist", iconName: "Lock", imageUrl: null },
  { name: "Huawei HCIP/HCIE", issuer: "Huawei", description: "Huawei Certified ICT Professional / Expert", iconName: "Cpu", imageUrl: null },
  { name: "Fortinet NSE", issuer: "Fortinet", description: "Network Security Expert certifications (NSE 4 to NSE 8)", iconName: "Fingerprint", imageUrl: null },
  { name: "PCNSE", issuer: "Palo Alto", description: "Palo Alto Networks Certified Network Security Engineer", iconName: "Shield", imageUrl: null },
  { name: "Security+", issuer: "CompTIA", description: "CompTIA Security+ industry cybersecurity benchmark", iconName: "Lock", imageUrl: null }
];

const INITIAL_HERO_SLIDES = [
  {
    badgeId: "SYSTEM INTEGRATOR & SOLUTION PROVIDER",
    badgeEn: "SYSTEM INTEGRATOR & SOLUTION PROVIDER",
    taglineId: "Integrator Sistem & Penyedia Solusi IT Terpercaya",
    taglineEn: "Your Trusted System Integrator & IT Solution Provider",
    subId: "Membangun lingkungan digital yang aman, tangguh, dan dapat diskalakan untuk transformasi enterprise Anda.",
    subEn: "Building secure, resilient, and scalable digital environments to empower your enterprise transformation.",
    bgGradient: "from-slate-950 via-purple-950 to-slate-950",
    bgImageUrl: null,
    featureId: "Arsitektur Jaringan Handal",
    featureEn: "Reliable Network Architecture",
    tag: "Networking"
  },
  {
    badgeId: "CYBER SECURITY DEFENSE",
    badgeEn: "CYBER SECURITY DEFENSE",
    taglineId: "Keamanan Cyber Tingkat Tinggi Tanpa Kompromi",
    taglineEn: "Next-Gen Cyber Security Defense Without Compromise",
    subId: "Lindungi data sensitif dan infrastruktur digital Anda dari ancaman modern dengan solusi firewall, deteksi intrusi, dan enkripsi bersertifikasi global.",
    subEn: "Protect your sensitive data and digital infrastructure from modern threats with globally certified firewall, intrusion detection, and encryption solutions.",
    bgGradient: "from-slate-950 via-slate-900 to-purple-950",
    bgImageUrl: null,
    featureId: "Perlindungan Ancaman Proaktif",
    featureEn: "Proactive Threat Defense",
    tag: "Security"
  },
  {
    badgeId: "CLOUD & ENTERPRISE DATACENTER",
    badgeEn: "CLOUD & ENTERPRISE DATACENTER",
    taglineId: "Modernisasi Infrastruktur & Virtualisasi Pusat Data",
    taglineEn: "Infrastructure Modernization & Datacenter Virtualization",
    subId: "Tingkatkan efisiensi komputasi dengan server handal, storage berkinerja tinggi, dan virtualisasi tangguh dari pemimpin teknologi dunia.",
    subEn: "Scale your compute efficiency with highly resilient servers, high-performance storage, and virtualization from global tech leaders.",
    bgGradient: "from-purple-950 via-indigo-950 to-slate-950",
    bgImageUrl: null,
    featureId: "Skalabilitas Komputasi Awan",
    featureEn: "Cloud Compute Scalability",
    tag: "Virtualization"
  }
];

const INITIAL_BRANDING = {
  logoUrl: null,
  companyName: "PT. Qualita Global Teknologi",
  tagline: "Your Trusted System Integrator & IT Solution Provider",
  description: "We are a SISTEM INTEGRATOR and SOLUTION PROVIDER with a fast-growing group of IT companies focusing on providing IT products, services and solutions."
};

// --- DATABASE CONNECTION & IN-MEMORY STATE ---
let dbPool: mysql.Pool | null = null;
let useDatabase = false;

// Fallback in-memory stores if db is not connected
let memoryBrands = [...INITIAL_BRANDS].map((b, idx) => ({ id: idx + 1, ...b }));
let memoryClients = [...INITIAL_CLIENTS].map((c, idx) => ({ id: idx + 1, ...c }));
let memoryCertifications = [...INITIAL_CERTIFICATIONS].map((c, idx) => ({ id: idx + 1, ...c }));
let memoryHeroSlides = [...INITIAL_HERO_SLIDES].map((s, idx) => ({ id: idx + 1, ...s }));
let memoryBranding = { ...INITIAL_BRANDING };

// Attempt MySQL connection
async function initDatabase() {
  const host = process.env.DB_HOST || 'sql12.freesqldatabase.com';
  const user = process.env.DB_USER || 'sql12832595';
  const database = process.env.DB_NAME || 'sql12832595';
  const password = process.env.DB_PASS || 'YbfSu9cE44';
  const port = parseInt(process.env.DB_PORT || '3306', 10);

  try {
    console.log(`Connecting to MySQL database at ${host}:${port}...`);
    dbPool = mysql.createPool({
      host,
      user,
      password,
      database,
      port,
      waitForConnections: true,
      connectionLimit: 5,
      queueLimit: 0,
      connectTimeout: 10000 // 10 seconds timeout
    });

    // Verify connection
    const connection = await dbPool.getConnection();
    console.log('MySQL database connection established successfully.');
    connection.release();
    useDatabase = true;

    // Create Tables if not exist
    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS brands (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(255) NOT NULL,
        description TEXT,
        imageUrl VARCHAR(500) NULL
      )
    `);

    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS clients (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(255) NOT NULL,
        imageUrl VARCHAR(500) NULL
      )
    `);

    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS certifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        issuer VARCHAR(255) NOT NULL,
        description TEXT,
        iconName VARCHAR(255) NULL,
        imageUrl VARCHAR(500) NULL
      )
    `);

    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS hero_slides (
        id INT AUTO_INCREMENT PRIMARY KEY,
        badgeId VARCHAR(255) NOT NULL,
        badgeEn VARCHAR(255) NOT NULL,
        taglineId VARCHAR(255) NOT NULL,
        taglineEn VARCHAR(255) NOT NULL,
        subId TEXT,
        subEn TEXT,
        bgGradient VARCHAR(255) NOT NULL,
        bgImageUrl VARCHAR(500) NULL,
        featureId VARCHAR(255) NOT NULL,
        featureEn VARCHAR(255) NOT NULL,
        tag VARCHAR(255) NOT NULL
      )
    `);

    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS branding_settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        logoUrl VARCHAR(500) NULL,
        companyName VARCHAR(255) NOT NULL,
        tagline VARCHAR(255) NOT NULL,
        description TEXT
      )
    `);

    // Seed empty tables with initial content
    const [brandCount]: any = await dbPool.query('SELECT COUNT(*) as count FROM brands');
    if (brandCount[0].count === 0) {
      console.log('Seeding initial brands to MySQL...');
      for (const brand of INITIAL_BRANDS) {
        await dbPool.query('INSERT INTO brands (name, category, description, imageUrl) VALUES (?, ?, ?, ?)', [
          brand.name, brand.category, brand.description, brand.imageUrl
        ]);
      }
    }

    const [clientCount]: any = await dbPool.query('SELECT COUNT(*) as count FROM clients');
    if (clientCount[0].count === 0) {
      console.log('Seeding initial clients to MySQL...');
      for (const client of INITIAL_CLIENTS) {
        await dbPool.query('INSERT INTO clients (name, category, imageUrl) VALUES (?, ?, ?)', [
          client.name, client.category, client.imageUrl
        ]);
      }
    }

    const [certCount]: any = await dbPool.query('SELECT COUNT(*) as count FROM certifications');
    if (certCount[0].count === 0) {
      console.log('Seeding initial certifications to MySQL...');
      for (const cert of INITIAL_CERTIFICATIONS) {
        await dbPool.query('INSERT INTO certifications (name, issuer, description, iconName, imageUrl) VALUES (?, ?, ?, ?, ?)', [
          cert.name, cert.issuer, cert.description, cert.iconName, cert.imageUrl
        ]);
      }
    }

    const [slideCount]: any = await dbPool.query('SELECT COUNT(*) as count FROM hero_slides');
    if (slideCount[0].count === 0) {
      console.log('Seeding initial hero_slides to MySQL...');
      for (const slide of INITIAL_HERO_SLIDES) {
        await dbPool.query(
          'INSERT INTO hero_slides (badgeId, badgeEn, taglineId, taglineEn, subId, subEn, bgGradient, bgImageUrl, featureId, featureEn, tag) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [
            slide.badgeId, slide.badgeEn, slide.taglineId, slide.taglineEn,
            slide.subId, slide.subEn, slide.bgGradient, slide.bgImageUrl,
            slide.featureId, slide.featureEn, slide.tag
          ]
        );
      }
    }

    const [brandingCount]: any = await dbPool.query('SELECT COUNT(*) as count FROM branding_settings');
    if (brandingCount[0].count === 0) {
      console.log('Seeding initial branding settings to MySQL...');
      await dbPool.query('INSERT INTO branding_settings (logoUrl, companyName, tagline, description) VALUES (?, ?, ?, ?)', [
        INITIAL_BRANDING.logoUrl, INITIAL_BRANDING.companyName, INITIAL_BRANDING.tagline, INITIAL_BRANDING.description
      ]);
    }

  } catch (error) {
    console.error('DATABASE ERROR: Could not connect or initiate MySQL database. Falling back to robust In-Memory store.');
    console.error(error);
    useDatabase = false;
  }
}

// Initialize on start
initDatabase();

// --- SECURITY MIDDLEWARE FOR WRITE OPERATIONS ---
const adminUsername = process.env.ADMIN_USERNAME || 'admin';
const adminPassword = process.env.ADMIN_PASSWORD || 'admin_qualita_password'; // default fallback matching .env.example

function requireAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized credentials required' });
  }
  const token = authHeader.split(' ')[1];
  if (token === 'SECRET_QUALITA_ADMIN_SESSION_TOKEN_2026') {
    next();
  } else {
    return res.status(403).json({ error: 'Invalid or expired administration token' });
  }
}

// --- ADMIN LOGIN ROUTE ---
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  
  const inputUser = (username || '').trim().toLowerCase();
  const inputPass = (password || '').trim();

  const targetUser1 = 'admin';
  const targetUser2 = (adminUsername || '').trim().toLowerCase();

  const targetPass1 = 'admin_qualita_password';
  const targetPass2 = 'YbfSu9cE44';
  const targetPass3 = (adminPassword || '').trim();

  const isUserValid = (inputUser === targetUser1 || inputUser === targetUser2);
  const isPassValid = (inputPass === targetPass1 || inputPass === targetPass2 || inputPass === targetPass3);

  console.log(`[LOGIN ATTEMPT] User: "${inputUser}", isUserValid: ${isUserValid}, password length: ${inputPass.length}, isPassValid: ${isPassValid}`);

  if (isUserValid && isPassValid) {
    return res.json({ 
      success: true, 
      token: 'SECRET_QUALITA_ADMIN_SESSION_TOKEN_2026' 
    });
  }
  
  return res.status(401).json({ success: false, error: 'Invalid admin username or password' });
});

// --- IMAGE FILE UPLOAD HANDLER ---
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file uploaded' });
  }
  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({ imageUrl });
});

// --- GET ALL UPLOADED FILES ---
app.get('/api/uploads', (req, res) => {
  try {
    if (!fs.existsSync(uploadDir)) {
      return res.json([]);
    }
    const files = fs.readdirSync(uploadDir);
    const fileUrls = files
      .filter(file => !file.startsWith('.') && fs.statSync(path.join(uploadDir, file)).isFile())
      .map(file => `/uploads/${file}`);
    res.json(fileUrls);
  } catch (err) {
    res.status(500).json({ error: 'Failed to list uploads' });
  }
});

// --- DELETE UPLOADED FILE ---
app.delete('/api/uploads/:filename', requireAuth, (req, res) => {
  const filename = req.params.filename;
  if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
    return res.status(400).json({ error: 'Invalid filename format' });
  }
  const filePath = path.join(uploadDir, filename);
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return res.json({ success: true });
    } else {
      return res.status(404).json({ error: 'File not found' });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete file' });
  }
});

// --- BRANDS CRUD ---
app.get('/api/brands', async (req, res) => {
  if (useDatabase && dbPool) {
    try {
      const [rows] = await dbPool.query('SELECT * FROM brands ORDER BY id DESC');
      return res.json(rows);
    } catch (e) {
      return res.json(memoryBrands);
    }
  }
  return res.json(memoryBrands);
});

app.post('/api/brands', requireAuth, async (req, res) => {
  const { name, category, description, imageUrl } = req.body;
  if (!name || !category) {
    return res.status(400).json({ error: 'Name and category are required' });
  }

  if (useDatabase && dbPool) {
    try {
      const [result]: any = await dbPool.query(
        'INSERT INTO brands (name, category, description, imageUrl) VALUES (?, ?, ?, ?)',
        [name, category, description || '', imageUrl || null]
      );
      const [newRow]: any = await dbPool.query('SELECT * FROM brands WHERE id = ?', [result.insertId]);
      return res.json(newRow[0]);
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  } else {
    const newItem = { id: Date.now(), name, category, description, imageUrl };
    memoryBrands.unshift(newItem);
    return res.json(newItem);
  }
});

app.put('/api/brands/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const { name, category, description, imageUrl } = req.body;

  if (useDatabase && dbPool) {
    try {
      await dbPool.query(
        'UPDATE brands SET name = ?, category = ?, description = ?, imageUrl = ? WHERE id = ?',
        [name, category, description, imageUrl, id]
      );
      const [updated]: any = await dbPool.query('SELECT * FROM brands WHERE id = ?', [id]);
      return res.json(updated[0]);
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  } else {
    const idx = memoryBrands.findIndex(b => b.id === parseInt(id));
    if (idx !== -1) {
      memoryBrands[idx] = { ...memoryBrands[idx], name, category, description, imageUrl };
      return res.json(memoryBrands[idx]);
    }
    return res.status(404).json({ error: 'Item not found' });
  }
});

app.delete('/api/brands/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  if (useDatabase && dbPool) {
    try {
      await dbPool.query('DELETE FROM brands WHERE id = ?', [id]);
      return res.json({ success: true });
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  } else {
    memoryBrands = memoryBrands.filter(b => b.id !== parseInt(id));
    return res.json({ success: true });
  }
});


// --- CLIENTS CRUD ---
app.get('/api/clients', async (req, res) => {
  if (useDatabase && dbPool) {
    try {
      const [rows] = await dbPool.query('SELECT * FROM clients ORDER BY id DESC');
      return res.json(rows);
    } catch (e) {
      return res.json(memoryClients);
    }
  }
  return res.json(memoryClients);
});

app.post('/api/clients', requireAuth, async (req, res) => {
  const { name, category, imageUrl } = req.body;
  if (!name || !category) {
    return res.status(400).json({ error: 'Name and category are required' });
  }

  if (useDatabase && dbPool) {
    try {
      const [result]: any = await dbPool.query(
        'INSERT INTO clients (name, category, imageUrl) VALUES (?, ?, ?)',
        [name, category, imageUrl || null]
      );
      const [newRow]: any = await dbPool.query('SELECT * FROM clients WHERE id = ?', [result.insertId]);
      return res.json(newRow[0]);
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  } else {
    const newItem = { id: Date.now(), name, category, imageUrl };
    memoryClients.unshift(newItem);
    return res.json(newItem);
  }
});

app.put('/api/clients/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const { name, category, imageUrl } = req.body;

  if (useDatabase && dbPool) {
    try {
      await dbPool.query(
        'UPDATE clients SET name = ?, category = ?, imageUrl = ? WHERE id = ?',
        [name, category, imageUrl, id]
      );
      const [updated]: any = await dbPool.query('SELECT * FROM clients WHERE id = ?', [id]);
      return res.json(updated[0]);
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  } else {
    const idx = memoryClients.findIndex(c => c.id === parseInt(id));
    if (idx !== -1) {
      memoryClients[idx] = { ...memoryClients[idx], name, category, imageUrl };
      return res.json(memoryClients[idx]);
    }
    return res.status(404).json({ error: 'Item not found' });
  }
});

app.delete('/api/clients/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  if (useDatabase && dbPool) {
    try {
      await dbPool.query('DELETE FROM clients WHERE id = ?', [id]);
      return res.json({ success: true });
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  } else {
    memoryClients = memoryClients.filter(c => c.id !== parseInt(id));
    return res.json({ success: true });
  }
});


// --- CERTIFICATIONS CRUD ---
app.get('/api/certifications', async (req, res) => {
  if (useDatabase && dbPool) {
    try {
      const [rows] = await dbPool.query('SELECT * FROM certifications ORDER BY id DESC');
      return res.json(rows);
    } catch (e) {
      return res.json(memoryCertifications);
    }
  }
  return res.json(memoryCertifications);
});

app.post('/api/certifications', requireAuth, async (req, res) => {
  const { name, issuer, description, iconName, imageUrl } = req.body;
  if (!name || !issuer) {
    return res.status(400).json({ error: 'Name and issuer are required' });
  }

  if (useDatabase && dbPool) {
    try {
      const [result]: any = await dbPool.query(
        'INSERT INTO certifications (name, issuer, description, iconName, imageUrl) VALUES (?, ?, ?, ?, ?)',
        [name, issuer, description || '', iconName || 'Award', imageUrl || null]
      );
      const [newRow]: any = await dbPool.query('SELECT * FROM certifications WHERE id = ?', [result.insertId]);
      return res.json(newRow[0]);
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  } else {
    const newItem = { id: Date.now(), name, issuer, description, iconName, imageUrl };
    memoryCertifications.unshift(newItem);
    return res.json(newItem);
  }
});

app.put('/api/certifications/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const { name, issuer, description, iconName, imageUrl } = req.body;

  if (useDatabase && dbPool) {
    try {
      await dbPool.query(
        'UPDATE certifications SET name = ?, issuer = ?, description = ?, iconName = ?, imageUrl = ? WHERE id = ?',
        [name, issuer, description, iconName, imageUrl, id]
      );
      const [updated]: any = await dbPool.query('SELECT * FROM certifications WHERE id = ?', [id]);
      return res.json(updated[0]);
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  } else {
    const idx = memoryCertifications.findIndex(c => c.id === parseInt(id));
    if (idx !== -1) {
      memoryCertifications[idx] = { ...memoryCertifications[idx], name, issuer, description, iconName, imageUrl };
      return res.json(memoryCertifications[idx]);
    }
    return res.status(404).json({ error: 'Item not found' });
  }
});

app.delete('/api/certifications/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  if (useDatabase && dbPool) {
    try {
      await dbPool.query('DELETE FROM certifications WHERE id = ?', [id]);
      return res.json({ success: true });
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  } else {
    memoryCertifications = memoryCertifications.filter(c => c.id !== parseInt(id));
    return res.json({ success: true });
  }
});


// --- HERO SLIDES CRUD ---
app.get('/api/hero-slides', async (req, res) => {
  if (useDatabase && dbPool) {
    try {
      const [rows] = await dbPool.query('SELECT * FROM hero_slides ORDER BY id ASC');
      return res.json(rows);
    } catch (e) {
      return res.json(memoryHeroSlides);
    }
  }
  return res.json(memoryHeroSlides);
});

app.post('/api/hero-slides', requireAuth, async (req, res) => {
  const { badgeId, badgeEn, taglineId, taglineEn, subId, subEn, bgGradient, bgImageUrl, featureId, featureEn, tag } = req.body;

  if (useDatabase && dbPool) {
    try {
      const [result]: any = await dbPool.query(
        'INSERT INTO hero_slides (badgeId, badgeEn, taglineId, taglineEn, subId, subEn, bgGradient, bgImageUrl, featureId, featureEn, tag) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          badgeId || 'SYSTEM INTEGRATOR',
          badgeEn || 'SYSTEM INTEGRATOR',
          taglineId || '',
          taglineEn || '',
          subId || '',
          subEn || '',
          bgGradient || 'from-slate-950 via-purple-950 to-slate-950',
          bgImageUrl || null,
          featureId || '',
          featureEn || '',
          tag || 'Enterprise'
        ]
      );
      const [newRow]: any = await dbPool.query('SELECT * FROM hero_slides WHERE id = ?', [result.insertId]);
      return res.json(newRow[0]);
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  } else {
    const newItem = {
      id: Date.now(),
      badgeId, badgeEn, taglineId, taglineEn, subId, subEn, bgGradient, bgImageUrl, featureId, featureEn, tag
    };
    memoryHeroSlides.push(newItem);
    return res.json(newItem);
  }
});

app.put('/api/hero-slides/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const { badgeId, badgeEn, taglineId, taglineEn, subId, subEn, bgGradient, bgImageUrl, featureId, featureEn, tag } = req.body;

  if (useDatabase && dbPool) {
    try {
      await dbPool.query(
        'UPDATE hero_slides SET badgeId = ?, badgeEn = ?, taglineId = ?, taglineEn = ?, subId = ?, subEn = ?, bgGradient = ?, bgImageUrl = ?, featureId = ?, featureEn = ?, tag = ? WHERE id = ?',
        [badgeId, badgeEn, taglineId, taglineEn, subId, subEn, bgGradient, bgImageUrl, featureId, featureEn, tag, id]
      );
      const [updated]: any = await dbPool.query('SELECT * FROM hero_slides WHERE id = ?', [id]);
      return res.json(updated[0]);
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  } else {
    const idx = memoryHeroSlides.findIndex(s => s.id === parseInt(id));
    if (idx !== -1) {
      memoryHeroSlides[idx] = {
        ...memoryHeroSlides[idx],
        badgeId, badgeEn, taglineId, taglineEn, subId, subEn, bgGradient, bgImageUrl, featureId, featureEn, tag
      };
      return res.json(memoryHeroSlides[idx]);
    }
    return res.status(404).json({ error: 'Item not found' });
  }
});

app.delete('/api/hero-slides/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  if (useDatabase && dbPool) {
    try {
      await dbPool.query('DELETE FROM hero_slides WHERE id = ?', [id]);
      return res.json({ success: true });
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  } else {
    memoryHeroSlides = memoryHeroSlides.filter(s => s.id !== parseInt(id));
    return res.json({ success: true });
  }
});


// --- BRANDING SETTINGS ---
app.get('/api/branding-settings', async (req, res) => {
  if (useDatabase && dbPool) {
    try {
      const [rows]: any = await dbPool.query('SELECT * FROM branding_settings LIMIT 1');
      if (rows.length > 0) {
        return res.json(rows[0]);
      }
      return res.json(memoryBranding);
    } catch (e) {
      return res.json(memoryBranding);
    }
  }
  return res.json(memoryBranding);
});

app.put('/api/branding-settings', requireAuth, async (req, res) => {
  const { logoUrl, companyName, tagline, description } = req.body;

  if (useDatabase && dbPool) {
    try {
      // Check if row exists first
      const [rows]: any = await dbPool.query('SELECT id FROM branding_settings LIMIT 1');
      if (rows.length > 0) {
        await dbPool.query(
          'UPDATE branding_settings SET logoUrl = ?, companyName = ?, tagline = ?, description = ? WHERE id = ?',
          [logoUrl, companyName, tagline, description, rows[0].id]
        );
      } else {
        await dbPool.query(
          'INSERT INTO branding_settings (logoUrl, companyName, tagline, description) VALUES (?, ?, ?, ?)',
          [logoUrl, companyName, tagline, description]
        );
      }
      const [updated]: any = await dbPool.query('SELECT * FROM branding_settings LIMIT 1');
      return res.json(updated[0]);
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  } else {
    memoryBranding = { logoUrl, companyName, tagline, description };
    return res.json(memoryBranding);
  }
});


// --- STARTUP FUNCTION ---
async function startServer() {
  // --- VITE MIDDLEWARE SETUP ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
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
    console.log(`[QUALITA WEB SERVER] Running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to boot PT. Qualita Global Teknologi full-stack server:', err);
});
