import express from 'express';
import path from 'path';
import fs from 'fs';
import fileUpload from 'express-fileupload';

const app = express();
const PORT = process.env.PORT || 3001;

// Create upload directory if it doesn't exist
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Basic middleware
app.use(express.json());

// File upload middleware
app.use(fileUpload({
  createParentPath: true,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
  useTempFiles: true,
  tempFileDir: '/tmp/',
  debug: true
}));

// Enable CORS manually
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Serve uploaded files
app.use('/uploads', express.static(uploadDir));

// Health check
app.get('/health', (_, res) => res.json({ ok: true }));

// File upload endpoint
app.post('/api/v1/songs', (req, res) => {
  try {
    // Log the full request details
    console.log('Request headers:', req.headers);
    console.log('Request body:', req.body);
    console.log('Request files:', req.files);
    
    if (!req.files || !req.files.file) {
      console.log('No file uploaded');
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const file = req.files.file;
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = path.join(uploadDir, fileName);
    
    // Move the file
    file.mv(filePath, (err) => {
      if (err) {
        console.error('Error saving file:', err);
        return res.status(500).json({ error: 'Failed to save file' });
      }
      
      const response = {
        id: Date.now().toString(),
        name: file.name,
        url: `http://localhost:${PORT}/uploads/${fileName}`
      };
      
      console.log('File uploaded successfully:', response);
      res.status(201).json(response);
    });
  } catch (error) {
    console.error('Error handling upload:', error);
    res.status(500).json({ error: 'Failed to process request' });
  }
});

// Debug endpoint
app.get('/debug', (req, res) => {
  res.json({
    status: 'API is running',
    time: new Date().toISOString(),
    headers: req.headers,
    ip: req.ip
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`API running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`File uploads: http://localhost:${PORT}/api/v1/songs`);
  console.log(`Debug endpoint: http://localhost:${PORT}/debug`);
  console.log(`Uploads directory: ${uploadDir}`);
});